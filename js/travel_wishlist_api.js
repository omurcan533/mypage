/**
 * TravelWishlistAPI - Manages Admin Travel Wishlist (Gezilecek Yerler & Şehir Haritası)
 * Supabase table: travel_wishlist
 */

const STORAGE_KEY = 'oyp_travel_wishlist';

const DEFAULT_CITY_COVERS = {
  "antalya": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80",
  "istanbul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80",
  "roma": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
  "rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
  "izmir": "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&auto=format&fit=crop&q=80",
  "ankara": "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&auto=format&fit=crop&q=80"
};

const INITIAL_WISHLIST = [
  {
    id: 'w1',
    city: 'İstanbul',
    district: 'Balat',
    place_name: 'Velvet Cafe Balat',
    category: '☕ Kafe',
    note: 'Tarihi kahve fincanları ve antika konsepti',
    link: 'https://maps.google.com/?q=Velvet+Cafe+Balat',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&auto=format&fit=crop&q=80',
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
    image: '',
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
    image: '',
    is_visited: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'w4',
    city: 'Antalya',
    district: 'Kaleiçi',
    place_name: 'The Sudd Coffee Kaleiçi',
    category: '☕ Kafe',
    note: 'Tarihi Kaleiçi sokaklarında nitelikli 3. nesil kahve',
    link: 'https://maps.google.com/?q=The+Sudd+Coffee+Kaleici+Antalya',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    is_visited: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'w5',
    city: 'Antalya',
    district: 'Muratpaşa',
    place_name: 'Aşağı Düden Şelalesi Seyir Terası',
    category: '📸 Manzara',
    note: 'Denize dökülen şelale manzarası ve gün batımı parkı',
    link: 'https://maps.google.com/?q=Duden+Waterfalls+Antalya',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
    is_visited: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'w6',
    city: 'Roma',
    district: 'Trastevere',
    place_name: 'Tonnarello Restoran',
    category: '🍕 Restoran',
    note: 'Taze el yapımı Cacio e Pepe makarna',
    link: 'https://maps.google.com/?q=Tonnarello+Rome',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
    is_visited: false,
    created_at: new Date().toISOString()
  }
];

window.TravelWishlistAPI = {
  _memoryCache: null,
  _cityCovers: null,

  getCityCover(cityName) {
    if (!cityName) return "";
    const norm = cityName.toLowerCase().trim();
    if (this._cityCovers && this._cityCovers[norm]) {
      return this._cityCovers[norm];
    }
    try {
      const custom = JSON.parse(localStorage.getItem('oyp_city_covers') || '{}');
      if (custom[norm]) return custom[norm];
    } catch {}
    if (DEFAULT_CITY_COVERS[norm]) return DEFAULT_CITY_COVERS[norm];
    return "";
  },

  async setCityCover(cityName, imageUrl) {
    if (!cityName) return;
    const norm = cityName.toLowerCase().trim();
    const cleanUrl = imageUrl ? imageUrl.trim() : "";
    
    // 1. Update local cache and localStorage
    try {
      const custom = JSON.parse(localStorage.getItem('oyp_city_covers') || '{}');
      if (cleanUrl) custom[norm] = cleanUrl;
      else delete custom[norm];
      localStorage.setItem('oyp_city_covers', JSON.stringify(custom));
      this._cityCovers = custom;
    } catch (e) {
      console.warn("Error setting city cover locally:", e);
    }

    // 2. Persist to Supabase travel_wishlist as city cover record
    if (window.supabaseClient) {
      try {
        const { data: existing, error: searchErr } = await window.supabaseClient
          .from('travel_wishlist')
          .select('id, city, category')
          .ilike('city', cityName.trim())
          .eq('category', '__city_cover__');

        if (!searchErr && existing && existing.length > 0) {
          if (cleanUrl) {
            await window.supabaseClient
              .from('travel_wishlist')
              .update({ image: cleanUrl })
              .eq('id', existing[0].id);
          } else {
            await window.supabaseClient
              .from('travel_wishlist')
              .delete()
              .eq('id', existing[0].id);
          }
        } else if (cleanUrl) {
          await window.supabaseClient
            .from('travel_wishlist')
            .insert([{
              city: cityName.trim(),
              district: 'Genel',
              place_name: '__city_cover__',
              category: '__city_cover__',
              image: cleanUrl,
              is_visited: true,
              created_at: new Date().toISOString()
            }]);
        }
      } catch (sbErr) {
        console.warn("Supabase setCityCover error:", sbErr);
      }
    }

    return true;
  },

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

  async fetchItems(forceRefresh = false) {
    if (this._memoryCache && !forceRefresh) return this._memoryCache;

    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('travel_wishlist')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Extract city covers if present
          const customCovers = JSON.parse(localStorage.getItem('oyp_city_covers') || '{}');
          const coverRecords = data.filter(i => i.category === '__city_cover__' || i.place_name === '__city_cover__');
          coverRecords.forEach(c => {
            if (c.city && c.image) {
              customCovers[c.city.toLowerCase().trim()] = c.image.trim();
            }
          });
          localStorage.setItem('oyp_city_covers', JSON.stringify(customCovers));
          this._cityCovers = customCovers;

          // Filter out cover records from regular places list
          const regularPlaces = data.filter(i => i.category !== '__city_cover__' && i.place_name !== '__city_cover__');
          this._memoryCache = regularPlaces;
          this.saveLocalItems(regularPlaces);
          return regularPlaces;
        }
      } catch (err) {
        console.warn('Supabase fetch travel_wishlist error, using local fallback:', err);
      }
    }

    const local = this.getLocalItems();
    const regularPlaces = local.filter(i => i.category !== '__city_cover__' && i.place_name !== '__city_cover__');
    this._memoryCache = regularPlaces;
    return regularPlaces;
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
      image: (itemData.image || itemData.image_url || '').trim(),
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
            image: newItem.image || null,
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
