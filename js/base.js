// תוכן הקורס: יחידות לפי סדר שכיחות ושימושיות (A1→A2).
// כל פריט: [איטלקית, עברית, משפט דוגמה באיטלקית, תרגום המשפט]
// שמות עצם מופיעים עם יידוע (il/la...) כי לומדים את המין יחד עם המילה.

export const UNITS = [
  {
    id: 'u1', it: 'Saluti', he: 'שלום ונימוסים', level: 'A1',
    grammar: `
<h3>הגייה – 6 כללים שמספיקים כמעט לכל מילה</h3>
<p>איטלקית נקראת כמו שהיא נכתבת. מה שבאמת צריך לזכור:</p>
<ul>
<li><b lang="it">c / g</b> לפני <b>e, i</b> נשמעות "צ'" ו"ג'": <i lang="it">ciao</i> = צ'או, <i lang="it">gelato</i> = ג'לאטו. לפני a/o/u הן "ק" ו"ג".</li>
<li><b lang="it">ch / gh</b> = "ק" ו"ג" קשות: <i lang="it">che</i> = קה, <i lang="it">spaghetti</i> = ספגטי.</li>
<li><b lang="it">gli</b> ≈ "לְיִ" רכה: <i lang="it">famiglia</i>. <b lang="it">gn</b> ≈ "נְי": <i lang="it">gnocchi</i>.</li>
<li><b lang="it">sc</b> לפני e/i = "ש": <i lang="it">scusi</i> = סקוזי, אבל <i lang="it">pesce</i> = פֶּשֶה.</li>
<li><b>אותיות כפולות</b> נהגות ארוך יותר: <i lang="it">pala</i> ≠ <i lang="it">palla</i>. זה משנה משמעות!</li>
<li><b lang="it">h</b> תמיד שקטה. <b lang="it">r</b> מתגלגלת (קצה הלשון).</li>
</ul>
<p>💡 לדוברי עברית: התנועות באיטלקית "נקיות" כמו בעברית (a, e, i, o, u) – יתרון גדול לכם.</p>`,
    items: [
      ['ciao', 'היי / ביי (לא רשמי)', 'Ciao, Marco! Come stai?', 'היי מרקו! מה שלומך?'],
      ['buongiorno', 'בוקר טוב / שלום (רשמי, עד אחה"צ)', 'Buongiorno, signora!', 'בוקר טוב, גברתי!'],
      ['buonasera', 'ערב טוב', 'Buonasera, un tavolo per due?', 'ערב טוב, שולחן לשניים?'],
      ['buonanotte', 'לילה טוב', 'Buonanotte, a domani!', 'לילה טוב, נתראה מחר!'],
      ['arrivederci', 'להתראות', 'Grazie e arrivederci!', 'תודה ולהתראות!'],
      ['a domani', 'נתראה מחר', 'Ciao, a domani!', 'ביי, נתראה מחר!'],
      ['grazie', 'תודה', 'Grazie mille!', 'תודה רבה!'],
      ['prego', 'בבקשה / על לא דבר', 'Grazie! – Prego!', 'תודה! – על לא דבר!'],
      ['per favore', 'בבקשה (כשמבקשים)', 'Un caffè, per favore.', 'קפה אחד, בבקשה.'],
      ['scusi', 'סליחה (רשמי)', 'Scusi, dov\'è la stazione?', 'סליחה, איפה התחנה?'],
      ['scusa', 'סליחה (לא רשמי)', 'Scusa, non ho capito.', 'סליחה, לא הבנתי.'],
      ['sì', 'כן', 'Sì, certo!', 'כן, בטח!'],
      ['no', 'לא', 'No, grazie.', 'לא, תודה.'],
      ['Come stai?', 'מה שלומך? (לא רשמי)', 'Ciao Anna, come stai?', 'היי אנה, מה שלומך?'],
      ['Come sta?', 'מה שלומך? (רשמי)', 'Buongiorno, come sta?', 'בוקר טוב, מה שלומך?'],
      ['Sto bene', 'אני בסדר / טוב לי', 'Sto bene, grazie. E tu?', 'אני בסדר, תודה. ואתה?'],
      ['E tu?', 'ואתה? / ואת?', 'Sto bene, e tu?', 'אני בסדר, ואתה?'],
      ['Mi chiamo…', 'קוראים לי…', 'Mi chiamo David.', 'קוראים לי דוד.'],
      ['Come ti chiami?', 'איך קוראים לך?', 'Ciao! Come ti chiami?', 'היי! איך קוראים לך?'],
      ['Piacere!', 'נעים מאוד!', 'Piacere, io sono Sara.', 'נעים מאוד, אני שרה.'],
      ['Non ho capito', 'לא הבנתי', 'Scusi, non ho capito.', 'סליחה, לא הבנתי.'],
      ['Può ripetere?', 'אפשר לחזור על זה? (רשמי)', 'Può ripetere, per favore?', 'אפשר לחזור על זה, בבקשה?'],
    ],
  },
  {
    id: 'u2', it: 'Io sono…', he: 'אני ואתה – הפועל "להיות"', level: 'A1',
    grammar: `
<h3>essere – להיות</h3>
<p>בעברית בהווה אין "להיות" ("אני ישראלי"). באיטלקית <b>חייבים</b> אותו:</p>
<table>
<tr><td lang="it">io sono</td><td>אני</td></tr>
<tr><td lang="it">tu sei</td><td>אתה/את</td></tr>
<tr><td lang="it">lui / lei è</td><td>הוא / היא</td></tr>
<tr><td lang="it">noi siamo</td><td>אנחנו</td></tr>
<tr><td lang="it">voi siete</td><td>אתם/אתן</td></tr>
<tr><td lang="it">loro sono</td><td>הם/הן</td></tr>
</table>
<p>💡 בדרך כלל משמיטים את הכינוי: <i lang="it">Sono israeliano</i> (ולא io sono) – כי הפועל כבר אומר מי.</p>
<p>💡 <b>פנייה רשמית:</b> לזרים ולמבוגרים פונים ב-<i lang="it">Lei</i> ("היא") עם פועל של גוף שלישי: <i lang="it">Lei è italiano?</i> = "האם אתה איטלקי?" (בנימוס). אין לזה מקבילה בעברית.</p>
<p>💡 שמות תואר משנים מין כמו בעברית: <i lang="it">israeliano</i> (ז) / <i lang="it">israeliana</i> (נ).</p>`,
    items: [
      ['io', 'אני', 'Io sono Marco, e tu?', 'אני מרקו, ואתה?'],
      ['tu', 'אתה / את', 'Tu sei italiana?', 'את איטלקייה?'],
      ['lui', 'הוא', 'Lui è mio fratello.', 'הוא אחי.'],
      ['lei', 'היא', 'Lei è molto simpatica.', 'היא מאוד נחמדה.'],
      ['Lei', 'אתה/את (פנייה רשמית)', 'Lei è il signor Rossi?', 'אתה מר רוסי?'],
      ['noi', 'אנחנו', 'Noi siamo di Haifa.', 'אנחנו מחיפה.'],
      ['voi', 'אתם / אתן', 'Voi siete in vacanza?', 'אתם בחופשה?'],
      ['loro', 'הם / הן', 'Loro sono amici.', 'הם חברים.'],
      ['sono', 'אני (צורת "להיות") / הם', 'Sono israeliano.', 'אני ישראלי.'],
      ['sei', 'אתה/את (צורת "להיות")', 'Sei stanco?', 'אתה עייף?'],
      ['è', 'הוא/היא/זה (צורת "להיות")', 'È bellissimo!', 'זה יפהפה!'],
      ['siamo', 'אנחנו (צורת "להיות")', 'Siamo in ritardo.', 'אנחנו מאחרים.'],
      ['siete', 'אתם (צורת "להיות")', 'Di dove siete?', 'מאיפה אתם?'],
      ['israeliano / israeliana', 'ישראלי / ישראלית', 'Sono israeliana, di Tel Aviv.', 'אני ישראלית, מתל אביב.'],
      ['italiano / italiana', 'איטלקי / איטלקייה', 'Lui è italiano, di Roma.', 'הוא איטלקי, מרומא.'],
      ['Di dove sei?', 'מאיפה אתה?', 'Di dove sei? – Sono di Gerusalemme.', 'מאיפה אתה? – אני מירושלים.'],
      ['Sono di…', 'אני מ…', 'Sono di Tel Aviv.', 'אני מתל אביב.'],
      ['anche', 'גם', 'Anch\'io sono di Milano!', 'גם אני ממילאנו!'],
      ['molto', 'מאוד / הרבה', 'Sono molto contento.', 'אני מאוד שמח.'],
      ['contento / contenta', 'שמח / שמחה', 'Sono contenta di essere qui.', 'אני שמחה להיות כאן.'],
      ['stanco / stanca', 'עייף / עייפה', 'Oggi sono stanco.', 'היום אני עייף.'],
      ['qui', 'כאן', 'Siamo qui!', 'אנחנו כאן!'],
    ],
  },
  {
    id: 'u3', it: 'Le persone e le cose', he: 'שמות עצם ויידוע', level: 'A1',
    grammar: `
<h3>ה' הידיעה – באיטלקית יש כמה</h3>
<p>בעברית יש רק <b>ה</b>. באיטלקית היא תלויה במין, במספר ובאות הראשונה:</p>
<table>
<tr><th></th><th>יחיד</th><th>רבים</th></tr>
<tr><td>זכר (רגיל)</td><td lang="it">il libro</td><td lang="it">i libri</td></tr>
<tr><td>זכר לפני s+עיצור, z</td><td lang="it">lo zaino</td><td lang="it">gli zaini</td></tr>
<tr><td>לפני תנועה</td><td lang="it">l'amico</td><td lang="it">gli amici</td></tr>
<tr><td>נקבה</td><td lang="it">la casa</td><td lang="it">le case</td></tr>
</table>
<h3>"אחד/אחת" – un, una</h3>
<p>בעברית אומרים "ספר" בלי כלום. באיטלקית צריך: <i lang="it">un libro</i>, <i lang="it">una casa</i>, <i lang="it">un'amica</i>, <i lang="it">uno zaino</i>.</p>
<h3>רבים</h3>
<p><b>-o → -i</b> (libro→libri), <b>-a → -e</b> (casa→case), <b>-e → -i</b> (notte→notti). מילים שמסתיימות בתנועה מוטעמת לא משתנות: <i lang="it">la città → le città</i>.</p>
<p>💡 תמיד למדו מילה <b>עם</b> ה-il/la שלה – כך זוכרים את המין בלי מאמץ.</p>`,
    items: [
      ['la casa', 'הבית', 'La casa è grande.', 'הבית גדול.'],
      ['l\'uomo', 'האיש (רבים: gli uomini)', 'L\'uomo parla italiano.', 'האיש מדבר איטלקית.'],
      ['la donna', 'האישה', 'La donna è una dottoressa.', 'האישה היא רופאה.'],
      ['il ragazzo', 'הבחור / הנער', 'Il ragazzo è simpatico.', 'הבחור נחמד.'],
      ['la ragazza', 'הבחורה / חברה (בת זוג)', 'La mia ragazza è italiana.', 'החברה שלי איטלקייה.'],
      ['il bambino', 'הילד / התינוק', 'Il bambino dorme.', 'הילד ישן.'],
      ['l\'amico / l\'amica', 'החבר / החברה', 'È un mio amico.', 'הוא חבר שלי.'],
      ['la persona', 'האדם', 'È una persona gentile.', 'הוא אדם אדיב.'],
      ['il libro', 'הספר', 'Leggo un libro.', 'אני קורא ספר.'],
      ['l\'acqua', 'המים', 'Un bicchiere d\'acqua, per favore.', 'כוס מים, בבקשה.'],
      ['il caffè', 'הקפה', 'Il caffè è buonissimo.', 'הקפה מעולה.'],
      ['la città', 'העיר', 'Roma è una città bellissima.', 'רומא היא עיר יפהפייה.'],
      ['il giorno', 'היום (יממה)', 'Che bel giorno!', 'איזה יום יפה!'],
      ['la notte', 'הלילה', 'La notte è fredda.', 'הלילה קר.'],
      ['l\'anno', 'השנה', 'Quest\'anno vado in Italia.', 'השנה אני נוסע לאיטליה.'],
      ['il lavoro', 'העבודה', 'Il lavoro è interessante.', 'העבודה מעניינת.'],
      ['la cosa', 'הדבר', 'Una cosa importante.', 'דבר חשוב.'],
      ['il tempo', 'הזמן / מזג האוויר', 'Non ho tempo.', 'אין לי זמן.'],
      ['la vita', 'החיים', 'La vita è bella.', 'החיים יפים.'],
      ['il telefono', 'הטלפון', 'Dov\'è il mio telefono?', 'איפה הטלפון שלי?'],
      ['la chiave', 'המפתח', 'Ho perso la chiave.', 'איבדתי את המפתח.'],
      ['lo zaino', 'התרמיל', 'Lo zaino è pesante.', 'התרמיל כבד.'],
    ],
  },
  {
    id: 'u4', it: 'Numeri e ore', he: 'מספרים, מחירים ושעות', level: 'A1',
    grammar: `
<h3>מספרים</h3>
<p>1–10: <i lang="it">uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci</i>.<br>
11–20: <i lang="it">undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti</i>.<br>
עשרות: <i lang="it">trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta, cento, mille</i>.</p>
<p>צירוף: <i lang="it">ventitré</i> (23), <i lang="it">trentacinque</i> (35). לפני uno/otto נופלת התנועה: <i lang="it">ventuno, ventotto</i>.</p>
<h3>מה השעה?</h3>
<p><i lang="it">Che ore sono?</i> → <i lang="it">Sono le tre</i> (זו "השלוש" ברבים!), אבל <i lang="it">È l'una</i> (אחת), <i lang="it">È mezzogiorno</i>.</p>
<p>רבע וחצי: <i lang="it">le tre e un quarto</i>, <i lang="it">le tre e mezza</i>, <i lang="it">le quattro meno un quarto</i>.</p>
<p>"בשעה": <i lang="it">alle otto</i> (ב-8), <i lang="it">all'una</i>.</p>`,
    items: [
      ['uno', 'אחד', 'Ho solo un fratello.', 'יש לי רק אח אחד.'],
      ['due', 'שתיים', 'Due caffè, per favore.', 'שני קפה, בבקשה.'],
      ['tre', 'שלוש', 'Sono le tre.', 'השעה שלוש.'],
      ['quattro', 'ארבע', 'Siamo in quattro.', 'אנחנו ארבעה.'],
      ['cinque', 'חמש', 'Cinque minuti!', 'חמש דקות!'],
      ['sei', 'שש', 'Alle sei di sera.', 'בשש בערב.'],
      ['sette', 'שבע', 'Sette giorni a settimana.', 'שבעה ימים בשבוע.'],
      ['otto', 'שמונה', 'Il treno parte alle otto.', 'הרכבת יוצאת בשמונה.'],
      ['nove', 'תשע', 'Apre alle nove.', 'פותח בתשע.'],
      ['dieci', 'עשר', 'Costa dieci euro.', 'זה עולה עשרה יורו.'],
      ['venti', 'עשרים', 'Venti euro, grazie.', 'עשרים יורו, תודה.'],
      ['cento', 'מאה', 'Cento grammi di prosciutto.', 'מאה גרם פרושוטו.'],
      ['mille', 'אלף', 'Mille grazie!', 'אלף תודות!'],
      ['Quanto costa?', 'כמה זה עולה?', 'Scusi, quanto costa questo?', 'סליחה, כמה זה עולה?'],
      ['Che ore sono?', 'מה השעה?', 'Scusa, che ore sono?', 'סליחה, מה השעה?'],
      ['a che ora…?', 'באיזו שעה…?', 'A che ora parte il treno?', 'באיזו שעה יוצאת הרכבת?'],
      ['oggi', 'היום', 'Oggi fa caldo.', 'היום חם.'],
      ['domani', 'מחר', 'Ci vediamo domani.', 'נתראה מחר.'],
      ['ieri', 'אתמול', 'Ieri ero a Roma.', 'אתמול הייתי ברומא.'],
      ['adesso', 'עכשיו', 'Adesso non posso.', 'עכשיו אני לא יכול.'],
      ['il minuto', 'הדקה', 'Arrivo tra cinque minuti.', 'אני מגיע בעוד חמש דקות.'],
      ['l\'ora', 'השעה', 'Un\'ora di treno.', 'שעה ברכבת.'],
    ],
  },
  {
    id: 'u5', it: 'Avere e la famiglia', he: 'יש לי – משפחה', level: 'A1',
    grammar: `
<h3>avere – "יש ל…"</h3>
<p>בעברית "יש לי". באיטלקית זה פועל: "אני מחזיק".</p>
<table>
<tr><td lang="it">ho</td><td>יש לי</td></tr><tr><td lang="it">hai</td><td>יש לך</td></tr>
<tr><td lang="it">ha</td><td>יש לו/לה</td></tr><tr><td lang="it">abbiamo</td><td>יש לנו</td></tr>
<tr><td lang="it">avete</td><td>יש לכם</td></tr><tr><td lang="it">hanno</td><td>יש להם</td></tr>
</table>
<p>(ה-h שקטה: <i lang="it">ho</i> = "או").</p>
<h3>⚠️ מלכודת לדוברי עברית</h3>
<p>תחושות בונים עם avere, לא עם "להיות":<br>
<i lang="it">Ho fame</i> = אני רעב ("יש לי רעב"), <i lang="it">ho sete</i>, <i lang="it">ho freddo</i>, <i lang="it">ho caldo</i>, <i lang="it">ho sonno</i>.<br>
גיל: <i lang="it">Ho trent'anni</i> = אני בן 30 ("יש לי 30 שנה").</p>
<h3>שלי, שלך</h3>
<p>באים <b>לפני</b> שם העצם ועם יידוע: <i lang="it">la mia casa</i> (הבית שלי). חריג: בן משפחה ביחיד – בלי יידוע: <i lang="it">mia madre, mio padre</i>.</p>`,
    items: [
      ['ho', 'יש לי', 'Ho una sorella.', 'יש לי אחות.'],
      ['hai', 'יש לך', 'Hai fratelli?', 'יש לך אחים?'],
      ['ha', 'יש לו / לה', 'Ha due figli.', 'יש לו שני ילדים.'],
      ['abbiamo', 'יש לנו', 'Abbiamo un cane.', 'יש לנו כלב.'],
      ['hanno', 'יש להם', 'Hanno una casa al mare.', 'יש להם בית ליד הים.'],
      ['la famiglia', 'המשפחה', 'La mia famiglia è grande.', 'המשפחה שלי גדולה.'],
      ['il padre', 'האב', 'Mio padre è medico.', 'אבא שלי רופא.'],
      ['la madre', 'האם', 'Mia madre cucina benissimo.', 'אמא שלי מבשלת מעולה.'],
      ['il fratello', 'האח', 'Mio fratello abita a Eilat.', 'אחי גר באילת.'],
      ['la sorella', 'האחות', 'Mia sorella ha vent\'anni.', 'אחותי בת עשרים.'],
      ['il figlio', 'הבן', 'Nostro figlio studia.', 'הבן שלנו לומד.'],
      ['la figlia', 'הבת', 'Mia figlia ama la pizza.', 'הבת שלי אוהבת פיצה.'],
      ['il marito', 'הבעל', 'Mio marito lavora molto.', 'בעלי עובד הרבה.'],
      ['la moglie', 'האישה (רעיה)', 'Mia moglie è di Napoli.', 'אשתי מנאפולי.'],
      ['i genitori', 'ההורים', 'I miei genitori sono in pensione.', 'ההורים שלי בפנסיה.'],
      ['il nonno / la nonna', 'הסבא / הסבתא', 'La nonna fa la pasta in casa.', 'סבתא מכינה פסטה בבית.'],
      ['Quanti anni hai?', 'בן כמה אתה?', 'Quanti anni hai? – Ho quarant\'anni.', 'בן כמה אתה? – אני בן ארבעים.'],
      ['ho fame', 'אני רעב', 'Ho fame, mangiamo?', 'אני רעב, נאכל?'],
      ['ho sete', 'אני צמא', 'Ho sete, c\'è dell\'acqua?', 'אני צמא, יש מים?'],
      ['ho freddo / ho caldo', 'קר לי / חם לי', 'Ho freddo, chiudi la finestra?', 'קר לי, תסגור את החלון?'],
      ['mio / mia', 'שלי (ז/נ)', 'Questa è la mia valigia.', 'זו המזוודה שלי.'],
      ['tuo / tua', 'שלך (ז/נ)', 'È tuo questo?', 'זה שלך?'],
    ],
  },
  {
    id: 'u6', it: 'Verbi in -are', he: 'פעלים ב-are: לדבר, לאכול, לעבוד', level: 'A1',
    grammar: `
<h3>נטיית הווה – פעלים ב-are (הקבוצה הגדולה)</h3>
<p>בעברית בהווה הפועל משתנה רק לפי מין ומספר (מדבר/מדברת). באיטלקית הוא משתנה לפי <b>גוף</b> – 6 צורות:</p>
<table>
<tr><td lang="it">parl<b>o</b></td><td>אני מדבר</td></tr><tr><td lang="it">parl<b>i</b></td><td>אתה מדבר</td></tr>
<tr><td lang="it">parl<b>a</b></td><td>הוא/היא מדבר/ת</td></tr><tr><td lang="it">parl<b>iamo</b></td><td>אנחנו מדברים</td></tr>
<tr><td lang="it">parl<b>ate</b></td><td>אתם מדברים</td></tr><tr><td lang="it">parl<b>ano</b></td><td>הם מדברים</td></tr>
</table>
<p>מורידים <b>-are</b> ומוסיפים את הסיומת. אותו דבר לכל הפעלים ביחידה.</p>
<h3>שלילה</h3>
<p>פשוט מוסיפים <i lang="it">non</i> לפני הפועל: <i lang="it">Non parlo tedesco</i> = אני לא מדבר גרמנית.</p>
<p>💡 שאלה = אותו משפט עם אינטונציה עולה: <i lang="it">Parli italiano?</i></p>`,
    items: [
      ['parlare', 'לדבר', 'Parlo un po\' di italiano.', 'אני מדבר קצת איטלקית.'],
      ['mangiare', 'לאכול', 'Mangiamo insieme?', 'נאכל ביחד?'],
      ['lavorare', 'לעבוד', 'Lavoro in un ufficio.', 'אני עובד במשרד.'],
      ['abitare', 'לגור', 'Abito a Tel Aviv.', 'אני גר בתל אביב.'],
      ['studiare', 'ללמוד', 'Studio l\'italiano ogni giorno.', 'אני לומד איטלקית כל יום.'],
      ['imparare', 'ללמוד (לרכוש ידע)', 'Voglio imparare a cucinare.', 'אני רוצה ללמוד לבשל.'],
      ['cercare', 'לחפש', 'Cerco un buon ristorante.', 'אני מחפש מסעדה טובה.'],
      ['trovare', 'למצוא', 'Non trovo le chiavi.', 'אני לא מוצא את המפתחות.'],
      ['comprare', 'לקנות', 'Compro il pane.', 'אני קונה לחם.'],
      ['pagare', 'לשלם', 'Posso pagare con la carta?', 'אפשר לשלם בכרטיס?'],
      ['guardare', 'להסתכל / לצפות', 'Guardiamo un film stasera?', 'נראה סרט הערב?'],
      ['ascoltare', 'להקשיב', 'Ascolto musica italiana.', 'אני מקשיב למוזיקה איטלקית.'],
      ['aspettare', 'לחכות', 'Aspetto l\'autobus.', 'אני מחכה לאוטובוס.'],
      ['arrivare', 'להגיע', 'Arrivo subito!', 'אני מגיע מיד!'],
      ['tornare', 'לחזור', 'Torno a casa alle sei.', 'אני חוזר הביתה בשש.'],
      ['amare', 'לאהוב', 'Amo l\'Italia.', 'אני אוהב את איטליה.'],
      ['chiamare', 'לקרוא / להתקשר', 'Ti chiamo domani.', 'אתקשר אליך מחר.'],
      ['pensare', 'לחשוב', 'Penso di sì.', 'אני חושב שכן.'],
      ['non', 'לא (לפני פועל)', 'Non lavoro il sabato.', 'אני לא עובד בשבת.'],
      ['ogni giorno', 'כל יום', 'Cammino ogni giorno.', 'אני הולך ברגל כל יום.'],
      ['un po\'', 'קצת', 'Parlo un po\' d\'inglese.', 'אני מדבר קצת אנגלית.'],
      ['insieme', 'ביחד', 'Studiamo insieme.', 'בואו נלמד ביחד.'],
    ],
  },
  {
    id: 'u7', it: 'Al bar e al ristorante', he: 'בבית קפה ובמסעדה', level: 'A1',
    grammar: `
<h3>vorrei – "הייתי רוצה"</h3>
<p>הדרך המנומסת להזמין: <i lang="it">Vorrei un cappuccino</i>. עדיף על <i lang="it">voglio</i> (אני רוצה), שנשמע תובעני.</p>
<h3>קצת מ… – del, della</h3>
<p>כשמדברים על כמות לא מוגדרת ("קצת לחם", "יין"): <i lang="it">del pane</i>, <i lang="it">della pasta</i>, <i lang="it">dell'acqua</i>, <i lang="it">dei biscotti</i>. בעברית פשוט משמיטים – באיטלקית זה נשמע טבעי יותר עם.</p>
<h3>💡 תרבות</h3>
<ul>
<li>קפוצ'ינו – רק בבוקר. אחרי ארוחה מזמינים <i lang="it">un caffè</i> (=אספרסו).</li>
<li>החשבון לא מגיע לבד – מבקשים: <i lang="it">Il conto, per favore</i>.</li>
<li><i lang="it">coperto</i> בחשבון = דמי שולחן, זה חוקי ומקובל.</li>
</ul>`,
    items: [
      ['vorrei', 'הייתי רוצה (בנימוס)', 'Vorrei un cappuccino, per favore.', 'אשמח לקפוצ\'ינו, בבקשה.'],
      ['il conto', 'החשבון', 'Il conto, per favore.', 'את החשבון, בבקשה.'],
      ['un tavolo per due', 'שולחן לשניים', 'Avete un tavolo per due?', 'יש לכם שולחן לשניים?'],
      ['il menù', 'התפריט', 'Posso vedere il menù?', 'אפשר לראות את התפריט?'],
      ['il pane', 'הלחם', 'Ancora un po\' di pane?', 'עוד קצת לחם?'],
      ['il vino', 'היין', 'Un bicchiere di vino rosso.', 'כוס יין אדום.'],
      ['la birra', 'הבירה', 'Una birra piccola, per favore.', 'בירה קטנה, בבקשה.'],
      ['il latte', 'החלב', 'Un caffè con un po\' di latte.', 'קפה עם קצת חלב.'],
      ['il formaggio', 'הגבינה', 'Questo formaggio è buonissimo.', 'הגבינה הזו מעולה.'],
      ['la carne', 'הבשר', 'Non mangio carne.', 'אני לא אוכל בשר.'],
      ['il pesce', 'הדג', 'Il pesce è fresco?', 'הדג טרי?'],
      ['la verdura', 'הירקות', 'Un piatto di verdure grigliate.', 'צלחת ירקות על הגריל.'],
      ['la frutta', 'הפירות', 'Mangio frutta ogni mattina.', 'אני אוכל פירות כל בוקר.'],
      ['la colazione', 'ארוחת הבוקר', 'La colazione è inclusa?', 'ארוחת הבוקר כלולה?'],
      ['il pranzo', 'ארוחת הצהריים', 'Il pranzo è all\'una.', 'ארוחת הצהריים באחת.'],
      ['la cena', 'ארוחת הערב', 'Andiamo a cena fuori?', 'נצא לארוחת ערב?'],
      ['Cosa mi consiglia?', 'מה אתה ממליץ לי?', 'Cosa mi consiglia oggi?', 'מה אתה ממליץ לי היום?'],
      ['Sono vegetariano/a', 'אני צמחוני/ת', 'Sono vegetariana, c\'è qualcosa senza carne?', 'אני צמחונית, יש משהו בלי בשר?'],
      ['senza', 'בלי', 'Un caffè senza zucchero.', 'קפה בלי סוכר.'],
      ['con', 'עם', 'Pasta con pomodoro e basilico.', 'פסטה עם עגבנייה ובזיליקום.'],
      ['buonissimo', 'טעים מאוד / מעולה', 'Il tiramisù è buonissimo!', 'הטירמיסו מעולה!'],
      ['il bicchiere', 'הכוס', 'Un bicchiere d\'acqua naturale.', 'כוס מים רגילים (לא מוגזים).'],
    ],
  },
  {
    id: 'u8', it: 'Verbi in -ere e -ire', he: 'פעלים ב-ere ו-ire', level: 'A1',
    grammar: `
<h3>-ere ו--ire</h3>
<table>
<tr><th></th><th lang="it">prendere</th><th lang="it">dormire</th></tr>
<tr><td>אני</td><td lang="it">prend<b>o</b></td><td lang="it">dorm<b>o</b></td></tr>
<tr><td>אתה</td><td lang="it">prend<b>i</b></td><td lang="it">dorm<b>i</b></td></tr>
<tr><td>הוא/היא</td><td lang="it">prend<b>e</b></td><td lang="it">dorm<b>e</b></td></tr>
<tr><td>אנחנו</td><td lang="it">prend<b>iamo</b></td><td lang="it">dorm<b>iamo</b></td></tr>
<tr><td>אתם</td><td lang="it">prend<b>ete</b></td><td lang="it">dorm<b>ite</b></td></tr>
<tr><td>הם</td><td lang="it">prend<b>ono</b></td><td lang="it">dorm<b>ono</b></td></tr>
</table>
<p>שימו לב: "אני" תמיד <b>-o</b> ו"אנחנו" תמיד <b>-iamo</b> – בכל הקבוצות.</p>
<h3>פעלי -isc</h3>
<p>חלק מפעלי ire מוסיפים <b>isc</b>: <i lang="it">capisco, capisci, capisce, capiamo, capite, capiscono</i>. כך גם <i lang="it">finire, preferire, pulire</i>.</p>`,
    items: [
      ['prendere', 'לקחת / להזמין (אוכל) / לנסוע ב…', 'Prendo un caffè. E tu?', 'אני לוקח קפה. ואתה?'],
      ['vedere', 'לראות', 'Ci vediamo dopo!', 'נתראה אחר כך!'],
      ['leggere', 'לקרוא', 'Leggo il giornale ogni mattina.', 'אני קורא את העיתון כל בוקר.'],
      ['scrivere', 'לכתוב', 'Scrivo un messaggio a Luca.', 'אני כותב הודעה ללוקה.'],
      ['vivere', 'לחיות / לגור', 'Vivo in Israele.', 'אני חי בישראל.'],
      ['chiedere', 'לשאול / לבקש', 'Chiedo informazioni.', 'אני שואל לפרטים.'],
      ['rispondere', 'לענות', 'Non risponde al telefono.', 'הוא לא עונה לטלפון.'],
      ['credere', 'להאמין', 'Non ci credo!', 'אני לא מאמין!'],
      ['mettere', 'לשים', 'Metto la giacca.', 'אני שם את המעיל.'],
      ['perdere', 'לאבד / להחמיץ', 'Perdo sempre il treno!', 'אני תמיד מפספס את הרכבת!'],
      ['conoscere', 'להכיר', 'Conosci Marco?', 'אתה מכיר את מרקו?'],
      ['dormire', 'לישון', 'Dormo otto ore.', 'אני ישן שמונה שעות.'],
      ['partire', 'לצאת לדרך / לעזוב', 'Il treno parte alle dieci.', 'הרכבת יוצאת בעשר.'],
      ['sentire', 'לשמוע / להרגיש', 'Non ti sento bene.', 'אני לא שומע אותך טוב.'],
      ['aprire', 'לפתוח', 'A che ora aprite?', 'באיזו שעה אתם פותחים?'],
      ['capire', 'להבין', 'Non capisco.', 'אני לא מבין.'],
      ['finire', 'לסיים', 'Finisco alle cinque.', 'אני מסיים בחמש.'],
      ['preferire', 'להעדיף', 'Preferisco il tè.', 'אני מעדיף תה.'],
      ['offrire', 'להציע / לכבד (לשלם על מישהו)', 'Offro io!', 'אני מזמין! (משלם)'],
      ['il messaggio', 'ההודעה', 'Ti mando un messaggio.', 'אשלח לך הודעה.'],
      ['sempre', 'תמיד', 'Sei sempre in ritardo!', 'אתה תמיד מאחר!'],
      ['mai', 'אף פעם', 'Non bevo mai caffè la sera.', 'אני אף פעם לא שותה קפה בערב.'],
    ],
  },
  {
    id: 'u9', it: 'Verbi irregolari', he: 'הפעלים הכי חשובים (חריגים)', level: 'A1',
    grammar: `
<h3>10 הפעלים החריגים הנפוצים</h3>
<p>הם חריגים בדיוק כי הם הכי שימושיים. הנה "אני / אתה / הוא":</p>
<table>
<tr><td lang="it">andare</td><td lang="it">vado, vai, va</td><td>ללכת/לנסוע</td></tr>
<tr><td lang="it">fare</td><td lang="it">faccio, fai, fa</td><td>לעשות</td></tr>
<tr><td lang="it">venire</td><td lang="it">vengo, vieni, viene</td><td>לבוא</td></tr>
<tr><td lang="it">volere</td><td lang="it">voglio, vuoi, vuole</td><td>לרצות</td></tr>
<tr><td lang="it">potere</td><td lang="it">posso, puoi, può</td><td>יכול</td></tr>
<tr><td lang="it">dovere</td><td lang="it">devo, devi, deve</td><td>צריך/חייב</td></tr>
<tr><td lang="it">sapere</td><td lang="it">so, sai, sa</td><td>לדעת</td></tr>
<tr><td lang="it">stare</td><td lang="it">sto, stai, sta</td><td>להיות (מצב)/להישאר</td></tr>
<tr><td lang="it">dire</td><td lang="it">dico, dici, dice</td><td>לומר</td></tr>
<tr><td lang="it">uscire</td><td lang="it">esco, esci, esce</td><td>לצאת</td></tr>
</table>
<h3>יכול / רוצה / צריך + שם פועל</h3>
<p>בדיוק כמו בעברית: <i lang="it">Posso entrare?</i> = אפשר להיכנס? <i lang="it">Devo andare</i> = אני צריך ללכת.</p>
<p>💡 <i lang="it">fare</i> משמש גם למזג אוויר: <i lang="it">Fa caldo</i> = חם.</p>`,
    items: [
      ['andare', 'ללכת / לנסוע', 'Vado al mare domani.', 'אני נוסע לים מחר.'],
      ['vado', 'אני הולך / נוסע', 'Vado a casa.', 'אני הולך הביתה.'],
      ['fare', 'לעשות', 'Cosa fai stasera?', 'מה אתה עושה הערב?'],
      ['faccio', 'אני עושה', 'Faccio una passeggiata.', 'אני יוצא לטיול רגלי.'],
      ['venire', 'לבוא', 'Vieni con noi?', 'אתה בא איתנו?'],
      ['volere', 'לרצות', 'Vuoi un gelato?', 'אתה רוצה גלידה?'],
      ['voglio', 'אני רוצה', 'Voglio visitare Firenze.', 'אני רוצה לבקר בפירנצה.'],
      ['potere', 'יכול / לְהיות מסוגל', 'Posso aiutarti?', 'אני יכול לעזור לך?'],
      ['posso', 'אני יכול / אפשר?', 'Posso pagare qui?', 'אפשר לשלם כאן?'],
      ['dovere', 'להיות חייב / צריך', 'Devo lavorare domani.', 'אני צריך לעבוד מחר.'],
      ['devo', 'אני צריך / חייב', 'Scusa, devo andare.', 'סליחה, אני חייב ללכת.'],
      ['sapere', 'לדעת', 'Non lo so.', 'אני לא יודע.'],
      ['stare', 'להיות (מצב) / להישאר', 'Come stai? – Sto benissimo.', 'מה שלומך? – מצוין.'],
      ['dire', 'לומר', 'Come si dice "תודה" in italiano?', 'איך אומרים "תודה" באיטלקית?'],
      ['uscire', 'לצאת', 'Usciamo stasera?', 'יוצאים הערב?'],
      ['dare', 'לתת', 'Mi dai il numero?', 'תיתן לי את המספר?'],
      ['bere', 'לשתות', 'Cosa bevi?', 'מה אתה שותה?'],
      ['Fa caldo / Fa freddo', 'חם / קר (מזג אוויר)', 'Oggi fa molto caldo.', 'היום חם מאוד.'],
      ['Posso…?', 'אפשר…?', 'Posso entrare?', 'אפשר להיכנס?'],
      ['Come si dice…?', 'איך אומרים…?', 'Come si dice "מים" in italiano?', 'איך אומרים "מים" באיטלקית?'],
      ['stasera', 'הערב', 'Stasera mangiamo fuori.', 'הערב אוכלים בחוץ.'],
      ['subito', 'מיד', 'Vengo subito!', 'אני בא מיד!'],
    ],
  },
  {
    id: 'u10', it: 'In viaggio', he: 'בטיול: מקומות וכיוונים', level: 'A1',
    grammar: `
<h3>מילות יחס + יידוע = מילה אחת</h3>
<p>כמו בעברית "ב+ה = בַּ", באיטלקית מילות יחס מתמזגות עם il/la:</p>
<table>
<tr><th></th><th>il</th><th>la</th><th>l'</th><th>i</th><th>le</th></tr>
<tr><td lang="it">a (ל/ב)</td><td lang="it">al</td><td lang="it">alla</td><td lang="it">all'</td><td lang="it">ai</td><td lang="it">alle</td></tr>
<tr><td lang="it">in (ב)</td><td lang="it">nel</td><td lang="it">nella</td><td lang="it">nell'</td><td lang="it">nei</td><td lang="it">nelle</td></tr>
<tr><td lang="it">di (של)</td><td lang="it">del</td><td lang="it">della</td><td lang="it">dell'</td><td lang="it">dei</td><td lang="it">delle</td></tr>
<tr><td lang="it">da (מ/אצל)</td><td lang="it">dal</td><td lang="it">dalla</td><td lang="it">dall'</td><td lang="it">dai</td><td lang="it">dalle</td></tr>
</table>
<h3>a או in?</h3>
<p><b>a</b> + עיר: <i lang="it">a Roma</i>. <b>in</b> + ארץ/אזור: <i lang="it">in Italia, in Toscana</i>. וגם: <i lang="it">vado al mare, in centro, a casa</i>.</p>
<p>💡 <i lang="it">c'è</i> = יש (יחיד), <i lang="it">ci sono</i> = יש (רבים): <i lang="it">C'è una farmacia qui vicino?</i></p>`,
    items: [
      ['la stazione', 'התחנה (רכבת)', 'Dov\'è la stazione?', 'איפה התחנה?'],
      ['il treno', 'הרכבת', 'Il treno per Firenze è in ritardo.', 'הרכבת לפירנצה מאחרת.'],
      ['il biglietto', 'הכרטיס', 'Un biglietto per Roma, per favore.', 'כרטיס לרומא, בבקשה.'],
      ['l\'aeroporto', 'שדה התעופה', 'Come arrivo all\'aeroporto?', 'איך מגיעים לשדה התעופה?'],
      ['l\'albergo', 'המלון', 'L\'albergo è in centro.', 'המלון במרכז.'],
      ['la camera', 'החדר (במלון)', 'Ho prenotato una camera doppia.', 'הזמנתי חדר זוגי.'],
      ['la strada', 'הרחוב / הדרך', 'È questa la strada giusta?', 'זו הדרך הנכונה?'],
      ['la piazza', 'הכיכר', 'Ci vediamo in piazza.', 'ניפגש בכיכר.'],
      ['il centro', 'מרכז העיר', 'Andiamo in centro?', 'נלך למרכז?'],
      ['il mare', 'הים', 'Andiamo al mare!', 'בואו נלך לים!'],
      ['la spiaggia', 'החוף', 'La spiaggia è bellissima.', 'החוף יפהפה.'],
      ['il museo', 'המוזיאון', 'Il museo è chiuso il lunedì.', 'המוזיאון סגור בימי שני.'],
      ['Dov\'è…?', 'איפה…?', 'Scusi, dov\'è il bagno?', 'סליחה, איפה השירותים?'],
      ['c\'è / ci sono', 'יש (יחיד / רבים)', 'C\'è un bancomat qui vicino?', 'יש כספומט קרוב לכאן?'],
      ['a destra', 'ימינה', 'Giri a destra.', 'פנה ימינה.'],
      ['a sinistra', 'שמאלה', 'La farmacia è a sinistra.', 'בית המרקחת משמאל.'],
      ['dritto', 'ישר', 'Vada sempre dritto.', 'סע/לך כל הזמן ישר.'],
      ['vicino', 'קרוב', 'È vicino? – Sì, cinque minuti a piedi.', 'זה קרוב? – כן, חמש דקות ברגל.'],
      ['lontano', 'רחוק', 'È lontano da qui?', 'זה רחוק מכאן?'],
      ['a piedi', 'ברגל', 'Andiamo a piedi.', 'נלך ברגל.'],
      ['il bagno', 'השירותים / האמבטיה', 'Posso usare il bagno?', 'אפשר להשתמש בשירותים?'],
      ['prenotare', 'להזמין (מקום)', 'Vorrei prenotare un tavolo.', 'אני רוצה להזמין שולחן.'],
    ],
  },
  {
    id: 'u11', it: 'Mi piace!', he: 'אני אוהב – ותיאורים', level: 'A1',
    grammar: `
<h3>mi piace – בדיוק כמו "מוצא חן בעיניי"</h3>
<p>יתרון ענק לדוברי עברית! <i lang="it">Mi piace la pizza</i> = "הפיצה מוצאת חן בעיניי". הדבר שאוהבים הוא הנושא, ולכן:</p>
<ul>
<li>דבר אחד/פעולה: <i lang="it">mi piace</i> – <i lang="it">Mi piace il mare. Mi piace viaggiare.</i></li>
<li>כמה דברים: <i lang="it">mi piacciono</i> – <i lang="it">Mi piacciono i gatti.</i></li>
</ul>
<p>לך: <i lang="it">ti piace</i>, לו: <i lang="it">gli piace</i>, לה: <i lang="it">le piace</i>, לנו: <i lang="it">ci piace</i>.</p>
<h3>שמות תואר</h3>
<p>באים <b>אחרי</b> שם העצם ומתאימים במין ובמספר – בדיוק כמו בעברית: <i lang="it">una casa bianca, due case bianche</i>.</p>
<p>תואר שמסתיים ב-e זהה בזכר ובנקבה: <i lang="it">un uomo gentile, una donna gentile</i>.</p>`,
    items: [
      ['mi piace', 'אני אוהב (דבר אחד)', 'Mi piace molto Roma.', 'אני מאוד אוהב את רומא.'],
      ['mi piacciono', 'אני אוהב (כמה דברים)', 'Mi piacciono i film italiani.', 'אני אוהב סרטים איטלקיים.'],
      ['ti piace?', 'אתה אוהב?', 'Ti piace il gelato?', 'אתה אוהב גלידה?'],
      ['bello / bella', 'יפה', 'Che bella giornata!', 'איזה יום יפה!'],
      ['brutto / brutta', 'מכוער / רע', 'Che brutto tempo!', 'איזה מזג אוויר רע!'],
      ['grande', 'גדול', 'Una pizza grande, per favore.', 'פיצה גדולה, בבקשה.'],
      ['piccolo / piccola', 'קטן', 'Una camera piccola ma carina.', 'חדר קטן אבל חמוד.'],
      ['nuovo / nuova', 'חדש', 'Ho un telefono nuovo.', 'יש לי טלפון חדש.'],
      ['vecchio / vecchia', 'ישן / זקן', 'Una città vecchia e bellissima.', 'עיר עתיקה ויפהפייה.'],
      ['buono / buona', 'טוב / טעים', 'Questa pizza è buona.', 'הפיצה הזו טעימה.'],
      ['caro / cara', 'יקר', 'È troppo caro!', 'זה יקר מדי!'],
      ['economico', 'זול', 'Un albergo economico.', 'מלון זול.'],
      ['facile', 'קל', 'L\'italiano è facile!', 'איטלקית קלה!'],
      ['difficile', 'קשה', 'È difficile ma interessante.', 'זה קשה אבל מעניין.'],
      ['interessante', 'מעניין', 'Un libro molto interessante.', 'ספר מעניין מאוד.'],
      ['simpatico / simpatica', 'נחמד', 'Il cameriere è simpatico.', 'המלצר נחמד.'],
      ['caldo / freddo', 'חם / קר', 'Un caffè caldo.', 'קפה חם.'],
      ['troppo', 'יותר מדי', 'Fa troppo caldo.', 'חם מדי.'],
      ['poco', 'מעט', 'Ho poco tempo.', 'יש לי מעט זמן.'],
      ['tanto', 'הרבה', 'Grazie tante!', 'תודה רבה!'],
      ['perfetto', 'מושלם', 'Perfetto, grazie!', 'מושלם, תודה!'],
      ['Che bello!', 'איזה יופי!', 'Andiamo in Sicilia? Che bello!', 'נוסעים לסיציליה? איזה יופי!'],
    ],
  },
  {
    id: 'u12', it: 'La giornata', he: 'שגרת היום וימי השבוע', level: 'A2',
    grammar: `
<h3>פעלים חוזרים (riflessivi)</h3>
<p>כמו "התלבשתי / התרחצתי" בעברית (בניין התפעל) – הפעולה חוזרת אל העושה. באיטלקית מוסיפים כינוי לפני הפועל:</p>
<table>
<tr><td lang="it">mi alzo</td><td>אני קם</td></tr><tr><td lang="it">ti alzi</td><td>אתה קם</td></tr>
<tr><td lang="it">si alza</td><td>הוא קם</td></tr><tr><td lang="it">ci alziamo</td><td>אנחנו קמים</td></tr>
<tr><td lang="it">vi alzate</td><td>אתם קמים</td></tr><tr><td lang="it">si alzano</td><td>הם קמים</td></tr>
</table>
<p>💡 גם <i lang="it">mi chiamo</i> ("קוראים לי") הוא בעצם "אני קורא לעצמי".</p>
<h3>ימים</h3>
<p>בלי אות גדולה, וכל ימי השבוע זכר חוץ מ-<i lang="it">domenica</i>. "ביום שני" = <i lang="it">lunedì</i> (בלי מילת יחס). "בכל יום שני" = <i lang="it">il lunedì</i>.</p>`,
    items: [
      ['lunedì', 'יום שני', 'Lunedì comincio un nuovo lavoro.', 'ביום שני אני מתחיל עבודה חדשה.'],
      ['martedì', 'יום שלישי', 'Ci vediamo martedì.', 'נתראה ביום שלישי.'],
      ['mercoledì', 'יום רביעי', 'Il mercato è il mercoledì.', 'השוק ביום רביעי.'],
      ['giovedì', 'יום חמישי', 'Giovedì sera sono libero.', 'ביום חמישי בערב אני פנוי.'],
      ['venerdì', 'יום שישי', 'Venerdì andiamo a Venezia.', 'ביום שישי נוסעים לוונציה.'],
      ['sabato', 'שבת', 'Il sabato dormo tanto.', 'בשבת אני ישן הרבה.'],
      ['domenica', 'יום ראשון', 'La domenica pranzo con la famiglia.', 'ביום ראשון אני אוכל צהריים עם המשפחה.'],
      ['la settimana', 'השבוע', 'Due volte alla settimana.', 'פעמיים בשבוע.'],
      ['la mattina', 'הבוקר', 'La mattina bevo un caffè.', 'בבוקר אני שותה קפה.'],
      ['il pomeriggio', 'אחר הצהריים', 'Il pomeriggio lavoro.', 'אחר הצהריים אני עובד.'],
      ['la sera', 'הערב', 'La sera guardo la TV.', 'בערב אני רואה טלוויזיה.'],
      ['svegliarsi', 'להתעורר', 'Mi sveglio alle sette.', 'אני מתעורר בשבע.'],
      ['alzarsi', 'לקום', 'Mi alzo presto.', 'אני קם מוקדם.'],
      ['lavarsi', 'להתרחץ', 'Mi lavo e mi vesto.', 'אני מתרחץ ומתלבש.'],
      ['vestirsi', 'להתלבש', 'Ti vesti in fretta!', 'אתה מתלבש מהר!'],
      ['divertirsi', 'ליהנות / לבלות', 'Ci divertiamo molto!', 'אנחנו נהנים מאוד!'],
      ['riposarsi', 'לנוח', 'Domenica mi riposo.', 'ביום ראשון אני נח.'],
      ['di solito', 'בדרך כלל', 'Di solito ceno alle otto.', 'בדרך כלל אני אוכל ארוחת ערב בשמונה.'],
      ['spesso', 'לעתים קרובות', 'Vado spesso al cinema.', 'אני הולך הרבה לקולנוע.'],
      ['qualche volta', 'לפעמים', 'Qualche volta cucino io.', 'לפעמים אני מבשל.'],
      ['presto', 'מוקדם / בקרוב', 'A presto!', 'נתראה בקרוב!'],
      ['tardi', 'מאוחר', 'È tardi, andiamo!', 'מאוחר, בואו נלך!'],
    ],
  },
  {
    id: 'u13', it: 'Il passato', he: 'זמן עבר (passato prossimo)', level: 'A2',
    grammar: `
<h3>עבר = עזר + בינוני פעול</h3>
<p>כמו באנגלית "I have eaten": <i lang="it">ho mangiato</i> = אכלתי.</p>
<p>בינוני פעול: <b>-are → -ato</b>, <b>-ere → -uto</b>, <b>-ire → -ito</b> (mangiato, avuto, dormito).</p>
<h3>avere או essere?</h3>
<ul>
<li>רוב הפעלים: <b>avere</b> – <i lang="it">ho visto, hai fatto</i>.</li>
<li>תנועה/שינוי מצב (ללכת, לבוא, להגיע, לצאת, להישאר, להיוולד) ופעלים חוזרים: <b>essere</b> – <i lang="it">sono andato, è arrivata, mi sono svegliato</i>.</li>
</ul>
<p>עם essere, הסיומת מתאימה במין ובמספר – כמו בעברית "הלכתי/הלכה": <i lang="it">Marco è andato, Anna è andata, siamo andati</i>.</p>
<h3>חריגים נפוצים</h3>
<p><i lang="it">fare → fatto, dire → detto, vedere → visto, prendere → preso, essere → stato, leggere → letto, scrivere → scritto, venire → venuto, mettere → messo, aprire → aperto</i>.</p>`,
    items: [
      ['ho mangiato', 'אכלתי', 'Ho mangiato una pizza fantastica.', 'אכלתי פיצה מדהימה.'],
      ['sono andato / sono andata', 'הלכתי / נסעתי', 'Ieri sono andata al mare.', 'אתמול הלכתי לים.'],
      ['ho fatto', 'עשיתי', 'Cosa hai fatto ieri?', 'מה עשית אתמול?'],
      ['ho visto', 'ראיתי', 'Ho visto un bel film.', 'ראיתי סרט יפה.'],
      ['ho detto', 'אמרתי', 'Te l\'ho detto!', 'אמרתי לך!'],
      ['ho preso', 'לקחתי', 'Ho preso il treno delle otto.', 'לקחתי את הרכבת של שמונה.'],
      ['sono stato / sono stata', 'הייתי', 'Sei mai stato in Italia?', 'היית פעם באיטליה?'],
      ['sono arrivato', 'הגעתי', 'Sono arrivato a Milano ieri sera.', 'הגעתי למילאנו אתמול בערב.'],
      ['ho capito', 'הבנתי', 'Ah, ho capito!', 'אה, הבנתי!'],
      ['ho comprato', 'קניתי', 'Ho comprato un regalo per te.', 'קניתי לך מתנה.'],
      ['ho letto', 'קראתי', 'Ho letto il libro in due giorni.', 'קראתי את הספר ביומיים.'],
      ['ho dormito', 'ישנתי', 'Ho dormito benissimo.', 'ישנתי מצוין.'],
      ['è piaciuto', 'זה מצא חן (עבר)', 'Ti è piaciuto il museo?', 'נהנית מהמוזיאון?'],
      ['sono uscito', 'יצאתי', 'Sabato sono uscito con gli amici.', 'בשבת יצאתי עם חברים.'],
      ['mi sono svegliato', 'התעוררתי', 'Mi sono svegliato tardi.', 'התעוררתי מאוחר.'],
      ['la settimana scorsa', 'בשבוע שעבר', 'La settimana scorsa ho lavorato molto.', 'בשבוע שעבר עבדתי הרבה.'],
      ['l\'anno scorso', 'בשנה שעברה', 'L\'anno scorso sono andato a Napoli.', 'בשנה שעברה נסעתי לנאפולי.'],
      ['fa', 'לפני (זמן)', 'Due giorni fa.', 'לפני יומיים.'],
      ['già', 'כבר', 'Hai già mangiato?', 'כבר אכלת?'],
      ['non… ancora', 'עוד לא', 'Non ho ancora deciso.', 'עוד לא החלטתי.'],
      ['poi', 'אחר כך', 'Prima un caffè, poi andiamo.', 'קודם קפה, אחר כך הולכים.'],
      ['dopo', 'אחרי / אחר כך', 'Ci sentiamo dopo.', 'נדבר אחר כך.'],
    ],
  },
  {
    id: 'u14', it: 'Negozi e salute', he: 'קניות ובריאות', level: 'A2',
    grammar: `
<h3>כינויי מושא – lo, la, li, le</h3>
<p>בעברית: "אני לוקח <b>אותו</b>". באיטלקית הכינוי בא <b>לפני</b> הפועל:</p>
<ul>
<li><i lang="it">Lo prendo</i> = אני לוקח אותו (ז').</li>
<li><i lang="it">La prendo</i> = אני לוקח אותה (נ').</li>
<li><i lang="it">Li prendo / Le prendo</i> = אני לוקח אותם / אותן.</li>
</ul>
<p>"אותי / אותך / אותנו": <i lang="it">mi, ti, ci</i>. "לי / לך": <i lang="it">mi, ti</i> (<i lang="it">Mi dai…?</i> = תיתן לי…?).</p>
<h3>כואב לי</h3>
<p>שוב מבנה כמו piacere: <i lang="it">Mi fa male la testa</i> ("הראש עושה לי כאב"). או בקיצור: <i lang="it">Ho mal di testa</i>.</p>`,
    items: [
      ['il negozio', 'החנות', 'Il negozio chiude alle otto.', 'החנות נסגרת בשמונה.'],
      ['il mercato', 'השוק', 'Compro la frutta al mercato.', 'אני קונה פירות בשוק.'],
      ['il supermercato', 'הסופרמרקט', 'Vado al supermercato.', 'אני הולך לסופר.'],
      ['Posso provare?', 'אפשר למדוד?', 'Posso provare questa giacca?', 'אפשר למדוד את הז\'קט הזה?'],
      ['la taglia', 'המידה (בגדים)', 'Avete una taglia più grande?', 'יש לכם מידה גדולה יותר?'],
      ['le scarpe', 'הנעליים', 'Queste scarpe sono comode.', 'הנעליים האלה נוחות.'],
      ['la maglietta', 'החולצה (טי-שירט)', 'Una maglietta bianca.', 'חולצה לבנה.'],
      ['lo sconto', 'ההנחה', 'C\'è uno sconto?', 'יש הנחה?'],
      ['Lo prendo', 'אני לוקח אותו', 'Mi piace, lo prendo!', 'מוצא חן בעיניי, אני לוקח אותו!'],
      ['rosso', 'אדום', 'Un vestito rosso.', 'שמלה אדומה.'],
      ['bianco', 'לבן', 'Vino bianco o rosso?', 'יין לבן או אדום?'],
      ['nero', 'שחור', 'Un caffè nero.', 'קפה שחור.'],
      ['blu', 'כחול', 'Il mare è blu.', 'הים כחול.'],
      ['verde', 'ירוק', 'Gli occhi verdi.', 'עיניים ירוקות.'],
      ['la farmacia', 'בית המרקחת', 'C\'è una farmacia aperta?', 'יש בית מרקחת פתוח?'],
      ['il medico', 'הרופא', 'Devo andare dal medico.', 'אני צריך ללכת לרופא.'],
      ['Mi fa male…', 'כואב לי ה…', 'Mi fa male la gamba.', 'כואבת לי הרגל.'],
      ['ho mal di testa', 'יש לי כאב ראש', 'Ho mal di testa, hai un\'aspirina?', 'יש לי כאב ראש, יש לך אספירין?'],
      ['la testa', 'הראש', 'Mi gira la testa.', 'מסתובב לי הראש.'],
      ['la pancia', 'הבטן', 'Mi fa male la pancia.', 'כואבת לי הבטן.'],
      ['Aiuto!', 'הצילו!', 'Aiuto! Chiamate un\'ambulanza!', 'הצילו! תזמינו אמבולנס!'],
      ['la carta (di credito)', 'כרטיס האשראי', 'Accettate la carta?', 'אתם מקבלים כרטיס?'],
    ],
  },
  {
    id: 'u15', it: 'Parlare davvero', he: 'מילות שאלה, קישור ורגש', level: 'A2',
    grammar: `
<h3>מילות שאלה</h3>
<p><i lang="it">chi</i> (מי), <i lang="it">che cosa / cosa</i> (מה), <i lang="it">dove</i> (איפה), <i lang="it">quando</i> (מתי), <i lang="it">come</i> (איך), <i lang="it">perché</i> (למה – וגם "כי"!), <i lang="it">quanto</i> (כמה), <i lang="it">quale</i> (איזה).</p>
<h3>מילות "דבק" לשיחה טבעית</h3>
<p>אלה המילים שהופכות תשובות קצרות לשיחה. דוברים טבעיים משתמשים בהן כל הזמן:</p>
<p><i lang="it">allora</i> (אז…), <i lang="it">quindi</i> (לכן), <i lang="it">però</i> (אבל), <i lang="it">comunque</i> (בכל מקרה), <i lang="it">magari</i> (אולי / הלוואי), <i lang="it">dai!</i> (נו!/יאללה), <i lang="it">boh</i> (אין לי מושג).</p>
<p>💡 <i lang="it">perché</i> משמש גם לשאלה וגם לתשובה: <i lang="it">Perché? – Perché sono stanco.</i></p>`,
    items: [
      ['chi', 'מי', 'Chi è quella ragazza?', 'מי הבחורה ההיא?'],
      ['cosa', 'מה', 'Cosa vuoi fare?', 'מה אתה רוצה לעשות?'],
      ['dove', 'איפה / לאן', 'Dove andiamo?', 'לאן הולכים?'],
      ['quando', 'מתי', 'Quando parti?', 'מתי אתה נוסע?'],
      ['come', 'איך / כמו', 'Come funziona?', 'איך זה עובד?'],
      ['perché', 'למה / כי', 'Perché ridi?', 'למה אתה צוחק?'],
      ['quanto', 'כמה', 'Quanto tempo ci vuole?', 'כמה זמן זה לוקח?'],
      ['quale', 'איזה', 'Quale preferisci?', 'איזה אתה מעדיף?'],
      ['allora', 'אז', 'Allora, cosa facciamo?', 'אז, מה עושים?'],
      ['quindi', 'לכן', 'Piove, quindi resto a casa.', 'יורד גשם, לכן אני נשאר בבית.'],
      ['però', 'אבל', 'È caro, però è bello.', 'זה יקר, אבל יפה.'],
      ['ma', 'אבל', 'Vorrei venire, ma non posso.', 'הייתי רוצה לבוא, אבל אני לא יכול.'],
      ['comunque', 'בכל מקרה', 'Comunque, grazie lo stesso.', 'בכל מקרה, תודה בכל זאת.'],
      ['magari', 'אולי / הלוואי', 'Magari domani!', 'אולי מחר! / הלוואי!'],
      ['Dai!', 'נו! / יאללה!', 'Dai, andiamo!', 'יאללה, הולכים!'],
      ['davvero?', 'באמת?', 'Davvero? Non ci credo!', 'באמת? אני לא מאמין!'],
      ['certo', 'בטח / כמובן', 'Certo, nessun problema.', 'בטח, אין בעיה.'],
      ['Peccato!', 'חבל!', 'Non puoi venire? Peccato!', 'אתה לא יכול לבוא? חבל!'],
      ['Non vedo l\'ora!', 'אני לא יכול לחכות!', 'Domani parto per Roma, non vedo l\'ora!', 'מחר אני טס לרומא, אני לא יכול לחכות!'],
      ['triste', 'עצוב', 'Perché sei triste?', 'למה אתה עצוב?'],
      ['preoccupato', 'מודאג', 'Sono un po\' preoccupato.', 'אני קצת מודאג.'],
      ['Va bene', 'בסדר / מתאים', 'Alle otto va bene?', 'בשמונה מתאים?'],
    ],
  },
  {
    id: 'u16', it: 'Il futuro e i progetti', he: 'עתיד ותוכניות', level: 'A2',
    grammar: `
<h3>עתיד – futuro semplice</h3>
<p>מורידים את ה-e הסופית ומוסיפים: <b>-ò, -ai, -à, -emo, -ete, -anno</b>. בפעלי are, ה-a הופכת ל-e:</p>
<p><i lang="it">parlare → parlerò</i> (אדבר), <i lang="it">prendere → prenderò</i>, <i lang="it">partire → partirò</i>.</p>
<p>חריגים: <i lang="it">essere → sarò, avere → avrò, andare → andrò, fare → farò, venire → verrò, potere → potrò, volere → vorrò</i>.</p>
<h3>💡 הקלה גדולה</h3>
<p>לתוכניות קרובות איטלקים משתמשים פשוט ב<b>הווה</b>: <i lang="it">Domani vado a Roma</i> = מחר אסע לרומא. אין מבנה של "going to".</p>
<p>לתקוות ותוכניות: <i lang="it">Spero di…</i> (אני מקווה ל…), <i lang="it">Ho intenzione di…</i> (אני מתכוון ל…), <i lang="it">Mi piacerebbe…</i> (הייתי רוצה…).</p>`,
    items: [
      ['sarò', 'אהיה', 'Sarò a Roma a giugno.', 'אהיה ברומא ביוני.'],
      ['andrò', 'אלך / אסע', 'Andrò in Italia quest\'estate.', 'אסע לאיטליה הקיץ.'],
      ['farò', 'אעשה', 'Farò del mio meglio.', 'אעשה כמיטב יכולתי.'],
      ['avrò', 'יהיה לי', 'Avrò più tempo la settimana prossima.', 'יהיה לי יותר זמן בשבוע הבא.'],
      ['vedrò', 'אראה', 'Vedrò cosa posso fare.', 'אראה מה אני יכול לעשות.'],
      ['Spero di…', 'אני מקווה ל…', 'Spero di tornare presto.', 'אני מקווה לחזור בקרוב.'],
      ['Mi piacerebbe…', 'הייתי רוצה…', 'Mi piacerebbe vivere in Toscana.', 'הייתי רוצה לגור בטוסקנה.'],
      ['Ho intenzione di…', 'אני מתכוון ל…', 'Ho intenzione di imparare bene l\'italiano.', 'אני מתכוון ללמוד איטלקית היטב.'],
      ['la settimana prossima', 'בשבוע הבא', 'Ci vediamo la settimana prossima.', 'נתראה בשבוע הבא.'],
      ['il prossimo anno', 'בשנה הבאה', 'Il prossimo anno vado in Sicilia.', 'בשנה הבאה אני נוסע לסיציליה.'],
      ['l\'estate', 'הקיץ', 'D\'estate fa molto caldo.', 'בקיץ חם מאוד.'],
      ['l\'inverno', 'החורף', 'In inverno nevica in montagna.', 'בחורף יורד שלג בהרים.'],
      ['la vacanza', 'החופשה', 'Buone vacanze!', 'חופשה נעימה!'],
      ['il viaggio', 'הנסיעה / הטיול', 'Buon viaggio!', 'נסיעה טובה!'],
      ['visitare', 'לבקר (במקום)', 'Voglio visitare Venezia.', 'אני רוצה לבקר בוונציה.'],
      ['decidere', 'להחליט', 'Non ho ancora deciso.', 'עוד לא החלטתי.'],
      ['forse', 'אולי', 'Forse vengo anch\'io.', 'אולי גם אני אבוא.'],
      ['sicuramente', 'בוודאות', 'Sicuramente tornerò!', 'בוודאות אחזור!'],
      ['tra', 'בעוד (זמן)', 'Parto tra due settimane.', 'אני נוסע בעוד שבועיים.'],
      ['il sogno', 'החלום', 'È il mio sogno.', 'זה החלום שלי.'],
      ['In bocca al lupo!', 'בהצלחה! (תשובה: Crepi!)', 'Domani hai l\'esame? In bocca al lupo!', 'מחר יש לך מבחן? בהצלחה!'],
      ['Buona fortuna!', 'בהצלחה! / מזל טוב', 'Buona fortuna con il nuovo lavoro!', 'בהצלחה בעבודה החדשה!'],
    ],
  },
];


// ---------- B1–B2: הסבר הדקדוק נכתב ידנית; המילים נוצרות ע"י ה-AI לפי שכיחות ונשמרות במכשיר ----------
// gen = תיאור הנושא והדקדוק שה-AI משתמש בו כדי לבחור מילים ומשפטי דוגמה
const ADV = [
  {
    id: 'b1', it: "L'imperfetto", he: 'עבר מתמשך – "הייתי עושה"', level: 'B1',
    gen: 'Childhood, memories, past habits and descriptions. Example sentences in the imperfetto (ero, avevo, facevo, andavo...).',
    grammar: `
<h3>imperfetto – עבר של רקע והרגל</h3>
<p>לתיאור מצב, הרגל או רקע בעבר ("הייתי גר", "נהגתי ללכת", "היה חם"). הנטייה קלה וכמעט בלי חריגים:</p>
<table>
<tr><td lang="it">parl<b>avo</b></td><td lang="it">parl<b>avi</b></td><td lang="it">parl<b>ava</b></td></tr>
<tr><td lang="it">parl<b>avamo</b></td><td lang="it">parl<b>avate</b></td><td lang="it">parl<b>avano</b></td></tr>
</table>
<p>-ere: <i lang="it">prendevo</i>, -ire: <i lang="it">dormivo</i>. חריג חשוב: <i lang="it">essere → ero, eri, era, eravamo, eravate, erano</i>. גם <i lang="it">fare → facevo</i>, <i lang="it">dire → dicevo</i>, <i lang="it">bere → bevevo</i>.</p>
<p>💡 מילות סימן: <i lang="it">da bambino, di solito, sempre, ogni estate, mentre</i>.</p>`,
  },
  {
    id: 'b2', it: 'Passato prossimo o imperfetto?', he: 'לספר סיפור בעבר', level: 'B1',
    gen: 'Telling stories and anecdotes: events, accidents, travel stories, surprises. Sentences contrasting passato prossimo (event) and imperfetto (background).',
    grammar: `
<h3>אירוע מול רקע</h3>
<p>בעברית יש עבר אחד. באיטלקית בוחרים לפי התפקיד בסיפור:</p>
<ul>
<li><b>passato prossimo</b> – פעולה שקרתה והסתיימה, "מה קרה": <i lang="it">Ho incontrato Marco.</i></li>
<li><b>imperfetto</b> – הרקע, התיאור, מה היה בתהליך: <i lang="it">Pioveva e io aspettavo l'autobus.</i></li>
</ul>
<p>יחד: <i lang="it">Mentre <b>camminavo</b>, <b>ho visto</b> un gatto.</i> = בזמן שהלכתי (רקע), ראיתי חתול (אירוע).</p>
<p>💡 שאלו: "אפשר לצלם את זה כרגע אחד?" → passato prossimo. "זו תפאורה / הרגל?" → imperfetto.</p>
<p>פעלים שמשנים משמעות: <i lang="it">conoscevo</i> (הכרתי, כבר) / <i lang="it">ho conosciuto</i> (פגשתי לראשונה); <i lang="it">sapevo</i> (ידעתי) / <i lang="it">ho saputo</i> (גיליתי).</p>`,
  },
  {
    id: 'b3', it: 'Ci e ne', he: 'המילים הקטנות ci ו-ne', level: 'B1',
    gen: 'Quantities, shopping, places and very common idiomatic verbs with ci and ne (volerci, metterci, farcela, andarsene, entrarci, pensarci, averne abbastanza).',
    grammar: `
<h3>ci – "לשם / בזה"</h3>
<p>מחליף מקום או "על זה/בזה": <i lang="it">Vai a Roma? – Sì, <b>ci</b> vado domani.</i> (אני נוסע לשם). <i lang="it">Ci penso io</i> = אני אטפל בזה.</p>
<h3>ne – "מזה / מהם"</h3>
<p>מחליף כמות או "על/מ-": <i lang="it">Quante mele vuoi? – <b>Ne</b> voglio tre.</i> (אני רוצה שלושה מהם). <i lang="it">Che ne pensi?</i> = מה אתה חושב על זה?</p>
<h3>ביטויים שחייבים להכיר</h3>
<p><i lang="it">ci vuole / ci vogliono</i> (צריך, לוקח זמן), <i lang="it">ci metto</i> (לוקח לי), <i lang="it">ce la faccio</i> (אני מסתדר/מצליח), <i lang="it">me ne vado</i> (אני הולך מכאן), <i lang="it">non c'entra</i> (זה לא קשור).</p>`,
  },
  {
    id: 'b4', it: 'Pronomi indiretti e combinati', he: 'לו, לה, לי – ו"אותו לו"', level: 'B1',
    gen: 'Gifts, favors, lending, sending, explaining, phone and messages. Sentences with indirect pronouns (mi, ti, gli, le, ci, vi) and combined pronouns (me lo, te la, glielo, ce ne).',
    grammar: `
<h3>כינויי מושא עקיף – "לי, לך, לו"</h3>
<p><i lang="it">mi, ti, gli</i> (לו), <i lang="it">le</i> (לה / לך-רשמי), <i lang="it">ci, vi, gli</i> (להם). באים לפני הפועל: <i lang="it">Gli scrivo domani.</i> = אכתוב לו מחר.</p>
<h3>צירוף: "אותו לו"</h3>
<p>כשיש שניים, העקיף ראשון ומשנה צורה: <i lang="it">mi+lo → me lo</i>, <i lang="it">ti+la → te la</i>, <i lang="it">gli/le+lo → glielo</i>.</p>
<p><i lang="it">Me lo dai?</i> = תיתן לי אותו? · <i lang="it">Glielo spiego io.</i> = אני אסביר לו את זה.</p>
<p>💡 בשם פועל ובציווי הכינוי נדבק לסוף: <i lang="it">Dammelo!</i> (תן לי אותו), <i lang="it">Posso dirtelo.</i></p>`,
  },
  {
    id: 'b5', it: 'Il condizionale', he: 'הייתי… – בקשות, משאלות ועצות', level: 'B1',
    gen: 'Wishes, polite requests, advice, work and career, hypotheses. Sentences in the conditional (vorrei, potrei, dovresti, sarebbe, mi piacerebbe, avrei voluto).',
    grammar: `
<h3>condizionale presente</h3>
<p>אותו גזע כמו העתיד, עם סיומות: <b>-ei, -esti, -ebbe, -emmo, -este, -ebbero</b>.</p>
<p><i lang="it">parlare → parlerei</i>, <i lang="it">essere → sarei</i>, <i lang="it">avere → avrei</i>, <i lang="it">potere → potrei</i>, <i lang="it">dovere → dovrei</i>, <i lang="it">volere → vorrei</i>, <i lang="it">fare → farei</i>, <i lang="it">andare → andrei</i>.</p>
<ul>
<li>בקשה מנומסת: <i lang="it">Potrebbe aiutarmi?</i></li>
<li>עצה: <i lang="it">Dovresti riposarti.</i> = כדאי לך לנוח.</li>
<li>משאלה: <i lang="it">Mi piacerebbe vivere a Roma.</i></li>
</ul>
<p>עבר ("הייתי רוצה אז"): <i lang="it">avrei voluto, sarei andato</i>.</p>`,
  },
  {
    id: 'b6', it: "L'imperativo", he: 'ציווי – הוראות ומתכונים', level: 'B1',
    gen: 'Instructions, recipes, cooking verbs, home, directions, advice. Sentences in the imperative (tu, Lei, noi, voi), including negative imperative.',
    grammar: `
<h3>ציווי</h3>
<table>
<tr><th></th><th lang="it">-are</th><th lang="it">-ere / -ire</th></tr>
<tr><td>אתה</td><td lang="it">parla!</td><td lang="it">prendi! dormi!</td></tr>
<tr><td>אתם</td><td lang="it">parlate!</td><td lang="it">prendete! dormite!</td></tr>
<tr><td>Lei (רשמי)</td><td lang="it">parli!</td><td lang="it">prenda! dorma!</td></tr>
</table>
<p><b>שלילה ל"אתה"</b> = non + שם פועל: <i lang="it">Non parlare!</i> (אל תדבר).</p>
<p>חריגים קצרים: <i lang="it">va', fa', da', di', sta'</i> → <i lang="it">Dimmi!</i> (תגיד לי), <i lang="it">Fammi vedere</i> (תראה לי).</p>
<p>💡 כינויים נדבקים בסוף: <i lang="it">Mangialo! Siediti!</i> אבל ברשמי לפני: <i lang="it">Si sieda.</i></p>`,
  },
  {
    id: 'b7', it: 'Comparativi e relativi', he: 'השוואות ו"ש-" (che, cui)', level: 'B1',
    gen: 'Describing and comparing people, cities, products, personality and appearance. Sentences with più/meno... di/che, il più, -issimo, migliore/peggiore, and relative pronouns che, cui, quello che.',
    grammar: `
<h3>השוואות</h3>
<p><i lang="it">più … di</i> / <i lang="it">meno … di</i>: <i lang="it">Roma è più grande di Firenze.</i> בהשוואת שני תארים/פעלים: <i lang="it">che</i>: <i lang="it">più bello che utile</i>.</p>
<p>הכי: <i lang="it">il più bello</i>. מאוד: <i lang="it">bellissimo</i>. חריגים: <i lang="it">migliore</i> (טוב יותר), <i lang="it">peggiore</i>, <i lang="it">meglio / peggio</i> (תואר הפועל).</p>
<h3>"ש-" באיטלקית</h3>
<ul>
<li><i lang="it">che</i> – הרגיל: <i lang="it">il libro che leggo</i>.</li>
<li><i lang="it">cui</i> – אחרי מילת יחס: <i lang="it">la persona con cui parlo</i> (האדם שאני מדבר איתו), <i lang="it">il motivo per cui</i> (הסיבה ש…).</li>
<li><i lang="it">quello che / ciò che</i> = מה ש…: <i lang="it">Fai quello che vuoi.</i></li>
</ul>
<p>💡 בעברית "ש" אחד + "איתו/בו" בסוף. באיטלקית מילת היחס עוברת לפני <i lang="it">cui</i>.</p>`,
  },
  {
    id: 'b8', it: 'Trapassato e futuro anteriore', he: 'עבר שלפני העבר, ועתיד מושלם', level: 'B1',
    gen: 'Plans, deadlines, sequences of events, regrets, travel and work timelines. Sentences with trapassato prossimo (avevo già fatto) and futuro anteriore (quando avrò finito), plus dopo che, appena, prima di.',
    grammar: `
<h3>trapassato prossimo – "כבר עשיתי (לפני כן)"</h3>
<p>עזר ב-imperfetto + בינוני: <i lang="it">Quando sono arrivato, il film <b>era già cominciato</b>.</i> = כשהגעתי, הסרט כבר התחיל.</p>
<h3>futuro anteriore – "אחרי שאסיים"</h3>
<p>עזר בעתיד + בינוני: <i lang="it">Ti chiamo quando <b>avrò finito</b>.</i></p>
<p>💡 שימוש נפוץ מאוד – ניחוש: <i lang="it">Sarà stanco.</i> = הוא כנראה עייף. <i lang="it">Avrà dimenticato.</i> = הוא כנראה שכח.</p>
<p>מילים מקשרות: <i lang="it">prima di + שם פועל, dopo aver + בינוני, appena</i> (ברגע ש…).</p>`,
  },
  {
    id: 'b9', it: 'Il congiuntivo presente', he: 'קוניונקטיבו – דעות, רגשות וספקות', level: 'B2',
    gen: 'Opinions, feelings, doubts, hopes, debate. Sentences with penso che, credo che, spero che, è importante che, bisogna che, sebbene, prima che + congiuntivo presente.',
    grammar: `
<h3>מתי?</h3>
<p>אחרי <i lang="it">che</i> כשהמשפט הראשי מביע <b>דעה, רצון, רגש, ספק או צורך</b> – ולא עובדה:</p>
<p><i lang="it">Penso che <b>sia</b> vero.</i> (אני חושב שזה נכון) · <i lang="it">Spero che tu <b>stia</b> bene.</i> · <i lang="it">È importante che <b>veniate</b>.</i></p>
<p>אבל עובדה = רגיל: <i lang="it">So che <b>è</b> vero.</i></p>
<h3>צורות</h3>
<p>-are: <i lang="it">parli, parli, parli, parliamo, parliate, parlino</i>. -ere/-ire: <i lang="it">prenda, dorma</i>… (שלוש היחיד זהות!).</p>
<p>חריגים חובה: <i lang="it">essere → sia, avere → abbia, fare → faccia, andare → vada, potere → possa, volere → voglia, dovere → debba, sapere → sappia, venire → venga, stare → stia, dare → dia</i>.</p>
<p>💡 כשהנושא זהה – שם פועל: <i lang="it">Penso di avere ragione.</i></p>`,
  },
  {
    id: 'b10', it: 'Il periodo ipotetico', he: '"אילו הייתי…" – משפטי תנאי', level: 'B2',
    gen: 'Hypotheticals, dreams, regrets, what-if scenarios, life choices. Sentences with se + congiuntivo imperfetto + condizionale (se avessi tempo, viaggerei) and se + congiuntivo trapassato + condizionale passato.',
    grammar: `
<h3>שלושה סוגי "אם"</h3>
<ol>
<li><b>מציאותי</b>: <i lang="it">Se piove, resto a casa.</i></li>
<li><b>דמיוני (הווה)</b>: se + congiuntivo imperfetto, condizionale: <i lang="it">Se <b>avessi</b> tempo, <b>viaggerei</b>.</i> = אילו היה לי זמן, הייתי מטייל.</li>
<li><b>בלתי אפשרי (עבר)</b>: <i lang="it">Se <b>avessi saputo</b>, <b>sarei venuto</b>.</i> = אילו ידעתי, הייתי בא.</li>
</ol>
<h3>congiuntivo imperfetto</h3>
<p><i lang="it">parlassi, parlassi, parlasse, parlassimo, parlaste, parlassero</i>. חריגים: <i lang="it">essere → fossi, fare → facessi, dare → dessi, stare → stessi, dire → dicessi</i>.</p>
<p>💡 גם אחרי <i lang="it">vorrei che, magari, come se</i>: <i lang="it">Magari fosse vero!</i> = הלוואי שזה היה נכון!</p>`,
  },
  {
    id: 'b11', it: 'Si impersonale e passivo', he: '"נוהגים ל…" וסביל – חדשות וחברה', level: 'B2',
    gen: 'News, society, rules, public life, statistics. Sentences with si impersonale/passivante (si dice, si vendono), passive with essere/venire, and andare + participio (va fatto).',
    grammar: `
<h3>si – "אומרים", "עושים פה"</h3>
<p>כמו "אומרים ש…" בעברית בלי נושא: <i lang="it">Si dice che…</i>, <i lang="it">In Italia si mangia bene.</i> עם שם עצם ברבים – הפועל ברבים: <i lang="it">Si vendono case.</i></p>
<h3>סביל</h3>
<p><i lang="it">essere / venire</i> + בינוני: <i lang="it">La legge è stata approvata.</i> · <i lang="it">Il museo viene visitato da milioni.</i></p>
<p><i lang="it">andare</i> + בינוני = "צריך להיעשות": <i lang="it">Il modulo va compilato.</i> = יש למלא את הטופס.</p>
<p>💡 בחדשות ובטקסטים רשמיים המבנים האלה בכל משפט – שווה לזהות אותם.</p>`,
  },
  {
    id: 'b12', it: 'Gerundio e infinito', he: 'בזמן ש… – stare + gerundio', level: 'B2',
    gen: 'Work, technology, processes, multitasking, daily actions in progress. Sentences with stare + gerundio, gerundio as "by/while doing", and verbs + a/di + infinitive (cominciare a, smettere di, cercare di, riuscire a).',
    grammar: `
<h3>"עכשיו בדיוק" – stare + gerundio</h3>
<p><i lang="it">-are → -ando</i>, <i lang="it">-ere/-ire → -endo</i>: <i lang="it">Sto lavorando.</i> = אני (באמצע) עובד. <i lang="it">Stavo uscendo.</i> = בדיוק יצאתי.</p>
<h3>gerundio לבד = "תוך כדי / על ידי"</h3>
<p><i lang="it">Ho imparato l'italiano <b>guardando</b> film.</i> = למדתי איטלקית על ידי צפייה בסרטים.</p>
<h3>פועל + a / di + שם פועל</h3>
<p>צריך ללמוד יחד עם מילת היחס: <i lang="it">cominciare a, riuscire a, imparare a</i> · <i lang="it">cercare di, smettere di, decidere di, finire di</i>.</p>`,
  },
  {
    id: 'b13', it: 'Il discorso indiretto', he: 'דיבור עקיף – "הוא אמר ש…"', level: 'B2',
    gen: 'Reporting conversations, media, gossip, work meetings, messages. Sentences with dire che, chiedere se, raccontare che, rispondere che and tense shifts (ha detto che sarebbe venuto).',
    grammar: `
<h3>להעביר מה מישהו אמר</h3>
<p>בעברית שומרים על הזמן ("הוא אמר שהוא יבוא"). באיטלקית, אחרי פועל בעבר, הזמנים "זזים אחורה":</p>
<ul>
<li>הווה → imperfetto: <i lang="it">"Sono stanco" → Ha detto che <b>era</b> stanco.</i></li>
<li>עבר → trapassato: <i lang="it">"Ho finito" → Ha detto che <b>aveva finito</b>.</i></li>
<li>עתיד → condizionale passato: <i lang="it">"Verrò" → Ha detto che <b>sarebbe venuto</b>.</i></li>
</ul>
<p>שאלות: <i lang="it">Mi ha chiesto <b>se</b> volevo venire.</i> גם הכינויים והמקום משתנים: <i lang="it">qui → lì, oggi → quel giorno, domani → il giorno dopo</i>.</p>`,
  },
  {
    id: 'b14', it: 'Connettivi e argomentazione', he: 'לנמק ולהתווכח – מילות קישור', level: 'B2',
    gen: 'Argumentation and debate: environment, politics, education, pros and cons. Advanced connectors (tuttavia, invece, inoltre, infatti, nonostante, sebbene, affinché, purché, a meno che, dato che, siccome, eppure, anzi, cioè, insomma).',
    grammar: `
<h3>מה שמבדיל B2</h3>
<p>ב-B2 מצופה להסביר דעה, לתת יתרונות וחסרונות ולקשר בין רעיונות. מילות הקישור הן המפתח:</p>
<table>
<tr><td>הוספה</td><td lang="it">inoltre, anche, per di più</td></tr>
<tr><td>ניגוד</td><td lang="it">però, tuttavia, invece, eppure, anzi</td></tr>
<tr><td>סיבה</td><td lang="it">perché, dato che, siccome, poiché</td></tr>
<tr><td>תוצאה</td><td lang="it">quindi, perciò, di conseguenza</td></tr>
<tr><td>הבהרה / סיכום</td><td lang="it">infatti, cioè, insomma, in conclusione</td></tr>
</table>
<p>⚠️ אחרי <i lang="it">sebbene, benché, nonostante, affinché, purché, a meno che, prima che</i> בא <b>congiuntivo</b>: <i lang="it">Sebbene sia tardi, resto.</i></p>`,
  },
  {
    id: 'b15', it: 'Espressioni idiomatiche', he: 'ניבים ושפה מדוברת', level: 'B2',
    gen: 'Very common Italian idioms and colloquial spoken expressions that natives use daily (in bocca al lupo, non vedo l\'ora, avere la testa fra le nuvole, costare un occhio della testa, meno male, figurati, mi raccomando, che ne so, ci mancherebbe, fare una figuraccia). Example dialogues lines.',
    grammar: `
<h3>לדבר כמו איטלקי</h3>
<p>שפה מדוברת מלאה בביטויים שלא מבינים מילה-מילה. כמה מהנפוצים ביותר:</p>
<ul>
<li><i lang="it">Figurati!</i> – מה פתאום / אין בעד מה.</li>
<li><i lang="it">Meno male!</i> – איזה מזל / טוב שכך.</li>
<li><i lang="it">Mi raccomando!</i> – תשמור על עצמך / בבקשה אל תשכח.</li>
<li><i lang="it">Costa un occhio della testa.</i> – עולה הון ("עין מהראש").</li>
<li><i lang="it">Che figuraccia!</i> – איזה פדיחה!</li>
</ul>
<p>💡 גם מילות הדיבור: <i lang="it">tipo, cioè, praticamente, boh, mah, beh</i> – תשמעו אותן בכל פודקאסט.</p>`,
  },
  {
    id: 'b16', it: 'Lavoro ed economia', he: 'עבודה, כסף וכלכלה', level: 'B2',
    gen: 'Work, office, job interviews, career, salary, business, banking, economy, contracts. High-frequency B1-B2 vocabulary.',
    grammar: `<h3>בניית מילים: סיומות שימושיות</h3>
<p>אוצר מילים של B2 גדל מהר כשמכירים סיומות:</p>
<ul>
<li><b>-zione</b> = ‎-tion: <i lang="it">organizzazione, situazione, informazione</i> (תמיד נקבה).</li>
<li><b>-tà</b> = ‎-ty: <i lang="it">università, possibilità, città</i> (נקבה, לא משתנה ברבים).</li>
<li><b>-mente</b> = ‎-ly (תואר הפועל): <i lang="it">veramente, facilmente</i>.</li>
<li><b>-ista</b> = בעל מקצוע/נטייה: <i lang="it">giornalista, dentista</i>.</li>
<li><b>-bile</b> = ‎-able: <i lang="it">possibile, responsabile</i>.</li>
</ul>
<p>💡 מי שיודע אנגלית מכיר כבר מאות מילים איטלקיות דרך הסיומות האלה.</p>`,
  },
  {
    id: 'b17', it: 'Salute e corpo', he: 'בריאות, גוף ורגשות', level: 'B2',
    gen: 'Health, body, doctor visits, symptoms, emotions, relationships, psychology. High-frequency B1-B2 vocabulary.',
    grammar: `<h3>"חברים כוזבים" – מילים שמטעות</h3>
<p>מילים שנראות מוכרות מאנגלית אבל אומרות משהו אחר:</p>
<ul>
<li><i lang="it">camera</i> = חדר (לא מצלמה).</li>
<li><i lang="it">morbido</i> = רך.</li>
<li><i lang="it">parenti</i> = קרובי משפחה (הורים = <i lang="it">genitori</i>).</li>
<li><i lang="it">eventualmente</i> = אם יהיה צורך (לא "בסופו של דבר" = <i lang="it">alla fine</i>).</li>
<li><i lang="it">fattoria</i> = חווה (מפעל = <i lang="it">fabbrica</i>).</li>
<li><i lang="it">annoiato</i> = משועמם (מעוצבן = <i lang="it">infastidito</i>).</li>
</ul>`,
  },
  {
    id: 'b18', it: 'Cultura, arte e storia', he: 'תרבות, אמנות והיסטוריה', level: 'B2',
    gen: 'Culture, art, history, cinema, music, literature, traditions, Italian regions. High-frequency B1-B2 vocabulary.',
    grammar: `<h3>passato remoto – להכיר, לא בהכרח להשתמש</h3>
<p>בספרים, בהיסטוריה ובדרום איטליה תפגשו עבר נוסף: <i lang="it">fu</i> (היה), <i lang="it">nacque</i> (נולד), <i lang="it">morì</i> (מת), <i lang="it">scrisse</i> (כתב), <i lang="it">ebbe</i> (היה לו).</p>
<p><i lang="it">Dante nacque a Firenze nel 1265.</i></p>
<p>💡 ב-B2 מספיק לזהות אותו בקריאה. בדיבור ממשיכים עם passato prossimo.</p>`,
  },
  {
    id: 'b19', it: 'Tecnologia e media', he: 'טכנולוגיה, אינטרנט ותקשורת', level: 'B2',
    gen: 'Technology, internet, social media, smartphones, news media, science. High-frequency B1-B2 vocabulary.',
    grammar: `<h3>אנגלית באיטלקית</h3>
<p>בטכנולוגיה איטלקים משתמשים בהרבה מילים מאנגלית – אבל עם מין דקדוקי, ובדרך כלל זכר: <i lang="it">il computer, il link, la email, il software</i>. ברבים הן לא משתנות: <i lang="it">i computer</i>.</p>
<p>פעלים "מאוטלקים": <i lang="it">postare, chattare, scrollare, scaricare</i> (להוריד), <i lang="it">caricare</i> (להעלות).</p>`,
  },
  {
    id: 'b20', it: 'Società e ambiente', he: 'חברה, סביבה ואקטואליה', level: 'B2',
    gen: 'Society, environment, climate, politics, education, immigration, city life, current affairs. High-frequency B1-B2 vocabulary for discussing news.',
    grammar: `<h3>להביע דעה ברמת B2</h3>
<p>פתיחות: <i lang="it">Secondo me…, Dal mio punto di vista…, Mi sembra che + congiuntivo, Sono convinto che…</i></p>
<p>הסכמה/התנגדות: <i lang="it">Sono d'accordo, Hai ragione, però…, Non sono del tutto d'accordo, Dipende.</i></p>
<p>💡 תרגול מומלץ: לבחור כותרת חדשות, לסכם אותה ב-3 משפטים ולהוסיף דעה – בכתיבה היומית או בשיחה "דיון ודעות".</p>`,
  },
];
ADV.forEach((u) => { u.items = []; });
UNITS.push(...ADV);

// תרחישי שיחה עם המורה – משימות אמיתיות (Task-Based Language Teaching)
export const SCENARIOS = [
  { id: 'free', icon: '💬', he: 'שיחה חופשית', it: 'Chiacchierata', minUnit: 0,
    setup: 'A friendly casual chat. You are Giulia, a warm Italian from Bologna. Ask the learner about their day, life and interests.' },
  { id: 'bar', icon: '☕', he: 'הזמנה בבית קפה', it: 'Al bar', minUnit: 6,
    setup: 'You are a barista in a busy café in Rome. Greet the customer, take their order, tell them the price, and handle payment.' },
  { id: 'rest', icon: '🍝', he: 'ארוחה במסעדה', it: 'Al ristorante', minUnit: 7,
    setup: 'You are a waiter in a trattoria in Florence. Seat the customer, recommend dishes, take the order, and later bring the bill.' },
  { id: 'meet', icon: '🤝', he: 'היכרות עם איטלקי', it: 'Conoscersi', minUnit: 2,
    setup: 'You are Luca, a 30-year-old Italian the learner just met at a party. Get to know each other: names, where from, work, family, hobbies.' },
  { id: 'hotel', icon: '🏨', he: 'צ\'ק-אין במלון', it: 'In albergo', minUnit: 10,
    setup: 'You are a hotel receptionist in Venice. Handle the check-in: name, reservation, passport, breakfast hours, Wi-Fi, room number.' },
  { id: 'dir', icon: '🧭', he: 'לשאול על הדרך', it: 'Chiedere la strada', minUnit: 10,
    setup: 'You are a local in Naples. The learner is lost and asks for directions to the station / a museum. Give simple directions.' },
  { id: 'train', icon: '🚆', he: 'קניית כרטיס רכבת', it: 'In stazione', minUnit: 10,
    setup: 'You are a ticket clerk at Milano Centrale. Sell a train ticket: destination, time, one-way or return, platform, price.' },
  { id: 'shop', icon: '👟', he: 'קניות בחנות בגדים', it: 'In negozio', minUnit: 14,
    setup: 'You are a shop assistant in a clothing store. Help the customer find an item, size, color, try it on, and pay.' },
  { id: 'doc', icon: '💊', he: 'בבית המרקחת', it: 'In farmacia', minUnit: 14,
    setup: 'You are a pharmacist. The customer feels unwell. Ask about symptoms and suggest something simple.' },
  { id: 'past', icon: '📸', he: 'לספר על סוף השבוע', it: 'Il mio weekend', minUnit: 13,
    setup: 'You are Giulia, a friend. Ask the learner what they did last weekend and on their last trip. Encourage use of the past tense (passato prossimo).' },
  { id: 'plans', icon: '✈️', he: 'לתכנן טיול לאיטליה', it: 'Progetti di viaggio', minUnit: 16,
    setup: 'You are Giulia, an Italian friend helping the learner plan a trip to Italy: where, when, what to see and eat.' },
  { id: 'interview', icon: '💼', he: 'ראיון עבודה', it: 'Colloquio di lavoro', minUnit: 21,
    setup: 'You are an HR manager at a company in Milan interviewing the learner for a job in their field. Ask about experience, strengths, why Italy, and hypothetical situations.' },
  { id: 'memories', icon: '🧒', he: 'זיכרונות ילדות', it: 'Quando ero piccolo', minUnit: 17,
    setup: 'You are Giulia, a friend. Ask the learner about their childhood, school, past holidays and how life was different. Encourage imperfetto vs passato prossimo.' },
  { id: 'debate', icon: '⚖️', he: 'דיון ודעות', it: 'Dibattito', minUnit: 25,
    setup: 'You are Marco, a journalist who loves friendly debates. Pick a current, non-sensitive topic (remote work, tourism in Venice, social media, cities vs countryside). Ask the learner\'s opinion, push back politely, ask them to justify with reasons and examples. Encourage connectors and the congiuntivo.' },
  { id: 'whatif', icon: '🔮', he: 'מה היה קורה אילו…', it: 'E se…?', minUnit: 26,
    setup: 'You are Giulia. Play a "what if" game: ask imaginative hypothetical questions (if you won the lottery, if you lived in Italy, if you could change one thing...). Encourage periodo ipotetico.' },
  { id: 'complaint', icon: '😤', he: 'תלונה ופתרון בעיה', it: 'Un reclamo', minUnit: 21,
    setup: 'You are a customer service agent. The learner has a problem (lost luggage, wrong hotel booking, broken product). Handle the complaint realistically, ask for details, propose solutions, negotiate.' },
  { id: 'news', icon: '📰', he: 'לספר על חדשות', it: 'Le notizie', minUnit: 27,
    setup: 'You are a friend chatting about the news. Ask the learner to tell you about something they read or heard recently, ask follow-up questions, and share related facts about Italy. Encourage discorso indiretto and si impersonale.' },
];

export const STORY_TOPICS = [
  'יום ראשון בשוק', 'פגישה בבית קפה ברומא', 'נסיעה ברכבת לפירנצה', 'ארוחת ערב משפחתית',
  'חתול שאבד בוונציה', 'יום בחוף בסיציליה', 'הזמנת פיצה בנאפולי', 'בוקר עמוס בעבודה',
  'טיול בהרי הדולומיטים', 'מתכון של סבתא', 'כדורגל ביום ראשון', 'חנות ספרים קטנה',
  'ראיון עבודה מוזר במילאנו', 'תעלומה בכפר בטוסקנה', 'כתבה: עבודה מרחוק באיטליה', 'ויכוח משפחתי על חופשה',
  'היסטוריה: איך נולדה הפיצה', 'יום בחייו של שף ברומא', 'חדשות: תיירות בוונציה', 'אילו הייתי גר בנאפולי',
];
