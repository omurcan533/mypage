let currentDinnerYear = 'all';

let editingDinnerId = null;
let editingBoardId = null;
let editingTravelId = null;

let dinnersCache = [];
let boardCache = [];
let travelsCache = [];

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
      const date = document.getElementById('dinner-date').value;
      const meal = document.getElementById('dinner-meal').value;
      
      if (!date || !meal) return;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true, editingDinnerId ? "Güncelleniyor..." : "Kaydediliyor...");

      try {
        let error;
        if (editingDinnerId) {
          const res = await window.supabaseClient
            .from('family_dinners')
            .update({ date, meal })
            .eq('id', editingDinnerId);
          error = res.error;
        } else {
          const res = await window.supabaseClient
            .from('family_dinners')
            .insert([{ date, meal }]);
          error = res.error;
        }
        
        if (!error) {
          editingDinnerId = null;
          e.target.reset();
          closeModal('dinner-modal');
          if (window.Toast) Toast.success("Yemek kaydedildi!");
          renderDinners();
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
          renderBoard();
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
          renderTravels();
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
          renderBirthdays();
        } else {
          console.error("Birthday Insert Error:", error);
          if (window.Toast) Toast.error("Kayıt sırasında bir hata oluştu: " + error.message);
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }
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
async function renderDinners() {
  const list = document.getElementById('dinner-list');
  if (!list) return;
  list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Yükleniyor...</div>`;

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
              <th>🍽️ Akşam Menüsü</th>
              ${isAdmin ? `<th style="text-align: right; width: 90px;">İşlem</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${filtered.map(d => {
              const dateObj = new Date(d.date);
              const dateStr = dateObj.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
              const dayStr = dateObj.toLocaleDateString('tr-TR', { weekday: 'long' });
              return `
                <tr>
                  <td>
                    <div class="dinner-date-badge">
                      <span>📅</span> <strong>${dateStr}</strong> <span style="opacity:0.75; font-size:11px;">(${dayStr})</span>
                    </div>
                  </td>
                  <td style="font-weight: 600; font-size: 15px; color: var(--text-primary);">
                    ${d.meal}
                  </td>
                  ${isAdmin ? `
                    <td style="text-align: right;">
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

window.openNewDinnerModal = function() {
  editingDinnerId = null;
  const title = document.querySelector('#dinner-modal .modal-title');
  if (title) title.textContent = "🍽️ Yemek Ekle";
  document.getElementById('add-dinner-form')?.reset();
  openModal('dinner-modal');
};

window.openEditDinnerModal = function(id) {
  const item = dinnersCache.find(d => String(d.id) === String(id));
  if (!item) return;
  editingDinnerId = item.id;
  const title = document.querySelector('#dinner-modal .modal-title');
  if (title) title.textContent = "🍽️ Yemek Düzenle";
  document.getElementById('dinner-date').value = item.date || '';
  document.getElementById('dinner-meal').value = item.meal || '';
  openModal('dinner-modal');
};

window.deleteDinner = async function(id) {
  if (!confirm("Bu yemeği silmek istediğinize emin misiniz?")) return;
  await window.supabaseClient.from('family_dinners').delete().eq('id', id);
  renderDinners();
};

/* ================= BOARD ================= */
async function renderBoard() {
  const container = document.getElementById('board-list');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); grid-column: 1 / -1;">Yükleniyor...</div>`;

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
             ${isAdmin ? `onclick="toggleBoardTodo('${item.id}', ${item.completed})"` : ''}>
          <div class="board-item-icon">
            ${item.completed ? '✅' : '🟩'}
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
            <div class="action-btns">
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
            <span>🟩 Yapılacaklar</span>
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
  await window.supabaseClient
    .from('family_board')
    .update({ completed: !currentStatus })
    .eq('id', id);
  renderBoard();
};

window.deleteBoardItem = async function(id, e) {
  if (e) e.stopPropagation();
  if (!confirm("Bu notu silmek istediğinize emin misiniz?")) return;
  await window.supabaseClient.from('family_board').delete().eq('id', id);
  renderBoard();
};

/* ================= TRAVELS ================= */
async function renderTravels() {
  const container = document.getElementById('travels-timeline');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Yükleniyor...</div>`;

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
  }

  if (editBtn) {
    editBtn.onclick = () => {
      closeModal('travel-detail-modal');
      openEditTravelModal(item.id);
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      closeModal('travel-detail-modal');
      deleteTravel(item.id);
    };
  }

  openModal('travel-detail-modal');
};

window.openNewTravelModal = function() {
  editingTravelId = null;
  const title = document.querySelector('#travel-modal .modal-title');
  if (title) title.textContent = "✈️ Gezi Ekle";
  document.getElementById('add-travel-form')?.reset();
  openModal('travel-modal');
};

window.openEditTravelModal = function(id, e) {
  if (e) e.stopPropagation();
  const item = travelsCache.find(t => String(t.id) === String(id));
  if (!item) return;
  editingTravelId = item.id;
  const title = document.querySelector('#travel-modal .modal-title');
  if (title) title.textContent = "✈️ Gezi Düzenle";
  document.getElementById('travel-year').value = item.year || '';
  document.getElementById('travel-month').value = item.month || '';
  document.getElementById('travel-place').value = item.place || '';
  document.getElementById('travel-location').value = item.location || '';
  document.getElementById('travel-companions').value = item.companions || '';
  document.getElementById('travel-details').value = item.details || '';
  openModal('travel-modal');
};

window.deleteTravel = async function(id, e) {
  if (e) e.stopPropagation();
  if (!confirm("Bu geziyi silmek istediğinize emin misiniz?")) return;
  await window.supabaseClient.from('family_travels').delete().eq('id', id);
  renderTravels();
};

/* ================= BIRTHDAYS ================= */
async function renderBirthdays() {
  const list = document.getElementById('birthdays-list');
  if (!list) return;
  list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">Yükleniyor...</div>`;

  try {
    const { data: birthdays, error } = await window.supabaseClient
      .from('family_birthdays')
      .select('*');

    if (error) throw error;
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

window.deleteBirthday = async function(id) {
  if (!confirm("Bu kişinin doğum gününü silmek istediğinize emin misiniz?")) return;
  await window.supabaseClient.from('family_birthdays').delete().eq('id', id);
  renderBirthdays();
};

/* ================= MODALS ================= */
function setupModals() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('open');
      }
    });
  });
  
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        overlay.classList.remove('open');
      }
    });
  });
}

window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.classList.add('open');
  }
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active');
    el.classList.remove('open');
  }
};
