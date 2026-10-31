// תוכן הקורס של נעמה.
// שלב 1 – "חיזוק": 17 יחידות לפי רשימת הנושאים שנלמדו בקורס (A1–A2). חוזרים על הכל, מהחלש לחזק (לפי מבחן האבחון).
// שלב 2 – A2 חדש: עבר, כינויי מושא, עתיד.
// שלב 3 – B1–B2: דקדוק מוכן; מילים ותרגילים נוצרים ע"י המורה (AI) לפי שכיחות.
//
// items: [איטלקית, עברית, משפט דוגמה, תרגום]
// d (תרגילים לפי נושא): [סוג, שאלה עם ___, תשובה, מסיחים מופרדים ב-|, תרגום/הסבר]
//   סוגים: fill השלמה · conj הטיית פועל · prep מילות יחס · art יידוע · spell איות מהשמיעה · ear הבנת הנשמע
//   spell: שומעים את "תשובה" ובוחרים/כותבים את האיות. ear: שומעים את "תשובה" ובוחרים את התרגום הנכון ("he"); המסיחים בעברית.
import { UNITS as BASE, SCENARIOS as BASE_SCEN, STORY_TOPICS as BASE_TOPICS } from './base.js';

export const KINDS = {
  fill: '✏️ השלמה', conj: '🔁 הטיית פועל', prep: '📍 מילות יחס', art: '🔤 יידוע', spell: '🔡 איות', ear: '🎧 הבנת הנשמע',
};

const REVIEW = [
  {
    id: 'r1', it: "L'alfabeto e i suoni", he: 'אלפבית, צלילים ואיות', level: 'A1', stage: 'review',
    grammar: `
<h3>האלפבית – איך קוראים לאותיות</h3>
<p lang="it" dir="ltr">a · bi · ci · di · e · effe · gi · acca · i · elle · emme · enne · o · pi · cu · erre · esse · ti · u · vu · zeta</p>
<p>אותיות "זרות": <i lang="it">j</i> (i lunga), <i lang="it">k</i> (cappa), <i lang="it">w</i> (doppia vu), <i lang="it">x</i> (ics), <i lang="it">y</i> (ipsilon).</p>
<h3>C ו-G: צליל חזק וצליל רך</h3>
<table>
<tr><td></td><td>חזק (ק / ג)</td><td>רך (צ' / ג')</td></tr>
<tr><td>C</td><td lang="it">ca, co, cu, <b>che, chi</b></td><td lang="it">ce, ci, <b>cia, cio, ciu</b></td></tr>
<tr><td>G</td><td lang="it">ga, go, gu, <b>ghe, ghi</b></td><td lang="it">ge, gi, <b>gia, gio, giu</b></td></tr>
</table>
<p>💡 הכלל: לפני <b>e / i</b> הצליל רך. רוצה צליל חזק לפני e/i? מוסיפים <b>h</b>: <i lang="it">chiesa</i> (קיֶזה), <i lang="it">spaghetti</i>. רוצה צליל רך לפני a/o/u? מוסיפים <b>i</b> שקטה: <i lang="it">ciao, giorno</i>.</p>
<h3>צירופים מיוחדים</h3>
<ul>
<li><b lang="it">gli</b> ≈ "לְיִ": <i lang="it">figlio, famiglia</i> · <b lang="it">gn</b> ≈ "נְי": <i lang="it">bagno, gnocchi</i></li>
<li><b lang="it">sc</b> לפני e/i = "ש": <i lang="it">pesce, scienza</i>; לפני a/o/u = "סק": <i lang="it">scuola</i>; <b lang="it">sch</b> = "סק": <i lang="it">schiena</i></li>
<li><b>אותיות כפולות</b> נהגות ארוך יותר ומשנות משמעות: <i lang="it">nono</i> (תשיעי) ≠ <i lang="it">nonno</i> (סבא), <i lang="it">pala</i> ≠ <i lang="it">palla</i>.</li>
<li><b lang="it">h</b> תמיד שקטה: <i lang="it">ho, hanno</i>.</li>
</ul>
<p>לאיות בטלפון: <i lang="it">Come si scrive? – Si scrive con due elle / con l'acca / con la c maiuscola.</i></p>`,
    items: [
      ["Come si scrive?", "איך כותבים את זה?", "Come si scrive il tuo cognome?", "איך כותבים את שם המשפחה שלך?"],
      ["Come si dice … in italiano?", "איך אומרים … באיטלקית?", "Come si dice 'שלום' in italiano?", "איך אומרים 'שלום' באיטלקית?"],
      ["Come si pronuncia?", "איך מבטאים את זה?", "Scusi, come si pronuncia questa parola?", "סליחה, איך מבטאים את המילה הזאת?"],
      ["la lettera", "האות / המכתב", "La lettera h non si pronuncia.", "האות h לא נהגית."],
      ["la parola", "המילה", "Non conosco questa parola.", "אני לא מכירה את המילה הזאת."],
      ["doppia", "כפולה (אות)", "Si scrive con la doppia elle.", "כותבים את זה עם l כפולה."],
      ["maiuscola", "אות גדולה", "Roma si scrive con la maiuscola.", "רומא נכתבת באות גדולה."],
      ["la chiesa", "הכנסייה", "La chiesa è in centro.", "הכנסייה במרכז."],
      ["la cena", "ארוחת הערב", "La cena è alle otto.", "ארוחת הערב בשמונה."],
      ["il ghiaccio", "הקרח", "Un'acqua con ghiaccio, per favore.", "מים עם קרח, בבקשה."],
      ["il giorno", "היום (יממה)", "Che giorno è oggi?", "איזה יום היום?"],
      ["il figlio", "הבן", "Mio figlio ha sei anni.", "הבן שלי בן שש."],
      ["il bagno", "השירותים / האמבטיה", "Dov'è il bagno?", "איפה השירותים?"],
      ["il pesce", "הדג", "Stasera mangio pesce.", "הערב אני אוכלת דג."],
      ["la scuola", "בית הספר", "La scuola comincia a settembre.", "בית הספר מתחיל בספטמבר."],
      ["la scienza", "המדע", "Mi piace la scienza.", "אני אוהבת מדע."],
      ["giallo", "צהוב", "Il taxi è giallo.", "המונית צהובה."],
      ["il nonno", "הסבא", "Mio nonno è molto simpatico.", "סבא שלי מאוד נחמד."],
    ],
    d: [
      ["spell", "", "chiesa", "ciesa|kiesa", "כנסייה – צליל ק לפני e צריך h"],
      ["spell", "", "giallo", "ghiallo|gallo", "צהוב – ג' רכה לפני a צריך i"],
      ["fill", "איך כותבים את הצליל ״קֶה״ (כמו ב-perché)?", "che", "ce|ke", "ch = ק לפני e/i"],
      ["fill", "איך כותבים את הצליל ״צ'ָה״ (כמו ב-ciao)?", "cia", "ca|cha", "ci + a = צ'ה"],
      ["spell", "", "ghiaccio", "giaccio|ghiacio", "קרח"],
      ["spell", "", "figlio", "filio|figglio", "בן – gli"],
      ["spell", "", "bagno", "banio|bagnio", "שירותים – gn"],
      ["spell", "", "pesce", "pesche|pese", "דג – sc לפני e = ש"],
      ["spell", "", "nonno", "nono|nonnno", "סבא – nn כפולה"],
      ["spell", "", "scuola", "sciuola|squola", "בית ספר"],
      ["fill", "איך כותבים ״ג'וֹ״ (כמו ב-giorno)?", "gio", "go|ghio", "gi + o = ג'ו"],
      ["fill", "איך כותבים ״גֶה״ עם ג קשה (כמו ב-spaghetti)?", "ghe", "ge|gue", "gh = ג קשה לפני e/i"],
      ["ear", "", "Come si scrive il tuo nome?", "איך קוראים לך?|מאיפה את?", "איך כותבים את השם שלך?"],
      ["spell", "", "cena", "chena|scena", "ארוחת ערב"],
    ],
  },
  {
    id: 'r2', it: 'Nomi e aggettivi', he: 'שמות עצם ותארים (קבוצה 1 ו-2), צבעים', level: 'A1', stage: 'review',
    grammar: `
<h3>שמות עצם – שתי קבוצות</h3>
<table>
<tr><td></td><td>יחיד</td><td>רבים</td></tr>
<tr><td>קבוצה 1 – זכר</td><td lang="it">libr<b>o</b></td><td lang="it">libr<b>i</b></td></tr>
<tr><td>קבוצה 1 – נקבה</td><td lang="it">cas<b>a</b></td><td lang="it">cas<b>e</b></td></tr>
<tr><td>קבוצה 2 – זכר או נקבה</td><td lang="it">fior<b>e</b> / chiav<b>e</b></td><td lang="it">fior<b>i</b> / chiav<b>i</b></td></tr>
</table>
<p>💡 מילים ב-e יכולות להיות זכר (<i lang="it">il fiore, il mare</i>) או נקבה (<i lang="it">la chiave, la notte</i>) – לומדים אותן עם ה-il/la.</p>
<h3>שמות תואר – בדיוק אותו דבר</h3>
<p>התואר בא <b>אחרי</b> שם העצם (כמו בעברית) ומתאים לו במין ובמספר: <i lang="it">un libro rosso, una casa rossa, due case rosse</i>. תואר ב-e: <i lang="it">un ragazzo gentile, una ragazza gentile, ragazzi gentili</i>.</p>
<p>⚠️ איות: <i lang="it">bianco → bianchi / bianche</i>, <i lang="it">lungo → lunghi</i> (שומרים על הצליל הקשה). אבל <i lang="it">simpatico → simpatici</i>.</p>
<p>צבעים שלא משתנים: <i lang="it">blu, rosa, viola, beige</i> – <i lang="it">una borsa blu, due borse blu</i>.</p>`,
    items: [
      ["il libro", "הספר", "Il libro è sul tavolo.", "הספר על השולחן."],
      ["la casa", "הבית", "La mia casa è piccola.", "הבית שלי קטן."],
      ["il ragazzo", "הבחור / הנער", "Il ragazzo è alto.", "הבחור גבוה."],
      ["la ragazza", "הבחורה / הנערה", "La ragazza è simpatica.", "הבחורה נחמדה."],
      ["il fiore", "הפרח", "I fiori sono gialli.", "הפרחים צהובים."],
      ["la chiave", "המפתח", "Dove sono le chiavi?", "איפה המפתחות?"],
      ["la notte", "הלילה", "La notte è lunga.", "הלילה ארוך."],
      ["grande", "גדול", "Una città grande.", "עיר גדולה."],
      ["piccolo", "קטן", "Un cane piccolo.", "כלב קטן."],
      ["bello", "יפה", "Che bella giornata!", "איזה יום יפה!"],
      ["brutto", "מכוער / רע", "Che brutto tempo!", "איזה מזג אוויר רע!"],
      ["nuovo", "חדש", "Ho un telefono nuovo.", "יש לי טלפון חדש."],
      ["vecchio", "ישן / זקן", "Una casa vecchia.", "בית ישן."],
      ["simpatico", "נחמד", "I tuoi amici sono simpatici.", "החברים שלך נחמדים."],
      ["gentile", "אדיב", "Grazie, sei molto gentile.", "תודה, את מאוד אדיבה."],
      ["giovane", "צעיר", "Il dottore è giovane.", "הרופא צעיר."],
      ["rosso", "אדום", "Una mela rossa.", "תפוח אדום."],
      ["verde", "ירוק", "Gli occhi verdi.", "עיניים ירוקות."],
      ["azzurro", "תכלת", "Il cielo è azzurro.", "השמיים תכולים."],
      ["nero", "שחור", "Un gatto nero.", "חתול שחור."],
      ["bianco", "לבן", "Le case bianche.", "הבתים הלבנים."],
      ["marrone", "חום", "Le scarpe marroni.", "הנעליים החומות."],
    ],
    d: [
      ["fill", "una ragazza ___ (simpatico)", "simpatica", "simpatico|simpatiche", "בחורה נחמדה"],
      ["fill", "due case ___ (bianco)", "bianche", "bianice|bianchi", "שני בתים לבנים – bianche עם h"],
      ["fill", "il libro → due ___", "libri", "libre|libros", "ספרים"],
      ["fill", "la chiave → le ___", "chiavi", "chiave|chiavie", "מפתחות – קבוצה 2: e → i"],
      ["fill", "il fiore → i ___", "fiori", "fiore|fiora", "פרחים"],
      ["fill", "la casa → le ___", "case", "casi|casa", "בתים"],
      ["fill", "i ragazzi ___ (giovane)", "giovani", "giovane|giovanni", "הבחורים הצעירים"],
      ["fill", "le macchine ___ (verde)", "verdi", "verde|verdes", "המכוניות הירוקות"],
      ["fill", "gli occhi ___ (azzurro)", "azzurri", "azzurro|azzure", "עיניים תכולות"],
      ["fill", "due borse ___ (blu)", "blu", "blue|bli", "blu לא משתנה"],
      ["fill", "gli amici ___ (simpatico)", "simpatici", "simpatichi|simpatice", "חברים נחמדים"],
      ["fill", "una notte ___ (lungo)", "lunga", "lungha|lungo", "לילה ארוך"],
      ["ear", "", "La casa è grande e bianca.", "הבית קטן ולבן.|המכונית גדולה ולבנה.", "הבית גדול ולבן."],
      ["ear", "", "Le scarpe nere sono nuove.", "הנעליים הלבנות חדשות.|הנעליים השחורות ישנות.", "הנעליים השחורות חדשות."],
    ],
  },
  {
    id: 'r3', it: 'Saluti, giorni e cortesia', he: 'ברכות, ימי השבוע, רשמי ולא רשמי', level: 'A1', stage: 'review',
    grammar: `
<h3>רשמי ולא רשמי</h3>
<p>עם חברים ובני משפחה: <i lang="it">tu</i> – <i lang="it">Ciao! Come stai?</i>. עם זרים, מבוגרים ובמקום עבודה: <i lang="it">Lei</i> (עם פועל בגוף שלישי) – <i lang="it">Buongiorno! Come sta?</i></p>
<table>
<tr><td>לא רשמי</td><td>רשמי</td></tr>
<tr><td lang="it">Ciao!</td><td lang="it">Buongiorno! / Buonasera!</td></tr>
<tr><td lang="it">Come stai?</td><td lang="it">Come sta?</td></tr>
<tr><td lang="it">Come ti chiami?</td><td lang="it">Come si chiama?</td></tr>
<tr><td lang="it">Scusa!</td><td lang="it">Scusi!</td></tr>
<tr><td lang="it">Ciao! / A presto!</td><td lang="it">Arrivederci! / ArrivederLa!</td></tr>
</table>
<h3>תודה – ומה עונים</h3>
<p><i lang="it">Grazie! – Prego!</i> (בבקשה, רשמי/כללי) · <i lang="it">Grazie! – Figurati!</i> (אין על מה, לחברים) · <i lang="it">Si figuri!</i> (אותו דבר ברשמי) · <i lang="it">Di niente!</i></p>
<h3>ימי השבוע</h3>
<p lang="it" dir="ltr">lunedì · martedì · mercoledì · giovedì · venerdì · sabato · domenica</p>
<p>💡 השבוע מתחיל ביום שני. נכתבים באות קטנה. <i lang="it">il lunedì</i> = בכל יום שני; <i lang="it">lunedì</i> = ביום שני הקרוב.</p>`,
    items: [
      ["Ciao!", "היי / ביי", "Ciao Giulia, come stai?", "היי ג'וליה, מה שלומך?"],
      ["Buongiorno!", "בוקר טוב / שלום", "Buongiorno, signora Rossi!", "בוקר טוב, גברת רוסי!"],
      ["Buonasera!", "ערב טוב", "Buonasera, avete un tavolo?", "ערב טוב, יש לכם שולחן?"],
      ["Arrivederci!", "להתראות", "Grazie, arrivederci!", "תודה, להתראות!"],
      ["A presto!", "נתראה בקרוב", "Ciao, a presto!", "ביי, נתראה בקרוב!"],
      ["Come stai?", "מה שלומך? (לא רשמי)", "Ciao Marco, come stai?", "היי מרקו, מה שלומך?"],
      ["Come sta?", "מה שלומך? (רשמי)", "Buongiorno dottore, come sta?", "בוקר טוב דוקטור, מה שלומך?"],
      ["Piacere!", "נעים מאוד", "Piacere, sono Naama.", "נעים מאוד, אני נעמה."],
      ["Figurati!", "אין על מה (לחבר)", "Grazie mille! – Figurati!", "תודה רבה! – אין על מה!"],
      ["Prego!", "בבקשה / על לא דבר", "Grazie! – Prego!", "תודה! – בבקשה!"],
      ["lunedì", "יום שני", "Lunedì comincio il corso.", "ביום שני אני מתחילה את הקורס."],
      ["martedì", "יום שלישי", "Il martedì vado in palestra.", "בימי שלישי אני הולכת לחדר כושר."],
      ["mercoledì", "יום רביעי", "Ci vediamo mercoledì.", "נתראה ביום רביעי."],
      ["giovedì", "יום חמישי", "Giovedì ho un esame.", "ביום חמישי יש לי מבחן."],
      ["venerdì", "יום שישי", "Venerdì sera esco.", "ביום שישי בערב אני יוצאת."],
      ["sabato", "שבת", "Il sabato non lavoro.", "בשבת אני לא עובדת."],
      ["domenica", "יום ראשון", "Domenica pranzo dai nonni.", "ביום ראשון אני אוכלת צהריים אצל סבא וסבתא."],
      ["il fine settimana", "סוף השבוע", "Cosa fai il fine settimana?", "מה את עושה בסוף השבוע?"],
    ],
    d: [
      ["fill", "Grazie mille, Luca! – ___!", "Figurati", "Ciao|Scusa", "תודה רבה, לוקה! – אין על מה! (לחבר)"],
      ["fill", "Buongiorno signora, come ___?", "sta", "stai|state", "ברשמי: Lei → גוף שלישי"],
      ["fill", "Il giorno dopo lunedì è ___.", "martedì", "mercoledì|domenica", "היום שאחרי שני הוא שלישי"],
      ["fill", "Il giorno prima di domenica è ___.", "sabato", "venerdì|lunedì", "היום שלפני ראשון הוא שבת"],
      ["prep", "Lavoro dal lunedì ___ venerdì.", "al", "a|il", "אני עובדת משני עד שישי"],
      ["fill", "(לא רשמי) Come ti ___?", "chiami", "chiama|chiamo", "איך קוראים לך?"],
      ["fill", "(רשמי) Scusi, come si ___?", "chiama", "chiami|chiamate", "סליחה, איך קוראים לך? (רשמי)"],
      ["spell", "", "mercoledì", "mercoledi|merkoledì", "יום רביעי"],
      ["spell", "", "giovedì", "ghiovedì|giovedi", "יום חמישי"],
      ["ear", "", "Ci vediamo sabato sera?", "נתראה ביום ראשון בבוקר?|נתראה מחר בערב?", "נתראה בשבת בערב?"],
      ["ear", "", "Buonasera, come sta?", "בוקר טוב, איך קוראים לך?|ערב טוב, מאיפה את?", "ערב טוב, מה שלומך? (רשמי)"],
    ],
  },
  {
    id: 'r4', it: "Essere e l'articolo determinativo", he: 'הפועל essere והיידוע (il, lo, la…)', level: 'A1', stage: 'review',
    grammar: `
<h3>essere – להיות</h3>
<table>
<tr><td lang="it">io sono</td><td lang="it">noi siamo</td></tr>
<tr><td lang="it">tu sei</td><td lang="it">voi siete</td></tr>
<tr><td lang="it">lui / lei / Lei è</td><td lang="it">loro sono</td></tr>
</table>
<p>💡 בעברית אומרים "אני עייפה" בלי פועל. באיטלקית חייבים: <i lang="it">Sono stanca.</i> ושימי לב: <i lang="it">è</i> (הוא/היא) עם הטעמה ≠ <i lang="it">e</i> (ו-).</p>
<h3>היידוע – "ה"</h3>
<table>
<tr><td></td><td>יחיד</td><td>רבים</td><td>מתי</td></tr>
<tr><td>זכר</td><td lang="it">il</td><td lang="it">i</td><td>רוב המילים: <i lang="it">il libro → i libri</i></td></tr>
<tr><td>זכר</td><td lang="it">lo</td><td lang="it">gli</td><td>לפני s+עיצור, z, gn, ps, y: <i lang="it">lo studente, lo zaino</i></td></tr>
<tr><td>זכר</td><td lang="it">l'</td><td lang="it">gli</td><td>לפני תנועה: <i lang="it">l'amico → gli amici</i></td></tr>
<tr><td>נקבה</td><td lang="it">la</td><td lang="it">le</td><td><i lang="it">la casa → le case</i></td></tr>
<tr><td>נקבה</td><td lang="it">l'</td><td lang="it">le</td><td>לפני תנועה: <i lang="it">l'amica → le amiche</i></td></tr>
</table>
<p>משפט שלם: יידוע + שם עצם + essere + תואר → <i lang="it">La casa è grande. Gli studenti sono simpatici.</i></p>`,
    items: [
      ["sono", "אני / הם (essere)", "Sono israeliana.", "אני ישראלית."],
      ["sei", "את / אתה (essere)", "Sei stanca?", "את עייפה?"],
      ["è", "הוא / היא / זה (essere)", "Marco è italiano.", "מרקו איטלקי."],
      ["siamo", "אנחנו (essere)", "Siamo amiche.", "אנחנו חברות."],
      ["siete", "אתם / אתן (essere)", "Siete pronti?", "אתם מוכנים?"],
      ["lo studente", "הסטודנט", "Lo studente è bravo.", "הסטודנט טוב."],
      ["la studentessa", "הסטודנטית", "Sono una studentessa di italiano.", "אני סטודנטית לאיטלקית."],
      ["lo zaino", "התרמיל", "Lo zaino è pesante.", "התרמיל כבד."],
      ["l'amico / l'amica", "החבר / החברה", "L'amica di Sara è medico.", "החברה של שרה רופאה."],
      ["gli amici", "החברים", "Gli amici sono a cena.", "החברים בארוחת ערב."],
      ["stanco", "עייף", "Oggi sono stanca.", "היום אני עייפה."],
      ["contento", "שמח / מרוצה", "Sono contenta di vederti.", "אני שמחה לראות אותך."],
      ["pronto", "מוכן", "La cena è pronta!", "ארוחת הערב מוכנה!"],
      ["bravo", "טוב / מוכשר", "Brava, Naama!", "כל הכבוד, נעמה!"],
      ["israeliano", "ישראלי", "Sono israeliana, di Tel Aviv.", "אני ישראלית, מתל אביב."],
      ["italiano", "איטלקי", "Il professore è italiano.", "המרצה איטלקי."],
    ],
    d: [
      ["art", "___ studente", "lo", "il|la", "lo לפני s + עיצור"],
      ["art", "___ amica", "l'", "la|lo", "l' לפני תנועה"],
      ["art", "___ zaino", "lo", "il|l'", "lo לפני z"],
      ["art", "___ zaini", "gli", "i|le", "רבים של lo = gli"],
      ["art", "___ amici", "gli", "i|le", "רבים של l' (זכר) = gli"],
      ["art", "___ ragazze", "le", "la|gli", "נקבה רבים = le"],
      ["art", "___ libri", "i", "gli|le", "רבים של il = i"],
      ["art", "___ psicologo", "lo", "il|l'", "lo לפני ps"],
      ["art", "___ amiche", "le", "gli|l'", "נקבה רבים = le"],
      ["conj", "Noi ___ di Tel Aviv.", "siamo", "sono|siete", "אנחנו מתל אביב"],
      ["conj", "Voi ___ stanchi?", "siete", "siamo|sono", "אתם עייפים?"],
      ["conj", "Io ___ israeliana.", "sono", "sei|è", "אני ישראלית"],
      ["conj", "Marco ___ simpatico.", "è", "e|ha", "מרקו נחמד – è עם הטעמה"],
      ["conj", "Tu ___ italiana?", "sei", "è|sono", "את איטלקייה?"],
      ["ear", "", "Lo studente è molto bravo.", "הסטודנט מאוד עייף.|המורה מאוד טוב.", "הסטודנט מאוד טוב."],
    ],
  },
  {
    id: 'r5', it: "C'è, ci sono e l'articolo indeterminativo", he: "c'è / ci sono, un/una, ציוד לימוד ומשרד", level: 'A1', stage: 'review',
    grammar: `
<h3>יש: c'è / ci sono</h3>
<p><i lang="it">c'è</i> + יחיד, <i lang="it">ci sono</i> + רבים – בדיוק כמו "יש" בעברית בתיאור מקום:</p>
<p><i lang="it">Sulla scrivania <b>c'è</b> un computer. Nello zaino <b>ci sono</b> due quaderni.</i></p>
<p>💡 "יש לי" זה לא c'è – זה <i lang="it">ho</i> (avere).</p>
<h3>יידוע לא מיודע – "אחד/אחת"</h3>
<table>
<tr><td>זכר</td><td lang="it">un</td><td><i lang="it">un libro, un amico</i></td></tr>
<tr><td>זכר (s+עיצור, z, gn, ps)</td><td lang="it">uno</td><td><i lang="it">uno zaino, uno studente</i></td></tr>
<tr><td>נקבה</td><td lang="it">una</td><td><i lang="it">una penna</i></td></tr>
<tr><td>נקבה לפני תנועה</td><td lang="it">un'</td><td><i lang="it">un'amica, un'agenda</i></td></tr>
</table>
<p>⚠️ <i lang="it">un amico</i> בלי גרש (זכר), <i lang="it">un'amica</i> עם גרש (נקבה).</p>
<p>ברבים ("כמה"): <i lang="it">dei libri, degli zaini / degli amici, delle penne</i>.</p>`,
    items: [
      ["c'è", "יש (יחיד)", "C'è una farmacia qui vicino?", "יש בית מרקחת כאן קרוב?"],
      ["ci sono", "יש (רבים)", "Ci sono tre studenti in classe.", "יש שלושה סטודנטים בכיתה."],
      ["la scrivania", "השולחן (כתיבה)", "La scrivania è piena di fogli.", "השולחן מלא דפים."],
      ["il computer", "המחשב", "Il computer è nuovo.", "המחשב חדש."],
      ["la penna", "העט", "Hai una penna?", "יש לך עט?"],
      ["la matita", "העיפרון", "Scrivo con la matita.", "אני כותבת בעיפרון."],
      ["il quaderno", "המחברת", "Il quaderno di italiano.", "המחברת של איטלקית."],
      ["il foglio", "הדף", "Un foglio bianco.", "דף לבן."],
      ["la gomma", "המחק", "Mi presti la gomma?", "תשאילי לי את המחק?"],
      ["la sedia", "הכיסא", "C'è una sedia libera?", "יש כיסא פנוי?"],
      ["l'agenda", "היומן", "Scrivo tutto nell'agenda.", "אני כותבת הכל ביומן."],
      ["la borsa", "התיק", "Nella borsa c'è il portafoglio.", "בתיק יש את הארנק."],
      ["il portafoglio", "הארנק", "Ho perso il portafoglio!", "איבדתי את הארנק!"],
      ["gli occhiali", "המשקפיים", "Dove sono i miei occhiali?", "איפה המשקפיים שלי?"],
      ["il telefono", "הטלפון", "Il telefono è nella borsa.", "הטלפון בתיק."],
      ["la lampada", "המנורה", "Sulla scrivania c'è una lampada.", "על השולחן יש מנורה."],
      ["l'ufficio", "המשרד", "Sono in ufficio fino alle sei.", "אני במשרד עד שש."],
      ["la classe", "הכיתה", "In classe siamo in dieci.", "בכיתה אנחנו עשרה."],
    ],
    d: [
      ["art", "___ zaino", "uno", "un|una", "uno לפני z"],
      ["art", "___ amica", "un'", "una|un", "un' לפני תנועה בנקבה"],
      ["art", "___ amico", "un", "un'|uno", "un amico – בלי גרש"],
      ["art", "___ penna", "una", "un|uno", "עט"],
      ["art", "___ studente", "uno", "un|una", "uno לפני s + עיצור"],
      ["art", "___ agenda", "un'", "una|un", "יומן – נקבה, מתחיל בתנועה"],
      ["fill", "Sulla scrivania ___ un computer.", "c'è", "ci sono|è", "יחיד → c'è"],
      ["fill", "Nella borsa ___ due penne.", "ci sono", "c'è|sono", "רבים → ci sono"],
      ["fill", "Nello zaino ci sono ___ quaderni.", "dei", "degli|delle", "כמה מחברות – dei"],
      ["fill", "Sul tavolo ci sono ___ zaini.", "degli", "dei|delle", "degli לפני z"],
      ["fill", "In classe ci sono ___ studentesse.", "delle", "degli|dei", "נקבה רבים – delle"],
      ["spell", "", "scrivania", "scrivanya|scrivannia", "שולחן כתיבה"],
      ["spell", "", "occhiali", "ochiali|occiali", "משקפיים"],
      ["ear", "", "Nell'ufficio ci sono due scrivanie.", "במשרד יש שני כיסאות.|בכיתה יש שני שולחנות.", "במשרד יש שני שולחנות."],
    ],
  },
  {
    id: 'r6', it: 'Avere (ed essere o avere?)', he: 'הפועל avere, ו-essere או avere?', level: 'A1', stage: 'review',
    grammar: `
<h3>avere – שיש לי</h3>
<table>
<tr><td lang="it">io ho</td><td lang="it">noi abbiamo</td></tr>
<tr><td lang="it">tu hai</td><td lang="it">voi avete</td></tr>
<tr><td lang="it">lui / lei ha</td><td lang="it">loro hanno</td></tr>
</table>
<p>💡 ה-h שקטה: <i lang="it">ho</i> נשמע "או", <i lang="it">hanno</i> נשמע כמו <i lang="it">anno</i> (שנה) – בכתיבה ההבדל חשוב!</p>
<h3>מתי avere ולא essere?</h3>
<p>הרבה דברים שבעברית "אני…" באיטלקית "יש לי…":</p>
<ul>
<li>גיל: <i lang="it">Ho 28 anni</i> (לא sono 28!)</li>
<li><i lang="it">ho fame</i> (רעבה), <i lang="it">ho sete</i> (צמאה), <i lang="it">ho freddo / caldo</i> (קר/חם לי), <i lang="it">ho sonno</i> (עייפה-מנומנמת)</li>
<li><i lang="it">ho ragione</i> (אני צודקת), <i lang="it">ho fretta</i> (אני ממהרת), <i lang="it">ho paura</i> (אני מפחדת), <i lang="it">ho bisogno di</i> (אני צריכה)</li>
</ul>
<p>ו-essere למה שאני: <i lang="it">Sono stanca, sono medico, sono a casa.</i></p>`,
    items: [
      ["ho", "יש לי", "Ho una sorella.", "יש לי אחות."],
      ["hai", "יש לך", "Hai tempo stasera?", "יש לך זמן הערב?"],
      ["ha", "יש לו / לה", "Marco ha una macchina rossa.", "למרקו יש מכונית אדומה."],
      ["abbiamo", "יש לנו", "Abbiamo un gatto.", "יש לנו חתול."],
      ["avete", "יש לכם", "Avete una camera libera?", "יש לכם חדר פנוי?"],
      ["hanno", "יש להם", "Hanno due figli.", "יש להם שני ילדים."],
      ["Quanti anni hai?", "בת כמה את?", "Quanti anni hai? – Ho 28 anni.", "בת כמה את? – אני בת 28."],
      ["ho fame", "אני רעבה", "Ho fame, mangiamo?", "אני רעבה, נאכל?"],
      ["ho sete", "אני צמאה", "Ho sete, c'è dell'acqua?", "אני צמאה, יש מים?"],
      ["ho freddo", "קר לי", "Ho freddo, chiudi la finestra?", "קר לי, תסגור את החלון?"],
      ["ho caldo", "חם לי", "Ho caldo, apro la finestra.", "חם לי, אני פותחת את החלון."],
      ["ho sonno", "אני מנומנמת", "Ho sonno, vado a letto.", "אני עייפה, הולכת לישון."],
      ["ho ragione", "אני צודקת", "Hai ragione tu!", "את צודקת!"],
      ["ho fretta", "אני ממהרת", "Scusa, ho fretta.", "סליחה, אני ממהרת."],
      ["ho paura", "אני מפחדת", "Ho paura degli esami.", "אני מפחדת ממבחנים."],
      ["ho bisogno di", "אני צריכה", "Ho bisogno di un caffè.", "אני צריכה קפה."],
    ],
    d: [
      ["fill", "Io ___ fame.", "ho", "sono|ha", "רעבה = יש לי רעב"],
      ["fill", "Io ___ 28 anni.", "ho", "sono|hanno", "גיל = avere"],
      ["conj", "Quanti anni ___ (tu)?", "hai", "ha|sei", "בת כמה את?"],
      ["conj", "Noi ___ una macchina rossa.", "abbiamo", "avete|siamo", "יש לנו מכונית אדומה"],
      ["conj", "Loro ___ due figli.", "hanno", "anno|ha", "hanno עם h!"],
      ["fill", "Lei ___ stanca.", "è", "ha|e", "עייפה = essere"],
      ["fill", "Fa caldo, ___ sete.", "ho", "sono|c'è", "צמאה = avere"],
      ["conj", "Voi ___ ragione!", "avete", "siete|abbiamo", "אתם צודקים"],
      ["prep", "Ho bisogno ___ aiuto.", "di", "a|da", "ho bisogno di"],
      ["fill", "Mia sorella ___ medico.", "è", "ha|hai", "מקצוע = essere"],
      ["fill", "Scusa, ___ fretta!", "ho", "sono|è", "ממהרת = avere fretta"],
      ["ear", "", "Hanno un cane e due gatti.", "יש להם שני כלבים וחתול.|יש לה כלב ושני חתולים.", "יש להם כלב ושני חתולים."],
      ["ear", "", "Ho freddo, chiudi la finestra?", "חם לי, תפתח את החלון?|קר לי, תסגור את הדלת?", "קר לי, תסגור את החלון?"],
    ],
  },
  {
    id: 'r7', it: 'Descrivere una persona', he: 'לתאר אדם: בגדים, גוף ופנים', level: 'A1', stage: 'review',
    grammar: `
<h3>לתאר מישהו</h3>
<ul>
<li>מראה כללי – essere: <i lang="it">È alta, magra e bionda.</i></li>
<li>תכונות גוף – avere: <i lang="it">Ha i capelli lunghi e gli occhi verdi.</i> (בעברית: "יש לה שיער ארוך")</li>
<li>בגדים – <i lang="it">porta / indossa</i>: <i lang="it">Porta una giacca nera.</i></li>
</ul>
<h3>רבים יוצאי דופן בגוף</h3>
<p><i lang="it">la mano → le mani</i> · <i lang="it">il braccio → le braccia</i> · <i lang="it">il dito → le dita</i> · <i lang="it">il ginocchio → le ginocchia</i> · <i lang="it">l'orecchio → le orecchie</i> · <i lang="it">l'occhio → gli occhi</i></p>
<p>💡 <i lang="it">i capelli</i> (שיער על הראש) תמיד ברבים. <i lang="it">i pantaloni</i> – גם ברבים.</p>`,
    items: [
      ["la giacca", "הז'קט", "Porta una giacca nera.", "היא לובשת ז'קט שחור."],
      ["la camicia", "החולצה (מכופתרת)", "Una camicia bianca.", "חולצה לבנה מכופתרת."],
      ["il cappello", "הכובע", "Il cappello è elegante.", "הכובע אלגנטי."],
      ["i pantaloni", "המכנסיים", "Pantaloni blu.", "מכנסיים כחולים."],
      ["la gonna", "החצאית", "Una gonna lunga.", "חצאית ארוכה."],
      ["il vestito", "השמלה / החליפה", "Che bel vestito!", "איזו שמלה יפה!"],
      ["le scarpe", "הנעליים", "Scarpe comode.", "נעליים נוחות."],
      ["il maglione", "הסוודר", "Porto il maglione, fa freddo.", "אני לובשת סוודר, קר."],
      ["il cappotto", "המעיל", "Un cappotto pesante.", "מעיל כבד."],
      ["la sciarpa", "הצעיף", "Una sciarpa rossa.", "צעיף אדום."],
      ["portare", "ללבוש / להביא", "Oggi porto i jeans.", "היום אני לובשת ג'ינס."],
      ["la testa", "הראש", "Mi fa male la testa.", "כואב לי הראש."],
      ["i capelli", "השיער", "Ha i capelli ricci.", "יש לה שיער מתולתל."],
      ["gli occhi", "העיניים", "Ha gli occhi castani.", "יש לו עיניים חומות."],
      ["il naso", "האף", "Un naso piccolo.", "אף קטן."],
      ["la bocca", "הפה", "Apra la bocca, per favore.", "פתחי את הפה, בבקשה."],
      ["l'orecchio", "האוזן", "Mi fa male l'orecchio.", "כואבת לי האוזן."],
      ["la mano / le mani", "היד / הידיים", "Lavati le mani!", "תשטפי ידיים!"],
      ["il braccio / le braccia", "הזרוע / הזרועות", "Ho le braccia stanche.", "הזרועות שלי עייפות."],
      ["la gamba", "הרגל", "Mi fa male la gamba.", "כואבת לי הרגל."],
      ["il piede", "כף הרגל", "Vado a piedi.", "אני הולכת ברגל."],
      ["alto / basso", "גבוה / נמוך", "Mio fratello è alto.", "אחי גבוה."],
      ["magro", "רזה", "È alta e magra.", "היא גבוהה ורזה."],
      ["biondo / castano", "בלונדיני / שטני", "Ha i capelli castani.", "יש לה שיער חום."],
    ],
    d: [
      ["fill", "la mano → le ___", "mani", "mane|mano", "ידיים – רבים יוצא דופן"],
      ["fill", "il braccio → le ___", "braccia", "bracci|braccie", "זרועות – רבים יוצא דופן"],
      ["fill", "Marco ___ gli occhi azzurri.", "ha", "è|sono", "תכונות גוף = avere"],
      ["art", "Ha ___ capelli biondi.", "i", "gli|le", "i capelli"],
      ["fill", "Porta una gonna ___ (rosso).", "rossa", "rosso|rosse", "חצאית – נקבה"],
      ["fill", "Sara ___ alta e magra.", "è", "ha|porta", "מראה כללי = essere"],
      ["fill", "Oggi ___ (io, portare) un maglione.", "porto", "porta|porti", "אני לובשת סוודר"],
      ["fill", "il dito → le ___", "dita", "diti|dite", "אצבעות"],
      ["spell", "", "camicia", "camichia|camiccia", "חולצה מכופתרת"],
      ["spell", "", "giacca", "giaca|ghiacca", "ז'קט"],
      ["spell", "", "cappello", "capello|cappelo", "כובע – pp ו-ll (capello = שערה אחת!)"],
      ["ear", "", "Indossa un cappotto nero e una sciarpa gialla.", "לובשת מעיל צהוב וצעיף שחור.|לובשת ז'קט שחור וכובע צהוב.", "לובשת מעיל שחור וצעיף צהוב."],
      ["ear", "", "Ha i capelli lunghi e gli occhi verdi.", "יש לה שיער קצר ועיניים ירוקות.|יש לה שיער ארוך ועיניים חומות.", "יש לה שיער ארוך ועיניים ירוקות."],
    ],
  },
  {
    id: 'r8', it: 'Avverbi di tempo e di luogo', he: 'מתי ואיפה: mai, sempre, mentre, vicino a…', level: 'A1', stage: 'review',
    grammar: `
<h3>מילות זמן (מתוך "Il ladro elegante")</h3>
<p><i lang="it">sempre</i> (תמיד) · <i lang="it">spesso</i> (לעתים קרובות) · <i lang="it">mai</i> (אף פעם) · <i lang="it">mentre</i> (בזמן ש-) · <i lang="it">prima</i> (קודם) · <i lang="it">poi / dopo</i> (אחר כך) · <i lang="it">subito</i> (מיד) · <i lang="it">ancora</i> (עוד / שוב) · <i lang="it">già</i> (כבר) · <i lang="it">ora / adesso</i> (עכשיו)</p>
<p>💡 שלילה כפולה, כמו בעברית: <i lang="it">Non bevo <b>mai</b> il caffè.</i> = אני <b>אף פעם לא</b> שותה קפה.</p>
<h3>מילות מקום</h3>
<p><i lang="it">vicino <b>a</b></i> (קרוב ל-) · <i lang="it">lontano <b>da</b></i> (רחוק מ-) · <i lang="it">davanti a</i> (מול/לפני) · <i lang="it">dietro</i> (מאחורי) · <i lang="it">accanto a</i> (ליד) · <i lang="it">di fronte a</i> (ממול) · <i lang="it">qui / qua</i> (כאן) · <i lang="it">lì / là</i> (שם)</p>
<p>⚠️ עם יידוע מתחברים: <i lang="it">vicino <b>alla</b> stazione</i>, <i lang="it">lontano <b>dal</b> centro</i>.</p>`,
    items: [
      ["sempre", "תמיד", "Arrivo sempre in orario.", "אני תמיד מגיעה בזמן."],
      ["spesso", "לעתים קרובות", "Vado spesso al cinema.", "אני הולכת הרבה לקולנוע."],
      ["non… mai", "אף פעם לא", "Non mangio mai la carne.", "אני אף פעם לא אוכלת בשר."],
      ["mentre", "בזמן ש-", "Ascolto musica mentre studio.", "אני מקשיבה למוזיקה בזמן שאני לומדת."],
      ["prima", "קודם / לפני", "Prima studio, poi esco.", "קודם אני לומדת, אחר כך יוצאת."],
      ["poi", "אחר כך", "E poi cosa fai?", "ואחר כך מה את עושה?"],
      ["subito", "מיד", "Arrivo subito!", "אני מגיעה מיד!"],
      ["ancora", "עוד / שוב", "Sei ancora a casa?", "את עדיין בבית?"],
      ["già", "כבר", "Hai già mangiato?", "כבר אכלת?"],
      ["adesso", "עכשיו", "Adesso non posso.", "עכשיו אני לא יכולה."],
      ["vicino a", "קרוב ל-", "Abito vicino all'università.", "אני גרה קרוב לאוניברסיטה."],
      ["lontano da", "רחוק מ-", "La stazione è lontana da qui?", "התחנה רחוקה מכאן?"],
      ["davanti a", "מול / לפני", "Ci vediamo davanti al bar.", "נתראה מול הבר."],
      ["dietro", "מאחורי", "Il parcheggio è dietro la chiesa.", "החניה מאחורי הכנסייה."],
      ["accanto a", "ליד", "La farmacia è accanto al bar.", "בית המרקחת ליד הבר."],
      ["di fronte a", "ממול ל-", "Abito di fronte al parco.", "אני גרה מול הפארק."],
      ["qui", "כאן", "Vieni qui!", "בואי לכאן!"],
      ["lì", "שם", "Il libro è lì, sul tavolo.", "הספר שם, על השולחן."],
      ["il ladro", "הגנב", "Il ladro entra dalla finestra.", "הגנב נכנס מהחלון."],
    ],
    d: [
      ["fill", "Non bevo ___ il caffè la sera.", "mai", "sempre|già", "אף פעם לא – non… mai"],
      ["prep", "La farmacia è vicino ___ stazione.", "alla", "dalla|nella", "vicino a + la = alla"],
      ["prep", "Abito lontano ___ centro.", "dal", "al|del", "lontano da + il = dal"],
      ["fill", "Ascolto musica ___ studio.", "mentre", "mai|prima", "בזמן ש-"],
      ["fill", "Prima studio, ___ esco.", "poi", "mentre|già", "אחר כך"],
      ["fill", "Hai ___ mangiato? – Sì, alle sei.", "già", "mai|mentre", "כבר"],
      ["prep", "Ci vediamo davanti ___ cinema.", "al", "del|nel", "davanti a + il = al"],
      ["fill", "Il ladro entra ___ di notte.", "sempre", "mai|ancora", "תמיד"],
      ["prep", "La banca è di fronte ___ posta.", "alla", "della|dalla", "di fronte a + la"],
      ["ear", "", "Il ladro entra sempre dalla finestra.", "הגנב אף פעם לא נכנס מהדלת.|השוטר תמיד יוצא מהחלון.", "הגנב תמיד נכנס מהחלון."],
      ["ear", "", "Abito vicino al parco, lontano dal centro.", "אני גרה רחוק מהפארק, קרוב למרכז.|אני עובדת ליד הפארק, במרכז.", "אני גרה קרוב לפארק, רחוק מהמרכז."],
    ],
  },
  {
    id: 'r9', it: 'Il presente: verbi regolari', he: 'הווה: פעלים רגולריים (are, ere, ire, isc)', level: 'A1', stage: 'review',
    grammar: `
<h3>שלוש המשפחות</h3>
<table>
<tr><td></td><td lang="it">parl<b>are</b></td><td lang="it">prend<b>ere</b></td><td lang="it">dorm<b>ire</b></td><td lang="it">cap<b>ire</b> (isc)</td></tr>
<tr><td lang="it">io</td><td lang="it">parl<b>o</b></td><td lang="it">prend<b>o</b></td><td lang="it">dorm<b>o</b></td><td lang="it">cap<b>isco</b></td></tr>
<tr><td lang="it">tu</td><td lang="it">parl<b>i</b></td><td lang="it">prend<b>i</b></td><td lang="it">dorm<b>i</b></td><td lang="it">cap<b>isci</b></td></tr>
<tr><td lang="it">lui/lei</td><td lang="it">parl<b>a</b></td><td lang="it">prend<b>e</b></td><td lang="it">dorm<b>e</b></td><td lang="it">cap<b>isce</b></td></tr>
<tr><td lang="it">noi</td><td lang="it">parl<b>iamo</b></td><td lang="it">prend<b>iamo</b></td><td lang="it">dorm<b>iamo</b></td><td lang="it">cap<b>iamo</b></td></tr>
<tr><td lang="it">voi</td><td lang="it">parl<b>ate</b></td><td lang="it">prend<b>ete</b></td><td lang="it">dorm<b>ite</b></td><td lang="it">cap<b>ite</b></td></tr>
<tr><td lang="it">loro</td><td lang="it">parl<b>ano</b></td><td lang="it">prend<b>ono</b></td><td lang="it">dorm<b>ono</b></td><td lang="it">cap<b>iscono</b></td></tr>
</table>
<p>💡 שיטה לזכור: <b>noi</b> תמיד <b>-iamo</b> בכל המשפחות. ב-isc ההוספה רק ב-io, tu, lui, loro ("צורת נעל").</p>
<p>פעלי isc נפוצים: <i lang="it">capire, finire, preferire, pulire, spedire</i>.</p>
<h3>⚠️ איות</h3>
<p><i lang="it">cercare → tu cer<b>chi</b>, noi cer<b>chiamo</b></i> · <i lang="it">pagare → tu pa<b>ghi</b></i> (שומרים על הצליל הקשה) · <i lang="it">mangiare → tu mangi, noi mangiamo</i> · <i lang="it">studiare → tu studi</i> (i אחת).</p>`,
    items: [
      ["parlare", "לדבר", "Parlo un po' di italiano.", "אני מדברת קצת איטלקית."],
      ["lavorare", "לעבוד", "Lavoro in un ospedale.", "אני עובדת בבית חולים."],
      ["studiare", "ללמוד", "Studio italiano tutti i giorni.", "אני לומדת איטלקית כל יום."],
      ["abitare", "לגור", "Abito a Tel Aviv.", "אני גרה בתל אביב."],
      ["mangiare", "לאכול", "Mangiamo insieme?", "נאכל ביחד?"],
      ["ascoltare", "להקשיב", "Ascolto un podcast.", "אני מקשיבה לפודקאסט."],
      ["cercare", "לחפש", "Cerchi qualcosa?", "את מחפשת משהו?"],
      ["pagare", "לשלם", "Pago con la carta.", "אני משלמת בכרטיס."],
      ["prendere", "לקחת", "Prendo un caffè.", "אני לוקחת קפה."],
      ["leggere", "לקרוא", "Leggo un libro.", "אני קוראת ספר."],
      ["scrivere", "לכתוב", "Scrivo una mail.", "אני כותבת מייל."],
      ["vedere", "לראות", "Vedo il mare dalla finestra.", "אני רואה את הים מהחלון."],
      ["vivere", "לחיות / לגור", "Vivo in Israele.", "אני גרה בישראל."],
      ["dormire", "לישון", "Dormo otto ore.", "אני ישנה שמונה שעות."],
      ["partire", "לנסוע / לצאת לדרך", "Parto domani per Roma.", "אני נוסעת מחר לרומא."],
      ["aprire", "לפתוח", "Apri la finestra?", "תפתחי את החלון?"],
      ["sentire", "לשמוע / להרגיש", "Non sento bene.", "אני לא שומעת טוב."],
      ["capire", "להבין (isc)", "Non capisco.", "אני לא מבינה."],
      ["finire", "לסיים (isc)", "Finisco alle cinque.", "אני מסיימת בחמש."],
      ["preferire", "להעדיף (isc)", "Preferisco il tè.", "אני מעדיפה תה."],
    ],
    d: [
      ["conj", "Noi ___ italiano. (parlare)", "parliamo", "parlamo|parlate", "noi = -iamo"],
      ["conj", "Io ___ bene. (capire)", "capisco", "capo|capiscio", "isc: capisco"],
      ["conj", "Tu ___ un caffè? (prendere)", "prendi", "prende|prendo", "את לוקחת קפה?"],
      ["conj", "Loro ___ fino a tardi. (dormire)", "dormono", "dormano|dormeno", "הם ישנים עד מאוחר"],
      ["conj", "Voi ___ alle sei? (finire)", "finite", "finiscete|finiate", "voi של isc – בלי isc"],
      ["conj", "Lei ___ il tè. (preferire)", "preferisce", "prefere|preferische", "היא מעדיפה תה"],
      ["conj", "Tu ___ casa? (cercare)", "cerchi", "cerci|cercchi", "שומרים על הצליל הקשה: chi"],
      ["conj", "Tu ___ con la carta? (pagare)", "paghi", "pagi|pagghi", "ghi"],
      ["conj", "Noi ___ alle otto. (mangiare)", "mangiamo", "mangiiamo|mangamo", "i אחת"],
      ["conj", "Loro ___ una mail. (scrivere)", "scrivono", "scrivano|scriveno", "ere → -ono"],
      ["conj", "Io ___ medicina. (studiare)", "studio", "studo|studii", "אני לומדת רפואה"],
      ["conj", "Voi ___ a Roma? (abitare)", "abitate", "abitete|abitiamo", "are → -ate"],
      ["conj", "Marco ___ la finestra. (aprire)", "apre", "apra|aprisce", "ire → -e"],
      ["conj", "Tu ___ l'esercizio? (capire)", "capisci", "capi|capischi", "isc: capisci"],
      ["ear", "", "Lavoro in ospedale e studio la sera.", "אני לומדת בבית חולים ועובדת בבוקר.|הוא עובד בבית חולים ולומד בערב.", "אני עובדת בבית חולים ולומדת בערב."],
    ],
  },
  {
    id: 'r10', it: 'Verbi irregolari: andare, venire, fare…', he: 'פעלים לא רגולריים, andare או venire', level: 'A2', stage: 'review',
    grammar: `
<h3>החשובים ביותר</h3>
<table>
<tr><td></td><td lang="it">andare</td><td lang="it">venire</td><td lang="it">fare</td><td lang="it">uscire</td></tr>
<tr><td lang="it">io</td><td lang="it">vado</td><td lang="it">vengo</td><td lang="it">faccio</td><td lang="it">esco</td></tr>
<tr><td lang="it">tu</td><td lang="it">vai</td><td lang="it">vieni</td><td lang="it">fai</td><td lang="it">esci</td></tr>
<tr><td lang="it">lui/lei</td><td lang="it">va</td><td lang="it">viene</td><td lang="it">fa</td><td lang="it">esce</td></tr>
<tr><td lang="it">noi</td><td lang="it">andiamo</td><td lang="it">veniamo</td><td lang="it">facciamo</td><td lang="it">usciamo</td></tr>
<tr><td lang="it">voi</td><td lang="it">andate</td><td lang="it">venite</td><td lang="it">fate</td><td lang="it">uscite</td></tr>
<tr><td lang="it">loro</td><td lang="it">vanno</td><td lang="it">vengono</td><td lang="it">fanno</td><td lang="it">escono</td></tr>
</table>
<p>עוד: <i lang="it">stare (sto, stai, sta…), dire (dico, dici, dice, diciamo, dite, dicono), bere (bevo…), sapere (so, sai, sa…), dare (do, dai, dà…)</i>.</p>
<h3>andare או venire?</h3>
<p><b>andare</b> = ללכת/לנסוע <b>למקום אחר</b>. <b>venire</b> = לבוא <b>לכאן</b>, לאן שהדובר או מי ששומע נמצא, או להצטרף אליו: <i lang="it">Stasera vado al cinema. Vieni con me?</i> = הערב אני הולכת לקולנוע. באה איתי?</p>
<p>💡 כשמישהו קורא לך: <i lang="it">Vieni! – Arrivo!</i> (ולא "vengo").</p>
<h3>ביטויים עם fare ו-andare</h3>
<p><i lang="it">fare colazione, fare la spesa, fare la doccia, fare una passeggiata, fare sport</i> · <i lang="it">andare a piedi, in macchina, in treno, a letto, al lavoro</i>.</p>`,
    items: [
      ["andare", "ללכת / לנסוע", "Vado al lavoro in autobus.", "אני נוסעת לעבודה באוטובוס."],
      ["venire", "לבוא", "Vieni alla festa sabato?", "את באה למסיבה בשבת?"],
      ["fare", "לעשות", "Cosa fai stasera?", "מה את עושה הערב?"],
      ["uscire", "לצאת", "Esco con le amiche.", "אני יוצאת עם החברות."],
      ["stare", "להיות / להישאר", "Oggi sto a casa.", "היום אני נשארת בבית."],
      ["dire", "לומר", "Cosa dici?", "מה את אומרת?"],
      ["bere", "לשתות", "Bevo un bicchiere d'acqua.", "אני שותה כוס מים."],
      ["sapere", "לדעת", "Non lo so.", "אני לא יודעת."],
      ["dare", "לתת", "Mi dai il numero?", "תתן לי את המספר?"],
      ["fare colazione", "לאכול ארוחת בוקר", "Faccio colazione al bar.", "אני אוכלת ארוחת בוקר בבר."],
      ["fare la spesa", "לעשות קניות (אוכל)", "Il sabato faccio la spesa.", "בשבת אני עושה קניות."],
      ["fare la doccia", "להתקלח", "Faccio la doccia la sera.", "אני מתקלחת בערב."],
      ["fare una passeggiata", "לטייל ברגל", "Facciamo una passeggiata?", "נצא להליכה?"],
      ["andare a piedi", "ללכת ברגל", "Vado a piedi, è vicino.", "אני הולכת ברגל, זה קרוב."],
      ["andare in macchina", "לנסוע במכונית", "Andiamo in macchina o in treno?", "ניסע במכונית או ברכבת?"],
      ["andare a letto", "ללכת לישון", "Vado a letto alle undici.", "אני הולכת לישון באחת-עשרה."],
      ["Arrivo!", "אני באה! / מגיעה!", "Naama, vieni! – Arrivo!", "נעמה, בואי! – באה!"],
    ],
    d: [
      ["conj", "Io ___ colazione alle sette. (fare)", "faccio", "fo|facio", "אני אוכלת ארוחת בוקר בשבע"],
      ["conj", "Noi ___ al cinema. (andare)", "andiamo", "vadiamo|andamo", "noi של andare – andiamo"],
      ["conj", "Loro ___ alla festa. (venire)", "vengono", "venono|viengono", "הם באים למסיבה"],
      ["conj", "Tu ___ stasera? (uscire)", "esci", "uschi|usci", "את יוצאת הערב?"],
      ["conj", "Io ___ un bicchiere d'acqua. (bere)", "bevo", "bero|beo", "bere → bevo"],
      ["conj", "Lui ___ sempre la verità. (dire)", "dice", "die|dici", "הוא תמיד אומר את האמת"],
      ["fill", "Stasera faccio una festa. ___ anche tu?", "Vieni", "Vai|Vado", "לבוא אליי → venire"],
      ["fill", "Domani ___ a Roma in treno. (io)", "vado", "vengo|va", "נוסעת למקום אחר → andare"],
      ["fill", "Il sabato faccio ___ spesa.", "la", "il|una", "fare la spesa"],
      ["prep", "Vado al lavoro ___ piedi.", "a", "in|con", "a piedi"],
      ["prep", "Vado al lavoro ___ macchina.", "in", "a|con la", "in macchina"],
      ["conj", "Voi ___ dov'è la stazione? (sapere)", "sapete", "sapite|sape", "אתם יודעים איפה התחנה?"],
      ["conj", "Loro ___ i compiti insieme. (fare)", "fanno", "facciono|fano", "הם עושים שיעורים ביחד"],
      ["ear", "", "Stasera andiamo a ballare. Vieni con noi?", "הערב אנחנו נשארים בבית. את נשארת?|מחר הולכים לרקוד. באה?", "הערב הולכים לרקוד. באה איתנו?"],
    ],
  },
  {
    id: 'r11', it: 'Tempo libero e mi piace', he: 'זמן פנוי, תדירות, mi piace / mi piacciono', level: 'A2', stage: 'review',
    grammar: `
<h3>כמה פעמים? (avverbi di frequenza)</h3>
<p><i lang="it">sempre</i> (תמיד) → <i lang="it">di solito</i> (בדרך כלל) → <i lang="it">spesso</i> → <i lang="it">qualche volta</i> (לפעמים) → <i lang="it">raramente</i> → <i lang="it">non… mai</i></p>
<p><i lang="it">Di solito il sabato faccio una passeggiata.</i> · <i lang="it">Una volta alla settimana</i> = פעם בשבוע.</p>
<h3>mi piace – "מוצא חן בעיניי"</h3>
<p>בדיוק כמו בעברית: הדבר שאוהבים הוא הנושא. לכן:</p>
<ul>
<li>יחיד או פועל → <b>piace</b>: <i lang="it">Mi piace il cinema. Mi piace ballare.</i></li>
<li>רבים → <b>piacciono</b>: <i lang="it">Mi piacciono i film italiani.</i></li>
</ul>
<p>למי? <i lang="it">mi</i> (לי), <i lang="it">ti</i> (לך), <i lang="it">gli</i> (לו), <i lang="it">le</i> (לה), <i lang="it">ci</i> (לנו), <i lang="it">vi</i> (לכם), <i lang="it">gli</i> (להם). או <i lang="it">A Marco piace…, a me piace…</i></p>
<p>תגובות: <i lang="it">Anche a me!</i> (גם אני!) · <i lang="it">A me no.</i> · <i lang="it">Neanche a me.</i> (גם אני לא)</p>`,
    items: [
      ["il tempo libero", "הזמן הפנוי", "Cosa fai nel tempo libero?", "מה את עושה בזמן הפנוי?"],
      ["di solito", "בדרך כלל", "Di solito mi alzo presto.", "בדרך כלל אני קמה מוקדם."],
      ["qualche volta", "לפעמים", "Qualche volta cucino io.", "לפעמים אני מבשלת."],
      ["raramente", "לעתים רחוקות", "Guardo raramente la TV.", "אני רואה טלוויזיה לעתים רחוקות."],
      ["una volta alla settimana", "פעם בשבוע", "Nuoto una volta alla settimana.", "אני שוחה פעם בשבוע."],
      ["Mi piace…", "אני אוהבת… (יחיד/פועל)", "Mi piace leggere.", "אני אוהבת לקרוא."],
      ["Mi piacciono…", "אני אוהבת… (רבים)", "Mi piacciono i gatti.", "אני אוהבת חתולים."],
      ["Anche a me!", "גם אני!", "Mi piace il mare. – Anche a me!", "אני אוהבת את הים. – גם אני!"],
      ["Neanche a me", "גם אני לא", "Non mi piace il freddo. – Neanche a me.", "אני לא אוהבת קור. – גם אני לא."],
      ["nuotare", "לשחות", "D'estate nuoto al mare.", "בקיץ אני שוחה בים."],
      ["ballare", "לרקוד", "Ti piace ballare?", "את אוהבת לרקוד?"],
      ["cucinare", "לבשל", "Mi piace cucinare per gli amici.", "אני אוהבת לבשל לחברים."],
      ["fare sport", "לעשות ספורט", "Faccio sport tre volte alla settimana.", "אני עושה ספורט שלוש פעמים בשבוע."],
      ["andare in palestra", "ללכת לחדר כושר", "Vado in palestra dopo il lavoro.", "אני הולכת לחדר כושר אחרי העבודה."],
      ["giocare a…", "לשחק ב-", "Gioca a calcio la domenica.", "הוא משחק כדורגל ביום ראשון."],
      ["suonare", "לנגן", "Suono la chitarra.", "אני מנגנת בגיטרה."],
      ["guardare un film", "לראות סרט", "Stasera guardiamo un film.", "הערב נראה סרט."],
      ["la musica", "המוזיקה", "Che musica ti piace?", "איזו מוזיקה את אוהבת?"],
    ],
    d: [
      ["fill", "Mi ___ i film italiani.", "piacciono", "piace|piaciono", "רבים → piacciono"],
      ["fill", "Ti ___ ballare?", "piace", "piacciono|piaci", "פועל → piace"],
      ["fill", "A Marco piace il calcio. = ___ piace il calcio.", "Gli", "Le|Lo", "לו = gli"],
      ["fill", "A Sara piacciono i gatti. = ___ piacciono i gatti.", "Le", "Gli|La", "לה = le"],
      ["prep", "Mi piace il mare. – Anche ___ me!", "a", "per|da", "Anche a me"],
      ["fill", "Non mi piace il freddo. – ___ a me.", "Neanche", "Anche|Sempre", "גם אני לא"],
      ["prep", "Gioco ___ tennis.", "a", "il|al", "giocare a"],
      ["fill", "Nel tempo libero ___ la chitarra. (io, suonare)", "suono", "gioco|suona", "לנגן = suonare"],
      ["fill", "Nuoto una volta ___ settimana.", "alla", "la|per", "פעם בשבוע"],
      ["fill", "Mi ___ molto la pizza.", "piace", "piacciono|piacie", "יחיד → piace"],
      ["ear", "", "Di solito il sabato faccio una passeggiata.", "תמיד ביום ראשון אני הולכת לים.|לפעמים בשבת אני מבשלת.", "בדרך כלל בשבת אני יוצאת להליכה."],
      ["ear", "", "Non mi piacciono gli sport, preferisco leggere.", "אני אוהבת ספורט, ולא קריאה.|הוא לא אוהב ספרים, הוא מעדיף ספורט.", "אני לא אוהבת ספורט, אני מעדיפה לקרוא."],
    ],
  },
  {
    id: 'r12', it: 'La famiglia e i possessivi', he: 'משפחה ומילות שייכות (il mio, la mia…)', level: 'A2', stage: 'review',
    grammar: `
<h3>שלי, שלך, שלו…</h3>
<table>
<tr><td></td><td>ז' יחיד</td><td>נ' יחידה</td><td>ז' רבים</td><td>נ' רבות</td></tr>
<tr><td>שלי</td><td lang="it">il mio</td><td lang="it">la mia</td><td lang="it">i miei</td><td lang="it">le mie</td></tr>
<tr><td>שלך</td><td lang="it">il tuo</td><td lang="it">la tua</td><td lang="it">i tuoi</td><td lang="it">le tue</td></tr>
<tr><td>שלו/שלה</td><td lang="it">il suo</td><td lang="it">la sua</td><td lang="it">i suoi</td><td lang="it">le sue</td></tr>
<tr><td>שלנו</td><td lang="it">il nostro</td><td lang="it">la nostra</td><td lang="it">i nostri</td><td lang="it">le nostre</td></tr>
<tr><td>שלכם</td><td lang="it">il vostro</td><td lang="it">la vostra</td><td lang="it">i vostri</td><td lang="it">le vostre</td></tr>
<tr><td>שלהם</td><td colspan="4" lang="it">il loro, la loro, i loro, le loro</td></tr>
</table>
<p>⚠️ <b>המילה מתאימה לדבר שבבעלות</b>, לא לבעלים: <i lang="it">Marco e <b>sua</b> sorella</i> (האחות – נקבה), <i lang="it">Sara e <b>suo</b> fratello</i>.</p>
<p>💡 <b>בני משפחה ביחיד – בלי il/la</b>: <i lang="it">mia madre, tuo padre, sua sorella</i>. אבל ברבים כן: <i lang="it">i miei fratelli</i>. ותמיד עם <i lang="it">loro</i>: <i lang="it">la loro madre</i>. וגם <i lang="it">la mia famiglia</i> (משפחה זה לא "בן משפחה").</p>`,
    items: [
      ["la famiglia", "המשפחה", "La mia famiglia è grande.", "המשפחה שלי גדולה."],
      ["la madre / la mamma", "האם / אמא", "Mia madre è insegnante.", "אמא שלי מורה."],
      ["il padre / il papà", "האב / אבא", "Mio padre lavora a Haifa.", "אבא שלי עובד בחיפה."],
      ["i genitori", "ההורים", "I miei genitori abitano vicino.", "ההורים שלי גרים קרוב."],
      ["il fratello", "האח", "Ho un fratello e due sorelle.", "יש לי אח ושתי אחיות."],
      ["la sorella", "האחות", "Mia sorella è più grande di me.", "אחותי גדולה ממני."],
      ["il marito", "הבעל", "Suo marito è italiano.", "בעלה איטלקי."],
      ["la moglie", "האישה (רעיה)", "Sua moglie è medico.", "אשתו רופאה."],
      ["il figlio / la figlia", "הבן / הבת", "Hanno una figlia di tre anni.", "יש להם בת בת שלוש."],
      ["i nonni", "סבא וסבתא", "I miei nonni vivono in campagna.", "סבא וסבתא שלי גרים בכפר."],
      ["lo zio / la zia", "הדוד / הדודה", "Mio zio abita a Milano.", "הדוד שלי גר במילאנו."],
      ["il cugino / la cugina", "בן הדוד / בת הדודה", "Mia cugina studia a Bologna.", "בת הדודה שלי לומדת בבולוניה."],
      ["il / la nipote", "האחיין / הנכד", "Ho due nipoti.", "יש לי שני אחיינים."],
      ["il fidanzato / la fidanzata", "החבר / החברה (זוגיות)", "Il mio fidanzato si chiama Amir.", "החבר שלי נקרא אמיר."],
      ["sposato", "נשוי", "Sei sposata?", "את נשואה?"],
      ["figlio unico", "בן יחיד", "Sono figlia unica.", "אני בת יחידה."],
    ],
    d: [
      ["fill", "___ madre è insegnante. (שלי)", "Mia", "La mia|Mio", "בן משפחה ביחיד – בלי la"],
      ["fill", "___ genitori abitano a Haifa. (שלי)", "I miei", "Mie|I mio", "רבים – עם i: i miei"],
      ["fill", "Questa è ___ famiglia. (שלי)", "la mia", "mia|il mio", "famiglia – עם la"],
      ["fill", "Marco e ___ sorella. (שלו)", "sua", "suo|la sua", "מתאים לאחות (נקבה), בלי la"],
      ["fill", "Sara e ___ fratello. (שלה)", "suo", "sua|il suo", "מתאים לאח (זכר)"],
      ["fill", "___ amici sono simpatici. (שלנו)", "I nostri", "Nostri|Le nostre", "i nostri"],
      ["fill", "Come si chiama ___ marito? (שלך)", "tuo", "il tuo|tua", "בן משפחה ביחיד"],
      ["fill", "Paolo e Anna amano ___ figlia. (שלהם)", "la loro", "loro|sua", "loro תמיד עם יידוע"],
      ["fill", "La madre di mia madre è mia ___.", "nonna", "zia|cugina", "סבתא"],
      ["fill", "Il figlio di mio zio è mio ___.", "cugino", "nipote|fratello", "בן דוד"],
      ["fill", "Dove sono ___ chiavi? (שלי)", "le mie", "mie|i miei", "le mie chiavi"],
      ["ear", "", "I miei nonni vivono in campagna.", "ההורים שלי גרים בעיר.|הדודים שלי עובדים בכפר.", "סבא וסבתא שלי גרים בכפר."],
      ["ear", "", "Mia sorella è sposata e ha due figli.", "אחי נשוי ויש לו בת.|אחותי רווקה ויש לה שני חתולים.", "אחותי נשואה ויש לה שני ילדים."],
    ],
  },
  {
    id: 'r13', it: 'Verbi modali, inviti e ore', he: 'potere, volere, dovere – הזמנות ושעות', level: 'A2', stage: 'review',
    grammar: `
<h3>פעלים מודאליים + שם פועל</h3>
<table>
<tr><td></td><td lang="it">potere (יכולה)</td><td lang="it">volere (רוצה)</td><td lang="it">dovere (צריכה/חייבת)</td></tr>
<tr><td lang="it">io</td><td lang="it">posso</td><td lang="it">voglio</td><td lang="it">devo</td></tr>
<tr><td lang="it">tu</td><td lang="it">puoi</td><td lang="it">vuoi</td><td lang="it">devi</td></tr>
<tr><td lang="it">lui/lei</td><td lang="it">può</td><td lang="it">vuole</td><td lang="it">deve</td></tr>
<tr><td lang="it">noi</td><td lang="it">possiamo</td><td lang="it">vogliamo</td><td lang="it">dobbiamo</td></tr>
<tr><td lang="it">voi</td><td lang="it">potete</td><td lang="it">volete</td><td lang="it">dovete</td></tr>
<tr><td lang="it">loro</td><td lang="it">possono</td><td lang="it">vogliono</td><td lang="it">devono</td></tr>
</table>
<p><i lang="it">Non posso venire, devo studiare.</i> · בנימוס: <i lang="it">vorrei</i> (הייתי רוצה) במקום voglio.</p>
<h3>להזמין, לקבל, לסרב</h3>
<p>הזמנה: <i lang="it">Ti va di…? · Vuoi venire…? · Perché non…? · Andiamo a…?</i></p>
<p>כן: <i lang="it">Volentieri! · Certo! · Perché no? · Ottima idea!</i> · לא: <i lang="it">Mi dispiace, non posso… devo… · Magari un'altra volta!</i></p>
<h3>שעות</h3>
<p><i lang="it">Che ore sono? / Che ora è?</i> → <i lang="it">Sono le tre. Sono le otto e mezza. Sono le sei meno un quarto.</i> אבל: <i lang="it">È l'una. È mezzogiorno. È mezzanotte.</i></p>
<p>"באיזו שעה?" <i lang="it">A che ora…? – Alle otto. All'una. A mezzogiorno.</i></p>`,
    items: [
      ["potere", "יכולה", "Posso entrare?", "אפשר להיכנס?"],
      ["volere", "לרצות", "Vuoi un caffè?", "את רוצה קפה?"],
      ["dovere", "צריכה / חייבת", "Devo studiare per l'esame.", "אני חייבת ללמוד למבחן."],
      ["vorrei", "הייתי רוצה (בנימוס)", "Vorrei un'informazione.", "הייתי רוצה לשאול משהו."],
      ["Ti va di…?", "בא לך…?", "Ti va di prendere un aperitivo?", "בא לך אפריטיב?"],
      ["Volentieri!", "בשמחה!", "Vieni a cena? – Volentieri!", "באה לארוחת ערב? – בשמחה!"],
      ["Mi dispiace", "מצטערת", "Mi dispiace, non posso.", "מצטערת, אני לא יכולה."],
      ["un'altra volta", "בפעם אחרת", "Magari un'altra volta!", "אולי בפעם אחרת!"],
      ["Che ore sono?", "מה השעה?", "Scusi, che ore sono?", "סליחה, מה השעה?"],
      ["Sono le…", "השעה…", "Sono le otto e mezza.", "השעה שמונה וחצי."],
      ["È l'una", "השעה אחת", "È l'una, andiamo a pranzo.", "השעה אחת, הולכים לצהריים."],
      ["A che ora…?", "באיזו שעה…?", "A che ora comincia il film?", "באיזו שעה מתחיל הסרט?"],
      ["e mezza", "וחצי", "Alle sette e mezza.", "בשבע וחצי."],
      ["e un quarto", "ורבע", "Sono le due e un quarto.", "השעה שתיים ורבע."],
      ["meno un quarto", "רבע ל-", "Sono le sei meno un quarto.", "השעה רבע לשש."],
      ["mezzogiorno", "צהריים (12:00)", "Ci vediamo a mezzogiorno.", "נתראה בשתים עשרה."],
      ["in orario / in ritardo", "בזמן / באיחור", "Il treno è in ritardo.", "הרכבת מאחרת."],
    ],
    d: [
      ["conj", "Stasera non ___ uscire. (potere, io)", "posso", "puoi|posco", "אני לא יכולה לצאת הערב"],
      ["conj", "Noi ___ partire presto. (dovere)", "dobbiamo", "doviamo|devono", "אנחנו חייבים לצאת מוקדם"],
      ["conj", "Loro ___ mangiare la pizza. (volere)", "vogliono", "vuolono|volono", "הם רוצים לאכול פיצה"],
      ["conj", "___ venire al cinema con me? (volere, tu)", "Vuoi", "Voglio|Vuole", "את רוצה לבוא איתי לקולנוע?"],
      ["fill", "Ti ___ di prendere un caffè?", "va", "vai|piace", "Ti va di…? = בא לך…?"],
      ["fill", "Mi dispiace, non posso: ___ lavorare.", "devo", "voglio|posso", "אני חייבת לעבוד"],
      ["fill", "Che ore sono? – ___ le tre.", "Sono", "È|Ha", "Sono le…"],
      ["fill", "Che ora è? – È ___ una.", "l'", "la|le", "È l'una"],
      ["prep", "Il film comincia ___ otto.", "alle", "a|le", "בשעה = alle"],
      ["conj", "Lei ___ aprire la finestra? (potere, רשמי)", "Può", "Puoi|Potete", "Lei → גוף שלישי"],
      ["ear", "", "Sono le sette meno un quarto.", "השעה 7:15|השעה 7:45", "השעה 6:45 (רבע לשבע)"],
      ["ear", "", "Ti va di venire a cena sabato?", "רוצה ללכת לקולנוע בשבת?|בא לך לבשל ארוחת ערב מחר?", "בא לך לבוא לארוחת ערב בשבת?"],
      ["ear", "", "Mi dispiace, devo lavorare fino a tardi.", "מצטערת, אני רוצה לישון עד מאוחר.|בשמחה, אני מסיימת לעבוד מוקדם.", "מצטערת, אני חייבת לעבוד עד מאוחר."],
    ],
  },
  {
    id: 'r14', it: 'Preposizioni di luogo (a, in, da, con, per)', he: 'מילות יחס של מקום ומילות יחס מיודעות', level: 'A2', stage: 'review',
    grammar: `
<h3>a או in?</h3>
<ul>
<li><b>a</b> + עיר: <i lang="it">Abito a Roma. Vado a Milano.</i> וגם: <i lang="it">a casa, a scuola, a letto, a teatro</i></li>
<li><b>in</b> + מדינה / אזור: <i lang="it">in Italia, in Israele, in Toscana</i>. וגם מקומות שמסתיימים ב-ia ועוד: <i lang="it">in banca, in farmacia, in ufficio, in centro, in biblioteca, in palestra, in montagna</i></li>
<li><b>a + il</b> = <b>al</b>: <i lang="it">al bar, al cinema, al mare, al supermercato</i></li>
<li><b>da</b> + אדם = אצל / אל: <i lang="it">Vado dal medico. Ceniamo da Marco.</i> · <b>da</b> = מ- (מקור): <i lang="it">Vengo da Tel Aviv.</i></li>
<li><b>con</b> = עם · <b>per</b> = בשביל / ל- (מטרה, יעד): <i lang="it">un regalo per te, il treno per Roma</i></li>
</ul>
<h3>מילות יחס מיודעות</h3>
<table>
<tr><td></td><td lang="it">il</td><td lang="it">lo</td><td lang="it">l'</td><td lang="it">la</td><td lang="it">i</td><td lang="it">gli</td><td lang="it">le</td></tr>
<tr><td lang="it">a</td><td>al</td><td>allo</td><td>all'</td><td>alla</td><td>ai</td><td>agli</td><td>alle</td></tr>
<tr><td lang="it">da</td><td>dal</td><td>dallo</td><td>dall'</td><td>dalla</td><td>dai</td><td>dagli</td><td>dalle</td></tr>
<tr><td lang="it">di</td><td>del</td><td>dello</td><td>dell'</td><td>della</td><td>dei</td><td>degli</td><td>delle</td></tr>
<tr><td lang="it">in</td><td>nel</td><td>nello</td><td>nell'</td><td>nella</td><td>nei</td><td>negli</td><td>nelle</td></tr>
<tr><td lang="it">su</td><td>sul</td><td>sullo</td><td>sull'</td><td>sulla</td><td>sui</td><td>sugli</td><td>sulle</td></tr>
</table>
<p>💡 <i lang="it">con</i> ו-<i lang="it">per</i> לא מתחברים: <i lang="it">con il, per la</i>.</p>`,
    items: [
      ["a casa", "בבית / הביתה", "Stasera resto a casa.", "הערב אני נשארת בבית."],
      ["in centro", "במרכז העיר", "Lavoro in centro.", "אני עובדת במרכז."],
      ["in banca", "בבנק", "Devo andare in banca.", "אני צריכה ללכת לבנק."],
      ["in farmacia", "בבית המרקחת", "Vado in farmacia.", "אני הולכת לבית המרקחת."],
      ["in biblioteca", "בספרייה", "Studio in biblioteca.", "אני לומדת בספרייה."],
      ["al bar", "בבר / לבר", "Prendiamo un caffè al bar.", "ניקח קפה בבר."],
      ["al mare", "בים / לים", "D'estate andiamo al mare.", "בקיץ הולכים לים."],
      ["in montagna", "בהרים", "In inverno vado in montagna.", "בחורף אני נוסעת להרים."],
      ["dal medico", "לרופא / אצל הרופא", "Domani vado dal medico.", "מחר אני הולכת לרופא."],
      ["da Marco", "אצל מרקו", "Ceniamo da Marco.", "אוכלים ארוחת ערב אצל מרקו."],
      ["vengo da", "אני באה מ-", "Vengo da Israele.", "אני מישראל."],
      ["con", "עם", "Esco con le amiche.", "אני יוצאת עם החברות."],
      ["per", "בשביל / ל-", "Questo è per te.", "זה בשבילך."],
      ["l'ospedale", "בית החולים", "Lavora all'ospedale.", "הוא עובד בבית החולים."],
      ["l'università", "האוניברסיטה", "Studio all'università.", "אני לומדת באוניברסיטה."],
      ["la stazione", "התחנה", "Vado alla stazione.", "אני הולכת לתחנה."],
    ],
    d: [
      ["prep", "Abito ___ Roma.", "a", "in|da", "עיר → a"],
      ["prep", "Vivo ___ Italia.", "in", "a|nella", "מדינה → in"],
      ["prep", "Domani vado ___ medico.", "dal", "al|nel", "לרופא (אדם) → da"],
      ["prep", "Stasera andiamo ___ cinema.", "al", "in|nel", "al cinema"],
      ["prep", "Lavoro ___ banca.", "in", "a|alla", "in banca"],
      ["prep", "Vengo ___ Israele.", "da", "di|a", "מקור → da"],
      ["prep", "Esco ___ i miei amici.", "con", "per|da", "עם"],
      ["prep", "Questo regalo è ___ te.", "per", "a|con", "בשבילך"],
      ["prep", "Il libro è ___ tavolo. (su + il)", "sul", "sullo|nel", "su + il = sul"],
      ["prep", "Le chiavi sono ___ borsa. (in + la)", "nella", "nela|alla", "in + la = nella"],
      ["prep", "Andiamo ___ mare.", "al", "nel|in", "al mare"],
      ["prep", "Stasera ceniamo ___ Marco.", "da", "a|con", "אצל מרקו → da"],
      ["prep", "Studio ___ università. (a + l')", "all'", "alla|nell", "all'università"],
      ["prep", "I bambini sono ___ scuola.", "a", "in|alla", "a scuola"],
      ["prep", "Il treno ___ Firenze parte alle nove.", "per", "a|da", "הרכבת לפירנצה – per"],
      ["ear", "", "Domani vado in banca e poi dal dentista.", "מחר אני הולכת לבית המרקחת ואחר כך לרופא.|היום אני בבנק עם רופא השיניים.", "מחר אני הולכת לבנק ואחר כך לרופא השיניים."],
    ],
  },
  {
    id: 'r15', it: 'La casa e le espressioni di luogo', he: 'הבית, החדרים, dentro, sopra, sotto…', level: 'A2', stage: 'review',
    grammar: `
<h3>לתאר חדר</h3>
<p>בונים עם <i lang="it">c'è / ci sono</i> + מילת מקום: <i lang="it">Nel soggiorno c'è un divano. Sopra il divano c'è un quadro.</i></p>
<p><i lang="it">dentro</i> (בתוך) · <i lang="it">fuori</i> (בחוץ) · <i lang="it">sopra</i> (מעל/על) · <i lang="it">sotto</i> (מתחת) · <i lang="it">accanto a</i> (ליד) · <i lang="it">in fondo a</i> (בסוף) · <i lang="it">tra / fra</i> (בין) · <i lang="it">in mezzo a</i> (באמצע) · <i lang="it">a destra / a sinistra</i> (מימין / משמאל)</p>
<p>💡 <i lang="it">sopra, sotto, dentro</i> אפשר עם <i lang="it">a</i> או בלי: <i lang="it">sotto il letto / sotto al letto</i>. <i lang="it">accanto a</i> ו-<i lang="it">in fondo a</i> – תמיד עם a.</p>
<p>קומות: <i lang="it">Abito al terzo piano.</i> · <i lang="it">il piano terra</i> = קומת קרקע.</p>`,
    items: [
      ["l'appartamento", "הדירה", "Il mio appartamento è piccolo ma luminoso.", "הדירה שלי קטנה אבל מוארת."],
      ["la cucina", "המטבח", "La cucina è accanto al soggiorno.", "המטבח ליד הסלון."],
      ["il soggiorno", "הסלון", "Nel soggiorno c'è un divano.", "בסלון יש ספה."],
      ["la camera da letto", "חדר השינה", "La camera da letto è grande.", "חדר השינה גדול."],
      ["il bagno", "חדר האמבטיה", "Il bagno è in fondo al corridoio.", "האמבטיה בסוף המסדרון."],
      ["il balcone", "המרפסת", "Ho delle piante sul balcone.", "יש לי צמחים במרפסת."],
      ["la finestra", "החלון", "Apri la finestra?", "תפתחי את החלון?"],
      ["la porta", "הדלת", "Chiudi la porta, per favore.", "תסגרי את הדלת, בבקשה."],
      ["il letto", "המיטה", "Il gatto dorme sotto il letto.", "החתול ישן מתחת למיטה."],
      ["il divano", "הספה", "Un divano comodo.", "ספה נוחה."],
      ["l'armadio", "הארון", "I vestiti sono nell'armadio.", "הבגדים בארון."],
      ["il tavolo", "השולחן", "Il tavolo della cucina.", "שולחן המטבח."],
      ["il frigorifero", "המקרר", "Il latte è nel frigorifero.", "החלב במקרר."],
      ["il piano", "הקומה", "Abito al terzo piano.", "אני גרה בקומה השלישית."],
      ["dentro", "בתוך", "Il regalo è dentro la scatola.", "המתנה בתוך הקופסה."],
      ["fuori", "בחוץ", "Ceniamo fuori stasera?", "נאכל בחוץ הערב?"],
      ["sopra", "מעל / על", "Sopra il divano c'è un quadro.", "מעל הספה יש תמונה."],
      ["sotto", "מתחת", "Le scarpe sono sotto il letto.", "הנעליים מתחת למיטה."],
      ["in fondo a", "בסוף", "In fondo alla strada.", "בסוף הרחוב."],
      ["a destra / a sinistra", "מימין / משמאל", "Il bagno è a destra.", "השירותים מימין."],
    ],
    d: [
      ["fill", "Il gatto dorme ___ il letto. (מתחת)", "sotto", "sopra|dentro", "מתחת"],
      ["prep", "Il frigorifero è ___ cucina.", "in", "a|su", "in cucina"],
      ["fill", "Sopra il divano ___ un quadro.", "c'è", "ci sono|è", "יש (יחיד)"],
      ["fill", "Abito al terzo ___.", "piano", "pavimento|letto", "קומה"],
      ["prep", "Il bagno è in fondo ___ corridoio.", "al", "del|nel", "in fondo a + il"],
      ["prep", "La cucina è accanto ___ soggiorno.", "al", "il|del", "accanto a + il"],
      ["prep", "I vestiti sono ___ armadio. (in + l')", "nell'", "nel|all'", "nell'armadio"],
      ["fill", "Nel soggiorno ___ due poltrone.", "ci sono", "c'è|sono", "רבים"],
      ["spell", "", "frigorifero", "frigoriphero|frigorfero", "מקרר"],
      ["spell", "", "soggiorno", "sogiorno|soggiorrno", "סלון – gg"],
      ["spell", "", "armadio", "armadjo|armaddio", "ארון"],
      ["ear", "", "La camera da letto è accanto al bagno.", "המטבח ליד הסלון.|חדר השינה מעל המטבח.", "חדר השינה ליד חדר האמבטיה."],
      ["ear", "", "Le chiavi sono sul tavolo, in cucina.", "המפתחות מתחת לשולחן, בסלון.|הטלפון על השולחן, במטבח.", "המפתחות על השולחן, במטבח."],
    ],
  },
  {
    id: 'r16', it: 'Preposizioni di tempo, domande e meteo', he: 'מילות יחס של זמן, לשאול שאלות, מזג האוויר', level: 'A2', stage: 'review',
    grammar: `
<h3>זמן</h3>
<ul>
<li><b>a</b>: שעה וחודש – <i lang="it">alle otto, a maggio, a Natale</i></li>
<li><b>in</b>: עונה, שנה, חודש – <i lang="it">in estate, in inverno, nel 2027, in marzo</i></li>
<li><b>di</b>: חלק מהיום – <i lang="it">di mattina, di sera, di notte</i>; ימים – <i lang="it">di lunedì</i></li>
<li><b>da</b> + הווה = "כבר X זמן" – <i lang="it">Studio italiano <b>da</b> un anno.</i> (בעברית: "אני לומדת כבר שנה") ⚠️ לא per!</li>
<li><b>tra / fra</b> = בעוד – <i lang="it">Parto tra una settimana.</i> · <b>fa</b> = לפני – <i lang="it">due giorni fa</i></li>
<li><b>dalle… alle…</b> = מ… עד… – <i lang="it">dalle nove alle cinque</i> · <b>fino a</b> = עד</li>
<li><b>per</b> = משך זמן (בעבר/עתיד) – <i lang="it">Ho vissuto a Roma per due anni.</i></li>
</ul>
<h3>מילות שאלה</h3>
<p><i lang="it">chi</i> (מי) · <i lang="it">che cosa / cosa</i> (מה) · <i lang="it">dove</i> (איפה) · <i lang="it">quando</i> (מתי) · <i lang="it">come</i> (איך) · <i lang="it">perché</i> (למה / כי) · <i lang="it">quanto/a/i/e</i> (כמה – מתאים למין ולמספר) · <i lang="it">quale</i> (איזה)</p>
<h3>מזג האוויר</h3>
<p><i lang="it">Che tempo fa?</i> → <i lang="it">Fa caldo / freddo / bel tempo / brutto tempo. Piove. Nevica. C'è il sole. C'è vento. È nuvoloso.</i></p>`,
    items: [
      ["Che tempo fa?", "מה מזג האוויר?", "Che tempo fa a Roma oggi?", "מה מזג האוויר ברומא היום?"],
      ["fa caldo", "חם", "D'estate fa molto caldo.", "בקיץ חם מאוד."],
      ["fa freddo", "קר", "Fa freddo, metti la giacca!", "קר, תלבשי ז'קט!"],
      ["piove", "יורד גשם", "Piove, prendi l'ombrello.", "יורד גשם, קחי מטרייה."],
      ["nevica", "יורד שלג", "In montagna nevica.", "בהרים יורד שלג."],
      ["c'è il sole", "יש שמש", "Oggi c'è il sole.", "היום יש שמש."],
      ["c'è vento", "יש רוח", "C'è vento al mare.", "יש רוח בים."],
      ["nuvoloso", "מעונן", "Il cielo è nuvoloso.", "השמיים מעוננים."],
      ["l'ombrello", "המטרייה", "Ho dimenticato l'ombrello!", "שכחתי את המטרייה!"],
      ["da (+ זמן)", "כבר (משך)", "Studio italiano da un anno.", "אני לומדת איטלקית כבר שנה."],
      ["tra / fra", "בעוד", "Ci vediamo tra un'ora.", "נתראה בעוד שעה."],
      ["fa", "לפני (זמן)", "Sono arrivata due giorni fa.", "הגעתי לפני יומיים."],
      ["fino a", "עד", "Lavoro fino alle sei.", "אני עובדת עד שש."],
      ["chi", "מי", "Chi è il tuo professore?", "מי המרצה שלך?"],
      ["quando", "מתי", "Quando è l'esame?", "מתי המבחן?"],
      ["perché", "למה / כי", "Perché studi italiano?", "למה את לומדת איטלקית?"],
      ["quanto", "כמה", "Quanto costa?", "כמה זה עולה?"],
      ["quale", "איזה", "Quale preferisci?", "איזה את מעדיפה?"],
      ["Grazie! – Figurati!", "תודה! – אין על מה!", "Grazie per l'aiuto! – Figurati!", "תודה על העזרה! – אין על מה!"],
    ],
    d: [
      ["prep", "Studio italiano ___ un anno.", "da", "per|fra", "כבר שנה + הווה → da"],
      ["prep", "Lavoro dalle nove ___ cinque.", "alle", "a|fino", "dalle… alle…"],
      ["prep", "___ estate fa caldo.", "In", "A|Di", "עונה → in"],
      ["prep", "___ sera guardo la TV.", "Di", "A|In", "di sera"],
      ["prep", "Parto ___ una settimana.", "tra", "da|fa", "בעוד = tra/fra"],
      ["fill", "Sono arrivata due giorni ___.", "fa", "tra|da", "לפני = fa"],
      ["fill", "___ costa? – Dieci euro.", "Quanto", "Quando|Come", "כמה?"],
      ["fill", "___ abiti? – A Tel Aviv.", "Dove", "Quando|Chi", "איפה?"],
      ["fill", "___ studi italiano? – Perché voglio studiare in Italia.", "Perché", "Come|Quale", "למה?"],
      ["fill", "Che tempo ___ oggi?", "fa", "è|c'è", "Che tempo fa?"],
      ["fill", "Oggi ___: prendi l'ombrello!", "piove", "nevica|c'è il sole", "יורד גשם"],
      ["fill", "___ sorelle hai? (כמה)", "Quante", "Quanto|Quanti", "sorelle – נקבה רבים"],
      ["ear", "", "Domani nevica in montagna.", "היום יורד גשם בהרים.|מחר יש שמש בים.", "מחר יורד שלג בהרים."],
      ["ear", "", "Lavoro qui da tre anni.", "עבדתי כאן לפני שלוש שנים.|אעבוד כאן בעוד שלוש שנים.", "אני עובדת כאן כבר שלוש שנים."],
    ],
  },
  {
    id: 'r17', it: 'I verbi riflessivi e reciproci', he: 'פעלים חוזרים והדדיים (svegliarsi, vedersi…)', level: 'A2', stage: 'review',
    grammar: `
<h3>פעלים חוזרים – הפעולה חוזרת אליי</h3>
<p>כמו "התלבשתי", "התרחצתי" בעברית (בניין התפעל). באיטלקית מוסיפים כינוי לפני הפועל:</p>
<table>
<tr><td lang="it">io <b>mi</b> lavo</td><td lang="it">noi <b>ci</b> laviamo</td></tr>
<tr><td lang="it">tu <b>ti</b> lavi</td><td lang="it">voi <b>vi</b> lavate</td></tr>
<tr><td lang="it">lui/lei <b>si</b> lava</td><td lang="it">loro <b>si</b> lavano</td></tr>
</table>
<p>נפוצים: <i lang="it">svegliarsi</i> (להתעורר), <i lang="it">alzarsi</i> (לקום), <i lang="it">lavarsi</i>, <i lang="it">vestirsi</i>, <i lang="it">chiamarsi</i>, <i lang="it">sentirsi</i> (להרגיש), <i lang="it">divertirsi</i> (ליהנות), <i lang="it">riposarsi</i>, <i lang="it">addormentarsi</i> (להירדם), <i lang="it">prepararsi</i>, <i lang="it">sposarsi</i>.</p>
<p>💡 עם פועל מודאלי – הכינוי לפני, או מודבק לסוף: <i lang="it">Mi devo alzare = Devo alzar<b>mi</b></i>.</p>
<h3>הדדיים – "זה את זה"</h3>
<p><i lang="it">Ci vediamo domani!</i> (נתראה) · <i lang="it">Si conoscono da anni.</i> (מכירים זה את זה) · <i lang="it">Ci sentiamo!</i> (נדבר) · <i lang="it">Si amano.</i> · <i lang="it">Si salutano.</i></p>`,
    items: [
      ["svegliarsi", "להתעורר", "Mi sveglio alle sette.", "אני מתעוררת בשבע."],
      ["alzarsi", "לקום", "Mi alzo subito.", "אני קמה מיד."],
      ["lavarsi", "להתרחץ", "Mi lavo i denti.", "אני מצחצחת שיניים."],
      ["vestirsi", "להתלבש", "Mi vesto in fretta.", "אני מתלבשת מהר."],
      ["chiamarsi", "להיקרא", "Mi chiamo Naama.", "קוראים לי נעמה."],
      ["sentirsi", "להרגיש", "Oggi non mi sento bene.", "היום אני לא מרגישה טוב."],
      ["divertirsi", "ליהנות", "Ci divertiamo molto!", "אנחנו נהנים מאוד!"],
      ["riposarsi", "לנוח", "Il weekend mi riposo.", "בסוף השבוע אני נחה."],
      ["addormentarsi", "להירדם", "Mi addormento tardi.", "אני נרדמת מאוחר."],
      ["prepararsi", "להתכונן", "Mi preparo per l'esame.", "אני מתכוננת למבחן."],
      ["sposarsi", "להתחתן", "Si sposano a giugno.", "הם מתחתנים ביוני."],
      ["Ci vediamo!", "נתראה!", "Ci vediamo domani all'università.", "נתראה מחר באוניברסיטה."],
      ["Ci sentiamo!", "נדבר!", "Ci sentiamo stasera!", "נדבר הערב!"],
      ["conoscersi", "להכיר זה את זה", "Ci conosciamo da dieci anni.", "אנחנו מכירים עשר שנים."],
      ["la mattina", "בבוקר", "La mattina mi preparo un caffè.", "בבוקר אני מכינה לעצמי קפה."],
    ],
    d: [
      ["conj", "Io ___ alle sette. (svegliarsi)", "mi sveglio", "si sveglio|mi sveglia", "אני מתעוררת"],
      ["conj", "Tu ___ Naama? (chiamarsi)", "ti chiami", "si chiami|ti chiama", "קוראים לך נעמה?"],
      ["conj", "Lei ___ in fretta. (vestirsi)", "si veste", "si vesta|ti veste", "היא מתלבשת מהר"],
      ["conj", "Noi ___ molto. (divertirsi)", "ci divertiamo", "si divertiamo|ci divertimo", "אנחנו נהנים מאוד"],
      ["conj", "Voi ___ presto? (alzarsi)", "vi alzate", "si alzate|vi alzano", "אתם קמים מוקדם?"],
      ["conj", "Loro ___ a giugno. (sposarsi)", "si sposano", "ci sposano|si sposono", "הם מתחתנים ביוני"],
      ["fill", "Domani devo ___ presto. (alzarsi)", "alzarmi", "alzarsi|mi alzare", "devo alzarmi"],
      ["fill", "Oggi non ___ sento bene.", "mi", "si|ti", "אני לא מרגישה טוב"],
      ["fill", "Marco e Lucia ___ amano.", "si", "ci|vi", "הדדי – si"],
      ["conj", "Ci ___ domani! (vedere)", "vediamo", "vedete|vedono", "נתראה מחר"],
      ["conj", "La sera io ___ tardi. (addormentarsi)", "mi addormento", "mi addormenta|si addormento", "אני נרדמת מאוחר"],
      ["ear", "", "La mattina mi alzo alle sette e mi vesto subito.", "בערב אני הולכת לישון בשבע ומתקלחת.|בבוקר הוא קם בשמונה ואוכל מיד.", "בבוקר אני קמה בשבע ומתלבשת מיד."],
      ["ear", "", "Ci conosciamo da quando eravamo bambine.", "נכיר אחת את השנייה בעוד שנה.|אנחנו לא מכירות.", "אנחנו מכירות מאז שהיינו ילדות."],
    ],
  },
];

// ---------- שלב 2: A2 חדש (מעבר לקורס) – לוקחים מהקורס הבסיסי ומוסיפים תרגילים ----------
const NEW_DRILLS = {
  u13: [
    ["conj", "Ieri ___ la pizza. (mangiare, io)", "ho mangiato", "sono mangiata|ho mangiata", "עבר עם avere"],
    ["conj", "Sabato Naama ___ al mare. (andare)", "è andata", "ha andato|è andato", "תנועה → essere, מתאים לנקבה"],
    ["conj", "Noi ___ un bel film. (vedere)", "abbiamo visto", "abbiamo veduto|siamo visti", "vedere → visto"],
    ["conj", "Loro ___ tardi. (arrivare)", "sono arrivati", "hanno arrivato|sono arrivato", "essere, רבים"],
    ["conj", "Cosa ___ ieri? (fare, tu)", "hai fatto", "hai fato|sei fatta", "fare → fatto"],
    ["fill", "Ho ___ un libro bellissimo. (leggere)", "letto", "leggiuto|leggito", "leggere → letto"],
    ["conj", "Stamattina mi ___ tardi. (svegliarsi, io – נקבה)", "sono svegliata", "ho svegliato|sono svegliato", "פועל חוזר → essere"],
    ["fill", "Ho ___ il treno delle otto. (prendere)", "preso", "prenduto|prendato", "prendere → preso"],
    ["fill", "Siamo ___ alle dieci. (uscire)", "usciti", "uscito|escuti", "essere + רבים"],
    ["fill", "Ho ___ una mail al professore. (scrivere)", "scritto", "scrivuto|scrito", "scrivere → scritto"],
    ["fill", "Non ho ___ deciso. (עוד לא)", "ancora", "già|mai", "non… ancora"],
    ["ear", "", "Ieri sera sono uscita con le mie amiche.", "מחר בערב אצא עם החברות שלי.|אתמול בערב נשארתי בבית.", "אתמול בערב יצאתי עם החברות שלי."],
  ],
  u14: [
    ["fill", "Il caffè? ___ prendo subito.", "Lo", "La|Gli", "אותו (ז') = lo"],
    ["fill", "La pizza? ___ mangio stasera.", "La", "Lo|Le", "אותה = la"],
    ["fill", "I libri? ___ compro domani.", "Li", "Le|Gli", "אותם = li"],
    ["fill", "Le chiavi? Non ___ trovo!", "le", "li|la", "אותן = le"],
    ["fill", "Mi fa male ___ testa.", "la", "il|una", "mi fa male la…"],
    ["prep", "Ho mal ___ pancia.", "di", "a|alla", "ho mal di…"],
    ["fill", "Che bella giacca! Posso ___? (למדוד)", "provarla", "provare la|provarlo", "הכינוי נדבק לשם הפועל"],
    ["ear", "", "Mi fa male la gola da due giorni.", "כואבת לי הבטן מאתמול.|כואב לי הגרון כבר שבוע.", "כואב לי הגרון כבר יומיים."],
  ],
  u15: [
    ["fill", "Piove, ___ resto a casa.", "quindi", "però|perché", "לכן"],
    ["fill", "È caro, ___ è bellissimo.", "però", "quindi|perché", "אבל"],
    ["fill", "___ è quella ragazza?", "Chi", "Che|Quale", "מי?"],
    ["fill", "Domani parto per Roma, non vedo ___!", "l'ora", "la ora|ora", "Non vedo l'ora!"],
  ],
  u16: [
    ["conj", "L'anno prossimo ___ in Italia. (andare, io)", "andrò", "anderò|andarò", "עתיד: andrò"],
    ["conj", "Domani ___ a Roma. (essere, noi)", "saremo", "essiremo|saramo", "essere → sarò, saremo"],
    ["conj", "___ tempo stasera? (avere, tu)", "Avrai", "Averai|Avai", "avere → avrò, avrai"],
    ["conj", "Loro ___ un viaggio. (fare)", "faranno", "farono|fanno", "fare → farò, faranno"],
    ["conj", "Io ___ medicina in Italia. (studiare)", "studierò", "studiarò|studiero", "are → erò"],
    ["prep", "Spero ___ passare l'esame.", "di", "a|che", "sperare di"],
    ["prep", "L'esame è ___ quattro mesi.", "tra", "da|fa", "בעוד = tra"],
    ["ear", "", "Il prossimo anno studierò medicina a Bologna.", "בשנה שעברה למדתי רפואה ברומא.|בשנה הבאה אעבוד בבית חולים במילאנו.", "בשנה הבאה אלמד רפואה בבולוניה."],
  ],
};

const NEW = BASE.filter((u) => ['u13', 'u14', 'u15', 'u16'].includes(u.id)).map((u) => ({ ...u, stage: 'new', d: NEW_DRILLS[u.id] || [] }));
// יחידות B1–B2: הדקדוק מהקורס הבסיסי; מילים ותרגילים – מהמורה
const ADV = BASE.filter((u) => /^b\d+$/.test(u.id)).map((u) => ({ ...u, stage: 'new', d: [] }));

// יחידות שנוספו במיוחד בשביל לימודי רפואה באיטליה
const MED = [
  {
    id: 'b21', it: "Studiare all'università", he: 'לימודים באוניברסיטה באיטליה', level: 'B1', stage: 'new', items: [], d: [],
    gen: 'University life in Italy for an international student: enrollment (iscrizione), faculties, courses, lectures, exams (appello, esame orale/scritto, voto in trentesimi, 30 e lode), CFU, libretto, segreteria, borse di studio, alloggio, tesi. High-frequency B1 vocabulary.',
    grammar: `<h3>האוניברסיטה באיטליה – מילים שחייבים להכיר</h3>
<p><i lang="it">iscriversi all'università</i> (להירשם) · <i lang="it">la facoltà / il corso di laurea</i> (פקולטה / תוכנית לימודים) · <i lang="it">la lezione</i> (הרצאה) · <i lang="it">il/la docente</i> (מרצה) · <i lang="it">l'appello</i> (מועד בחינה) · <i lang="it">la segreteria</i> (מזכירות).</p>
<p>💡 ציונים באוניברסיטה הם מתוך 30: <i lang="it">18</i> = עובר, <i lang="it">30 e lode</i> = מצטיין. הרבה מבחנים הם <b>בעל-פה</b> (<i lang="it">esame orale</i>) – עוד סיבה לתרגל דיבור!</p>
<p>ביטויים: <i lang="it">dare un esame</i> (לגשת למבחן) · <i lang="it">superare / passare un esame</i> (לעבור) · <i lang="it">essere bocciato</i> (להיכשל) · <i lang="it">laurearsi</i> (לסיים תואר).</p>`,
  },
  {
    id: 'b22', it: 'Medicina e scienze', he: 'רפואה, גוף האדם ומדעים', level: 'B2', stage: 'new', items: [], d: [],
    gen: 'Medicine and science for a future medical student: anatomy and organs, symptoms and diseases, hospital and wards, doctor-patient communication, biology and chemistry basics, scientific method. High-frequency B1-B2 vocabulary (not rare jargon).',
    grammar: `<h3>שפה מדעית – מה שונה?</h3>
<p>הרבה מילים רפואיות דומות לאנגלית ולעברית (מלטינית): <i lang="it">il cuore</i> (לב, cardiologia), <i lang="it">il polmone</i>, <i lang="it">il fegato</i> (כבד), <i lang="it">il rene</i> (כליה), <i lang="it">il sangue</i> (דם).</p>
<p>בטקסטים מדעיים נפוץ <b>הסביל</b> ו-<b>si impersonale</b>: <i lang="it">Il campione viene analizzato. Si misura la pressione.</i></p>
<p>💡 רבים יוצאי דופן: <i lang="it">l'osso → le ossa</i>, <i lang="it">il labbro → le labbra</i>, <i lang="it">il ginocchio → le ginocchia</i>.</p>`,
  },
];

// שלב ב' בסוזי אקדמי הוא קורס מדעים (כימיה, פיזיקה, ביולוגיה) – אוצר המילים המדעי נכנס כבר ב-B1
MED.push({
  id: 'b23', it: 'Lessico scientifico: chimica, fisica, biologia', he: 'אוצר מילים מדעי: כימיה, פיזיקה, ביולוגיה', level: 'B1', stage: 'new', items: [], d: [],
  gen: 'Core scientific vocabulary in Italian for a pre-med student who will study chemistry, physics and biology in Italian: the cell, DNA, organs and systems, atoms, molecules, reactions, acids and bases, solutions, energy, force, mass, speed, units of measurement, numbers and formulas read aloud, verbs for describing processes and experiments (misurare, calcolare, reagire, contenere, dimostrare). High-frequency, exam-relevant words only.',
  grammar: `<h3>לקרוא נוסחאות ומספרים בקול</h3>
<p><i lang="it">H₂O</i> = <i lang="it">acca due o</i> · <i lang="it">3,5</i> = <i lang="it">tre virgola cinque</i> (באיטליה פסיק עשרוני!) · <i lang="it">10³</i> = <i lang="it">dieci alla terza</i> · <i lang="it">x²</i> = <i lang="it">x al quadrato</i> · <i lang="it">%</i> = <i lang="it">per cento</i>.</p>
<p>💡 שמות מדעים ומונחים רבים כמעט זהים לאנגלית: <i lang="it">la cellula, la molecola, l'energia, la reazione</i>. שימי לב למין: מילים ב-<b>-ione</b> הן נקבה (<i lang="it">la soluzione, la funzione</i>), וב-<b>-ma</b> ממקור יווני – זכר (<i lang="it">il sistema, il problema, l'enzima</i>).</p>
<p>במבחני הקבלה ובקורסים מתארים תהליכים בסביל ו-si: <i lang="it">La soluzione viene riscaldata. Si misura la temperatura.</i></p>`,
});

export const UNITS = [...REVIEW, ...NEW, ...ADV.slice(0, 8), MED[0], MED[2], ...ADV.slice(8), MED[1]];

export const STAGES = {
  review: { he: 'שלב 1 · חיזוק מה שלמדת בקורס', short: 'חיזוק' },
  new: { he: 'שלב 2–3 · נושאים חדשים בדרך ל-B2', short: 'חדש' },
  course: { he: 'מהקורס בסוזי אקדמי', short: 'קורס' },
};

// מבחן אבחון: 2 שאלות לכל נושא בשלב החיזוק (התרגילים הראשונים של כל יחידה)
export const DIAG_PER_UNIT = 2;

// תרחישי שיחה – עם פנייה בלשון נקבה לנעמה, ותרחישים לחיים כסטודנטית לרפואה באיטליה
// after = מומלץ אחרי שהתחלת את היחידה הזו (נעמה כבר למדה A1–A2 בקורס, אז רוב השיחות הבסיסיות פתוחות מההתחלה)
const SCEN_AFTER = { meet: 'r3', bar: 'r9', rest: 'r9', hotel: 'r14', dir: 'r14', train: 'r14', shop: 'r7', doc: 'u14', past: 'u13', plans: 'u16', memories: 'b1', interview: 'b5', complaint: 'b5', debate: 'b14', whatif: 'b10', news: 'b13' };
export const SCENARIOS = [
  ...BASE_SCEN.map((s) => ({ ...s, after: SCEN_AFTER[s.id] || '' })),
  { id: 'flat', icon: '🏠', he: 'לשכור חדר ליד האוניברסיטה', it: 'Cerco casa', after: 'r15',
    setup: 'You are a landlady in Bologna renting a room to a student. Describe the flat (rooms, furniture, floor), the price and rules; answer the learner\'s questions about the house and the neighborhood.' },
  { id: 'segreteria', icon: '🎓', he: 'במזכירות האוניברסיטה', it: 'In segreteria', after: 'b21',
    setup: 'You are an employee at the student office (segreteria studenti) of an Italian university. The learner is an international student who wants to enroll in Medicine: discuss documents, the Italian language certificate (B2), deadlines, fees and the timetable.' },
  { id: 'orale', icon: '🎤', he: 'בחינה בעל-פה (בסגנון CILS/CELI)', it: 'Esame orale', after: 'u13',
    setup: 'You are an examiner for an Italian B2 certification (CILS B2 / CELI 3) oral exam. First ask the candidate to introduce herself; then give her a topic to talk about for 2-3 minutes (study, health, environment, technology, travel); then ask follow-up questions asking for opinions and reasons. Keep a friendly but formal tone (use Lei).' },
  { id: 'paziente', icon: '🩺', he: 'רופאה ומטופל', it: 'Dal medico', after: 'b22',
    setup: 'Role-play: the LEARNER is a medical student doing a patient interview (anamnesi); YOU are the patient, an elderly Italian man with a stomach ache and a cough. Answer her questions naturally; only reveal details if asked. Use simple everyday words for symptoms.' },
];

export const STORY_TOPICS = [
  'יום ראשון באוניברסיטה בבולוניה', 'החדר החדש של נעמה', 'הגנב האלגנטי חוזר', 'משפחה איטלקית בארוחת יום ראשון',
  'יום בחיי סטודנטית לרפואה', 'בוקר בבית חולים', 'מזג האוויר משתנה בהרים', 'טיול סוף שבוע לפירנצה',
  ...BASE_TOPICS.slice(0, 12),
];
