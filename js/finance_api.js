// ===== FINANCE_API.JS — Real-Time Borsa & Financial Markets Engine =====

const FinanceAPI = {
  CACHE_KEY: "oyp_finance_cache",
  CACHE_TIME_KEY: "oyp_finance_cache_time",
  CACHE_TTL_MS: 30000, // 30 seconds cache TTL

  _cachedData: null,

  /**
   * Default fallback values matching current real market prices
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
        price: 64250.00,
        priceFormatted: "$64.250",
        changePct: 2.45,
        changeFormatted: "+%2,45",
        isUp: true,
        source: "Kripto Piyasası",
        unit: "USD"
      },
      {
        id: "eth",
        name: "Ethereum",
        code: "ETH/USD",
        icon: "💎",
        category: "crypto",
        price: 3480.00,
        priceFormatted: "$3.480",
        changePct: -0.65,
        changeFormatted: "-%0,65",
        isUp: false,
        source: "Kripto Piyasası",
        unit: "USD"
      }
    ];
  },

  /**
   * Helper to parse Turkish price formatted numbers (e.g. "6.736,33" or "47,8422")
   */
  parseTurkishNumber(str) {
    if (!str) return 0;
    if (typeof str === "number") return str;
    const clean = str.toString().replace(/\./g, "").replace(",", ".");
    return parseFloat(clean) || 0;
  },

  /**
   * Helper to parse percentage strings (e.g. "%0,68" or "%-0,12")
   */
  parseTurkishChange(str) {
    if (!str) return { pct: 0, formatted: "%0,00", isUp: true };
    const cleanStr = str.toString().replace("%", "").trim().replace(",", ".");
    const val = parseFloat(cleanStr) || 0;
    const isUp = val >= 0;
    const formatted = (isUp ? "+" : "") + "%" + Math.abs(val).toFixed(2).replace(".", ",");
    return { pct: val, formatted, isUp };
  },

  /**
   * Fetches real-time market rates from official endpoints
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

    // 1. Fetch BIST 100 Live from Yahoo Finance API
    try {
      const resBist = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/XU100.IS?interval=1d");
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
      console.warn("BIST 100 Yahoo API fetch notice:", e);
    }

    // 2. Fetch Gold & Currency Live Rates from Truncgil / Turkish Market API
    try {
      const resTrunc = await fetch("https://finans.truncgil.com/v3/today.json");
      if (resTrunc.ok) {
        const dataTrunc = await resTrunc.json();
        
        // Gram Altın
        if (dataTrunc["gram-altin"]) {
          const gData = dataTrunc["gram-altin"];
          const priceVal = this.parseTurkishNumber(gData.Buying || gData.Selling);
          const chg = this.parseTurkishChange(gData.Change);
          const item = items.find(i => i.id === "gramgold");
          if (item && priceVal > 0) {
            item.price = priceVal;
            item.priceFormatted = "₺" + Math.round(priceVal).toLocaleString("tr-TR");
            item.changePct = chg.pct;
            item.isUp = chg.isUp;
            item.changeFormatted = chg.formatted;
          }
        }

        // Çeyrek Altın
        if (dataTrunc["ceyrek-altin"]) {
          const qData = dataTrunc["ceyrek-altin"];
          const priceVal = this.parseTurkishNumber(qData.Buying || qData.Selling);
          const chg = this.parseTurkishChange(qData.Change);
          const item = items.find(i => i.id === "quartergold");
          if (item && priceVal > 0) {
            item.price = priceVal;
            item.priceFormatted = "₺" + Math.round(priceVal).toLocaleString("tr-TR");
            item.changePct = chg.pct;
            item.isUp = chg.isUp;
            item.changeFormatted = chg.formatted;
          }
        }

        // USD
        if (dataTrunc["USD"]) {
          const uData = dataTrunc["USD"];
          const priceVal = this.parseTurkishNumber(uData.Buying || uData.Selling);
          const chg = this.parseTurkishChange(uData.Change);
          const item = items.find(i => i.id === "usdtry");
          if (item && priceVal > 0) {
            item.price = priceVal;
            item.priceFormatted = "₺" + priceVal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            item.changePct = chg.pct;
            item.isUp = chg.isUp;
            item.changeFormatted = chg.formatted;
          }
        }

        // EUR
        if (dataTrunc["EUR"]) {
          const eData = dataTrunc["EUR"];
          const priceVal = this.parseTurkishNumber(eData.Buying || eData.Selling);
          const chg = this.parseTurkishChange(eData.Change);
          const item = items.find(i => i.id === "eurtry");
          if (item && priceVal > 0) {
            item.price = priceVal;
            item.priceFormatted = "₺" + priceVal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            item.changePct = chg.pct;
            item.isUp = chg.isUp;
            item.changeFormatted = chg.formatted;
          }
        }
      }
    } catch (e) {
      console.warn("Gold/Currency API fetch notice:", e);
    }

    // 3. Fetch Crypto Prices (BTC, ETH)
    try {
      const resCrypto = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true");
      if (resCrypto.ok) {
        const dataCrypto = await resCrypto.json();
        if (dataCrypto.bitcoin) {
          const btcItem = items.find(i => i.id === "btc");
          if (btcItem) {
            btcItem.price = dataCrypto.bitcoin.usd;
            btcItem.priceFormatted = "$" + Math.round(dataCrypto.bitcoin.usd).toLocaleString("en-US");
            if (dataCrypto.bitcoin.usd_24h_change !== undefined) {
              const chg = dataCrypto.bitcoin.usd_24h_change;
              btcItem.changePct = parseFloat(chg.toFixed(2));
              btcItem.isUp = chg >= 0;
              btcItem.changeFormatted = (chg >= 0 ? "+" : "") + "%" + Math.abs(chg).toFixed(2).replace(".", ",");
            }
          }
        }
        if (dataCrypto.ethereum) {
          const ethItem = items.find(i => i.id === "eth");
          if (ethItem) {
            ethItem.price = dataCrypto.ethereum.usd;
            ethItem.priceFormatted = "$" + Math.round(dataCrypto.ethereum.usd).toLocaleString("en-US");
            if (dataCrypto.ethereum.usd_24h_change !== undefined) {
              const chg = dataCrypto.ethereum.usd_24h_change;
              ethItem.changePct = parseFloat(chg.toFixed(2));
              ethItem.isUp = chg >= 0;
              ethItem.changeFormatted = (chg >= 0 ? "+" : "") + "%" + Math.abs(chg).toFixed(2).replace(".", ",");
            }
          }
        }
      }
    } catch (e) {
      console.warn("Crypto API fetch notice:", e);
    }

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
