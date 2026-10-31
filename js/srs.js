// FSRS-4.5 – אלגוריתם החזרה המרווחת המדויק ביותר שנבדק (open-spaced-repetition benchmark).
// מחשב לכל כרטיס "יציבות" (S, בימים) ו"קושי" (D, 1–10) ומתזמן את החזרה הבאה
// לרגע שבו הסיכוי לזכור יורד לרמת היעד (ברירת מחדל 90%).

const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474,
  0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const DECAY = -0.5;
const FACTOR = 19 / 81;
const DAY = 86400000;

export const Rating = { Again: 1, Hard: 2, Good: 3, Easy: 4 };

const clampD = (d) => Math.min(10, Math.max(1, d));
const initD = (g) => clampD(W[4] - (g - 3) * W[5]);

export function retrievability(card, now = Date.now()) {
  if (!card || !card.s || !card.last) return 0;
  const t = Math.max(0, (now - card.last) / DAY);
  return Math.pow(1 + FACTOR * t / card.s, DECAY);
}

function intervalDays(s, retention) {
  const ivl = (s / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return Math.min(3650, Math.max(1, Math.round(ivl)));
}

export function newCard(id, now = Date.now()) {
  return { id, state: 'new', s: 0, d: 0, reps: 0, lapses: 0, last: 0, due: now, added: now };
}

// מחזיר עותק מעודכן של הכרטיס אחרי דירוג g (1–4)
export function review(card, g, now = Date.now(), retention = 0.9) {
  const c = { ...card };
  if (c.state === 'new' || !c.s) {
    c.s = W[g - 1];
    c.d = initD(g);
  } else {
    const t = Math.max(0, (now - c.last) / DAY);
    const r = Math.pow(1 + FACTOR * t / c.s, DECAY);
    const dNext = c.d - W[6] * (g - 3);
    c.d = clampD(W[7] * initD(3) + (1 - W[7]) * dNext);
    if (g === 1) {
      const sf = W[11] * Math.pow(c.d, -W[12]) * (Math.pow(c.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
      c.s = Math.max(0.1, Math.min(sf, c.s));
      c.lapses++;
    } else if (t < 0.5) {
      // חזרה באותו יום (בתוך השיעור) – חיזוק קטן בלבד, לא קפיצה גדולה
      c.s = c.s * (g >= 3 ? 1.1 : 1);
    } else {
      const hard = g === 2 ? W[15] : 1;
      const easy = g === 4 ? W[16] : 1;
      c.s = c.s * (Math.exp(W[8]) * (11 - c.d) * Math.pow(c.s, -W[9]) *
        (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1);
    }
  }
  c.reps++;
  c.last = now;
  if (g === 1) {
    c.state = 'learning';
    c.due = now + 10 * 60000;
  } else {
    c.state = 'review';
    // "ערפול" קטן כדי שכרטיסים לא יתקבצו לאותו יום
    const base = intervalDays(c.s, retention);
    const fuzz = base > 3 ? Math.round(base * (Math.random() * 0.1 - 0.05)) : 0;
    c.due = startOfDay(now) + (base + fuzz) * DAY + 4 * 3600000;
  }
  return c;
}

export function startOfDay(t = Date.now()) {
  const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime();
}

export function isDue(card, now = Date.now()) {
  return card.state !== 'new' && card.due <= now;
}

// מילה נחשבת "יודע" כשהיציבות שלה ≥ 7 ימים
export const isKnown = (card) => card && card.state === 'review' && card.s >= 7;
export const isSeen = (card) => card && card.state !== 'new';
