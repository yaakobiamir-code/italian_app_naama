// שמירת כל ההתקדמות במכשיר (localStorage) – בלי שרת, בלי עלות.
import { UNITS } from './data.js';
import { newCard, isDue, isKnown, isSeen } from './srs.js';

const KEY = 'naama.v1';

const DEFAULTS = {
  cards: {},          // id -> כרטיס FSRS (מילים: <unit>.<i> / c.xxx ; תרגילים: d.<unit>.<i>)
  custom: [],         // מילים שנוספו מהשיחות/סיפורים/AI/ידנית
  unitWords: {},      // יחידות שהמילים שלהן נוצרו ע"י ה-AI: id -> [[it, he, ex, exHe], ...]
  unitDrills: {},     // תרגילים שנוצרו ע"י ה-AI: id -> [[k, q, a, o, he], ...]
  userUnits: [],      // נושאים שנעמה הוסיפה מהקורס בסוזי אקדמי
  courseUnits: [],    // יחידות קיימות באפליקציה שסומנו "נלמד בקורס" (האפליקציה הולכת בקצב של הקורס)
  diag: null,         // תוצאות מבחן האבחון: { at, scores: { unitId: [נכון, מתוך] } }
  week: null,         // התוכנית השבועית: { key, units: [ids] }
  examResults: [],    // { sec, score, max, at }
  ctxLines: [],
  stats: {},          // 'YYYY-MM-DD' -> { reviews, correct, newWords, drills, chat, stories, writing, exam, seconds }
  settings: {
    apiKey: '',
    model: 'claude-haiku-5-5',
    newPerDay: 8,       // מילים חדשות ביום
    drillsPerDay: 8,    // תרגילים חדשים ביום
    dailyGoal: 20,      // דקות ביום
    courseHours: 8,     // שעות שבועיות בקורס בסוזי אקדמי
    examDate: '2027-03-15',
    examName: 'CILS B2 / CELI 3',
    exams: ['ital2', 'cils', 'celi'], // המבחנים שהיא ניגשת אליהם
    lessonDays: [],     // ימי השיעור בקורס (0=ראשון … 6=שבת)
    retention: 0.9,
    rate: 0.95,
    voice: '',
    autoplay: true,
    speakAnswers: true,
    showTranslation: false,
    focusUnit: '',
    reminder: '20:00',
  },
  usage: { inTok: 0, outTok: 0, usd: 0 },
  started: 0,
  onboarded: false,
};

let itemCache = null;
let drillCache = null;
let state = load();
hydrateUnits();

// מכניסים ליחידות את מה שנוצר במכשיר: מילים ותרגילים מה-AI, והנושאים מהקורס
function hydrateUnits() {
  for (let i = UNITS.length - 1; i >= 0; i--) if (UNITS[i].stage === 'course') UNITS.splice(i, 1);
  state.userUnits.forEach((u) => UNITS.push({ ...u, stage: 'course', level: 'קורס', items: u.items || [], d: [] }));
  UNITS.forEach((u) => {
    if (u.gen) u.items = state.unitWords[u.id] || [];
    u.drills = [...(u.d || []), ...(state.unitDrills[u.id] || [])];
  });
  itemCache = null; drillCache = null;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...structuredClone(DEFAULTS), started: Date.now() };
    const s = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULTS), ...s,
      settings: { ...DEFAULTS.settings, ...(s.settings || {}) }, usage: { ...DEFAULTS.usage, ...(s.usage || {}) },
      unitWords: s.unitWords || {}, unitDrills: s.unitDrills || {}, userUnits: s.userUnits || [], courseUnits: s.courseUnits || [], ctxLines: s.ctxLines || [], examResults: s.examResults || [],
    };
  } catch {
    return { ...structuredClone(DEFAULTS), started: Date.now() };
  }
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn(e); }
}

export const S = () => state;
export const settings = () => state.settings;
export function setSetting(k, v) { state.settings[k] = v; save(); }
export const unitById = (id) => UNITS.find((u) => u.id === id);

// ---------- מילים ----------
export function allItems() {
  if (itemCache) return itemCache;
  const map = new Map();
  UNITS.forEach((u, ui) => (u.items || []).forEach((it, i) => {
    const id = `${u.id}.${i}`;
    map.set(id, { id, unit: u.id, unitIdx: ui, it: it[0], he: it[1], ex: it[2] || '', exHe: it[3] || '' });
  }));
  state.custom.forEach((c) => map.set(c.id, { ...c, unit: 'custom', unitIdx: 99 }));
  itemCache = map;
  return map;
}
export const item = (id) => allItems().get(id);

// ---------- תרגילים לפי נושא ----------
export function allDrills() {
  if (drillCache) return drillCache;
  const map = new Map();
  UNITS.forEach((u) => (u.drills || []).forEach((d, i) => {
    const id = `d.${u.id}.${i}`;
    map.set(id, { id, unit: u.id, k: d[0], q: d[1] || '', a: d[2], o: String(d[3] || '').split('|').map((x) => x.trim()).filter(Boolean), he: d[4] || '' });
  }));
  drillCache = map;
  return map;
}
export const drill = (id) => allDrills().get(id);
export const isDrill = (id) => id.startsWith('d.');
const exists = (id) => (isDrill(id) ? drill(id) : item(id));

export function addUnitWords(unitId, items) {
  const have = new Set([...allItems().values()].map((x) => x.it.toLowerCase()));
  const uu = state.userUnits.find((u) => u.id === unitId);
  const list = uu ? (uu.items || (uu.items = [])) : (state.unitWords[unitId] || (state.unitWords[unitId] = []));
  let n = 0;
  for (const x of items) {
    const it = (x.it || '').trim();
    if (!it || !x.he || have.has(it.toLowerCase())) continue;
    have.add(it.toLowerCase());
    list.push([it, x.he.trim(), x.ex || '', x.exHe || '']);
    n++;
  }
  hydrateUnits();
  save();
  return n;
}

export function addUnitDrills(unitId, drills) {
  const list = state.unitDrills[unitId] || (state.unitDrills[unitId] = []);
  const have = new Set(list.map((d) => d[1] + d[2]));
  let n = 0;
  for (const d of drills) {
    if (!d.a || !KIND_OK.has(d.k) || have.has((d.q || '') + d.a)) continue;
    if (['fill', 'conj', 'prep', 'art'].includes(d.k) && !(d.q || '').includes('___')) continue;
    list.push([d.k, d.q || '', d.a, (d.o || []).join('|'), d.he || '']);
    have.add((d.q || '') + d.a);
    n++;
  }
  hydrateUnits();
  save();
  return n;
}
const KIND_OK = new Set(['fill', 'conj', 'prep', 'art', 'spell', 'ear']);

// ---------- נושאים מהקורס (סוזי אקדמי) ----------
export function addUserUnit({ it, he, note = '' }) {
  const id = `s${Date.now().toString(36)}`;
  state.userUnits.unshift({ id, it: it.trim(), he: (he || it).trim(), note: note.trim(), items: [], created: Date.now(),
    grammar: note ? `<p>${note.replace(/[<>&]/g, '')}</p>` : '' });
  hydrateUnits(); save();
  return id;
}
export function removeUserUnit(id) {
  state.userUnits = state.userUnits.filter((u) => u.id !== id);
  Object.keys(state.cards).forEach((k) => { if (k.startsWith(id + '.') || k.startsWith(`d.${id}.`)) delete state.cards[k]; });
  delete state.unitDrills[id];
  hydrateUnits(); save();
}

// ---------- סנכרון עם הקורס: "את זה למדנו בשיעור" ----------
export function linkCourseUnit(id) {
  if (!state.courseUnits.includes(id)) state.courseUnits.unshift(id);
  state.week = null; save();
}
export function unlinkCourseUnit(id) { state.courseUnits = state.courseUnits.filter((x) => x !== id); state.week = null; save(); }
// מחפשים יחידה קיימת שמתאימה לשם הנושא מהשיעור (כדי לא ליצור כפילות)
const MATCH_STOP = new Set(['lessico', 'verbi', 'verbo', 'parole', 'ripasso', 'esercizi', 'italiano', 'lezione', 'grammatica', 'della', 'delle', 'degli', 'nella', 'uso', 'regole']);
export function matchUnit(name) {
  const n = (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const words = n.split(/[^a-z\u0590-\u05ff]+/).filter((w) => w.length >= 5 && !MATCH_STOP.has(w));
  if (!words.length) return null;
  const score = (u) => {
    const t = `${u.it} ${u.he}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return words.filter((w) => t.includes(w)).length;
  };
  const best = UNITS.filter((u) => u.stage !== 'course').map((u) => [u, score(u)]).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : null;
}

// כמה מילים חדשות זמינות עדיין (בלי ליצור עוד)
export function pendingNewCount() { return nextNewItems(100000).length; }

// יחידה מתקדמת שעוד אין לה מילים/תרגילים – לפי סדר הלמידה
export function nextUnitToGenerate(kind = 'words') {
  for (const u of orderedUnits()) {
    if (kind === 'words' && u.gen && !(state.unitWords[u.id] || []).length) return u;
    if (kind === 'drills' && (u.gen || u.stage === 'course') && !(u.drills || []).length) return u;
  }
  return null;
}

// ---------- כרטיסים ----------
export const card = (id) => state.cards[id];
export function putCard(c) { state.cards[c.id] = c; save(); }
export function deleteCard(id) { delete state.cards[id]; save(); }

export function dueCards(now = Date.now()) {
  return Object.values(state.cards).filter((c) => isDue(c, now) && exists(c.id)).sort((a, b) => a.due - b.due);
}

// ---------- סדר הלמידה ----------
// 1) נושאים מהקורס (הכי עדכני) 2) נושאי השבוע 3) שלב החיזוק – מהחלש לחזק לפי האבחון 4) נושאים חדשים לפי הסדר
export function orderedUnits() {
  const score = (u) => {
    const d = state.diag?.scores?.[u.id];
    return d ? d[0] / d[1] : 0.5;
  };
  const course = UNITS.filter((u) => u.stage === 'course');
  const review = UNITS.map((u, i) => [u, i]).filter(([u]) => u.stage === 'review')
    .sort((a, b) => (score(a[0]) - score(b[0])) || (a[1] - b[1])).map(([u]) => u);
  const fresh = UNITS.filter((u) => u.stage === 'new');
  const week = (state.week?.units || []).map(unitById).filter(Boolean);
  const focus = state.settings.focusUnit ? [unitById(state.settings.focusUnit)].filter(Boolean) : [];
  // נושאים שכבר נלמדו בקורס קודמים לכל השאר – חזרה מרווחת על מה שנלמד בשיעור (successive relearning)
  const linked = state.courseUnits.map(unitById).filter(Boolean);
  return [...new Set([...focus, ...course, ...linked, ...week, ...review, ...fresh])];
}

// מילים חדשות: קודם מה שנעמה פגשה בעצמה (תיקונים, מילים מהשיחה/סיפור), אחר כך לפי סדר הלמידה
export function nextNewItems(n) {
  const out = [];
  const rank = (id) => ({ mistake: 0, tap: 1, chat: 1, story: 1, manual: 1 }[state.cards[id]?.src || item(id)?.src] ?? 2);
  const pendingCustom = Object.values(state.cards).filter((c) => c.state === 'new' && !isDrill(c.id) && item(c.id))
    .sort((a, b) => (rank(a.id) - rank(b.id)) || (a.added - b.added));
  for (const c of pendingCustom) { if (out.length >= n) break; out.push(c.id); }
  for (const u of orderedUnits()) {
    for (let i = 0; i < (u.items || []).length && out.length < n; i++) {
      const id = `${u.id}.${i}`;
      if (!state.cards[id]) out.push(id);
    }
    if (out.length >= n) break;
  }
  return out;
}

// תרגילים חדשים: קודם תרגילים שנכשלו באבחון, אחר כך לפי סדר הלמידה – לא יותר מ-3 מאותו נושא ברצף, כדי לערבב
export function nextNewDrills(n) {
  const out = [];
  const flagged = Object.values(state.cards).filter((c) => c.state === 'new' && isDrill(c.id) && drill(c.id)).sort((a, b) => a.added - b.added);
  for (const c of flagged) { if (out.length >= n) break; out.push(c.id); }
  const units = orderedUnits().filter((u) => (u.drills || []).length);
  for (let round = 0; round < 20 && out.length < n; round++) {
    let added = 0;
    for (const u of units.slice(0, 3 + round)) {
      let k = 0;
      for (let i = 0; i < u.drills.length && k < 3 && out.length < n; i++) {
        const id = `d.${u.id}.${i}`;
        if (!state.cards[id] && !out.includes(id)) { out.push(id); k++; added++; }
      }
    }
    if (!added && round > 3) break;
  }
  return out;
}

export const newIntroducedToday = () => today().newWords || 0;
export const newDrillsToday = () => today().newDrills || 0;

export function unitProgress(u) {
  let seen = 0, known = 0;
  (u.items || []).forEach((_, i) => {
    const c = state.cards[`${u.id}.${i}`];
    if (isSeen(c)) seen++;
    if (isKnown(c)) known++;
  });
  return { seen, known, total: (u.items || []).length };
}

// שליטה בנושא (0–100): כל כרטיס (מילה או תרגיל) תורם לפי היציבות שלו בזיכרון
const cardValue = (c) => (!isSeen(c) ? 0 : c.state !== 'review' ? 0.25 : 0.5 + 0.5 * Math.min(1, c.s / 30));
export function mastery(u) {
  const ids = [...(u.items || []).map((_, i) => `${u.id}.${i}`), ...(u.drills || []).map((_, i) => `d.${u.id}.${i}`)];
  if (!ids.length) return { pct: 0, seen: 0, total: 0, drillsSeen: 0, drillsTotal: 0, acc: null };
  let v = 0, seen = 0, dSeen = 0, reps = 0, lapses = 0;
  ids.forEach((id) => {
    const c = state.cards[id];
    v += cardValue(c);
    if (isSeen(c)) { seen++; if (isDrill(id)) { dSeen++; reps += c.reps; lapses += c.lapses; } }
  });
  return { pct: Math.round((v / ids.length) * 100), seen, total: ids.length, drillsSeen: dSeen, drillsTotal: (u.drills || []).length, acc: reps ? Math.round(((reps - lapses) / reps) * 100) : null };
}

// התקדמות לפי רמה: A2 = שלב החיזוק + A2 החדש; B1; B2
export const LEVELS = ['A2', 'B1', 'B2'];
export function levelProgress(level) {
  const us = UNITS.filter((u) => u.stage !== 'course' && (level === 'A2' ? ['A1', 'A2'].includes(u.level) : u.level === level));
  if (!us.length) return 0;
  return Math.round(us.reduce((a, u) => a + mastery(u).pct, 0) / us.length);
}

// "היחידה הנוכחית" = הראשונה בסדר הלמידה שעדיין לא נשלטת
export function currentUnit() {
  return orderedUnits().find((u) => u.stage !== 'course' && mastery(u).pct < 70) || UNITS[UNITS.length - 1];
}
// עד איזו יחידה הגענו בסדר הקבוע של הקורס (לרמת השיחה והסיפורים)
export function reachedIndex() {
  let r = 0;
  UNITS.forEach((u, i) => { if (u.stage !== 'course' && mastery(u).seen > 0) r = i; });
  return r;
}
export const unitStarted = (id) => { const u = unitById(id); return !id || (u && mastery(u).seen > 0); };

export function vocabSummary() {
  const cards = Object.values(state.cards).filter((c) => !isDrill(c.id));
  return { seen: cards.filter(isSeen).length, known: cards.filter(isKnown).length };
}
export function drillSummary() {
  const cards = Object.values(state.cards).filter((c) => isDrill(c.id));
  return { seen: cards.filter(isSeen).length, known: cards.filter(isKnown).length };
}

export function learnedWordList(max = 300) {
  return Object.values(state.cards).filter((c) => isSeen(c) && !isDrill(c.id))
    .sort((a, b) => b.s - a.s).slice(0, max)
    .map((c) => item(c.id)?.it).filter(Boolean);
}

export function weakItems(max = 8) {
  return Object.values(state.cards).filter((c) => isSeen(c) && !isDrill(c.id) && item(c.id))
    .sort((a, b) => (b.lapses - a.lapses) || (a.s - b.s)).slice(0, max).map((c) => item(c.id));
}

// נושאים חלשים: לפי טעויות בתרגילים, ואם עוד אין – לפי האבחון
export function weakTopics(max = 4) {
  const rows = UNITS.map((u) => {
    const m = mastery(u);
    const d = state.diag?.scores?.[u.id];
    const err = m.acc != null && m.drillsSeen >= 3 ? 100 - m.acc : d ? Math.round((1 - d[0] / d[1]) * 100) : -1;
    return { u, err };
  }).filter((x) => x.err > 20).sort((a, b) => b.err - a.err);
  return rows.slice(0, max).map((x) => x.u);
}

// ---------- מבחן אבחון ----------
export function setDiag(scores) { state.diag = { at: Date.now(), scores }; state.week = null; save(); }

// ---------- תוכנית שבועית וספירה לאחור ----------
const DAY = 86400000;
export function examDate() { const d = new Date(state.settings.examDate + 'T09:00:00'); return isNaN(d) ? new Date('2027-03-15T09:00:00') : d; }
export const daysToExam = () => Math.max(0, Math.ceil((examDate() - Date.now()) / DAY));
export function weekKey(t = Date.now()) {
  const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - d.getDay()); // שבוע מתחיל ביום ראשון
  return dayKey(d);
}
// בכל שבוע: כמה נושאים צריך לסגור כדי לסיים את כל התוכנית שבועיים לפני המבחן (השבועיים האחרונים – חזרה ומבחני דמה)
export function weekPlan() {
  const key = weekKey();
  if (state.week?.key === key) return state.week;
  const weeksLeft = Math.max(1, Math.floor(daysToExam() / 7) - 2);
  const remaining = orderedUnits().filter((u) => u.stage !== 'course' && mastery(u).pct < 70);
  const per = Math.max(2, Math.min(4, Math.ceil(remaining.length / weeksLeft)));
  // מכניסים לסדר בלי נושאי השבוע הקודם, כדי לא "להיתקע"
  const prev = new Set(state.week?.units || []);
  const pickFrom = [...remaining.filter((u) => !prev.has(u.id) || mastery(u).pct < 40)];
  state.week = { key, units: pickFrom.slice(0, per).map((u) => u.id), weeksLeft, remaining: remaining.length, per, final: daysToExam() <= 14 };
  save();
  return state.week;
}

// שעות לימוד משוערות עד המבחן: הקורס + האפליקציה
export function hoursForecast() {
  const days = daysToExam();
  const course = (state.settings.courseHours || 0) * (days / 7);
  const app = ((state.settings.dailyGoal || 20) / 60) * days;
  return { course: Math.round(course), app: Math.round(app), total: Math.round(course + app), done: Math.round(studiedHours()) };
}

// ---------- מבחן (CILS / CELI) ----------
export function addExamResult(sec, score, max) {
  state.examResults.push({ sec, score, max, at: Date.now() });
  state.examResults = state.examResults.slice(-200);
  bump('exam');
  save();
}
export function examAvg(sec, last = 5) {
  const r = state.examResults.filter((x) => x.sec === sec).slice(-last);
  if (!r.length) return null;
  return Math.round((r.reduce((a, x) => a + x.score / x.max, 0) / r.length) * 100);
}

// ---------- מילים מותאמות ----------
export function addCustom({ it, he, ex = '', exHe = '', src = 'ai', raw = false, form = '', wrong = '', note = '' }) {
  it = (it || '').trim(); he = (he || '').trim();
  if (!it || !he) return null;
  const ex0 = [...allItems().values()].find((x) => x.it.toLowerCase() === it.toLowerCase());
  if (ex0) {
    if (!state.cards[ex0.id]) { state.cards[ex0.id] = { ...newCard(ex0.id), src }; save(); }
    return ex0.id;
  }
  const id = `c.${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  state.custom.push({ id, it, he, ex, exHe, src, raw, form, wrong, note, created: Date.now() });
  state.cards[id] = newCard(id);
  itemCache = null;
  save();
  return id;
}

export const pendingRaw = () => state.custom.filter((c) => c.raw);

export function updateCustom(id, fields) {
  const c = state.custom.find((x) => x.id === id);
  if (!c) return;
  const it = (fields.it || c.it).trim();
  const dup = [...allItems().values()].find((x) => x.id !== id && x.it.toLowerCase() === it.toLowerCase());
  if (dup) {
    const cd = state.cards[id];
    removeCustom(id);
    if (!state.cards[dup.id] && cd) state.cards[dup.id] = { ...cd, id: dup.id };
    save();
    return;
  }
  Object.assign(c, fields, { it, raw: false });
  itemCache = null;
  save();
}

export function removeCustom(id) {
  state.custom = state.custom.filter((c) => c.id !== id);
  delete state.cards[id];
  itemCache = null;
  save();
}

// ---------- משפטים מההקשר של הלומדת ----------
export function addContext(lines) {
  const have = new Set(state.ctxLines.map((l) => l.it));
  const fresh = lines.filter((l) => l.it && l.he && l.it.length <= 220 && !have.has(l.it)).map((l) => ({ ...l, t: Date.now() }));
  if (!fresh.length) return;
  state.ctxLines = [...fresh.reverse(), ...state.ctxLines].slice(0, 600);
  save();
}
export const ctxLines = () => state.ctxLines;

// ---------- סטטיסטיקה ----------
export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function today() {
  const k = dayKey();
  if (!state.stats[k]) state.stats[k] = { reviews: 0, correct: 0, newWords: 0, newDrills: 0, chat: 0, stories: 0, writing: 0, exam: 0, seconds: 0 };
  return state.stats[k];
}

export function bump(field, n = 1) { today()[field] = (today()[field] || 0) + n; save(); }

export function activeDay(s) {
  return s && (s.reviews >= 10 || s.chat >= 4 || s.stories >= 1 || s.writing >= 1 || s.exam >= 1);
}

export function streak() {
  let n = 0;
  const d = new Date();
  if (!activeDay(state.stats[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (activeDay(state.stats[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// כמה ימים פעילים השבוע
export function weekActivity() {
  const start = new Date(weekKey() + 'T00:00:00');
  let days = 0, chat = 0, exam = 0, writing = 0, stories = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const s = state.stats[dayKey(d)];
    if (!s) continue;
    if (activeDay(s)) days++;
    chat += s.chat >= 4 ? 1 : 0; exam += s.exam || 0; writing += s.writing || 0; stories += s.stories || 0;
  }
  return { days, chat, exam, writing, stories };
}

export function addUsage(inTok, outTok, usd) {
  state.usage.inTok += inTok; state.usage.outTok += outTok; state.usage.usd += usd; save();
}

export const studiedHours = () => Object.values(state.stats).reduce((a, x) => a + (x.seconds || 0), 0) / 3600;

// ---------- גיבוי ----------
export function exportJSON() {
  return JSON.stringify({ ...state, settings: { ...state.settings, apiKey: '' } }, null, 1);
}
export function importJSON(text) {
  const s = JSON.parse(text);
  if (!s || typeof s !== 'object' || !s.cards) throw new Error('bad file');
  const keepKey = state.settings.apiKey;
  state = { ...structuredClone(DEFAULTS), ...s, settings: { ...DEFAULTS.settings, ...(s.settings || {}) }, unitWords: s.unitWords || {}, unitDrills: s.unitDrills || {}, userUnits: s.userUnits || [], courseUnits: s.courseUnits || [], examResults: s.examResults || [] };
  if (!state.settings.apiKey) state.settings.apiKey = keepKey;
  hydrateUnits();
  save();
}
export function resetAll() { localStorage.removeItem(KEY); state = { ...structuredClone(DEFAULTS), started: Date.now() }; hydrateUnits(); }
