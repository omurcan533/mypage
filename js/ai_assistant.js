/**
 * AIAssistant - Ömür Can Kişisel Yapay Zeka Asistanı Widget'ı
 * Etkinlikleri, Doğum Günlerini, Alışkanlıkları ve Maçları Anlık Sorgular
 */

(function () {
  const AIAssistant = {
    isOpen: false,
    messages: [],

    init() {
      if (document.getElementById('ai-assistant-root')) return;
      this._injectStyles();
      this._injectWidget();
      this._attachEvents();
    },

    _injectStyles() {
      if (!document.getElementById('ai-assistant-css-link')) {
        const link = document.createElement('link');
        link.id = 'ai-assistant-css-link';
        link.rel = 'stylesheet';
        link.href = '../css/ai_assistant.css';
        document.head.appendChild(link);
      }
    },

    _injectWidget() {
      const root = document.createElement('div');
      root.id = 'ai-assistant-root';
      root.className = 'ai-assistant-wrapper';

      root.innerHTML = `
        <button type="button" class="ai-trigger-btn" id="ai-trigger-btn" title="Yapay Zeka Asistanına Sor">
          🤖
          <span class="ai-trigger-badge"></span>
        </button>

        <div class="ai-chat-window" id="ai-chat-window">
          <div class="ai-chat-header">
            <div class="ai-header-info">
              <div class="ai-avatar">🤖</div>
              <div>
                <div class="ai-title">Ömür'ün AI Asistanı</div>
                <div class="ai-subtitle">Çevrimiçi · Etkinlik & Plan Uzmanı</div>
              </div>
            </div>
            <button type="button" class="ai-close-btn" id="ai-close-btn">✕</button>
          </div>

          <div class="ai-chat-body" id="ai-chat-body">
            <div class="ai-msg bot">
              <div class="ai-bubble">
                👋 Merhaba Ömür Can! Ben senin kişisel asistanınım.<br><br>
                Bana istediğin günün planlarını, yaklaşan maçları veya sevdiklerinin doğum günlerini sorabilirsin.
              </div>
            </div>
          </div>

          <div class="ai-quick-chips">
            <button type="button" class="ai-chip-btn" data-q="Bu hafta sonu ne planım var?">📅 Bu hafta sonu?</button>
            <button type="button" class="ai-chip-btn" data-q="Sıradaki Fenerbahçe maçı ne zaman?">⚽ Sıradaki maç?</button>
            <button type="button" class="ai-chip-btn" data-q="Kimin doğum günü yaklaşıyor?">🎂 Doğum günleri?</button>
            <button type="button" class="ai-chip-btn" data-q="Bugün hangi etkinliklerim var?">📌 Bugünkü planlarım?</button>
          </div>

          <form class="ai-chat-footer" id="ai-chat-form">
            <input type="text" class="ai-input" id="ai-chat-input" placeholder="Etkinlik veya maç sor..." autocomplete="off" />
            <button type="submit" class="ai-send-btn" id="ai-send-btn">➤</button>
          </form>
        </div>
      `;

      document.body.appendChild(root);
    },

    _attachEvents() {
      const triggerBtn = document.getElementById('ai-trigger-btn');
      const closeBtn = document.getElementById('ai-close-btn');
      const chatWindow = document.getElementById('ai-chat-window');
      const form = document.getElementById('ai-chat-form');
      const input = document.getElementById('ai-chat-input');

      triggerBtn.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('open', this.isOpen);
        if (this.isOpen) {
          input.focus();
        }
      });

      closeBtn.addEventListener('click', () => {
        this.isOpen = false;
        chatWindow.classList.remove('open');
      });

      // Quick Chips Click
      document.querySelectorAll('.ai-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.q;
          if (q) {
            this.handleUserMessage(q);
          }
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.handleUserMessage(text);
      });
    },

    async handleUserMessage(text) {
      this.appendMessage('user', text);

      // Bot Düşünme Göstergesi
      const typingId = this.appendTyping();

      // Akıllı Yanıt Üret
      const answer = await this.generateSmartResponse(text);

      this.removeTyping(typingId);
      this.appendMessage('bot', answer);
    },

    appendMessage(sender, text) {
      const body = document.getElementById('ai-chat-body');
      const msgEl = document.createElement('div');
      msgEl.className = `ai-msg ${sender}`;
      msgEl.innerHTML = `<div class="ai-bubble">${text}</div>`;
      body.appendChild(msgEl);
      body.scrollTop = body.scrollHeight;
    },

    appendTyping() {
      const body = document.getElementById('ai-chat-body');
      const id = 'ai-typing-' + Date.now();
      const msgEl = document.createElement('div');
      msgEl.id = id;
      msgEl.className = 'ai-msg bot';
      msgEl.innerHTML = `<div class="ai-bubble" style="color: var(--text-muted);">🤖 Düşünüyor & takvim kontrol ediliyor...</div>`;
      body.appendChild(msgEl);
      body.scrollTop = body.scrollHeight;
      return id;
    },

    removeTyping(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    },

    /**
     * Akıllı Doğal Dil ve Veritabanı Tarama Motoru
     */
    async generateSmartResponse(query) {
      const q = query.toLowerCase()
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c')
        .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u');

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Veritabanlarını Çek
      let events = [];
      let birthdays = [];

      if (window.EventsAPI) {
        try { events = await window.EventsAPI.fetchEvents(); } catch (e) {}
      }
      if (window.BirthdaysAPI) {
        try { birthdays = await window.BirthdaysAPI.fetchBirthdays(); } catch (e) {}
      }

      // Fikstür Listesi
      const fixtures = [
        { date: "18 Ağustos 2026", fullDate: "2026-08-18", time: "22:00", comp: "UEFA Şampiyonlar Ligi Play-Off", home: "Fenerbahçe", away: "Lyon", venue: "Ülker Stadyumu Kadıköy" },
        { date: "22 Ağustos 2026", fullDate: "2026-08-22", time: "21:30", comp: "Trendyol Süper Lig 2. Hafta", home: "Fenerbahçe", away: "Konyaspor", venue: "Kadıköy" },
        { date: "26 Ağustos 2026", fullDate: "2026-08-26", time: "22:00", comp: "UEFA Şampiyonlar Ligi Play-Off Rövanş", home: "Lyon", away: "Fenerbahçe", venue: "Groupama Stadium (Deplasman)" },
        { date: "30 Ağustos 2026", fullDate: "2026-08-30", time: "21:30", comp: "Trendyol Süper Lig 3. Hafta", home: "Samsunspor", away: "Fenerbahçe", venue: "Samsun (Deplasman)" }
      ];

      // 1. DOĞUM GÜNÜ SORGUSU
      if (q.includes('dogum') || q.includes('yas') || q.includes('hediye') || q.includes('bday')) {
        if (birthdays.length === 0) {
          return "🎂 Henüz sisteme kayıtlı doğum günü bulunmuyor. Etkinlikler sayfasından sevdiklerinin doğum günlerini ekleyebilirsin!";
        }

        const upcoming = await window.BirthdaysAPI.getUpcomingBirthdays(3);
        let res = `🎂 <b>Yaklaşan Doğum Günleri:</b><br><br>`;
        upcoming.forEach(b => {
          const status = b.daysLeft === 0 ? '🔥 <b>BUGÜN!</b>' : (b.daysLeft === 1 ? '⚡ <b>YARIN</b>' : `⏳ <b>${b.daysLeft} gün kaldı</b>`);
          res += `• <b>${b.name}</b> (${b.formattedDate})<br>`;
          res += `  🎈 Durum: ${status} (${b.nextAge}. yaş)<br>`;
          if (b.gift_ideas) res += `  🎁 Hediye Fikri: ${b.gift_ideas}<br>`;
          res += `<br>`;
        });
        return res;
      }

      // 2. MAÇ & FENERBAHÇE SORGUSU
      if (q.includes('mac') || q.includes('fener') || q.includes('lyon') || q.includes('fikstur') || q.includes('skor')) {
        const nextMatch = fixtures.find(f => f.fullDate >= todayStr) || fixtures[fixtures.length - 1];
        return `⚽🔥 <b>Sıradaki Maç Bilgisi:</b><br><br>` +
               `🏆 <b>${nextMatch.home} vs ${nextMatch.away}</b><br>` +
               `📅 <b>Tarih:</b> ${nextMatch.date} (${nextMatch.time})<br>` +
               `📌 <b>Turnuva:</b> ${nextMatch.comp}<br>` +
               `🏟️ <b>Stad:</b> ${nextMatch.venue}<br><br>` +
               `<i>Son maç skorları ve fikstür detaylarına Medya sayfasından da ulaşabilirsin.</i>`;
      }

      // 3. HAFTA SONU SORGUSU
      if (q.includes('hafta sonu') || q.includes('cumartesi') || q.includes('pazar') || q.includes('weekend')) {
        const weekendEvents = events.filter(e => {
          const d = new Date(e.event_date + 'T00:00:00');
          const day = d.getDay(); // 0: Pazar, 6: Cumartesi
          return (day === 6 || day === 0);
        });

        if (weekendEvents.length === 0) {
          return "🏖️ Hafta sonu için kayıtlı bir etkinliğin görünmüyor. Kendine dinlendirici bir aktivite planlayabilirsin!";
        }

        let res = `🗓️ <b>Hafta Sonu Planların:</b><br><br>`;
        weekendEvents.forEach(e => {
          const d = new Date(e.event_date + 'T00:00:00');
          const dayName = d.getDay() === 6 ? 'Cumartesi' : 'Pazar';
          res += `• <b>${e.title}</b> (${dayName})<br>`;
          if (e.event_time) res += `  ⏰ Saat: ${e.event_time}<br>`;
          if (e.location) res += `  📍 Yer: ${e.location}<br>`;
          if (e.notes) res += `  💡 Not: ${e.notes}<br><br>`;
        });
        return res;
      }

      // 4. BUGÜN / YARIN SORGUSU
      if (q.includes('bugun') || q.includes('today')) {
        const todayEvts = events.filter(e => e.event_date === todayStr);
        if (todayEvts.length === 0) {
          return `📅 Bugün (${today.getDate()} ${today.toLocaleString('tr-TR', { month: 'long' })}) için kayıtlı bir etkinliğin yok. Günün tadını çıkar! ✨`;
        }
        let res = `📍 <b>Bugünkü Planların:</b><br><br>`;
        todayEvts.forEach(e => {
          res += `• <b>${e.title}</b> (${e.category})<br>`;
          if (e.event_time) res += `  ⏰ Saat: ${e.event_time}<br>`;
          if (e.location) res += `  📍 Yer: ${e.location}<br><br>`;
        });
        return res;
      }

      // 5. GEÇMİŞ MAÇLAR / TARİH SORGUSU
      if (q.includes('18 agustos') || q.includes('18')) {
        return `📅 <b>18 Ağustos 2026 Salı:</b><br><br>` +
               `⚽ <b>Fenerbahçe 1 - 1 Lyon</b> (UEFA Şampiyonlar Ligi Play-Off 1. Maç)<br>` +
               `📌 Maç 1-1 beraberlikle sonuçlandı. Rövanş 26 Ağustos'ta Groupama Stadium'da oynanacak.`;
      }
      if (q.includes('22 agustos') || q.includes('konya')) {
        return `📅 <b>22 Ağustos 2026 Cumartesi:</b><br><br>` +
               `⚽ <b>Fenerbahçe 4 - 2 Tümosan Konyaspor</b> (Trendyol Süper Lig 2. Hafta)<br>` +
               `✅ Fenerbahçe Kadıköy'de 4-2'lik galibiyet elde etti!`;
      }

      // 6. GENEL ETKİNLİK / PLAN LİSTESİ SORGUSU
      if (q.includes('etkinlik') || q.includes('plan') || q.includes('program') || q.includes('gezi') || q.includes('kamp') || q.includes('parti')) {
        const upcoming = events.filter(e => !e.is_completed).slice(0, 4);
        if (upcoming.length === 0) {
          return "📅 Planlanmış yaklaşan bir etkinliğin bulunmuyor. Etkinlikler sayfasından yeni etkinlik ekleyebilirsin!";
        }
        let res = `🗓️ <b>Yaklaşan Etkinliklerin:</b><br><br>`;
        upcoming.forEach(e => {
          res += `• <b>${e.title}</b> (${e.event_date})<br>`;
          if (e.location) res += `  📍 ${e.location} | ⏰ ${e.event_time || ''}<br><br>`;
        });
        return res;
      }

      // 7. GENEL CEVAP (Fallback)
      return `🤖 Seni dinliyorum Ömür Can! Şunları sorabilirsin:<br><br>` +
             `• <i>"Bu hafta sonu ne planım var?"</i><br>` +
             `• <i>"Sıradaki maç ne zaman?"</i><br>` +
             `• <i>"Kimin doğum günü yaklaşıyor?"</i><br>` +
             `• <i>"18 Ağustos'ta ne var?"</i>`;
    }
  };

  window.AIAssistant = AIAssistant;

  document.addEventListener('DOMContentLoaded', () => {
    AIAssistant.init();
  });
})();
