function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const isUuid = (id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const LOGS_KEY = "oyp_habit_logs";
const NOTES_KEY = "oyp_day_notes";
const HABITS_KEY = "oyp_habits";

function dedupeHabits(habits) {
  if (!Array.isArray(habits)) return [];
  const map = new Map();
  for (const h of habits) {
    if (!h || !h.name) continue;
    const key = (h.name || "").trim().toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, h);
    } else {
      if (!isUuid(existing.id) && isUuid(h.id)) {
        map.set(key, h);
      }
    }
  }
  return Array.from(map.values());
}

let _getAllPromise = null;
let _hasSyncedInitialData = false;
const _toggleLocks = new Map();

const HabitStore = {
  _id(v) {
    return String(v);
  },

  getHabits() {
    try {
      return dedupeHabits(JSON.parse(localStorage.getItem(HABITS_KEY)) || []);
    } catch {
      return [];
    }
  },

  saveHabits(habits) {
    localStorage.setItem(HABITS_KEY, JSON.stringify(dedupeHabits(habits)));
  },

  async _migrateLogs(oldId, newId, userId) {
    if (!oldId || !newId || String(oldId) === String(newId)) return;
    const logs = this.getLogs();
    let logsChanged = false;
    Object.keys(logs).forEach((dateKey) => {
      if (logs[dateKey] && logs[dateKey][oldId]) {
        delete logs[dateKey][oldId];
        logs[dateKey][newId] = true;
        logsChanged = true;
      }
    });
    if (logsChanged) this.saveLogs(logs);

    if (userId && window.supabaseClient) {
      try {
        await window.supabaseClient
          .from("habit_logs")
          .update({ habit_id: newId })
          .eq("user_id", userId)
          .eq("habit_id", oldId);
      } catch (e) {
        console.warn("Supabase migrate habit_logs error:", e);
      }
    }
  },

  /* ─── Habits CRUD ─── */

  async getAll(forceRefresh = false) {
    if (_getAllPromise) return _getAllPromise;

    if (_hasSyncedInitialData && !forceRefresh) {
      return this.getHabits();
    }

    _getAllPromise = (async () => {
      try {
        const user = window.Auth ? await window.Auth.getUser() : null;

        if (user && window.supabaseClient) {
          const [habitsRes, logsRes, notesRes] = await Promise.all([
            window.supabaseClient
              .from("habits")
              .select("*")
              .order("created_at", { ascending: true }),
            window.supabaseClient
              .from("habit_logs")
              .select("*")
              .eq("user_id", user.id),
            window.supabaseClient
              .from("day_notes")
              .select("*")
              .eq("user_id", user.id)
          ]);

          if (!habitsRes.error && habitsRes.data) {
            let sbHabits = dedupeHabits(habitsRes.data);

            const local = this.getHabits();
            const unpushed = local.filter((h) => !isUuid(h.id));
            if (unpushed.length > 0) {
              for (const item of unpushed) {
                const existing = sbHabits.find((sb) => sb.name && sb.name.trim().toLowerCase() === (item.name || "").trim().toLowerCase());
                if (existing) {
                  await this._migrateLogs(item.id, existing.id, user.id);
                  continue;
                }

                const newId = generateUUID();
                const dbPayload = {
                  id: newId,
                  name: item.name,
                  icon: item.icon || "⭐",
                  color: item.color || "#6c63ff",
                  frequency: item.frequency || "daily",
                  user_id: user.id
                };
                const { data: insData, error: insErr } = await window.supabaseClient
                  .from("habits")
                  .insert([dbPayload])
                  .select();
                if (!insErr && insData && insData.length > 0) {
                  sbHabits.push(insData[0]);
                  await this._migrateLogs(item.id, newId, user.id);
                }
              }
              sbHabits = dedupeHabits(sbHabits);
            }
            this.saveHabits(sbHabits);
          }

          if (!logsRes.error && logsRes.data) {
            const freshLogsMap = {};
            const validHabitIds = new Set(this.getHabits().map((h) => String(h.id)));
            logsRes.data.forEach((row) => {
              const d = row.completed_date;
              const hid = String(row.habit_id);
              if (d && hid && validHabitIds.has(hid)) {
                if (!freshLogsMap[d]) freshLogsMap[d] = {};
                freshLogsMap[d][hid] = true;
              }
            });
            this.saveLogs(freshLogsMap);
          }

          if (!notesRes.error && notesRes.data) {
            const freshNotesMap = {};
            notesRes.data.forEach((row) => {
              const d = row.note_date;
              const content = row.content;
              if (d && content && content.trim()) {
                freshNotesMap[d] = content.trim();
              }
            });
            localStorage.setItem(NOTES_KEY, JSON.stringify(freshNotesMap));
          }

          _hasSyncedInitialData = true;
        }

        return this.getHabits();
      } catch (e) {
        console.warn("Supabase fetch all data error:", e);
        return this.getHabits();
      } finally {
        _getAllPromise = null;
      }
    })();

    return _getAllPromise;
  },

  async syncLogsFromSupabase() {
    try {
      const user = window.Auth ? await window.Auth.getUser() : null;
      if (!user || !window.supabaseClient) return;

      const { data, error } = await window.supabaseClient
        .from("habit_logs")
        .select("*");

      if (!error && data) {
        const logsMap = this.getLogs();
        data.forEach((row) => {
          const d = row.completed_date;
          const hid = String(row.habit_id);
          if (d && hid) {
            if (!logsMap[d]) logsMap[d] = {};
            logsMap[d][hid] = true;
          }
        });
        this.saveLogs(logsMap);
      }
    } catch (e) {
      console.warn("Supabase fetch habit_logs error:", e);
    }
  },

  async add(habit) {
    const user = window.Auth ? await window.Auth.getUser() : null;
    const newId = generateUUID();
    const record = {
      id: newId,
      name: habit.name,
      icon: habit.icon || "⭐",
      color: habit.color || "#6c63ff",
      frequency: habit.frequency || "daily",
      custom_days: habit.custom_days || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (user && window.supabaseClient) {
      try {
        const dbPayload = {
          id: newId,
          name: record.name,
          icon: record.icon,
          color: record.color,
          frequency: record.frequency,
          user_id: user.id,
        };
        const { data, error } = await window.supabaseClient
          .from("habits")
          .insert([dbPayload])
          .select();
        if (error) {
          console.error("Supabase habit insert error:", error);
          if (window.Toast) window.Toast.error("Supabase ekleme hatası: " + error.message);
        } else if (data && data.length > 0) {
          record.id = data[0].id;
        }
      } catch (err) {
        console.warn("Supabase habit save error:", err);
      }
    } else {
      if (window.Toast) window.Toast.warn("Supabase oturumu açık olmadığı için kayıt yerel hafızaya alındı.");
    }

    const habits = this.getHabits();
    habits.push(record);
    this.saveHabits(habits);
    return record;
  },

  async update(id, changes) {
    const habits = this.getHabits();
    const index = habits.findIndex((h) => this._id(h.id) === this._id(id));

    if (index === -1) return null;

    const user = window.Auth ? await window.Auth.getUser() : null;
    if (user && window.supabaseClient) {
      try {
        const dbPayload = {
          name: changes.name,
          icon: changes.icon,
          color: changes.color,
          frequency: changes.frequency,
        };
        const { error } = await window.supabaseClient
          .from("habits")
          .update(dbPayload)
          .eq("id", id);
        if (error) console.error("Supabase habit update error:", error);
      } catch (err) {
        console.warn("Supabase habit update error:", err);
      }
    }

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
    const habits = this.getHabits();
    const target = habits.find((h) => this._id(h.id) === this._id(id));
    const targetName = target ? (target.name || "").trim().toLowerCase() : null;

    const user = window.Auth ? await window.Auth.getUser() : null;
    if (user && window.supabaseClient) {
      try {
        if (targetName) {
          const { data: dupes } = await window.supabaseClient
            .from("habits")
            .select("id")
            .ilike("name", targetName);
          const idsToDelete = (dupes || []).map((d) => d.id);
          if (!idsToDelete.includes(id)) idsToDelete.push(id);

          for (const dId of idsToDelete) {
            await window.supabaseClient.from("habit_logs").delete().eq("habit_id", dId);
            await window.supabaseClient.from("habits").delete().eq("id", dId);
          }
        } else {
          await window.supabaseClient.from("habit_logs").delete().eq("habit_id", id);
          await window.supabaseClient.from("habits").delete().eq("id", id);
        }
      } catch (err) {
        console.warn("Supabase habit delete error:", err);
      }
    }

    const remaining = habits.filter((h) => {
      if (this._id(h.id) === this._id(id)) return false;
      if (targetName && (h.name || "").trim().toLowerCase() === targetName) return false;
      return true;
    });

    this.saveHabits(remaining);
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
    const lockKey = `${this._id(habitId)}_${dateKey}`;
    const previousLock = _toggleLocks.get(lockKey) || Promise.resolve();

    const currentOp = (async () => {
      try {
        await previousLock;
      } catch (e) {}
      return this._performToggle(habitId, dateKey);
    })();

    _toggleLocks.set(lockKey, currentOp.catch(() => {}));
    return currentOp;
  },

  async _performToggle(habitId, dateKey) {
    const logs = this.getLogs();
    const dayLogs = logs[dateKey] ? { ...logs[dateKey] } : {};
    const habitKey = this._id(habitId);
    const wasCompleted = Boolean(dayLogs[habitKey]);

    const user = window.Auth ? await window.Auth.getUser() : null;

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

    if (user && window.supabaseClient) {
      try {
        if (wasCompleted) {
          const { error } = await window.supabaseClient
            .from("habit_logs")
            .delete()
            .eq("user_id", user.id)
            .eq("habit_id", habitId)
            .eq("completed_date", dateKey);
          if (error) console.warn("Supabase habit log delete error:", error);
        } else {
          const { error } = await window.supabaseClient
            .from("habit_logs")
            .insert([{ habit_id: habitId, completed_date: dateKey, user_id: user.id }]);

          if (error) {
            const isConflict =
              error.code === "23505" ||
              error.status === 409 ||
              String(error.message || "").includes("duplicate") ||
              String(error.details || "").includes("already exists");
            if (!isConflict) {
              console.error("Supabase habit log insert error:", error);
            }
          }
        }
      } catch (e) {
        console.warn("Supabase habit log toggle error:", e);
      }
    }

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

  async syncNotesFromSupabase() {
    try {
      const user = window.Auth ? await window.Auth.getUser() : null;
      if (!user || !window.supabaseClient) return;

      const { data, error } = await window.supabaseClient
        .from("day_notes")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        const notesMap = this.getNotes();
        data.forEach((row) => {
          const d = row.note_date;
          const content = row.content;
          if (d) {
            if (content && content.trim()) {
              notesMap[d] = content.trim();
            } else {
              delete notesMap[d];
            }
          }
        });
        localStorage.setItem(NOTES_KEY, JSON.stringify(notesMap));
      }
    } catch (e) {
      console.warn("Supabase fetch day_notes error:", e);
    }
  },

  async fetchNoteFromSupabase(dateKey) {
    try {
      const user = window.Auth ? await window.Auth.getUser() : null;
      if (!user || !window.supabaseClient) return this.getNote(dateKey);

      const { data, error } = await window.supabaseClient
        .from("day_notes")
        .select("content")
        .eq("user_id", user.id)
        .eq("note_date", dateKey)
        .maybeSingle();

      if (!error && data) {
        const content = data.content ? data.content.trim() : "";
        const notes = this.getNotes();
        if (content) notes[dateKey] = content;
        else delete notes[dateKey];
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        return content;
      }
    } catch (e) {
      console.warn("Supabase fetch single day_note error:", e);
    }
    return this.getNote(dateKey);
  },

  async saveNote(dateKey, text) {
    const trimmed = text ? text.trim() : "";
    const notes = this.getNotes();
    if (trimmed) notes[dateKey] = trimmed;
    else delete notes[dateKey];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

    const user = window.Auth ? await window.Auth.getUser() : null;
    if (user && window.supabaseClient) {
      try {
        if (trimmed) {
          const { data: existing, error: selErr } = await window.supabaseClient
            .from("day_notes")
            .select("id")
            .eq("user_id", user.id)
            .eq("note_date", dateKey)
            .maybeSingle();

          if (!selErr && existing) {
            const { error: updErr } = await window.supabaseClient
              .from("day_notes")
              .update({ content: trimmed, updated_at: new Date().toISOString() })
              .eq("id", existing.id);
            if (updErr) {
              console.error("Supabase note update error:", updErr);
              if (window.Toast) window.Toast.error("Supabase not güncelleme hatası: " + updErr.message);
            }
          } else {
            const { error: insErr } = await window.supabaseClient
              .from("day_notes")
              .insert([{ user_id: user.id, note_date: dateKey, content: trimmed }]);
            if (insErr) {
              console.error("Supabase note insert error:", insErr);
              if (window.Toast) window.Toast.error("Supabase not ekleme hatası: " + insErr.message);
            }
          }
        } else {
          const { error: delErr } = await window.supabaseClient
            .from("day_notes")
            .delete()
            .eq("user_id", user.id)
            .eq("note_date", dateKey);
          if (delErr) {
            console.error("Supabase note delete error:", delErr);
          }
        }
      } catch (err) {
        console.warn("Supabase note save error:", err);
      }
    }
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
