/**
 * send_telegram_digest.js
 * GitHub Actions Cron veya bağımsız Node.js tetikleyicisi
 * Her sabah Türkiye saatiyle 09:45'te otomatik çalışır.
 */

const https = require('https');

// Çevre değişkenleri veya varsayılanlar
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8813042961:AAHCge0iT4w9gtHR4y-iJx3zjgVlH0XMKYE';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lsvveqxaqfujyjxqexrv.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_8h73DIh4kCaRt33zyn1fYw_icYoHBP9';

// Helper: HTTP GET request
function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

// Helper: Telegram sendMessage POST request
function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve(json);
        } catch (e) {
          resolve({ ok: false, error: responseData });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const now = new Date();
  // Türkiye saati dönüşümü (UTC+3)
  const trNow = new Date(now.getTime() + (3 * 60 * 60 * 1000));
  const todayStr = trNow.toISOString().split('T')[0];

  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  const formattedDate = `${trNow.getDate()} ${monthNames[trNow.getMonth()]} ${trNow.getFullYear()}, ${dayNames[trNow.getDay()]}`;

  // 1. Supabase'den Etkinlikleri Çek
  let events = [];
  try {
    const eventsData = await fetchJson(`${SUPABASE_URL}/rest/v1/personal_events?select=*`, {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    });
    if (Array.isArray(eventsData)) events = eventsData;
  } catch (e) {
    console.error('Events fetch error:', e);
  }

  // 2. Supabase'den Doğum Günlerini Çek
  let birthdays = [];
  try {
    const bdaysData = await fetchJson(`${SUPABASE_URL}/rest/v1/birthdays?select=*`, {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    });
    if (Array.isArray(bdaysData)) birthdays = bdaysData;
  } catch (e) {
    console.error('Birthdays fetch error:', e);
  }

  // 3. Fenerbahçe Fikstürü Kontrolü
  const fixtures = [
    { date: "18 Ağustos 2026", time: "22:00", comp: "UEFA Şampiyonlar Ligi Play-Off", home: "Fenerbahçe", away: "Lyon", venue: "Ülker Stadyumu Kadıköy" },
    { date: "22 Ağustos 2026", time: "21:30", comp: "Trendyol Süper Lig 2. Hafta", home: "Fenerbahçe", away: "Konyaspor", venue: "Ülker Stadyumu Kadıköy" },
    { date: "26 Ağustos 2026", time: "22:00", comp: "UEFA Şampiyonlar Ligi Play-Off Rövanş", home: "Lyon", away: "Fenerbahçe", venue: "Groupama Stadium (Deplasman)" },
    { date: "30 Ağustos 2026", time: "21:30", comp: "Trendyol Süper Lig 3. Hafta", home: "Samsunspor", away: "Fenerbahçe", venue: "Samsun 19 Mayıs (Deplasman)" }
  ];
  const todayMatchDayStr = `${trNow.getDate()} ${monthNames[trNow.getMonth()]}`;
  const todayMatch = fixtures.find(f => f.date.includes(todayMatchDayStr));

  // Filtreler
  const todayEvents = events.filter(e => !e.is_completed && e.event_date === todayStr);
  const upcomingThisWeek = events.filter(e => {
    if (e.is_completed || e.event_date === todayStr) return false;
    const d = new Date(e.event_date + 'T00:00:00');
    const diff = Math.ceil((d - trNow) / (1000 * 60 * 60 * 24));
    return diff > 0 && diff <= 7;
  });

  // Doğum Günü Hesabı
  const upcomingBirthdays = birthdays.map(b => {
    if (!b.birth_date) return null;
    const parts = b.birth_date.split('-');
    const birthYear = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);

    let nextBday = new Date(trNow.getFullYear(), birthMonth, birthDay);
    if (nextBday < trNow) nextBday.setFullYear(trNow.getFullYear() + 1);

    const diffTime = nextBday - trNow;
    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const nextAge = nextBday.getFullYear() - birthYear;
    const formattedBday = `${birthDay} ${monthNames[birthMonth]}`;

    return { ...b, daysLeft, nextAge, formattedBday };
  }).filter(Boolean).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3);

  // Mesaj Gövdesi
  let msg = `👋 <b>Günaydın Ömür Can!</b>\n`;
  msg += `📅 <b>Günlük Raporun — ${formattedDate} (09:45)</b>\n\n`;

  if (todayMatch) {
    msg += `⚽🔥 <b>BUGÜN FENERBAHÇE MAÇI VAR!</b>\n`;
    msg += `🏆 <b>Karşılaşma:</b> ${todayMatch.home} vs ${todayMatch.away}\n`;
    msg += `⏰ <b>Saat:</b> ${todayMatch.time}\n`;
    msg += `🏟️ <b>Stad:</b> ${todayMatch.venue}\n`;
    msg += `📌 <b>Turnuva:</b> ${todayMatch.comp}\n\n`;
  }

  msg += `📍 <b>Bugünkü Planların:</b>\n`;
  if (todayEvents.length > 0) {
    todayEvents.forEach(e => {
      msg += `• <b>${e.title}</b> (${e.category || 'Etkinlik'})\n`;
      if (e.event_time) msg += `  ⏰ Saat: ${e.event_time}\n`;
      if (e.location) msg += `  📍 Yer: ${e.location}\n`;
      if (e.notes) msg += `  💡 Not: ${e.notes}\n`;
    });
  } else {
    msg += `<i>Bugün için planlanmış özel bir etkinliğin yok.</i>\n`;
  }
  msg += `\n`;

  if (upcomingThisWeek.length > 0) {
    msg += `🗓️ <b>Bu Haftaki Diğer Planların:</b>\n`;
    upcomingThisWeek.forEach(e => {
      const d = new Date(e.event_date + 'T00:00:00');
      const dName = dayNames[d.getDay()];
      msg += `• <b>${e.title}</b> — ${d.getDate()} ${monthNames[d.getMonth()]} (${dName})\n`;
      if (e.location) msg += `  📍 ${e.location} | ⏰ ${e.event_time || ''}\n`;
    });
    msg += `\n`;
  }

  if (upcomingBirthdays.length > 0) {
    msg += `🎂 <b>Yaklaşan Doğum Günleri:</b>\n`;
    upcomingBirthdays.forEach(b => {
      const status = b.daysLeft === 0 ? '🔥 BUGÜN!' : (b.daysLeft === 1 ? '⚡ Yarın' : `${b.daysLeft} gün kaldı`);
      msg += `• <b>${b.name}</b> (${b.formattedBday}) — <b>${status}</b> (${b.nextAge}. yaş)\n`;
      if (b.gift_ideas) msg += `  🎁 Hediye: ${b.gift_ideas}\n`;
    });
    msg += `\n`;
  }

  msg += `✨ <i>Harika ve verimli bir gün dilerim!</i>`;

  console.log('Sending message to Telegram...');
  const result = await sendTelegramMessage(msg);
  console.log('Result:', result);
}

run().catch(console.error);
