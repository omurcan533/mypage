// ===== SUPABASE CONNECTION =====

const SUPABASE_URL = "https://lsvveqxaqfujyjxqexrv.supabase.co";
const SUPABASE_KEY = "sb_publishable_8h73DIh4kCaRt33zyn1fYw_icYoHBP9";

let supabaseClient = null;
try {
  if (window.supabase && typeof window.supabase.createClient === "function") {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (err) {
  console.warn("Supabase init error:", err);
}

// Fallback dummy client if Supabase is unavailable
if (!supabaseClient) {
  supabaseClient = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error("Supabase offline") }),
      insert: () => Promise.resolve({ data: null, error: new Error("Supabase offline") }),
      update: () => Promise.resolve({ data: null, error: new Error("Supabase offline") }),
      delete: () => Promise.resolve({ data: null, error: new Error("Supabase offline") }),
      upsert: () => Promise.resolve({ data: null, error: new Error("Supabase offline") }),
      order: () => Promise.resolve({ data: null, error: new Error("Supabase offline") })
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error("Supabase offline") }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
}

window.supabaseClient = supabaseClient;
console.log("Supabase bağlantısı hazır:", window.supabaseClient);

