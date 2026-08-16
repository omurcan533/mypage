/**
 * TelegramService - Ömür Can Kişisel Asistanı Telegram Bildirim Servisi
 * Telegram Bot API Entegrasyonu (Etkinlikler, Maçlar ve Doğum Günleri)
 */

const TG_SETTINGS_KEY = 'oyp_telegram_settings';

window.TelegramService = {
  getSettings() {
    try {
      const raw = localStorage.getItem(TG_SETTINGS_KEY);
      return JSON.parse(raw) || { botToken: '', chatId: '', isAutoActive: true };
    } catch (e) {
      return { botToken: '', chatId: '', isAutoActive: true };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(TG_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  },

  isConfigured() {
    const s = this.getSettings();
    return Boolean(s.botToken && s.botToken.trim() && s.chatId && s.chatId.trim());
  },

  /**
   * Telegram'a HTML formatında mesaj gönderir (CORS Preflight ve boşluk sorunlarını engeller)
   */
  async sendMessage(htmlMessage) {
    const s = this.getSettings();
    if (!s.botToken || !s.chatId) {
      console.warn('Telegram Bot Token veya Chat ID yapılandırılmamış.');
      return { success: false, error: 'Telegram ayarları eksik. Lütfen Bot Token ve Chat ID girin.' };
    }

    // Token ve Chat ID'deki yanlışlıkla girilmiş tüm boşlukları temizle
    const cleanToken = s.botToken.replace(/\s+/g, '');
    const cleanChatId = s.chatId.replace(/\s+/g, '');
    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

    try {
      // 1. Yöntem: URLSearchParams (Tarayıcıda CORS OPTIONS preflight tetiklemez)
      const params = new URLSearchParams();
      params.append('chat_id', cleanChatId);
      params.append('text', htmlMessage);
      params.append('parse_mode', 'HTML');
      params.append('disable_web_page_preview', 'true');

      const res = await fetch(url, {
        method: 'POST',
        body: params
      });

      const json = await res.json();
      if (json.ok) {
        return { success: true, data: json.result };
      } else {
        return { success: false, error: json.description || 'Telegram API hatası' };
      }
    } catch (err) {
      // 2. Yöntem Fallback: GET İsteği
      try {
        const getUrl = `${url}?chat_id=${encodeURIComponent(cleanChatId)}&text=${encodeURIComponent(htmlMessage)}&parse_mode=HTML&disable_web_page_preview=true`;
        const getRes = await fetch(getUrl);
        const getJson = await getRes.json();
        if (getJson.ok) {
          return { success: true, data: getJson.result };
        } else {
          return { success: false, error: getJson.description || 'Telegram API hatası' };
        }
      } catch (getErr) {
        return { success: false, error: err.message || 'Telegram sunucusuna bağlanılamadı' };
      }
    }
  },

  /**
   * Bugünkü Fenerbahçe Maçını Bulur
   */
  getTodayMatchInfo() {
    const today = new Date();
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const todayMatchDayStr = `${today.getDate()} ${months[today.getMonth()]}`;

    const fixtures = [
      { date: "18 Ağustos 2026", time: "22:00", comp: "UEFA Şampiyonlar Ligi Play-Off", home: "Fenerbahçe", away: "Lyon", venue: "Ülker Stadyumu Kadıköy" },
      { date: "22 Ağustos 2026", time: "21:30", comp: "Trendyol Süper Lig 2. Hafta", home: "Fenerbahçe", away: "Konyaspor", venue: "Kadıköy" },
      { date: "26 Ağustos 2026", time: "22:00", comp: "UEFA Şampiyonlar Ligi Play-Off Rövanş", home: "Lyon", away: "Fenerbahçe", venue: "Groupama Stadium (Deplasman)" },
      { date: "30 Ağustos 2026", time: "21:30", comp: "Trendyol Süper Lig 3. Hafta", home: "Samsunspor", away: "Fenerbahçe", venue: "Samsun (Deplasman)" }
    ];

    return fixtures.find(f => f.date.includes(todayMatchDayStr));
  },

  /**
   * Günlük / Haftalık Asistan Özeti Oluşturur ve Gönderir
   */
  async sendDailyDigest() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    const formattedToday = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}, ${dayNames[today.getDay()]}`;

    // 1. Etkinlikleri Çek
    let allEvents = [];
    if (window.EventsAPI) {
      allEvents = await window.EventsAPI.fetchEvents();
    }
    const todayEvents = allEvents.filter(e => !e.is_completed && e.event_date === todayStr);
    const upcomingThisWeek = allEvents.filter(e => {
      if (e.is_completed || e.event_date === todayStr) return false;
      const d = new Date(e.event_date + 'T00:00:00');
      const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
      return diff > 0 && diff <= 7;
    });

    // 2. Doğum Günlerini Çek
    let upcomingBirthdays = [];
    if (window.BirthdaysAPI) {
      upcomingBirthdays = await window.BirthdaysAPI.getUpcomingBirthdays(3);
    }

    // 3. Fenerbahçe Maçı Kontrolü
    const todayMatch = this.getTodayMatchInfo();

    // Mesaj Oluştur
    let msg = `👋 <b>Merhaba Ömür Can!</b>\n`;
    msg += `📅 <b>Günlük Asistan Raporu — ${formattedToday}</b>\n\n`;

    // Maç Vurgusu (En Üstte)
    if (todayMatch) {
      msg += `⚽🔥 <b>BUGÜN FENERBAHÇE MAÇI VAR!</b>\n`;
      msg += `🏆 <b>Karşılaşma:</b> ${todayMatch.home} vs ${todayMatch.away}\n`;
      msg += `⏰ <b>Saat:</b> ${todayMatch.time}\n`;
      msg += `🏟️ <b>Stad:</b> ${todayMatch.venue}\n`;
      msg += `📌 <b>Turnuva:</b> ${todayMatch.comp}\n\n`;
    }

    // Bugünkü Planlar
    msg += `📍 <b>Bugünkü Planların:</b>\n`;
    if (todayEvents.length > 0) {
      todayEvents.forEach(e => {
        msg += `• <b>${e.title}</b> (${e.category})\n`;
        if (e.event_time) msg += `  ⏰ Saat: ${e.event_time}\n`;
        if (e.location) msg += `  📍 Yer: ${e.location}\n`;
        if (e.with_whom) msg += `  👥 Kiminle: ${e.with_whom}\n`;
        if (e.notes) msg += `  💡 Not: ${e.notes}\n`;
      });
    } else {
      msg += `<i>Bugün için planlanmış özel bir etkinliğin yok.</i>\n`;
    }
    msg += `\n`;

    // Bu Haftaki Yaklaşan Planlar
    if (upcomingThisWeek.length > 0) {
      msg += `🗓️ <b>Bu Haftaki Yaklaşan Aktivitelerin:</b>\n`;
      upcomingThisWeek.forEach(e => {
        const d = new Date(e.event_date + 'T00:00:00');
        const dName = dayNames[d.getDay()];
        msg += `• <b>${e.title}</b> — ${d.getDate()} ${monthNames[d.getMonth()]} (${dName})\n`;
        if (e.location) msg += `  📍 ${e.location} | ⏰ ${e.event_time || ''}\n`;
      });
      msg += `\n`;
    }

    // Yaklaşan Doğum Günleri
    if (upcomingBirthdays.length > 0) {
      msg += `🎂 <b>Yaklaşan Doğum Günleri:</b>\n`;
      upcomingBirthdays.forEach(b => {
        const status = b.daysLeft === 0 ? '🔥 BUGÜN!' : (b.daysLeft === 1 ? '⚡ Yarın' : `${b.daysLeft} gün kaldı`);
        msg += `• <b>${b.name}</b> (${b.formattedDate}) — <b>${status}</b> (${b.nextAge}. yaş)\n`;
        if (b.gift_ideas) msg += `  🎁 Hediye Fikri: ${b.gift_ideas}\n`;
      });
      msg += `\n`;
    }

    msg += `✨ <i>Harika ve verimli bir gün dilerim!</i>`;

    const res = await this.sendMessage(msg);
    if (res && res.success) {
      localStorage.setItem('oyp_tg_last_sent_date', todayStr);
    }
    return res;
  },

  /**
   * Sayfa açıldığında günde 1 kez otomatik gönderme kontrolü
   */
  async checkAndAutoSendDailyDigest() {
    const s = this.getSettings();
    if (!s.isAutoActive || !this.isConfigured()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastSentKey = 'oyp_tg_last_sent_date';
    const lastSent = localStorage.getItem(lastSentKey);

    if (lastSent !== todayStr) {
      // Sayfa açıldıktan 3 saniye sonra arka planda sessizce gönder
      setTimeout(async () => {
        try {
          await this.sendDailyDigest();
        } catch (e) {}
      }, 3000);
    }
  },

  /**
   * Doğum Günü için Özel E-posta / Telegram Uyarısı
   */
  async sendBirthdayAlert(birthday) {
    let msg = `🎂🎉 <b>DOĞUM GÜNÜ HATIRLATMASI!</b>\n\n`;
    msg += `👤 <b>${birthday.name}</b>\n`;
    msg += `📅 <b>Tarih:</b> ${birthday.formattedDate} (${birthday.daysLeft === 0 ? 'BUGÜN!' : birthday.daysLeft + ' gün kaldı'})\n`;
    msg += `🎈 <b>Gireceği Yaş:</b> ${birthday.nextAge}\n`;
    if (birthday.relationship) msg += `👥 <b>Yakınlık:</b> ${birthday.relationship}\n`;
    if (birthday.gift_ideas) msg += `🎁 <b>Hediye Fikirleri:</b> ${birthday.gift_ideas}\n`;
    if (birthday.notes) msg += `💡 <b>Not:</b> ${birthday.notes}\n\n`;
    msg += `📧 <i>yilmazomurcan@gmail.com adresine de iletildi.</i>`;

    return await this.sendMessage(msg);
  }
};

// Sayfa yüklendiğinde otomatik günlük kontrolü başlat
document.addEventListener('DOMContentLoaded', () => {
  if (window.TelegramService) {
    window.TelegramService.checkAndAutoSendDailyDigest();
  }
});
