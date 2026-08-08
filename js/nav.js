// ===== NAV.JS — Navigation & UI Utilities =====

const Nav = {
  /**
   * Initialize the sidebar: set active link, attach logout
   */
  init() {
    this._setActiveLink();
    this._attachLogout();
    Auth.populateNav();
    this._togglePrivateLinks();
  },

  _setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const page = href.split('/').pop();
      if (page === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  _attachLogout() {
    const btn = document.getElementById('logout-btn');
    if (btn) btn.addEventListener('click', () => Auth.logout());
  },

  _togglePrivateLinks() {
    const canSeeHabits = Auth.canAccessHabits();

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const pageName = href.split('/').pop();

      if (pageName !== 'habits.html') return;

      if (!canSeeHabits) {
        link.style.display = 'none';
        link.setAttribute('aria-hidden', 'true');
      } else {
        link.style.display = '';
        link.removeAttribute('aria-hidden');
      }
    });
  }
};

// ===== TOAST NOTIFICATIONS =====
const Toast = {
  container: null,

  _ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3500) {
    this._ensureContainer();
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); }
};

// ===== MODAL HELPERS =====
const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  },

  close(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  },

  /**
   * Attach close-on-overlay-click & close-btn behavior
   */
  setup(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;

    // Click outside modal content
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close(id);
    });

    // Close buttons
    overlay.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.close(id));
    });
  }
};

// ===== DATE UTILITIES =====
const DateUtils = {
  get MONTHS() {
    return (window.i18n && window.i18n.lang === 'en')
      ? ['January','February','March','April','May','June','July','August','September','October','November','December']
      : ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  },
  get DAYS() {
    return (window.i18n && window.i18n.lang === 'en') ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  },
  get DAYS_FULL() {
    return (window.i18n && window.i18n.lang === 'en')
      ? ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] 
      : ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
  },

  today() {
    const d = new Date();
    return this.toKey(d);
  },

  toKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  },

  fromKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  },

  format(date, long = false) {
    const d = typeof date === 'string' ? this.fromKey(date) : date;
    const day = this.DAYS_FULL[(d.getDay() + 6) % 7]; // Monday=0
    return long
      ? `${day}, ${d.getDate()} ${this.MONTHS[d.getMonth()]} ${d.getFullYear()}`
      : `${d.getDate()} ${this.MONTHS[d.getMonth()]}`;
  },

  daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  firstDayOfMonth(year, month) {
    // 0=Monday ... 6=Sunday
    return (new Date(year, month, 1).getDay() + 6) % 7;
  },

  getWeekDates(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // Monday = 0
    d.setDate(d.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(d);
      nd.setDate(d.getDate() + i);
      return nd;
    });
  },

  addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
};

window.Nav = Nav;
window.Toast = Toast;
window.Modal = Modal;
window.DateUtils = DateUtils;
