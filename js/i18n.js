const I18N_KEY = 'oyp_lang';
const THEME_KEY = 'oyp_theme';

const dictionary = {
  tr: {
    // Navigation & Sidebar
    nav_home: "Ana Sayfa",
    nav_habits: "Alışkanlıklar",
    nav_projects: "Projeler",
    nav_travels: "Geziler",
    nav_english: "İngilizce",
    nav_contact: "İletişim",
    nav_logout: "Çıkış Yap",
    nav_personal_space: "Kişisel Alan",
    nav_navigation: "Navigasyon",

    // Common / Global
    save: "Kaydet",
    cancel: "İptal",
    edit: "Düzenle",
    delete: "Sil",
    today: "Bugün",
    all: "Tümü",
    active: "Aktif",
    completed: "Tamamlandı",
    paused: "Beklemede",
    add: "Ekle",
    
    // Login
    login_welcome: "Hoş Geldin",
    login_subtitle: "omurcanyilmaz.com · Kişisel Alan",
    login_username: "Kullanıcı Adı",
    login_password: "Şifre",
    login_remember: "Beni hatırla (30 gün)",
    login_button: "Giriş Yap →",
    login_loading: "⟳ Giriş yapılıyor...",
    login_error: "Kullanıcı adı veya şifre hatalı.",
    login_footer: "© 2026 Ömür Can Yılmaz · Tüm hakları saklıdır",
    login_redirect: "✓ Yönlendiriliyor...",
    
    // Home
    home_greeting_morning: "Günaydın ☀️",
    home_greeting_afternoon: "İyi öğleden sonra 🌤",
    home_greeting_evening: "İyi akşamlar 🌙",
    home_greeting_night: "Gece yarısı 🌌",
    home_welcome_title: "Hoş geldin,",
    home_welcome_desc: "Sayfama hoş geldin. Geliştirmelerim devam ediyor, takipte kalın!",
    home_quick_habits: "✅ Alışkanlıklara Git",
    home_quick_projects: "🚀 Projelerim",
    home_quick_travels: "✈️ Gezilerim",
    home_quick_cv: "📄 CV'mi İndir",
    home_stat_active: "Aktif Alışkanlık",
    home_stat_streak: "Günlük Seri",
    home_stat_done: "Toplam Tamamlanan",
    home_stat_rate: "Bu Ay Başarı Oranı",
    home_today_title: "☀️ Bugünün Alışkanlıkları",
    home_today_all: "Tümünü gör →",
    home_today_done: "Tamamlandı",
    home_today_empty: "Henüz alışkanlık yok",
    home_today_add: "Alışkanlık ekle →",
    home_activity_title: "⚡ Son Aktivite",
    home_activity_empty: "Henüz aktivite yok",
    home_activity_sub: "Alışkanlıklarını tamamlamaya başla!",
    
    // Habits
    habits_title: "Alışkanlıklar",
    habits_subtitle: "Alışkanlıklarını günlük, haftalık ve aylık olarak takip et",
    habits_stat_total: "Toplam Alışkanlık",
    habits_stat_today: "Bugün",
    habits_view_monthly: "Aylık",
    habits_view_weekly: "Haftalık",
    habits_view_daily: "Günlük",
    habits_btn_add: "＋ Alışkanlık Ekle",
    habits_sb_streak: "🔥 Seri",
    habits_sb_90days: "📊 Son 90 Gün",
    habits_sb_list: "📋 Alışkanlıklarım",
    habits_add_title: "✨ Yeni Alışkanlık",
    habits_edit_title: "✏️ Alışkanlığı Düzenle",
    habits_input_name: "Alışkanlık Adı",
    habits_input_icon: "İkon",
    habits_input_color: "Renk",
    habits_input_freq: "Sıklık",
    freq_daily: "Her Gün",
    freq_weekdays: "Hafta İçi",
    freq_weekend: "Hafta Sonu",
    freq_custom: "Özel",
    habits_modal_note_label: "📝 Günlük Not",
    habits_modal_note_ph: "Bu gün hakkında bir not bırak...",
    
    // Projects
    projects_title: "🚀 Projeler",
    projects_subtitle: "Geliştirdiğim ve üzerinde çalıştığım projeler",
    projects_btn_add: "＋ Proje Ekle",
    projects_empty: "Henüz proje yok",
    projects_empty_sub: "İlk projeyi ekle!",
    projects_add_title: "🚀 Yeni Proje",
    projects_edit_title: "✏️ Projeyi Düzenle",
    projects_input_name: "Proje Adı",
    projects_input_status: "Durum",
    projects_input_desc: "Açıklama",
    projects_input_tech: "Teknolojiler (virgülle ayır)",
    
    // Travels
    travels_title: "✈️ Geziler",
    travels_subtitle: "Gittiğim yerler, anılar ve keşifler",
    travels_btn_add: "＋ Gezi Ekle",
    travels_stat_trips: "Gezi",
    travels_stat_countries: "Ülke",
    travels_stat_cities: "Şehir",
    travels_stat_continents: "Kıta",
    travels_empty: "Henüz gezi yok",
    travels_empty_sub: "İlk gezini ekle ve anılarını kaydet!",
    travels_add_title: "✈️ Yeni Gezi",
    travels_edit_title: "✏️ Geziyi Düzenle",
    travels_input_city: "Şehir",
    travels_input_country: "Ülke",
    travels_input_continent: "Kıta",
    travels_input_rating: "Puan (1-5)",
    travels_input_note: "Not / Anı",
    travels_input_tags: "Etiketler (virgülle ayır)",
    
    // Contact
    contact_title: "📬 İletişim",
    contact_subtitle: "Benimle iletişime geç",
    contact_bio: "Yazılım geliştirici, gezgin ve sürekli öğrenen biri. Teknolojiyle hayatı birleştirmeyi seven biri.",
    contact_avail: "Yeni fırsatlara açık",
    contact_form_title: "💬 Mesaj Gönder",
    contact_form_name: "Adınız",
    contact_form_subject: "Konu",
    contact_form_message: "Mesaj",
    contact_btn_send: "📨 Mesaj Gönder",
    contact_note: "💡 Not: Form şu an mailto bağlantısı kullanıyor. EmailJS entegrasyonu kurulduktan sonra direkt gönderim aktif olacak."
  },
  en: {
    // Navigation & Sidebar
    nav_home: "Home",
    nav_habits: "Habits",
    nav_projects: "Projects",
    nav_travels: "Travels",
    nav_english: "English",
    nav_contact: "Contact",
    nav_logout: "Logout",
    nav_personal_space: "Personal Space",
    nav_navigation: "Navigation",

    // Common / Global
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    today: "Today",
    all: "All",
    active: "Active",
    completed: "Completed",
    paused: "Paused",
    add: "Add",
    
    // Login
    login_welcome: "Welcome",
    login_subtitle: "omurcanyilmaz.com · Personal Area",
    login_username: "Username",
    login_password: "Password",
    login_remember: "Remember me (30 days)",
    login_button: "Sign In →",
    login_loading: "⟳ Signing in...",
    login_error: "Invalid username or password.",
    login_footer: "© 2026 Ömür Can Yılmaz · All rights reserved",
    login_redirect: "✓ Redirecting...",
    
    // Home
    home_greeting_morning: "Good morning ☀️",
    home_greeting_afternoon: "Good afternoon 🌤",
    home_greeting_evening: "Good evening 🌙",
    home_greeting_night: "Midnight 🌌",
    home_welcome_title: "Welcome,",
    home_welcome_desc: "Welcome to your personal dashboard. Track your habits, manage projects, and organize your life.",
    home_quick_habits: "✅ Go to Habits",
    home_quick_projects: "🚀 My Projects",
    home_quick_travels: "✈️ My Travels",
    home_quick_cv: "📄 Download CV",
    home_stat_active: "Active Habits",
    home_stat_streak: "Daily Streak",
    home_stat_done: "Total Completed",
    home_stat_rate: "Success Rate (This Month)",
    home_today_title: "☀️ Today's Habits",
    home_today_all: "View all →",
    home_today_done: "Completed",
    home_today_empty: "No habits yet",
    home_today_add: "Add habit →",
    home_activity_title: "⚡ Recent Activity",
    home_activity_empty: "No activity yet",
    home_activity_sub: "Start completing your habits!",
    
    // Habits
    habits_title: "Habits",
    habits_subtitle: "Track your habits daily, weekly and monthly",
    habits_stat_total: "Total Habits",
    habits_stat_today: "Today",
    habits_view_monthly: "Monthly",
    habits_view_weekly: "Weekly",
    habits_view_daily: "Daily",
    habits_btn_add: "＋ Add Habit",
    habits_sb_streak: "🔥 Streak",
    habits_sb_90days: "📊 Last 90 Days",
    habits_sb_list: "📋 My Habits",
    habits_add_title: "✨ New Habit",
    habits_edit_title: "✏️ Edit Habit",
    habits_input_name: "Habit Name",
    habits_input_icon: "Icon",
    habits_input_color: "Color",
    habits_input_freq: "Frequency",
    freq_daily: "Every Day",
    freq_weekdays: "Weekdays",
    freq_weekend: "Weekends",
    freq_custom: "Custom",
    habits_modal_note_label: "📝 Daily Note",
    habits_modal_note_ph: "Leave a note about this day...",
    
    // Projects
    projects_title: "🚀 Projects",
    projects_subtitle: "Projects I develop and work on",
    projects_btn_add: "＋ Add Project",
    projects_empty: "No projects yet",
    projects_empty_sub: "Add your first project!",
    projects_add_title: "🚀 New Project",
    projects_edit_title: "✏️ Edit Project",
    projects_input_name: "Project Name",
    projects_input_status: "Status",
    projects_input_desc: "Description",
    projects_input_tech: "Technologies (comma separated)",
    
    // Travels
    travels_title: "✈️ Travels",
    travels_subtitle: "Places I've visited, memories and discoveries",
    travels_btn_add: "＋ Add Travel",
    travels_stat_trips: "Trips",
    travels_stat_countries: "Countries",
    travels_stat_cities: "Cities",
    travels_stat_continents: "Continents",
    travels_empty: "No trips yet",
    travels_empty_sub: "Add your first trip and save memories!",
    travels_add_title: "✈️ New Travel",
    travels_edit_title: "✏️ Edit Travel",
    travels_input_city: "City",
    travels_input_country: "Country",
    travels_input_continent: "Continent",
    travels_input_rating: "Rating (1-5)",
    travels_input_note: "Note / Memory",
    travels_input_tags: "Tags (comma separated)",
    
    // Contact
    contact_title: "📬 Contact",
    contact_subtitle: "Get in touch with me",
    contact_bio: "Software developer, traveler and constant learner. Someone who loves to combine life with technology.",
    contact_avail: "Open to new opportunities",
    contact_form_title: "💬 Send Message",
    contact_form_name: "Your Name",
    contact_form_subject: "Subject",
    contact_form_message: "Message",
    contact_btn_send: "📨 Send Message",
    contact_note: "💡 Note: Form currently uses a mailto link. Direct sending will be active after EmailJS integration."
  }
};

const i18n = {
  lang: localStorage.getItem(I18N_KEY) || 'tr',
  
  setLang(newLang) {
    if (['tr', 'en'].includes(newLang)) {
      this.lang = newLang;
      localStorage.setItem(I18N_KEY, newLang);
      this.updateDOM();
    }
  },
  
  t(key) {
    return dictionary[this.lang][key] || key;
  },
  
  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dictionary[this.lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if(el.getAttribute('placeholder')) {
             el.setAttribute('placeholder', dictionary[this.lang][key]);
          } else if (el.type === 'button' || el.type === 'submit') {
             el.value = dictionary[this.lang][key];
          } else {
             // Avoid overwriting actual input values if it's text
             if (!el.value) el.value = dictionary[this.lang][key];
          }
        } else {
          el.innerHTML = dictionary[this.lang][key];
        }
      }
    });
    
    // Update language toggle buttons if they exist
    const trBtn = document.getElementById('lang-tr');
    const enBtn = document.getElementById('lang-en');
    if (trBtn && enBtn) {
       trBtn.classList.toggle('active', this.lang === 'tr');
       enBtn.classList.toggle('active', this.lang === 'en');
    }
    
    // Dispatch custom event so other scripts can re-render if needed
    window.dispatchEvent(new Event('languageChanged'));
  }
};

const ThemeManager = {
  get theme() {
    return localStorage.getItem(THEME_KEY) || localStorage.getItem('theme') || 'dark';
  },
  set theme(val) {
    localStorage.setItem(THEME_KEY, val);
    localStorage.setItem('theme', val);
  },
  
  init() {
    this.applyTheme();
  },
  
  applyTheme() {
    const t = this.theme;
    document.documentElement.setAttribute('data-theme', t);
    document.body.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    localStorage.setItem('theme', t);
    this.updateButtonText();
    if (window.Nav && typeof window.Nav._updateThemeUI === 'function') {
      window.Nav._updateThemeUI(t);
    }
  },
  
  toggleTheme() {
    const next = this.theme === 'light' ? 'dark' : 'light';
    this.theme = next;
    this.applyTheme();
  },

  updateButtonText() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      if(i18n.lang === 'tr') {
         btn.innerHTML = this.theme === 'light' ? '🌙 Koyu Tema' : '☀️ Açık Tema';
      } else {
         btn.innerHTML = this.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
      }
    }
  }
};

window.i18n = i18n;
window.ThemeManager = ThemeManager;

// Apply theme ASAP (to avoid flash)
ThemeManager.applyTheme();

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  i18n.updateDOM();
  ThemeManager.init();
  
  // Re-update theme button text when language changes
  window.addEventListener('languageChanged', () => {
    ThemeManager.updateButtonText();
  });
});
