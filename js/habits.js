// ===== HABITS.JS — Habit Data Management =====

const HABITS_KEY = 'oyp_habits';
const LOGS_KEY   = 'oyp_habit_logs';
const NOTES_KEY  = 'oyp_day_notes';

const HabitStore = {
  _id(v) { return String(v); },

  /* ─── Habits CRUD ─── */
  getAll() {
    try {
      const raw = JSON.parse(localStorage.getItem(HABITS_KEY)) || [];
      if (!Array.isArray(raw)) return [];
      let changed = false;
      const habits = raw
        .filter(h => h && typeof h === 'object')
        .map((h, i) => {
          const id = (h.id != null && h.id !== '') ? this._id(h.id) : this._id(`${Date.now()}${i}`);
          if (h.id !== id) changed = true;
          return { ...h, id };
        });
      if (changed) this.save(habits);
      return habits;
    } catch { return []; }
  },

  save(habits) {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  add(habit) {
    const habits = this.getAll();
    habit.id = Date.now().toString();
    habit.createdAt = DateUtils.today();
    habits.push(habit);
    this.save(habits);
    return habit;
  },

  update(id, changes) {
    id = this._id(id);
    const habits = this.getAll().map(h => this._id(h.id) === id ? { ...h, ...changes } : h);
    this.save(habits);
  },

  delete(id) {
    id = this._id(id);
    const habits = this.getAll().filter(h => this._id(h.id) !== id);
    this.save(habits);
    const logs = this.getLogs();
    Object.keys(logs).forEach(date => {
      if (!logs[date] || typeof logs[date] !== 'object') return;
      delete logs[date][id];
      if (Object.keys(logs[date]).length === 0) delete logs[date];
    });
    this.saveLogs(logs);
  },

  /* ─── Logs (completions) ─── */
  getLogs() {
    try { return JSON.parse(localStorage.getItem(LOGS_KEY)) || {}; }
    catch { return {}; }
  },

  saveLogs(logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  isCompleted(habitId, dateKey) {
    habitId = this._id(habitId);
    const logs = this.getLogs();
    return !!(logs[dateKey] && logs[dateKey][habitId]);
  },

  toggle(habitId, dateKey) {
    habitId = this._id(habitId);
    const logs = this.getLogs();
    if (!logs[dateKey]) logs[dateKey] = {};
    logs[dateKey][habitId] = !logs[dateKey][habitId];
    if (!logs[dateKey][habitId]) delete logs[dateKey][habitId];
    if (Object.keys(logs[dateKey]).length === 0) delete logs[dateKey];
    this.saveLogs(logs);
    return this.isCompleted(habitId, dateKey);
  },

  getCompletionsForDate(dateKey) {
    const logs = this.getLogs();
    return logs[dateKey] || {};
  },

  /* ─── Notes ─── */
  getNotes() {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; }
    catch { return {}; }
  },

  getNote(dateKey) {
    return this.getNotes()[dateKey] || '';
  },

  saveNote(dateKey, text) {
    const notes = this.getNotes();
    if (text.trim()) notes[dateKey] = text;
    else delete notes[dateKey];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  /* ─── Statistics ─── */
  getStreak(habitId) {
    habitId = this._id(habitId);
    const logs = this.getLogs();
    const habit = this.getAll().find(h => this._id(h.id) === habitId);
    if (!habit) return 0;

    let streak = 0;
    const d = new Date();
    while (true) {
      const key = DateUtils.toKey(d);
      if (logs[key] && logs[key][habitId]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  },

  getLongestStreak(habitId) {
    habitId = this._id(habitId);
    const logs = this.getLogs();
    const dates = Object.keys(logs)
      .filter(d => logs[d] && logs[d][habitId])
      .sort();

    let max = 0, cur = 0, prev = null;
    dates.forEach(key => {
      const d = DateUtils.fromKey(key);
      if (prev) {
        const diff = (d - prev) / 86400000;
        cur = diff === 1 ? cur + 1 : 1;
      } else cur = 1;
      if (cur > max) max = cur;
      prev = d;
    });
    return max;
  },

  getCompletionRate(habitId, days = 30) {
    habitId = this._id(habitId);
    const logs = this.getLogs();
    let done = 0;
    const d = new Date();
    for (let i = 0; i < days; i++) {
      const key = DateUtils.toKey(d);
      if (logs[key] && logs[key][habitId]) done++;
      d.setDate(d.getDate() - 1);
    }
    return Math.round((done / days) * 100);
  },

  getTodayStats() {
    const habits = this.getAll();
    const today = DateUtils.today();
    const comps = this.getCompletionsForDate(today);
    const done = habits.filter(h => comps[this._id(h.id)]).length;
    return { total: habits.length, done, percent: habits.length ? Math.round((done/habits.length)*100) : 0 };
  },

  getOverallStreak() {
    // Streak of days where at least 1 habit was completed
    const logs = this.getLogs();
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = DateUtils.toKey(d);
      if (logs[key] && typeof logs[key] === 'object' && Object.keys(logs[key]).length > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  },

  getTotalCompletions() {
    const logs = this.getLogs();
    return Object.values(logs).reduce((sum, day) => {
      if (!day || typeof day !== 'object') return sum;
      return sum + Object.keys(day).length;
    }, 0);
  },

  getHeatmapData(days = 90) {
    const logs = this.getLogs();
    const habits = this.getAll();
    const result = [];
    const d = new Date();
    d.setDate(d.getDate() - days + 1);
    for (let i = 0; i < days; i++) {
      const key = DateUtils.toKey(d);
      const dayLogs = logs[key];
      const done = (dayLogs && typeof dayLogs === 'object') ? Object.keys(dayLogs).length : 0;
      const total = habits.length;
      let level = 0;
      if (done > 0) {
        const pct = total ? done / total : 0;
        level = pct <= 0.25 ? 1 : pct <= 0.5 ? 2 : pct <= 0.75 ? 3 : 4;
      }
      result.push({ key, date: new Date(d), done, total, level });
      d.setDate(d.getDate() + 1);
    }
    return result;
  }
};

window.HabitStore = HabitStore;
