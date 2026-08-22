// ===== LIVE_API.JS — Fenerbahçe Real-Time Live Score API =====

const LiveFootballAPI = {
  _cachedData: null,
  _cacheTimestamp: 0,
  CACHE_TTL_MS: 30000, // 30s TTL cache

  _normalize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  },

  _isFenerbahce(competitorObj) {
    if (!competitorObj) return false;
    const team = competitorObj.team || {};
    const id = String(team.id || '');
    if (id === '436') return true;

    const names = [
      this._normalize(team.displayName),
      this._normalize(team.name),
      this._normalize(team.shortDisplayName),
      this._normalize(team.location),
      this._normalize(team.abbreviation)
    ];

    return names.some(n => 
      n.includes('fenerbahce') || 
      n === 'fb' || 
      n === 'fen' || 
      n === 'fener'
    );
  },

  _extractGoals(competitorObj) {
    const goals = [];

    // Path 1: details[] with type = "Goal"
    const details = competitorObj?.details || [];
    for (const d of details) {
      const typeText = (d.type?.text || d.type?.name || "").toLowerCase();
      if (typeText.includes("goal")) {
        const name = d.athletesInvolved?.[0]?.displayName || d.athlete?.displayName || d.athlete?.shortName || d.athleteName || null;
        const clock = d.clock?.displayValue || d.clock?.value || "";
        if (name) goals.push(`${name}${clock ? ` (${clock}')` : ""}`);
      }
    }

    // Path 2: statistics[] with name containing "goal"
    const stats = competitorObj?.statistics || [];
    for (const s of stats) {
      if ((s.name || "").toLowerCase().includes("goal")) {
        const athleteName = s.athlete?.displayName || s.label || null;
        if (athleteName && !goals.includes(athleteName)) {
          goals.push(athleteName);
        }
      }
    }

    // Path 3: linescores[] with scorer metadata
    const linescores = competitorObj?.linescores || [];
    for (const ls of linescores) {
      const scorer = ls.scorer || ls.scorerName || null;
      if (scorer && !goals.includes(scorer)) {
        goals.push(scorer);
      }
    }

    return goals;
  },

  /**
   * Fetches real-time live score for Fenerbahçe from ESPN feeds or Supabase live override
   */
  async fetchLiveMatch(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this._cachedData && (now - this._cacheTimestamp < this.CACHE_TTL_MS)) {
      return this._cachedData;
    }

    // 1. Supabase Custom / Live Override Check
    try {
      if (window.supabaseClient) {
        const { data } = await window.supabaseClient
          .from('site_settings')
          .select('value')
          .eq('key', 'oyp_fb_live_custom_data')
          .maybeSingle();

        if (data && data.value) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (parsed && (parsed.isLive || parsed.forceActive)) {
            this._cachedData = parsed;
            this._cacheTimestamp = now;
            return parsed;
          }
        }
      }
    } catch (_) {}

    // 2. ESPN Live Feeds
    try {
      const endpoints = [
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard", league: "tur.1" },
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard", league: "uefa.champions" },
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard", league: "uefa.europa" },
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa.conf/scoreboard", league: "uefa.europa.conf" },
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/club.friendly/scoreboard", league: "club.friendly" },
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/teams/436/schedule", league: "tur.1" },
        { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/teams/436/schedule", league: "uefa.champions" }
      ];

      for (const { url, league } of endpoints) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (!data.events || !Array.isArray(data.events)) continue;

          for (const event of data.events) {
            const comp = event.competitions?.[0];
            if (!comp) continue;

            const competitors = comp.competitors || [];
            const fbTeam = competitors.find(c => this._isFenerbahce(c));
            if (!fbTeam) continue;

            const statusType = comp.status?.type || {};
            const state = (statusType.state || "").toLowerCase();
            const statusName = statusType.name || "";

            const isLive = ["in", "in_progress", "halftime", "live"].includes(state) ||
                           ["STATUS_IN_PROGRESS", "STATUS_HALFTIME"].includes(statusName);

            const isHalftime = state === "halftime" || statusName === "STATUS_HALFTIME";

            const homeComp = competitors.find(c => c.homeAway === "home") || competitors[0];
            const awayComp = competitors.find(c => c.homeAway === "away") || competitors[1];

            const homeName = homeComp?.team?.shortDisplayName || homeComp?.team?.name || "Ev Sahibi";
            const awayName = awayComp?.team?.shortDisplayName || awayComp?.team?.name || "Deplasman";

            const isFbHome = this._isFenerbahce(homeComp);

            let goalsHome = this._extractGoals(homeComp);
            let goalsAway = this._extractGoals(awayComp);

            // Summary lookup if goals array empty
            if (goalsHome.length === 0 && goalsAway.length === 0 && event.id) {
              try {
                const summaryUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${event.id}`;
                const sr = await fetch(summaryUrl);
                if (sr.ok) {
                  const sd = await sr.json();
                  const scoringPlays = sd.scoringPlays || sd.keyPlays || [];
                  const homeTeamId = homeComp?.team?.id || "";

                  for (const play of scoringPlays) {
                    const typeText = (play.type?.text || play.type?.abbreviation || "").toLowerCase();
                    if (!typeText.includes("goal")) continue;

                    const scorer =
                      play.athletesInvolved?.[0]?.displayName ||
                      play.athletes?.[0]?.athlete?.displayName ||
                      play.athlete?.displayName ||
                      play.scorerName || null;

                    const clock = play.clock?.displayValue || play.period?.displayValue || "";
                    const teamId = play.team?.id || "";
                    if (!scorer) continue;

                    const entry = `${scorer}${clock ? ` (${clock}')` : ""}`;
                    if (teamId && teamId === homeTeamId) {
                      if (!goalsHome.includes(entry)) goalsHome.push(entry);
                    } else {
                      if (!goalsAway.includes(entry)) goalsAway.push(entry);
                    }
                  }
                }
              } catch (_) {}
            }
            
            let displayMinute = comp.status?.displayClock || (isLive ? "1'" : "0'");
            if (isHalftime) displayMinute = "İY";

            const result = {
              isLive,
              isFinished: state === "post" || statusName === "STATUS_FULL_TIME",
              statusDescription: statusType.shortDetail || statusType.description || (isLive ? "CANLI" : "Maç Yok"),
              minute: displayMinute,
              home: isFbHome ? "Fenerbahçe" : homeName,
              homeIcon: isFbHome ? "💛💙" : "🔴⚫",
              homeShort: isFbHome ? "FB" : homeName.substring(0, 3).toUpperCase(),
              away: !isFbHome ? "Fenerbahçe" : awayName,
              awayIcon: !isFbHome ? "💛💙" : "🔴🟡",
              awayShort: !isFbHome ? "FB" : awayName.substring(0, 3).toUpperCase(),
              scoreHome: homeComp?.score !== undefined ? String(homeComp.score) : "0",
              scoreAway: awayComp?.score !== undefined ? String(awayComp.score) : "0",
              league: event.season?.displayName || data.leagues?.[0]?.name || "Trendyol Süper Lig",
              stadium: comp.venue?.fullName || comp.venue?.displayName || "Ülker Stadyumu",
              goalsHome,
              goalsAway
            };

            this._cachedData = result;
            this._cacheTimestamp = Date.now();
            return result;
          }
        } catch (_) {}
      }

      return null;
    } catch (err) {
      console.warn("Live score API fetch error:", err);
      return null;
    }
  }
};

window.LiveFootballAPI = LiveFootballAPI;
