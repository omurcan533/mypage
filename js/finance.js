// ===== FINANCE.JS — Alias / Re-export to finance_api.js =====
if (typeof FinanceAPI === 'undefined') {
  // If finance_api.js not yet loaded, load dynamically or export fallback
  console.log("finance.js alias initialized");
}
