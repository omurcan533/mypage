let currentDinnerYear = 'all';

let editingDinnerId = null;
let editingBoardId = null;
let editingTravelId = null;

let dinnersCache = [];
let boardCache = [];
let travelsCache = [];
let birthdaysCache = [];
let pendingDeleteAction = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (window.Nav) {
    window.Nav.init();
  }

  let isAdmin = false;
  if (window.Auth && typeof window.Auth.canManageContent === 'function') {
    isAdmin = await window.Auth.canManageContent();
  }

  checkAdminAccess(isAdmin);
  setupModals();
  setupEventListeners();
  renderAll();

  window.addEventListener('auth:changed', async () => {
    let freshAdmin = false;
    if (window.Auth && typeof window.Auth.canManageContent === 'function') {
      freshAdmin = await window.Auth.canManageContent();
    }
    checkAdminAccess(freshAdmin);
    renderAll();
  });
});

function checkAdminAccess(isAdmin) {
  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(el => {
    el.style.display = isAdmin ? 'inline-flex' : 'none';
  });
}

function setupEventListeners() {
  const filter = document.getElementById('dinner-year-filter');
  if (filter) {
    filter.addEventListener('change', (e) => {
      currentDinnerYear = e.target.value;
      renderDinners();
    });
  }

  // Dinner Form (Ekle / Düzenle)
  const dinnerForm = document.getElementById('add-dinner-form');
  if (dinnerForm) {
    dinnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const date = document.getElementById('dinner-date').value;
      const mealInput = document.getElementById('dinner-meal').value.trim();
      const noteInput = document.getElementById('dinner-note')?.value.trim() || '';
      
      if (!date || !mealInput) return;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true, editingDinnerId ? "Güncelleniyor..." : "Kaydediliyor...");

      const finalMeal = noteInput ? `${mealInput} — 📝 Not: ${noteInput}` : mealInput;

      try {
        let error;
        if (editingDinnerId) {
          const res = await window.supabaseClient
            .from('family_dinners')
            .update({ date, meal: finalMeal })
            .eq('id', editingDinnerId);
          error = res.error;
        } else {
          const res = await window.supabaseClient
            .from('family_dinners')
            .insert([{ date, meal: finalMeal }]);
          error = res.error;
        }
        
        if (!error) {
          editingDinnerId = null;
          e.target.reset();
          closeModal('dinner-modal');
          if (window.Toast) Toast.success(editingDinnerId ? "Yemek ve not güncellendi!" : "Yemek kaydedildi!");
          await renderDinners(true);
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        } else {
          console.error("Dinner Submit Error:", error);
          if (window.Toast) Toast.error("Kayıt sırasında bir hata oluştu: " + error.message);
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Board Form (Ekle / Düzenle)
  const boardForm = document.getElementById('add-board-form');
  if (boardForm) {
    boardForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const type = document.getElementById('board-type').value;
      const text = document.getElementById('board-text').value;
      
      if (!text) return;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true, editingBoardId ? "Güncelleniyor..." : "Kaydediliyor...");

      try {
        let error;
        if (editingBoardId) {
          const res = await window.supabaseClient
            .from('family_board')
            .update({ type, text })
            .eq('id', editingBoardId);
          error = res.error;
        } else {
          const res = await window.supabaseClient
            .from('family_board')
            .insert([{ type, text, completed: false }]);
          error = res.error;
        }
        
        if (!error) {
          editingBoardId = null;
          e.target.reset();
          closeModal('board-modal');
          if (window.Toast) Toast.success("Pano notu kaydedildi!");
          await renderBoard(true);
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        } else {
          console.error("Board Submit Error:", error);
          if (window.Toast) Toast.error("Kayıt sırasında bir hata oluştu: " + error.message);
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Travel Form (Ekle / Düzenle)
  const travelForm = document.getElementById('add-travel-form');
  if (travelForm) {
    travelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const year = document.getElementById('travel-year').value;
      const month = document.getElementById('travel-month').value;
      const place = document.getElementById('travel-place').value;
      const location = document.getElementById('travel-location').value;
      const companions = document.getElementById('travel-companions').value;
      const details = document.getElementById('travel-details').value;
      
      if (!year || !place) return;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true, editingTravelId ? "Güncelleniyor..." : "Kaydediliyor...");

      try {
        let error;
        const payload = { year: parseInt(year), month, place, location, companions, details };
        if (editingTravelId) {
          const res = await window.supabaseClient
            .from('family_travels')
            .update(payload)
            .eq('id', editingTravelId);
          error = res.error;
        } else {
          const res = await window.supabaseClient
            .from('family_travels')
            .insert([payload]);
          error = res.error;
        }
        
        if (!error) {
          editingTravelId = null;
          e.target.reset();
          closeModal('travel-modal');
          if (window.Toast) Toast.success("Gezi planı kaydedildi!");
          await renderTravels(true);
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        } else {
          console.error("Travel Submit Error:", error);
          if (window.Toast) Toast.error("Kayıt sırasında bir hata oluştu: " + error.message);
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Birthday Form
  const birthdayForm = document.getElementById('add-birthday-form');
  if (birthdayForm) {
    birthdayForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const name = document.getElementById('birthday-name').value;
      const birthdate = document.getElementById('birthday-date').value;
      
      if (!name || !birthdate) return;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true, "Kaydediliyor...");

      try {
        const { error } = await window.supabaseClient
          .from('family_birthdays')
          .insert([{ name, birthdate }]);
        
        if (!error) {
          e.target.reset();
          closeModal('birthday-modal');
          if (window.Toast) Toast.success("Doğum günü eklendi!");
          await renderBirthdays(true);
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        } else {
          console.error("Birthday Insert Error:", error);
          if (window.Toast) Toast.error("Kayıt sırasında bir hata oluştu: " + error.message);
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Global Confirm Delete Action Listener
  const confirmDeleteBtn = document.getElementById('confirm-delete-action-btn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (typeof pendingDeleteAction === 'function') {
        setButtonLoading(confirmDeleteBtn, true, 'Siliniyor...');
        try {
          await pendingDeleteAction();
        } finally {
          setButtonLoading(confirmDeleteBtn, false);
          pendingDeleteAction = null;
          closeModal('confirm-delete-modal');
        }
      }
    });
  }
}

function promptConfirmDelete({ header = "🗑 Kaydı Sil", icon = "🗑️", title = "Bu kaydı silmek istediğinizden emin misiniz?", subtitle = "Bu işlem geri alınamaz.", onConfirm }) {
  const headerEl = document.getElementById('confirm-delete-header');
  const iconEl = document.getElementById('confirm-delete-icon');
  const titleEl = document.getElementById('confirm-delete-title');
  const subEl = document.getElementById('confirm-delete-subtitle');

  if (headerEl) headerEl.textContent = header;
  if (iconEl) iconEl.textContent = icon;
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = subtitle;

  pendingDeleteAction = onConfirm;
  openModal('confirm-delete-modal');
}

async function renderAll() {
  await Promise.all([
    renderDinners(),
    renderBoard(),
    renderTravels(),
    renderBirthdays()
  ]);
}

/* ================= DINNERS ================= */
async function renderDinners(silent = false) {
  const todayBadge = document.getElementById('dinner-today-badge');
  if (todayBadge) {
    const today = new Date();
    const formatted = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
    todayBadge.innerHTML = `📅 ${formatted}`;
  }

  const list = document.getElementById('dinner-list');
  if (!list) return;
  if (!silent && (!dinnersCache || dinnersCache.length === 0)) {
    list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Yükleniyor...</div>`;
  }

  try {
    const { data: dinners, error } = await window.supabaseClient
      .from('family_dinners')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    dinnersCache = dinners || [];

    const yearSelect = document.getElementById('dinner-year-filter');
    if (yearSelect) {
      const currentYear = new Date().getFullYear().toString();
      const dbYears = (dinners || []).map(d => d.date ? d.date.split('-')[0] : null).filter(Boolean);
      const years = [...new Set([currentYear, ...dbYears])].sort().reverse();
      const currentVal = yearSelect.value || 'all';
      yearSelect.innerHTML = `<option value="all">Tüm Yıllar</option>` + 
        years.map(y => `<option value="${y}">${y}</option>`).join('');
      if (years.includes(currentVal) || currentVal === 'all') yearSelect.value = currentVal;
    }

    const filtered = currentDinnerYear === 'all' 
      ? dinnersCache 
      : dinnersCache.filter(d => d.date.startsWith(currentDinnerYear));

    if (filtered.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Henüz yemek kaydı yok.</div>`;
      return;
    }

    const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;

    list.innerHTML = `
      <div class="dinner-table-container">
        <table class="dinner-table">
          <thead>
            <tr>
              <th style="width: 220px;">📅 Tarih</th>
              <th>🍽️ Akşam Menüsü & Notlar (Detay için tıkla)</th>
              ${isAdmin ? `<th style="text-align: right; width: 90px;">İşlem</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${filtered.map(d => {
              const dateObj = new Date(d.date);
              const dateStr = dateObj.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
              const dayStr = dateObj.toLocaleDateString('tr-TR', { weekday: 'long' });
              const { meal, note } = parseMealAndNote(d.meal);

              return `
                <tr class="dinner-table-row" onclick="openDinnerDetailModal('${d.id}')" title="Menü ve not detayını görüntülemek için tıklayın">
                  <td>
                    <div class="dinner-date-badge">
                      <span>📅</span> <strong>${dateStr}</strong> <span style="opacity:0.75; font-size:11px;">(${dayStr})</span>
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
                      <span style="font-weight: 600; font-size: 15px; color: var(--text-primary);">${meal}</span>
                      ${note ? `<span class="dinner-note-pill" title="Not: ${note.replace(/"/g, '&quot;')}">📝 Not var</span>` : ''}
                    </div>
                  </td>
                  ${isAdmin ? `
                    <td style="text-align: right;" onclick="event.stopPropagation();">
                      <div class="action-btns">
                        <button class="dinner-edit-btn" onclick="openEditDinnerModal('${d.id}')" title="Düzenle">✏️</button>
                        <button class="dinner-delete-btn" onclick="deleteDinner('${d.id}')" title="Sil">✕</button>
                      </div>
                    </td>
                  ` : ''}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error("Dinners render error:", err);
    list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--rose);">Veri çekilemedi.</div>`;
  }
}

function parseMealAndNote(rawMeal) {
  if (!rawMeal) return { meal: '', note: '' };
  // Pattern 1: "... — 📝 Eksikler: note" or "... — 📝 Not: note" or "... — 📝 not"
  const match1 = rawMeal.match(/^(.*?)\s*—\s*📝\s*(?:Eksikler|Not|Malzemeler)?\s*:?\s*(.*)$/i);
  if (match1) {
    return { meal: match1[1].trim(), note: match1[2].trim() };
  }
  // Pattern 2: "... (Not: note)"
  const match2 = rawMeal.match(/^(.*?)\s*\((?:Not|Eksik|Eksikler):\s*(.*?)\)$/i);
  if (match2) {
    return { meal: match2[1].trim(), note: match2[2].trim() };
  }
  return { meal: rawMeal.trim(), note: '' };
}

window.openDinnerDetailModal = function(id) {
  const item = dinnersCache.find(d => String(d.id) === String(id));
  if (!item) return;

  const { meal, note } = parseMealAndNote(item.meal);
  const dateObj = new Date(item.date);
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

  const container = document.getElementById('dinner-detail-body');
  if (!container) return;

  const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? window.Auth.canManageContent() : false;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Date Banner -->
      <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(99, 102, 241, 0.14)); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: var(--radius-lg); padding: 14px 18px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">📅</span>
        <div>
          <div style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">Tarih & Gün</div>
          <div style="font-size: 16px; font-weight: 800; color: #ffffff;">${dateStr}</div>
        </div>
      </div>

      <!-- Meal Card -->
      <div style="background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: var(--radius-lg); padding: 18px 20px;">
        <div style="font-size: 12px; font-weight: 800; color: var(--accent-light, #818cf8); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">🍽️ Menü & Yemekler</div>
        <div style="font-size: 17px; font-weight: 700; color: #ffffff; line-height: 1.55;">${meal}</div>
      </div>

      <!-- Note Card -->
      <div style="background: ${note ? 'rgba(245, 158, 11, 0.14)' : 'rgba(255, 255, 255, 0.03)'}; border: 1px solid ${note ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.1)'}; border-radius: var(--radius-lg); padding: 16px 20px;">
        <div style="font-size: 12px; font-weight: 800; color: ${note ? '#fbbf24' : 'var(--text-muted)'}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
          📝 Düşülen Not & Eksik Malzemeler
        </div>
        ${note ? `
          <div style="font-size: 15px; font-weight: 600; color: #fef08a; line-height: 1.55; white-space: pre-line;">
            ${note}
          </div>
        ` : `
          <div style="font-size: 13.5px; color: var(--text-muted); font-style: italic;">
            Bu menü için henüz özel bir not veya eksik malzeme bırakılmamış.
          </div>
        `}
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 10px; margin-top: 6px; flex-wrap: wrap;">
        <button class="btn btn-primary admin-only" style="flex: 1; padding: 12px 18px; font-weight: 700;" onclick="openEditDinnerModal('${item.id}')">
          ✏️ Bu Yemeği Düzenle
        </button>
        <button class="btn btn-glass" style="padding: 12px 18px;" onclick="closeModal('dinner-detail-modal')">
          ✕ Kapat
        </button>
      </div>
    </div>
  `;

  openModal('dinner-detail-modal');
  checkAdminAccess(isAdmin);
};

window.openNewDinnerModal = function() {
  editingDinnerId = null;
  const title = document.querySelector('#dinner-modal .modal-title');
  if (title) title.textContent = "🍽️ Yemek Ekle";
  document.getElementById('add-dinner-form')?.reset();
  const todayStr = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('dinner-date');
  if (dateInput) dateInput.value = todayStr;
  openModal('dinner-modal');
};

window.openEditDinnerModal = function(id) {
  const item = dinnersCache.find(d => String(d.id) === String(id));
  if (!item) return;
  editingDinnerId = item.id;
  const title = document.querySelector('#dinner-modal .modal-title');
  if (title) title.textContent = "🍽️ Yemek Düzenle";
  
  const { meal, note } = parseMealAndNote(item.meal);
  document.getElementById('dinner-date').value = item.date || '';
  document.getElementById('dinner-meal').value = meal || '';
  const noteEl = document.getElementById('dinner-note');
  if (noteEl) noteEl.value = note || '';

  closeModal('dinner-detail-modal');
  openModal('dinner-modal');
};

window.deleteDinner = function(id) {
  const item = dinnersCache.find(d => String(d.id) === String(id));
  const { meal } = parseMealAndNote(item ? item.meal : '');
  const label = meal ? `"${meal}"` : 'Bu akşam yemeği';

  promptConfirmDelete({
    header: "🍽️ Yemeği Sil",
    icon: "🍽️",
    title: "Bu yemek kaydını silmek istediğinizden emin misiniz?",
    subtitle: `${label} menüden kalıcı olarak silinecek.`,
    onConfirm: async () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      dinnersCache = dinnersCache.filter(d => String(d.id) !== String(id));
      await window.supabaseClient.from('family_dinners').delete().eq('id', id);
      if (window.Toast) Toast.info("Yemek kaydı silindi.");
      await renderDinners(true);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  });
};

/* ================= SMART DINNER RECOMMENDER ================= */
const RECIPE_DATABASE = [
  // Tavuk / Kanatlı
  {
    id: "rec-1",
    category: "tavuk",
    categoryLabel: "🍗 Tavuk / Kanatlı",
    title: "Fırında Sebzeli Tavuk & Şehriyeli Pirinç Pilavı",
    menu: "Fırında Patatesli Biberli Tavuk But, Şehriyeli Pirinç Pilavı, Mevsim Salata & Ayran",
    soup: "Kırmızı Mercimek Çorbası",
    prepTime: "15 dk",
    cookTime: "40 dk",
    servings: "4 Kişilik",
    ingredients: [
      "800g Tavuk Pirzola veya But",
      "3 adet orta boy Patates (elma dilim)",
      "3 adet Yeşil Biber & 1 adet Kapya Biber",
      "1 yemek kaşığı Domates Salçası",
      "3 yemek kaşığı Yoğurt & 4 yemek kaşığı Zeytinyağı",
      "3 diş Sarımsak (ezilmiş)",
      "1'er tatlı kaşığı Kekik, Kırmızı Toz Biber, Karabiber, Tuz"
    ],
    steps: [
      "Sos için; bir kapta yoğurt, zeytinyağı, salça, ezilmiş sarımsak ve tüm baharatları çırpın.",
      "Tavuk etlerini ve elma dilim doğranmış patatesleri bu sosa bulayıp en az 15-20 dakika dinlendirin.",
      "Fırın tepsisine tavukları ve patatesleri yerleştirin. Aralara iri doğranmış biberleri serpiştirin.",
      "Önceden ısıtılmış 200°C fırında patatesler yumuşayıp tavukların üzeri nar gibi kızarana kadar yaklaşık 40 dakika pişirin.",
      "Fırından çıkardıktan sonra 5 dakika dinlendirip tane şehriyeli pirinç pilavı ile sıcak servis yapın."
    ],
    tips: "Tavukları zeytinyağı, yoğurt, kekik ve sarımsakla marine ederek fırına verirseniz yumuşacık ve nar gibi kızarır."
  },
  {
    id: "rec-2",
    category: "tavuk",
    categoryLabel: "🍗 Tavuk / Kanatlı",
    title: "Kremalı Mantarlı Tavuk Sote & Fırın Makarna",
    menu: "Kremalı Mantarlı Tavuk Göğsü, Fırında Beşamel Soslu Makarna, Roka Salatası",
    soup: "Kremalı Domates Çorbası",
    prepTime: "15 dk",
    cookTime: "25 dk",
    servings: "4 Kişilik",
    ingredients: [
      "600g Tavuk Göğsü (kuşbaşı doğranmış)",
      "300g Kültür Mantarı (dilimlenmiş)",
      "1 kutu Sıvı Krema (200 ml)",
      "1 adet Kuru Soğan & 2 diş Sarımsak",
      "3 yemek kaşığı Sıvı Yağ & 1 yemek kaşığı Tereyağı",
      "1 tatlı kaşığı Tuz, Taze Çekilmiş Karabiber & Taze Kekik"
    ],
    steps: [
      "Geniş bir tavayı iyice ısıtın. Sıvı yağı ekleyip tavukları yüksek ateşte suyunu salıp çekene kadar soteleyin.",
      "Yemeklik doğranmış soğan ve sarımsağı ekleyip 2-3 dakika kavurun.",
      "Dilimlenmiş mantarları ve tereyağını ilave edin. Mantarlar suyunu çekene kadar yüksek ateşte pişirmeye devam edin.",
      "Son olarak sıvı kremayı, tuzu, karabiberi ve taze kekiği ekleyin. Kısık ateşte krema hafif koyulaşana kadar 4-5 dakika kaynatıp ocaktan alın."
    ],
    tips: "Mantar ve tavukları yüksek ateşte suyunu salmadan mühürleyin, krema ve taze kekik ile zenginleştirin."
  },
  {
    id: "rec-3",
    category: "tavuk",
    categoryLabel: "🍗 Tavuk / Kanatlı",
    title: "Çıtır Tavuk Şinitzel & İpeksi Patates Püresi",
    menu: "Ev Yapımı Tavuk Şinitzel, Tereyağlı Patates Püresi, Ballı Hardallı Marul Salatası",
    soup: "Yayla Çorbası",
    prepTime: "20 dk",
    cookTime: "15 dk",
    servings: "4 Kişilik",
    ingredients: [
      "4 adet Tavuk Göğsü Fileto (inceltilmiş)",
      "2 adet Yumurta (çırpılmış)",
      "1 su bardağı Galeta Unu & 1 su bardağı Un",
      "Püre için: 4 adet Patates, 2 yemek kaşığı Tereyağı, 1 çay bardağı Süt, Muskat rendesi",
      "Kızartmak için Sıvı Yağ & Tuz, Karabiber"
    ],
    steps: [
      "Tavuk filetoları buzdolabı poşeti arasında merdane ile hafifçe döverek inceltin, tuz ve karabiberle tatlandırın.",
      "Filetoları sırasıyla önce una, sonra çırpılmış yumurtaya, en son her yerini kaplayacak şekilde galeta ununa bulayın.",
      "Kızgın yağda arkalı önlü altın sarısı renk alana kadar 3-4'er dakika kızartın.",
      "Haşlanmış sıcak patatesleri tereyağı, ılık süt, muskat ve tuzla pürüzsüz kıvama gelene kadar ezin. Şinitzel ile birlikte servis edin."
    ],
    tips: "Şinitzeli galeta ununa bulamadan önce un ve yumurtaya iyice batırın; püreye tereyağı ve muskat rendesi ekleyin."
  },
  {
    id: "rec-4",
    category: "tavuk",
    categoryLabel: "🍗 Tavuk / Kanatlı",
    title: "Tavuklu Sultan Kebabı & Havuç Tarator",
    menu: "Yufkada Sebzeli Beşamel Soslu Tavuk Kebabı, Yoğurtlu Havuç Tarator, Şehriye Çorbası",
    soup: "Tel Şehriye Çorbası",
    prepTime: "25 dk",
    cookTime: "30 dk",
    servings: "4 Kişilik",
    ingredients: [
      "2 adet Yufka",
      "500g Tavuk Göğsü (küçük küpler halinde)",
      "1 su bardağı Garnitür (bezelye, havuç, patates)",
      "1 adet Kuru Soğan & 1 yemek kaşığı Salça",
      "Beşamel için: 1.5 yemek kaşığı Un, 1.5 su bardağı Süt, 1 yemek kaşığı Tereyağı",
      "Üzeri için: 1 su bardağı Rendelenmiş Kaşar Peyniri"
    ],
    steps: [
      "Tavukları soğan ve salçayla soteleyin, garnitürü ekleyip 2 dakika çevirin ve ocaktan alın.",
      "Beşamel sos için tereyağında unu kokusu çıkana kadar kavurup sütü ekleyin ve koyulaşana kadar karıştırarak pişirin.",
      "Yufkaları 4 eşit parçaya bölün. Küçük bir kaseye yufkayı serip iç harçtan koyun ve kenarlarını kapatıp fırın tepsisine ters çevirin.",
      "Üzerlerine beşamel sos döküp kaşar peyniri serpin. 190°C fırında üzeri kızarana kadar yaklaşık 20-25 dakika fırınlayın."
    ],
    tips: "Yufkayı küçük güveç kaplarında porsiyonluk sarıp üzerine kaşar peyniri serperek fırınlayın."
  },

  // Et & Köfte
  {
    id: "rec-5",
    category: "et_kofte",
    categoryLabel: "🥩 Et & Köfte",
    title: "Izgara Anne Köftesi & Baharatlı Fırın Patates & Cacık",
    menu: "Anne Köftesi, Baharatlı Fırın Elma Dilim Patates, Şehriyeli Bulgur Pilavı & Salatalıklı Cacık",
    soup: "Ezogelin Çorbası",
    prepTime: "20 dk",
    cookTime: "20 dk",
    servings: "4 Kişilik",
    ingredients: [
      "500g Orta Yağlı Dana Kıyma",
      "1 adet Kuru Soğan (rendelenip suyu sıkılmış)",
      "1 adet Yumurta & 2 dilim Bayat Ekmek İçi (ıslatılıp sıkılmış)",
      "2 diş Sarımsak & Yarım demet Maydanoz (ince kıyılmış)",
      "1'er tatlı kaşığı Kimyon, Karabiber, Pul Biber, Tuz",
      "Fırın Patates: 4 adet Patates, Kekik, Zeytinyağı, Toz Biber"
    ],
    steps: [
      "Geniş bir kapta kıyma, soğan, sarımsak, yumurta, ekmek içi, maydanoz ve baharatları en az 10 dakika sakız kıvamına gelene kadar yoğurun.",
      "Harcı buzdolabında 30 dakika dinlendirdikten sonra ceviz büyüklüğünde parçalar koparıp yassı köfte şekli verin.",
      "Döküm tavada veya ızgarada her iki tarafını orta ateşte 4-5 dakika kurutmadan pişirin.",
      "Önceden baharatlanıp fırınlanmış patates dilimleri ve soğuk cacık eşliğinde servis yapın."
    ],
    tips: "Köfte harcına bayat ekmek içi, kimyon ve ince kıyılmış maydanoz ekleyip en az 30 dakika buzdolabında dinlendirin."
  },
  {
    id: "rec-6",
    category: "et_kofte",
    categoryLabel: "🥩 Et & Köfte",
    title: "Geleneksel Fırında Karnıyarık & Tane Pirinç Pilavı",
    menu: "Fırında Kıymalı Karnıyarık, Tereyağlı Pirinç Pilavı, Süzme Yoğurt & Çoban Salata",
    soup: "Tarhana Çorbası",
    prepTime: "25 dk",
    cookTime: "35 dk",
    servings: "4 Kişilik",
    ingredients: [
      "6 adet orta boy Patlıcan",
      "300g Kıyma & 2 adet Kuru Soğan",
      "2 adet Yeşil Biber & 2 adet Domates",
      "1 yemek kaşığı Domates Salçası & 2 diş Sarımsak",
      "Sıvı Yağ, Tuz, Karabiber, Pul Biber, Maydanoz"
    ],
    steps: [
      "Patlıcanları alacalı soyup tuzlu suda 15 dakika bekletin, kurulayıp fırında veya az yağda yumuşayana kadar kızartın.",
      "Tavada soğan ve kıymayı kavurun; biber, sarımsak, salça, domates ve baharatları ekleyip 5 dakika pişirip ocaktan alırken maydanoz ekleyin.",
      "Fırın tepsisine dizdiğiniz patlıcanların ortasını yararak hazırladığınız bol kıymalı harçla doldurun.",
      "Üzerlerine biber ve domates dilimi koyun. Salçalı sıcak su hazırlayıp tepsinin tabanına dökün. 190°C fırında 25-30 dakika pişirin."
    ],
    tips: "Patlıcanları fırında az yağla közleyerek yaparsanız hem çok hafif hem de son derece lezzetli olur."
  },
  {
    id: "rec-7",
    category: "et_kofte",
    categoryLabel: "🥩 Et & Köfte",
    title: "Lokum Tas Kebabı & Patates Püresi",
    menu: "Kuşbaşı Dana Tas Kebabı, İpeksi Patates Püresi, Gavurdağı Salatası",
    soup: "Köz Domates Çorbası",
    prepTime: "15 dk",
    cookTime: "50 dk",
    servings: "4 Kişilik",
    ingredients: [
      "600g Dana Kuşbaşı (yumuşak et)",
      "10-12 adet Arpacık Soğan & 3 diş Sarımsak",
      "1 adet Havuç & 2 adet Patates (küp doğranmış)",
      "1 yemek kaşığı Domates Salçası & 1 tatlı kaşığı Biber Salçası",
      "2 yemek kaşığı Tereyağı, 2 su bardağı Sıcak Su, Tuz, Karabiber, Kekik"
    ],
    steps: [
      "Tencerede tereyağını eritin. Etleri yüksek ateşte suyunu salıp çekene kadar mühürleyin.",
      "Arpacık soğanları ve sarımsakları ekleyip 3-4 dakika kavurun.",
      "Salçaları, küp doğranmış havuç ve patatesleri ilave edin. Sıcak suyu ve baharatları ekleyin.",
      "Kapağını kapatıp kısık ateşte etler lokum gibi yumuşayana kadar yaklaşık 45-50 dakika pişirin."
    ],
    tips: "Eti kısık ateşte kendi suyunda yumuşayana kadar pişirdikten sonra arpacık soğan ve domates salçası ekleyin."
  },
  {
    id: "rec-8",
    category: "et_kofte",
    categoryLabel: "🥩 Et & Köfte",
    title: "Hasanpaşa Köftesi & Garnitürlü Pirinç Pilavı",
    menu: "Püre Yatağında Fırınlanmış Hasanpaşa Köfte, Pirinç Pilavı, Karışık Turşu",
    soup: "Mercimek Çorbası",
    prepTime: "25 dk",
    cookTime: "30 dk",
    servings: "4 Kişilik",
    ingredients: [
      "500g Kıyma, 1 Soğan, 1 Yumurta, Galeta Unu, Baharatlar",
      "Püre: 3 Patates, 1 yemek kaşığı Tereyağı, Yarım çay bardağı Süt, Kaşar rendesi",
      "Sosu: 1 yemek kaşığı Salça, 1.5 su bardağı Sıcak Su, Tuz"
    ],
    steps: [
      "Köfte malzemelerini iyice yoğurun. Mandalina büyüklüğünde parçalar alıp ortası çukur çanak şekli verin.",
      "Fırın tepsisine dizip 190°C fırında 15 dakika ön pişirme yapın.",
      "Haşlanmış patateslerden hazırladığınız kremamsı püreyi köfte çanaklarının ortasına tepeleme doldurun.",
      "Üzerlerine kaşar peyniri serpip tepsiye salçalı sosu dökün. Kaşarlar eriyip kızarana kadar 15 dakika daha fırınlayın."
    ],
    tips: "Köftelere çanak şekli verip fırınladıktan sonra ortalarına sıkma torbasıyla kaşarlı patates püresi sıkın."
  },

  // Bakliyat & Güveç
  {
    id: "rec-9",
    category: "bakliyat",
    categoryLabel: "🫘 Bakliyat & Güveç",
    title: "Geleneksel Kuru Fasulye & Şehriyeli Pirinç Pilavı",
    menu: "Etli / Sucuklu Kuru Fasulye, Tereyağlı Pirinç Pilavı, Çıtır Turşu & Kuru Soğan",
    soup: "Yayla Çorbası",
    prepTime: "15 dk (Önceden ıslatılmış)",
    cookTime: "45 dk",
    servings: "4-6 Kişilik",
    ingredients: [
      "2 su bardağı Kuru Fasulye (akşamdan ıslatılmış)",
      "250g Kuşbaşı Dana Eti veya Kasap Sucuğu",
      "1 adet büyük Kuru Soğan & 2 adet Yeşil Biber",
      "1.5 yemek kaşığı Domates Salçası & 1 tatlı kaşığı Biber Salçası",
      "2 yemek kaşığı Tereyağı, Sıcak Su, Pul Biber, Kimyon, Tuz"
    ],
    steps: [
      "Akşamdan ıslatılmış fasulyeleri bol suda hafif diri kalacak şekilde 15-20 dakika haşlayıp süzün.",
      "Tencerede tereyağında eti suyunu çekene kadar soteleyin. Yemeklik doğranmış soğanı ve biberi ekleyip kavurun.",
      "Salçaları ilave edip 2 dakika kokusu çıkana kadar karıştırın. Haşlanmış fasulyeleri ekleyin.",
      "Üzerini 2 parmak geçecek kadar sıcak su ve baharatları ilave edin. Kısık ateşte fasulyeler helmelenene kadar pişirin."
    ],
    tips: "İspir fasulyesi kullanarak kısık ateşte güveçte pişirirseniz lokum gibi kıvam alır."
  },
  {
    id: "rec-10",
    category: "bakliyat",
    categoryLabel: "🫘 Bakliyat & Güveç",
    title: "Yeşil Mercimek Yemeği & Cevizli Erişte",
    menu: "Kıymalı Yeşil Mercimek Yemeği, Cevizli Tereyağlı Erişte, Sarımsaklı Yoğurt",
    soup: "Domates Çorbası",
    prepTime: "15 dk",
    cookTime: "35 dk",
    servings: "4 Kişilik",
    ingredients: [
      "1.5 su bardağı Yeşil Mercimek",
      "150g Kıyma & 1 adet Kuru Soğan",
      "1 adet Havuç & 1 adet Patates (küp doğranmış)",
      "1 yemek kaşığı Salça, Zeytinyağı, Kimyon, Tuz, Karabiber"
    ],
    steps: [
      "Yeşil mercimekleri siyah suyu çıkması için 10 dakika kaynatıp suyunu süzün.",
      "Tencerede zeytinyağında kıymayı ve soğanı kavurun. Salçayı, havuç ve patates küplerini ekleyin.",
      "Mercimekleri ilave edip sıcak su ve baharatları ekleyin. Sebzeler ve mercimek yumuşayana kadar kısık ateşte pişirin."
    ],
    tips: "Yeşil mercimeğe bir miktar havuç ve patates küpleri ekleyerek lezzetini ve besin değerini katlayın."
  },
  {
    id: "rec-11",
    category: "bakliyat",
    categoryLabel: "🫘 Bakliyat & Güveç",
    title: "Etli Nohut Yemeği & Şehriyeli Bulgur Pilavı",
    menu: "Kuşbaşı Etli Nohut Yemeği, Şehriyeli Bulgur Pilavı, Cacık & Biber Turşusu",
    soup: "Tarhana Çorbası",
    prepTime: "15 dk (Önceden ıslatılmış)",
    cookTime: "40 dk",
    servings: "4 Kişilik",
    ingredients: [
      "2 su bardağı Nohut (akşamdan ıslatılmış)",
      "300g Dana Kuşbaşı",
      "1 adet Soğan, 1.5 yemek kaşığı Salça, 2 yemek kaşığı Tereyağı, Sıcak Su, Kimyon, Tuz"
    ],
    steps: [
      "Düdüklü tencerede tereyağında etleri mühürleyin. Soğanları ekleyip kavurun.",
      "Salçayı ekleyip kokusu çıkana kadar çevirin. Islatılmış nohutları, kimyonu, tuzu ve sıcak suyu ekleyin.",
      "Düdüklü tencerenin kapağını kapatıp orta ateşte düdük çaldıktan sonra 30-35 dakika pişirin."
    ],
    tips: "Nohutları bir gece önceden ıslatıp düdüklü tencerede kemikli et suyuyla pişirin."
  },

  // Sebze & Zeytinyağlı
  {
    id: "rec-12",
    category: "sebze",
    categoryLabel: "🥬 Sebze & Zeytinyağlı",
    title: "Zeytinyağlı Taze Fasulye & Bulgur Pilavı & Yoğurt",
    menu: "Domatesli Zeytinyağlı Taze Fasulye, Domatesli Bulgur Pilavı, Ev Yoğurdu",
    soup: "Mercimek Çorbası",
    prepTime: "20 dk",
    cookTime: "40 dk",
    servings: "4 Kişilik",
    ingredients: [
      "1 kg Taze Fasulye (ayıklanıp uzunlamasına bölünmüş)",
      "3 adet olgun Domates (küp doğranmış)",
      "2 adet Kuru Soğan (piyazlık doğranmış)",
      "1 çay bardağı Sızma Zeytinyağı",
      "1 adet Kesme Şeker, 1 tatlı kaşığı Tuz, 1 çay bardağı Sıcak Su"
    ],
    steps: [
      "Geniş ve yayvan bir tencereye piyazlık soğanları serin. Üzerine ayıklanmış taze fasulyeleri yerleştirin.",
      "En üste küp doğranmış domatesleri ve şekeri ekleyin. Zeytinyağını, tuzu ve sıcak suyu gezdirin.",
      "Tencerenin kapağını kapatıp kısık ateşte fasulyeler yumuşayıp kendi suyunda pişene kadar yaklaşık 40 dakika pişirin.",
      "Ilık veya soğuk olarak yanında tane bulgur pilavı ve yoğurtla servis edin."
    ],
    tips: "Taze fasulyeye bir kesme şeker ve bol rendelenmiş domates ekleyip kısık ateşte kendi buharında pişirin."
  },
  {
    id: "rec-13",
    category: "sebze",
    categoryLabel: "🥬 Sebze & Zeytinyağlı",
    title: "Fırında Kabak Mücver & Yoğurtlu Semizotu & Makarna",
    menu: "Fırında Dereotlu Kabak Mücver, Sarımsaklı Yoğurtlu Semizotu Salatası, Domates Soslu Burgu Makarna",
    soup: "Ezogelin Çorbası",
    prepTime: "20 dk",
    cookTime: "35 dk",
    servings: "4 Kişilik",
    ingredients: [
      "3 adet Kabak (rendelenip suyu sıkılmış)",
      "3 adet Yumurta & 1 su bardağı Beyaz Peynir / Lor",
      "Yarım demet Dereotu & Yarım demet Taze Soğan",
      "1 çay bardağı Zeytinyağı, 1 su bardağı Un, 1 paket Kabartma Tozu, Tuz, Karabiber"
    ],
    steps: [
      "Rendelenmiş kabakların suyunu avucunuzda sıkarak derin bir kaba alın.",
      "İçine yumurta, peynir, ince kıyılmış dereotu, taze soğan, zeytinyağı, un, kabartma tozu ve baharatları ekleyip spatula ile karıştırın.",
      "Yağlanmış borcama harcı döküp üzerini düzeltin. İsteğe bağlı susam/çörek otu serpin.",
      "180°C fırında üzeri altın sarısı kızarana kadar yaklaşık 35 dakika pişirin. Dilimleyerek sarımsaklı yoğurtla servis yapın."
    ],
    tips: "Kabakların suyunu iyice sıkarak harca ekleyin, fırında pişirerek hem hafif hem çıtır olmasını sağlayın."
  },
  {
    id: "rec-14",
    category: "sebze",
    categoryLabel: "🥬 Sebze & Zeytinyağlı",
    title: "Kıymalı Bezelye Yemeği & Havuçlu Pirinç Pilavı",
    menu: "Kıymalı Patatesli Bezelye Yemeği, Tane Pirinç Pilavı, Yoğurt & Mevsim Salatası",
    soup: "Yayla Çorbası",
    prepTime: "15 dk",
    cookTime: "30 dk",
    servings: "4 Kişilik",
    ingredients: [
      "500g Bezelye (taze veya dondurulmuş)",
      "200g Kıyma & 1 adet Soğan",
      "1 adet Havuç & 1 adet Patates (küp doğranmış)",
      "1 yemek kaşığı Salça, 3 yemek kaşığı Sıvı Yağ, Sıcak Su, Dereotu, Tuz"
    ],
    steps: [
      "Tencerede yağda kıyma ve soğanı kavurun. Salçayı ekleyip kokusu çıkana kadar karıştırın.",
      "Küp doğranmış havuç ve patatesleri ekleyip 2 dakika soteleyin. Bezelyeleri ilave edin.",
      "Sıcak su ve tuz ekleyip kısık ateşte sebzeler yumuşayana kadar 25-30 dakika pişirin. İnce kıyılmış taze dereotu ile süsleyin."
    ],
    tips: "Bezelye yemeğine taze dereotu ve bir miktar havuç katarak lezzet dengesini yükseltin."
  },
  {
    id: "rec-15",
    category: "sebze",
    categoryLabel: "🥬 Sebze & Zeytinyağlı",
    title: "Karnabahar & Brokoli Graten & Şinitzel",
    menu: "Fırında Beşamel Soslu Kaşarlı Karnabahar Graten, Fırın Tavuk Şinitzel, Akdeniz Salatası",
    soup: "Kremalı Mantar Çorbası",
    prepTime: "20 dk",
    cookTime: "30 dk",
    servings: "4 Kişilik",
    ingredients: [
      "Yarım boy Karnabahar & 1 küçük boy Brokoli (çiçeklerine ayrılmış)",
      "Beşamel: 2 yemek kaşığı Tereyağı, 2 yemek kaşığı Un, 2.5 su bardağı Süt, Muskat, Tuz",
      "Üzeri için: 1.5 su bardağı Rendelenmiş Kaşar Peyniri"
    ],
    steps: [
      "Karnabahar ve brokolileri tuzlu kaynar suda hafif diri kalacak şekilde 5-6 dakika haşlayıp süzün ve fırın kabına dizin.",
      "Tereyağında unu kavurup sütü ekleyerek pürüzsüz kıvamda beşamel sos hazırlayın. Muskat ve tuz ekleyin.",
      "Sosu sebzelerin üzerine dökün, bol kaşar peyniri serpin.",
      "200°C fırında üzeri nar gibi kızarana kadar 25 dakika fırınlayın."
    ],
    tips: "Karnabaharları hafif haşlayıp beşamel sos ve bol muskat rendesiyle fırınlayın."
  },

  // Balık & Deniz Ürünleri
  {
    id: "rec-16",
    category: "balik",
    categoryLabel: "🐟 Balık & Deniz Ürünleri",
    title: "Fırında Limonlu Sarımsaklı Somon & Fırın Patates",
    menu: "Fırında Baharatlı Somon Fileto, Taze Biberiyeli Fırın Patates, Ballı Hardallı Roka Salatası",
    soup: "Balık Çorbası veya Mercimek Çorbası",
    prepTime: "15 dk",
    cookTime: "20 dk",
    servings: "4 Kişilik",
    ingredients: [
      "4 dilim Somon Fileto",
      "1 adet Limon (dilimlenmiş)",
      "3 diş Sarımsak (ince dilimlenmiş)",
      "4 yemek kaşığı Zeytinyağı & 1 yemek kaşığı Tereyağı",
      "Taze Dereotu, Taze Biberiye, Deniz Tuzu, Taze Çekilmiş Karabiber"
    ],
    steps: [
      "Somon filetoları fırın tepsisine dizin. Üzerlerine zeytinyağı gezdirip tuz ve karabiber serpin.",
      "Her somonun üzerine limon dilimleri, sarımsak parçaları ve taze dereotu/biberiye yerleştirin.",
      "Önceden ısıtılmış 190°C fırında somonlar suyunu kaybetmeden yumuşacık kalacak şekilde 18-20 dakika pişirin.",
      "Fırından alıp üzerine eritilmiş tereyağı gezdirerek roka salatasıyla servis edin."
    ],
    tips: "Somonun üzerine zeytinyağı, sarımsak, limon dilimleri ve taze dereotu koyup 190 derecede 20 dakika pişirin."
  },
  {
    id: "rec-17",
    category: "balik",
    categoryLabel: "🐟 Balık & Deniz Ürünleri",
    title: "Çipura Izgara & Fırın Patates & Soğan Salatası",
    menu: "Fırında Bütün Çipura / Levrek, Elma Dilim Patates, Sumaklı Kırmızı Soğan Salatası & Roka",
    soup: "Kremalı Balık Çorbası",
    prepTime: "15 dk",
    cookTime: "25 dk",
    servings: "4 Kişilik",
    ingredients: [
      "2-4 adet Temizlenmiş Çipura veya Levrek",
      "1 adet Limon & 1 adet Kırmızı Soğan",
      "4 diş Sarımsak & 4 adet Defne Yaprağı",
      "Sızma Zeytinyağı, Deniz Tuzu, Tane Karabiber"
    ],
    steps: [
      "Balıkların üzerine bıçakla 2'şer çizik atın. İçini ve dışını zeytinyağı ve deniz tuzuyla ovalayın.",
      "Balıkların karın boşluğuna defne yaprağı, sarımsak ve limon dilimi yerleştirin.",
      "Fırın tepsisine dizip 200°C fırında yaklaşık 25 dakika derisi çıtırlaşana kadar pişirin.",
      "Sumaklı maydanozlu soğan salatası ve limon dilimleriyle sıcak servis edin."
    ],
    tips: "Balığın içine defne yaprağı ve sarımsak yerleştirerek fırınlarsanız enfes bir aroma elde edersiniz."
  },

  // Hamur İşi & Mantı & Pratik
  {
    id: "rec-18",
    category: "makarna_manti",
    categoryLabel: "🍝 Makarna, Mantı & Pratik",
    title: "Ev Yapımı Kayseri Mantısı & Sarımsaklı Yoğurt",
    menu: "Tereyağlı Sumaklı Ev Mantısı, Sarımsaklı Yoğurt, Çıtır Nane & Biber Yağı, Çoban Salata",
    soup: "Ezogelin Çorbası",
    prepTime: "10 dk",
    cookTime: "15 dk",
    servings: "4 Kişilik",
    ingredients: [
      "500g Ev Mantısı",
      "2 su bardağı Süzme Yoğurt & 3 diş Sarımsak",
      "3 yemek kaşığı Tereyağı & 1 tatlı kaşığı Kırmızı Toz Biber / Pul Biber",
      "1 yemek kaşığı Kuru Nane, 1 tatlı kaşığı Sumak, Tuz"
    ],
    steps: [
      "Bol tuzlu kaynar suda mantıları yumuşayana kadar yaklaşık 10-12 dakika haşlayıp süzün (haşlama suyundan 2 kaşık ayırın).",
      "Sarımsaklı yoğurdu pürüzsüzce çırpın. Küçük tavada tereyağını kızdırıp pul biber ve naneyi hafifçe köpürtün.",
      "Servis tabağına sıcak mantıyı alın, üzerine sarımsaklı yoğurt dökün.",
      "En üste kızgın tereyağlı naneli sosu gezdirip sumak serperek servis yapın."
    ],
    tips: "Haşlama suyuna bir parça tereyağı ekleyin; sos için nane, pul biber ve tereyağını hafifçe yakın."
  },
  {
    id: "rec-19",
    category: "makarna_manti",
    categoryLabel: "🍝 Makarna, Mantı & Pratik",
    title: "Kıymalı Lazanya & Roka Parmesan Salatası",
    menu: "Fırında Bolonez Soslu & Beşamel Soslu Lazanya, Cevizli Roka Salatası, Fırın Sarımsaklı Ekmek",
    soup: "Domates Çorbası",
    prepTime: "25 dk",
    cookTime: "35 dk",
    servings: "4-6 Kişilik",
    ingredients: [
      "12-14 yaprak Lazanya",
      "400g Kıyma, 1 Soğan, 1 Havuç, 2 diş Sarımsak, 2 su bardağı Domates Püresi",
      "Beşamel: 3 yemek kaşığı Tereyağı, 3 yemek kaşığı Un, 3 su bardağı Süt, Muskat",
      "2 su bardağı Rendelenmiş Kaşar Peyniri"
    ],
    steps: [
      "Bolonez sos için kıymayı sebzeler ve domates püresiyle kısık ateşte 20 dakika pişirin.",
      "Beşamel sosu tereyağı, un ve sütle pürüzsüz kıvamda pişirin.",
      "Borcamın tabanına beşamel sos sürün. Sırasıyla lazanya yaprağı, bolonez sos, beşamel sos ve kaşar peyniri katları oluşturun (en az 4 kat).",
      "En üst kata bol beşamel sos ve kaşar peyniri döküp 180°C fırında üzeri altın sarısı kızarana kadar 30 dakika pişirin. 10 dakika dinlendirip dilimleyin."
    ],
    tips: "Bolonez sosu kısık ateşte havuç ve kereviz sapıyla uzun süre pişirirseniz restoran kalitesinde bir lazanya elde edersiniz."
  }
];

let lastRecommendedRecipeId = null;
let isRecipeDetailsOpen = false;

function getSmartDinnerRecommendation(excludeId = null) {
  // 1. Analyze past 7-10 dinners from cache
  const recentDinners = (dinnersCache || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const recentText = recentDinners.map(d => (d.meal || '').toLowerCase()).join(' ');

  // Detect recent categories
  const recentCats = new Set();
  if (/tavuk|şinitzel|but|göğüs/.test(recentText)) recentCats.add('tavuk');
  if (/köfte|kıyma|et|kebap|karnıyarık/.test(recentText)) recentCats.add('et_kofte');
  if (/fasulye|nohut|mercimek|bakliyat/.test(recentText)) recentCats.add('bakliyat');
  if (/mücver|kabak|bezelye|karnabahar|brokoli|zeytinyağlı|ıspanak|enginar/.test(recentText)) recentCats.add('sebze');
  if (/balık|somon|çipura|levrek|hamsi/.test(recentText)) recentCats.add('balik');
  if (/makarna|mantı|lazanya|börek|pizza/.test(recentText)) recentCats.add('makarna_manti');

  // Filter candidates
  let candidates = RECIPE_DATABASE.filter(r => r.id !== excludeId);

  // Exclude dishes whose exact names match recent dinners
  candidates = candidates.filter(r => !recentText.includes(r.title.toLowerCase().split('&')[0].trim()));

  // Prioritize categories NOT recently eaten
  const unrepresentedCandidates = candidates.filter(r => !recentCats.has(r.category));
  const finalPool = unrepresentedCandidates.length > 0 ? unrepresentedCandidates : candidates;

  const picked = finalPool[Math.floor(Math.random() * finalPool.length)] || RECIPE_DATABASE[0];
  lastRecommendedRecipeId = picked.id;
  isRecipeDetailsOpen = false;

  // Generate intelligent explanation
  let reason = "";
  if (recentDinners.length === 0) {
    reason = "Geçmiş yemek kaydı bulunmadığı için günün en dengeli ve sevilen menülerinden biri seçildi.";
  } else {
    const recentSample = recentDinners.slice(0, 3).map(d => d.meal.split(',')[0]).join(', ');
    reason = `Son günlerdeki yemekleriniz (${recentSample}) incelendi. Menünüzde besin çeşitliliği ve lezzet dengesi sağlamak için <b>${picked.categoryLabel}</b> kategorisinden taze bir öneri hazırlandı.`;
  }

  return { recipe: picked, reason: reason };
}

window.openDinnerRecommenderModal = function() {
  const result = getSmartDinnerRecommendation();
  renderDinnerRecommenderContent(result);
  openModal('dinner-recommender-modal');
};

window.refreshDinnerRecommendation = function() {
  const result = getSmartDinnerRecommendation(lastRecommendedRecipeId);
  renderDinnerRecommenderContent(result);
};

window.toggleRecipeDetails = function() {
  isRecipeDetailsOpen = !isRecipeDetailsOpen;
  const box = document.getElementById('recom-recipe-box');
  const btn = document.getElementById('recom-recipe-toggle-btn');
  if (box && btn) {
    if (isRecipeDetailsOpen) {
      box.style.display = 'flex';
      btn.innerHTML = `<span>📖 Yemek Tarifini Gizle</span> <span>▲</span>`;
    } else {
      box.style.display = 'none';
      btn.innerHTML = `<span>📖 Detaylı Yemek Tarifini Gör (Nasıl Yapılır?)</span> <span>▼</span>`;
    }
  }
};

function renderDinnerRecommenderContent(result) {
  const container = document.getElementById('dinner-recommender-content');
  if (!container) return;
  const { recipe, reason } = result;

  container.innerHTML = `
    <div class="dinner-recom-card">
      <!-- Category Badge & Title -->
      <div class="recom-hero">
        <span class="recom-cat-tag">${recipe.categoryLabel}</span>
        <h3 class="recom-title">${recipe.title}</h3>
      </div>

      <!-- Menu Composition -->
      <div class="recom-box">
        <div class="recom-box-label">🍽️ Tavsiye Edilen Menü Bileşenleri</div>
        <div class="recom-menu-text">${recipe.menu}</div>
        ${recipe.soup ? `
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--glass-border); font-size: 13px; color: var(--text-secondary);">
            🍲 <b>Başlangıç Çorbası:</b> ${recipe.soup}
          </div>
        ` : ''}
      </div>

      <!-- Recipe Fetch & Detail Button (Requested by User) -->
      <div>
        <button id="recom-recipe-toggle-btn" class="recom-recipe-toggle-btn" onclick="toggleRecipeDetails()">
          <span>📖 Detaylı Yemek Tarifini Gör (Nasıl Yapılır?)</span>
          <span>▼</span>
        </button>

        <div id="recom-recipe-box" class="recom-recipe-details" style="display: none; margin-top: 10px;">
          <!-- Meta Time & Servings -->
          <div class="recom-meta-row">
            ${recipe.prepTime ? `<span class="recom-meta-pill">⏱️ Hazırlık: ${recipe.prepTime}</span>` : ''}
            ${recipe.cookTime ? `<span class="recom-meta-pill">🔥 Pişirme: ${recipe.cookTime}</span>` : ''}
            ${recipe.servings ? `<span class="recom-meta-pill">👥 ${recipe.servings}</span>` : ''}
          </div>

          <!-- Ingredients List -->
          ${recipe.ingredients && recipe.ingredients.length > 0 ? `
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #fbbf24; margin-bottom: 6px;">🥗 Gerekli Malzemeler:</div>
              <div class="recom-ing-list">
                ${recipe.ingredients.map(ing => `
                  <div class="recom-ing-item">
                    <span style="color:#10b981;">✓</span>
                    <span>${ing}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Step by Step Cooking Instructions -->
          ${recipe.steps && recipe.steps.length > 0 ? `
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #fbbf24; margin-bottom: 6px;">👨‍🍳 Adım Adım Hazırlanışı:</div>
              <div class="recom-steps-list">
                ${recipe.steps.map((step, idx) => `
                  <div class="recom-step-item">
                    <span class="recom-step-num">${idx + 1}.</span>
                    <span>${step}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Chef's Tip -->
      <div style="background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--radius-lg); padding: 14px 18px;">
        <div style="font-size: 12px; font-weight: 700; color: #fbbf24; margin-bottom: 4px;">💡 Şefin Hazırlık İpucu</div>
        <div style="font-size: 13px; color: var(--text-primary); line-height: 1.45;">${recipe.tips}</div>
      </div>

      <!-- Reasoning -->
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-lg); padding: 12px 16px; font-size: 12px; color: var(--text-secondary); line-height: 1.45;">
        🧠 <b>Neden Bu Menü?</b> ${reason}
      </div>

      <!-- Missing Ingredients & Shopping Note -->
      <div style="background: rgba(99, 102, 241, 0.07); border: 1px dashed rgba(99, 102, 241, 0.35); border-radius: var(--radius-lg); padding: 14px 16px;">
        <label for="dinner-recommender-note" style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
          <span>🛒 Eksik Malzeme & Alışveriş / Aile Notu (Opsiyonel):</span>
        </label>
        <textarea id="dinner-recommender-note" class="form-textarea" style="width: 100%; min-height: 60px; font-size: 13px; border-radius: 8px; resize: vertical; margin-bottom: 4px;" placeholder="Örn: 1 kg tavuk göğsü, taze krema ve mantar alınacak..."></textarea>
        <div style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">
          💡 <i>Not bırakırsanız, hem menüye eklenir hem de <b>Aile Panosu (Yapılacaklar)</b> listesine otomatik olarak alınacaklar görevi olarak eklenir.</i>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap;">
        <button class="btn btn-primary" style="flex: 1; padding: 12px 16px; font-weight: 700;" onclick="applyRecommendedDinner('${recipe.menu.replace(/'/g, "\\'")}', '${recipe.title.replace(/'/g, "\\'")}')">
          📅 Bu Menüyü Bugüne Ekle
        </button>
        <button class="btn btn-glass" style="padding: 12px 16px;" onclick="refreshDinnerRecommendation()">
          🔄 Başka Öneri Getir
        </button>
      </div>
    </div>
  `;
}

window.applyRecommendedDinner = async function(mealText, recipeTitle = '') {
  const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;
  if (!isAdmin) {
    alert("Yemek menüsünü kaydetmek için lütfen Admin girişi yapınız.");
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const noteInput = document.getElementById('dinner-recommender-note');
  const note = noteInput ? noteInput.value.trim() : '';

  const finalMealText = note ? `${mealText} — 📝 Eksikler: ${note}` : mealText;

  try {
    const { error: dinnerErr } = await window.supabaseClient
      .from('family_dinners')
      .insert([{ date: todayStr, meal: finalMealText }]);

    if (dinnerErr) throw dinnerErr;

    // If there is an ingredient / shopping note, automatically add a todo to family_board!
    if (note) {
      const todoTitle = recipeTitle ? `🛒 [Yemek Malzemesi] ${recipeTitle}: ${note}` : `🛒 [Yemek Malzemesi]: ${note}`;
      await window.supabaseClient
        .from('family_board')
        .insert([{
          type: 'todo',
          text: todoTitle,
          completed: false
        }]);
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    closeModal('dinner-recommender-modal');
    if (window.Toast) {
      if (note) {
        Toast.success("Günün akşam menüsü ve eksik malzemeler Aile Panosu'na eklendi! 🛒🍽️");
      } else {
        Toast.success("Günün akşam menüsü başarıyla kaydedildi! 🍽️");
      }
    }
    
    await renderDinners(true);
    if (note) await renderBoard(true);
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  } catch (err) {
    console.error("Apply recommended dinner error:", err);
    alert("Yemek kaydedilirken bir hata oluştu: " + (err.message || ''));
  }
};

/* ================= BOARD ================= */
async function renderBoard(silent = false) {
  const container = document.getElementById('board-list');
  if (!container) return;
  if (!silent && (!boardCache || boardCache.length === 0)) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); grid-column: 1 / -1;">Yükleniyor...</div>`;
  }

  try {
    const { data: items, error } = await window.supabaseClient
      .from('family_board')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    boardCache = items || [];
    
    const todos = boardCache.filter(item => item.type === 'todo');
    const infos = boardCache.filter(item => item.type === 'info');

    const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;

    const renderTodoList = () => {
      if (todos.length === 0) {
        return `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px; background: rgba(255,255,255,0.02); border-radius: var(--radius-md);">Yapılacak görev yok.</div>`;
      }
      return todos.map(item => `
        <div class="board-item todo ${item.completed ? 'completed' : ''}" 
             ${isAdmin ? `onclick="toggleBoardTodo('${item.id}', ${item.completed})"` : ''}
             title="${isAdmin ? (item.completed ? 'Tamamlandı (Geri almak için tıkla)' : 'Tamamlamak için tıkla') : ''}">
          <div class="board-item-icon">
            <div class="todo-check-circle ${item.completed ? 'checked' : ''}">
              ${item.completed ? '✓' : ''}
            </div>
          </div>
          <div class="board-item-content">
            <div class="board-item-text">${item.text}</div>
          </div>
          ${isAdmin ? `
            <div class="action-btns" onclick="event.stopPropagation();">
              <button class="dinner-edit-btn" onclick="openEditBoardModal('${item.id}', event)" title="Düzenle">✏️</button>
              <button class="board-item-delete" onclick="deleteBoardItem('${item.id}', event)" title="Sil">✕</button>
            </div>
          ` : ''}
        </div>
      `).join('');
    };

    const renderInfoList = () => {
      if (infos.length === 0) {
        return `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px; background: rgba(255,255,255,0.02); border-radius: var(--radius-md);">Bilgilendirme notu yok.</div>`;
      }
      return infos.map(item => `
        <div class="board-item info">
          <div class="board-item-icon">📌</div>
          <div class="board-item-content">
            <div class="board-item-text">${item.text}</div>
          </div>
          ${isAdmin ? `
            <div class="action-btns" onclick="event.stopPropagation();">
              <button class="dinner-edit-btn" onclick="openEditBoardModal('${item.id}', event)" title="Düzenle">✏️</button>
              <button class="board-item-delete" onclick="deleteBoardItem('${item.id}', event)" title="Sil">✕</button>
            </div>
          ` : ''}
        </div>
      `).join('');
    };

    container.innerHTML = `
      <!-- Sol Kolon: Yapılacaklar (%50) -->
      <div class="board-column">
        <div class="board-column-header">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span>📋 Yapılacaklar</span>
            <span style="font-size: 11px; font-weight: 500; color: var(--text-muted); opacity: 0.85;">💡 Maddelerin üzerine tıklayarak tamamlayabilirsiniz</span>
          </div>
          <span class="board-column-count">${todos.filter(t => !t.completed).length} aktif</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${renderTodoList()}
        </div>
      </div>

      <!-- Sağ Kolon: Bilgilendirmeler (%50) -->
      <div class="board-column">
        <div class="board-column-header">
          <span>📌 Bilgilendirme Notları</span>
          <span class="board-column-count">${infos.length} not</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${renderInfoList()}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Board render error:", err);
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--rose); grid-column: 1 / -1;">Veri çekilemedi.</div>`;
  }
}

window.openNewBoardModal = function() {
  editingBoardId = null;
  const title = document.querySelector('#board-modal .modal-title');
  if (title) title.textContent = "📌 Panoya Not Ekle";
  document.getElementById('add-board-form')?.reset();
  openModal('board-modal');
};

window.openEditBoardModal = function(id, e) {
  if (e) e.stopPropagation();
  const item = boardCache.find(b => String(b.id) === String(id));
  if (!item) return;
  editingBoardId = item.id;
  const title = document.querySelector('#board-modal .modal-title');
  if (title) title.textContent = "📌 Not Düzenle";
  document.getElementById('board-type').value = item.type || 'todo';
  document.getElementById('board-text').value = item.text || '';
  openModal('board-modal');
};

window.toggleBoardTodo = async function(id, currentStatus) {
  const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;
  if (!isAdmin) return;

  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // 1. Optimistic Update (instant UI feedback)
  const item = boardCache.find(b => String(b.id) === String(id));
  if (item) {
    item.completed = !currentStatus;
    await renderBoard(true);
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  }

  // 2. Persist to Supabase in background
  try {
    const { error } = await window.supabaseClient
      .from('family_board')
      .update({ completed: !currentStatus })
      .eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error("Board toggle error:", err);
    if (item) {
      item.completed = currentStatus;
      await renderBoard(true);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  }
};

window.deleteBoardItem = function(id, e) {
  if (e) e.stopPropagation();
  const item = boardCache.find(b => String(b.id) === String(id));
  const label = item && item.text ? `"${item.text.length > 40 ? item.text.slice(0, 40) + '...' : item.text}"` : 'Bu pano notu';

  promptConfirmDelete({
    header: "📌 Pano Notunu Sil",
    icon: "📌",
    title: "Bu pano notunu silmek istediğinizden emin misiniz?",
    subtitle: `${label} panodan kalıcı olarak silinecek.`,
    onConfirm: async () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      boardCache = boardCache.filter(b => String(b.id) !== String(id));
      await window.supabaseClient.from('family_board').delete().eq('id', id);
      if (window.Toast) Toast.info("Pano notu silindi.");
      await renderBoard(true);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  });
};

/* ================= TRAVELS ================= */
async function renderTravels(silent = false) {
  const container = document.getElementById('travels-timeline');
  if (!container) return;
  if (!silent && (!travelsCache || travelsCache.length === 0)) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Yükleniyor...</div>`;
  }

  try {
    const { data: travels, error } = await window.supabaseClient
      .from('family_travels')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    travelsCache = travels || [];

    if (!travels || travels.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Henüz aile gezisi eklenmedi.</div>`;
      return;
    }

    const grouped = {};
    travels.forEach(t => {
      const year = t.year || 'Bilinmiyor';
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(t);
    });

    const years = Object.keys(grouped).sort((a,b) => b - a);
    const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;

    container.innerHTML = years.map(year => `
      <div class="travel-year-group">
        <div class="travel-year-title">
          <span>${year}</span>
          <span style="font-size:14px; font-weight:600; color:var(--text-muted); background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); padding:2px 10px; border-radius:var(--radius-pill); font-family:inherit;">${grouped[year].length} gezi</span>
        </div>
        <div class="travel-timeline">
          ${grouped[year].map(t => `
            <div class="travel-log-card" onclick="openTravelDetailModal('${t.id}')">
              <div class="travel-log-header">
                <div style="flex:1;">
                  <div class="travel-log-title">${t.place}</div>
                  <div style="display:flex; gap:6px; margin-top:6px; align-items:center; flex-wrap:wrap;">
                    ${t.month ? `<span class="travel-month-badge">📅 ${t.month}</span>` : ''}
                    ${t.location ? `<span style="font-size:12px; color:var(--accent); font-weight:600; display:inline-flex; align-items:center; gap:3px;">📍 ${t.location.startsWith('http') ? '<span style="text-decoration:underline;">Haritada Gör</span>' : t.location}</span>` : ''}
                  </div>
                </div>
                ${isAdmin ? `
                  <div class="action-btns" onclick="event.stopPropagation();" style="margin-left:8px;">
                    <button class="dinner-edit-btn" onclick="openEditTravelModal('${t.id}', event)" title="Düzenle">✏️</button>
                    <button class="dinner-delete-btn" style="padding:0;" onclick="deleteTravel('${t.id}', event)" title="Sil">✕</button>
                  </div>
                ` : ''}
              </div>
              ${t.details ? `<div class="travel-log-details" style="margin-top:10px;">${t.details.length > 140 ? t.details.slice(0, 140) + '...' : t.details}</div>` : ''}
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top: 1px solid var(--glass-border);">
                <div class="travel-log-companions">👥 ${t.companions || 'Ailece'}</div>
                <span style="font-size:12px; color:var(--accent); font-weight:600; display:inline-flex; align-items:center; gap:4px;">Detayları Gör <span style="font-size:14px;">🔍</span></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error("Travels render error:", err);
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--rose);">Veri çekilemedi.</div>`;
  }
}

window.openTravelDetailModal = async function(id) {
  const item = travelsCache.find(t => String(t.id) === String(id));
  if (!item) return;

  const titleEl = document.getElementById('td-title');
  const badgeEl = document.getElementById('td-badge');
  const locBadgeEl = document.getElementById('td-location-badge');
  const locTextEl = document.getElementById('td-location-text');
  const compEl = document.getElementById('td-companions');
  const compBox = document.getElementById('td-companions-box');
  const detailsEl = document.getElementById('td-details');
  const adminActions = document.getElementById('td-admin-actions');
  const editBtn = document.getElementById('td-edit-btn');
  const deleteBtn = document.getElementById('td-delete-btn');

  if (titleEl) titleEl.textContent = "✈️ " + (item.place || 'Gezi Detayı');
  
  // Date / month badge
  if (badgeEl) {
    const monthStr = item.month ? item.month + ' ' : '';
    badgeEl.innerHTML = item.month
      ? `<span class="travel-month-badge" style="font-size:12px;">📅 ${item.month}</span> <strong style="color:var(--accent);">${item.year}</strong>`
      : `🗓️ ${item.year}`;
  }
  
  if (locBadgeEl && locTextEl) {
    if (item.location) {
      locBadgeEl.style.display = 'inline-flex';
      if (item.location.startsWith('http')) {
        locTextEl.innerHTML = `<a href="${item.location}" target="_blank" rel="noopener" style="color:var(--accent); text-decoration:underline;">Haritada Gör / Konuma Git 🗺️</a>`;
      } else {
        locTextEl.textContent = item.location;
      }
    } else {
      locBadgeEl.style.display = 'none';
    }
  }

  if (compEl && compBox) {
    if (item.companions) {
      compBox.style.display = 'block';
      compEl.textContent = item.companions;
    } else {
      compBox.style.display = 'none';
    }
  }

  if (detailsEl) {
    detailsEl.textContent = item.details || 'Gezi detay ve notu girilmemiş.';
  }

  const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;
  if (adminActions) {
    adminActions.style.display = isAdmin ? 'flex' : 'none';
    if (editBtn) editBtn.onclick = () => { closeModal('travel-detail-modal'); openEditTravelModal(item.id); };
    if (deleteBtn) deleteBtn.onclick = () => { closeModal('travel-detail-modal'); deleteTravel(item.id); };
  }

  openModal('travel-detail-modal');
};

window.openNewTravelModal = function() {
  editingTravelId = null;
  const title = document.querySelector('#travel-modal .modal-title');
  if (title) title.textContent = "✈️ Gezi Ekle";
  document.getElementById('add-travel-form')?.reset();
  const currentYear = new Date().getFullYear();
  const yearInput = document.getElementById('travel-year');
  if (yearInput) yearInput.value = currentYear;
  openModal('travel-modal');
};

window.openEditTravelModal = function(id, e) {
  if (e) e.stopPropagation();
  const item = travelsCache.find(t => String(t.id) === String(id));
  if (!item) return;
  editingTravelId = item.id;
  const title = document.querySelector('#travel-modal .modal-title');
  if (title) title.textContent = "✈️ Gezi Düzenle";
  
  document.getElementById('travel-year').value = item.year || new Date().getFullYear();
  document.getElementById('travel-month').value = item.month || '';
  document.getElementById('travel-place').value = item.place || '';
  document.getElementById('travel-location').value = item.location || '';
  document.getElementById('travel-companions').value = item.companions || '';
  document.getElementById('travel-details').value = item.details || '';
  
  openModal('travel-modal');
};

window.deleteTravel = function(id, e) {
  if (e) e.stopPropagation();
  const item = travelsCache.find(t => String(t.id) === String(id));
  const label = item && item.place ? `"${item.place}"` : 'Bu gezi kaydı';

  promptConfirmDelete({
    header: "✈️ Geziyi Sil",
    icon: "✈️",
    title: "Bu gezi kaydını silmek istediğinizden emin misiniz?",
    subtitle: `${label} gezi geçmişinden kalıcı olarak silinecek.`,
    onConfirm: async () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      travelsCache = travelsCache.filter(t => String(t.id) !== String(id));
      await window.supabaseClient.from('family_travels').delete().eq('id', id);
      if (window.Toast) Toast.info("Gezi kaydı silindi.");
      await renderTravels(true);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  });
};

/* ================= BIRTHDAYS ================= */
async function renderBirthdays(silent = false) {
  const list = document.getElementById('birthdays-list');
  if (!list) return;
  if (!silent) {
    list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Yükleniyor...</div>`;
  }

  try {
    const { data: birthdays, error } = await window.supabaseClient
      .from('family_birthdays')
      .select('*');

    if (error) throw error;
    birthdaysCache = birthdays || [];

    if (!birthdays || birthdays.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Henüz doğum günü eklenmedi.</div>`;
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const enrichedBirthdays = birthdays.map(b => {
      const birthDate = new Date(b.birthdate);
      let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
      }
      const diffTime = Math.abs(nextBday - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const ageTurn = nextBday.getFullYear() - birthDate.getFullYear();
      return { ...b, nextBday, diffDays, ageTurn };
    });

    enrichedBirthdays.sort((a,b) => a.diffDays - b.diffDays);
    const isAdmin = window.Auth && typeof window.Auth.canManageContent === 'function' ? await window.Auth.canManageContent() : false;

    list.innerHTML = enrichedBirthdays.map(b => {
      let daysText = b.diffDays === 0 ? `<span style="color:var(--accent); font-weight:800;">Bugün! 🎉</span>` : `${b.diffDays} gün kaldı`;
      return `
      <div class="dinner-item">
        <div>
          <div class="dinner-meal" style="font-size: 16px;">${b.name}</div>
          <div class="dinner-date" style="margin-top:2px;">
            ${new Date(b.birthdate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} <br/>
            <span style="display:inline-block; margin-top:4px; padding:2px 8px; background:rgba(255,255,255,0.05); border-radius:12px; font-size:12px;">
              ${b.ageTurn} Yaşına girecek • ${daysText}
            </span>
          </div>
        </div>
        ${isAdmin ? `<button class="dinner-delete-btn" onclick="deleteBirthday('${b.id}')" title="Sil">✕</button>` : ''}
      </div>
    `}).join('');
  } catch (err) {
    console.error("Birthdays render error:", err);
    list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--rose);">Veri çekilemedi.</div>`;
  }
}

window.deleteBirthday = function(id) {
  const item = (birthdaysCache || []).find(b => String(b.id) === String(id));
  const label = item && item.name ? `"${item.name}"` : 'Bu doğum günü';

  promptConfirmDelete({
    header: "🎂 Doğum Gününü Sil",
    icon: "🎂",
    title: "Bu doğum günü kaydını silmek istediğinizden emin misiniz?",
    subtitle: `${label} doğum günleri listesinden kalıcı olarak silinecek.`,
    onConfirm: async () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      birthdaysCache = (birthdaysCache || []).filter(b => String(b.id) !== String(id));
      await window.supabaseClient.from('family_birthdays').delete().eq('id', id);
      if (window.Toast) Toast.info("Doğum günü silindi.");
      await renderBirthdays(true);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  });
};

/* ================= MODALS ================= */
function setupModals() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('open');
        if (window.Modal) window.Modal.syncScrollLock();
      }
    });
  });
  
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        overlay.classList.remove('open');
        if (window.Modal) window.Modal.syncScrollLock();
      }
    });

    // Prevent scrolling behind modal on mobile touch
    overlay.addEventListener('touchmove', (e) => {
      if (e.target === overlay) {
        e.preventDefault();
      }
    }, { passive: false });
  });
}

window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) {
    if (window.Modal && !document.querySelector('.modal-overlay.open, .modal-overlay.active')) {
      window.Modal._savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    el.classList.add('active');
    el.classList.add('open');
    if (window.Modal) window.Modal.syncScrollLock();
  }
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active');
    el.classList.remove('open');
    if (window.Modal) window.Modal.syncScrollLock();
  }
};
