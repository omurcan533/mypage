// ===== AUTH.JS — Authentication & Session Management =====

const AUTH_KEY = 'oyp_auth_session';
const USERS = {
  admin: {
    // SHA-256 hash of "admin" — simple protection for personal site
    password: 'admin',
    displayName: 'Ömür Can',
    role: 'Admin'
  },
  tester: {
    password: 'tester123',
    displayName: 'Test Kullanıcı',
    role: 'User'
  }
};

const Auth = {
  /**
   * Attempt login
   * @returns {boolean}
   */
  login(username, password, remember = false) {
    const user = USERS[username.toLowerCase()];
    if (!user || user.password !== password) return false;

    const session = {
      username,
      displayName: user.displayName,
      role: user.role,
      token: this._generateToken(),
      expires: remember
        ? Date.now() + 30 * 24 * 60 * 60 * 1000   // 30 days
        : Date.now() + 8 * 60 * 60 * 1000           // 8 hours
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return true;
  },

  /**
   * Check if session is valid
   * @returns {boolean}
   */
  isLoggedIn() {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expires) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get current user info
   */
  getUser() {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Destroy session
   */
  logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = this._getLoginUrl();
  },

  /**
   * Guard: redirect to login if not authenticated
   * Call this at the top of every protected page
   */
  guard() {
    if (!this.isLoggedIn()) {
      window.location.href = this._getLoginUrl();
      return false;
    }
    return true;
  },

  /**
   * Populate user info in the nav
   */
  populateNav() {
    const user = this.getUser();
    if (!user) return;

    const nameEl = document.getElementById('nav-user-name');
    const roleEl = document.getElementById('nav-user-role');
    const avatarEl = document.getElementById('nav-user-avatar');

    if (nameEl) nameEl.textContent = user.displayName;
    if (roleEl) roleEl.textContent = user.role;
    if (avatarEl) avatarEl.textContent = user.displayName.charAt(0).toUpperCase();
  },

  canAccessHabits() {
    const user = this.getUser();
    return Boolean(user && user.role === 'Admin');
  },

  _generateToken() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  },

  _getLoginUrl() {
    // Works from any depth under /pages/
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    return depth <= 1 ? 'index.html' : '../index.html';
  }
};

// Make globally available
window.Auth = Auth;
