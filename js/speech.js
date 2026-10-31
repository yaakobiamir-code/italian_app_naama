// דיבור והקשבה – מובנים בטלפון, חינמיים, עובדים גם בלי מפתח AI.
import { settings } from './store.js';

let voices = [];
function loadVoices() {
  voices = (window.speechSynthesis?.getVoices() || []).filter((v) => /^it([-_]|$)/i.test(v.lang));
}
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

export const italianVoices = () => { loadVoices(); return voices; };
export const ttsAvailable = () => 'speechSynthesis' in window;

function pickVoice() {
  const want = settings().voice;
  if (want) { const v = voices.find((x) => x.name === want); if (v) return v; }
  // עדיפות לקולות איכותיים נפוצים
  const pref = ['Google italiano', 'Alice', 'Federica', 'Luca', 'Paola', 'Elsa', 'Isabella', 'Diego'];
  for (const p of pref) { const v = voices.find((x) => x.name.includes(p)); if (v) return v; }
  return voices[0];
}

export function speak(text, { rate, onend } = {}) {
  if (!ttsAvailable() || !text) { onend?.(); return; }
  loadVoices();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[…]/g, ''));
  u.lang = 'it-IT';
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = rate ?? settings().rate ?? 0.95;
  if (onend) { u.onend = onend; u.onerror = onend; }
  speechSynthesis.speak(u);
}

export function stopSpeaking() { if (ttsAvailable()) speechSynthesis.cancel(); }

const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
export const sttAvailable = () => !!Rec;

// מאזין למשפט אחד באיטלקית ומחזיר את התמליל (או '' אם לא נשמע כלום)
export function listen({ onInterim } = {}) {
  return new Promise((resolve, reject) => {
    if (!Rec) return reject(new Error('nostt'));
    stopSpeaking();
    const r = new Rec();
    r.lang = 'it-IT';
    r.interimResults = !!onInterim;
    r.maxAlternatives = 3;
    r.continuous = false;
    let final = '';
    r.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      onInterim?.(final + interim);
    };
    r.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') resolve('');
      else reject(new Error(e.error));
    };
    r.onend = () => resolve(final.trim());
    try { r.start(); } catch (e) { reject(e); }
    listen.stop = () => { try { r.stop(); } catch { /* ignore */ } };
  });
}

// ---------- השוואת תשובות ----------
export function normalize(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’`]/g, "'")
    .replace(/[.,!?¿¡;:"«»()…–-]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

const stripAccentsKeep = (s) => (s || '').toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:"«»()…–-]/g, ' ').replace(/\s+/g, ' ').trim();

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// גרסאות מקובלות לתשובה: "bello / bella" → כל אחת; "Fa caldo / Fa freddo" → כל אחת; סוגריים אופציונליים
export function answerVariants(target) {
  const base = target.replace(/…/g, '').trim();
  const parts = base.split(/\s*\/\s*/);
  const out = new Set();
  const stem = parts[0];
  parts.forEach((p) => {
    out.add(p);
    // "contento / contenta": החלק השני לפעמים רק המילה האחרונה
    if (p.split(' ').length === 1 && stem.split(' ').length > 1) {
      const w = stem.split(' '); w[w.length - 1] = p; out.add(w.join(' '));
    }
  });
  for (let pass = 0; pass < 2; pass++) [...out].forEach((v) => {
    out.add(v.replace(/\(.*?\)/g, '').trim());
    out.add(v.replace(/[()]/g, ''));
    // מקבלים גם בלי יידוע
    out.add(v.replace(/^(il|lo|la|i|gli|le|l')\s*/i, ''));
  });
  return [...out].filter(Boolean);
}

// מחזיר 'exact' | 'accent' (רק טעות בניקוד/הטעמה) | 'typo' | 'wrong'
export function grade(input, target) {
  const vs = answerVariants(target);
  const a = stripAccentsKeep(input);
  if (vs.some((v) => stripAccentsKeep(v) === a)) return 'exact';
  const na = normalize(input);
  if (vs.some((v) => normalize(v) === na)) return 'accent';
  if (vs.some((v) => { const nv = normalize(v); return nv.length > 4 && levenshtein(nv, na) <= (nv.length > 10 ? 2 : 1); })) return 'typo';
  return 'wrong';
}

// השוואה מילה-מילה לתרגול חיקוי (shadowing): מסמן אילו מילים נקלטו
export function compareWords(target, heard) {
  const h = normalize(heard).split(' ');
  const words = target.split(/\s+/);
  let hit = 0;
  const marks = words.map((w) => {
    const nw = normalize(w);
    if (!nw) return { w, ok: true };
    const ok = h.some((x) => x === nw || (nw.length > 3 && levenshtein(x, nw) <= 1));
    if (ok) hit++;
    return { w, ok };
  });
  const total = marks.filter((m) => normalize(m.w)).length || 1;
  return { marks, score: Math.round((hit / total) * 100) };
}
