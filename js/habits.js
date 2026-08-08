// ===== HABITS.JS — Habit Data Management =====

const LOGS_KEY = "oyp_habit_logs";
const NOTES_KEY = "oyp_day_notes";
const HABITS_KEY = "oyp_habits";

const HabitStore = {
  _id(v) {
    return String(v);
  },

  getHabits() {
    try {
      return JSON.parse(localStorage.getItem(HABITS_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveHabits(habits) {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  /* ─── Habits CRUD ─── */

  async getAll() {
    return this.getHabits();
  },

  async add(habit) {
    const habits = this.getHabits();
    const record = {
      id: String(Date.now()),
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency || "daily",
      custom_days: habit.custom_days || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    habits.push(record);
    this.saveHabits(habits);
    return record;
  },

  async update(id, changes) {
    const habits = this.getHabits();
    const index = habits.findIndex((h) => this._id(h.id) === this._id(id));

    if (index === -1) return null;

    habits[index] = {
      ...habits[index],
      name: changes.name,
      icon: changes.icon,
      color: changes.color,
      frequency: changes.frequency,
      custom_days: changes.custom_days || null,
      updated_at: new Date().toISOString(),
    };

    this.saveHabits(habits);
    return habits[index];
  },

  async delete(id) {
    const habits = this.getHabits().filter(
      (h) => this._id(h.id) !== this._id(id),
    );

    this.saveHabits(habits);
    return true;
  },

  /* ─── Logs (completions) ─── */
  getLogs() {
    try {
      return JSON.parse(localStorage.getItem(LOGS_KEY)) || {};
    } catch {
      return {};
    }
  },

  saveLogs(logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  async isCompleted(habitId, dateKey) {
    const logs = this.getLogs();
    const dayLogs = logs[dateKey] || {};
    return Boolean(dayLogs[this._id(habitId)]);
  },

  async toggle(habitId, dateKey) {
    const logs = this.getLogs();
    const dayLogs = logs[dateKey] ? { ...logs[dateKey] } : {};
    const habitKey = this._id(habitId);
    const wasCompleted = Boolean(dayLogs[habitKey]);

    if (wasCompleted) {
      delete dayLogs[habitKey];
    } else {
      dayLogs[habitKey] = true;
    }

    if (Object.keys(dayLogs).length === 0) {
      delete logs[dateKey];
    } else {
      logs[dateKey] = dayLogs;
    }

    this.saveLogs(logs);
    return !wasCompleted;
  },

  async getCompletionsForDate(dateKey) {
    const logs = this.getLogs();
    const dayLogs = logs[dateKey] || {};
    const result = {};

    Object.keys(dayLogs).forEach((habitId) => {
      result[this._id(habitId)] = true;
    });

    return result;
  },

  async getCompletionsForDateRange(startDate, endDate) {
    const logs = this.getLogs();
    const result = {};

    Object.entries(logs).forEach(([dateKey, dayLogs]) => {
      if (dateKey < startDate || dateKey > endDate) return;

      const entries = {};
      Object.keys(dayLogs || {}).forEach((habitId) => {
        entries[this._id(habitId)] = true;
      });

      if (Object.keys(entries).length > 0) {
        result[dateKey] = entries;
      }
    });

    return result;
  },

  /* ─── Notes ─── */
  getNotes() {
    try {
      return JSON.parse(localStorage.getItem(NOTES_KEY)) || {};
    } catch {
      return {};
    }
  },

  getNote(dateKey) {
    return this.getNotes()[dateKey] || "";
  },

  saveNote(dateKey, text) {
    const notes = this.getNotes();
    if (text.trim()) notes[dateKey] = text;
    else delete notes[dateKey];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  /* ─── Statistics ─── */
  async getStreak(habitId) {
    habitId = this._id(habitId);

    const logs = this.getLogs();

    const habits = await this.getAll();

    const habit = habits.find((h) => this._id(h.id) === habitId);

    if (!habit) return 0;

    let streak = 0;

    const d = new Date();

    while (true) {
      const key = DateUtils.toKey(d);

      if (logs[key] && logs[key][habitId]) {
        streak++;

        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  getLongestStreak(habitId) {
    habitId = this._id(habitId);
    const logs = this.getLogs();
    const dates = Object.keys(logs)
      .filter((d) => logs[d] && logs[d][habitId])
      .sort();

    let max = 0,
      cur = 0,
      prev = null;
    dates.forEach((key) => {
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

  isDueOnDate(habit, date) {
    if (!habit) return false;
    const freq = String(habit.frequency || "daily").toLowerCase();

    if (freq === "daily" || freq === "günlük") {
      return true;
    }

    const d = typeof date === "string" ? DateUtils.fromKey(date) : new Date(date);
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    if (freq === "weekdays" || freq === "hafta içi" || freq === "haftaici") {
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    }

    if (freq === "weekend" || freq === "hafta sonu" || freq === "haftasonu") {
      return dayOfWeek === 0 || dayOfWeek === 6;
    }

    if (freq === "custom" && Array.isArray(habit.custom_days)) {
      return habit.custom_days.includes(dayOfWeek);
    }

    return true;
  },

  async getTodayStats(targetDate = DateUtils.today()) {
    const habits = await this.getAll();

    const targetKey = typeof targetDate === "string" ? targetDate : DateUtils.toKey(targetDate);

    const habitsDue = habits.filter((h) => this.isDueOnDate(h, targetKey));

    const comps = await this.getCompletionsForDate(targetKey);

    const done = habitsDue.filter((h) => comps[this._id(h.id)]).length;

    return {
      total: habitsDue.length,
      done,
      percent: habitsDue.length ? Math.round((done / habitsDue.length) * 100) : 0,
    };
  },

  async getStreak(habitId) {
    habitId = this._id(habitId);

    const logs = this.getLogs();

    const habits = await this.getAll();

    const habit = habits.find((h) => this._id(h.id) === habitId);

    if (!habit) return 0;

    let streak = 0;

    const d = new Date();
    const todayKey = DateUtils.toKey(d);

    // If today is not done yet, don't break yesterday's streak
    if (!(logs[todayKey] && logs[todayKey][habitId])) {
      d.setDate(d.getDate() - 1);
    }

    while (true) {
      const key = DateUtils.toKey(d);

      if (logs[key] && logs[key][habitId]) {
        streak++;

        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  getOverallStreak() {
    // Streak of days where at least 1 habit was completed
    const logs = this.getLogs();
    let streak = 0;
    const d = new Date();
    const todayKey = DateUtils.toKey(d);

    const hasDoneAny = (key) =>
      logs[key] && typeof logs[key] === "object" && Object.keys(logs[key]).length > 0;

    if (!hasDoneAny(todayKey)) {
      d.setDate(d.getDate() - 1);
    }

    while (true) {
      const key = DateUtils.toKey(d);
      if (hasDoneAny(key)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  },

  getTotalCompletions() {
    const logs = this.getLogs();
    return Object.values(logs).reduce((sum, day) => {
      if (!day || typeof day !== "object") return sum;
      return sum + Object.keys(day).length;
    }, 0);
  },

  async getHeatmapData(days = 90) {
    const logs = this.getLogs();

    const habits = await this.getAll();

    const result = [];

    const d = new Date();

    d.setDate(d.getDate() - days + 1);

    for (let i = 0; i < days; i++) {
      const key = DateUtils.toKey(d);

      const dayLogs = logs[key];

      const done =
        dayLogs && typeof dayLogs === "object"
          ? Object.keys(dayLogs).length
          : 0;

      const total = habits.length;

      let level = 0;

      if (done > 0) {
        const pct = total ? done / total : 0;

        level = pct <= 0.25 ? 1 : pct <= 0.5 ? 2 : pct <= 0.75 ? 3 : 4;
      }

      result.push({
        key,
        date: new Date(d),
        done,
        total,
        level,
      });

      d.setDate(d.getDate() + 1);
    }

    return result;
  },
};

window.HabitStore = HabitStore;
