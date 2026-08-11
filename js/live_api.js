// ===== LIVE_API.JS — Fenerbahçe Real-Time Live Score API =====

const LiveFootballAPI = {
  ESPN_SUPERLIG_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard",
  ESPN_UCL_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard",
  ESPN_UEL_URL: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard",

  _cachedData: null,
  _cacheTimestamp: 0,
  CACHE_TTL_MS: 30000, // 30s TTL cache to avoid redundant parallel network calls

  /**
   * Fetches real-time live score for Fenerbahçe from official sports feeds
   */
  async fetchLiveMatch(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this._cachedData && (now - this._cacheTimestamp < this.CACHE_TTL_MS)) {
      return this._cachedData;
    }

    try {
      const endpoints = [this.ESPN_SUPERLIG_URL, this.ESPN_UCL_URL, this.ESPN_UEL_URL];

      for (const url of endpoints) {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (!data.events || !Array.isArray(data.events)) continue;

        for (const event of data.events) {
          const comp = event.competitions?.[0];
          if (!comp) continue;

          const competitors = comp.competitors || [];
          const fbTeam = competitors.find(c =>
            (c.team?.displayName || "").toLowerCase().includes("fenerbahce") ||
            (c.team?.name || "").toLowerCase().includes("fenerbahce")
          );

          if (fbTeam) {
            const statusType = comp.status?.type || {};
            const state = (statusType.state || "").toLowerCase();
            const statusName = statusType.name || "";
            
            const isLive = ["in", "in_progress", "halftime", "live"].includes(state) ||
                           ["STATUS_IN_PROGRESS", "STATUS_HALFTIME"].includes(statusName);

            const homeComp = competitors.find(c => c.homeAway === "home") || competitors[0];
            const awayComp = competitors.find(c => c.homeAway === "away") || competitors[1];

            const homeName = homeComp?.team?.shortDisplayName || homeComp?.team?.name || "Ev Sahibi";
            const awayName = awayComp?.team?.shortDisplayName || awayComp?.team?.name || "Deplasman";
            const isFbHome = (homeName || "").toLowerCase().includes("fenerbahce");

            const result = {
              isLive: isLive,
              statusDescription: statusType.shortDetail || statusType.description || (isLive ? "CANLI" : "Maç Yok"),
              minute: comp.status?.displayClock || (isLive ? "1'" : "0'"),
              home: isFbHome ? "Fenerbahçe" : homeName,
              homeIcon: isFbHome ? "💛💙" : "🔴⚫",
              homeShort: isFbHome ? "FB" : homeName.substring(0, 3).toUpperCase(),
              away: !isFbHome && (awayName.toLowerCase().includes("fenerbahce")) ? "Fenerbahçe" : awayName,
              awayIcon: !isFbHome ? "💛💙" : "🔴🟡",
              awayShort: !isFbHome ? "FB" : awayName.substring(0, 3).toUpperCase(),
              scoreHome: homeComp?.score || "0",
              scoreAway: awayComp?.score || "0",
              league: event.season?.displayName || data.leagues?.[0]?.name || "Trendyol Süper Lig",
              stadium: comp.venue?.fullName || "Kadıköy",
              goalsHome: (homeComp?.details || []).filter(d => (d.type?.text || "").includes("Goal")).map(g => `${g.athlete?.displayName || 'Gol'} (${g.clock?.displayValue || ''})`),
              goalsAway: (awayComp?.details || []).filter(d => (d.type?.text || "").includes("Goal")).map(g => `${g.athlete?.displayName || 'Gol'} (${g.clock?.displayValue || ''})`)
            };

            this._cachedData = result;
            this._cacheTimestamp = Date.now();
            return result;
          }
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
