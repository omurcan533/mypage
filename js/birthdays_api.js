/**
 * BirthdaysAPI - Sevdiklerinizin Doğum Günlerini Yönetme API'si
 * Supabase tablosu: birthdays (with localStorage fallback)
 */

const BIRTHDAYS_STORAGE_KEY = 'oyp_birthdays';

const INITIAL_BIRTHDAYS = [
  {
    id: 'bday_1',
    name: 'Can (En Yakın Arkadaş)',
    birth_date: '1998-08-25',
    relationship: 'Arkadaş',
    notes: 'Kamp yapmayı çok sever, doğa ekipmanı hediyesi düşünülebilir.',
    gift_ideas: 'Termos, kafa lambası veya hoodie',
    created_at: new Date().toISOString()
  },
  {
    id: 'bday_2',
    name: 'Merve',
    birth_date: '2000-09-10',
    relationship: 'Kuzen',
    notes: 'Kahve ve kitap tutkunu.',
    gift_ideas: 'Özel filtre kahve seti veya sevdiği bir yazarın kitabı',
    created_at: new Date().toISOString()
  },
  {
    id: 'bday_3',
    name: 'Babam',
    birth_date: '1968-10-05',
    relationship: 'Aile',
    notes: 'Klasik müzik ve nostaljik eşyaları sever.',
    gift_ideas: 'Plak veya şık bir kol saati',
    created_at: new Date().toISOString()
  }
];

window.BirthdaysAPI = {
  _memoryCache: null,

  getLocalBirthdays() {
    try {
      const raw = localStorage.getItem(BIRTHDAYS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(BIRTHDAYS_STORAGE_KEY, JSON.stringify(INITIAL_BIRTHDAYS));
        return INITIAL_BIRTHDAYS;
      }
      return JSON.parse(raw) || INITIAL_BIRTHDAYS;
    } catch (e) {
      return INITIAL_BIRTHDAYS;
    }
  },

  saveLocalBirthdays(items) {
    try {
      localStorage.setItem(BIRTHDAYS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  },

  async fetchBirthdays() {
    if (this._memoryCache) return this._memoryCache;

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('birthdays')
          .select('*')
          .order('birth_date', { ascending: true });

        if (!error && data) {
          if (data.length > 0) {
            this._memoryCache = data;
            this.saveLocalBirthdays(data);
            return data;
          } else {
            const local = this.getLocalBirthdays();
            await window.supabaseClient.from('birthdays').insert(local);
            this._memoryCache = local;
            return local;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch birthdays error, fallback to local:', err);
      }
    }

    const local = this.getLocalBirthdays();
    this._memoryCache = local;
    return local;
  },

  async addBirthday(itemData) {
    const newItem = {
      id: 'bday_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: (itemData.name || '').trim(),
      birth_date: itemData.birth_date, // YYYY-MM-DD
      relationship: itemData.relationship || 'Arkadaş',
      notes: (itemData.notes || '').trim(),
      gift_ideas: (itemData.gift_ideas || '').trim(),
      created_at: new Date().toISOString()
    };

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('birthdays')
          .insert([newItem])
          .select();

        if (!error && data && data.length > 0) {
          newItem.id = data[0].id;
        }
      } catch (e) {}
    }

    const current = await this.fetchBirthdays();
    const updated = [...current, newItem];
    this._memoryCache = updated;
    this.saveLocalBirthdays(updated);
    window.dispatchEvent(new CustomEvent('birthdays:changed', { detail: newItem }));
    return newItem;
  },

  async updateBirthday(id, updates) {
    let current = await this.fetchBirthdays();
    const idx = current.findIndex(b => b.id === id);
    if (idx === -1) return null;

    const updatedItem = { ...current[idx], ...updates };

    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('birthdays')
          .update(updates)
          .eq('id', id);
      } catch (e) {}
    }

    current[idx] = updatedItem;
    this._memoryCache = current;
    this.saveLocalBirthdays(current);
    window.dispatchEvent(new CustomEvent('birthdays:changed', { detail: updatedItem }));
    return updatedItem;
  },

  async deleteBirthday(id) {
    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('birthdays')
          .delete()
          .eq('id', id);
      } catch (e) {}
    }

    let current = await this.fetchBirthdays();
    const filtered = current.filter(b => b.id !== id);
    this._memoryCache = filtered;
    this.saveLocalBirthdays(filtered);
    window.dispatchEvent(new CustomEvent('birthdays:changed', { detail: { id, deleted: true } }));
    return true;
  },

  /**
   * Doğum gününe kaç gün kaldığını ve yaşını hesaplar
   */
  calculateNextBirthday(birthDateStr) {
    if (!birthDateStr) return { daysLeft: 999, nextAge: 0, formattedDate: '' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = birthDateStr.split('-');
    const birthYear = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);

    let nextBday = new Date(today.getFullYear(), birthMonth, birthDay);
    nextBday.setHours(0, 0, 0, 0);

    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBday - today;
    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const nextAge = nextBday.getFullYear() - birthYear;

    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const formattedDate = `${birthDay} ${monthNames[birthMonth]}`;

    return { daysLeft, nextAge, formattedDate, nextDateObj: nextBday };
  },

  /**
   * Yaklaşan doğum günlerini sıralı getirir (en yakından uzağa)
   */
  async getUpcomingBirthdays(limit = 5) {
    const list = await this.fetchBirthdays();
    return list
      .map(item => {
        const calc = this.calculateNextBirthday(item.birth_date);
        return { ...item, ...calc };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, limit);
  }
};
