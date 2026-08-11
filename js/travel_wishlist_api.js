/**
 * TravelWishlistAPI - Manages Admin Travel Wishlist (Gezilecek Yerler & Şehir Haritası)
 * Supabase table: travel_wishlist
 */

const STORAGE_KEY = 'oyp_travel_wishlist';

const INITIAL_WISHLIST = [
  {
    id: 'w1',
    city: 'İstanbul',
    district: 'Balat',
    place_name: 'Velvet Cafe Balat',
    category: '☕ Kafe',
    note: 'Tarihi kahve fincanları ve antika konsepti',
    link: 'https://maps.google.com/?q=Velvet+Cafe+Balat',
    is_visited: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'w2',
    city: 'İstanbul',
    district: 'Anadolu Hisarı',
    place_name: 'Göksu Deresi Kenarı Yürüyüş Yolu',
    category: '📸 Manzara',
    note: 'Gün batımında nehir kenarı çay & manzara',
    link: 'https://maps.google.com/?q=Anadolu+Hisarı',
    is_visited: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'w3',
    city: 'İstanbul',
    district: 'Kadıköy',
    place_name: 'Moda Çay Bahçesi & Sahil',
    category: '🌳 Park',
    note: 'Çimlerde akşamüstü açık hava dinlenmesi',
    link: 'https://maps.google.com/?q=Moda+Çay+Bahçesi',
    is_visited: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'w4',
    city: 'Roma',
    district: 'Trastevere',
    place_name: 'Tonnarello Restoran',
    category: '🍕 Restoran',
    note: 'Taze el yapımı Cacio e Pepe makarna',
    link: 'https://maps.google.com/?q=Tonnarello+Rome',
    is_visited: false,
    created_at: new Date().toISOString()
  }
];

window.TravelWishlistAPI = {
  _memoryCache: null,

  getLocalItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST));
        return INITIAL_WISHLIST;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading wishlist from localStorage:', e);
      return INITIAL_WISHLIST;
    }
  },

  saveLocalItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving wishlist to localStorage:', e);
    }
  },

  async fetchItems() {
    if (this._memoryCache) return this._memoryCache;

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('travel_wishlist')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          this._memoryCache = data;
          this.saveLocalItems(data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch travel_wishlist error, using local fallback:', err);
      }
    }

    const local = this.getLocalItems();
    this._memoryCache = local;
    return local;
  },

  async addItem(itemData) {
    const newItem = {
      id: 'w_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
      city: itemData.city.trim(),
      district: itemData.district.trim(),
      place_name: itemData.place_name.trim(),
      category: itemData.category || '☕ Kafe',
      note: (itemData.note || '').trim(),
      link: (itemData.link || '').trim(),
      is_visited: false
    };

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('travel_wishlist')
          .insert([{
            city: newItem.city,
            district: newItem.district,
            place_name: newItem.place_name,
            category: newItem.category,
            note: newItem.note,
            link: newItem.link,
            is_visited: newItem.is_visited
          }])
          .select();

        if (!error && data && data.length > 0) {
          newItem.id = data[0].id;
        }
      } catch (err) {
        console.warn('Supabase addItem error, saving locally:', err);
      }
    }

    const current = await this.fetchItems();
    const updated = [newItem, ...current];
    this._memoryCache = updated;
    this.saveLocalItems(updated);
    return newItem;
  },

  async updateItem(id, updates) {
    let current = await this.fetchItems();
    const idx = current.findIndex(i => i.id === id);
    if (idx === -1) return null;

    const updatedItem = { ...current[idx], ...updates };

    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('travel_wishlist')
          .update(updates)
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateItem error:', err);
      }
    }

    current[idx] = updatedItem;
    this._memoryCache = current;
    this.saveLocalItems(current);
    return updatedItem;
  },

  async toggleVisited(id) {
    const current = await this.fetchItems();
    const item = current.find(i => i.id === id);
    if (!item) return null;

    return await this.updateItem(id, { is_visited: !item.is_visited });
  },

  async deleteItem(id) {
    if (window.supabaseClient) {
      try {
        await window.supabaseClient
          .from('travel_wishlist')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteItem error:', err);
      }
    }

    let current = await this.fetchItems();
    const filtered = current.filter(i => i.id !== id);
    this._memoryCache = filtered;
    this.saveLocalItems(filtered);
    return true;
  }
};
