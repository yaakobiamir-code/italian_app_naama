// שכבת ה-AI: קריאה ישירה מהדפדפן ל-Claude API עם המפתח של המשתמש (נשמר רק במכשיר).
// ברירת המחדל Claude Haiku 5.5 – הזול ביותר ($0.10 / $0.50 למיליון טוקנים): שימוש יומי ≈ סנטים בחודש.
import Anthropic from '../vendor/anthropic-sdk-1.3.0.js';
import { S, settings, addUsage, learnedWordList, vocabSummary, weakItems, weakTopics, reachedIndex, currentUnit, weekPlan, unitById, daysToExam } from './store.js';
import { UNITS } from './data.js';

export const MODELS = {
  'claude-haiku-5-5': { name: 'Claude Haiku 5.5 (מומלץ – זול מאוד)', in: 0.10, out: 0.50, effort: 'low' },
  'claude-sonnet-5-5': { name: 'Claude Sonnet 5.5 (איכות גבוהה, פי 20 יקר)', in: 2, out: 10, effort: 'low' },
  'claude-opus-5-5': { name: 'Claude Opus 5.5 (הכי חכם, פי 40 יקר)', in: 4, out: 20, effort: 'low' },
};

export const hasKey = () => !!settings().apiKey;

let client = null, clientKey = '';
function getClient() {
  const key = settings().apiKey;
  if (!key) throw new AIError('nokey', 'צריך להגדיר מפתח API בהגדרות כדי להשתמש במורה ה-AI.');
  if (!client || clientKey !== key) {
    client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2, timeout: 90000 });
    clientKey = key;
  }
  return client;
}

export class AIError extends Error {
  constructor(code, msg) { super(msg); this.code = code; }
}

function friendlyError(e) {
  if (e instanceof AIError) return e;
  if (e instanceof Anthropic.AuthenticationError) return new AIError('auth', 'המפתח לא תקין. בדקו אותו בהגדרות.');
  if (e instanceof Anthropic.PermissionDeniedError) return new AIError('perm', 'למפתח אין הרשאה. בדקו את החשבון ב-console.anthropic.com.');
  if (e instanceof Anthropic.RateLimitError) return new AIError('rate', 'יותר מדי בקשות כרגע. נסו שוב בעוד דקה.');
  if (e instanceof Anthropic.BadRequestError) {
    const m = String(e.message || '');
    if (/credit|balance|billing/i.test(m)) return new AIError('credit', 'נגמרה היתרה בחשבון ה-API. הטעינו קרדיט ב-console.anthropic.com.');
    return new AIError('bad', 'הבקשה נדחתה: ' + m.slice(0, 160));
  }
  if (e instanceof Anthropic.APIConnectionError) return new AIError('net', 'אין חיבור לאינטרנט (או שהשרת לא זמין).');
  if (e instanceof Anthropic.APIError) return new AIError('api', 'שגיאת שרת. נסו שוב. (' + (e.status || '') + ')');
  return new AIError('unknown', 'משהו השתבש: ' + (e?.message || e));
}

function track(usage, model) {
  if (!usage) return;
  const p = MODELS[model] || MODELS['claude-haiku-5-5'];
  const inTok = (usage.input_tokens || 0) + (usage.cache_read_input_tokens || 0) + (usage.cache_creation_input_tokens || 0);
  const usd = (inTok * p.in + (usage.output_tokens || 0) * p.out) / 1e6;
  addUsage(inTok, usage.output_tokens || 0, usd);
}

function extractJSON(text) {
  try { return JSON.parse(text); } catch { /* fallthrough */ }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(text.slice(a, b + 1));
  throw new AIError('parse', 'התשובה מה-AI לא הייתה בפורמט הצפוי. נסו שוב.');
}

let structuredSupported = true;

// קריאה כללית שמחזירה JSON לפי סכמה (structured outputs), עם נסיגה לפענוח טקסט
async function callJSON({ system, messages, schema, maxTokens = 4000 }) {
  const model = settings().model || 'claude-haiku-5-5';
  const body = {
    model,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
    output_config: { effort: MODELS[model]?.effort || 'low' },
  };
  if (structuredSupported) body.output_config.format = { type: 'json_schema', schema };
  let res;
  try {
    res = await getClient().messages.create(body);
  } catch (e) {
    if (structuredSupported && e instanceof Anthropic.BadRequestError && /format|schema|output_config/i.test(e.message)) {
      structuredSupported = false;
      return callJSON({ system, messages, schema, maxTokens });
    }
    throw friendlyError(e);
  }
  track(res.usage, model);
  if (res.stop_reason === 'refusal') throw new AIError('refusal', 'המודל סירב לבקשה הזו. נסו לנסח אחרת.');
  const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  if (res.stop_reason === 'max_tokens' && !text.trim().endsWith('}')) throw new AIError('long', 'התשובה נקטעה. נסו שוב.');
  return extractJSON(text);
}

// ---------- הקשר על הלומדת (כדי שה-AI ידבר ברמה הנכונה) ----------
const STEPS = [
  [60, 'A0', 'absolute beginner (A0-A1)'], [180, 'A1', 'beginner (A1)'], [350, 'A2-', 'elementary (A1-A2)'],
  [700, 'A2', 'pre-intermediate (A2)'], [1300, 'B1', 'intermediate (B1)'], [2200, 'B1+', 'upper intermediate (B1+)'],
  [Infinity, 'B2', 'upper intermediate (B2)'],
];
const LV_IDX = { A1: 1, A2: 3, B1: 4, B2: 6, C1: 6 };
// רמה משוערת: אוצר המילים באפליקציה, אבל לא פחות ממה שהאבחון והערכות השיחה מראים (נעמה לומדת גם 8 שעות בשבוע בקורס)
export function levelInfo() {
  const v = vocabSummary();
  let k = STEPS.findIndex(([n]) => v.seen < n);
  const st = S();
  let floor = 1;
  const sc = Object.values(st.diag?.scores || {});
  if (sc.length) {
    const r = sc.reduce((a, x) => a + x[0], 0) / Math.max(1, sc.reduce((a, x) => a + x[1], 0));
    floor = r >= 0.8 ? 3 : r >= 0.55 ? 2 : 1;
  }
  const last = (st.assessments || []).slice(-3);
  if (last.length) floor = Math.max(floor, Math.min(...last.map((a) => LV_IDX[a.level] ?? 1)));
  const lvl = UNITS[reachedIndex()]?.level || 'A2';
  const cap = lvl === 'B2' ? 6 : lvl === 'B1' ? 5 : 3;
  k = Math.max(floor, Math.min(k, cap));
  return { code: STEPS[k][1], desc: STEPS[k][2], idx: k };
}

function learnerProfile() {
  const v = vocabSummary();
  const level = levelInfo().desc;
  const cur = currentUnit();
  const wk = weekPlan().units.map((id) => unitById(id)?.it).filter(Boolean);
  const studied = UNITS.slice(0, reachedIndex() + 1).filter((u) => u.stage !== 'course').map((u) => u.it).join('; ');
  const course = UNITS.filter((u) => u.stage === 'course').slice(0, 6).map((u) => u.it).join('; ');
  const words = learnedWordList(250);
  const weak = weakItems(6).map((x) => x.it);
  const weakT = weakTopics(4).map((u) => u.it);
  return `LEARNER PROFILE
- Name: Naama, a WOMAN (address her with feminine forms: "sei stanca?", "sei pronta?"; her own adjectives/participles must be feminine: "sono andata", "sono contenta" - correct her if she uses masculine forms for herself).
- Native language: Hebrew (Israeli). Explanations must be in natural, simple Hebrew, addressing her in the feminine.
- Goal: pass the Italian B2 certification (${settings().examName}) in about ${Math.round(daysToExam() / 30)} months, to study Medicine at an Italian university.
- She also takes an 8-hour/week Italian course (Suzy Academy); she studied the A1-A2 basics there (present tense, essere/avere, articles, prepositions, reflexive verbs, possessives, modals) but has NOT yet mastered them.
- Estimated level: ${level}. Has met ${v.seen} words/phrases in this app; ${v.known} are well-known.
- Grammar topics covered so far: ${studied}
- Focus this week: ${wk.join('; ') || cur.it}${course ? `\n- Recent topics from her course: ${course}` : ''}
- Weak grammar topics (create chances to practice them): ${weakT.join('; ') || '(unknown yet)'}
- Words she has studied (${levelInfo().idx >= 4 ? 'she also knows many common words not listed; use natural intermediate Italian' : 'prefer these plus very common words'}): ${words.length ? words.join(', ') : '(few yet - she knows basic A1 vocabulary from her course)'}
- Words she struggles with (reuse them naturally): ${weak.join(', ') || '(none)'}`;
}

// ---------- 1. שיחה עם המורה ----------
const CHAT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['reply', 'reply_he', 'corrections', 'hint_he', 'new_words'],
  properties: {
    reply: { type: 'string', description: 'Your next turn in Italian' },
    reply_he: { type: 'string', description: 'Hebrew translation of reply' },
    corrections: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['wrong', 'right', 'why_he'],
        properties: { wrong: { type: 'string' }, right: { type: 'string' }, why_he: { type: 'string' } },
      },
    },
    hint_he: { type: 'string', description: 'Short Hebrew hint on how the learner could answer (may include 1-2 Italian words)' },
    new_words: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he'],
        properties: { it: { type: 'string' }, he: { type: 'string' } },
      },
    },
  },
};

export async function chatTurn(scenario, history) {
  const system = `You are an expert, warm Italian conversation tutor inside a language-learning app for Naama, a Hebrew speaker preparing for a B2 exam.

ROLE-PLAY: ${scenario.setup}

${learnerProfile()}

HOW TO TEACH (based on second-language acquisition research):
1. Comprehensible input: write at the learner's level (just slightly above it). ${['Beginner: 1-2 very short sentences per turn (max ~25 words).', 'Beginner: 1-2 short sentences (max ~30 words).', 'Elementary: 2-3 sentences (max ~40 words).', 'Pre-intermediate: 2-4 sentences (max ~50 words).', 'Intermediate: natural turns up to ~70 words, varied tenses.', 'Upper-intermediate: natural turns up to ~90 words, idioms and connectors.', 'B2: speak like a friendly native (up to ~100 words), challenge them with follow-up questions that require opinions, reasons and hypotheticals.'][levelInfo().idx]}
2. Keep them talking: almost always end your turn with ONE simple question or prompt that invites them to answer.
3. Corrective feedback: if the learner's last message has errors (grammar, gender/article, conjugation, word choice, spelling, wrong-language words), (a) naturally reuse the correct form in your reply (a recast), and (b) list each real error in "corrections" with the learner's wrong fragment, the corrected Italian, and a 1-sentence explanation in Hebrew. Ignore missing accents/capitalization unless they change meaning. Max 3 corrections, most important first. If the learner wrote in Hebrew or English, tell them how to say it in Italian (put it in corrections).
4. Stay positive and encouraging; never lecture inside "reply". Stay in character.
5. "new_words": 0-3 useful words/phrases from YOUR reply that are probably new to the learner, with Hebrew meaning (base form, nouns with article).
6. "hint_he": a short Hebrew hint helping the learner form an answer to your question.
7. Gradually raise the level: when she answers well and easily, use slightly richer language and ask questions that need longer answers (reasons, past events, opinions).
If the conversation is empty, open the scene yourself with a greeting and a first question.`;
  const msgs = history.length ? history : [{ role: 'user', content: '(התחל את השיחה / Inizia tu)' }];
  return callJSON({ system, messages: msgs, schema: CHAT_SCHEMA, maxTokens: 3000 });
}

// ---------- 2. סיפור מדורג (קריאה + האזנה) ----------
const STORY_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'title_he', 'sentences', 'glossary', 'questions'],
  properties: {
    title: { type: 'string' }, title_he: { type: 'string' },
    sentences: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he'],
        properties: { it: { type: 'string' }, he: { type: 'string' } },
      },
    },
    glossary: {
      type: 'array', description: 'EVERY distinct word form in the story, so the learner can tap any word',
      items: {
        type: 'object', additionalProperties: false, required: ['w', 'he', 'base'],
        properties: { w: { type: 'string', description: 'word exactly as it appears, lowercase' }, he: { type: 'string' }, base: { type: 'string', description: 'dictionary form (nouns with article)' } },
      },
    },
    questions: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['q', 'options', 'answer'],
        properties: { q: { type: 'string', description: 'question in simple Italian' }, options: { type: 'array', items: { type: 'string' } }, answer: { type: 'integer', description: 'index of correct option' } },
      },
    },
  },
};

export async function makeStory(topic, length = 'short') {
  const system = `You write short graded readers for Naama, a Hebrew-speaking learner of Italian preparing for a B2 exam.

${learnerProfile()}

RULES (research: learners understand and acquire best when ~95-98% of words are already known):
- Use almost only words from the learner's list plus the most frequent Italian words. Introduce at most 4-6 new words, and repeat each new word at least twice.
- Length: ${({ short: '6-9 sentences', medium: '12-16 sentences', long: '20-28 sentences (several paragraphs)' })[length] || '8-12 sentences'}. Use only tenses/structures from the units studied so far (the newest unit's grammar should appear several times).
- From level B1 upward the text may read like a real magazine article, blog post, or dialogue on the topic, with authentic expressions.
- Natural, engaging, a little humor or a small twist. Real Italian culture details.
- Each sentence with a natural Hebrew translation.
- glossary: every distinct word form (lowercase, without punctuation) with its Hebrew meaning in context and its dictionary form.
- 3 comprehension questions in simple Italian with 3 options each.`;
  return callJSON({ system, messages: [{ role: 'user', content: `Topic: ${topic}` }], schema: STORY_SCHEMA, maxTokens: length === 'long' ? 16000 : 10000 });
}

// ---------- 3. תיקון כתיבה ----------
const WRITE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['corrected', 'errors', 'praise_he', 'tip_he', 'better_version'],
  properties: {
    corrected: { type: 'string', description: 'learner text with minimal corrections only' },
    errors: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['wrong', 'right', 'why_he'],
        properties: { wrong: { type: 'string' }, right: { type: 'string' }, why_he: { type: 'string' } },
      },
    },
    praise_he: { type: 'string', description: 'specific, honest praise in Hebrew (1 sentence)' },
    tip_he: { type: 'string', description: 'the ONE most useful thing to improve, in Hebrew' },
    better_version: { type: 'string', description: 'a more natural native-like version, still at learner level' },
  },
};

export async function correctWriting(prompt, text) {
  const system = `You are an encouraging Italian writing tutor for a Hebrew speaker.
${learnerProfile()}
Correct the learner's text. Minimal corrections in "corrected" (keep their wording). Explain every real error briefly in Hebrew. Do not flag missing capital letters. Then give a more natural version at their level.`;
  return callJSON({ system, messages: [{ role: 'user', content: `Task given to learner: ${prompt}\n\nLearner's text:\n${text}` }], schema: WRITE_SCHEMA, maxTokens: 3000 });
}

// ---------- 4. מילים חדשות לפי נושא ----------
const WORDS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['items'],
  properties: {
    items: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he', 'ex', 'exHe'],
        properties: { it: { type: 'string' }, he: { type: 'string' }, ex: { type: 'string' }, exHe: { type: 'string' } },
      },
    },
  },
};

export async function generateWords(topic, n = 10) {
  const system = `You create vocabulary flashcards for a Hebrew-speaking learner of Italian.
${learnerProfile()}
Choose the ${n} MOST USEFUL, high-frequency words or short chunks for the topic, that are not in the learner's list. Nouns with definite article (il/la/l'/lo). For each: Hebrew meaning, a short natural example sentence using mostly known words, and its Hebrew translation. The example sentence must contain the word exactly as written in "it" (without the article if needed).`;
  const r = await callJSON({ system, messages: [{ role: 'user', content: `Topic (may be in Hebrew): ${topic}` }], schema: WORDS_SCHEMA, maxTokens: 4000 });
  return r.items || [];
}

// ---------- 4ב. מילים ליחידה מתקדמת (B1–B2) ----------
export async function generateUnitWords(unit, existing, n = 30) {
  const system = `You build the vocabulary for one unit of an Italian course for a Hebrew speaker who is heading to level B2.
Unit: "${unit.it}" (${unit.level}). Theme and grammar focus: ${unit.gen}

Choose the ${n} MOST USEFUL items for this unit at level ${unit.level}: prioritize high-frequency words (top 5000 Italian lemmas) and common collocations/chunks that a B2 speaker must know; mix nouns, verbs, adjectives, adverbs and 3-6 multi-word expressions. Do NOT include any word from the "already known" list.
Rules:
- "it": nouns with definite article (il/la/l'/lo); verbs in the infinitive; expressions as used.
- "he": precise Hebrew meaning (add a short clarification in parentheses if ambiguous).
- "ex": a natural, short example sentence (max 14 words) containing the item exactly as written in "it" (article may be omitted in the sentence only if unavoidable), preferably practicing the unit's grammar.
- "exHe": natural Hebrew translation of the example.`;
  const r = await callJSON({
    system,
    messages: [{ role: 'user', content: `Already known (exclude): ${existing.join(', ')}` }],
    schema: WORDS_SCHEMA, maxTokens: 12000,
  });
  return r.items || [];
}

// ---------- 4ב2. הפיכת מה שנאסף בשיחות ובסיפורים לכרטיסיות נקיות ----------
const ENRICH_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['items'],
  properties: {
    items: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['id', 'it', 'he', 'form', 'ex', 'exHe', 'note_he'],
        properties: {
          id: { type: 'string' }, it: { type: 'string' }, he: { type: 'string' },
          form: { type: 'string', description: 'the exact word/phrase as it appears inside ex' },
          ex: { type: 'string' }, exHe: { type: 'string' }, note_he: { type: 'string' },
        },
      },
    },
  },
};

export async function enrichItems(raw) {
  const system = `You turn notes captured during a Hebrew speaker's Italian practice into clean flashcards, keeping the learner's OWN context so the card feels like a continuation of what they read or said.
${learnerProfile()}

Each note has a source:
- "tap": a word the learner looked up while reading/listening. "it" = dictionary form (nouns with article, verbs in the infinitive) unless it is a fixed expression. "he" = meaning in that context. "ex" = the single sentence from the given context that contains the word (copy it exactly; if the context has several sentences, keep only that one). "form" = the word exactly as it appears in ex. "note_he" = a very short note if the form differs from the dictionary form (e.g. "צורת עבר של andare"), else "".
- "chat": a word the tutor used. Same rules; ex = the single sentence from the tutor's message containing it.
- "mistake": an error the learner made. "it" = the SHORT correct Italian chunk (1-5 words) that fixes the error. "he" = what that chunk means in Hebrew. "ex" = the learner's own sentence, fully corrected and natural. "form" = the chunk as it appears in ex. "note_he" = one short Hebrew sentence with the rule (what was wrong and why).
"exHe" = natural Hebrew translation of ex. Return one item per input, with the same id.`;
  const r = await callJSON({ system, messages: [{ role: 'user', content: JSON.stringify(raw) }], schema: ENRICH_SCHEMA, maxTokens: 8000 });
  return r.items || [];
}

// ---------- 4ג. הערכת רמה לפי מה שהלומד כתב/אמר ----------
const LEVEL_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['level', 'strengths_he', 'focus_he', 'next_steps_he'],
  properties: {
    level: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1'] },
    strengths_he: { type: 'string' }, focus_he: { type: 'string' }, next_steps_he: { type: 'string' },
  },
};
export async function assessLevel(samples) {
  const system = `You are a certified CEFR examiner for Italian. Estimate the learner's productive level (speaking/writing) from their messages below, following CEFR descriptors (range, accuracy, coherence, interaction). Be honest and calibrated, not flattering; if there is too little evidence, estimate conservatively. Answer in Hebrew: strengths (1-2 sentences), the 2-3 most important things to fix to reach the next level, and concrete next steps.`;
  return callJSON({ system, messages: [{ role: 'user', content: samples.map((x, i) => `${i + 1}. ${x}`).join('\n') }], schema: LEVEL_SCHEMA, maxTokens: 3000 });
}

// ---------- 5. שאלה חופשית למורה (דקדוק, משמעות) ----------
const ASK_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['answer_he', 'examples'],
  properties: {
    answer_he: { type: 'string', description: 'clear, concise answer in Hebrew' },
    examples: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['it', 'he'],
        properties: { it: { type: 'string' }, he: { type: 'string' } },
      },
    },
  },
};

export async function askTutor(question, context = '') {
  const system = `You are a patient Italian teacher answering a Hebrew-speaking learner's question. Answer in simple Hebrew, short (max ~120 words), concrete, with a comparison to Hebrew when it helps. Give 2-3 short Italian examples with Hebrew translation.
${learnerProfile()}`;
  return callJSON({ system, messages: [{ role: 'user', content: (context ? `Context: ${context}\n\n` : '') + question }], schema: ASK_SCHEMA, maxTokens: 2500 });
}

// ---------- 6. תרגום מהיר של מילה בהקשר ----------
const GLOSS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['he', 'base', 'note_he'],
  properties: { he: { type: 'string' }, base: { type: 'string' }, note_he: { type: 'string' } },
};
const glossCache = new Map();
export async function glossWord(word, sentence) {
  const k = word.toLowerCase() + '|' + sentence;
  if (glossCache.has(k)) return glossCache.get(k);
  const r = await callJSON({
    system: 'Translate one Italian word in context for a Hebrew speaker. "he": Hebrew meaning in this context. "base": dictionary form (nouns with article, verbs infinitive). "note_he": very short grammar note in Hebrew (e.g. "פועל andare, גוף ראשון") or empty.',
    messages: [{ role: 'user', content: `Word: ${word}\nSentence: ${sentence}` }],
    schema: GLOSS_SCHEMA, maxTokens: 800,
  });
  glossCache.set(k, r);
  return r;
}

// ---------- 7. תרגילים לפי נושא (ליחידות B1–B2 ולנושאים מהקורס) ----------
const DRILL_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['items'],
  properties: {
    items: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['k', 'q', 'a', 'o', 'he'],
        properties: {
          k: { type: 'string', enum: ['fill', 'conj', 'prep', 'art', 'spell', 'ear'] },
          q: { type: 'string' }, a: { type: 'string' },
          o: { type: 'array', items: { type: 'string' } }, he: { type: 'string' },
        },
      },
    },
  },
};
export async function generateDrills(unit, n = 12) {
  const topic = unit.gen || `${unit.it} – ${unit.he}${unit.note ? ' – ' + unit.note : ''}`;
  const words = (unit.items || []).slice(0, 40).map((x) => x[0]).join(', ');
  const existing = (unit.drills || []).map((d) => d[1] || d[2]).slice(0, 40).join(' | ');
  const system = `You write short Italian grammar & vocabulary exercises for a Hebrew-speaking woman (Naama) preparing for the B2 exam (CILS/CELI).
${learnerProfile()}

Create ${n} exercises for the unit "${unit.it}" (level ${unit.level}). Topic and grammar focus: ${topic}
${words ? `Vocabulary of the unit: ${words}` : ''}
Exercise kinds (mix them; most should be fill/conj, plus 1-2 "ear"):
- "fill": an Italian sentence with exactly one gap written as ___ ; "a" = the missing word(s); "o" = 2 plausible WRONG answers that reflect typical learner errors; "he" = Hebrew translation of the full sentence + a 3-6 word rule hint.
- "conj": like fill, but the gap is a verb form and the infinitive (and person if needed) is given in parentheses at the end of "q", e.g. "Se ___ tempo, verrei. (avere, io)".
- "prep": like fill, gap is a (simple or articulated) preposition.
- "art": like fill, gap is an article.
- "ear": listening comprehension. "q" = "" ; "a" = a natural Italian sentence (8-16 words) that will be read aloud; "he" = its correct Hebrew translation; "o" = 2 WRONG Hebrew translations that differ in one key detail (tense, person, negation, number).
Rules: one unambiguous correct answer; the gap answer must be short (1-3 words); sentences natural and useful; prefer contexts from student life, health, Italy and medicine. Avoid duplicates of: ${existing || '(none)'}`;
  const r = await callJSON({ system, messages: [{ role: 'user', content: 'Crea gli esercizi.' }], schema: DRILL_SCHEMA, maxTokens: 8000 });
  return r.items || [];
}

// ---------- 8. מילים מהקורס: השלמת תרגום ומשפט דוגמה ----------
export async function completeWords(lines, topic) {
  const system = `You turn a Hebrew speaker's list of Italian words/phrases (from her Italian course) into flashcards.
${learnerProfile()}
For each line: "it" = the Italian item as given, cleaned (nouns with definite article, verbs in the infinitive unless it's a phrase); "he" = Hebrew meaning (use the meaning she wrote if given); "ex" = a short natural example sentence containing "it" (article may be dropped), preferably related to the course topic; "exHe" = Hebrew translation. Keep the same order. Course topic: ${topic || '(general)'}.`;
  const r = await callJSON({ system, messages: [{ role: 'user', content: lines.join('\n') }], schema: WORDS_SCHEMA, maxTokens: 6000 });
  return r.items || [];
}

// ---------- 9. תרגול לבחינה: CILS B2 / CELI 3 ----------
// שני המבחנים בודקים את אותן 5 מיומנויות: האזנה, קריאה, מבנים לשוניים, כתיבה, דיבור.
export const EXAM_SECTIONS = {
  ascolto: { icon: '🎧', he: 'הבנת הנשמע', it: 'Ascolto', min: 8 },
  lettura: { icon: '📖', he: 'הבנת הנקרא', it: 'Comprensione della lettura', min: 10 },
  strutture: { icon: '🧩', he: 'מבנים לשוניים (דקדוק בהקשר)', it: 'Analisi delle strutture', min: 6 },
  scrittura: { icon: '✍️', he: 'הבעה בכתב', it: 'Produzione scritta', min: 20 },
  orale: { icon: '🎤', he: 'הבעה בעל-פה', it: 'Produzione orale', min: 8 },
};
const COMP_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['title', 'kind_he', 'text', 'questions'],
  properties: {
    title: { type: 'string' }, kind_he: { type: 'string', description: 'type of text in Hebrew, e.g. ריאיון ברדיו' },
    text: { type: 'string' },
    questions: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['q', 'options', 'answer', 'why_he'],
        properties: { q: { type: 'string' }, options: { type: 'array', items: { type: 'string' } }, answer: { type: 'integer' }, why_he: { type: 'string' } },
      },
    },
  },
};
const STRUCT_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['title', 'text', 'gaps'],
  properties: {
    title: { type: 'string' },
    text: { type: 'string', description: 'text with numbered gaps written exactly as [1], [2], ...' },
    gaps: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['options', 'answer', 'rule_he'],
        properties: { options: { type: 'array', items: { type: 'string' } }, answer: { type: 'integer' }, rule_he: { type: 'string' } },
      },
    },
  },
};
const PROMPT_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['task_it', 'task_he', 'points', 'length'],
  properties: {
    task_it: { type: 'string' }, task_he: { type: 'string' },
    points: { type: 'array', items: { type: 'string' }, description: 'guiding points in Italian' },
    length: { type: 'string', description: 'e.g. "120-150 parole" or "2-3 minuti"' },
  },
};
const levelFor = (target) => (target === 'B2' ? 'B2 (real exam difficulty)' : `${levelInfo().idx >= 4 ? 'B1+' : 'A2+/B1'} (a bridge level slightly above the learner, in the same format as the B2 exam)`);

export async function examTask(sec, target, theme = '') {
  const lv = levelFor(target);
  const base = `You prepare practice tasks in the format of the Italian certifications CILS DUE-B2 and CELI 3 for Naama (Hebrew speaker, future medical student in Italy). Difficulty: ${lv}.
${learnerProfile()}
Topics typical of these exams: everyday life, study and work, health, environment, technology, culture, travel, society. ${theme ? `Use this theme: ${theme}.` : 'Vary the theme.'} Authentic, natural Italian.`;
  if (sec === 'ascolto') {
    return callJSON({ system: `${base}\nWrite a LISTENING task: a realistic audio script (radio interview, dialogue, announcement or short report), ${target === 'B2' ? '220-300' : '150-200'} words, written to be read aloud (no stage directions; for dialogues start each line with the speaker's name and a colon). Then 6 multiple-choice questions in Italian, 4 options each (CILS style), answer = index of the correct option, why_he = short Hebrew explanation pointing to the relevant part.`, messages: [{ role: 'user', content: 'Ascolto' }], schema: COMP_SCHEMA, maxTokens: 6000 });
  }
  if (sec === 'lettura') {
    return callJSON({ system: `${base}\nWrite a READING task: an authentic-style text (newspaper article, blog post, university notice, informative leaflet), ${target === 'B2' ? '350-450' : '220-300'} words, in paragraphs separated by blank lines. Then 6 multiple-choice questions in Italian about details, inferences and vocabulary in context, 4 options each; answer = index; why_he = short Hebrew explanation.`, messages: [{ role: 'user', content: 'Lettura' }], schema: COMP_SCHEMA, maxTokens: 7000 });
  }
  if (sec === 'strutture') {
    return callJSON({ system: `${base}\nWrite a LANGUAGE STRUCTURES task (cloze): a coherent text of ${target === 'B2' ? '160-220' : '120-160'} words with 10 numbered gaps written as [1]...[10]. Each gap tests a different structure (articles, articulated prepositions, verb tenses and moods, pronouns, connectors, agreement). Prefer structures from her weak topics. For each gap: 4 options, answer = index, rule_he = the rule in one short Hebrew sentence.`, messages: [{ role: 'user', content: 'Strutture' }], schema: STRUCT_SCHEMA, maxTokens: 5000 });
  }
  if (sec === 'scrittura') {
    return callJSON({ system: `${base}\nWrite a WRITING task like the exam (formal or informal email/letter, or an argumentative/descriptive text). task_it = the instructions in Italian as in the exam; task_he = Hebrew translation; points = 3-4 guiding points; length = ${target === 'B2' ? '"120-180 parole"' : '"80-120 parole"'}.`, messages: [{ role: 'user', content: 'Scrittura' }], schema: PROMPT_SCHEMA, maxTokens: 2000 });
  }
  return callJSON({ system: `${base}\nWrite an ORAL production task like the exam: a monologue topic (describe/narrate/argue) with 3-4 guiding questions. task_it in Italian, task_he in Hebrew, length = ${target === 'B2' ? '"2-3 minuti"' : '"1-2 minuti"'}.`, messages: [{ role: 'user', content: 'Orale' }], schema: PROMPT_SCHEMA, maxTokens: 2000 });
}

const GRADE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['score', 'criteria', 'errors', 'strengths_he', 'improve_he', 'model_answer'],
  properties: {
    score: { type: 'integer', description: '0-20' },
    criteria: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['name_he', 'score', 'comment_he'],
        properties: { name_he: { type: 'string' }, score: { type: 'integer', description: '0-5' }, comment_he: { type: 'string' } },
      },
    },
    errors: {
      type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['wrong', 'right', 'why_he'],
        properties: { wrong: { type: 'string' }, right: { type: 'string' }, why_he: { type: 'string' } },
      },
    },
    strengths_he: { type: 'string' }, improve_he: { type: 'string' },
    model_answer: { type: 'string', description: 'a model answer at B2 level, same length as required' },
  },
};
export async function gradeExam(sec, task, answer, target) {
  const oral = sec === 'orale';
  const system = `You are a strict but kind examiner for CILS DUE-B2 / CELI 3. Grade Naama's ${oral ? 'ORAL answer (transcribed by speech recognition: ignore punctuation, capitalization and obvious recognition glitches; you cannot judge pronunciation)' : 'WRITTEN text'} against B2 standards${target === 'B2' ? '' : ' (this was a bridge-level task, but still score against B2 descriptors so she sees where she stands)'}.
Score 0-20 (the pass mark in CILS for each part is 11/20). Use 4 criteria, each 0-5, names in Hebrew: הצלחה במשימה, לכידות וארגון, אוצר מילים, דיוק דקדוקי${oral ? ' (ובמקום ארגון: שטף והיקף)' : ''}. Total = sum of the criteria.
List up to 8 real errors (wrong fragment, correction, short Hebrew explanation; she is a woman: masculine self-reference is an error). Answer in Hebrew, addressing her in the feminine. Then write a model answer.`;
  return callJSON({ system, messages: [{ role: 'user', content: `TASK: ${task.task_it}\nPoints: ${(task.points || []).join('; ')}\nLength: ${task.length}\n\nNAAMA'S ANSWER:\n${answer}` }], schema: GRADE_SCHEMA, maxTokens: 5000 });
}

// בדיקת מפתח – קריאה זעירה
export async function testKey() {
  const r = await callJSON({
    system: 'Reply with JSON {"ok": true, "msg": "<a short Italian greeting>"}',
    messages: [{ role: 'user', content: 'ping' }],
    schema: { type: 'object', additionalProperties: false, required: ['ok', 'msg'], properties: { ok: { type: 'boolean' }, msg: { type: 'string' } } },
    maxTokens: 500,
  });
  return r;
}
