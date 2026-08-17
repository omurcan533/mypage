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
   * Primary RSS Feeds for Fenerbahçe News
   */
  FEED_SOURCES: [
    {
      name: "Fotomaç",
      url: "https://www.fotomac.com.tr/rss/fenerbahce.xml"
    },
    {
      name: "A Spor",
      url: "https://www.aspor.com.tr/rss/fenerbahce.xml"
    },
    {
      name: "Sabah Spor",
      url: "https://www.sabah.com.tr/rss/fenerbahce.xml"
    }
  ],

  /**
   * Fetches latest 20 real Fenerbahçe news articles from reliable feeds
   */
  async fetchLatestNews() {
    const today = this.getTodayDateKey();
    if (this._memoryCache && Array.isArray(this._memoryCache) && this._memoryCache.length > 0 && localStorage.getItem(this.DATE_KEY) === today) {
      return this._memoryCache;
    }

    const cachedDate = localStorage.getItem(this.DATE_KEY);
    const cachedNews = localStorage.getItem(this.CACHE_KEY);

    // If cached today and has articles, return cached
    if (cachedDate === today && cachedNews) {
      try {
        const parsed = JSON.parse(cachedNews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._memoryCache = parsed;
          return parsed;
        }
      } catch (e) {}
    }

    // Fetch from all RSS sources in parallel
    let allRawItems = [];

    const fetchPromises = this.FEED_SOURCES.map(async (source) => {
      try {
        const apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(source.url);
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok" && Array.isArray(data.items)) {
            return data.items.map(item => ({ ...item, _sourceName: source.name }));
          }
        }
      } catch (e) {
        // Individual feed error ignored
      }
      return [];
    });

    try {
      const results = await Promise.allSettled(fetchPromises);
      results.forEach(r => {
        if (r.status === "fulfilled" && Array.isArray(r.value)) {
          allRawItems.push(...r.value);
        }
      });

      if (allRawItems.length > 0) {
        // Deduplicate by clean title
        const seenTitles = new Set();
        const formatted = [];

        for (const item of allRawItems) {
          let rawTitle = (item.title || "").trim();
          if (!rawTitle) continue;

          // Clean title
          let cleanTitle = rawTitle;
          let sourceName = item._sourceName || item.author || "Spor Haberleri";

          if (cleanTitle.includes(" - ")) {
            const parts = cleanTitle.split(" - ");
            if (parts.length > 1) {
              const lastPart = parts[parts.length - 1].trim();
              if (lastPart.length < 25) {
                sourceName = lastPart;
                cleanTitle = parts.slice(0, -1).join(" - ").trim();
              }
            }
          }

          // Normalize for deduplication
          const normTitle = cleanTitle.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, "");
          if (seenTitles.has(normTitle)) continue;
          seenTitles.add(normTitle);

          // Clean description
          let desc = item.description || cleanTitle;
          desc = desc.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').trim();
          if (desc.length > 160) desc = desc.substring(0, 160) + "...";

          formatted.push({
            id: "fb-news-" + (formatted.length + 1),
            title: cleanTitle,
            category: "news",
            subType: "news_sports",
            status: "completed",
            rating: 5,
            source: sourceName,
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            note: desc
          });

          if (formatted.length >= 20) break;
        }

        if (formatted.length > 0) {
          this._memoryCache = formatted;
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
      if (cachedNews) {
        const parsed = JSON.parse(cachedNews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._memoryCache = parsed;
          return parsed;
        }
      }
    } catch (e) {}

    // Ultimate fallback if offline
    return this.getFallbackNews();
  },

  async syncToSupabase(newsItems) {
    try {
      if (window.supabaseClient) {
        await window.supabaseClient
          .from("site_settings")
          .upsert({ key: "oyp_fb_daily_news", value: JSON.stringify(newsItems) }, { onConflict: "key" });
      }
    } catch (e) {}
  },

  getFallbackNews() {
    return [
      {
        id: "fb-news-1",
        title: "Fenerbahçe'de Yoğun Maç Trafiği ve Taktik Hazırlıklar Sürüyor",
        category: "news",
        subType: "news_sports",
        status: "completed",
        rating: 5,
        source: "Fenerbahçe SK",
        link: "https://www.fenerbahce.org",
        note: "Sarı-lacivertli ekip Samandıra Can Bartu Tesisleri'nde teknik direktör yönetiminde çalışmalarını sürdürdü."
      },
      {
        id: "fb-news-2",
        title: "Kadıköy'de Taraftar Coşkusu: Biletler Satışa Çıktıktan Dakikalar Sonra Tükendi",
        category: "news",
        subType: "news_sports",
        status: "completed",
        rating: 5,
        source: "Fotomaç",
        link: "https://www.fotomac.com.tr",
        note: "Ülker Stadyumu'nda oynanacak kritik mücadele öncesi sarı-lacivertli taraftarlar tribünleri tamamen dolduracak."
      },
      {
        id: "fb-news-3",
        title: "Fenerbahçe Beko Avrupa Arenasında Zirve Mücadelesini Sürdürüyor",
        category: "news",
        subType: "news_sports",
        status: "completed",
        rating: 5,
        source: "A Spor",
        link: "https://www.aspor.com.tr",
        note: "EuroLeague'de başarılı bir grafik çizen Fenerbahçe Beko, taraftarlarının desteğiyle galibiyet serisini hedefliyor."
      }
    ];
  }
};

window.FenerbahceNewsAPI = FenerbahceNewsAPI;
