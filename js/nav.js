// ===== NAV.JS — Navigation & UI Utilities =====

const Nav = {
  /**
   * Initialize the sidebar: set active link, attach logout
   */
  init() {
    this._initTheme();
    this._setActiveLink();
    this._attachLogout();
    this._attachLogoClick();
    this._ensureAdminAccessButton();
    this._ensureTopHeaderControls();
    this._ensureMobileHeader();
    this._updateGlobalGreeting();
    this._ensureFooter();
    this._ensureLiveScoreBanner();
    this.syncLiveScoreStateFromSupabase();
    this._attachThemeToggle();
    window.addEventListener('fblive:changed', () => this._updateLiveScoreBanner());
    window.addEventListener('auth:changed', () => {
      this.syncLiveScoreStateFromSupabase();
      this._updateLiveScoreBanner();
    });
    try {
      Auth.populateNav();
    } catch (err) {}
    try {
      this.syncAccess();
    } catch (err) {}
    this._setActiveLink();
  },

  _initTheme() {
    const savedTheme = localStorage.getItem('oyp_theme') || localStorage.getItem('theme') || 'dark';
    const isLight = savedTheme === 'light';
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('oyp_theme', isLight ? 'light' : 'dark');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    this._updateThemeUI(isLight ? 'light' : 'dark');
  },

  _updateThemeUI(theme) {
    const isLight = theme === 'light';
    const topIcon = document.getElementById('top-theme-icon');
    if (topIcon) topIcon.textContent = isLight ? '🌙' : '☀️';

    const pageThemeBtn = document.getElementById('theme-toggle');
    if (pageThemeBtn) {
      if (window.i18n && window.i18n.lang === 'en') {
        pageThemeBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
      } else {
        pageThemeBtn.textContent = isLight ? '🌙 Koyu Tema' : '☀️ Açık Tema';
      }
    }
  },

  toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || localStorage.getItem('oyp_theme') || 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('oyp_theme', next);
    localStorage.setItem('theme', next);
    if (window.ThemeManager) {
      window.ThemeManager.theme = next;
    }
    this._updateThemeUI(next);
  },

  _attachThemeToggle() {
    document.addEventListener('click', (e) => {
      const btn = e.target && (e.target.id === 'theme-toggle' || e.target.closest('#theme-toggle'));
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        if (e._themeHandled) return;
        e._themeHandled = true;
        this.toggleTheme();
      }
    });
  },

  _updateGlobalGreeting() {
    const greetingEl = document.getElementById('greeting-text');
    const dateEl = document.getElementById('hero-date');

    if (greetingEl) {
      const hour = new Date().getHours();
      let greeting = "İyi günler ☀️";
      if (hour >= 6 && hour < 12) greeting = "Günaydın 🌅";
      else if (hour >= 12 && hour < 18) greeting = "İyi günler ☀️";
      else if (hour >= 18 && hour < 22) greeting = "İyi akşamlar 🌙";
      else greeting = "İyi geceler 🌌";
      greetingEl.textContent = greeting;
    }

    if (dateEl && window.DateUtils) {
      dateEl.textContent = `📅 ${DateUtils.format(new Date(), true)}`;
    }
  },

  _ensureMobileHeader() {
    if (document.getElementById('mobile-header')) return;

    const mobileHeader = document.createElement('div');
    mobileHeader.id = 'mobile-header';
    mobileHeader.className = 'mobile-header';
    mobileHeader.innerHTML = `
      <div class="mobile-header-left">
        <button id="mobile-hamburger-btn" class="hamburger-btn" type="button" aria-label="Menüyü Aç">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
        <div class="mobile-header-title">
          <span class="mobile-logo-icon"><img src="${window.location.pathname.includes('/pages/') ? '../' : ''}favicon.svg" alt="Ö" class="logo-icon-img" /></span>
          <span class="mobile-logo-text">Ömür Can</span>
        </div>
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

  _attachLogoClick() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-logo') || e.target.closest('.mobile-header-title')) {
        window.location.href = 'home.html';
      }
    });

    const sidebarLogo = document.querySelector('.sidebar-logo');
    if (sidebarLogo) sidebarLogo.style.cursor = 'pointer';
    const mobileLogo = document.querySelector('.mobile-header-title');
    if (mobileLogo) mobileLogo.style.cursor = 'pointer';
  },

  _ensureTopHeaderControls() {
    if (document.getElementById('top-controls-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'top-controls-bar';
    bar.className = 'top-controls-bar';

    const isLight = document.body.classList.contains('light-theme') || localStorage.getItem('theme') === 'light';
    const lang = (window.i18n && window.i18n.lang) || localStorage.getItem('lang') || 'tr';
    const isAdmin = window.Auth && window.Auth.canAccessHabits();

    const isLiveActive = localStorage.getItem('oyp_fb_live_active') === 'true';

    bar.innerHTML = `
      ${isAdmin ? `
        <button type="button" class="top-control-btn ${isLiveActive ? 'live-active' : ''}" id="top-live-toggle-btn" title="Fenerbahçe Canlı Skor Gösterimini Yönet (Sadece Admin)">
          ⚽ <span>Skor: ${isLiveActive ? 'AÇIK' : 'KAPALI'}</span>
        </button>
      ` : ''}
      <button type="button" class="top-control-btn" id="top-theme-btn" title="Tema Değiştir">
        <span id="top-theme-icon">${isLight ? '🌙' : '☀️'}</span>
      </button>
      <button type="button" class="top-control-btn" id="top-lang-btn" title="Dil / Language">
        🌐 <span>${lang.toUpperCase()}</span>
      </button>
      <button type="button" class="top-control-btn ${isAdmin ? 'admin-active' : ''}" id="top-admin-btn" title="${isAdmin ? 'Admin Erişimi Açık' : 'Admin Girişi'}" style="${isAdmin ? 'pointer-events: none; opacity: 0.9;' : ''}">
        ${isAdmin ? '✅ Admin' : '🔐 Giriş'}
      </button>
      ${isAdmin ? `<button type="button" class="top-control-btn top-logout-btn" id="top-logout-btn" title="Çıkış Yap">🚪 Çıkış</button>` : ''}
    `;

    document.body.appendChild(bar);

    document.getElementById('top-theme-btn').addEventListener('click', () => {
      this.toggleTheme();
    });

    document.getElementById('top-lang-btn').addEventListener('click', () => {
      const curLang = (window.i18n && window.i18n.lang) || localStorage.getItem('lang') || 'tr';
      const nextLang = curLang === 'tr' ? 'en' : 'tr';
      if (window.i18n && typeof window.i18n.setLang === 'function') {
        window.i18n.setLang(nextLang);
      } else {
        localStorage.setItem('lang', nextLang);
        window.location.reload();
      }
      const label = document.querySelector('#top-lang-btn span');
      if (label) label.textContent = nextLang.toUpperCase();
    });

    const adminBtn = document.getElementById('top-admin-btn');
    if (adminBtn && !isAdmin) {
      adminBtn.addEventListener('click', () => {
        this.openAdminAccessModal();
      });
    }

    const logoutBtn = document.getElementById('top-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.Auth && typeof window.Auth.logout === 'function') {
          window.Auth.logout();
        }
      });
    }

    const liveBtn = document.getElementById('top-live-toggle-btn');
    if (liveBtn) {
      liveBtn.addEventListener('click', () => {
        const cur = localStorage.getItem('oyp_fb_live_active') === 'true';
        const nextVal = cur ? 'false' : 'true';
        localStorage.setItem('oyp_fb_live_active', nextVal);
        window.dispatchEvent(new Event('fblive:changed'));
        this._updateLiveScoreBanner();
        this.saveLiveScoreStateToSupabase(nextVal);
      });
    }
  },

  async syncLiveScoreStateFromSupabase() {
    try {
      if (window.supabaseClient) {
        const { data, error } = await window.supabaseClient
          .from('site_settings')
          .select('value')
          .eq('key', 'oyp_fb_live_active')
          .maybeSingle();

        if (!error && data && data.value !== null && data.value !== undefined) {
          localStorage.setItem('oyp_fb_live_active', String(data.value));
          this._updateLiveScoreBanner();
        }
      }
    } catch (err) {}
  },

  async saveLiveScoreStateToSupabase(valStr) {
    try {
      if (window.supabaseClient) {
        await window.supabaseClient
          .from('site_settings')
          .upsert({ key: 'oyp_fb_live_active', value: valStr }, { onConflict: 'key' });
      }
    } catch (err) {}
  },

  _getLiveScoreData() {
    try {
      return JSON.parse(localStorage.getItem('oyp_fb_live_match_data')) || null;
    } catch {
      return null;
    }
  },

  _ensureLiveScoreBanner() {
    if (document.getElementById('fb-dynamic-island')) return;

    if (localStorage.getItem('oyp_fb_live_active') === null) {
      localStorage.setItem('oyp_fb_live_active', 'false');
    }

    const liveData = this._getLiveScoreData();
    const isMatchLive = liveData && liveData.isLive;

    const island = document.createElement('div');
    island.id = 'fb-dynamic-island';
    island.className = 'fb-dynamic-island';

    if (isMatchLive) {
      island.innerHTML = `
        <div class="island-pill-wrapper">
          <div class="island-collapsed">
            <span class="island-pulse-dot"></span>
            <span style="font-size:11px; opacity:0.85;">CANLI</span>
            <span class="island-score-text">${liveData.homeShort || 'FB'} ${liveData.scoreHome || 0} - ${liveData.scoreAway || 0} ${liveData.awayShort || 'RAKİP'}</span>
            <span style="font-size:11px; opacity:0.85;">${liveData.minute || "1'"}</span>
          </div>
          <div class="island-expanded-popover">
            <div class="island-pop-header">
              <div class="island-pop-badge"><span class="island-pulse-dot"></span> CANLI MAÇ</div>
              <div class="island-pop-league">${liveData.league || '🏆 Trendyol Süper Lig'}</div>
            </div>
            <div class="island-pop-scoreboard">
              <div class="island-pop-team">
                <span style="white-space:nowrap;">${liveData.homeIcon || '💛💙'}</span>
                <span style="color:#F3B200; white-space:nowrap;">${liveData.home || 'Fenerbahçe'}</span>
              </div>
              <div class="island-pop-score">${liveData.scoreHome || 0} - ${liveData.scoreAway || 0}</div>
              <div class="island-pop-team">
                <span style="white-space:nowrap;">${liveData.away || 'Rakip Takım'}</span>
                <span style="white-space:nowrap;">${liveData.awayIcon || '⚽'}</span>
              </div>
            </div>
            <div class="island-pop-info">
              <span>⏱️ ${liveData.minute || "1'"}</span>
              <span>🏟️ ${liveData.stadium || 'Kadıköy'}</span>
            </div>
            <div class="island-pop-goals-split">
              <div class="home-goals">
                ${(liveData.goalsHome || []).map(g => `<div>⚽ ${g}</div>`).join('') || '<div style="opacity:0.5;">-</div>'}
              </div>
              <div class="away-goals">
                ${(liveData.goalsAway || []).map(g => `<div>${g} ⚽</div>`).join('') || '<div style="opacity:0.5;">-</div>'}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      island.innerHTML = `
        <div class="island-pill-wrapper">
          <div class="island-collapsed" style="border-color: rgba(243, 178, 0, 0.4);">
            <span style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block;"></span>
            <span style="font-size:12px; font-weight:700; color:#F3B200;">Fenerbahçe</span>
            <span style="font-size:11px; opacity:0.85;">Maç Yok</span>
          </div>
          <div class="island-expanded-popover">
            <div class="island-pop-header">
              <div class="island-pop-badge" style="background:rgba(16, 185, 129, 0.15); border-color:rgba(16, 185, 129, 0.4); color:#34d399;">
                <span style="width:7px; height:7px; border-radius:50%; background:#34d399; display:inline-block;"></span> BİLGİ
              </div>
              <div class="island-pop-league">🏆 Trendyol Süper Lig 1. Hafta</div>
            </div>
            <div style="font-size:13px; font-weight:700; color:#F3B200; margin-bottom:10px;">
              Şu anda devam eden canlı maç bulunmuyor.
            </div>
            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:12px; font-size:12px; line-height:1.6;">
              <div style="font-size:11px; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Sıradaki Karşılaşma</div>
              <div style="font-size:14px; font-weight:800; color:white; display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                <span>🔴⚫ Gençlerbirliği</span>
                <span style="color:#F3B200; font-size:12px;">vs</span>
                <span>Fenerbahçe 💛💙</span>
              </div>
              <div style="color:rgba(255,255,255,0.85); display:flex; justify-content:space-between; font-size:11px;">
                <span>📅 15 Ağustos 2026, Cumartesi 21:30</span>
                <span>🏟️ Eryaman Stadyumu</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const hero = document.querySelector('.welcome-hero');
    if (hero) {
      hero.prepend(island);
    } else {
      const mainApp = document.querySelector('.app-layout') || document.body;
      if (mainApp) mainApp.prepend(island);
    }

    this._updateLiveScoreBanner();
  },

  async _updateLiveScoreBanner() {
    let saved = localStorage.getItem('oyp_fb_live_active');
    if (saved === null) {
      saved = 'false';
      localStorage.setItem('oyp_fb_live_active', 'false');
    }
    const isLiveActive = saved === 'true';

    const island = document.getElementById('fb-dynamic-island');
    if (island) {
      island.classList.toggle('active', isLiveActive);
    }

    const liveBtn = document.getElementById('top-live-toggle-btn');
    if (liveBtn) {
      liveBtn.classList.toggle('live-active', isLiveActive);
      const span = liveBtn.querySelector('span');
      if (span) span.textContent = `Skor: ${isLiveActive ? 'AÇIK' : 'KAPALI'}`;
    }

    if (isLiveActive && window.LiveFootballAPI) {
      try {
        const realData = await window.LiveFootballAPI.fetchLiveMatch();
        if (realData) {
          localStorage.setItem('oyp_fb_live_match_data', JSON.stringify(realData));
        }
      } catch (err) {}
    }
  },

  _ensureFooter() {
    const mainContent = document.querySelector('.main-content') || document.querySelector('.app-layout') || document.body;
    if (!mainContent || document.getElementById('site-footer')) return;

    const footer = document.createElement('footer');
    footer.id = 'site-footer';
    footer.className = 'site-footer';
    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="footer-content">
        <a href="home.html" class="footer-brand">
          <div class="logo-icon"><img src="${window.location.pathname.includes('/pages/') ? '../' : ''}favicon.svg" alt="Ö" class="logo-icon-img" /></div>
          <div>
            <div class="footer-brand-title">Ömür Can Yılmaz</div>
            <div class="footer-brand-sub">Kişisel Web Portalı & Panosu</div>
          </div>
        </a>
        <ul class="footer-links">
          <li><a href="home.html">🏠 Ana Sayfa</a></li>
          <li><a href="habits.html">✅ Alışkanlıklar</a></li>
          <li><a href="projects.html">🚀 Projelerim</a></li>
          <li><a href="travels.html">✈️ Gezilerim</a></li>
          <li><a href="books.html">📚 Kitaplar</a></li>
          <li><a href="media.html">🎮 Medya & Eğlence</a></li>
          <li><a href="contact.html">📬 İletişim</a></li>
        </ul>
      </div>
      <div class="footer-bottom">
        <div>© ${year} Ömür Can Yılmaz. Tüm hakları saklıdır.</div>
        <div style="display:flex; gap:16px;">
          <a href="https://github.com/omurcan533" target="_blank" rel="noopener" style="color:var(--text-muted); text-decoration:none;">GitHub</a>
          <a href="https://omurcanyilmaz.com" target="_blank" rel="noopener" style="color:var(--text-muted); text-decoration:none;">omurcanyilmaz.com</a>
        </div>
      </div>
    `;

    mainContent.appendChild(footer);
  },

  _updateAdminAccessButton() {
    const btn = document.getElementById('admin-access-btn');
    const topAdminBtn = document.getElementById('top-admin-btn');
    const active = Auth.canAccessHabits();

    if (btn) {
      btn.textContent = active ? '✅ Admin Erişimi' : '🔐 Admin Girişi';
      btn.classList.toggle('is-active', active);
    }
    if (topAdminBtn) {
      topAdminBtn.innerHTML = active ? '✅ Admin' : '🔐 Giriş';
      topAdminBtn.classList.toggle('admin-active', active);
    }
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

        window.location.reload();
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
    overlay.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
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

// ===== CONFIRMATION MODAL HELPER =====
const Confirm = {
  show({ title = 'Emin misiniz?', message = 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?', confirmText = 'Evet, Sil', cancelText = 'İptal', danger = true } = {}) {
    return new Promise((resolve) => {
      let modalOverlay = document.getElementById('custom-confirm-modal');
      if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'custom-confirm-modal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.zIndex = '999999';
        modalOverlay.innerHTML = `
          <div class="modal-card" style="max-width: 400px; text-align: center; padding: 28px 24px; border: 1px solid var(--glass-border); background: var(--bg-card); backdrop-filter: blur(20px); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);">
            <div id="confirm-modal-icon" style="font-size: 44px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(251, 113, 133, 0.4));">🗑️</div>
            <h3 id="confirm-modal-title" class="modal-title" style="font-size: 19px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);"></h3>
            <p id="confirm-modal-message" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;"></p>
            <div style="display: flex; gap: 12px; justify-content: center;">
              <button type="button" id="confirm-modal-cancel" class="btn btn-ghost" style="flex: 1; padding: 10px 16px; font-weight: 600;">İptal</button>
              <button type="button" id="confirm-modal-ok" class="btn btn-primary" style="flex: 1; padding: 10px 16px; font-weight: 600;"></button>
            </div>
          </div>
        `;
        document.body.appendChild(modalOverlay);
      }

      document.getElementById('confirm-modal-title').textContent = title;
      document.getElementById('confirm-modal-message').textContent = message;

      const okBtn = document.getElementById('confirm-modal-ok');
      const cancelBtn = document.getElementById('confirm-modal-cancel');

      okBtn.textContent = confirmText;
      cancelBtn.textContent = cancelText;

      if (danger) {
        okBtn.style.background = 'linear-gradient(135deg, #ef4444, #be123c)';
        okBtn.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.4)';
        okBtn.style.borderColor = 'transparent';
      } else {
        okBtn.style.background = '';
        okBtn.style.boxShadow = '';
        okBtn.style.borderColor = '';
      }

      const close = (result) => {
        modalOverlay.classList.remove('open');
        okBtn.onclick = null;
        cancelBtn.onclick = null;
        modalOverlay.onclick = null;
        resolve(result);
      };

      okBtn.onclick = (e) => {
        e.stopPropagation();
        close(true);
      };

      cancelBtn.onclick = (e) => {
        e.stopPropagation();
        close(false);
      };

      modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) close(false);
      };

      setTimeout(() => modalOverlay.classList.add('open'), 10);
    });
  }
};

function setButtonLoading(btn, isLoading, loadingText = '') {
  if (!btn) return;
  if (isLoading) {
    if (!btn.dataset.originalHtml) {
      btn.dataset.originalHtml = btn.innerHTML;
    }
    btn.disabled = true;
    btn.classList.add('is-loading');
    const label = loadingText || btn.textContent.trim() || 'İşleniyor...';
    btn.innerHTML = `<span class="btn-spinner"></span> <span>${label}</span>`;
  } else {
    btn.disabled = false;
    btn.classList.remove('is-loading');
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.originalHtml;
    }
  }
}

window.Nav = Nav;
window.Toast = Toast;
window.Modal = Modal;
window.Confirm = Confirm;
window.DateUtils = DateUtils;
window.setButtonLoading = setButtonLoading;
window.openAdminAccessModal = () => Nav.openAdminAccessModal();
