// ===== SUPABASE CONNECTION =====

const SUPABASE_URL = "https://lsvveqxaqfujyjxqexrv.supabase.co";
const SUPABASE_KEY = "sb_publishable_8h73DIh4kCaRt33zyn1fYw_icYoHBP9";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabaseClient = supabaseClient;
console.log("Supabase bağlantısı hazır:", window.supabaseClient);
