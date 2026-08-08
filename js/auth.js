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

  async login(email, password) {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword(
      {
        email: email,
        password: password,
      },
    );

    if (error) {
      console.error("Login error:", error);
      localStorage.removeItem(AUTH_SESSION_FLAG);
      localStorage.removeItem(AUTH_ADMIN_FLAG);
      return false;
    }

    console.log("Login successful:", data.user);
    localStorage.setItem(AUTH_SESSION_FLAG, "1");

    if (this.isAdminUser(data.user)) {
      localStorage.setItem(AUTH_ADMIN_FLAG, "1");
    } else {
      localStorage.removeItem(AUTH_ADMIN_FLAG);
    }

    this.notifyAuthChange();

    return true;
  },

  async logout() {
    const { error } = await window.supabaseClient.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return false;
    }

    localStorage.removeItem(AUTH_SESSION_FLAG);
    localStorage.removeItem(AUTH_ADMIN_FLAG);
    this.notifyAuthChange();
    window.location.href = "../index.html";

    return true;
  },

  async getUser() {
    try {
      const {
        data: { user },
        error,
      } = await window.supabaseClient.auth.getUser();

      if (error) {
        return null;
      }

      return user;
    } catch (err) {
      return null;
    }
  },

  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await window.supabaseClient.auth.getSession();

      if (error) {
        return null;
      }

      return session;
    } catch (err) {
      return null;
    }
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
      const {
        data: { session },
        error,
      } = await window.supabaseClient.auth.getSession();

      if (error) {
        localStorage.removeItem(AUTH_SESSION_FLAG);
        localStorage.removeItem(AUTH_ADMIN_FLAG);
        this.notifyAuthChange();
        return false;
      }

      if (session) {
        localStorage.setItem(AUTH_SESSION_FLAG, "1");

        const user = await this.getUser();
        if (user && this.isAdminUser(user)) {
          localStorage.setItem(AUTH_ADMIN_FLAG, "1");
        } else {
          localStorage.removeItem(AUTH_ADMIN_FLAG);
        }
      } else {
        localStorage.removeItem(AUTH_SESSION_FLAG);
        localStorage.removeItem(AUTH_ADMIN_FLAG);
      }

      this.notifyAuthChange();
      return !!session;
    } catch (err) {
      localStorage.removeItem(AUTH_SESSION_FLAG);
      localStorage.removeItem(AUTH_ADMIN_FLAG);
      this.notifyAuthChange();
      return false;
    }
  },

  async populateNav() {
    try {
      const user = await this.getUser();

      if (!user) return;

      const nameEl = document.getElementById("nav-user-name");
      const roleEl = document.getElementById("nav-user-role");
      const avatarEl = document.getElementById("nav-user-avatar");

      // Supabase Auth'ta şimdilik email'i isim olarak kullanıyoruz
      const displayName =
        user.user_metadata?.display_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      const role = this.getRoleFromUser(user) || (this.isAdminUser(user) ? "Admin" : "User");

      if (nameEl) {
        nameEl.textContent = displayName;
      }

      if (roleEl) {
        roleEl.textContent = role;
      }

      if (avatarEl) {
        avatarEl.textContent = displayName.charAt(0).toUpperCase();
      }
    } catch (err) {
      // Ignore unauthenticated user error
    }
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
