// ===== AUTH.JS — SUPABASE AUTH =====

const AUTH_SESSION_FLAG = "site-habits-access";
const AUTH_ADMIN_FLAG = "site-admin-access";

const Auth = {
  notifyAuthChange() {
    window.dispatchEvent(new Event("auth:changed"));
  },

  getRoleFromUser(user) {
    if (!user) return "";

    const metadataRole =
      user.user_metadata?.role ||
      user.user_metadata?.role_name ||
      user.app_metadata?.role ||
      user.app_metadata?.role_name ||
      "";

    return String(metadataRole || "").trim();
  },

  isAdminUser(user) {
    if (!user) return false;

    if (user.user_metadata?.is_admin === false || user.app_metadata?.is_admin === false) {
      return false;
    }

    if (user.user_metadata?.is_admin === true || user.app_metadata?.is_admin === true) {
      return true;
    }

    const role = this.getRoleFromUser(user).toLowerCase();
    if (["admin", "administrator", "superadmin"].includes(role)) {
      return true;
    }

    if (role && !["admin", "administrator", "superadmin"].includes(role)) {
      return false;
    }

    return true;
  },

  async login(usernameOrEmail, password) {
    const rawUser = String(usernameOrEmail || "").trim();
    const rawPass = String(password || "").trim();

    if (!window.supabaseClient || !window.supabaseClient.auth) {
      console.error("Supabase client is not initialized.");
      return false;
    }

    // Hedef Supabase hesabı (omur yazıldığında var olan hesabınızla eşleşir)
    const targetEmail = rawUser.includes("@") ? rawUser : "yilmazomurcan@gmail.com";

    // 1. İlk deneme: Girilen şifre ile
    let { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: targetEmail,
      password: rawPass,
    });

    // 2. İkinci deneme (Türkçe/İngilizce karakter toleransı: örn. yılmaz -> yilmaz veya tersi)
    if (error && (rawPass.includes("ı") || rawPass.includes("i") || rawPass.includes("ş") || rawPass.includes("s"))) {
      const altPass = rawPass
        .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u");
      const altAttempt = await window.supabaseClient.auth.signInWithPassword({
        email: targetEmail,
        password: altPass,
      });
      if (!altAttempt.error && altAttempt.data) {
        data = altAttempt.data;
        error = null;
      }
    }

    if (error) {
      console.error("Login error:", error);
      localStorage.removeItem(AUTH_SESSION_FLAG);
      localStorage.removeItem(AUTH_ADMIN_FLAG);
      return false;
    }

    console.log("Login successful for:", targetEmail, data.user);
    localStorage.setItem(AUTH_SESSION_FLAG, "1");
    localStorage.setItem(AUTH_ADMIN_FLAG, "1");

    this.notifyAuthChange();
    return true;
  },

  async logout() {
    // 1. Yerel yetki bayraklarını temizle
    localStorage.removeItem(AUTH_SESSION_FLAG);
    localStorage.removeItem(AUTH_ADMIN_FLAG);

    // 2. Supabase token'larını localStorage ve sessionStorage'dan tamamen temizle
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("sb-") || k.includes("auth-token") || k.includes("supabase.auth"))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch (e) {}

    // 3. Supabase signOut çağrısı
    try {
      if (window.supabaseClient && window.supabaseClient.auth) {
        await Promise.race([
          window.supabaseClient.auth.signOut({ scope: "local" }),
          new Promise((resolve) => setTimeout(resolve, 300))
        ]);
      }
    } catch (err) {
      console.warn("Supabase signout warning:", err);
    }

    this.notifyAuthChange();
    window.location.reload();
    return true;
  },

  async getUser() {
    try {
      if (window.supabaseClient && window.supabaseClient.auth) {
        const { data: { user }, error } = await window.supabaseClient.auth.getUser();
        if (!error && user) return user;
      }
    } catch (err) {}
    return null;
  },

  async getSession() {
    try {
      if (window.supabaseClient && window.supabaseClient.auth) {
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        if (!error && session) return session;
      }
    } catch (err) {}
    return null;
  },

  async guard() {
    const user = await this.getUser();
    if (!user) {
      window.location.href = "../index.html";
      return false;
    }
    return true;
  },

  async isLoggedIn() {
    try {
      if (window.supabaseClient && window.supabaseClient.auth) {
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        if (!error && session) {
          localStorage.setItem(AUTH_SESSION_FLAG, "1");
          const user = await this.getUser();
          if (user && this.isAdminUser(user)) {
            localStorage.setItem(AUTH_ADMIN_FLAG, "1");
          } else {
            localStorage.removeItem(AUTH_ADMIN_FLAG);
          }
          this.notifyAuthChange();
          return true;
        }
      }
    } catch (err) {}

    localStorage.removeItem(AUTH_SESSION_FLAG);
    localStorage.removeItem(AUTH_ADMIN_FLAG);
    this.notifyAuthChange();
    return false;
  },

  async populateNav() {
    try {
      const user = await this.getUser();
      if (!user) return;

      const nameEl = document.getElementById("nav-user-name");
      const roleEl = document.getElementById("nav-user-role");
      const avatarEl = document.getElementById("nav-user-avatar");

      const displayName =
        user.user_metadata?.display_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      const role = this.getRoleFromUser(user) || (this.isAdminUser(user) ? "Admin" : "User");

      if (nameEl) nameEl.textContent = displayName;
      if (roleEl) roleEl.textContent = role;
      if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
    } catch (err) {}
  },

  canAccessHabits() {
    return localStorage.getItem(AUTH_ADMIN_FLAG) === "1";
  },

  async canManageContent() {
    if (localStorage.getItem(AUTH_ADMIN_FLAG) === "1") {
      return true;
    }
    const user = await this.getUser();
    return this.isAdminUser(user);
  },

  onAuthStateChange(callback) {
    return window.supabaseClient.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

window.Auth = Auth;
