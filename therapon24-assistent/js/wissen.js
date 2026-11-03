/* ===========================================================================
   THERAPON24 ASSISTENT — WISSENSBASIS
   ---------------------------------------------------------------------------
   Jeder Eintrag beantwortet EINE typische Frage aus dem Arbeitsalltag.

   Felder:
     id          eindeutiger Schlüssel
     kategorie   siehe T24_KATEGORIEN
     frage       die Frage, wie sie in der Themenliste erscheint
     varianten   alternative Formulierungen (für die Suche)
     schlagworte einzelne Stichwörter (für die Suche)
     kurz        die Kernantwort in 1–3 Sätzen
     schritte    optionale Schritt-für-Schritt-Liste
     hinweise    [{ton:"info"|"ok"|"warn"|"urgent", text:"…"}]
     kontakt     Schlüssel aus T24_CONFIG.kontakt (Ansprechpartner-Karte)
     verwandt    ids verwandter Einträge (Folgefragen)
     rechtlich   true -> Antwort beruht auf allgemeiner Gesetzeslage,
                 nicht auf einer Therapon24-internen Regelung

   {{pfad.zur.config}} wird zur Laufzeit aus js/config.js ersetzt.
   Fehlt dort ein Wert, erscheint ein gelber Hinweis "noch zu ergänzen" —
   es wird also nie etwas Erfundenes ausgegeben.
   =========================================================================== */

window.T24_KATEGORIEN = [
  { id: "zeit",         label: "Zeiterfassung & Arbeitszeit", icon: "clock"   },
  { id: "abwesenheit",  label: "Krankmeldung & Ausfall",      icon: "health"  },
  { id: "urlaub",       label: "Urlaub & freie Tage",         icon: "sun"     },
  { id: "geld",         label: "Gehalt & Kosten",             icon: "euro"    },
  { id: "einsatz",      label: "Schulalltag & Einsatz",       icon: "school"  },
  { id: "recht",        label: "Pflichten & Nachweise",       icon: "shield"  },
  { id: "entwicklung",  label: "Einarbeitung & Fortbildung",  icon: "spark"   },
  { id: "vertrag",      label: "Vertrag & Organisation",      icon: "doc"     }
];

window.T24_WISSEN = [

/* ========================= ZEITERFASSUNG & ARBEITSZEIT ==================== */
{
  id: "zeit-erfassen",
  kategorie: "zeit",
  frage: "Wie erfasse ich meine Arbeitszeit?",
  varianten: ["wie trage ich meine stunden ein", "wo erfasse ich meine zeit",
              "stundenzettel ausfüllen", "zeiterfassung wie geht das",
              "wo trage ich meine arbeitszeit ein"],
  schlagworte: ["zeiterfassung", "stunden", "stundenzettel", "eintragen",
                "erfassen", "arbeitszeit", "zeitnachweis", "zeitkonto"],
  kurz: "Die Arbeitszeit wird über {{zeiterfassung.tool}} erfasst — und zwar taggleich, nicht rückwirkend am Monatsende.",
  schritte: [
    "Beginn und Ende des Einsatzes eintragen, einschließlich aller Pausen.",
    "Fahrzeiten, Vor- und Nachbereitung sowie Besprechungen getrennt ausweisen.",
    "Eintrag am selben Tag abschließen — das ist gesetzlich vorgeschrieben und erspart Rückfragen.",
    "Am Monatsende den Nachweis prüfen und {{zeiterfassung.abgabefrist}} einreichen."
  ],
  hinweise: [
    { ton: "info", text: "Direktlink zum System: {{zeiterfassung.toolLink}}" },
    { ton: "warn", text: "Ohne erfasste Zeit kann nicht abgerechnet werden. Lieber kurz nachfragen als gar nicht eintragen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["zeit-vergessen", "zeit-fahrzeit", "zeit-pause", "zeit-ueberstunden"]
},
{
  id: "zeit-vergessen",
  kategorie: "zeit",
  frage: "Ich habe vergessen, meine Zeit einzutragen — was jetzt?",
  varianten: ["zeiterfassung vergessen", "stunden nachtragen",
              "nachträglich eintragen", "korrektur zeiterfassung",
              "falsche zeit eingetragen"],
  schlagworte: ["vergessen", "nachtragen", "korrektur", "korrigieren",
                "nachträglich", "fehler", "falsch"],
  kurz: "Nachtragen ist möglich — aber zeitnah und mit kurzer Begründung. Je früher, desto unkomplizierter.",
  schritte: [
    "Den fehlenden Tag so schnell wie möglich in {{zeiterfassung.tool}} nachtragen.",
    "Im Bemerkungsfeld kurz vermerken, warum der Eintrag nachträglich erfolgt.",
    "Die Einsatzleitung kurz informieren, damit die Korrektur freigegeben wird.",
    "Liegt der Monat bereits abgerechnet vor, läuft die Korrektur über die Lohnbuchhaltung."
  ],
  hinweise: [
    { ton: "warn", text: "Nie pauschal schätzen. Wenn du dir unsicher bist, nimm Dienstplan und Schulzeiten als Beleg." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["zeit-erfassen", "zeit-frist"]
},
{
  id: "zeit-frist",
  kategorie: "zeit",
  frage: "Bis wann muss ich meinen Stundennachweis abgeben?",
  varianten: ["abgabefrist stundenzettel", "wann muss der nachweis raus",
              "deadline zeiterfassung", "stundenzettel abgeben wann"],
  schlagworte: ["frist", "abgabe", "deadline", "monatsende", "abgeben",
                "einreichen", "termin"],
  kurz: "Der Nachweis muss {{zeiterfassung.abgabefrist}} vorliegen, damit die Abrechnung im laufenden Zyklus erfolgen kann.",
  hinweise: [
    { ton: "warn", text: "Verspätete Nachweise können dazu führen, dass Stunden erst im Folgemonat ausgezahlt werden." }
  ],
  kontakt: "lohnbuchhaltung",
  verwandt: ["zeit-erfassen", "geld-zahltag"]
},
{
  id: "zeit-fahrzeit",
  kategorie: "zeit",
  frage: "Zählt meine Fahrzeit als Arbeitszeit?",
  varianten: ["ist fahrzeit arbeitszeit", "fahrt zur schule bezahlt",
              "wegezeit", "anfahrt zählt die"],
  schlagworte: ["fahrzeit", "fahrt", "anfahrt", "weg", "wegezeit", "fahren",
                "unterwegs", "pendeln"],
  kurz: "Bei Therapon24 gilt: {{zeiterfassung.fahrzeitRegel}}",
  hinweise: [
    { ton: "info", text: "Allgemein gilt arbeitsrechtlich: Der Weg von zu Hause zur ersten Einsatzstelle ist in der Regel Wegezeit und keine Arbeitszeit. Fahrten zwischen zwei Einsatzorten am selben Tag sind dagegen üblicherweise Arbeitszeit." }
  ],
  rechtlich: true,
  kontakt: "einsatzleitung",
  verwandt: ["geld-fahrtkosten", "zeit-erfassen"]
},
{
  id: "zeit-pause",
  kategorie: "zeit",
  frage: "Wann steht mir eine Pause zu — und muss ich sie eintragen?",
  varianten: ["pausenregelung", "wie lange pause", "pause eintragen",
              "muss ich pause machen", "pause bei 6 stunden"],
  schlagworte: ["pause", "pausen", "ruhepause", "mittagspause", "frühstück"],
  kurz: "Pausen sind Pflicht, unbezahlt und müssen in der Zeiterfassung ausgewiesen werden.",
  schritte: [
    "Mehr als 6 bis 9 Stunden Arbeit: mindestens 30 Minuten Pause.",
    "Mehr als 9 Stunden: mindestens 45 Minuten Pause.",
    "Die Pause kann in Abschnitte von je mindestens 15 Minuten geteilt werden.",
    "Pausenzeiten im Zeitnachweis eintragen — sie zählen nicht als Arbeitszeit."
  ],
  hinweise: [
    { ton: "info", text: "Grundlage ist § 4 Arbeitszeitgesetz. In der Schulbegleitung fällt die Pause meist in die Hofpause oder Mittagszeit — sprich sie mit der Schule ab, damit die Aufsicht geklärt ist." },
    { ton: "warn", text: "Wenn du in der Pause durchgehend für das Kind zuständig bist, ist es keine Pause, sondern Arbeitszeit. Das bitte so eintragen und der Einsatzleitung melden." }
  ],
  rechtlich: true,
  kontakt: "einsatzleitung",
  verwandt: ["zeit-erfassen", "einsatz-aufsicht"]
},
{
  id: "zeit-ueberstunden",
  kategorie: "zeit",
  frage: "Was passiert mit Überstunden und Mehrarbeit?",
  varianten: ["überstunden", "mehrarbeit", "zuviel gearbeitet",
              "werden überstunden ausgezahlt", "überstunden abbauen"],
  schlagworte: ["überstunden", "mehrarbeit", "plusstunden", "zeitkonto",
                "ausgleich", "abbauen", "auszahlen"],
  kurz: "Mehrarbeit wird über das Zeitkonto geführt und in Absprache mit der Einsatzleitung entweder ausgeglichen oder abgerechnet.",
  schritte: [
    "Mehrarbeit immer vorher mit der Einsatzleitung abstimmen — nicht eigenmächtig aufbauen.",
    "Die Stunden vollständig und mit Begründung erfassen.",
    "Ausgleich vorrangig in unterrichtsfreien Zeiten oder nach Absprache."
  ],
  hinweise: [
    { ton: "info", text: "Wie dein Zeitkonto konkret geführt wird, steht in deinem Arbeitsvertrag." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["zeit-erfassen", "urlaub-ferien", "vertrag-stunden"]
},
{
  id: "zeit-ausfall-kind",
  kategorie: "zeit",
  frage: "Das Kind ist nicht in der Schule — bekomme ich die Zeit trotzdem?",
  varianten: ["kind ist krank was mache ich", "schüler fehlt",
              "mein kind kommt nicht", "einsatz fällt aus bezahlung",
              "klient fehlt", "mein kind ist nicht in der schule",
              "das kind kommt heute nicht", "schüler ist nicht da"],
  schlagworte: ["ausfall", "kind krank", "schüler fehlt", "fehlt",
                "abwesend", "entfällt", "kein einsatz", "nicht da",
                "kommt nicht", "schulkind"],
  kurz: "Melde den Ausfall sofort der Einsatzleitung — sie entscheidet über Ersatzeinsatz, Vor-/Nachbereitungszeit oder Freistellung. Nicht eigenständig nach Hause gehen, ohne das abzustimmen.",
  schritte: [
    "Sobald du erfährst, dass das Kind fehlt: Einsatzleitung anrufen oder schreiben.",
    "Warten, welche Alternative angeboten wird (anderer Einsatz, Dokumentation, Teamarbeit in der Schule).",
    "Die tatsächliche Tätigkeit in der Zeiterfassung eintragen und als Ausfall des Kindes kennzeichnen."
  ],
  hinweise: [
    { ton: "warn", text: "Ob und wie Ausfallzeiten vergütet werden, hängt von deinem Vertrag und der Kostenzusage des Trägers ab. Das klärt die Einsatzleitung — bitte nicht selbst annehmen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["abwesenheit-kind-krank", "zeit-erfassen", "urlaub-ferien"]
},
{
  id: "zeit-dienstplan",
  kategorie: "zeit",
  frage: "Wo finde ich meinen Dienstplan und meine Einsatzzeiten?",
  varianten: ["dienstplan", "wann habe ich dienst", "einsatzzeiten",
              "schichtplan", "wo sehe ich meine zeiten"],
  schlagworte: ["dienstplan", "einsatzplan", "plan", "schicht",
                "einsatzzeiten", "stundenplan"],
  kurz: "Dein Einsatzplan richtet sich nach dem Stundenplan des Kindes und wird von der Einsatzleitung festgelegt. Abrufbar über {{links.mitarbeiterportal}}",
  hinweise: [
    { ton: "info", text: "Ändert die Schule den Stundenplan (Vertretung, Ausflug, Projektwoche), gib das bitte an die Einsatzleitung weiter — der Einsatzplan muss nachgeführt werden." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["zeit-aenderung", "einsatz-ausflug"]
},
{
  id: "zeit-aenderung",
  kategorie: "zeit",
  frage: "Meine Einsatzzeiten sollen sich ändern — wie läuft das?",
  varianten: ["einsatzzeit ändern", "andere zeiten", "stunden ändern",
              "kann ich früher anfangen", "zeiten verschieben"],
  schlagworte: ["ändern", "änderung", "verschieben", "anpassen",
                "umstellen", "neue zeiten"],
  kurz: "Änderungen der Einsatzzeiten laufen immer über die Einsatzleitung — nie direkt mit der Schule oder den Eltern vereinbaren.",
  schritte: [
    "Anliegen mit Begründung an die Einsatzleitung richten.",
    "Die Einsatzleitung stimmt mit Schule, Eltern und Kostenträger ab.",
    "Erst nach schriftlicher Bestätigung gelten die neuen Zeiten."
  ],
  hinweise: [
    { ton: "warn", text: "Die bewilligten Stunden sind vom Kostenträger festgelegt. Eigenmächtige Änderungen können dazu führen, dass Stunden nicht erstattet werden." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["zeit-dienstplan", "vertrag-stunden"]
},

/* ========================= KRANKMELDUNG & AUSFALL ======================== */
{
  id: "abwesenheit-krank",
  kategorie: "abwesenheit",
  frage: "Ich bin krank — was muss ich tun?",
  varianten: ["krankmeldung", "ich bin krank", "krank melden",
              "wie melde ich mich krank", "krankmeldung ablauf",
              "ich kann nicht arbeiten"],
  schlagworte: ["krank", "krankmeldung", "krankheit", "erkrankt",
                "arbeitsunfähig", "fieber", "grippe", "erkältung", "abmelden"],
  kurz: "Melde dich so früh wie möglich — {{krankmeldung.uhrzeit}} — direkt {{krankmeldung.meldewegPrimaer}}. Die Schule informierst du nicht selbst.",
  schritte: [
    "Einsatzleitung informieren, sobald absehbar ist, dass du ausfällst.",
    "Mitteilen: Name, Einsatzort, voraussichtliche Dauer des Ausfalls.",
    "{{krankmeldung.schuleInfo}}",
    "Ärztliche Bescheinigung {{krankmeldung.auAbTag}} besorgen.",
    "Bei Verlängerung erneut melden — eine Folgebescheinigung muss lückenlos anschließen."
  ],
  hinweise: [
    { ton: "urgent", text: "Nicht erst kurz vor Dienstbeginn melden: Für das Kind muss möglicherweise eine Vertretung organisiert werden." },
    { ton: "info", text: "Nach § 5 Entgeltfortzahlungsgesetz ist eine ärztliche Bescheinigung spätestens ab dem vierten Kalendertag vorzulegen — der Arbeitgeber darf sie aber auch früher verlangen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["abwesenheit-au", "abwesenheit-kind-krank", "abwesenheit-dauer", "abwesenheit-lohnfortzahlung"]
},
{
  id: "abwesenheit-au",
  kategorie: "abwesenheit",
  frage: "Wie reiche ich meine Krankschreibung (AU) ein?",
  varianten: ["au einreichen", "krankschreibung abgeben", "gelber schein",
              "arbeitsunfähigkeitsbescheinigung", "wohin mit der au",
              "elektronische krankmeldung"],
  schlagworte: ["au", "krankschreibung", "bescheinigung", "attest",
                "gelber schein", "eau", "arzt", "einreichen"],
  kurz: "So wird eingereicht: {{krankmeldung.auWeg}}",
  schritte: [
    "Beim Arzttermin angeben, dass du gesetzlich versichert bist — dann läuft die Meldung in der Regel elektronisch (eAU).",
    "Den Ausdruck für die eigenen Unterlagen trotzdem aufbewahren.",
    "Zusätzlich der Personalabteilung kurz Bescheid geben, von wann bis wann du krankgeschrieben bist.",
    "Privatversichert oder Minijob ohne eAU? Dann die Bescheinigung selbst einreichen."
  ],
  hinweise: [
    { ton: "info", text: "Bei der eAU ruft der Arbeitgeber die Bescheinigung bei der Krankenkasse ab. Die Pflicht, dich selbst unverzüglich krankzumelden, entfällt dadurch nicht." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["abwesenheit-krank", "abwesenheit-lohnfortzahlung"]
},
{
  id: "abwesenheit-lohnfortzahlung",
  kategorie: "abwesenheit",
  frage: "Bekomme ich im Krankheitsfall mein Gehalt weiter?",
  varianten: ["lohnfortzahlung", "gehalt bei krankheit", "werde ich bezahlt wenn ich krank bin",
              "krankengeld", "wie lange gehalt bei krankheit"],
  schlagworte: ["lohnfortzahlung", "entgeltfortzahlung", "krankengeld",
                "bezahlt", "gehalt", "6 wochen"],
  kurz: "In den ersten sechs Wochen einer Arbeitsunfähigkeit zahlt der Arbeitgeber das Entgelt weiter, danach übernimmt in der Regel die Krankenkasse mit Krankengeld.",
  hinweise: [
    { ton: "info", text: "Voraussetzung nach § 3 Entgeltfortzahlungsgesetz: Das Arbeitsverhältnis besteht seit mindestens vier Wochen und die Erkrankung ist unverschuldet." },
    { ton: "warn", text: "Bei derselben Erkrankung innerhalb von zwölf Monaten gelten Sonderregeln. Konkrete Fälle klärt die Lohnbuchhaltung." }
  ],
  rechtlich: true,
  kontakt: "lohnbuchhaltung",
  verwandt: ["abwesenheit-krank", "abwesenheit-au", "geld-abrechnung"]
},
{
  id: "abwesenheit-kind-krank",
  kategorie: "abwesenheit",
  frage: "Mein eigenes Kind ist krank — kann ich zu Hause bleiben?",
  varianten: ["kind krank", "kinderkrankentage", "kind krank zuhause bleiben",
              "kinderkrankengeld", "betreuung krankes kind"],
  schlagworte: ["kind krank", "kinderkrankentage", "kinderkrankengeld",
                "eigenes kind", "betreuung", "familie"],
  kurz: "Ja. Für die Betreuung eines erkrankten Kindes unter 12 Jahren gibt es Freistellung und Kinderkrankengeld der Krankenkasse.",
  schritte: [
    "Umgehend die Einsatzleitung informieren — genau wie bei eigener Krankheit.",
    "Beim Kinderarzt die Bescheinigung für den Bezug von Kinderkrankengeld holen.",
    "Bescheinigung bei der eigenen Krankenkasse einreichen, Kopie an die Personalabteilung."
  ],
  hinweise: [
    { ton: "info", text: "Gesetzlich Versicherte haben Anspruch auf Kinderkrankengeld nach § 45 SGB V. Die Zahl der Tage pro Kind und Jahr wurde mehrfach geändert — die aktuelle Zahl nennt dir deine Krankenkasse." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["abwesenheit-krank", "abwesenheit-sonderurlaub"]
},
{
  id: "abwesenheit-dauer",
  kategorie: "abwesenheit",
  frage: "Ich bin länger krank — was muss ich beachten?",
  varianten: ["länger krank", "folgebescheinigung", "verlängerung krankschreibung",
              "immer noch krank", "wiedereingliederung"],
  schlagworte: ["verlängerung", "folgebescheinigung", "länger", "weiterhin",
                "wiedereingliederung", "bem"],
  kurz: "Melde jede Verlängerung aktiv weiter. Die Folgebescheinigung muss lückenlos an die vorherige anschließen.",
  schritte: [
    "Spätestens am letzten Tag der aktuellen Krankschreibung beim Arzt vorstellen.",
    "Einsatzleitung und Personalabteilung über die neue Dauer informieren.",
    "Bei längerer Erkrankung: Rückkehr frühzeitig ankündigen, damit der Einsatz wieder geplant werden kann."
  ],
  hinweise: [
    { ton: "info", text: "Bei mehr als sechs Wochen Arbeitsunfähigkeit innerhalb eines Jahres bietet der Arbeitgeber ein Betriebliches Eingliederungsmanagement (BEM) an. Die Teilnahme ist freiwillig." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["abwesenheit-krank", "abwesenheit-au"]
},
{
  id: "abwesenheit-arzttermin",
  kategorie: "abwesenheit",
  frage: "Darf ich während der Arbeitszeit zum Arzt?",
  varianten: ["arzttermin arbeitszeit", "arzt während der arbeit",
              "zum arzt gehen", "termin beim arzt"],
  schlagworte: ["arzttermin", "arzt", "termin", "untersuchung",
                "vorsorge", "therapie"],
  kurz: "Arzttermine sind möglichst außerhalb der Einsatzzeiten zu legen. Ist das medizinisch nicht möglich, ist die Freistellung vorher mit der Einsatzleitung abzustimmen.",
  hinweise: [
    { ton: "info", text: "Bei medizinisch notwendigen Terminen, die nur während der Arbeitszeit möglich sind, besteht nach § 616 BGB in der Regel Anspruch auf bezahlte Freistellung — sofern dies im Arbeitsvertrag nicht abbedungen wurde." }
  ],
  rechtlich: true,
  kontakt: "einsatzleitung",
  verwandt: ["abwesenheit-sonderurlaub", "zeit-erfassen"]
},
{
  id: "abwesenheit-sonderurlaub",
  kategorie: "abwesenheit",
  frage: "Gibt es Sonderurlaub (Umzug, Hochzeit, Todesfall)?",
  varianten: ["sonderurlaub", "freistellung umzug", "hochzeit frei",
              "todesfall frei", "besondere anlässe frei"],
  schlagworte: ["sonderurlaub", "freistellung", "umzug", "hochzeit",
                "todesfall", "geburt", "beerdigung", "anlass"],
  kurz: "Für persönliche Anlässe kann bezahlte Freistellung gewährt werden. Der konkrete Umfang richtet sich nach deinem Arbeitsvertrag.",
  schritte: [
    "Anlass und gewünschte Tage frühzeitig bei der Personalabteilung melden.",
    "Nachweis (z. B. Urkunde, Bescheinigung) einreichen.",
    "Parallel die Einsatzleitung informieren, damit die Vertretung geplant werden kann."
  ],
  hinweise: [
    { ton: "info", text: "Grundlage ist § 616 BGB. Viele Arbeitsverträge regeln die Anlässe und Tage ausdrücklich — schau zuerst in deinen Vertrag." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["urlaub-antrag", "abwesenheit-arzttermin"]
},
{
  id: "abwesenheit-verspaetung",
  kategorie: "abwesenheit",
  frage: "Ich komme zu spät — wen informiere ich?",
  varianten: ["verspätung", "ich komme zu spät", "zug fällt aus",
              "stau", "verspätet"],
  schlagworte: ["verspätung", "zu spät", "verspätet", "stau", "zug",
                "bahn", "verkehr", "pünktlich"],
  kurz: "Sofort die Einsatzleitung informieren — telefonisch, nicht nur per Nachricht. Die Schule erwartet dich zu einer festen Zeit.",
  schritte: [
    "Anrufen, sobald absehbar ist, dass du nicht pünktlich bist.",
    "Voraussichtliche Ankunftszeit nennen.",
    "Die tatsächliche Arbeitszeit später korrekt erfassen."
  ],
  hinweise: [
    { ton: "urgent", text: "Außerhalb der Bürozeiten: {{kontakt.notfall.tel}}" }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["abwesenheit-krank", "zeit-erfassen"]
},

/* ========================= URLAUB & FREIE TAGE =========================== */
{
  id: "urlaub-antrag",
  kategorie: "urlaub",
  frage: "Wie beantrage ich Urlaub?",
  varianten: ["urlaub beantragen", "urlaubsantrag", "frei nehmen",
              "wie bekomme ich urlaub", "urlaub einreichen"],
  schlagworte: ["urlaub", "antrag", "beantragen", "frei", "freinehmen",
                "urlaubsantrag"],
  kurz: "Urlaub wird {{urlaub.antragsweg}} beantragt — bitte {{urlaub.vorlauf}}.",
  schritte: [
    "Wunschzeitraum eintragen und Antrag einreichen.",
    "Die Einsatzleitung prüft, ob die Begleitung des Kindes gesichert ist.",
    "Erst nach schriftlicher Genehmigung gilt der Urlaub als bewilligt — bitte vorher nichts verbindlich buchen."
  ],
  hinweise: [
    { ton: "warn", text: "Ein eingereichter Antrag ist noch keine Genehmigung. Warte die Bestätigung ab, bevor du Reisen buchst." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["urlaub-anspruch", "urlaub-ferien", "urlaub-rest"]
},
{
  id: "urlaub-anspruch",
  kategorie: "urlaub",
  frage: "Wie viele Urlaubstage habe ich?",
  varianten: ["urlaubstage", "wie viel urlaub", "urlaubsanspruch",
              "wie viele tage urlaub", "resturlaub wie viel"],
  schlagworte: ["urlaubstage", "anspruch", "wieviel", "tage", "jahresurlaub",
                "kontingent"],
  kurz: "Dein Anspruch beträgt {{urlaub.anspruch}}. Den aktuellen Stand siehst du in {{links.mitarbeiterportal}}",
  hinweise: [
    { ton: "info", text: "Gesetzlicher Mindesturlaub nach Bundesurlaubsgesetz: 24 Werktage bei einer 6-Tage-Woche, also 20 Tage bei einer 5-Tage-Woche. Bei Teilzeit mit weniger Arbeitstagen pro Woche verringert sich die Zahl der Urlaubstage entsprechend anteilig — der Erholungsumfang bleibt gleich." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["urlaub-antrag", "urlaub-rest", "urlaub-teilzeit"]
},
{
  id: "urlaub-teilzeit",
  kategorie: "urlaub",
  frage: "Wie wird mein Urlaub bei Teilzeit berechnet?",
  varianten: ["urlaub teilzeit", "teilzeit urlaubstage",
              "urlaub bei wenigen tagen", "anteiliger urlaub"],
  schlagworte: ["teilzeit", "anteilig", "berechnung", "wochentage",
                "umrechnen"],
  kurz: "Die Urlaubstage werden nach der Zahl deiner wöchentlichen Arbeitstage umgerechnet, nicht nach den Stunden.",
  schritte: [
    "Formel: Urlaubstage Vollzeit ÷ 5 × eigene Arbeitstage pro Woche.",
    "Beispiel: 30 Tage bei 5-Tage-Woche, du arbeitest 3 Tage pro Woche → 30 ÷ 5 × 3 = 18 Urlaubstage.",
    "Arbeitest du an 5 Tagen, aber kürzer, bleibt die Zahl der Urlaubstage gleich."
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["urlaub-anspruch", "vertrag-stunden"]
},
{
  id: "urlaub-ferien",
  kategorie: "urlaub",
  frage: "Was ist in den Schulferien — muss ich Urlaub nehmen?",
  varianten: ["schulferien", "ferien urlaub", "unterrichtsfreie zeit",
              "was mache ich in den ferien", "ferienzeit bezahlung"],
  schlagworte: ["ferien", "schulferien", "unterrichtsfrei", "sommerferien",
                "ferienzeit", "brückentag", "feiertag"],
  kurz: "Bei Therapon24 gilt: {{urlaub.ferienRegel}}",
  hinweise: [
    { ton: "info", text: "In der Schulbegleitung werden Urlaubszeiten üblicherweise in die Schulferien gelegt, weil in dieser Zeit kein Einsatz stattfindet. Wie Ferientage über das Urlaubskontingent hinaus behandelt werden — Zeitausgleich, Freistellung oder anderer Einsatz —, regelt dein Arbeitsvertrag." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["urlaub-antrag", "zeit-ueberstunden", "zeit-ausfall-kind"]
},
{
  id: "urlaub-rest",
  kategorie: "urlaub",
  frage: "Was passiert mit meinem Resturlaub am Jahresende?",
  varianten: ["resturlaub", "urlaub verfällt", "urlaub übertragen",
              "alte urlaubstage", "urlaub mitnehmen ins nächste jahr"],
  schlagworte: ["resturlaub", "verfall", "übertragen", "jahreswechsel",
                "31.03", "jahresende"],
  kurz: "Resturlaub ist grundsätzlich im laufenden Kalenderjahr zu nehmen. Eine Übertragung ins Folgejahr ist nur in begründeten Fällen möglich.",
  hinweise: [
    { ton: "info", text: "Nach dem Bundesurlaubsgesetz verfällt übertragener Urlaub in der Regel am 31. März des Folgejahres. Nach der Rechtsprechung verfällt Urlaub allerdings nur, wenn der Arbeitgeber zuvor konkret auf den Verfall hingewiesen hat." },
    { ton: "warn", text: "Plane Resturlaub früh ein — gegen Jahresende sind Zeiträume oft schon belegt." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["urlaub-antrag", "urlaub-anspruch"]
},
{
  id: "urlaub-krank-im-urlaub",
  kategorie: "urlaub",
  frage: "Ich werde im Urlaub krank — sind die Tage weg?",
  varianten: ["krank im urlaub", "urlaub krank", "urlaubstage zurück",
              "krankheit während urlaub"],
  schlagworte: ["krank im urlaub", "zurückholen", "gutschreiben",
                "nachgewährt"],
  kurz: "Nein. Mit ärztlicher Bescheinigung werden die Krankheitstage nicht auf den Urlaub angerechnet.",
  schritte: [
    "Sofort zum Arzt gehen und eine Arbeitsunfähigkeitsbescheinigung ausstellen lassen — auch im Ausland.",
    "Krankmeldung wie üblich an die Einsatzleitung und Personalabteilung.",
    "Die betroffenen Tage werden dem Urlaubskonto wieder gutgeschrieben."
  ],
  hinweise: [
    { ton: "warn", text: "Ohne ärztliche Bescheinigung ab dem ersten Tag bleiben die Tage als Urlaub gebucht. Grundlage: § 9 Bundesurlaubsgesetz." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["abwesenheit-krank", "abwesenheit-au", "urlaub-anspruch"]
},

/* ========================= GEHALT & KOSTEN =============================== */
{
  id: "geld-zahltag",
  kategorie: "geld",
  frage: "Wann kommt mein Gehalt?",
  varianten: ["wann wird gezahlt", "zahltag", "gehaltseingang",
              "wann kommt das geld", "auszahlung gehalt"],
  schlagworte: ["gehalt", "lohn", "zahltag", "auszahlung", "überweisung",
                "eingang", "wann"],
  kurz: "Die Auszahlung erfolgt {{entgelt.zahltag}}.",
  hinweise: [
    { ton: "info", text: "Fällt der Zahltag auf ein Wochenende oder einen Feiertag, kann der Eingang je nach Bank einen Werktag später erfolgen." }
  ],
  kontakt: "lohnbuchhaltung",
  verwandt: ["geld-abrechnung", "geld-fehler", "zeit-frist"]
},
{
  id: "geld-abrechnung",
  kategorie: "geld",
  frage: "Wo finde ich meine Lohnabrechnung?",
  varianten: ["lohnabrechnung", "gehaltsabrechnung", "lohnzettel",
              "abrechnung herunterladen", "verdienstbescheinigung"],
  schlagworte: ["abrechnung", "lohnzettel", "gehaltsabrechnung",
                "entgeltabrechnung", "pdf", "download"],
  kurz: "Die Abrechnungen liegen in {{entgelt.abrechnungPortal}} bereit: {{entgelt.abrechnungLink}}",
  hinweise: [
    { ton: "info", text: "Lade dir die Abrechnungen regelmäßig herunter und speichere sie. Für Anträge bei Behörden, Banken oder Vermietern brauchst du sie oft kurzfristig." }
  ],
  kontakt: "lohnbuchhaltung",
  verwandt: ["geld-zahltag", "geld-fehler", "vertrag-bescheinigung"]
},
{
  id: "geld-fehler",
  kategorie: "geld",
  frage: "Meine Abrechnung stimmt nicht — an wen wende ich mich?",
  varianten: ["falsche abrechnung", "zu wenig gehalt", "stunden fehlen",
              "fehler lohnabrechnung", "zuschlag fehlt"],
  schlagworte: ["falsch", "fehler", "stimmt nicht", "zu wenig", "fehlt",
                "differenz", "nachzahlung", "reklamation"],
  kurz: "Wende dich mit der konkreten Abrechnung an die Lohnbuchhaltung. Je genauer die Angabe, desto schneller die Klärung.",
  schritte: [
    "Abrechnungsmonat und Position benennen, die nicht stimmt.",
    "Eigenen Stundennachweis als Vergleich bereithalten.",
    "Differenz schriftlich melden — am besten per E-Mail, damit es dokumentiert ist.",
    "Korrekturen erscheinen in der Regel in der Abrechnung des Folgemonats."
  ],
  hinweise: [
    { ton: "warn", text: "Arbeitsverträge enthalten häufig Ausschlussfristen von drei Monaten. Melde Unstimmigkeiten daher zügig und schriftlich." }
  ],
  kontakt: "lohnbuchhaltung",
  verwandt: ["geld-abrechnung", "zeit-vergessen"]
},
{
  id: "geld-fahrtkosten",
  kategorie: "geld",
  frage: "Werden meine Fahrtkosten erstattet?",
  varianten: ["fahrtkosten", "kilometergeld", "spritgeld", "fahrtkostenerstattung",
              "bekomme ich die fahrt bezahlt", "reisekosten"],
  schlagworte: ["fahrtkosten", "kilometer", "km", "erstattung", "auto",
                "benzin", "reisekosten", "fahrtkostenabrechnung"],
  kurz: "Die Regelung lautet: {{fahrtkosten.regelung}}",
  schritte: [
    "Fahrten mit Datum, Strecke und Zweck dokumentieren.",
    "Abrechnung einreichen: {{fahrtkosten.abrechnungsweg}}",
    "Belege (Tickets, Quittungen) aufbewahren und beilegen."
  ],
  kontakt: "lohnbuchhaltung",
  verwandt: ["geld-ticket", "zeit-fahrzeit"]
},
{
  id: "geld-ticket",
  kategorie: "geld",
  frage: "Gibt es einen Zuschuss zum Deutschlandticket oder ÖPNV?",
  varianten: ["deutschlandticket", "jobticket", "öpnv zuschuss",
              "fahrkarte zuschuss", "49 euro ticket"],
  schlagworte: ["deutschlandticket", "jobticket", "öpnv", "bus", "bahn",
                "zuschuss", "ticket", "monatskarte"],
  kurz: "Dazu gilt: {{fahrtkosten.deutschlandticket}}",
  kontakt: "personalabteilung",
  verwandt: ["geld-fahrtkosten", "geld-benefits"]
},
{
  id: "geld-benefits",
  kategorie: "geld",
  frage: "Welche Zusatzleistungen gibt es?",
  varianten: ["benefits", "zusatzleistungen", "betriebliche altersvorsorge",
              "jobrad", "sachbezug", "vermögenswirksame leistungen"],
  schlagworte: ["benefits", "zusatzleistungen", "bav", "altersvorsorge",
                "jobrad", "gutschein", "vwl", "vorteile"],
  kurz: "Welche Zusatzleistungen für dich in Frage kommen, hängt von Vertrag und Beschäftigungsumfang ab. Die Personalabteilung gibt dir eine Übersicht.",
  hinweise: [
    { ton: "info", text: "Auf betriebliche Altersvorsorge durch Entgeltumwandlung besteht ein gesetzlicher Anspruch (§ 1a BetrAVG), einschließlich eines Arbeitgeberzuschusses." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["geld-ticket", "vertrag-stunden"]
},
{
  id: "geld-steuerklasse",
  kategorie: "geld",
  frage: "Wie ändere ich Steuerklasse, Bankverbindung oder Adresse?",
  varianten: ["steuerklasse ändern", "neue bankverbindung", "umgezogen",
              "adresse ändern", "iban ändern", "namensänderung"],
  schlagworte: ["steuerklasse", "bankverbindung", "iban", "konto", "adresse",
                "umzug", "name", "stammdaten", "ändern"],
  kurz: "Stammdatenänderungen bitte schriftlich an die Personalabteilung — und zwar vor dem Abrechnungslauf des betreffenden Monats.",
  schritte: [
    "Änderung per E-Mail oder über {{links.mitarbeiterportal}} melden.",
    "Bei Bankverbindung: IBAN vollständig und auf den eigenen Namen angeben.",
    "Bei Steuerklasse: Die Änderung erfolgt beim Finanzamt — der Arbeitgeber ruft sie elektronisch ab (ELStAM).",
    "Bei Umzug zusätzlich die Einsatzleitung informieren, falls sich die Anfahrt ändert."
  ],
  hinweise: [
    { ton: "warn", text: "Eine spät gemeldete Kontoänderung kann dazu führen, dass die Zahlung zurückläuft. Bitte frühzeitig melden." }
  ],
  kontakt: "personalabteilung",
  verwandt: ["geld-abrechnung", "vertrag-bescheinigung"]
},

/* ========================= SCHULALLTAG & EINSATZ ========================= */
{
  id: "einsatz-aufgaben",
  kategorie: "einsatz",
  frage: "Was gehört zu meinen Aufgaben als Schulbegleitung — und was nicht?",
  varianten: ["was sind meine aufgaben", "aufgaben schulbegleiter",
              "was darf ich machen", "was gehört nicht dazu",
              "aufgabenbereich"],
  schlagworte: ["aufgaben", "aufgabenbereich", "tätigkeit", "zuständig",
                "rolle", "auftrag", "was darf ich"],
  kurz: "Deine Aufgabe ist die individuelle Unterstützung des begleiteten Kindes, damit es am Unterricht teilhaben kann — nicht die Vermittlung von Lerninhalten und nicht die Betreuung der ganzen Klasse.",
  schritte: [
    "Unterstützung bei Orientierung, Struktur und Handlungsschritten im Unterricht.",
    "Hilfe bei Kommunikation, sozialer Teilhabe und im Umgang mit Mitschülerinnen und Mitschülern.",
    "Unterstützung in Pausen, bei Raumwechseln sowie — je nach Bedarf — bei lebenspraktischen Verrichtungen.",
    "Begleitung bei herausforderndem Verhalten und Deeskalation."
  ],
  hinweise: [
    { ton: "warn", text: "Nicht zu deinen Aufgaben gehören: Unterricht erteilen, Noten geben, Aufsicht für die gesamte Klasse übernehmen oder Vertretungsstunden halten. Wenn das von dir erwartet wird, bitte die Einsatzleitung informieren." },
    { ton: "info", text: "Der konkrete Auftrag steht in der Hilfeplanung bzw. im Bewilligungsbescheid des Kostenträgers." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-aufsicht", "einsatz-konflikt", "einsatz-pflege", "einsatz-doku"]
},
{
  id: "einsatz-aufsicht",
  kategorie: "einsatz",
  frage: "Darf ich die Aufsicht über die Klasse übernehmen?",
  varianten: ["aufsichtspflicht", "aufsicht übernehmen", "allein mit der klasse",
              "lehrer ist weg", "darf ich aufsicht führen"],
  schlagworte: ["aufsicht", "aufsichtspflicht", "allein", "klasse",
                "vertretung", "verantwortung"],
  kurz: "Nein. Die Aufsichtspflicht für die Klasse liegt bei der Schule, nicht bei der Schulbegleitung. Du bist für das von dir begleitete Kind zuständig.",
  hinweise: [
    { ton: "urgent", text: "Wenn du regelmäßig allein mit der Klasse gelassen wirst, melde das bitte umgehend der Einsatzleitung — das ist arbeits- und haftungsrechtlich relevant." },
    { ton: "info", text: "In einer akuten Notsituation gilt selbstverständlich die allgemeine Hilfeleistungspflicht." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-aufgaben", "einsatz-konflikt", "recht-haftung"]
},
{
  id: "einsatz-konflikt",
  kategorie: "einsatz",
  frage: "Es gibt Konflikte in der Schule oder mit der Lehrkraft — was tun?",
  varianten: ["konflikt lehrer", "streit in der schule", "probleme mit der schule",
              "unstimmigkeiten", "schwierige zusammenarbeit"],
  schlagworte: ["konflikt", "streit", "problem", "lehrkraft", "schule",
                "zusammenarbeit", "eskalation", "beschwerde"],
  kurz: "Konflikte nicht allein austragen. Die Einsatzleitung ist deine Schnittstelle zur Schule und klärt auf Leitungsebene.",
  schritte: [
    "Die Situation sachlich und zeitnah schriftlich festhalten (Datum, Beteiligte, Vorfall).",
    "Die Einsatzleitung informieren, bevor sich der Konflikt verfestigt.",
    "Gemeinsames Gespräch über die Einsatzleitung organisieren lassen.",
    "Im Alltag weiterhin professionell und freundlich bleiben — die Rolle bleibt beim Kind."
  ],
  hinweise: [
    { ton: "info", text: "Für belastende Situationen gibt es Supervision und kollegiale Beratung. Frag danach — das ist ausdrücklich erwünscht und kein Zeichen von Überforderung." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-verhalten", "entwicklung-supervision", "einsatz-eltern"]
},
{
  id: "einsatz-verhalten",
  kategorie: "einsatz",
  frage: "Das Kind zeigt herausforderndes Verhalten — wie reagiere ich?",
  varianten: ["herausforderndes verhalten", "kind wird aggressiv",
              "kind schlägt", "ausraster", "deeskalation",
              "kind läuft weg"],
  schlagworte: ["verhalten", "aggressiv", "eskalation", "deeskalation",
                "krise", "ausraster", "weglaufen", "schlagen", "beißen"],
  kurz: "Sicherheit geht vor: Reize reduzieren, ruhig bleiben, Abstand ermöglichen. Körperliche Einwirkung nur zur Abwehr einer akuten Gefahr und nur so viel wie unbedingt nötig.",
  schritte: [
    "Ruhige, klare Sprache, wenig Worte, keine Diskussion in der Eskalation.",
    "Reizarme Situation herstellen: Rückzugsort nutzen, Publikum reduzieren.",
    "Lehrkraft informieren und bei Bedarf Unterstützung holen.",
    "Nach der Situation: Vorfall dokumentieren und der Einsatzleitung melden.",
    "Bei Verletzung von dir oder anderen: zusätzlich als Unfall melden."
  ],
  hinweise: [
    { ton: "urgent", text: "Freiheitsentziehende oder fixierende Maßnahmen sind nicht zulässig. Bei akuter Gefahr für Leib und Leben gilt Notwehr bzw. Nothilfe — und anschließend sofortige Meldung." },
    { ton: "info", text: "Wiederholt eskalierende Situationen gehören in die Hilfeplanung. Melde sie, damit der Auftrag angepasst werden kann." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-notfall", "einsatz-doku", "entwicklung-supervision", "recht-haftung"]
},
{
  id: "einsatz-notfall",
  kategorie: "einsatz",
  frage: "Notfall oder Unfall im Einsatz — was ist die Reihenfolge?",
  varianten: ["notfall", "unfall", "verletzung", "krankenwagen",
              "erste hilfe", "arbeitsunfall", "es ist ein unfall passiert",
              "es ist etwas passiert", "kind hat sich verletzt"],
  schlagworte: ["notfall", "unfall", "verletzt", "verletzung", "erste hilfe",
                "112", "rettungsdienst", "arbeitsunfall", "notarzt",
                "vorfall", "zwischenfall", "passiert", "sturz"],
  kurz: "Erst Sicherheit und Erste Hilfe, dann Schule, dann Therapon24. Bei Gefahr für Leben oder Gesundheit sofort 112.",
  schritte: [
    "Gefahrenstelle sichern, Erste Hilfe leisten, bei Bedarf 112 wählen.",
    "Lehrkraft bzw. Schulleitung informieren — die Schule verständigt die Eltern.",
    "Einsatzleitung informieren: {{kontakt.einsatzleitung.tel}}",
    "Außerhalb der Bürozeiten: {{kontakt.notfall.tel}}",
    "Vorfall noch am selben Tag schriftlich dokumentieren."
  ],
  hinweise: [
    { ton: "urgent", text: "Wenn du selbst verletzt wirst — auch leicht: Das ist ein Arbeitsunfall. Durchgangsarzt aufsuchen und dem Arbeitgeber melden, damit die Unfallversicherung greift." },
    { ton: "info", text: "Auch Unfälle auf dem direkten Weg zum und vom Einsatz sind als Wegeunfall versichert." }
  ],
  kontakt: "notfall",
  verwandt: ["einsatz-verhalten", "recht-haftung", "abwesenheit-krank"]
},
{
  id: "einsatz-pflege",
  kategorie: "einsatz",
  frage: "Darf ich Medikamente geben oder pflegerische Aufgaben übernehmen?",
  varianten: ["medikamente geben", "medikamentengabe", "pflege",
              "wickeln", "insulin", "darf ich tabletten geben",
              "toilettengang"],
  schlagworte: ["medikament", "tabletten", "insulin", "pflege", "wickeln",
                "katheter", "notfallmedikament", "sondieren", "toilette"],
  kurz: "Nur mit ausdrücklicher schriftlicher Regelung: schriftliche Anordnung bzw. Einverständnis der Sorgeberechtigten, ärztlicher Medikamentenplan und eine Einweisung. Ohne diese Grundlage keine Medikamentengabe.",
  schritte: [
    "Vorhandensein von schriftlicher Einverständniserklärung und ärztlichem Plan prüfen.",
    "Einweisung in die konkrete Maßnahme einfordern und schriftlich bestätigen lassen.",
    "Jede Gabe mit Datum, Uhrzeit und Dosis dokumentieren.",
    "Unsicherheiten vorab mit der Einsatzleitung klären — nicht spontan im Alltag entscheiden."
  ],
  hinweise: [
    { ton: "urgent", text: "Ohne schriftliche Grundlage keine Medikamentengabe — auch nicht auf mündliche Bitte von Eltern oder Lehrkräften." },
    { ton: "info", text: "Notfallmedikation (z. B. bei Epilepsie) braucht einen eigenen, mit allen Beteiligten abgestimmten Notfallplan." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-aufgaben", "einsatz-notfall", "recht-haftung"]
},
{
  id: "einsatz-ausflug",
  kategorie: "einsatz",
  frage: "Klassenfahrt, Ausflug oder Projektwoche — begleite ich das mit?",
  varianten: ["klassenfahrt", "ausflug", "wandertag", "projektwoche",
              "schulfahrt mitfahren", "exkursion"],
  schlagworte: ["klassenfahrt", "ausflug", "wandertag", "exkursion",
                "projektwoche", "schullandheim", "übernachtung"],
  kurz: "Grundsätzlich ja, wenn das Kind teilnimmt — aber nie ohne vorherige Freigabe durch die Einsatzleitung, da Arbeitszeit, Kosten und Versicherung geklärt werden müssen.",
  schritte: [
    "Termin, Dauer und Übernachtungen sofort nach Bekanntgabe an die Einsatzleitung melden.",
    "Klären lassen: Arbeitszeiterfassung, Nachtzeiten, Verpflegung und Fahrtkosten.",
    "Schriftliche Bestätigung abwarten, bevor du der Schule zusagst."
  ],
  hinweise: [
    { ton: "warn", text: "Mehrtägige Fahrten mit Übernachtung sind arbeitszeitrechtlich besonders. Bitte unbedingt vorher klären — nicht spontan zusagen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["zeit-dienstplan", "zeit-ueberstunden", "geld-fahrtkosten"]
},
{
  id: "einsatz-eltern",
  kategorie: "einsatz",
  frage: "Wie gehe ich mit Elternkontakt um?",
  varianten: ["eltern", "elterngespräch", "eltern fragen mich",
              "kontakt zu eltern", "was darf ich den eltern sagen",
              "eltern wollen meine nummer"],
  schlagworte: ["eltern", "elternkontakt", "sorgeberechtigte",
                "elterngespräch", "privatnummer", "whatsapp"],
  kurz: "Freundlicher Tür-und-Angel-Kontakt ja — inhaltliche Absprachen, Einschätzungen und Vereinbarungen laufen über die Einsatzleitung.",
  schritte: [
    "Bei inhaltlichen Fragen freundlich an die Einsatzleitung verweisen.",
    "Keine privaten Kontaktdaten weitergeben und keine privaten Messenger-Gruppen nutzen.",
    "Elterngespräche nur gemeinsam mit Einsatzleitung oder Schule führen.",
    "Wichtige Mitteilungen von Eltern zeitnah an die Einsatzleitung weitergeben."
  ],
  hinweise: [
    { ton: "warn", text: "Keine diagnostischen oder prognostischen Aussagen gegenüber Eltern treffen ('Ihr Kind hat …', 'Das wird sich nicht ändern'). Das ist nicht deine Rolle und kann rechtlich heikel werden." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["recht-schweigepflicht", "einsatz-konflikt", "einsatz-doku"]
},
{
  id: "einsatz-doku",
  kategorie: "einsatz",
  frage: "Was und wie muss ich dokumentieren?",
  varianten: ["dokumentation", "bericht schreiben", "entwicklungsbericht",
              "doku", "was muss ich aufschreiben", "protokoll",
              "wie dokumentiere ich richtig", "wie dokumentiere ich"],
  schlagworte: ["dokumentation", "doku", "dokumentieren", "bericht",
                "entwicklungsbericht", "protokoll", "aufschreiben",
                "notizen", "festhalten", "berichtswesen"],
  kurz: "Dokumentiert wird sachlich, zeitnah und beobachtungsbasiert — was war, nicht was du vermutest. Die Berichte sind Grundlage für die Hilfeplanung und die Verlängerung der Maßnahme.",
  schritte: [
    "Laufende Kurznotizen zum Einsatztag: Anwesenheit, Unterstützungsbedarf, Besonderheiten.",
    "Beobachtungen konkret formulieren: 'verließ zweimal den Raum' statt 'war unmotiviert'.",
    "Besondere Vorkommnisse am selben Tag festhalten und melden.",
    "Entwicklungsberichte zu den vereinbarten Terminen einreichen: {{links.formulare}}"
  ],
  hinweise: [
    { ton: "warn", text: "Dokumentation enthält Sozialdaten. Keine Notizen auf privaten Geräten oder in privaten Cloud-Diensten speichern, keine Namen in Messenger-Nachrichten." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["recht-schweigepflicht", "recht-datenschutz", "einsatz-verhalten"]
},

/* ========================= PFLICHTEN & NACHWEISE ======================== */
{
  id: "recht-schweigepflicht",
  kategorie: "recht",
  frage: "Was bedeutet Schweigepflicht in meinem Alltag konkret?",
  varianten: ["schweigepflicht", "darf ich darüber reden",
              "verschwiegenheit", "über das kind sprechen",
              "mit anderen reden"],
  schlagworte: ["schweigepflicht", "verschwiegenheit", "geheimhaltung",
                "datenschutz", "reden", "erzählen", "privat"],
  kurz: "Alles, was du über das Kind, die Familie und die Schule erfährst, bleibt im dienstlichen Rahmen — auch nach Ende des Einsatzes und auch gegenüber Familie und Freunden.",
  schritte: [
    "Informationen nur an Personen weitergeben, die sie dienstlich benötigen.",
    "Keine Namen oder erkennbaren Details in privaten Gesprächen, Messengern oder sozialen Medien.",
    "Auch gegenüber anderen Eltern in der Schule: keine Auskünfte.",
    "Im Zweifel vorher die Einsatzleitung fragen."
  ],
  hinweise: [
    { ton: "urgent", text: "Ausnahme: Bei gewichtigen Anhaltspunkten für eine Kindeswohlgefährdung besteht ein eigenes Verfahren. Dann sofort die Einsatzleitung einschalten — nicht allein entscheiden und nicht schweigen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["recht-kindeswohl", "recht-datenschutz", "recht-fotos", "einsatz-eltern"]
},
{
  id: "recht-kindeswohl",
  kategorie: "recht",
  frage: "Ich habe den Verdacht auf Kindeswohlgefährdung — was muss ich tun?",
  varianten: ["kindeswohlgefährdung", "verdacht misshandlung",
              "kind wird vernachlässigt", "blaue flecken",
              "kinderschutz", "8a"],
  schlagworte: ["kindeswohl", "gefährdung", "misshandlung", "vernachlässigung",
                "kinderschutz", "verdacht", "8a", "schutzauftrag"],
  kurz: "Beobachtungen sachlich dokumentieren und unverzüglich die Einsatzleitung einschalten. Du entscheidest und handelst nicht allein — dafür gibt es ein festgelegtes Verfahren.",
  schritte: [
    "Konkrete Beobachtungen mit Datum und Uhrzeit notieren — ohne Bewertung und ohne Deutung.",
    "Sofort die Einsatzleitung informieren, auch bei Unsicherheit.",
    "Keine eigenen Ermittlungen, keine Konfrontation der Eltern, keine Befragung des Kindes.",
    "Das weitere Vorgehen erfolgt über die insoweit erfahrene Fachkraft und gegebenenfalls das Jugendamt."
  ],
  hinweise: [
    { ton: "urgent", text: "Grundlage ist der Schutzauftrag nach § 8a SGB VIII. Lieber einmal zu früh melden als zu spät — die Einschätzung trifft nicht du allein." },
    { ton: "info", text: "Bei akuter Gefahr für das Kind: sofort Polizei oder Jugendamt-Bereitschaft verständigen und anschließend Therapon24 informieren." }
  ],
  rechtlich: true,
  kontakt: "einsatzleitung",
  verwandt: ["recht-schweigepflicht", "einsatz-notfall", "einsatz-doku"]
},
{
  id: "recht-fotos",
  kategorie: "recht",
  frage: "Darf ich Fotos oder Videos vom Kind machen?",
  varianten: ["fotos machen", "foto vom kind", "video aufnehmen",
              "bilder schicken", "handy nutzen"],
  schlagworte: ["foto", "fotos", "video", "aufnahme", "bild", "handy",
                "kamera", "whatsapp"],
  kurz: "Nein — nicht ohne ausdrückliche schriftliche Einwilligung der Sorgeberechtigten und nicht auf privaten Geräten.",
  hinweise: [
    { ton: "urgent", text: "Keine Aufnahmen in privaten Messengern teilen, auch nicht im Kollegenkreis. Verstöße können arbeitsrechtliche und datenschutzrechtliche Folgen haben." },
    { ton: "info", text: "Wird für die Dokumentation eine Aufnahme benötigt, läuft das über die Einsatzleitung mit vorliegender Einwilligung und auf dienstlichem Gerät." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["recht-datenschutz", "recht-schweigepflicht", "recht-handy"]
},
{
  id: "recht-handy",
  kategorie: "recht",
  frage: "Darf ich mein Handy im Einsatz benutzen?",
  varianten: ["handy im unterricht", "privates handy", "smartphone nutzen",
              "telefonieren während des einsatzes"],
  schlagworte: ["handy", "smartphone", "telefon", "privat", "nutzung",
                "unterricht"],
  kurz: "Im Unterricht bleibt das private Handy aus oder lautlos. Dienstliche Erreichbarkeit regelt die Einsatzleitung, die Hausordnung der Schule gilt zusätzlich.",
  hinweise: [
    { ton: "info", text: "Du bist Vorbild für das Kind und für die Klasse. Private Nutzung im Unterricht wirkt sich direkt auf die Zusammenarbeit mit der Schule aus." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["recht-fotos", "recht-datenschutz"]
},
{
  id: "recht-datenschutz",
  kategorie: "recht",
  frage: "Worauf muss ich beim Datenschutz achten?",
  varianten: ["datenschutz", "dsgvo", "daten speichern", "unterlagen",
              "wo darf ich notizen speichern"],
  schlagworte: ["datenschutz", "dsgvo", "daten", "unterlagen", "cloud",
                "speichern", "usb", "e-mail"],
  kurz: "Personenbezogene Daten gehören ausschließlich in die dienstlichen Systeme und Unterlagen — nicht auf private Geräte, nicht in private Clouds, nicht in Messenger.",
  schritte: [
    "Unterlagen nicht offen liegen lassen und nicht im Auto aufbewahren.",
    "Keine Klarnamen in E-Mail-Betreffzeilen oder Chat-Nachrichten.",
    "Dokumentation nur in den dafür vorgesehenen Vorlagen und Systemen.",
    "Alte Unterlagen nicht selbst entsorgen, sondern über das Büro vernichten lassen."
  ],
  hinweise: [
    { ton: "warn", text: "Bei einem Datenvorfall — verlorene Unterlagen, verlorenes Gerät, Fehlversand — sofort melden. Es gibt enge gesetzliche Meldefristen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["recht-schweigepflicht", "recht-fotos", "einsatz-doku"]
},
{
  id: "recht-fuehrungszeugnis",
  kategorie: "recht",
  frage: "Brauche ich ein erweitertes Führungszeugnis?",
  varianten: ["führungszeugnis", "erweitertes führungszeugnis",
              "polizeiliches führungszeugnis", "wann muss ich das erneuern"],
  schlagworte: ["führungszeugnis", "erweitert", "polizeilich", "nachweis",
                "vorlage", "erneuern"],
  kurz: "Ja. Für die Arbeit mit Kindern und Jugendlichen ist ein erweitertes Führungszeugnis vorzulegen und regelmäßig zu erneuern.",
  schritte: [
    "Beantragung beim Bürgeramt deines Wohnorts.",
    "Für die Gebührenbefreiung die Bestätigung des Arbeitgebers mitnehmen — fordere sie bei der Personalabteilung an.",
    "Das Original der Personalabteilung vorlegen.",
    "Erinnerung für die Erneuerung setzen, bevor die Frist abläuft."
  ],
  hinweise: [
    { ton: "info", text: "Grundlage ist § 72a SGB VIII. Die Wiedervorlage erfolgt üblicherweise alle drei bis fünf Jahre." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["recht-masern", "recht-hygiene", "vertrag-unterlagen"]
},
{
  id: "recht-masern",
  kategorie: "recht",
  frage: "Muss ich einen Masernschutznachweis vorlegen?",
  varianten: ["masern", "masernschutz", "impfnachweis", "impfung nachweis"],
  schlagworte: ["masern", "impfung", "impfnachweis", "masernschutzgesetz",
                "immunität"],
  kurz: "Ja. Für Tätigkeiten in Schulen ist ein Nachweis über Masernimmunität oder eine Kontraindikation erforderlich.",
  hinweise: [
    { ton: "info", text: "Grundlage ist das Masernschutzgesetz (§ 20 Abs. 8 IfSG). Als Nachweis genügen Impfausweis, ärztliche Bescheinigung über Immunität oder eine Kontraindikationsbescheinigung." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["recht-fuehrungszeugnis", "recht-hygiene"]
},
{
  id: "recht-hygiene",
  kategorie: "recht",
  frage: "Welche Hygiene- und Infektionsschutzregeln gelten für mich?",
  varianten: ["hygiene", "infektionsschutz", "belehrung",
              "ansteckende krankheit", "läuse", "magen darm"],
  schlagworte: ["hygiene", "infektionsschutz", "belehrung", "ifsg",
                "ansteckend", "läuse", "noro", "magen-darm"],
  kurz: "Es gelten die Hygienevorgaben der jeweiligen Schule sowie das Infektionsschutzgesetz. Bei ansteckenden Erkrankungen gilt ein Tätigkeitsverbot.",
  schritte: [
    "Hygieneplan der Einsatzschule zu Beginn des Einsatzes erfragen.",
    "Bei Verdacht auf eine meldepflichtige Erkrankung sofort Einsatzleitung informieren und nicht zum Dienst erscheinen.",
    "Nach Infektion erst zurückkehren, wenn keine Ansteckungsgefahr mehr besteht."
  ],
  hinweise: [
    { ton: "info", text: "Für Tätigkeiten in Gemeinschaftseinrichtungen ist eine Belehrung nach § 35 IfSG vorgesehen. Ob und wann sie für dich ansteht, klärt die Personalabteilung." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["recht-masern", "abwesenheit-krank"]
},
{
  id: "recht-haftung",
  kategorie: "recht",
  frage: "Was passiert, wenn etwas kaputtgeht oder jemand zu Schaden kommt?",
  varianten: ["haftung", "schaden", "versicherung", "etwas kaputt gemacht",
              "brille zerbrochen", "haftpflicht"],
  schlagworte: ["haftung", "schaden", "versicherung", "haftpflicht",
                "kaputt", "beschädigt", "unfallversicherung"],
  kurz: "Melde jeden Schaden sofort und schriftlich — auch kleine. Für Schäden im Rahmen der Tätigkeit gelten die Grundsätze der Arbeitnehmerhaftung, meist greift die Betriebshaftpflicht.",
  schritte: [
    "Vorfall am selben Tag mit Datum, Beteiligten und Hergang dokumentieren.",
    "Einsatzleitung informieren — keine Zusagen gegenüber Geschädigten machen.",
    "Keine eigenständige Schadensregulierung und keine Zahlungszusagen.",
    "Bei Personenschäden zusätzlich als Unfall melden."
  ],
  hinweise: [
    { ton: "info", text: "Nach den Grundsätzen des innerbetrieblichen Schadensausgleichs haftet man bei leichter Fahrlässigkeit in der Regel nicht. Umso wichtiger ist die rechtzeitige Meldung." }
  ],
  rechtlich: true,
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-notfall", "einsatz-verhalten", "einsatz-aufsicht"]
},

/* ========================= EINARBEITUNG & FORTBILDUNG =================== */
{
  id: "entwicklung-erster-tag",
  kategorie: "entwicklung",
  frage: "Ich habe einen neuen Einsatz — wie läuft der erste Tag?",
  varianten: ["erster tag", "neuer einsatz", "neue schule",
              "was muss ich mitbringen", "einarbeitung"],
  schlagworte: ["erster tag", "start", "beginn", "neu", "einarbeitung",
                "hospitation", "kennenlernen"],
  kurz: "Vor dem ersten Tag gibt es ein Vorgespräch mit der Einsatzleitung und in der Regel eine Vorstellung in der Schule. Komm früher, melde dich im Sekretariat.",
  schritte: [
    "Vorab klären: Ansprechperson in der Schule, Klasse, Zeiten, Besonderheiten des Kindes.",
    "Am ersten Tag etwa 15 Minuten früher da sein und im Sekretariat melden.",
    "Hausordnung, Hygieneplan, Fluchtwege und Pausenregelung erfragen.",
    "Kontaktdaten der Einsatzleitung im Handy speichern.",
    "Am Ende der ersten Woche kurze Rückmeldung an die Einsatzleitung geben."
  ],
  hinweise: [
    { ton: "info", text: "Fragen in der Anfangszeit sind ausdrücklich erwünscht. Lieber einmal mehr nachfragen als eine Regelung falsch annehmen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-aufgaben", "entwicklung-supervision", "zeit-dienstplan"]
},
{
  id: "entwicklung-fortbildung",
  kategorie: "entwicklung",
  frage: "Kann ich an Fortbildungen teilnehmen?",
  varianten: ["fortbildung", "weiterbildung", "schulung", "kurs",
              "qualifizierung", "seminar"],
  schlagworte: ["fortbildung", "weiterbildung", "schulung", "seminar",
                "kurs", "qualifikation", "bildungsurlaub"],
  kurz: "Ja. Das Fortbildungsangebot findest du unter {{links.fortbildungen}} — Teilnahme nach Absprache mit der Einsatzleitung.",
  schritte: [
    "Wunschfortbildung auswählen und Termin prüfen.",
    "Freigabe bei der Einsatzleitung einholen, damit die Vertretung geplant werden kann.",
    "Kostenübernahme und Anrechnung als Arbeitszeit vorab schriftlich klären.",
    "Teilnahmebescheinigung an die Personalabteilung weitergeben."
  ],
  hinweise: [
    { ton: "info", text: "Zusätzlich besteht in den meisten Bundesländern ein gesetzlicher Anspruch auf Bildungsurlaub. Die Regelungen unterscheiden sich je nach Bundesland." }
  ],
  kontakt: "personalabteilung",
  verwandt: ["entwicklung-supervision", "urlaub-antrag"]
},
{
  id: "entwicklung-supervision",
  kategorie: "entwicklung",
  frage: "Gibt es Supervision oder Unterstützung bei Belastung?",
  varianten: ["supervision", "belastung", "überfordert", "psychische belastung",
              "ich kann nicht mehr", "beratung", "fallbesprechung"],
  schlagworte: ["supervision", "belastung", "überforderung", "beratung",
                "fallbesprechung", "entlastung", "psychisch", "stress"],
  kurz: "Ja — Supervision, kollegiale Fallbesprechung und Gespräche mit der Einsatzleitung sind fester Teil der Arbeit. Melde Belastung früh, nicht erst im Zusammenbruch.",
  schritte: [
    "Belastende Situationen zeitnah bei der Einsatzleitung ansprechen.",
    "Teilnahme an Supervision oder Fallbesprechung anfragen.",
    "Bei anhaltender Belastung: Gespräch über Anpassung des Einsatzes führen."
  ],
  hinweise: [
    { ton: "info", text: "Belastung in der Schulbegleitung ist normal und kein persönliches Versagen — besonders bei herausforderndem Verhalten oder schwierigen Familiensituationen." }
  ],
  kontakt: "einsatzleitung",
  verwandt: ["einsatz-verhalten", "einsatz-konflikt", "entwicklung-fortbildung"]
},

/* ========================= VERTRAG & ORGANISATION ======================= */
{
  id: "vertrag-ansprechpartner",
  kategorie: "vertrag",
  frage: "Wer ist wofür zuständig?",
  varianten: ["ansprechpartner", "wen frage ich", "wer ist zuständig",
              "kontakt", "an wen wende ich mich", "telefonnummer"],
  schlagworte: ["ansprechpartner", "zuständig", "kontakt", "wen",
                "telefonnummer", "erreichbarkeit", "büro"],
  kurz: "Kurz gesagt: Alles rund um den Einsatz läuft über die Einsatzleitung, alles rund um Vertrag und Papiere über die Personalabteilung, alles rund um Geld über die Lohnbuchhaltung.",
  schritte: [
    "Einsatz, Zeiten, Schule, Kind, Krankmeldung → Einsatzleitung.",
    "Vertrag, Urlaub, Bescheinigungen, Nachweise → Personalabteilung.",
    "Abrechnung, Fahrtkosten, Auszahlung → Lohnbuchhaltung.",
    "Außerhalb der Bürozeiten in dringenden Fällen → Rufbereitschaft."
  ],
  kontakt: "zentrale",
  verwandt: ["einsatz-notfall", "abwesenheit-krank", "geld-fehler"]
},
{
  id: "vertrag-stunden",
  kategorie: "vertrag",
  frage: "Kann ich meine Wochenstunden aufstocken oder reduzieren?",
  varianten: ["stunden aufstocken", "mehr stunden", "weniger arbeiten",
              "teilzeit beantragen", "stundenreduzierung", "vollzeit"],
  schlagworte: ["stunden", "aufstocken", "reduzieren", "teilzeit",
                "vollzeit", "wochenstunden", "arbeitszeit ändern"],
  kurz: "Eine Änderung des Stundenumfangs ist eine Vertragsänderung und wird schriftlich mit der Personalabteilung vereinbart.",
  schritte: [
    "Wunsch mit Zeitpunkt und gewünschtem Umfang schriftlich bei der Personalabteilung einreichen.",
    "Die Einsatzleitung prüft, ob passende Einsätze verfügbar sind.",
    "Änderung wird als Vertragsnachtrag unterschrieben — erst dann gilt sie."
  ],
  hinweise: [
    { ton: "info", text: "In Betrieben mit mehr als 15 Beschäftigten besteht nach § 8 TzBfG ein Anspruch auf Verringerung der Arbeitszeit, wenn das Arbeitsverhältnis länger als sechs Monate besteht. Der Antrag ist spätestens drei Monate vorher zu stellen." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["urlaub-teilzeit", "zeit-aenderung", "vertrag-kuendigung"]
},
{
  id: "vertrag-bescheinigung",
  kategorie: "vertrag",
  frage: "Ich brauche eine Bescheinigung (Arbeitgeber, Elterngeld, Bank, Wohnung)",
  varianten: ["bescheinigung", "arbeitgeberbescheinigung", "nachweis für die bank",
              "elterngeld bescheinigung", "mietbescheinigung",
              "arbeitszeugnis"],
  schlagworte: ["bescheinigung", "nachweis", "arbeitgeberbescheinigung",
                "zeugnis", "arbeitszeugnis", "elterngeld", "bank",
                "vermieter", "bafög"],
  kurz: "Bescheinigungen stellt die Personalabteilung aus. Plane etwa eine Woche Bearbeitungszeit ein.",
  schritte: [
    "Formular oder genaue Bezeichnung der benötigten Bescheinigung bereitlegen.",
    "Anfrage per E-Mail an die Personalabteilung mit Frist und Verwendungszweck.",
    "Bei Behördenformularen das Original mitsenden, falls Stempel erforderlich ist."
  ],
  hinweise: [
    { ton: "info", text: "Auf ein qualifiziertes Arbeitszeugnis besteht ein gesetzlicher Anspruch (§ 109 GewO) — in der Regel bei Beendigung, auf Wunsch auch als Zwischenzeugnis." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["geld-abrechnung", "vertrag-unterlagen"]
},
{
  id: "vertrag-unterlagen",
  kategorie: "vertrag",
  frage: "Welche Unterlagen muss ich bei Therapon24 eingereicht haben?",
  varianten: ["welche unterlagen", "dokumente einreichen", "was fehlt noch",
              "papiere", "personalbogen"],
  schlagworte: ["unterlagen", "dokumente", "papiere", "einreichen",
                "sozialversicherungsnummer", "personalbogen", "nachweise"],
  kurz: "Üblich sind: Personalbogen, Sozialversicherungsausweis, Steuer-ID, Bankverbindung, Krankenkassennachweis, erweitertes Führungszeugnis, Masernschutznachweis und Qualifikationsnachweise.",
  hinweise: [
    { ton: "info", text: "Welche Unterlagen bei dir noch fehlen, sagt dir die Personalabteilung. Fehlende Nachweise können die erste Abrechnung verzögern." }
  ],
  kontakt: "personalabteilung",
  verwandt: ["recht-fuehrungszeugnis", "recht-masern", "geld-steuerklasse"]
},
{
  id: "vertrag-kuendigung",
  kategorie: "vertrag",
  frage: "Welche Kündigungsfrist habe ich?",
  varianten: ["kündigung", "kündigungsfrist", "kündigen",
              "aufhebungsvertrag", "arbeitsverhältnis beenden"],
  schlagworte: ["kündigung", "kündigungsfrist", "kündigen", "beenden",
                "aufhebungsvertrag", "probezeit"],
  kurz: "Es gilt die Frist aus deinem Arbeitsvertrag. Fehlt dort eine Regelung, greifen die gesetzlichen Fristen.",
  hinweise: [
    { ton: "info", text: "Gesetzlich (§ 622 BGB): in der Probezeit zwei Wochen, danach für Arbeitnehmende vier Wochen zum 15. oder zum Monatsende. Für den Arbeitgeber verlängern sich die Fristen mit der Beschäftigungsdauer." },
    { ton: "warn", text: "Eine Kündigung muss schriftlich mit Originalunterschrift erfolgen. Per E-Mail, Fax oder Messenger ist sie unwirksam." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["vertrag-stunden", "vertrag-bescheinigung"]
},
{
  id: "vertrag-elternzeit",
  kategorie: "vertrag",
  frage: "Schwangerschaft, Mutterschutz und Elternzeit — was ist zu tun?",
  varianten: ["schwanger", "mutterschutz", "elternzeit", "elterngeld",
              "schwangerschaft melden"],
  schlagworte: ["schwanger", "schwangerschaft", "mutterschutz", "elternzeit",
                "elterngeld", "geburt", "beschäftigungsverbot"],
  kurz: "Melde eine Schwangerschaft frühzeitig der Personalabteilung — erst dann greifen die Schutzvorschriften, und der Einsatz kann angepasst werden.",
  schritte: [
    "Schwangerschaft und voraussichtlichen Entbindungstermin der Personalabteilung mitteilen.",
    "Gefährdungsbeurteilung für den Arbeitsplatz abwarten — in der Schulbegleitung ist das wegen Infektionsrisiken und körperlicher Belastung besonders relevant.",
    "Elternzeit spätestens sieben Wochen vor Beginn schriftlich beantragen.",
    "Elterngeld separat bei der Elterngeldstelle beantragen; Bescheinigungen über die Personalabteilung anfordern."
  ],
  hinweise: [
    { ton: "info", text: "Mutterschutzfristen: in der Regel sechs Wochen vor und acht Wochen nach der Entbindung. Grundlage sind MuSchG und BEEG." }
  ],
  rechtlich: true,
  kontakt: "personalabteilung",
  verwandt: ["vertrag-bescheinigung", "abwesenheit-sonderurlaub", "recht-hygiene"]
},
{
  id: "meta-app",
  kategorie: "vertrag",
  frage: "Woher kommen die Antworten in dieser App?",
  varianten: ["wer bist du", "was kannst du", "wie funktioniert das",
              "bist du eine ki", "hilfe"],
  schlagworte: ["app", "assistent", "ki", "chatbot", "hilfe", "funktion",
                "woher", "quelle"],
  kurz: "Ich bin der interne Assistent von Therapon24. Meine Antworten stammen aus einer gepflegten Wissensbasis zu den häufigsten Fragen aus dem Arbeitsalltag.",
  schritte: [
    "Firmeninterne Angaben stammen aus der hinterlegten Konfiguration.",
    "Mit 'Gesetz' gekennzeichnete Antworten geben die allgemeine Rechtslage wieder.",
    "Was hier nicht hinterlegt ist, sage ich offen — dann bekommst du die richtige Ansprechperson genannt."
  ],
  hinweise: [
    { ton: "warn", text: "Diese App ersetzt keine Rechtsberatung und keine verbindliche Auskunft. Im Zweifel gilt immer dein Arbeitsvertrag und die Aussage deiner Ansprechperson." }
  ],
  kontakt: "zentrale",
  verwandt: ["vertrag-ansprechpartner"]
}

];
