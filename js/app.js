import { UNITS, SCENARIOS, STORY_TOPICS, KINDS, DIAG_PER_UNIT } from './data.js';
import * as store from './store.js';
import { review, newCard, isKnown, isSeen } from './srs.js';
import * as ai from './ai.js';
import { speak, stopSpeaking, listen, sttAvailable, ttsAvailable, grade, compareWords, normalize, answerVariants, italianVoices } from './speech.js';

const $ = (s, el = document) => el.querySelector(s);
const view = () => $('#view');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const set = () => store.settings();

// ================= עזרים כלליים =================
function toast(msg, ms = 2400) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms);
}

function sheet(html) {
  const s = $('#sheet');
  s.innerHTML = `<div class="sheet-card" role="dialog">${html}</div>`;
  s.classList.add('open');
  s.onclick = (e) => { if (e.target === s || e.target.closest('[data-close]')) closeSheet(); };
  return s;
}
function closeSheet() { $('#sheet').classList.remove('open'); $('#sheet').innerHTML = ''; }

const spk = (t, slow) => `<button class="icon-btn" data-say="${esc(t)}" ${slow ? 'data-slow="1"' : ''} aria-label="השמע">${slow ? '🐢' : '🔊'}</button>`;

// טקסט איטלקי שאפשר ללחוץ על כל מילה בו
function tappable(text, ctx = '') {
  return esc(text).replace(/([A-Za-zÀ-ÿ']+)/g, (m) => `<span class="w" data-w="${m}" data-ctx="${esc(ctx || text)}">${m}</span>`);
}

function noKeyCard(what) {
  return `<div class="card warn">
    <h3>🔑 צריך מפתח AI</h3>
    <p>${what} משתמש במורה ה-AI. ההגדרה לוקחת 5 דקות ועולה סנטים בחודש.</p>
    <a class="btn" href="#settings">להגדרת המפתח</a>
  </div>`;
}

function errBox(e) {
  return `<div class="card warn"><p>⚠️ ${esc(e.message || e)}</p>${e.code === 'nokey' || e.code === 'auth' ? '<a class="btn" href="#settings">להגדרות</a>' : ''}</div>`;
}

const spinner = (t = 'המורה חושבת…') => `<div class="loading"><div class="dots"><i></i><i></i><i></i></div><p>${t}</p></div>`;

// ================= ניווט =================
const routes = {};
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', render);

function render() {
  stopSpeaking();
  closeSheet();
  view().onclick = null;
  const [name, arg] = (location.hash.slice(1) || 'today').split('/');
  const r = routes[name] || routes.today;
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (r.tab || name)));
  document.body.dataset.route = name;
  view().scrollTop = 0; window.scrollTo(0, 0);
  if (!store.S().onboarded && name !== 'settings' && name !== 'help') return renderOnboarding();
  r.render(arg);
}

// ================= אירועים גלובליים =================
document.addEventListener('click', async (e) => {
  const say = e.target.closest('[data-say]');
  if (say) { e.preventDefault(); speak(say.dataset.say, { rate: say.dataset.slow ? 0.65 : undefined }); return; }
  const w = e.target.closest('.w');
  if (w) { e.preventDefault(); wordSheet(w.dataset.w, w.dataset.ctx); return; }
  const acc = e.target.closest('[data-acc]');
  if (acc) {
    e.preventDefault();
    const inp = document.querySelector('.accent-target');
    if (inp) {
      const s = inp.selectionStart ?? inp.value.length;
      inp.value = inp.value.slice(0, s) + acc.dataset.acc + inp.value.slice(inp.selectionEnd ?? s);
      inp.focus(); inp.setSelectionRange(s + 1, s + 1);
    }
  }
});

const accentBar = () => `<div class="accents">${['à', 'è', 'é', 'ì', 'ò', 'ù', "'"].map((a) => `<button type="button" data-acc="${a}" tabindex="-1">${a}</button>`).join('')}</div>`;

// גיליון תרגום מילה
let storyGloss = null;
async function wordSheet(word, ctx) {
  const lw = word.toLowerCase();
  let info = null;
  if (storyGloss) {
    const g = storyGloss.find((x) => normalize(x.w) === normalize(lw));
    if (g) info = { he: g.he, base: g.base, note_he: '' };
  }
  if (!info) {
    for (const it of store.allItems().values()) {
      if (answerVariants(it.it).some((v) => normalize(v) === normalize(lw))) { info = { he: it.he, base: it.it, note_he: '', known: it.id }; break; }
    }
  }
  const draw = (body) => sheet(`
    <div class="sheet-head"><span class="it big">${esc(word)}</span>${spk(word)}<button class="icon-btn" data-close>✕</button></div>
    ${body}`);
  if (info) return draw(wordBody(info, autoAdd(info, word, ctx)));
  if (!ai.hasKey()) return draw(`<p class="muted">אין תרגום שמור למילה הזו. עם מפתח AI אפשר לתרגם כל מילה.</p>`);
  draw(spinner('מתרגם…'));
  try {
    const r = await ai.glossWord(word, ctx);
    if ($('#sheet').classList.contains('open')) draw(wordBody(r, autoAdd(r, word, ctx)));
  } catch (err) { draw(errBox(err)); }
}

// מילה שבדקתם = מילה שלא ידעתם. היא נכנסת לתרגול אוטומטית, עם המשפט שבו פגשתם אותה
function autoAdd(info, word, ctx) {
  if (info.known && store.card(info.known)) return { already: true };
  if (info.known) { store.addCustom({ it: info.base, he: info.he, src: 'tap' }); return { id: info.known }; }
  const before = new Set(Object.keys(store.S().cards));
  const id = store.addCustom({ it: info.base || word, he: info.he, ex: ctx || '', exHe: ctxHe(ctx), src: 'tap', raw: !!ctx, form: word, note: info.note_he || '' });
  if (!id) return {};
  return before.has(id) ? { already: true } : { id };
}
const ctxHe = (sent) => store.ctxLines().find((l) => l.it === sent)?.he || '';

function wordBody(info, add = {}) {
  const base = info.base || '';
  return `<p class="he big">${esc(info.he)}</p>
    ${base ? `<p>צורת מילון: <span class="it">${esc(base)}</span> ${spk(base)}</p>` : ''}
    ${info.note_he ? `<p class="muted">${esc(info.note_he)}</p>` : ''}
    ${add.already ? '<p class="ok">✓ כבר בכרטיסיות שלך</p>' : add.id ?
      `<p class="ok">✓ נוסף לתרגול – יופיע עם המשפט הזה <button class="chip" data-undo="${esc(add.id)}">בטל</button></p>` : ''}`;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-undo]');
  if (!b) return;
  const id = b.dataset.undo;
  if (id.startsWith('c.')) store.removeCustom(id); else store.deleteCard(id);
  b.parentElement.outerHTML = '<p class="muted">לא נוסף.</p>';
});

// ================= המשכיות: הכרטיסיות משתמשות במה שקראתם ואמרתם =================
const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function findIn(sentence, variants) {
  for (const v of variants) {
    const m = sentence.match(new RegExp(`(^|[^A-Za-zÀ-ÿ])(${reEsc(v)})(?=$|[^A-Za-zÀ-ÿ])`, 'i'));
    if (m) return { form: m[2], index: m.index + m[1].length };
  }
  return null;
}
const itemVariants = (it, min = 2) => [...new Set([it.form, ...answerVariants(it.it)].filter((v) => v && v.replace(/[^A-Za-zÀ-ÿ]/g, '').length >= min))]
  .sort((a, b) => b.length - a.length);

// המשפט הכי חדש מהסיפורים/השיחות של הלומד שמכיל את המילה
function contextFor(it) {
  if (!it) return null;
  const vs = itemVariants(it, 3);
  if (!vs.length) return null;
  for (const l of store.ctxLines()) {
    if (l.it === it.ex) continue;
    const f = findIn(l.it, vs);
    if (f) return { sent: l.it, he: l.he, src: l.src, ...f };
  }
  return null;
}
const SRC_LABEL = { story: '📖 מסיפור שקראת', tap: '📖 מסיפור שקראת', chat: '💬 מהשיחה שלך', mistake: '✏️ המשפט שלך, מתוקן' };

// משפט לתרגיל השלמה: לרוב משפט שהלומד פגש בעצמו, ולפעמים משפט הדוגמה
function clozeSource(it) {
  const ctx = contextFor(it);
  const own = it.ex ? findIn(it.ex, itemVariants(it)) : null;
  if (ctx && (!own || Math.random() < 0.7)) return { sent: ctx.sent, he: ctx.he, form: ctx.form, index: ctx.index, label: SRC_LABEL[ctx.src] || '' };
  if (own) return { sent: it.ex, he: it.exHe, form: own.form, index: own.index, label: SRC_LABEL[it.src] || '' };
  return null;
}

// הופכים את מה שנאסף (מילים שנבדקו, תיקונים) לכרטיסים נקיים בעזרת המורה
let enriching = null;
function enrichPending() {
  if (enriching) return enriching;
  const raw = store.pendingRaw().slice(0, 25);
  if (!raw.length || !ai.hasKey()) return Promise.resolve();
  enriching = ai.enrichItems(raw.map((c) => ({ id: c.id, src: c.src, it: c.it, he: c.he, context: c.ex, wrong: c.wrong || undefined, rule: c.note || undefined })))
    .then((items) => {
      const byId = new Map(items.map((x) => [x.id, x]));
      for (const c of raw) {
        const x = byId.get(c.id);
        // מה שלא חזר – נשאר כמו שהוא (לא מנסים שוב, כדי לא לבזבז)
        store.updateCustom(c.id, x ? { it: x.it, he: x.he, form: x.form, ex: x.ex, exHe: x.exHe, note: x.note_he } : {});
      }
    })
    .catch((e) => console.warn('enrich', e))
    .finally(() => { enriching = null; });
  return enriching;
}
const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

// ================= קבלת פנים + מבחן אבחון =================
function renderOnboarding() {
  view().innerHTML = `
  <section class="onb">
    <div class="hero-flag">🇮🇹</div>
    <h1><span lang="it" dir="ltr">Ciao Naama!</span> 👋</h1>
    <p class="lead">האפליקציה הזאת נבנתה בשבילך: לחזק את מה שלמדת בקורס, ולהוביל אותך שלב אחרי שלב ל-B2 עד המבחן במרץ.</p>
    <ul class="why">
      <li><b>🧠 חזרה מרווחת</b> – מילים ותרגילים חוזרים בדיוק כשאת עומדת לשכוח. מה שטעית בו – חוזר מהר יותר.</li>
      <li><b>✏️ תרגילים לפי נושא</b> – כל נושא מהקורס: השלמה, הטיות, מילות יחס, איות והבנת הנשמע.</li>
      <li><b>🗣️ שיחות עם מורה AI</b> – בתרחישים יומיומיים, עם תיקונים קצרים בעברית.</li>
      <li><b>🎓 תרגול בפורמט המבחן</b> – CILS B2 / CELI 3: האזנה, קריאה, מבנים, כתיבה ודיבור.</li>
      <li><b>📅 15–20 דקות ביום</b> – משלים את הקורס בסוזי אקדמי, לא מחליף אותו.</li>
    </ul>
    <div class="card soft"><p><b>הצעד הראשון: מבחן אבחון קצר</b> (כ-8 דקות, ${diagQuestions().length} שאלית על כל הנושאים שלמדת). הוא לא ציון – הוא מראה לאפליקציה מה כבר חזק ומה צריך חיזוק, וממנו נבנית התוכנית.</p>
    <p class="small muted">💡 אם את לא יודעת – לחצי "לא יודעת" במקום לנחש. כך האבחון מדויק יותר.</p></div>
    <button class="btn big" id="start">למבחן האבחון ←</button>
    <button class="btn ghost" id="skip">דלגי בינתיים</button>
  </section>`;
  $('#start').onclick = () => { store.S().onboarded = true; store.save(); go('#diag'); };
  $('#skip').onclick = () => { store.S().onboarded = true; store.save(); go('#today'); };
}

const diagQuestions = () => UNITS.filter((u) => u.stage === 'review')
  .flatMap((u) => (u.drills || []).slice(0, DIAG_PER_UNIT).map((_, i) => `d.${u.id}.${i}`));

let diag = null;
routes.diag = {
  tab: 'today',
  render() {
    if (!diag) diag = { ids: shuffleByUnit(diagQuestions()), i: 0, res: {} };
    if (diag.i >= diag.ids.length) return diagResults();
    const d = store.drill(diag.ids[diag.i]);
    const v = drillView(d, 'mc');
    const p = Math.round((diag.i / diag.ids.length) * 100);
    view().innerHTML = `<div class="pbar"><a href="#today" class="x" aria-label="יציאה">✕</a><div class="track"><i style="width:${p}%"></i></div><span class="small">${diag.i + 1}/${diag.ids.length}</span></div>
      <div class="flash"><div class="badge">🔎 מבחן אבחון</div>${v.body}</div>${v.answer}
      <div class="actions"><button class="btn ghost" id="idk">לא יודעת</button></div>`;
    if (v.autoSay) speak(v.autoSay);
    const next = (ok) => { diag.res[d.id] = ok; diag.i++; setTimeout(() => routes.diag.render(), ok ? 350 : 900); };
    view().querySelectorAll('[data-opt]').forEach((b) => {
      b.onclick = () => {
        const ok = b.dataset.opt === v.correct;
        view().querySelectorAll('[data-opt]').forEach((x) => { x.disabled = true; if (x.dataset.opt === v.correct) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        next(ok);
      };
    });
    $('#idk').onclick = () => next(false);
  },
};
// מערבבים את סדר השאלית, אבל לא שתי שאלית מאותו נושא ברצף
function shuffleByUnit(ids) {
  const out = []; let pool = shuffle(ids);
  while (pool.length) {
    const last = out.length ? store.drill(out[out.length - 1]).unit : '';
    const k = pool.findIndex((id) => store.drill(id).unit !== last);
    out.push(pool.splice(k < 0 ? 0 : k, 1)[0]);
  }
  return out;
}

function diagResults() {
  const scores = {};
  Object.entries(diag.res).forEach(([id, ok]) => {
    const u = store.drill(id).unit;
    scores[u] = scores[u] || [0, 0];
    scores[u][1]++; if (ok) scores[u][0]++;
    // תשובה נכונה = שליפה מוצלחת (נכנס לחזרה מרווחת). טעות = התרגיל יופיע ראשון בתרגול
    const c = store.card(id);
    if (!c || c.state === 'new') store.putCard(ok ? review(newCard(id), 3, Date.now(), set().retention) : { ...newCard(id), src: 'diag' });
  });
  store.setDiag(scores);
  const rows = UNITS.filter((u) => scores[u.id]);
  const total = rows.reduce((a, u) => a + scores[u.id][0], 0), max = rows.reduce((a, u) => a + scores[u.id][1], 0);
  const strong = rows.filter((u) => scores[u.id][0] === scores[u.id][1]);
  const weak = rows.filter((u) => scores[u.id][0] === 0);
  diag = null;
  view().innerHTML = `<header class="top"><h1>🔎 תוצאות האבחון</h1></header>
  <div class="card center"><div class="huge">${total}/${max}</div><p class="muted">${total / max >= 0.8 ? 'בסיס חזק! נתמקד בדיוק ונתקדם מהר לנושאים החדשים.' : total / max >= 0.5 ? 'יש בסיס טוב, ויש כמה נושאים שצריך לחזק. בדיוק בשביל זה זה כאן.' : 'נבנה את הבסיס מחדש, צעד צעד – זה הדבר הכי משתלם לקראת B2.'}</p></div>
  ${weak.length ? `<div class="card"><h3>🎯 לחזק קודם</h3>${weak.map((u) => `<a class="row-link" href="#unit/${u.id}">${esc(u.he)}</a>`).join('')}</div>` : ''}
  <div class="card"><h3>כל הנושאים</h3>${rows.map((u) => { const [a, b] = scores[u.id]; return `<div class="row-between"><span>${esc(u.he)}</span><span class="dots-score">${'●'.repeat(a)}${'○'.repeat(b - a)}</span></div>`; }).join('')}</div>
  ${strong.length ? `<p class="small muted">✓ חזק: ${strong.map((u) => esc(u.he)).join(' · ')}. גם עליהם נחזור, אבל בקצב מהיר יותר.</p>` : ''}
  <p class="small">התרגול היומי יתחיל מהנושאים החלשים ומהשאלית שטעית בהן. אפשר לעשות את האבחון שוב מתי שתרצי (התקדמות ← אבחון חוזר).</p>
  <div class="actions"><a class="btn big" href="#today">לתוכנית שלי ←</a></div>`;
}

// ================= היום =================
const TIPS = [
  'עדיף 15 דקות כל יום מאשר שעה וחצי פעם בשבוע – הזיכרון מתחזק בהפסקות שבין החזרות.',
  'כשאת לא בטוחה – נחשי! עצם הניסיון לשלוף מהזיכרון מחזק אותו, גם כשטועים.',
  'אמרי כל מילה ומשפט בקול. דיבור + שמיעה יוצרים זיכרון חזק יותר מקריאה בלבד.',
  'טעויות בשיחה הן לא כישלון – הן בדיוק הרגע שבו המוח לומד.',
  'למדת משהו חדש בשיעור בסוזי? הוסיפי אותו לאפליקציה באותו יום – כך הוא נכנס לחזרות לפני שנשכח.',
  'למדי שמות עצם עם ה-il/la שלהם – כך זוכרים את המין בלי מאמץ.',
  'במבחן CILS עוברים כל חלק בנפרד (כ-11 מתוך 20). לכן מתרגלים את כל חמשת החלקים, לא רק את מה שקל.',
  'בכתיבה: כתבי קודם, תקני אחר כך. רוב הנקודות מגיעות מביצוע המשימה ומבהירות, לא רק מדקדוק מושלם.',
  'שבוע קשה? גם 5 דקות של תרגול שומרות על הרצף ועל הזיכרון.',
  'נסי "לחקות" (shadowing): להשמיע משפט ולחזור עליו מיד באותה מנגינה. זה משפר מבטא ושטף.',
];

// פעילות היום (בנוסף לתרגול): מתחלפת לפי יום בשבוע, כך שכל המיומנויות של המבחן מתורגלות כל שבוע
function activityOfDay() {
  const wd = new Date().getDay();
  const odd = Math.floor(Date.now() / (7 * 86400000)) % 2;
  if (store.daysToExam() <= 14) return { href: `#ex/${['ascolto', 'lettura', 'strutture', 'scrittura', 'orale'][wd % 5]}`, icon: '🎓', label: 'מבחן דמה – חלק אחד ביום', done: store.today().exam > 0 };
  const plan = [
    { href: `#chat/${scenarioOfDay().id}`, icon: '🗣️', label: `שיחה: ${scenarioOfDay().he}`, key: 'chat' },
    { href: '#ex/ascolto', icon: '🎧', label: 'מבחן: הבנת הנשמע', key: 'exam' },
    { href: `#chat/${scenarioOfDay().id}`, icon: '🗣️', label: `שיחה: ${scenarioOfDay().he}`, key: 'chat' },
    { href: odd ? '#ex/lettura' : '#ex/strutture', icon: odd ? '📖' : '🧩', label: odd ? 'מבחן: הבנת הנקרא' : 'מבחן: מבנים לשוניים', key: 'exam' },
    { href: '#stories', icon: '🎧', label: 'סיפור: האזנה וקריאה', key: 'stories' },
    { href: odd ? '#ex/orale' : '#ex/scrittura', icon: odd ? '🎤' : '✍️', label: odd ? 'מבחן: הבעה בעל-פה' : 'מבחן: הבעה בכתב', key: 'exam' },
    { href: `#chat/${scenarioOfDay().id}`, icon: '🗣️', label: 'שיחה קלילה (או יום מנוחה)', key: 'chat' },
  ][wd];
  const t = store.today();
  return { ...plan, done: plan.key === 'chat' ? t.chat >= 6 : (t[plan.key] || 0) > 0 };
}
function scenarioOfDay() {
  const open = SCENARIOS.filter((s) => store.unitStarted(s.after) || !s.after);
  return open[new Date().getDate() % open.length] || SCENARIOS[0];
}

routes.today = {
  render() {
    const t = store.today();
    const due = store.dueCards().length;
    const newW = store.nextNewItems(Math.max(0, set().newPerDay - store.newIntroducedToday())).length;
    const newD = store.nextNewDrills(Math.max(0, set().drillsPerDay - store.newDrillsToday())).length;
    if (store.pendingRaw().length >= 5) enrichPending();
    const st = store.streak();
    const mins = Math.round((t.seconds || 0) / 60);
    const goal = set().dailyGoal || 20;
    const pct = Math.min(100, Math.round((mins / goal) * 100));
    const wk = store.weekPlan();
    const act = activityOfDay();
    const practiced = due === 0 && t.reviews > 0;
    autoGenerate();
    view().innerHTML = `
    <header class="top">
      <div>
        <div class="muted small">${new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1 lang="it" dir="ltr" style="text-align:right">${new Date().getHours() < 12 ? 'Buongiorno' : new Date().getHours() < 18 ? 'Ciao' : 'Buonasera'}, Naama!</h1>
      </div>
      <div class="ring" style="--p:${pct}"><span>${mins}<small>/${goal} דק'</small></span></div>
    </header>
    ${countdownCard()}
    ${!store.S().diag ? `<a class="card warn" href="#diag"><b>🔎 עוד לא עשית מבחן אבחון</b><p class="small">8 דקות, ומהן נבנית התוכנית לפי מה שחזק ומה שחלש.</p></a>` : ''}
    <a class="card hero" href="#practice">
      <div>
        <h2>🧠 תרגול יומי</h2>
        <p>${due ? `<b>${due}</b> לחזרה` : 'אין חזרות ממתינות'}${newW ? ` · <b>${newW}</b> מילים` : ''}${newD ? ` · <b>${newD}</b> תרגילים` : ''}</p>
        <p class="muted small">נושאי השבוע: ${wk.units.map((id) => esc(store.unitById(id)?.he || '')).join(' · ')}</p>
      </div>
      <span class="go">${due + newW + newD ? 'התחילי ←' : 'תרגול נוסף ←'}</span>
    </a>
    <h3 class="sec">התוכנית להיום <small class="muted">(${goal} דק')</small></h3>
    <div class="tasks">
      <a class="task ${practiced ? 'done' : ''}" href="#practice"><span>🧠</span><b>תרגול: חזרות + חדשים (כ-10 דק')</b><i>${practiced ? '✓' : '›'}</i></a>
      <a class="task ${act.done ? 'done' : ''}" href="${act.href}"><span>${act.icon}</span><b>${esc(act.label)} (כ-${goal - 10} דק')</b><i>${act.done ? '✓' : '›'}</i></a>
      <a class="task" href="#suzy"><span>📒</span><b>היה היום שיעור בסוזי? הוסיפי נושא/מילים</b><i>›</i></a>
    </div>
    ${weekCard(wk)}
    <div class="grid2">
      <a class="card mini" href="#chat"><span class="emoji">🗣️</span><b>שיחה</b><small>עם תיקונים בעברית</small></a>
      <a class="card mini" href="#exam"><span class="emoji">🎓</span><b>הכנה למבחן</b><small>CILS / CELI</small></a>
      <a class="card mini" href="#unit/${wk.units[0] || store.currentUnit().id}"><span class="emoji">📖</span><b>${esc(store.unitById(wk.units[0])?.he || store.currentUnit().he)}</b><small>הסבר קצר + תרגול</small></a>
      <a class="card mini" href="#stories"><span class="emoji">🎧</span><b>סיפור</b><small>קריאה והאזנה</small></a>
    </div>
    <div class="stats-row">
      <div class="stat"><b>🔥 ${st}</b><span>ימי רצף</span></div>
      <div class="stat"><b>${store.vocabSummary().seen}</b><span>מילים</span></div>
      <div class="stat"><b>${store.drillSummary().seen}</b><span>תרגילים</span></div>
    </div>
    <div class="card tip"><b>💡 טיפ</b><p>${TIPS[new Date().getDate() % TIPS.length]}</p></div>
    ${installHint()}
    ${!ai.hasKey() ? `<div class="card soft"><p>🔑 התרגול היומי עובד גם בלי AI. כדי לפתוח שיחות, סיפורים ותרגול למבחן – <a href="#settings">הגדירי מפתח</a>.</p></div>` : ''}
    `;
  },
};

function countdownCard() {
  const d = store.daysToExam();
  const h = store.hoursForecast();
  return `<a class="card countdown" href="#more">
    <div class="row-between"><div><b class="big">⏳ ${d} ימים</b> <span class="small muted">עד ${esc(set().examName)} · ${store.examDate().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div><span class="lvl">רמה: <b>${ai.levelInfo().code}</b></span></div>
    <div class="lv-bars">${store.LEVELS.map((l) => `<div><small>${l}</small><div class="track"><i style="width:${store.levelProgress(l)}%"></i></div></div>`).join('')}</div>
    <p class="small muted">עד המבחן: כ-${h.course} שעות בקורס + ${h.app} באפליקציה ≈ <b>${h.total}</b> שעות. ${h.total + h.done >= 250 ? 'זה טווח שמאפשר B2 מבסיס A2 – בתנאי שמתמידים.' : 'זה מעט ל-B2 – כדאי לשקול להוסיף זמן בסופי שבוע.'}</p>
  </a>`;
}

function weekCard(wk) {
  const a = store.weekActivity();
  const goals = [['ימי תרגול', a.days, 6], ['שיחות', a.chat, 3], ['משימית מבחן', a.exam, 2]];
  return `<div class="card week">
    <div class="row-between"><h3>📅 השבוע</h3><small class="muted">${wk.final ? 'שבועיים אחרונים: חזרה ומבחני דמה' : `עוד ${wk.weeksLeft} שבועות תוכנית · ${wk.remaining} נושאים פתוחים`}</small></div>
    ${wk.units.map((id) => { const u = store.unitById(id); if (!u) return ''; const m = store.mastery(u); return `<a class="row-link" href="#unit/${id}"><span>🎯 ${esc(u.he)} <small class="muted">${u.level}</small></span><span class="mini-track"><i style="width:${m.pct}%"></i></span></a>`; }).join('')}
    <div class="wk-goals">${goals.map(([l, v, g]) => `<span class="${v >= g ? 'ok' : ''}">${l}: ${Math.min(v, g)}/${g}</span>`).join('')}</div>
  </div>`;
}

// יוצר ברקע מילים ותרגילים ליחידה הבאה כשהמלאי עומד להיגמר
let generating = false;
async function autoGenerate(force) {
  if (generating || !ai.hasKey()) return;
  generating = true;
  try {
    if (force || store.pendingNewCount() < set().newPerDay * 2) {
      const u = store.nextUnitToGenerate('words');
      if (u) {
        const n = store.addUnitWords(u.id, await ai.generateUnitWords(u, [...store.allItems().values()].map((x) => x.it), 30));
        if (n) toast(`✨ נוספו ${n} מילים לנושא "${u.he}"`);
      }
    }
    if (force || store.nextNewDrills(set().drillsPerDay * 2).length < set().drillsPerDay * 2) {
      const u = store.nextUnitToGenerate('drills');
      if (u) {
        const n = store.addUnitDrills(u.id, await ai.generateDrills(u, 12));
        if (n) toast(`✨ נוספו ${n} תרגילים לנושא "${u.he}"`);
      }
    }
  } catch (e) { console.warn('autogen', e); }
  generating = false;
}

function installHint() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<div class="card soft"><p>📲 <b>התקנה כאפליקציה:</b> ${ios ? 'ב-Safari לחצי על כפתור השיתוף ⬆️ ואז "הוסף למסך הבית".' : 'בתפריט הדפדפן (⋮) בחרי "התקן אפליקציה" או "הוסף למסך הבית".'}</p></div>`;
}

// ================= תרגול (SRS): מילים + תרגילים לפי נושא =================
let session = null;

function chooseMode(c, isNewTest) {
  if (isNewTest) return 'mc-it-he';
  const it = store.item(c.id);
  const hasCtx = !!contextFor(it);
  const canCloze = hasCtx || !!(it.ex && findIn(it.ex, itemVariants(it)));
  const s = c.s || 0;
  let modes;
  if (c.state === 'learning') modes = ['mc-he-it', 'mc-it-he'];
  else if (s < 2.5) modes = ['mc-it-he', 'listen', 'mc-he-it'];
  else if (s < 8) modes = ['listen', 'mc-he-it', canCloze ? 'cloze' : 'mc-he-it', 'type', ...(hasCtx ? ['cloze'] : [])];
  else modes = ['type', canCloze ? 'cloze-type' : 'type', sttAvailable() ? 'speak' : 'type', 'listen', ...(hasCtx ? ['cloze-type'] : [])];
  return pick(modes);
}

// תרגיל: בחירה כשהוא חדש/חלש, הקלדה כשהוא כבר יציב (קושי רצוי)
function drillMode(c) {
  if (!c || c.state !== 'review' || (c.s || 0) < 3) return 'mc';
  return 'type';
}

// בניית תצוגת תרגיל – משותף לאבחון ולתרגול
function drillView(d, mode) {
  const u = store.unitById(d.unit);
  const kind = `<div class="prompt-label">${KINDS[d.k] || ''} <span class="src-tag">${esc(u?.he || '')}</span></div>`;
  let body = '', answer = '', correct = d.a, autoSay = '';
  if (d.k === 'spell') {
    body = `${kind}<p>${mode === 'mc' ? 'הקשיבי ובחרי את האיות הנכון' : 'הקשיבי וכתבי את המילה'}</p><div class="say-row big-say">${spk(d.a)}${spk(d.a, true)}</div>`;
    autoSay = d.a;
    answer = mode === 'mc' ? mcOptions(shuffle([d.a, ...d.o]), 'it') : typeBox();
  } else if (d.k === 'ear') {
    body = `${kind}<p>${mode === 'mc' ? 'הקשיבי – מה שמעת?' : 'הקשיבי וכתבי את המשפט (הכתבה)'}</p><div class="say-row big-say">${spk(d.a)}${spk(d.a, true)}</div>`;
    autoSay = d.a;
    if (mode === 'mc') { correct = d.he; answer = mcOptions(shuffle([d.he, ...d.o]), 'he'); } else answer = typeBox();
  } else {
    const hasBlank = d.q.includes('___');
    const q = hasBlank ? `<div class="it big cloze">${esc(d.q).replace('___', '<span class="blank">____</span>')}</div>` : `<div class="he big">${esc(d.q)}</div>`;
    body = `${kind}${q}`;
    answer = mode === 'mc' ? mcOptions(shuffle([d.a, ...d.o]), 'it') : typeBox();
  }
  return { body, answer, correct, autoSay };
}

function distractors(it, field, n = 3) {
  const pool = [...store.allItems().values()].filter((x) => x.id !== it.id && x[field] !== it[field]);
  const same = pool.filter((x) => x.unit === it.unit);
  const seen = pool.filter((x) => isSeen(store.card(x.id)));
  const out = new Set();
  for (const src of [shuffle(same), shuffle(seen), shuffle(pool)]) {
    for (const x of src) { if (out.size >= n) break; out.add(x[field]); }
  }
  return [...out].slice(0, n);
}

routes.practice = {
  tab: 'today',
  render() {
    if (ai.hasKey() && store.pendingRaw().length) {
      view().innerHTML = spinner('מכינה כרטיסים ממה שקראת ואמרת…');
      Promise.race([enrichPending(), timeout(25000)]).then(() => { if (location.hash === '#practice') routes.practice.build(); });
      return;
    }
    routes.practice.build();
  },
  // unitId: תרגול ממוקד בנושא אחד (מדף הנושא)
  build(unitId) {
    let due, newIds, newDrills, extra = false;
    const queue = [];
    if (unitId) {
      const u = store.unitById(unitId);
      const drills = (u.drills || []).map((_, i) => `d.${u.id}.${i}`);
      due = store.dueCards().filter((c) => c.id.startsWith(`d.${u.id}.`) || c.id.startsWith(`${u.id}.`));
      const dueSet = new Set(due.map((c) => c.id));
      newDrills = drills.filter((id) => !store.card(id) || store.card(id).state === 'new').slice(0, 12);
      // גם תרגילים שכבר נלמדו ועוד לא הגיע זמנם – כתרגול נוסף (לא משנה את התזמון אם הצליחה)
      shuffle(drills.filter((id) => store.card(id) && store.card(id).state !== 'new' && !dueSet.has(id))).slice(0, 8)
        .forEach((id) => queue.push({ id, kind: 'test', practiceOnly: true }));
      newIds = (u.items || []).map((_, i) => `${u.id}.${i}`).filter((id) => !store.card(id)).slice(0, 8);
    } else {
      // שיעור = עד 80 חזרות + מילים ותרגילים חדשים. אפשר כמה שיעורים ביום
      due = store.dueCards().slice(0, 80);
      newIds = store.nextNewItems(Math.min(15, Math.max(0, set().newPerDay - store.newIntroducedToday())));
      newDrills = store.nextNewDrills(Math.min(15, Math.max(0, set().drillsPerDay - store.newDrillsToday())));
      if (!due.length && !newIds.length && !newDrills.length) {
        extra = true;
        newIds = store.nextNewItems(4);
        newDrills = store.nextNewDrills(6);
        store.weakItems(8).forEach((x) => queue.push({ id: x.id, kind: 'test', practiceOnly: true }));
      }
    }
    due.forEach((c) => queue.push({ id: c.id, kind: 'test' }));
    const q = shuffle(queue);
    // משלבים את החדשים בין החזרות (interleaving)
    newDrills.forEach((id) => q.splice(Math.floor(Math.random() * (q.length + 1)), 0, { id, kind: 'test', isNew: true }));
    newIds.forEach((id, k) => {
      const pos = Math.min(q.length, k * 3 + 1);
      q.splice(pos, 0, { id, kind: 'intro' });
      q.splice(Math.min(q.length, pos + 3), 0, { id, kind: 'test', isNew: true });
    });
    if (!q.length) {
      view().innerHTML = `<div class="card center"><h2>🎉 סיימת הכל!</h2><p>אין כרטיסים לתרגול כרגע. ${ai.hasKey() ? 'המורה מכינה עכשיו מילים ותרגילים לנושא הבא – נסי שוב בעוד דקה.' : 'כדי להמשיך לנושאי B1–B2 צריך מפתח AI (הוא מכין את המילים והתרגילים).'}</p><a class="btn" href="#course">לנושאים</a></div>`;
      autoGenerate(true);
      return;
    }
    session = { q, i: 0, total: q.filter((x) => x.kind === 'test').length, done: 0, correct: 0, start: Date.now(), wrong: [], relearn: {}, unitId, extra };
    nextCard();
  },
};

routes.topic = {
  tab: 'course',
  render(id) { if (!store.unitById(id)) return go('#course'); routes.practice.build(id); },
};

function progressBar() {
  const p = session.total ? Math.round((session.done / session.total) * 100) : 0;
  return `<div class="pbar"><a href="#today" class="x" aria-label="יציאה">✕</a><div class="track"><i style="width:${p}%"></i></div><span class="small">${session.done}/${session.total}</span></div>`;
}

function nextCard() {
  if (!session) return;
  if (session.i >= session.q.length) return finishSession();
  const task = session.q[session.i];
  if (store.isDrill(task.id)) {
    const d = store.drill(task.id);
    if (!d) { session.i++; return nextCard(); }
    return showDrill(d, store.card(d.id), task);
  }
  const it = store.item(task.id);
  if (!it) { session.i++; return nextCard(); }
  if (task.kind === 'intro') return showIntro(it);
  const c = store.card(task.id) || newCard(task.id);
  const mode = task.isNew || task.relearn ? (task.relearn ? 'mc-he-it' : 'mc-it-he') : chooseMode(c, false);
  showTest(it, c, mode, task);
}

function showIntro(it) {
  view().innerHTML = `${progressBar()}
  <div class="flash intro">
    <div class="badge">${{ mistake: '✏️ תיקון מהשיחה שלך', tap: '📖 מילה שבדקת בסיפור', story: '📖 מהסיפור שלך', chat: '💬 מהשיחה שלך', manual: '📒 מהקורס' }[store.card(it.id)?.src || it.src] || (it.unit?.startsWith('s') ? '📒 מהקורס' : '✨ מילה חדשה')}</div>
    <div class="it huge">${tappable(it.it)}</div>
    <div class="say-row">${spk(it.it)}${spk(it.it, true)}</div>
    <div class="he big">${esc(it.he)}</div>
    ${it.note ? `<p class="note">💡 ${esc(it.note)}</p>` : ''}
    ${it.ex ? `<div class="example"><div class="it">${tappable(it.ex)} ${spk(it.ex)}</div><div class="he muted">${esc(it.exHe)}</div></div>` : ''}
    <p class="muted small">🗣️ אמרי את המילה בקול פעמיים</p>
  </div>
  <div class="actions"><button class="btn big" id="cont">הבנתי ←</button></div>`;
  if (set().autoplay) speak(it.it);
  $('#cont').onclick = () => {
    if (!store.card(it.id)) { store.putCard(newCard(it.id)); }
    store.bump('newWords');
    session.i++; nextCard();
  };
}

function showDrill(d, c, task) {
  const t0 = Date.now();
  const mode = task.isNew || task.relearn ? 'mc' : drillMode(c);
  const v = drillView(d, mode);
  view().innerHTML = `${progressBar()}<div class="flash">${v.body}</div>${v.answer}<div id="fb"></div>`;
  if (v.autoSay) speak(v.autoSay);
  const finish = (result, given) => onDrillAnswer(d, c, mode, task, result, given, Date.now() - t0);
  view().querySelectorAll('[data-opt]').forEach((b) => {
    b.onclick = () => {
      const ok = b.dataset.opt === v.correct;
      view().querySelectorAll('[data-opt]').forEach((x) => { x.disabled = true; if (x.dataset.opt === v.correct) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      finish(ok ? 'exact' : 'wrong', b.dataset.opt);
    };
  });
  const inp = $('#ans');
  if (inp) {
    setTimeout(() => inp.focus(), 50);
    const submit = () => {
      const val = inp.value.trim();
      if (!val) return finish('wrong', '');
      inp.disabled = true;
      if (d.k === 'ear') { const sc = compareWords(d.a, val).score; return finish(sc >= 90 ? 'exact' : sc >= 70 ? 'typo' : 'wrong', val); }
      let g = grade(val, d.a);
      // בתרגיל דקדוק, "כמעט" זו טעות (parlamo ≠ parliamo). הטעמה חסרה מתקבלת – חוץ מתשובות קצרצרית כמו è
      if (g === 'typo') g = 'wrong';
      if (g === 'accent' && normalize(d.a).length <= 2) g = 'wrong';
      finish(g, val);
    };
    $('#check').onclick = submit;
    inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    $('#idk').onclick = () => finish('wrong', '');
    const m = $('#tmic');
    if (m) m.onclick = async () => {
      m.classList.add('rec');
      try { const r = await listen({ onInterim: (x) => { inp.value = x; } }); if (r) inp.value = r; } catch { toast('המיקרופון לא זמין'); }
      m.classList.remove('rec');
    };
  }
}

function onDrillAnswer(d, c, mode, task, result, given, ms) {
  let g = result === 'exact' || result === 'accent' ? ((ms > 15000 && mode === 'mc') ? 2 : 3) : result === 'typo' ? 2 : 1;
  if (g === 3 && mode === 'mc' && ms < 3000 && (c?.s || 0) > 20) g = 4;
  const ok = g > 1;
  if (!task.relearn) { session.done++; if (ok) session.correct++; else session.wrong.push(d.id); }
  store.bump('reviews'); if (ok) store.bump('correct');
  if (task.isNew && (!c || c.state === 'new')) store.bump('newDrills');
  if (!task.practiceOnly || !ok) store.putCard(review(c && c.state ? c : newCard(d.id), g, Date.now(), set().retention));
  if (!ok) {
    session.relearn[d.id] = (session.relearn[d.id] || 0) + 1;
    if (session.relearn[d.id] <= 2) session.q.splice(Math.min(session.q.length, session.i + 4), 0, { id: d.id, kind: 'test', relearn: true });
  }
  const u = store.unitById(d.unit);
  const full = d.q.includes('___') ? d.q.replace('___', `<b class="fix">${esc(d.a)}</b>`) : '';
  const msg = { exact: '✓ מצוין!', accent: '✓ נכון! (שימי לב להטעמה)', typo: '≈ כמעט!', wrong: given ? '✗ לא בדיוק' : 'זו התשובה:' }[result];
  $('#fb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">
    <div class="fb-title">${msg}</div>
    ${!ok && given && mode !== 'mc' ? `<div class="small">כתבת: <span class="it strike">${esc(given)}</span></div>` : ''}
    ${full ? `<div class="it big">${full.replace(/\(([^)]*)\)\s*$/, '')} ${spk(d.q.replace('___', d.a).replace(/\(([^)]*)\)\s*$/, ''))}</div>` : `<div class="it big">${esc(d.a)} ${spk(d.a)}</div>`}
    <div class="he">${esc(d.he)}</div>
    ${!ok && u ? `<p class="small"><a href="#unit/${u.id}">📖 הסבר קצר: ${esc(u.he)}</a></p>` : ''}
    <div class="actions">
      ${!ok && given && mode !== 'mc' ? '<button class="btn ghost" id="override">בעצם צדקתי</button>' : ''}
      <button class="btn big" id="next">המשך ←</button>
    </div></div>`;
  if (set().autoplay && d.k !== 'ear' && d.k !== 'spell' && full) speak(d.q.replace('___', d.a).replace(/\(([^)]*)\)\s*$/, ''));
  const nb = $('#next');
  nb.focus({ preventScroll: true });
  $('#fb').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  nb.onclick = () => { session.i++; nextCard(); };
  const ov = $('#override');
  if (ov) ov.onclick = () => {
    store.putCard(review(c && c.state ? c : newCard(d.id), 2, Date.now(), set().retention));
    session.correct++; session.wrong = session.wrong.filter((x) => x !== d.id);
    session.q = session.q.filter((x, k) => !(k > session.i && x.id === d.id && x.relearn));
    store.bump('correct');
    session.i++; nextCard();
  };
}

function showTest(it, c, mode, task) {
  const t0 = Date.now();
  let body = '';
  let answerHtml = '';
  const form = mode.startsWith('cloze') ? clozeSource(it) : null;
  if (mode.startsWith('cloze') && !form) mode = mode === 'cloze' ? 'mc-he-it' : 'type';
  if (mode === 'speak' && !sttAvailable()) mode = 'type';

  if (mode === 'mc-it-he') {
    const opts = shuffle([it.he, ...distractors(it, 'he')]);
    body = `<div class="prompt-label">מה הפירוש?</div><div class="it huge">${esc(it.it)}</div><div class="say-row">${spk(it.it)}</div>`;
    answerHtml = mcOptions(opts, 'he');
  } else if (mode === 'listen') {
    const opts = shuffle([it.he, ...distractors(it, 'he')]);
    body = `<div class="prompt-label">🎧 הקשיבי – מה שמעתם?</div><div class="say-row big-say">${spk(it.it)}${spk(it.it, true)}</div>`;
    answerHtml = mcOptions(opts, 'he');
  } else if (mode === 'mc-he-it') {
    const opts = shuffle([it.it, ...distractors(it, 'it')]);
    body = `<div class="prompt-label">איך אומרים באיטלקית?</div><div class="he huge">${esc(it.he)}</div>`;
    answerHtml = mcOptions(opts, 'it');
  } else if (mode === 'cloze') {
    const opts = shuffle([form.form, ...distractors(it, 'it').map((x) => x.replace(/^(il|lo|la|i|gli|le)\s+/i, ''))]);
    body = `<div class="prompt-label">השלימי את המשפט ${form.label ? `<span class="src-tag">${form.label}</span>` : ''}</div>
      <div class="it big cloze">${esc(form.sent.slice(0, form.index))}<span class="blank">____</span>${esc(form.sent.slice(form.index + form.form.length))}</div>
      <div class="he muted">${esc(form.he)}</div>`;
    answerHtml = mcOptions(opts, 'it');
  } else if (mode === 'cloze-type') {
    body = `<div class="prompt-label">השלימי את המשפט (הקלידי) ${form.label ? `<span class="src-tag">${form.label}</span>` : ''}</div>
      <div class="it big cloze">${esc(form.sent.slice(0, form.index))}<span class="blank">____</span>${esc(form.sent.slice(form.index + form.form.length))}</div>
      <div class="he muted">${esc(form.he)}</div><div class="he small muted">(${esc(it.he)}${normalize(form.form) !== normalize(it.it) ? ` · <span class="it">${esc(it.it)}</span>` : ''})</div>`;
    answerHtml = typeBox();
  } else if (mode === 'type') {
    body = `<div class="prompt-label">כתבי באיטלקית</div><div class="he huge">${esc(it.he)}</div>
      ${it.exHe ? `<div class="he muted small">לדוגמה: ${esc(it.exHe)}</div>` : ''}`;
    answerHtml = typeBox();
  } else if (mode === 'speak') {
    body = `<div class="prompt-label">🎙️ אמרי באיטלקית</div><div class="he huge">${esc(it.he)}</div>`;
    answerHtml = `<div class="actions col"><button class="btn big mic" id="mic">🎙️ לחצי ודברי</button>
      <p class="muted small" id="heard"></p><button class="btn ghost" id="totype">אני מעדיפה להקליד</button></div>`;
  }

  view().innerHTML = `${progressBar()}<div class="flash">${body}</div>${answerHtml}<div id="fb"></div>`;
  if ((mode === 'mc-it-he' && set().autoplay) || mode === 'listen') speak(it.it);

  const target = mode.startsWith('cloze') ? form.form : it.it;
  const finish = (result, given) => onAnswer(it, c, mode, task, result, given, Date.now() - t0);

  if (answerHtml.includes('data-opt')) {
    view().querySelectorAll('[data-opt]').forEach((b) => {
      b.onclick = () => {
        const ok = b.dataset.opt === (mode === 'mc-it-he' || mode === 'listen' ? it.he : target);
        view().querySelectorAll('[data-opt]').forEach((x) => {
          x.disabled = true;
          if (x.dataset.opt === (mode === 'mc-it-he' || mode === 'listen' ? it.he : target)) x.classList.add('right');
        });
        if (!ok) b.classList.add('wrong');
        finish(ok ? 'exact' : 'wrong', b.dataset.opt);
      };
    });
  }
  const inp = $('#ans');
  if (inp) {
    setTimeout(() => inp.focus(), 50);
    const submit = () => {
      if (!inp.value.trim()) { finish('wrong', ''); return; }
      inp.disabled = true;
      finish(grade(inp.value, target), inp.value);
    };
    $('#check').onclick = submit;
    inp.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
    $('#idk').onclick = () => finish('wrong', '');
    const m = $('#tmic');
    if (m) m.onclick = async () => {
      m.classList.add('rec');
      try { const r = await listen({ onInterim: (x) => { inp.value = x; } }); if (r) inp.value = r; } catch { toast('המיקרופון לא זמין'); }
      m.classList.remove('rec');
    };
  }
  if (mode === 'speak') {
    $('#totype').onclick = () => showTest(it, c, 'type', task);
    $('#mic').onclick = async () => {
      const b = $('#mic'); b.classList.add('rec'); b.textContent = '🎙️ מקשיב…';
      try {
        const heard = await listen({ onInterim: (x) => { $('#heard').textContent = x; } });
        b.classList.remove('rec');
        $('#heard').textContent = heard ? `שמעתי: "${heard}"` : 'לא שמעתי. נסי שוב.';
        if (!heard) { b.textContent = '🎙️ נסי שוב'; return; }
        b.disabled = true;
        const g = grade(heard, target);
        finish(g === 'wrong' ? (compareWords(target, heard).score >= 70 ? 'typo' : 'wrong') : g, heard);
      } catch {
        b.classList.remove('rec'); toast('המיקרופון לא זמין – עוברים להקלדה');
        showTest(it, c, 'type', task);
      }
    };
  }
}

const mcOptions = (opts, lang) => `<div class="options">${opts.map((o) => `<button class="opt ${lang}" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
const typeBox = () => `<div class="type-box">
  <div class="inp-row"><input id="ans" class="accent-target" lang="it" dir="ltr" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="scrivi qui…">
  ${sttAvailable() ? '<button class="icon-btn" id="tmic" aria-label="הכתבה">🎙️</button>' : ''}</div>
  ${accentBar()}
  <div class="actions"><button class="btn ghost" id="idk">לא יודעת</button><button class="btn" id="check">בדיקה</button></div></div>`;

function onAnswer(it, c, mode, task, result, given, ms) {
  let g;
  if (result === 'exact' || result === 'accent') g = (ms > 12000 && mode.startsWith('mc')) ? 2 : 3;
  else if (result === 'typo') g = 2;
  else g = 1;
  if (g === 3 && mode.startsWith('mc') && ms < 2500 && c.s > 20) g = 4;
  const ok = g > 1;
  session.done += task.relearn ? 0 : 1;
  if (!task.relearn) { if (ok) session.correct++; else session.wrong.push(it.id); }
  store.bump('reviews');
  if (ok) store.bump('correct');
  if (!task.practiceOnly || !ok) {
    store.putCard(review(store.card(it.id) || newCard(it.id), g, Date.now(), set().retention));
  }
  // כרטיס שנכשל חוזר עוד מעט באותו שיעור (עד פעמיים)
  if (!ok) {
    session.relearn[it.id] = (session.relearn[it.id] || 0) + 1;
    if (session.relearn[it.id] <= 2) session.q.splice(Math.min(session.q.length, session.i + 4), 0, { id: it.id, kind: 'test', relearn: true });
  }
  const msg = {
    exact: '✓ מצוין!', accent: '✓ נכון! (שימי לב להטעמה)', typo: '≈ כמעט! שגיאת כתיב קטנה', wrong: given ? '✗ לא בדיוק' : 'זו התשובה:',
  }[result];
  $('#fb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">
    <div class="fb-title">${msg}</div>
    ${!ok && given && !mode.startsWith('mc') ? `<div class="small">כתבת: <span class="it strike">${esc(given)}</span></div>` : ''}
    <div class="it big">${tappable(it.it)} ${spk(it.it)}</div>
    <div class="he">${esc(it.he)}</div>
    ${it.note ? `<p class="note small">💡 ${esc(it.note)}</p>` : ''}
    ${it.ex ? `<div class="example"><div class="it">${tappable(it.ex)} ${spk(it.ex)}</div><div class="he muted small">${esc(it.exHe)}</div></div>` : ''}
    ${(() => { const cx = contextFor(it); return cx && !mode.startsWith('cloze') ? `<div class="example ctx"><div class="small muted">${SRC_LABEL[cx.src] || ''} – פגשת את זה כאן:</div><div class="it">${tappable(cx.sent)} ${spk(cx.sent)}</div><div class="he muted small">${esc(cx.he)}</div></div>` : ''; })()}
    <div class="actions">
      ${!ok && given && !mode.startsWith('mc') ? '<button class="btn ghost" id="override">בעצם צדקתי</button>' : ''}
      <button class="btn big" id="next">המשך ←</button>
    </div></div>`;
  if (set().autoplay && mode !== 'listen') speak(it.it);
  else if (mode === 'listen' && set().autoplay && it.ex) speak(it.ex);
  const nb = $('#next');
  nb.focus({ preventScroll: true });
  $('#fb').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  nb.onclick = () => { session.i++; nextCard(); };
  const ov = $('#override');
  if (ov) ov.onclick = () => {
    // ביטול הכישלון: מחשבים מחדש כ"קשה"
    store.putCard(review(c.state ? c : newCard(it.id), 2, Date.now(), set().retention));
    session.correct++; session.wrong = session.wrong.filter((x) => x !== it.id);
    session.q = session.q.filter((x, k) => !(k > session.i && x.id === it.id && x.relearn));
    store.bump('correct');
    session.i++; nextCard();
  };
}

function finishSession() {
  const mins = Math.max(1, Math.round((Date.now() - session.start) / 60000));
  const acc = session.total ? Math.round((session.correct / session.total) * 100) : 100;
  const wrongIds = [...new Set(session.wrong)];
  const wrongW = wrongIds.filter((id) => !store.isDrill(id)).map((id) => store.item(id)).filter(Boolean);
  const wrongD = wrongIds.filter((id) => store.isDrill(id)).map((id) => store.drill(id)).filter(Boolean);
  const topics = [...new Set(wrongD.map((d) => d.unit))].map(store.unitById).filter(Boolean);
  const uid = session.unitId;
  view().innerHTML = `
  <div class="card center done-card">
    <div class="hero-flag">🎉</div>
    <h2>Brava, Naama!</h2>
    <div class="stats-row">
      <div class="stat"><b>${session.total}</b><span>תרגולים</span></div>
      <div class="stat"><b>${acc}%</b><span>הצלחה</span></div>
      <div class="stat"><b>${mins}</b><span>דקות</span></div>
    </div>
    <p class="muted small">${acc >= 95 ? 'קל מדי? אפשר להעלות את מספר החדשים ביום בהגדרות.' : acc < 75 ? 'קצת קשה – וזה בסדר! הקושי הזה הוא בדיוק מה שמחזק את הזיכרון. מה שטעית בו יחזור בקרוב.' : 'רמת קושי מצוינת ללמידה.'}</p>
  </div>
  ${topics.length ? `<div class="card"><h3>נושאים לחיזוק</h3>${topics.map((u) => `<a class="row-link" href="#unit/${u.id}">📖 ${esc(u.he)}</a>`).join('')}</div>` : ''}
  ${wrongW.length ? `<div class="card"><h3>מילים לחיזוק</h3>${wrongW.map((x) => `<div class="row"><span class="it">${esc(x.it)}</span>${spk(x.it)}<span class="he">${esc(x.he)}</span></div>`).join('')}</div>` : ''}
  <h3 class="sec">ועכשיו – להשתמש במה שלמדת</h3>
  <div class="grid2">
    <a class="card mini" href="#chat/${scenarioOfDay().id}"><span class="emoji">🗣️</span><b>שיחה</b><small>${esc(scenarioOfDay().he)}</small></a>
    <a class="card mini" href="${activityOfDay().href}"><span class="emoji">${activityOfDay().icon}</span><b>הפעילות של היום</b><small>${esc(activityOfDay().label)}</small></a>
  </div>
  <div class="actions">${uid ? `<a class="btn" href="#unit/${uid}">חזרה לנושא</a>` : store.dueCards().length || store.pendingNewCount() ? '<a class="btn" href="#practice" id="again">שיעור נוסף</a>' : ''}<a class="btn ghost" href="#today">לדף הבית</a></div>`;
  const ag = $('#again'); if (ag) ag.onclick = (e) => { e.preventDefault(); routes.practice.render(); };
  session = null;
}

// ================= נושאים =================
function unitRow(u, i) {
  const m = store.mastery(u);
  const dg = store.S().diag?.scores?.[u.id];
  const wk = (store.S().week?.units || []).includes(u.id);
  return `<a class="unit ${wk ? 'cur' : ''} ${m.pct >= 70 ? 'complete' : ''}" href="#unit/${u.id}">
    <span class="num">${i}</span>
    <div class="u-body"><b>${esc(u.he)}</b><small class="it">${esc(u.it)} · ${esc(u.level)}${dg ? ` · <span class="he">אבחון ${dg[0]}/${dg[1]}</span>` : ''}</small>
    <div class="track"><i style="width:${m.pct}%"></i></div></div>
    <span class="u-stat">${!m.total ? '✨' : m.pct >= 85 ? '⭐' : wk ? '🎯' : `${m.pct}%`}</span></a>`;
}

routes.course = {
  render() {
    const course = UNITS.filter((u) => u.stage === 'course');
    const review = UNITS.filter((u) => u.stage === 'review');
    const fresh = UNITS.filter((u) => u.stage === 'new');
    let n = 0;
    const group = (title, list) => (list.length ? `<h3 class="sec">${title}</h3><div class="units">${list.map((u) => unitRow(u, ++n)).join('')}</div>` : '');
    view().innerHTML = `<header class="top"><h1>📚 נושאים</h1><a class="btn small-btn" href="#suzy">➕ מהקורס</a></header>
    <div class="card lv-card">${store.LEVELS.map((l) => `<div class="row-between"><b>${l}</b><div class="track wide"><i style="width:${store.levelProgress(l)}%"></i></div><small>${store.levelProgress(l)}%</small></div>`).join('')}
      <p class="small muted">האחוז = כמה מהמילים והתרגילים של הרמה כבר יציבים בזיכרון שלך.</p></div>
    ${group('📒 מהקורס בסוזי אקדמי', course)}
    ${group('שלב 1 · חיזוק – מה שלמדת בקורס (A1–A2)', review)}
    ${group('שלב 2 · A2 – נושאים חדשים', fresh.filter((u) => u.level === 'A2'))}
    ${group('שלב 3 · B1', fresh.filter((u) => u.level === 'B1'))}
    ${group('שלב 4 · B2', fresh.filter((u) => u.level === 'B2'))}
    <p class="small muted">🎯 = נושא השבוע · ⭐ = נשלט היטב. בנושאי B1–B2 המורה מכינה מילים ותרגילים לפי שכיחות כשמגיעים אליהם.</p>`;
  },
};

routes.unit = {
  tab: 'course',
  render(id) {
    const u = store.unitById(id) || UNITS[0];
    const m = store.mastery(u);
    const p = store.unitProgress(u);
    const dg = store.S().diag?.scores?.[u.id];
    const kinds = {};
    (u.drills || []).forEach((d) => { kinds[d[0]] = (kinds[d[0]] || 0) + 1; });
    const isCourse = u.stage === 'course';
    view().innerHTML = `
    <header class="top"><a href="#course" class="back">→</a><div><h1>${esc(u.he)}</h1><div class="it muted">${esc(u.it)} · ${esc(u.level)}</div></div></header>
    <div class="card"><div class="row-between"><b>שליטה בנושא</b><b>${m.pct}%</b></div><div class="track"><i style="width:${m.pct}%"></i></div>
      <p class="small muted">${m.drillsSeen}/${m.drillsTotal} תרגילים · ${p.seen}/${p.total} מילים${m.acc != null ? ` · ${m.acc}% הצלחה בתרגילים` : ''}${dg ? ` · אבחון ${dg[0]}/${dg[1]}` : ''}</p>
      ${(u.drills || []).length || (u.items || []).length ? `<a class="btn big" href="#topic/${u.id}">✏️ תרגול הנושא הזה</a>` : ''}
      ${Object.keys(kinds).length ? `<p class="small muted">${Object.entries(kinds).map(([k, v]) => `${KINDS[k] || k} ${v}`).join(' · ')}</p>` : ''}
    </div>
    ${u.grammar ? `<div class="card grammar">${u.grammar}
      <div class="ask-box">
        <p class="small muted">יש שאלה? שאלי את המורה (בעברית):</p>
        <div class="inp-row"><input id="q" placeholder="למשל: מתי lo ומתי il?"><button class="btn" id="ask">שאלי</button></div>
        <div id="ans-out"></div>
      </div></div>` : ''}
    ${isCourse ? addWordsBox(u) : ''}
    <div class="card">
      <div class="row-between"><h3>מילים וביטויים (${p.seen}/${p.total})</h3>${(u.items || []).length ? spk(u.items.map((x) => x[0]).join('. ')) : ''}</div>
      ${(u.gen || isCourse) && !(u.items || []).length ? `<p class="muted">${isCourse ? 'הוסיפי מילים מהשיעור למעלה.' : 'המורה תכין את המילים השכיחות והשימישיות ביותר לנושא הזה.'}</p>` : ''}
      ${(u.items || []).map((x, i) => {
        const c = store.card(`${u.id}.${i}`);
        const mark = isKnown(c) ? '⭐' : isSeen(c) ? '✓' : '';
        return `<div class="word-row"><div><span class="it">${esc(x[0])}</span> <span class="mark">${mark}</span><div class="he small">${esc(x[1])}</div></div>${spk(x[0])}</div>`;
      }).join('')}
    </div>
    <div class="actions col">
      ${u.gen ? `<button class="btn ghost" id="genu">${(u.items || []).length ? '+ עוד 30 מילים לנושא' : '✨ הכיני את מילות הנושא'}</button>` : ''}
      ${u.gen || isCourse ? `<button class="btn ghost" id="gend">${(u.drills || []).length ? '+ עוד 12 תרגילים' : '✨ הכיני תרגילים לנושא'}</button>` : ''}
      <div id="genout"></div>
      ${m.pct < 70 ? `<button class="btn ghost" id="focus">${set().focusUnit === u.id ? '🎯 הנושא הזה בפוקוס (לחצי לביטול)' : '🎯 להתמקד בנושא הזה בתרגול היומי'}</button>` : ''}
      ${isCourse ? '<button class="btn danger ghost" id="delu">מחיקת הנושא</button>' : ''}
    </div>`;
    const gen = (btn, fn, msg) => {
      if (!btn) return;
      btn.onclick = async () => {
        if (!ai.hasKey()) { $('#genout').innerHTML = noKeyCard('הכנת מילים ותרגילים'); return; }
        btn.disabled = true; $('#genout').innerHTML = spinner(msg);
        try { const n = await fn(); toast(`נוספו ${n}`); routes.unit.render(u.id); } catch (e) { $('#genout').innerHTML = errBox(e); btn.disabled = false; }
      };
    };
    gen($('#genu'), async () => store.addUnitWords(u.id, await ai.generateUnitWords(u, [...store.allItems().values()].map((x) => x.it), 30)), 'מכינה 30 מילים… (כ-30 שניות)');
    gen($('#gend'), async () => store.addUnitDrills(u.id, await ai.generateDrills(u, 12)), 'מכינה תרגילים… (כ-30 שניות)');
    const f = $('#focus');
    if (f) f.onclick = () => {
      const on = set().focusUnit === u.id;
      store.setSetting('focusUnit', on ? '' : u.id);
      toast(on ? 'בוטל' : 'המילים והתרגילים החדשים יגיעו קודם מהנושא הזה'); routes.unit.render(u.id);
    };
    const del = $('#delu');
    if (del) del.onclick = () => { if (confirm('למחוק את הנושא ואת המילים שלו?')) { store.removeUserUnit(u.id); go('#course'); } };
    if (isCourse) bindAddWords(u);
    const ask = $('#ask');
    if (ask) ask.onclick = async () => {
      const q = $('#q').value.trim(); if (!q) return;
      const out = $('#ans-out');
      if (!ai.hasKey()) { out.innerHTML = noKeyCard('מענה לשאלית'); return; }
      out.innerHTML = spinner();
      try { out.innerHTML = renderAnswer(await ai.askTutor(q, `Unit: ${u.it} – ${u.he}`)); } catch (e) { out.innerHTML = errBox(e); }
    };
  },
};

const renderAnswer = (r) => `<div class="answer"><p>${esc(r.answer_he)}</p>${(r.examples || []).map((x) => `<div class="ex-line"><span class="it">${tappable(x.it)}</span>${spk(x.it)}<div class="he small muted">${esc(x.he)}</div></div>`).join('')}</div>`;

// ================= מהקורס בסוזי אקדמי: נושאים ומילים =================
const addWordsBox = (u) => `<div class="card"><h3>➕ מילים מהשיעור</h3>
  <p class="small muted">מילה בכל שורה. אפשר עם תרגום (<span class="it">la scrivania = שולחן</span>) או בלי${ai.hasKey() ? ' – המורה תשלים תרגום ומשפט דוגמה' : ' (בלי מפתח AI צריך לכתוב גם תרגום)'}.</p>
  <textarea id="wl" class="accent-target" lang="it" dir="ltr" rows="5" placeholder="la scrivania = שולחן&#10;andare d'accordo&#10;il ginocchio"></textarea>${accentBar()}
  <div class="actions"><button class="btn" id="wladd">הוסיפי לתרגול</button></div><div id="wlout"></div></div>`;

function parseLines(text) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.split(/\s*(?:=|–|—|\t|:| - )\s*/);
    const he = m.slice(1).join(' ').trim();
    return { it: m[0].trim(), he: /[֐-׿]/.test(he) ? he : '' };
  }).filter((x) => x.it && !/[֐-׿]/.test(x.it));
}

function bindAddWords(u, after) {
  $('#wladd').onclick = async () => {
    const lines = parseLines($('#wl').value);
    if (!lines.length) return toast('כתבי לפחות מילה אחת באיטלקית');
    const out = $('#wlout');
    let items = lines;
    if (ai.hasKey()) {
      out.innerHTML = spinner('המורה משלימה תרגום ומשפטי דוגמה…');
      try {
        const r = await ai.completeWords(lines.map((x) => (x.he ? `${x.it} = ${x.he}` : x.it)), `${u.it} (${u.he})`);
        items = r.length ? r : lines;
      } catch (e) { out.innerHTML = errBox(e); return; }
    } else if (lines.some((x) => !x.he)) {
      out.innerHTML = '<p class="warn-text small">בלי מפתח AI צריך לכתוב תרגום לכל מילה (מילה = תרגום).</p>'; return;
    }
    const n = store.addUnitWords(u.id, items);
    toast(`נוספו ${n} מילים – יופיעו בתרגול הקרוב`);
    if (ai.hasKey() && (u.drills || []).length < 6) {
      out.innerHTML = spinner('מכינה גם תרגילים לנושא…');
      try { store.addUnitDrills(u.id, await ai.generateDrills(store.unitById(u.id), 10)); } catch (e) { console.warn(e); }
    }
    (after || (() => routes.unit.render(u.id)))();
  };
}

routes.suzy = {
  tab: 'course',
  render() {
    const course = UNITS.filter((u) => u.stage === 'course');
    view().innerHTML = `<header class="top"><a href="#course" class="back">→</a><h1>📒 מהקורס בסוזי אקדמי</h1></header>
    <p class="muted">האפליקציה לא מחליפה את הקורס – היא דואגת שמה שלמדת בשיעור לא יישכח. אחרי שיעור, הוסיפי את הנושא ו/או המילים החדשות (2 דקות), והם ייכנסי לחזרות ולתרגילים.</p>
    <div class="card"><h3>נושא חדש מהשיעור</h3>
      <input id="tit" placeholder="שם הנושא (למשל: passato prossimo, ציווי, בגדים)">
      <input id="tnote" placeholder="מה למדתם? (לא חובה, למשל: עם essere – פעלי תנועה)">
      <div class="actions"><button class="btn" id="tadd">צרי נושא</button></div>
      <p class="small muted">${ai.hasKey() ? 'המורה תכין תרגילים לנושא אוטומטית.' : 'עם מפתח AI המורה גם תכין תרגילים לנושא.'}</p><div id="tout"></div></div>
    ${course.length ? `<div class="card"><h3>הנושאים שהוספת</h3>${course.map((u) => { const m = store.mastery(u); return `<a class="row-link" href="#unit/${u.id}"><span>${esc(u.he)} <small class="muted">${(u.items || []).length} מילים · ${(u.drills || []).length} תרגילים</small></span><span class="mini-track"><i style="width:${m.pct}%"></i></span></a>`; }).join('')}</div>` : ''}
    <div class="card"><h3>רק מילים (בלי נושא)</h3><p class="small muted">הן ייכנסי ל"המילים שלי".</p>
      <a class="btn ghost" href="#words">להוספת מילים בודדות</a></div>`;
    $('#tadd').onclick = async () => {
      const name = $('#tit').value.trim();
      if (!name) return toast('כתבי שם לנושא');
      const id = store.addUserUnit({ it: name, he: name, note: $('#tnote').value });
      if (ai.hasKey()) {
        $('#tout').innerHTML = spinner('מכינה תרגילים לנושא… (כ-30 שניות)');
        try { store.addUnitDrills(id, await ai.generateDrills(store.unitById(id), 10)); } catch (e) { toast(e.message); }
      }
      go(`#unit/${id}`);
    };
  },
};

// ================= שיחה =================
let chat = null;

routes.chat = {
  render(id) {
    if (id) return openChat(id);
    const later = (s) => s.after && !store.unitStarted(s.after);
    const list = [...SCENARIOS.filter((s) => !later(s)), ...SCENARIOS.filter(later)];
    view().innerHTML = `<header class="top"><h1>🗣️ שיחה עם המורה</h1></header>
    <p class="muted">שיחות קצרית במצבים אמיתיים. המורה מדברת ברמה שלך, מתקנת בעדינות ומסבירה בעברית – והרמה עולה בהדרגה. אפשר להקליד או לדבר. כל תיקון נכנס לתרגול.</p>
    ${!ai.hasKey() ? noKeyCard('השיחה') : ''}
    <div class="scen-list">${list.map((s) => `
      <a class="scen ${later(s) ? 'later' : ''}" href="#chat/${s.id}">
        <span class="emoji">${s.icon}</span><div><b>${esc(s.he)}</b><small class="it">${esc(s.it)}</small>
        ${later(s) ? `<small class="muted">מומלץ אחרי: ${esc(store.unitById(s.after)?.he || '')}</small>` : ''}</div></a>`).join('')}
    </div>
    <div class="card"><h3>❓ שאלה חופשית למורה</h3>
      <div class="inp-row"><input id="q" placeholder="איך אומרים…? מה ההבדל בין…?"><button class="btn" id="ask">שאלי</button></div><div id="ans-out"></div></div>`;
    $('#ask').onclick = async () => {
      const q = $('#q').value.trim(); if (!q) return;
      const out = $('#ans-out');
      if (!ai.hasKey()) { out.innerHTML = noKeyCard('מענה לשאלית'); return; }
      out.innerHTML = spinner();
      try { out.innerHTML = renderAnswer(await ai.askTutor(q)); } catch (e) { out.innerHTML = errBox(e); }
    };
  },
};

function openChat(id) {
  const sc = SCENARIOS.find((s) => s.id === id) || SCENARIOS[0];
  if (!chat || chat.sc.id !== sc.id) chat = { sc, history: [], turns: [], corrections: [] };
  view().innerHTML = `
  <div class="chat-wrap">
    <header class="chat-head"><a href="#chat" class="back">→</a><span class="emoji">${sc.icon}</span><div><b>${esc(sc.he)}</b><small class="it">${esc(sc.it)}</small></div>
      <button class="icon-btn" id="voice" title="השמעה אוטומטית">${set().speakAnswers ? '🔊' : '🔇'}</button>
      <button class="icon-btn" id="endchat" title="סיום">🏁</button></header>
    <div class="msgs" id="msgs"></div>
    <div class="composer">
      ${accentBar()}
      <div class="inp-row">
        ${sttAvailable() ? '<button class="icon-btn mic-btn" id="cmic" aria-label="דבר">🎙️</button>' : ''}
        <textarea id="cin" class="accent-target" lang="it" dir="auto" rows="1" placeholder="Scrivi in italiano…" autocapitalize="sentences" autocorrect="off" spellcheck="false"></textarea>
        <button class="btn send" id="csend" aria-label="שלח">➤</button>
      </div>
    </div>
  </div>`;
  if (!ai.hasKey()) { $('#msgs').innerHTML = noKeyCard('השיחה'); return; }
  drawMsgs();
  if (!chat.turns.length) aiTurn();
  const cin = $('#cin');
  const send = () => {
    const t = cin.value.trim(); if (!t || chat.busy) return;
    cin.value = ''; cin.style.height = '';
    chat.history.push({ role: 'user', content: t });
    chat.turns.push({ who: 'me', text: t });
    store.bump('chat');
    drawMsgs(); aiTurn();
  };
  $('#csend').onclick = send;
  cin.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  cin.oninput = () => { cin.style.height = 'auto'; cin.style.height = Math.min(120, cin.scrollHeight) + 'px'; };
  $('#voice').onclick = () => { store.setSetting('speakAnswers', !set().speakAnswers); $('#voice').textContent = set().speakAnswers ? '🔊' : '🔇'; };
  $('#endchat').onclick = endChat;
  const m = $('#cmic');
  if (m) m.onclick = async () => {
    if (m.classList.contains('rec')) { listen.stop?.(); return; }
    m.classList.add('rec');
    try { const r = await listen({ onInterim: (x) => { cin.value = x; } }); if (r) cin.value = r; } catch { toast('המיקרופון לא זמין בדפדפן הזה'); }
    m.classList.remove('rec');
    cin.focus();
  };
}

async function aiTurn() {
  chat.busy = true;
  const box = $('#msgs');
  box.insertAdjacentHTML('beforeend', `<div class="msg ai pending" id="pend">${spinner('')}</div>`);
  box.scrollTop = box.scrollHeight;
  // שולחים רק את 20 ההודעות האחרונות כדי לשמור על עלות נמוכה
  let hist = chat.history.slice(-20);
  if (hist[0]?.role === 'assistant') hist = hist.slice(1);
  if (!hist.length || hist[0].role !== 'user') hist = [{ role: 'user', content: '(Inizia tu la conversazione)' }, ...hist];
  try {
    const r = await ai.chatTurn(chat.sc, hist);
    if (!chat.history.length) chat.history.push({ role: 'user', content: '(Inizia tu la conversazione)' });
    chat.history.push({ role: 'assistant', content: JSON.stringify({ reply: r.reply }) });
    // התיקונים שייכים להודעה האחרונה של הלומד
    const lastMe = [...chat.turns].reverse().find((t) => t.who === 'me');
    if (lastMe && r.corrections?.length) { lastMe.corrections = r.corrections; chat.corrections.push(...r.corrections); }
    chat.turns.push({ who: 'ai', text: r.reply, he: r.reply_he, hint: r.hint_he, words: r.new_words || [] });
    store.addContext([{ it: r.reply, he: r.reply_he, src: 'chat' }]);
    // התיקונים נכנסים לתרגול אוטומטית – עם המשפט שהלומד אמר
    if (lastMe && r.corrections?.length) {
      r.corrections.forEach((c) => store.addCustom({ it: c.right, he: c.why_he, ex: lastMe.text, src: 'mistake', raw: true, wrong: c.wrong, note: c.why_he }));
    }
    if (set().speakAnswers) speak(r.reply);
  } catch (e) {
    chat.turns.push({ who: 'err', text: e.message });
    if (chat.history.at(-1)?.role === 'user' && chat.turns.length > 1) { /* המשתמש יכול לשלוח שוב */ }
  }
  chat.busy = false;
  if (location.hash.startsWith('#chat/')) drawMsgs();
}

function drawMsgs() {
  const box = $('#msgs'); if (!box) return;
  box.innerHTML = chat.turns.map((t, k) => {
    if (t.who === 'me') {
      return `<div class="msg me"><div class="it" dir="ltr">${esc(t.text)}</div>
      ${t.corrections?.length ? `<div class="corr">${t.corrections.map((c, j) => `
        <div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span> ${spk(c.right)}
        <div class="small">${esc(c.why_he)}</div>
        <span class="chip ok">✓ נכנס לתרגול</span></div>`).join('')}</div>` : ''}</div>`;
    }
    if (t.who === 'err') return `<div class="msg err">⚠️ ${esc(t.text)} <button class="chip" id="retry">נסי שוב</button></div>`;
    return `<div class="msg ai"><div class="it" dir="ltr">${tappable(t.text)}</div>
      <div class="msg-tools">${spk(t.text)}${spk(t.text, true)}
        <button class="chip" data-tr="${k}">תרגום</button>${t.hint ? `<button class="chip" data-hint="${k}">💡 רמז</button>` : ''}</div>
      <div class="he small tr" id="tr${k}" ${set().showTranslation ? '' : 'hidden'}>${esc(t.he)}</div>
      <div class="he small hint" id="hint${k}" hidden>💡 ${esc(t.hint || '')}</div>
      ${t.words?.length ? `<div class="words">${t.words.map((w, j) => `<button class="chip word" data-addw="${k}:${j}">+ <span class="it">${esc(w.it)}</span> = ${esc(w.he)}</button>`).join('')}</div>` : ''}
    </div>`;
  }).join('');
  box.scrollTop = box.scrollHeight;
  box.onclick = (e) => {
    const tr = e.target.closest('[data-tr]'); if (tr) { const el = $('#tr' + tr.dataset.tr); el.hidden = !el.hidden; return; }
    const h = e.target.closest('[data-hint]'); if (h) { const el = $('#hint' + h.dataset.hint); el.hidden = !el.hidden; return; }
    const aw = e.target.closest('[data-addw]');
    if (aw) {
      const [k, j] = aw.dataset.addw.split(':').map(Number); const w = chat.turns[k].words[j];
      store.addCustom({ it: w.it, he: w.he, ex: chat.turns[k].text, exHe: chat.turns[k].he, src: 'chat', raw: true });
      aw.outerHTML = `<span class="chip ok">✓ ${esc(w.it)}</span>`; return;
    }
    if (e.target.id === 'retry') { chat.turns = chat.turns.filter((t) => t.who !== 'err'); drawMsgs(); aiTurn(); }
  };
}

function endChat() {
  const corr = chat?.corrections || [];
  const myTurns = chat?.turns.filter((t) => t.who === 'me').length || 0;
  sheet(`<div class="sheet-head"><b>🏁 סיכום השיחה</b><button class="icon-btn" data-close>✕</button></div>
    <p>אמרת <b>${myTurns}</b> משפטים באיטלקית. ${myTurns >= 6 ? 'כל הכבוד! 💪' : 'נסי להגיע ל-6+ משפטים בשיחה.'}</p>
    ${corr.length ? `<h4>נקודות לשיפור</h4>${corr.map((c) => `<div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span><div class="small">${esc(c.why_he)}</div></div>`).join('')}
      <p class="ok small">✓ כל התיקונים כבר בתרגול – עם המשפטים שלך, מתוקנים.</p>` : '<p class="ok">לא היו טעויות משמעותיות! 🎉</p>'}
    ${myTurns >= 5 ? '<button class="btn ghost" id="assess">📏 הערכת רמה לפי השיחה</button><div id="assout"></div>' : ''}
    <div class="actions"><button class="btn ghost" id="newchat">שיחה חדשה</button><a class="btn" href="#today">סיום</a></div>`);
  const as = $('#assess');
  if (as) as.onclick = async () => {
    as.disabled = true; $('#assout').innerHTML = spinner('מעריכה…');
    try {
      const r = await ai.assessLevel(chat.turns.filter((t) => t.who === 'me').map((t) => t.text));
      store.S().assessments = [...(store.S().assessments || []), { at: Date.now(), level: r.level }].slice(-30); store.save();
      $('#assout').innerHTML = `<div class="answer"><p class="big">רמה משוערת בדיבור: <b>${esc(r.level)}</b></p><p>👍 ${esc(r.strengths_he)}</p><p>🎯 ${esc(r.focus_he)}</p><p>➡️ ${esc(r.next_steps_he)}</p></div>`;
    } catch (e) { $('#assout').innerHTML = errBox(e); }
  };
  enrichPending();
  $('#newchat').onclick = () => { const id = chat.sc.id; chat = null; closeSheet(); openChat(id); };
}

// ================= סיפורים =================
const STORIES_KEY = 'italiano.stories';
const loadStories = () => { try { return JSON.parse(localStorage.getItem(STORIES_KEY) || '[]'); } catch { return []; } };
const saveStories = (a) => { try { localStorage.setItem(STORIES_KEY, JSON.stringify(a.slice(0, 15))); } catch { /* ignore */ } };

routes.stories = {
  tab: 'today',
  render() {
    storyGloss = null;
    const list = loadStories();
    const lvi = ai.levelInfo().idx;
    const defLen = lvi >= 4 ? 'long' : lvi >= 2 ? 'medium' : 'short';
    let len = defLen;
    view().innerHTML = `<header class="top"><h1>🎧 קריאה והאזנה</h1></header>
    <p class="muted">סיפורים קצרים שנכתבים במיוחד בשבילך – רק עם מילים שכבר למדת ועוד כמה חדשות. לחצי על כל מילה לתרגום, האזיני, וחקי את הדובר.</p>
    ${!ai.hasKey() ? noKeyCard('יצירת סיפורים') : `
    <div class="card"><h3>סיפור חדש</h3>
      <div class="chips">${shuffle(STORY_TOPICS).slice(0, 6).map((t) => `<button class="chip" data-topic="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div class="inp-row"><input id="topic" placeholder="או נושא משלך…"><button class="btn" id="gen">צרי</button></div>
      <div class="seg small" id="slen">${[['short', 'קצר'], ['medium', 'בינוני'], ['long', 'ארוך']].map(([k, l]) => `<button data-l="${k}" class="${k === defLen ? 'on' : ''}">${l}</button>`).join('')}</div>
    </div>`}
    ${list.length ? `<h3 class="sec">הסיפורים שלי</h3><div class="story-list">${list.map((s, i) => `<a class="story-item" href="#story/${i}"><b class="it">${esc(s.title)}</b><small>${esc(s.title_he)}</small>${s.read ? '<i>✓</i>' : ''}</a>`).join('')}</div>` : ''}`;
    const gen = async (topic) => {
      view().innerHTML = spinner('כותבת לך סיפור… (כ-20 שניות)');
      try {
        const s = await ai.makeStory(topic, len);
        s.topic = topic; s.created = Date.now();
        store.addContext(s.sentences.map((x) => ({ it: x.it, he: x.he, src: 'story' })));
        const all = loadStories(); all.unshift(s); saveStories(all);
        go('#story/0');
      } catch (e) { view().innerHTML = errBox(e) + '<a class="btn ghost" href="#stories">חזרה</a>'; }
    };
    view().querySelectorAll('[data-topic]').forEach((b) => { b.onclick = () => gen(b.dataset.topic); });
    const sl = $('#slen');
    if (sl) sl.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; len = b.dataset.l; sl.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); };
    const g = $('#gen'); if (g) g.onclick = () => gen($('#topic').value.trim() || pick(STORY_TOPICS));
  },
};

routes.story = {
  tab: 'today',
  render(idx) {
    const all = loadStories();
    const s = all[+idx || 0];
    if (!s) return go('#stories');
    storyGloss = s.glossary || [];
    view().innerHTML = `
    <header class="top"><a href="#stories" class="back">→</a><div><h1 class="it" dir="ltr">${esc(s.title)}</h1><div class="muted">${esc(s.title_he)}</div></div></header>
    <div class="player">
      <button class="btn" id="playall">▶ האזיני לכל הסיפור</button>
      <div class="seg small" id="spd"><button data-r="0.7">איטי</button><button data-r="0.9" class="on">רגיל</button></div>
      <button class="chip" id="alltr">הצגת תרגום</button>
    </div>
    <p class="muted small">שיטה מומלצת: 1) האזיני בלי טקסט 2) קראי ולחצי על מילים לא מוכרות 3) האזיני שוב 4) חקי כל משפט 🎙️</p>
    <div class="story">${s.sentences.map((x, i) => `
      <div class="sent" id="s${i}">
        <div class="it" dir="ltr">${tappable(x.it)}</div>
        <div class="sent-tools">${spk(x.it)}${spk(x.it, true)}
          ${sttAvailable() ? `<button class="icon-btn" data-shadow="${i}" aria-label="חיקוי">🎙️</button>` : ''}
          <button class="chip" data-str="${i}">תרגום</button></div>
        <div class="he small tr" id="st${i}" hidden>${esc(x.he)}</div>
        <div class="shadow-out" id="sh${i}"></div>
      </div>`).join('')}</div>
    <div class="card"><h3>❓ בדקי הבנה</h3>${(s.questions || []).map((q, qi) => `
      <div class="q"><p class="it" dir="ltr">${tappable(q.q)}</p><div class="options">${q.options.map((o, oi) => `<button class="opt it" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
    </div>
    <div class="actions"><button class="btn big" id="sdone">סיימתי ✓</button></div>`;

    let rate = 0.9;
    $('#spd').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; rate = +b.dataset.r; $('#spd').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); };
    let playing = false;
    $('#playall').onclick = () => {
      if (playing) { playing = false; stopSpeaking(); $('#playall').textContent = '▶ האזיני לכל הסיפור'; return; }
      playing = true; $('#playall').textContent = '⏸ עצור';
      const step = (i) => {
        document.querySelectorAll('.sent').forEach((el) => el.classList.remove('active'));
        if (!playing || i >= s.sentences.length) { playing = false; $('#playall') && ($('#playall').textContent = '▶ האזיני לכל הסיפור'); return; }
        const el = $('#s' + i); el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        speak(s.sentences[i].it, { rate, onend: () => setTimeout(() => step(i + 1), 350) });
      };
      step(0);
    };
    $('#alltr').onclick = () => { const show = $('#st0')?.hidden; s.sentences.forEach((_, i) => { $('#st' + i).hidden = !show; }); };
    view().onclick = async (e) => {
      const t = e.target.closest('[data-str]'); if (t) { const el = $('#st' + t.dataset.str); el.hidden = !el.hidden; return; }
      const q = e.target.closest('[data-q]');
      if (q) {
        const qq = s.questions[+q.dataset.q]; const ok = +q.dataset.o === qq.answer;
        q.parentElement.querySelectorAll('button').forEach((b, bi) => { b.disabled = true; if (bi === qq.answer) b.classList.add('right'); });
        if (!ok) q.classList.add('wrong');
        return;
      }
      const sh = e.target.closest('[data-shadow]');
      if (sh) {
        const i = +sh.dataset.shadow; const target = s.sentences[i].it; const out = $('#sh' + i);
        speak(target, { rate, onend: async () => {
          sh.classList.add('rec'); out.innerHTML = '<span class="muted small">🎙️ עכשיו את…</span>';
          try {
            const heard = await listen();
            const r = compareWords(target, heard);
            out.innerHTML = `<div class="shadow-res"><span class="score ${r.score >= 80 ? 'good' : r.score >= 50 ? 'mid' : 'low'}">${r.score}%</span>
              <span dir="ltr">${r.marks.map((m) => `<span class="${m.ok ? 'hit' : 'miss'}">${esc(m.w)}</span>`).join(' ')}</span></div>
              ${heard ? '' : '<span class="muted small">לא נשמע כלום – נסי שוב קרוב יותר לטלפון.</span>'}`;
          } catch { out.innerHTML = '<span class="muted small">המיקרופון לא זמין.</span>'; }
          sh.classList.remove('rec');
        } });
      }
    };
    $('#sdone').onclick = () => {
      enrichPending();
      if (!s.read) { s.read = true; all[+idx || 0] = s; saveStories(all); store.bump('stories'); }
      toast('כל הכבוד! 📚');
      go('#today');
    };
  },
};

// ================= כתיבה =================
// [אחרי איזה נושא, המשימה]
const WRITE_PROMPTS = [
  ['', 'הציגי את עצמך: שם, מאיפה את, מה את עושה ולמה את לומדת איטלקית (3–4 משפטים).'],
  ['r12', 'תארי את המשפחה שלך (4–5 משפטים, עם mio/mia/i miei).'],
  ['r7', 'תארי חברה טובה: איך היא נראית ומה היא לובשת היום.'],
  ['r9', 'מה את עושה ביום רגיל? (5 משפטים בהווה, עם di solito, sempre, mai)'],
  ['r11', 'מה את אוהבת לעשות בזמן הפנוי, ומה לא? (mi piace / mi piacciono)'],
  ['r13', 'כתבי הודעה לחברה: הזמיני אותה לצאת בשבת – מתי, איפה ובאיזו שעה.'],
  ['r15', 'תארי את הדירה שלך: החדרים ומה יש בכל חדר (c\'è / ci sono, sopra, accanto a).'],
  ['r17', 'תארי את הבוקר שלך עם פעלים חוזרים (mi sveglio, mi alzo…).'],
  ['u13', 'מה עשית בסוף השבוע האחרון? (passato prossimo, 5–6 משפטים)'],
  ['u16', 'מה התוכניות שלך לשנה הבאה באיטליה? (עתיד)'],
  ['b1', 'ספרי איך היו החיים שלך כשהיית ילדה (imperfetto, 6 משפטים).'],
  ['b2', 'ספרי על משהו מצחיק או מפתיע שקרה לך בטיול (passato prossimo + imperfetto).'],
  ['b5', 'כתבי מייל מנומס למזכירות האוניברסיטה: בקשה למידע על ההרשמה לרפואה (condizionale).'],
  ['b9', 'למה את רוצה ללמוד רפואה באיטליה? (penso che + congiuntivo, 8 משפטים)'],
  ['b10', 'מה היית עושה אילו היית שרת הבריאות ליום אחד? (se + congiuntivo imperfetto)'],
  ['b14', 'מאמר דעה (150 מילים): האם הלימודים באוניברסיטה צריכים להיות חינם? עם מילות קישור.'],
];

routes.write = {
  tab: 'today',
  render() {
    const avail = WRITE_PROMPTS.filter((p) => store.unitStarted(p[0]));
    const prompt = avail[(new Date().getDate()) % avail.length][1];
    view().innerHTML = `<header class="top"><a href="#today" class="back">→</a><h1>✍️ כתיבה יומית</h1></header>
    ${!ai.hasKey() ? noKeyCard('תיקון הכתיבה') : ''}
    <div class="card"><p class="muted small">המשימה של היום:</p><p class="big" id="wp">${esc(prompt)}</p>
      <button class="chip" id="other">משימה אחרת</button></div>
    <textarea id="wtext" class="accent-target big-input" lang="it" dir="ltr" rows="6" placeholder="Scrivi qui… (אל תדאגי מטעויות – בשביל זה יש תיקון)" autocorrect="off" spellcheck="false"></textarea>
    ${accentBar()}
    <div class="actions"><button class="btn big" id="wcheck">בדיקה ותיקון</button></div>
    <div id="wout"></div>`;
    let cur = prompt;
    $('#other').onclick = () => { cur = pick(avail)[1]; $('#wp').textContent = cur; };
    $('#wcheck').onclick = async () => {
      const text = $('#wtext').value.trim();
      if (text.length < 3) return toast('כתבי לפחות משפט אחד');
      if (!ai.hasKey()) return toast('צריך מפתח AI');
      const out = $('#wout'); out.innerHTML = spinner('בודקת…');
      try {
        const r = await ai.correctWriting(cur, text);
        store.bump('writing');
        (r.errors || []).forEach((c) => store.addCustom({ it: c.right, he: c.why_he, ex: r.corrected, src: 'mistake', raw: true, wrong: c.wrong, note: c.why_he }));
        enrichPending();
        out.innerHTML = `<div class="card">
          <p class="ok">👏 ${esc(r.praise_he)}</p>
          <h4>הטקסט המתוקן</h4><p class="it" dir="ltr">${tappable(r.corrected)} ${spk(r.corrected)}</p>
          ${r.errors?.length ? `<h4>הטעויות (${r.errors.length})</h4>${r.errors.map((c, j) => `<div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span> ${spk(c.right)}<div class="small">${esc(c.why_he)}</div><span class="chip ok">✓ נכנס לתרגול</span></div>`).join('')}` : '<p class="ok">אין טעויות! 🎉</p>'}
          <h4>🎯 הדבר הכי חשוב לשפר</h4><p>${esc(r.tip_he)}</p>
          <h4>✨ גרסה טבעית יותר</h4><p class="it" dir="ltr">${tappable(r.better_version)} ${spk(r.better_version)}</p>
          <p class="muted small">טיפ: קראי בקול את הגרסה הטבעית 2–3 פעמים.</p></div>`;
      } catch (e) { out.innerHTML = errBox(e); }
    };
  },
};

// ================= התקדמות =================
routes.more = {
  render() {
    const v = store.vocabSummary();
    const dsum = store.drillSummary();
    const days = [];
    for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push([d, store.S().stats[store.dayKey(d)] || {}]); }
    const max = Math.max(10, ...days.map(([, s]) => s.reviews || 0));
    const total = Object.values(store.S().stats).reduce((a, s) => ({ m: a.m + (s.seconds || 0), c: a.c + (s.chat || 0), e: a.e + (s.exam || 0) }), { m: 0, c: 0, e: 0 });
    const topics = UNITS.filter((u) => u.stage !== 'new' || store.mastery(u).seen > 0);
    const weak = store.weakTopics(4);
    view().innerHTML = `<header class="top"><h1>📊 ההתקדמות שלי</h1></header>
    ${countdownCard()}
    ${weekCard(store.weekPlan())}
    <div class="stats-row">
      <div class="stat"><b>🔥 ${store.streak()}</b><span>ימי רצף</span></div>
      <div class="stat"><b>${Math.round(total.m / 60)}</b><span>דקות באפליקציה</span></div>
      <div class="stat"><b>${total.c}</b><span>משפטים בשיחה</span></div>
    </div>
    <div class="stats-row">
      <div class="stat"><b>${v.seen}</b><span>מילים (${v.known} ⭐)</span></div>
      <div class="stat"><b>${dsum.seen}</b><span>תרגילים (${dsum.known} ⭐)</span></div>
      <div class="stat"><b>${total.e}</b><span>משימית מבחן</span></div>
    </div>
    <div class="card"><h3>🎓 תרגול למבחן – ממוצע 5 אחרונים</h3>
      ${Object.entries(ai.EXAM_SECTIONS).map(([k, s]) => { const a = store.examAvg(k); return `<a class="row-link" href="#ex/${k}"><span>${s.icon} ${s.he}</span><span class="${a == null ? 'muted' : a >= 55 ? 'ok' : 'warn-text'}">${a == null ? '—' : a + '%'}</span></a>`; }).join('')}
      <p class="small muted">כדי לעבור כל חלק צריך בערך 55% (11/20). המטרה: כל החמישה מעל 65% חודש לפני המבחן.</p></div>
    ${weak.length ? `<div class="card"><h3>🎯 נושאים חלשים כרגע</h3>${weak.map((u) => `<a class="row-link" href="#unit/${u.id}">${esc(u.he)}</a>`).join('')}</div>` : ''}
    <div class="card"><h3>שליטה לפי נושא</h3>${topics.map((u) => { const m = store.mastery(u); return `<a class="row-link" href="#unit/${u.id}"><span class="small">${esc(u.he)}</span><span class="mini-track"><i style="width:${m.pct}%"></i></span></a>`; }).join('')}</div>
    <div class="card"><h3>14 הימים האחרונים</h3>
      <div class="bars">${days.map(([d, s]) => `<div class="bar ${store.activeDay(s) ? 'act' : ''}" title="${s.reviews || 0}"><i style="height:${Math.round(((s.reviews || 0) / max) * 100)}%"></i><small>${d.getDate()}</small></div>`).join('')}</div>
    </div>
    <div class="menu">
      <a href="#suzy">📒 הוספת נושאים ומילים מהקורס</a>
      <a href="#words">📝 המילים שלי</a>
      <a href="#stories">🎧 סיפורים</a>
      <a href="#resources">📺 מה להאזין ולראות באיטלקית?</a>
      <a href="#write">✍️ כתיבה חופשית עם תיקון</a>
      <a href="#diag" id="rediag">🔎 מבחן אבחון ${store.S().diag ? 'חוזר' : ''}</a>
      <a href="#settings">⚙️ הגדרות ומפתח AI</a>
      <a href="#help">❓ מדריך ושיטת הלימוד</a>
    </div>`;
    $('#rediag').onclick = () => { diag = null; };
  },
};

routes.words = {
  tab: 'more',
  render() {
    const custom = store.S().custom.slice().reverse();
    view().innerHTML = `<header class="top"><a href="#more" class="back">→</a><h1>📝 המילים שלי</h1></header>
    <div class="card"><h3>✨ מילים לפי נושא שמעניין אותך</h3>
      <p class="muted small">מילים שקשורות לחיים שלך נזכרות טוב יותר. כתבי נושא (רפואה, תחביב, טיול…) והמורה תבחר את 10 המילים השימישיות ביותר.</p>
      <div class="inp-row"><input id="wt" placeholder="למשל: בישול, כדורגל, הייטק, טיול לטוסקנה"><button class="btn" id="wgen">צרי</button></div>
      <div id="wgout"></div></div>
    <div class="card"><h3>➕ הוספה ידנית</h3>
      <input id="mit" lang="it" dir="ltr" placeholder="איטלקית" class="accent-target">
      <input id="mhe" placeholder="עברית">
      <button class="btn" id="madd">הוסיפי</button></div>
    <div class="card"><h3>חיפוש בכל המילים</h3><input id="srch" placeholder="חפשי באיטלקית או בעברית"><div id="sres"></div></div>
    ${custom.length ? `<div class="card"><h3>מילים שהוספתי (${custom.length})</h3>${custom.map((c) => `<div class="word-row"><div><span class="it">${esc(c.it)}</span><div class="he small">${esc(c.he)}</div></div>${spk(c.it)}<button class="icon-btn" data-del="${c.id}" aria-label="מחק">🗑</button></div>`).join('')}</div>` : ''}`;
    $('#wgen').onclick = async () => {
      const t = $('#wt').value.trim(); if (!t) return;
      const out = $('#wgout');
      if (!ai.hasKey()) { out.innerHTML = noKeyCard('יצירת מילים'); return; }
      out.innerHTML = spinner();
      try {
        const items = await ai.generateWords(t, 10);
        out.innerHTML = `${items.map((x, i) => `<label class="gen-row"><input type="checkbox" checked data-gi="${i}"><div><span class="it">${esc(x.it)}</span> – ${esc(x.he)}<div class="small muted it" dir="ltr">${esc(x.ex)}</div></div></label>`).join('')}
          <button class="btn" id="gadd">הוסף את המסומנות לתרגול</button>`;
        $('#gadd').onclick = () => {
          let n = 0;
          out.querySelectorAll('[data-gi]').forEach((cb) => { if (cb.checked) { store.addCustom({ ...items[+cb.dataset.gi], src: 'topic' }); n++; } });
          toast(`נוספו ${n} מילים – יופיעו בתרגול הבא`); routes.words.render();
        };
      } catch (e) { out.innerHTML = errBox(e); }
    };
    $('#madd').onclick = () => {
      const id = store.addCustom({ it: $('#mit').value, he: $('#mhe').value, src: 'manual' });
      if (id) { toast('נוסף!'); routes.words.render(); } else toast('מלאי את שני השדות');
    };
    $('#srch').oninput = () => {
      const q = $('#srch').value.trim().toLowerCase();
      if (q.length < 2) { $('#sres').innerHTML = ''; return; }
      const res = [...store.allItems().values()].filter((x) => x.it.toLowerCase().includes(q) || x.he.includes(q)).slice(0, 20);
      $('#sres').innerHTML = res.map((x) => {
        const c = store.card(x.id);
        return `<div class="word-row"><div><span class="it">${esc(x.it)}</span> ${isKnown(c) ? '⭐' : isSeen(c) ? '✓' : ''}<div class="he small">${esc(x.he)}</div></div>${spk(x.it)}</div>`;
      }).join('') || '<p class="muted">לא נמצא</p>';
    };
    view().querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => { if (confirm('למחוק את המילה?')) { store.removeCustom(b.dataset.del); routes.words.render(); } }; });
  },
};

routes.settings = {
  tab: 'more',
  render() {
    const s = set();
    const vs = italianVoices();
    const u = store.S().usage;
    view().innerHTML = `<header class="top"><a href="#more" class="back">→</a><h1>⚙️ הגדרות</h1></header>
    <div class="card"><h3>🔑 מורה AI (Claude)</h3>
      <p class="small muted">המפתח נשמר רק בטלפון הזה ונשלח רק ל-Anthropic. הוראות קבלת מפתח: <a href="#help">במדריך</a>.</p>
      <input id="key" type="password" dir="ltr" placeholder="sk-ant-…" value="${esc(s.apiKey)}" autocomplete="off">
      <div class="actions"><button class="btn ghost" id="showkey">הצג</button><button class="btn" id="savekey">שמירה ובדיקה</button></div>
      <div id="keyres"></div>
      <label class="lbl">מודל</label>
      <select id="model">${Object.entries(ai.MODELS).map(([id, m]) => `<option value="${id}" ${s.model === id ? 'selected' : ''}>${m.name}</option>`).join('')}</select>
      <p class="small muted">שימיש עד עכשיו: ${(u.inTok / 1000).toFixed(1)}K טוקנים נכנסים, ${(u.outTok / 1000).toFixed(1)}K יוצאים ≈ <b>$${u.usd.toFixed(3)}</b></p>
    </div>
    <div class="card"><h3>🎓 המבחן</h3>
      <label class="lbl">שם המבחן</label><input id="exname" value="${esc(s.examName)}">
      <label class="lbl">תאריך המבחן</label><input id="exdate" type="date" value="${esc(s.examDate)}">
      <p class="small muted">כשיהיה תאריך רשמי – עדכני אותו כאן. הספירה לאחור והתוכנית השבועית מתעדכנות לפיו.</p>
      <label class="lbl">שעות שבועיות בקורס בסוזי אקדמי</label><input id="chours" type="number" min="0" max="40" value="${s.courseHours}">
    </div>
    <div class="card"><h3>🧠 תרגול יומי</h3>
      <label class="lbl">זמן ביום באפליקציה</label>
      <select id="dgoal">${[10, 15, 20, 30, 45, 60].map((m) => `<option value="${m}" ${s.dailyGoal === m ? 'selected' : ''}>${m} דק'</option>`).join('')}</select>
      <label class="lbl">מילים חדשות ביום: <b id="npdv">${s.newPerDay}</b></label>
      <input type="range" id="npd" min="0" max="30" step="1" value="${s.newPerDay}">
      <label class="lbl">תרגילים חדשים ביום: <b id="dpdv">${s.drillsPerDay}</b></label>
      <input type="range" id="dpd" min="0" max="30" step="1" value="${s.drillsPerDay}">
      <p class="small muted">כל פריט חדש ≈ 6–8 חזרות בחודש הראשון. 8+8 ביום מתאים ל-15–20 דקות.</p>
      <label class="lbl">רמת זכירה רצויה: <b id="retv">${Math.round(s.retention * 100)}%</b></label>
      <input type="range" id="ret" min="80" max="95" step="1" value="${Math.round(s.retention * 100)}">
      <p class="small muted">90% מומלץ. גבוה יותר = יותר חזרות ביום.</p>
      ${s.focusUnit ? `<p class="small">🎯 נושא בפוקוס: ${esc(store.unitById(s.focusUnit)?.he || '')} <button class="chip" id="unfocus">בטלי</button></p>` : ''}
    </div>
    <div class="card"><h3>🔊 קול</h3>
      ${ttsAvailable() ? `
      <label class="lbl">קול איטלקי</label>
      <select id="voice"><option value="">אוטומטי</option>${vs.map((v) => `<option ${s.voice === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>
      ${!vs.length ? '<p class="small warn-text">לא נמצא קול איטלקי במכשיר. במדריך מוסבר איך להוריד אחד (חינם).</p>' : ''}
      <label class="lbl">מהירות דיבור: <b id="ratev">${s.rate}</b></label>
      <input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${s.rate}">
      <button class="btn ghost" data-say="Ciao Naama! Come stai? Benvenuta nella tua app di italiano.">בדיקת קול</button>` : '<p>הדפדפן לא תומך בהקראה.</p>'}
      <label class="check"><input type="checkbox" id="autoplay" ${s.autoplay ? 'checked' : ''}> השמעה אוטומטית בתרגול</label>
      <label class="check"><input type="checkbox" id="showtr" ${s.showTranslation ? 'checked' : ''}> להציג תרגום בשיחה מראש</label>
      <p class="small muted">זיהוי דיבור: ${sttAvailable() ? '✓ זמין' : '✗ לא זמין בדפדפן הזה (אפשר להקליד, או להשתמש בהכתבה של המקלדת)'}</p>
    </div>
    <div class="card"><h3>⏰ תזכורת יומית</h3>
      <p class="small muted">מוסיף אירוע חוזר ליומן הטלפון עם התראה.</p>
      <div class="inp-row"><input type="time" id="remt" value="${s.reminder}"><button class="btn" id="ics">הוסיפי ליומן</button></div>
    </div>
    <div class="card"><h3>💾 גיבוי</h3>
      <p class="small muted">ההתקדמות נשמרת בטלפון. מומלץ לגבות פעם בחודש (או לפני החלפת טלפון).</p>
      <div class="actions"><button class="btn ghost" id="exp">שמירת קובץ גיבוי</button><label class="btn ghost">טעינת גיבוי<input type="file" id="imp" accept=".json,application/json" hidden></label></div>
      <button class="btn danger ghost" id="reset">איפוס מלא</button>
    </div>`;
    $('#showkey').onclick = () => { const k = $('#key'); k.type = k.type === 'password' ? 'text' : 'password'; };
    $('#savekey').onclick = async () => {
      store.setSetting('apiKey', $('#key').value.trim());
      const out = $('#keyres');
      if (!set().apiKey) { out.innerHTML = '<p class="muted">המפתח נמחק.</p>'; return; }
      out.innerHTML = spinner('בודקת…');
      try { const r = await ai.testKey(); out.innerHTML = `<p class="ok">✓ עובד! המורה אומרת: <span class="it">${esc(r.msg)}</span></p>`; } catch (e) { out.innerHTML = errBox(e); }
    };
    $('#model').onchange = (e) => store.setSetting('model', e.target.value);
    $('#exname').onchange = (e) => store.setSetting('examName', e.target.value.trim() || 'CILS B2 / CELI 3');
    $('#exdate').onchange = (e) => { if (e.target.value) { store.setSetting('examDate', e.target.value); store.S().week = null; store.save(); toast('התאריך עודכן'); } };
    $('#chours').onchange = (e) => store.setSetting('courseHours', Math.max(0, +e.target.value || 0));
    $('#dgoal').onchange = (e) => store.setSetting('dailyGoal', +e.target.value);
    $('#npd').oninput = (e) => { $('#npdv').textContent = e.target.value; store.setSetting('newPerDay', +e.target.value); };
    $('#dpd').oninput = (e) => { $('#dpdv').textContent = e.target.value; store.setSetting('drillsPerDay', +e.target.value); };
    $('#ret').oninput = (e) => { $('#retv').textContent = e.target.value + '%'; store.setSetting('retention', +e.target.value / 100); };
    const uf = $('#unfocus'); if (uf) uf.onclick = () => { store.setSetting('focusUnit', ''); routes.settings.render(); };
    const vSel = $('#voice'); if (vSel) vSel.onchange = (e) => { store.setSetting('voice', e.target.value); speak('Ciao, come stai?'); };
    const r = $('#rate'); if (r) r.oninput = (e) => { $('#ratev').textContent = e.target.value; store.setSetting('rate', +e.target.value); };
    $('#autoplay').onchange = (e) => store.setSetting('autoplay', e.target.checked);
    $('#showtr').onchange = (e) => store.setSetting('showTranslation', e.target.checked);
    $('#ics').onclick = () => { store.setSetting('reminder', $('#remt').value || '20:00'); downloadICS(set().reminder); };
    $('#exp').onclick = () => download(`naama-italiano-backup-${store.dayKey()}.json`, store.exportJSON(), 'application/json');
    $('#imp').onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { store.importJSON(await f.text()); toast('הגיבוי נטען ✓'); go('#today'); } catch { toast('הקובץ לא תקין'); }
    };
    $('#reset').onclick = () => {
      if (confirm('למחוק את כל ההתקדמות? (מומלץ לגבות קודם)') && confirm('בטוחה? אין דרך חזרה.')) { store.resetAll(); localStorage.removeItem(STORIES_KEY); go('#today'); }
    };
  },
};

function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function downloadICS(time) {
  const [hh, mm] = time.split(':');
  const d = new Date(); d.setDate(d.getDate() + 1);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const url = location.href.split('#')[0];
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Italiano//HE', 'BEGIN:VEVENT',
    `UID:italiano-daily-${Date.now()}@app`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${ymd}T${hh}${mm}00`, `DURATION:PT20M`, 'RRULE:FREQ=DAILY',
    'SUMMARY:🇮🇹 איטלקית – 15 דקות', `DESCRIPTION:תרגול יומי + שיחה קצרה. ${url}`, `URL:${url}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:זמן לאיטלקית!', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  download('italiano-reminder.ics', ics, 'text/calendar');
  toast('פתחי את הקובץ כדי להוסיף ליומן');
}

routes.resources = {
  tab: 'today',
  async render() {
    view().innerHTML = `<header class="top"><a href="#today" class="back">→</a><h1>📺 האזנה וצפייה</h1></header><div class="card help" id="resc">${spinner('טוען…')}</div>`;
    try { $('#resc').innerHTML = await (await fetch('resources.html')).text(); } catch { $('#resc').innerHTML = '<p>לא זמין במצב לא מקוון.</p>'; }
  },
};

routes.help = {
  tab: 'more',
  async render() {
    view().innerHTML = `<header class="top"><a href="#more" class="back">→</a><h1>❓ מדריך</h1></header><div class="card help" id="helpc">${spinner('טוען…')}</div>`;
    try {
      const r = await fetch('help.html');
      $('#helpc').innerHTML = await r.text();
    } catch { $('#helpc').innerHTML = '<p>המדריך לא זמין כרגע במצב לא מקוון.</p>'; }
  },
};

// ================= הכנה למבחן: CILS B2 / CELI 3 =================
let exam = null; // המשימה הנוכחית בזיכרון, כדי שלא תאבד במעבר בין מסכים
const examTarget = () => store.S().examTarget || (ai.levelInfo().idx >= 4 ? 'B2' : 'bridge');

routes.exam = {
  render() {
    const tgt = examTarget();
    view().innerHTML = `<header class="top"><h1>🎓 הכנה למבחן</h1></header>
    ${countdownCard()}
    <div class="card"><h3>מה יש במבחן?</h3>
      <p class="small">גם <b>CILS DUE-B2</b> (אוניברסיטת סיינה) וגם <b>CELI 3</b> (פרוג'ה) בודקים חמש מיומנויות: <b>האזנה, קריאה, מבנים לשוניים (דקדוק בהקשר), כתיבה ודיבור</b>. ב-CILS צריך לעבור <b>כל חלק בנפרד</b> (בערך 11 מתוך 20) – לכן מתרגלים את כולם, לא רק את מה שקל.</p>
      <p class="small muted">💡 הפורמט כאן מבוסס על המבנה הכללי של המבחנים. כדאי להוריד מבחני דוגמה מהאתרים הרשמיים (unistrasi.it ל-CILS, cvcl.it ל-CELI) ולעבור עליהם עם המורה בקורס.</p></div>
    <div class="seg" id="tgt"><button data-t="bridge" class="${tgt === 'bridge' ? 'on' : ''}">🪜 רמת גישור (קצת מעלייך)</button><button data-t="B2" class="${tgt === 'B2' ? 'on' : ''}">🎯 רמת מבחן B2</button></div>
    ${!ai.hasKey() ? noKeyCard('התרגול למבחן') : ''}
    <div class="scen-list">${Object.entries(ai.EXAM_SECTIONS).map(([k, s]) => { const a = store.examAvg(k); return `
      <a class="scen" href="#ex/${k}"><span class="emoji">${s.icon}</span><div><b>${s.he}</b><small class="it">${s.it}</small>
      <small class="muted">כ-${s.min} דק' · ${a == null ? 'עוד לא תרגלת' : `ממוצע אחרון: ${a}%`}</small></div></a>`; }).join('')}</div>
    <p class="small muted">ההמלצה: עד ינואר ברמת גישור (המשימית קצרית וקלות יותר, אותו פורמט). מפברואר – ברמת B2 אמיתית, ובשבועיים האחרונים חלק אחד כל יום.</p>`;
    $('#tgt').onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      store.S().examTarget = b.dataset.t; store.save(); routes.exam.render();
    };
  },
};

routes.ex = {
  tab: 'exam',
  async render(sec) {
    const S_ = ai.EXAM_SECTIONS[sec];
    if (!S_) return go('#exam');
    const head = `<header class="top"><a href="#exam" class="back">→</a><div><h1>${S_.icon} ${S_.he}</h1><div class="it muted">${S_.it}</div></div></header>`;
    if (!ai.hasKey()) { view().innerHTML = head + noKeyCard('התרגול למבחן'); return; }
    if (!exam || exam.sec !== sec || exam.done) {
      view().innerHTML = head + spinner('מכינה משימה בפורמט המבחן… (כ-30 שניות)');
      try {
        const target = examTarget();
        exam = { sec, target, task: await ai.examTask(sec, target), done: false };
      } catch (e) { view().innerHTML = head + errBox(e) + '<a class="btn ghost" href="#exam">חזרה</a>'; return; }
      if (location.hash !== `#ex/${sec}`) return;
    }
    const tl = exam.target === 'B2' ? 'רמת B2' : 'רמת גישור';
    if (sec === 'ascolto' || sec === 'lettura') return renderComp(head, tl);
    if (sec === 'strutture') return renderStruct(head, tl);
    return renderProduction(head, tl);
  },
};

const newTaskBtn = () => '<button class="btn ghost" id="newtask">משימה חדשה</button>';
function bindNewTask() { const b = $('#newtask'); if (b) b.onclick = () => { exam = null; routes.ex.render(location.hash.split('/')[1]); }; }

function renderComp(head, tl) {
  const t = exam.task, listen_ = exam.sec === 'ascolto';
  const paras = t.text.split(/\n+/).filter((x) => x.trim());
  view().innerHTML = `${head}
    <p class="small muted">${tl} · ${esc(t.kind_he)}${listen_ ? ' · במבחן שומעים כל קטע פעמיים. קראי קודם את השאלית, ואז הקשיבי.' : ''}</p>
    <h3 class="it" dir="ltr">${esc(t.title)}</h3>
    ${listen_ ? `<div class="player"><button class="btn" id="play">▶ השמעה</button><div class="seg small" id="spd"><button data-r="0.8">איטי</button><button data-r="0.95" class="on">רגיל</button></div><span class="small muted" id="plays">0/2</span></div>` : ''}
    <div class="story ${listen_ ? 'hidden-text' : ''}" id="txt">${paras.map((p) => `<p class="it" dir="ltr">${tappable(p)}</p>`).join('')}</div>
    ${listen_ ? '<button class="chip" id="reveal">הצגת הטקסט (אחרי שענית)</button>' : ''}
    <div class="card">${t.questions.map((q, qi) => `<div class="q"><p class="it" dir="ltr"><b>${qi + 1}.</b> ${esc(q.q)}</p>
      <div class="options">${q.options.map((o, oi) => `<button class="opt it" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join('')}</div><div class="small muted why" id="why${qi}" hidden>${esc(q.why_he)}</div></div>`).join('')}</div>
    <div class="actions"><button class="btn big" id="submit">סיום ובדיקה</button></div><div id="res"></div>`;
  const ans = {};
  view().querySelectorAll('[data-q]').forEach((b) => {
    b.onclick = () => {
      if (exam.done) return;
      const qi = +b.dataset.q; ans[qi] = +b.dataset.o;
      b.parentElement.querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b));
    };
  });
  if (listen_) {
    let rate = 0.95, plays = 0, playing = false;
    $('#spd').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; rate = +b.dataset.r; $('#spd').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); };
    // דיאלוג: "Nome: טקסט" – משמיעים רק את הטקסט
    const lines = paras.map((p) => p.replace(/^[A-ZÀ-Ý][\wÀ-ÿ'. ]{0,25}:\s*/, ''));
    $('#play').onclick = () => {
      if (playing) { playing = false; stopSpeaking(); $('#play').textContent = '▶ השמעה'; return; }
      playing = true; $('#play').textContent = '⏸ עצירה';
      const step = (i) => {
        if (!playing) return;
        if (i >= lines.length) { playing = false; plays++; $('#plays').textContent = `${plays}/2`; $('#play').textContent = '▶ השמעה'; return; }
        speak(lines[i], { rate, onend: () => setTimeout(() => step(i + 1), 450) });
      };
      step(0);
    };
    $('#reveal').onclick = () => $('#txt').classList.toggle('hidden-text');
  }
  $('#submit').onclick = () => {
    if (exam.done) return;
    if (Object.keys(ans).length < t.questions.length && !confirm('לא ענית על כל השאלית. לסיים בכל זאת?')) return;
    exam.done = true; stopSpeaking();
    let ok = 0;
    t.questions.forEach((q, qi) => {
      const btns = view().querySelectorAll(`[data-q="${qi}"]`);
      btns.forEach((b, oi) => { b.disabled = true; if (oi === q.answer) b.classList.add('right'); else if (oi === ans[qi]) b.classList.add('wrong'); });
      if (ans[qi] === q.answer) ok++;
      $('#why' + qi).hidden = false;
    });
    store.addExamResult(exam.sec, ok, t.questions.length);
    if (listen_) $('#txt').classList.remove('hidden-text');
    $('#res').innerHTML = `<div class="card center"><div class="huge">${ok}/${t.questions.length}</div><p>${scoreMsg(ok / t.questions.length)}</p>
      <p class="small muted">${listen_ ? 'עכשיו הקשיבי שוב עם הטקסט מול העיניים, ולחצי על מילים לא מוכרות – הן ייכנסי לתרגול.' : 'לחצי על מילים לא מוכרות בטקסט – הן ייכנסי לתרגול.'}</p>
      <div class="actions">${newTaskBtn()}<a class="btn" href="#exam">סיום</a></div></div>`;
    bindNewTask();
    $('#res').scrollIntoView({ behavior: 'smooth' });
  };
}
const scoreMsg = (r) => (r >= 0.8 ? '💪 מצוין – ברמה הזו את עוברת בביטחון.' : r >= 0.55 ? '👍 עובר. עכשיו לחדד את מה שפספסת.' : 'עוד לא עובר – וזה בדיוק בשביל זה מתרגלים. קראי את ההסברים.');

function renderStruct(head, tl) {
  const t = exam.task;
  const html = esc(t.text).replace(/\[(\d+)\]/g, (m, n) => {
    const g = t.gaps[+n - 1]; if (!g) return m;
    return `<select class="gap" data-g="${+n - 1}" dir="ltr"><option value="">(${n})</option>${g.options.map((o, oi) => `<option value="${oi}">${esc(o)}</option>`).join('')}</select>`;
  });
  view().innerHTML = `${head}<p class="small muted">${tl} · בחרי את המילה המתאימה לכל רווח.</p>
    <h3 class="it" dir="ltr">${esc(t.title)}</h3>
    <div class="card it struct" dir="ltr">${html.replace(/\n+/g, '<br><br>')}</div>
    <div class="actions"><button class="btn big" id="submit">בדיקה</button></div><div id="res"></div>`;
  $('#submit').onclick = () => {
    if (exam.done) return;
    exam.done = true;
    let ok = 0; const fb = [];
    view().querySelectorAll('.gap').forEach((s) => {
      const g = t.gaps[+s.dataset.g]; const right = s.value !== '' && +s.value === g.answer;
      s.disabled = true; s.classList.add(right ? 'right' : 'wrong');
      if (right) ok++;
      else fb.push(`<div class="corr-item"><b>(${+s.dataset.g + 1})</b> ${s.value !== '' ? `<span class="it strike">${esc(g.options[+s.value])}</span> → ` : ''}<span class="it fix">${esc(g.options[g.answer])}</span><div class="small">${esc(g.rule_he)}</div></div>`);
    });
    store.addExamResult('strutture', ok, t.gaps.length);
    $('#res').innerHTML = `<div class="card"><div class="center"><div class="huge">${ok}/${t.gaps.length}</div><p>${scoreMsg(ok / t.gaps.length)}</p></div>${fb.join('')}
      <div class="actions">${newTaskBtn()}<a class="btn" href="#exam">סיום</a></div></div>`;
    bindNewTask();
  };
}

function renderProduction(head, tl) {
  const t = exam.task, oral = exam.sec === 'orale';
  view().innerHTML = `${head}<p class="small muted">${tl} · ${oral ? 'במבחן: כמה דקות הכנה ואז מונולוג. דברי בקול (🎙️) – אפשר בכמה חלקים – או הקלידי.' : 'במבחן כותבים ביד ובלי מילון. נסי גם כאן בלי עזרה.'}</p>
    <div class="card"><p class="it" dir="ltr"><b>${esc(t.task_it)}</b></p>
      ${(t.points || []).length ? `<ul class="it" dir="ltr">${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      <p class="small"><b>${esc(t.length)}</b> <button class="chip" id="trt">תרגום המשימה</button></p>
      <p class="he small" id="the" hidden>${esc(t.task_he)}</p></div>
    <textarea id="ptext" class="accent-target big-input" lang="it" dir="ltr" rows="${oral ? 6 : 9}" placeholder="${oral ? 'מה שתגידי יופיע כאן…' : 'Scrivi qui…'}" autocorrect="off" spellcheck="false">${esc(exam.draft || '')}</textarea>
    ${accentBar()}
    <div class="row-between"><span class="small muted" id="wc">0 מילים</span>${oral && sttAvailable() ? '<button class="btn mic" id="pmic">🎙️ דברי</button>' : ''}</div>
    <div class="actions"><button class="btn big" id="submit">${oral ? 'הערכה' : 'בדיקה וציון'}</button></div><div id="res"></div>`;
  const ta = $('#ptext');
  const wc = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; $('#wc').textContent = `${n} מילים`; exam.draft = ta.value; };
  ta.oninput = wc; wc();
  $('#trt').onclick = () => { $('#the').hidden = !$('#the').hidden; };
  const m = $('#pmic');
  if (m) m.onclick = async () => {
    if (m.classList.contains('rec')) { listen.stop?.(); return; }
    m.classList.add('rec'); m.textContent = '🎙️ מקשיבה…';
    const before = ta.value ? ta.value.trim() + ' ' : '';
    try { const r = await listen({ onInterim: (x) => { ta.value = before + x; } }); ta.value = before + (r || ''); } catch { toast('המיקרופון לא זמין – אפשר להקליד'); }
    m.classList.remove('rec'); m.textContent = '🎙️ להמשיך לדבר'; wc();
  };
  $('#submit').onclick = async () => {
    const text = ta.value.trim();
    if (text.split(/\s+/).length < 15) return toast(oral ? 'דברי עוד קצת (לפחות כמה משפטים)' : 'כתבי לפחות כמה משפטים');
    const out = $('#res'); out.innerHTML = spinner('בודקת לפי קריטריוני המבחן…');
    $('#submit').disabled = true;
    try {
      const r = await ai.gradeExam(exam.sec, t, text, exam.target);
      exam.done = true; exam.draft = '';
      const score = Math.max(0, Math.min(20, r.score));
      store.addExamResult(exam.sec, score, 20);
      (r.errors || []).forEach((c) => store.addCustom({ it: c.right, he: c.why_he, ex: text.split(/(?<=[.!?])\s+/).find((x) => x.includes(c.wrong)) || '', src: 'mistake', raw: true, wrong: c.wrong, note: c.why_he }));
      enrichPending();
      out.innerHTML = `<div class="card">
        <div class="center"><div class="huge">${score}/20</div><p>${score >= 11 ? '✓ עובר' : '✗ עוד לא עובר'} (סף מעבר משוער: 11/20)</p></div>
        ${(r.criteria || []).map((c) => `<div class="row-between"><span>${esc(c.name_he)}</span><b>${c.score}/5</b></div><p class="small muted">${esc(c.comment_he)}</p>`).join('')}
        <p class="ok">👍 ${esc(r.strengths_he)}</p><p>🎯 ${esc(r.improve_he)}</p>
        ${r.errors?.length ? `<h4>טעויות (נכנסי לתרגול)</h4>${r.errors.map((c) => `<div class="corr-item"><span class="it strike">${esc(c.wrong)}</span> → <span class="it fix">${esc(c.right)}</span> ${spk(c.right)}<div class="small">${esc(c.why_he)}</div></div>`).join('')}` : ''}
        <h4>✨ תשובה לדוגמה</h4><p class="it" dir="ltr">${tappable(r.model_answer)} ${spk(r.model_answer)}</p>
        <div class="actions">${newTaskBtn()}<a class="btn" href="#exam">סיום</a></div></div>`;
      bindNewTask();
    } catch (e) { out.innerHTML = errBox(e); $('#submit').disabled = false; }
  };
}

// ================= מדידת זמן למידה =================
let lastAct = Date.now();
['click', 'keydown', 'touchstart'].forEach((ev) => document.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true }));
setInterval(() => {
  const r = document.body.dataset.route;
  const learning = ['practice', 'chat', 'story', 'write', 'unit', 'topic', 'diag', 'ex', 'suzy', 'stories'].includes(r);
  if (learning && document.visibilityState === 'visible' && Date.now() - lastAct < 90000) store.bump('seconds', 15);
}, 15000);

// ================= הפעלה =================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => { /* ignore */ });
}
// סיפורים שנשמרו לפני שהיה מאגר משפטים – מכניסים אותם פעם אחת
if (!store.ctxLines().length) {
  loadStories().slice().reverse().forEach((st) => store.addContext((st.sentences || []).map((x) => ({ it: x.it, he: x.he, src: 'story' }))));
}
render();
