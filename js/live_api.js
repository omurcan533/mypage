// ===== LIVE_API.JS — Fenerbahçe Real-Time Live Score API =====

const LiveFootballAPI = {
  ESPN_SUPERLIG_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard",
  ESPN_UCL_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard",
  ESPN_UEL_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard",
  ESPN_UECL_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa.conf/scoreboard",

  _cachedData: null,
  _cacheTimestamp: 0,
  CACHE_TTL_MS: 30000, // 30s TTL cache

  /**
   * Extracts goal scorer names from multiple ESPN API response paths:
   * 1) competitor.details (in-game event list)
   * 2) competitor.statistics (aggregated stats)
   * 3) competitor.linescores (period-by-period with scorer)
   */
  _extractGoals(competitorObj) {
    const goals = [];

    // Path 1: details[] with type = "Goal"
    const details = competitorObj?.details || [];
    for (const d of details) {
      const typeText = (d.type?.text || d.type?.name || "").toLowerCase();
      if (typeText.includes("goal")) {
        const name = d.athlete?.displayName || d.athlete?.shortName || d.athleteName || null;
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
   * Fetches real-time live score for Fenerbahçe from ESPN sports feeds.
   * When the basic scoreboard API doesn't include goal scorers,
   * falls back to the ESPN summary endpoint (scoringPlays / keyPlays).
   */
  async fetchLiveMatch(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this._cachedData && (now - this._cacheTimestamp < this.CACHE_TTL_MS)) {
      return this._cachedData;
    }

    try {
      const endpoints = [
        { url: this.ESPN_SUPERLIG_URL, league: "tur.1" },
        { url: this.ESPN_UCL_URL,      league: "uefa.champions" },
        { url: this.ESPN_UEL_URL,      league: "uefa.europa" },
        { url: this.ESPN_UECL_URL,     league: "uefa.europa.conf" }
      ];

      for (const { url, league } of endpoints) {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (!data.events || !Array.isArray(data.events)) continue;

        for (const event of data.events) {
          const comp = event.competitions?.[0];
          if (!comp) continue;

          const competitors = comp.competitors || [];

          // Detect Fenerbahçe — check displayName, name, or abbreviation "FEN"
          const fbTeam = competitors.find(c =>
            (c.team?.displayName || "").toLowerCase().includes("fenerbahce") ||
            (c.team?.name || "").toLowerCase().includes("fenerbahce") ||
            (c.team?.abbreviation || "").toLowerCase() === "fen"
          );
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

          const isFbHome =
            (homeName || "").toLowerCase().includes("fenerbahce") ||
            (homeComp?.team?.abbreviation || "").toLowerCase() === "fen";

          // Extract goals from basic scoreboard data
          let goalsHome = this._extractGoals(homeComp);
          let goalsAway = this._extractGoals(awayComp);

          // If no goals found yet, try the ESPN summary/play-by-play endpoint
          if (goalsHome.length === 0 && goalsAway.length === 0 && event.id) {
            try {
              const summaryUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/summary?event=${event.id}`;
              const sr = await fetch(summaryUrl);
              if (sr.ok) {
                const sd = await sr.json();
                // scoringPlays or keyPlays contain goal events with scorer info
                const scoringPlays = sd.scoringPlays || sd.keyPlays || [];
                const homeTeamId = homeComp?.team?.id || "";

                for (const play of scoringPlays) {
                  const typeText = (play.type?.text || play.type?.abbreviation || "").toLowerCase();
                  if (!typeText.includes("goal")) continue;

                  const scorer =
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
            } catch (_) { /* summary endpoint optional */ }
          }
          
          let displayMinute = comp.status?.displayClock || (isLive ? "1'" : "0'");
          if (isHalftime) displayMinute = "İY";

          const result = {
            isLive,
            statusDescription: statusType.shortDetail || statusType.description || (isLive ? "CANLI" : "Maç Yok"),
            minute: displayMinute,
            home: isFbHome ? "Fenerbahçe" : homeName,
            homeIcon: isFbHome ? "💛💙" : "🔴⚫",
            homeShort: isFbHome ? "FB" : homeName.substring(0, 3).toUpperCase(),
            away: (!isFbHome && (
              awayName.toLowerCase().includes("fenerbahce") ||
              (awayComp?.team?.abbreviation || "").toLowerCase() === "fen"
            )) ? "Fenerbahçe" : awayName,
            awayIcon: !isFbHome ? "💛💙" : "🔴🟡",
            awayShort: !isFbHome ? "FB" : awayName.substring(0, 3).toUpperCase(),
            scoreHome: homeComp?.score || "0",
            scoreAway: awayComp?.score || "0",
            league: event.season?.displayName || data.leagues?.[0]?.name || "Trendyol Süper Lig",
            stadium: comp.venue?.fullName || "Ülker Stadyumu",
            goalsHome,
            goalsAway
          };

          this._cachedData = result;
          this._cacheTimestamp = Date.now();
          return result;
        }
      }

      return null;
    } catch (err) {
      console.warn("Live score API fetch error:", err);
      return null;
    }
  }
};
window.LiveFootballAPI = LiveFootballAPI;
