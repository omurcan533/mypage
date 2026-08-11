// ===== NEWS_API.JS — Fenerbahçe Daily Real News Engine (Max 20 News / 00:00 Daily Refresh) =====

const FenerbahceNewsAPI = {
  CACHE_KEY: "oyp_fb_news_cache",
  DATE_KEY: "oyp_fb_news_last_date",

  /**
   * Returns current date key in YYYY-MM-DD format (resets at 00:00)
   */
  getTodayDateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  _memoryCache: null,

  /**
   * Fetches latest 20 real Fenerbahçe news articles from official feeds
   */
  async fetchLatestNews() {
    const today = this.getTodayDateKey();
    if (this._memoryCache && Array.isArray(this._memoryCache) && localStorage.getItem(this.DATE_KEY) === today) {
      return this._memoryCache;
    }

    const cachedDate = localStorage.getItem(this.DATE_KEY);
    const cachedNews = localStorage.getItem(this.CACHE_KEY);

    // If cached today and valid, return cached
    if (cachedDate === today && cachedNews) {
      try {
        const parsed = JSON.parse(cachedNews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._memoryCache = parsed;
          return parsed;
        }
      } catch (e) {}
    }

    // Fetch fresh news from Google News RSS via RSS2JSON API
    try {
      const rssUrl = "https://news.google.com/rss/search?q=Fenerbah%C3%A7e&hl=tr&gl=TR&ceid=TR:tr";
      const feedUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl);
      const res = await fetch(feedUrl);
      
      if (res.ok) {
        const data = await res.json();
        if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
          const formatted = data.items.slice(0, 20).map((item, idx) => {
            let sourceName = item.author || "Spor Haberleri";
            let cleanTitle = item.title || "Fenerbahçe Haber";
            
            if (cleanTitle.includes(" - ")) {
              const parts = cleanTitle.split(" - ");
              sourceName = parts.pop().trim();
              cleanTitle = parts.join(" - ").trim();
            }

            // Clean description HTML tags
            let desc = item.description || cleanTitle;
            desc = desc.replace(/<[^>]*>?/gm, '').trim();
            if (desc.length > 150) desc = desc.substring(0, 150) + "...";

            return {
              id: "fb-news-" + (idx + 1),
              title: cleanTitle,
              category: "news",
              subType: "news_sports",
              status: "completed",
              rating: 5,
              source: sourceName,
              link: item.link || "#",
              pubDate: item.pubDate || new Date().toISOString(),
              note: desc
            };
          });

          localStorage.setItem(this.CACHE_KEY, JSON.stringify(formatted));
          localStorage.setItem(this.DATE_KEY, today);
          this.syncToSupabase(formatted);

          return formatted;
        }
      }
    } catch (err) {
      console.warn("Fenerbahçe News API fetch error:", err);
    }

    // Fallback to cache if available
    try {
      if (cachedNews) return JSON.parse(cachedNews);
    } catch (e) {}
    return null;
  },

  async syncToSupabase(newsItems) {
    try {
      if (window.supabaseClient) {
        await window.supabaseClient
          .from("site_settings")
          .upsert({ key: "oyp_fb_daily_news", value: JSON.stringify(newsItems) }, { onConflict: "key" });
      }
    } catch (e) {}
  }
};

window.FenerbahceNewsAPI = FenerbahceNewsAPI;
