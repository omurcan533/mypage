// ===== NAV.JS — Navigation & UI Utilities =====

const Nav = {
  /**
   * Initialize the sidebar: set active link, attach logout
   */
  init() {
    this._setActiveLink();
    this._attachLogout();
    this._ensureAdminAccessButton();
    this._ensureMobileHeader();
    try {
      Auth.populateNav();
    } catch (err) {}
    try {
      this.syncAccess();
    } catch (err) {}
    this._setActiveLink();
  },

  _ensureMobileHeader() {
    if (document.getElementById('mobile-header')) return;

    const mobileHeader = document.createElement('div');
    mobileHeader.id = 'mobile-header';
    mobileHeader.className = 'mobile-header';
    mobileHeader.innerHTML = `
      <button id="mobile-hamburger-btn" class="hamburger-btn" type="button" aria-label="Menüyü Aç">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
      <div class="mobile-header-title">
        <span class="mobile-logo-icon">Ö</span>
        <span class="mobile-logo-text">Ömür Can</span>
      </div>
    `;

    const backdrop = document.createElement('div');
    backdrop.id = 'sidebar-backdrop';
    backdrop.className = 'sidebar-backdrop';

    document.body.prepend(mobileHeader);
    document.body.appendChild(backdrop);

    const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
    const sidebar = document.querySelector('.sidebar');

    const toggleMenu = (open) => {
      if (!sidebar) return;
      const isOpen = open !== undefined ? open : !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', isOpen);
      backdrop.classList.toggle('open', isOpen);
      hamburgerBtn.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    backdrop.addEventListener('click', () => toggleMenu(false));

    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  },

  async syncAccess() {
    await Auth.isLoggedIn();
    this._setActiveLink();
    this._togglePrivateLinks();
    this._updateAdminAccessButton();
    this._updateLogoutButton();
    this._updateUserInfoCard();
  },

  _updateLogoutButton() {
    const btn = document.getElementById('logout-btn');
    if (!btn) return;
    const canAccess = Auth.canAccessHabits();
    btn.style.display = canAccess ? 'flex' : 'none';
  },

  _updateUserInfoCard() {
    const userInfoEl = document.querySelector('.sidebar-bottom .user-info');
    if (!userInfoEl) return;
    const canAccess = Auth.canAccessHabits();
    userInfoEl.style.display = canAccess ? 'flex' : 'none';
  },

  _setActiveLink() {
    const pathname = window.location.pathname;

    // Extract the filename and strip .html extension if present
    // Handles: /pages/projects.html → "projects"
    // Handles: /pages/projects     → "projects" (server rewrites)
    let currentFile = pathname.split('/').filter(Boolean).pop() || '';
    currentFile = currentFile.split('?')[0].split('#')[0].toLowerCase().replace(/\.html$/, '');

    if (!currentFile || currentFile === '' || currentFile === 'index') {
      currentFile = 'home';
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
      const hrefAttr = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!hrefAttr) return;

      // Strip extension for comparison
      const linkFile = (hrefAttr.split('/').filter(Boolean).pop() || '').toLowerCase().replace(/\.html$/, '');

      if (linkFile && linkFile === currentFile) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        if (link.parentElement?.tagName === 'LI') {
          link.parentElement.classList.add('active');
        }
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.parentElement?.tagName === 'LI') {
          link.parentElement.classList.remove('active');
        }
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
  },

  _ensureAdminAccessButton() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || document.getElementById('admin-access-btn')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'sidebar-admin-access';
    wrapper.innerHTML = `
      <button id="admin-access-btn" class="btn btn-ghost nav-admin-access" type="button">
        🔐 Admin Girişi
      </button>
    `;

    sidebar.appendChild(wrapper);
    this._attachAdminAccessButton();
  },

  _attachAdminAccessButton() {
    const btn = document.getElementById('admin-access-btn');
    if (!btn) return;

    btn.addEventListener('click', () => this.openAdminAccessModal());
    this._updateAdminAccessButton();
  },

  _updateAdminAccessButton() {
    const btn = document.getElementById('admin-access-btn');
    if (!btn) return;

    const active = Auth.canAccessHabits();
    btn.textContent = active ? '✅ Admin Erişimi' : '🔐 Admin Girişi';
    btn.classList.toggle('is-active', active);
  },

  closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const hamburgerBtn = document.getElementById('mobile-hamburger-btn');

    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.classList.remove('is-active');
    document.body.style.overflow = '';
  },

  openAdminAccessModal() {
    this.closeMobileMenu();
    if (!document.getElementById('admin-access-modal')) {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'admin-access-modal';
      overlay.innerHTML = `
        <div class="modal" style="max-width: 420px;">
          <div class="modal-header">
            <div class="modal-title">🔐 Admin Girişi</div>
            <button class="modal-close" type="button" aria-label="Kapat">✕</button>
          </div>
          <form id="admin-access-form" class="admin-access-form">
            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label">E-posta</label>
              <input type="email" class="input-field" id="admin-access-email" placeholder="ornek@email.com" required />
            </div>
            <div class="input-group" style="margin-bottom: 14px;">
              <label class="input-label">Şifre</label>
              <input type="password" class="input-field" id="admin-access-password" placeholder="••••••••" required />
            </div>
            <div class="admin-access-error" id="admin-access-error"></div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
              <button type="button" class="btn btn-ghost modal-close-btn">İptal</button>
              <button type="submit" class="btn btn-primary" id="admin-access-submit">Giriş Yap</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(overlay);
      Modal.setup('admin-access-modal');

      const form = document.getElementById('admin-access-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-access-email').value.trim();
        const password = document.getElementById('admin-access-password').value;
        const submitBtn = document.getElementById('admin-access-submit');
        const errorEl = document.getElementById('admin-access-error');

        errorEl.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Giriş yapılıyor...';

        const ok = await Auth.login(email, password);

        if (!ok) {
          errorEl.textContent = 'E-posta veya şifre hatalı.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Giriş Yap';
          return;
        }

        Modal.close('admin-access-modal');
        this.syncAccess();

        const isHabitsPage = /(^|\/)habits\.html$/i.test(window.location.pathname);
        if (isHabitsPage) {
          window.location.reload();
        } else {
          window.location.href = 'habits.html';
        }
      });
    }

    Modal.open('admin-access-modal');
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
window.openAdminAccessModal = () => Nav.openAdminAccessModal();
