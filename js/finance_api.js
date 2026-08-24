// ===== FINANCE_API.JS — Real-Time Borsa & Financial Markets Engine =====

const FinanceAPI = {
  CACHE_KEY: "oyp_finance_cache",
  CACHE_TIME_KEY: "oyp_finance_cache_time",
  CACHE_TTL_MS: 45000, // 45 seconds cache TTL

  _cachedData: null,

  /**
   * Default fallback values matching current market prices
   */
  getFallbackData() {
    return [
      {
        id: "bist100",
        name: "BIST 100",
        code: "XU100",
        icon: "📈",
        category: "bist",
        price: 14172.26,
        priceFormatted: "14.172,26 Puan",
        changePct: 0.28,
        changeFormatted: "+%0,28",
        isUp: true,
        source: "Borsa İstanbul",
        unit: "Puan"
      },
      {
        id: "usdtry",
        name: "Dolar / TL",
        code: "USD/TRY",
        icon: "💵",
        category: "forex",
        price: 47.84,
        priceFormatted: "₺47,84",
        changePct: 0.10,
        changeFormatted: "+%0,10",
        isUp: true,
        source: "Serbest Piyasa",
        unit: "TRY"
      },
      {
        id: "eurtry",
        name: "Euro / TL",
        code: "EUR/TRY",
        icon: "💶",
        category: "forex",
        price: 55.37,
        priceFormatted: "₺55,37",
        changePct: 0.31,
        changeFormatted: "+%0,31",
        isUp: true,
        source: "Serbest Piyasa",
        unit: "TRY"
      },
      {
        id: "gramgold",
        name: "Gram Altın",
        code: "GAU/TRY",
        icon: "🪙",
        category: "gold",
        price: 6655.00,
        priceFormatted: "₺6.655,00",
        changePct: 0.68,
        changeFormatted: "+%0,68",
        isUp: true,
        source: "Kapalıçarşı",
        unit: "TRY"
      },
      {
        id: "quartergold",
        name: "Çeyrek Altın",
        code: "CEYREK",
        icon: "🟡",
        category: "gold",
        price: 10914.00,
        priceFormatted: "₺10.914,00",
        changePct: 0.30,
        changeFormatted: "+%0,30",
        isUp: true,
        source: "Kapalıçarşı",
        unit: "TRY"
      },
      {
        id: "btc",
        name: "Bitcoin",
        code: "BTC/USD",
        icon: "₿",
        category: "crypto",
        price: 98450.00,
        priceFormatted: "$98.450",
        changePct: 1.42,
        changeFormatted: "+%1,42",
        isUp: true,
        source: "Kripto Piyasası",
        unit: "USD"
      },
      {
        id: "eth",
        name: "Ethereum",
        code: "ETH/USD",
        icon: "Ξ",
        category: "crypto",
        price: 2840.00,
        priceFormatted: "$2.840",
        changePct: 0.85,
        changeFormatted: "+%0,85",
        isUp: true,
        source: "Kripto Piyasası",
        unit: "USD"
      }
    ];
  },

  parseTurkishNumber(str) {
    if (!str) return 0;
    if (typeof str === "number") return str;
    const clean = String(str).replace(/\./g, "").replace(",", ".").trim();
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  },

  parseTurkishChange(str) {
    if (!str) return { pct: 0, isUp: true, formatted: "%0,00" };
    if (typeof str === "number") {
      const isUp = str >= 0;
      return {
        pct: parseFloat(str.toFixed(2)),
        isUp,
        formatted: (isUp ? "+" : "") + "%" + Math.abs(str).toFixed(2).replace(".", ",")
      };
    }
    const cleanStr = String(str).replace("%", "").replace(/\+/g, "").trim();
    const isUp = !String(str).includes("-");
    const val = parseFloat(cleanStr.replace(",", "."));
    const num = isNaN(val) ? 0 : val;
    return {
      pct: parseFloat(num.toFixed(2)),
      isUp,
      formatted: (isUp ? "+" : "-") + "%" + Math.abs(num).toFixed(2).replace(".", ",")
    };
  },

  /**
   * Main fetch method with CORS-safe endpoints & proxies
   */
  async fetchMarketData(forceRefresh = false) {
    const now = Date.now();
    const lastTime = parseInt(localStorage.getItem(this.CACHE_TIME_KEY) || "0", 10);

    if (!forceRefresh && this._cachedData && (now - lastTime < this.CACHE_TTL_MS)) {
      return this._cachedData;
    }

    if (!forceRefresh && (now - lastTime < this.CACHE_TTL_MS)) {
      try {
        const saved = JSON.parse(localStorage.getItem(this.CACHE_KEY));
        if (Array.isArray(saved) && saved.length > 0) {
          this._cachedData = saved;
          return saved;
        }
      } catch (e) {}
    }

    let items = this.getFallbackData();

    // 1. Fetch BIST 100 with CORS-safe proxy
    try {
      const targetUrl = encodeURIComponent("https://query1.finance.yahoo.com/v8/finance/chart/XU100.IS?interval=1d");
      const resBist = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`, {
        headers: { "Accept": "application/json" }
      });
      if (resBist.ok) {
        const dataBist = await resBist.json();
        const meta = dataBist?.chart?.result?.[0]?.meta;
        if (meta && meta.regularMarketPrice) {
          const price = meta.regularMarketPrice;
          const prev = meta.chartPreviousClose || meta.previousClose || price;
          const pct = ((price - prev) / prev) * 100;
          const isUp = pct >= 0;

          const bistItem = items.find(i => i.id === "bist100");
          if (bistItem) {
            bistItem.price = price;
            bistItem.priceFormatted = price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Puan";
            bistItem.changePct = parseFloat(pct.toFixed(2));
            bistItem.isUp = isUp;
            bistItem.changeFormatted = (isUp ? "+" : "") + "%" + Math.abs(pct).toFixed(2).replace(".", ",");
          }
        }
      }
    } catch (e) {
      // Graceful fallback to default/cached values
    }

    // 2. Fetch Live Forex Rates (Open Exchange Rates / ER-API - natively CORS enabled)
    try {
      const resEr = await fetch("https://open.er-api.com/v6/latest/USD");
      if (resEr.ok) {
        const erData = await resEr.json();
        if (erData?.rates?.TRY) {
          const usdTry = erData.rates.TRY;
          const eurTry = erData.rates.TRY / (erData.rates.EUR || 0.92);

          const usdItem = items.find(i => i.id === "usdtry");
          if (usdItem && usdTry > 0) {
            usdItem.price = usdTry;
            usdItem.priceFormatted = "₺" + usdTry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }

          const eurItem = items.find(i => i.id === "eurtry");
          if (eurItem && eurTry > 0) {
            eurItem.price = eurTry;
            eurItem.priceFormatted = "₺" + eurTry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }

          // Gold approximate calculation from USD gold ounce if needed
          const gramGoldItem = items.find(i => i.id === "gramgold");
          if (gramGoldItem && usdTry > 0) {
            const onsUsd = 2780; // approximate gold ounce
            const gramTry = (onsUsd / 31.1034768) * usdTry;
            gramGoldItem.price = gramTry;
            gramGoldItem.priceFormatted = "₺" + Math.round(gramTry).toLocaleString("tr-TR");
          }
        }
      }
    } catch (e) {}

    // 3. Fetch Crypto Prices (Binance CORS-friendly API)
    try {
      const [resBtc, resEth] = await Promise.allSettled([
        fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"),
        fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT")
      ]);

      if (resBtc.status === "fulfilled" && resBtc.value.ok) {
        const btcData = await resBtc.value.json();
        const price = parseFloat(btcData.lastPrice);
        const chg = parseFloat(btcData.priceChangePercent);
        const btcItem = items.find(i => i.id === "btc");
        if (btcItem && !isNaN(price)) {
          btcItem.price = price;
          btcItem.priceFormatted = "$" + Math.round(price).toLocaleString("en-US");
          btcItem.changePct = chg;
          btcItem.isUp = chg >= 0;
          btcItem.changeFormatted = (chg >= 0 ? "+" : "") + "%" + Math.abs(chg).toFixed(2).replace(".", ",");
        }
      }

      if (resEth.status === "fulfilled" && resEth.value.ok) {
        const ethData = await resEth.value.json();
        const price = parseFloat(ethData.lastPrice);
        const chg = parseFloat(ethData.priceChangePercent);
        const ethItem = items.find(i => i.id === "eth");
        if (ethItem && !isNaN(price)) {
          ethItem.price = price;
          ethItem.priceFormatted = "$" + Math.round(price).toLocaleString("en-US");
          ethItem.changePct = chg;
          ethItem.isUp = chg >= 0;
          ethItem.changeFormatted = (chg >= 0 ? "+" : "") + "%" + Math.abs(chg).toFixed(2).replace(".", ",");
        }
      }
    } catch (e) {}

    this._cachedData = items;
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      localStorage.setItem(this.CACHE_TIME_KEY, now.toString());
    } catch (e) {}

    return items;
  }
};

if (typeof window !== "undefined") {
  window.FinanceAPI = FinanceAPI;
}
