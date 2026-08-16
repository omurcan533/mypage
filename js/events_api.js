/**
 * EventsAPI - Manages Personal Weekly & Monthly Events / Plans (Etkinlikler & Planlar)
 * Supabase table: personal_events (with localStorage fallback)
 */

const EVENTS_STORAGE_KEY = 'oyp_personal_events';

// Bugün ve bu haftanın tarihlerini dinamik hesaplayalım
function getFutureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

const INITIAL_EVENTS = [
  {
    id: 'evt_1',
    title: 'Doğum Günü Partisi',
    category: '🎉 Parti & Kutlama',
    event_date: getFutureDate(6), // Bu cumartesi civarı
    event_time: '13:00 (Öğle Vakti)',
    location: 'İstanbul / Kadıköy Moda',
    with_whom: 'Arkadaş Grubu',
    notes: 'Hediye almayı unutma! Hızlı feribot veya Marmaray ile geçiş.',
    status: 'planned', // planned, completed, cancelled
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'evt_2',
    title: 'Hafta Sonu Kampı & Doğa Yürüyüşü',
    category: '⛺ Kamp & Doğa',
    event_date: getFutureDate(12), // Sonraki hafta Cuma
    event_time: '10:00 (Sabah Erken)',
    location: 'Sapanca / Ormanya & Göl Kenarı',
    with_whom: 'Can & Mert',
    notes: 'Çadır, uyku tulumu, mat ve kafa lambasını perşembe akşamından arabaya yükle.',
    status: 'planned',
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'evt_3',
    title: 'Fenerbahçe - Lyon Şampiyonlar Ligi Maçı',
    category: '⚽ Spor & Maç',
    event_date: getFutureDate(2), // 18 Ağustos Salı
    event_time: '22:00 (Salı Akşamı)',
    location: 'Ülker Stadyumu / Kadıköy',
    with_whom: 'Kuzenler',
    notes: 'Passolig kartları kontrol edilecek, maç öncesi Kalamış parkında buluşma.',
    status: 'planned',
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'evt_4',
    title: 'Kahve & Kitap Buluşması',
    category: '☕ Buluşma & Kahve',
    event_date: getFutureDate(18),
    event_time: '16:00 (İkindi)',
    location: 'Bebek / Petra Coffee',
    with_whom: 'Mühendis Arkadaşlar',
    notes: 'Yeni yazılım projesinin mimarisi üzerine fikir alışverişi.',
    status: 'planned',
    is_completed: false,
    created_at: new Date().toISOString()
  }
];

window.EventsAPI = {
  _memoryCache: null,

  getLocalEvents() {
    try {
      const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
      let items = JSON.parse(raw);
      // Lyon maçı tarih düzeltmesi (18 Ağustos)
      const lyonEvt = items.find(e => e.id === 'evt_3' || (e.title && e.title.includes('Lyon')));
      if (lyonEvt) {
        lyonEvt.event_date = getFutureDate(2);
        lyonEvt.event_time = '22:00 (Salı Akşamı)';
        this.saveLocalEvents(items);
      }
      return items;
    } catch (e) {
      console.error('Error reading events from localStorage:', e);
      return INITIAL_EVENTS;
    }
  },

  saveLocalEvents(events) {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events to localStorage:', e);
    }
  },

  async fetchEvents() {
    if (this._memoryCache) return this._memoryCache;

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('personal_events')
          .select('*')
          .order('event_date', { ascending: true });

        if (!error && data) {
          if (data.length > 0) {
            console.log('✅ Supabase personal_events yüklendi:', data.length, 'etkinlik');
            this._memoryCache = data;
            this.saveLocalEvents(data);
            return data;
          } else {
            // Tablo var ama boşsa başlangıç verilerini Supabase'e otomatik yazalım
            console.log('⚡ Supabase personal_events tablosu boş, başlangıç verileri aktarılıyor...');
            const local = this.getLocalEvents();
            await window.supabaseClient.from('personal_events').insert(local);
            this._memoryCache = local;
            return local;
          }
        } else if (error) {
          console.warn('⚠️ Supabase personal_events sorgu hatası (Tablo oluşturulmamış olabilir):', error.message);
        }
      } catch (err) {
        console.warn('⚠️ Supabase fetch personal_events error, using local fallback:', err);
      }
    }

    const local = this.getLocalEvents();
    this._memoryCache = local;
    return local;
  },

  async addEvent(eventData) {
    const newEvent = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: (eventData.title || '').trim(),
      category: eventData.category || '🎉 Parti & Kutlama',
      event_date: eventData.event_date || new Date().toISOString().split('T')[0],
      event_time: (eventData.event_time || 'Öğle').trim(),
      location: (eventData.location || '').trim(),
      with_whom: (eventData.with_whom || '').trim(),
      notes: (eventData.notes || '').trim(),
      status: eventData.status || 'planned',
      is_completed: false,
      created_at: new Date().toISOString()
    };

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('personal_events')
          .insert([newEvent])
          .select();

        if (!error && data && data.length > 0) {
          newEvent.id = data[0].id;
        }
      } catch (err) {
        console.warn('Supabase addEvent error, saving locally:', err);
      }
    }

    const current = await this.fetchEvents();
    // Tarihe göre sıralı ekleyelim
    const updated = [...current, newEvent].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    this._memoryCache = updated;
    this.saveLocalEvents(updated);
    window.dispatchEvent(new CustomEvent('events:changed', { detail: newEvent }));
    return newEvent;
  },

  async updateEvent(id, updates) {
    let current = await this.fetchEvents();
    const idx = current.findIndex(e => e.id === id);
    if (idx === -1) return null;

    const updatedEvent = { ...current[idx], ...updates };

    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('personal_events')
          .update(updates)
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateEvent error:', err);
      }
    }

    current[idx] = updatedEvent;
    current.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    this._memoryCache = current;
    this.saveLocalEvents(current);
    window.dispatchEvent(new CustomEvent('events:changed', { detail: updatedEvent }));
    return updatedEvent;
  },

  async toggleEventCompleted(id) {
    const current = await this.fetchEvents();
    const item = current.find(e => e.id === id);
    if (!item) return null;

    const nextCompleted = !item.is_completed;
    return await this.updateEvent(id, {
      is_completed: nextCompleted,
      status: nextCompleted ? 'completed' : 'planned'
    });
  },

  async deleteEvent(id) {
    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('personal_events')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteEvent error:', err);
      }
    }

    let current = await this.fetchEvents();
    const filtered = current.filter(e => e.id !== id);
    this._memoryCache = filtered;
    this.saveLocalEvents(filtered);
    window.dispatchEvent(new CustomEvent('events:changed', { detail: { id, deleted: true } }));
    return true;
  },

  /**
   * Yaklaşan etkinlikleri getirir (Bugün veya sonrasındaki, tamamlanmamış)
   */
  async getUpcomingEvents(limit = 4) {
    const all = await this.fetchEvents();
    const todayStr = new Date().toISOString().split('T')[0];

    return all
      .filter(e => !e.is_completed && e.event_date >= todayStr)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, limit);
  }
};
