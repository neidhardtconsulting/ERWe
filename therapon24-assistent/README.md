# Therapon24 Assistent

Interner Chat-Assistent für Schulbegleitungen und alle weiteren Mitarbeitenden
von Therapon24. Beantwortet die wiederkehrenden Fragen aus dem Arbeitsalltag —
Zeiterfassung, Krankmeldung, Urlaub, Schulalltag, Gehalt, Pflichten.

Reines HTML/CSS/JS ohne Build-Schritt. Läuft offline, auf dem Handy wie am
Rechner, und lässt sich als App auf den Startbildschirm legen.

## Bedienung

Aufgebaut wie ein gewohnter Chat-Assistent — man kann sofort lostippen:

- **Leerzustand:** Eingabefeld mittig auf dem Schirm, darunter vier
  Einstiegsvorschläge („Ich bin krank“, „Stunden eintragen“ …). Keine
  Startseite, die erst weggeklickt werden muss.
- **Nach der ersten Frage:** Die Eingabe dockt unten an, der Verlauf füllt den
  Schirm. Frage rechts als Blase, Antwort links mit Signet — ohne Kartenrahmen,
  damit lange Antworten ruhig lesbar bleiben.
- **Bewusst reduziert:** Sichtbar ist nur, was zum Handeln nötig ist —
  Kernantwort, Schritte, dringende Warnung, Ansprechperson. Erklärungen und
  Rechtsgrundlagen liegen unter „Mehr dazu“. Keine Kategorie-Etiketten, keine
  wiederholte Überschrift, höchstens zwei Folgefragen. Die Bewertungszeile ist
  standardmäßig aus (`optionen.feedbackSammeln` in `js/config.js`).
- **Mehrere Chats:** Jedes Gespräch wird unter seiner ersten Frage geführt und
  bleibt in der Seitenleiste abrufbar — wechseln per Klick, einzeln löschbar
  über das Papierkorb-Symbol. „Neuer Chat“ über den Knopf in der Seitenleiste
  oder das Stift-Symbol rechts oben; das laufende Gespräch geht dabei nicht
  verloren. Es werden bis zu 40 Gespräche behalten, danach fällt das älteste
  heraus.
- **Seitenleiste (☰ links oben):** oben die Chats, darunter aufklappbar alle
  58 Fragen nach Bereichen, plus Suchfeld.
- **Diktieren:** Mikrofonknopf in der Eingabe. Gesprochenes erscheint direkt
  im Feld — erst beim Tippen auf Senden geht die Frage raus, damit man
  Erkennungsfehler vorher sieht. Erneutes Antippen beendet das Diktat.

---

## Der wichtigste Grundsatz

**Der Assistent erfindet nichts.**

Firmenspezifische Angaben — Telefonnummern, Fristen, Systemnamen, Beträge —
stehen ausschließlich in `js/config.js`. Was dort leer ist, erscheint in der
Antwort als gelb markierter Hinweis „noch zu ergänzen“ statt als Vermutung.
Antworten, die auf allgemeiner Gesetzeslage beruhen statt auf einer
Therapon24-Regelung, sind mit „Allgemeine Rechtslage“ gekennzeichnet.

---

## Einrichtung in drei Schritten

### 1. Firmendaten eintragen

`admin.html` im Browser öffnen, die Felder ausfüllen, unten auf
**„config.js herunterladen“** klicken und die Datei nach `js/config.js` kopieren.

Alternativ direkt `js/config.js` im Editor bearbeiten — die Datei ist
durchkommentiert.

Aktuell sind **46 Felder** vorgesehen, davon erscheinen **24** wörtlich in
Antworten. Die Pflegeseite zeigt den Stand unten in der Leiste an.

Was gebraucht wird:

| Bereich | Beispiele |
|---|---|
| Ansprechpartner | Einsatzleitung, Personal, Lohnbuchhaltung, Rufbereitschaft — je Name, Telefon, E-Mail, Erreichbarkeit |
| Zeiterfassung | Name des Systems, Link, Abgabefrist, Fahrzeitregelung |
| Krankmeldung | Meldeweg, Uhrzeit, ab wann AU, wer informiert die Schule |
| Urlaub | Anspruch, Antragsweg, Vorlauffrist, Ferienregelung |
| Entgelt | Zahltag, Abrechnungsportal |
| Fahrtkosten | Kilometerregelung, Abrechnungsweg, Deutschlandticket |
| Links | Mitarbeiterportal, Intranet, Formulare, Fortbildungen |

### 2. Farben und Logo prüfen

Die Farben sind vom Webauftritt therapon24.de abgeleitet und stehen
**ausschließlich** in `css/theme.css` im Block `MARKE`:

```css
--t24-blue:   #42628F;   /* Therapon-Blau */
--t24-orange: #F0912B;   /* Therapon-Orange */
--t24-cream:  #FDF0E1;   /* Karten-/Sektionsfläche */
```

Liegen exakte Hex-Codes aus dem CI-Handbuch vor, nur diese Werte ersetzen —
die gesamte App zieht automatisch nach, inklusive Dunkelmodus.

Die Bilddateien sind **nachgebaute Platzhalter** und beim Vorliegen der
Original-SVG zu ersetzen:

| Datei | Verwendung |
|---|---|
| `img/logo.svg` | Wortmarke in der Kopfzeile (heller Modus) |
| `img/logo-dark.svg` | dieselbe Wortmarke in Hell — sonst im Dunkelmodus unlesbar |
| `img/mark.svg` | Signet ohne Schrift: Startbildschirm und neben jeder Antwort |
| `img/icon.svg` | App-Symbol (Browser-Tab) |
| `img/icon-180.png` | Startbildschirm iOS — iOS ignoriert SVG an dieser Stelle |
| `img/icon-192.png`, `img/icon-512.png` | Startbildschirm Android, Store-Listing |

Die PNG-Symbole sind randlos und das Motiv liegt in den inneren 80 % —
iOS und Android legen ihre eigene Maske darüber. Neu erzeugen lassen sie sich
aus dem Markup in `img/icon.svg`.

### 3. Veröffentlichen

Es reicht, den Ordner statisch auszuliefern. Für Vercel: neues Projekt anlegen,
als **Root Directory** `therapon24-assistent` wählen.

> Hinweis: Dieses Repository enthält die ERWE-Immobilien-Website. Die
> `vercel.json` im Unterordner greift nur, wenn der Ordner als eigenes
> Vercel-Projekt eingebunden wird — Vercel liest sonst nur die Datei im
> Wurzelverzeichnis.

---

## Aufbau

```
therapon24-assistent/
├── index.html              Chat-App
├── admin.html              Pflegeseite: Firmendaten, Übersicht, Rückmeldungen
├── css/
│   ├── theme.css           ALLE Farben (Marke + Dunkelmodus)
│   └── app.css             Layout
├── js/
│   ├── config.js           ► Firmenspezifische Angaben — hier pflegen
│   ├── wissen.js           ► Die Antworten — hier inhaltlich pflegen
│   ├── engine.js           Suche und Zuordnung (deutschsprachig)
│   └── app.js              Oberfläche
├── api/chat.js             Optionaler KI-Endpunkt (Claude API)
├── test/engine.test.js     50 Testfälle für die Trefferqualität
├── sw.js                   Offlinefähigkeit
└── img/                    Logo, Signet, App-Icon (Platzhalter)
```

---

## Wissensbasis pflegen

58 Antworten in 8 Bereichen. Ein neuer Eintrag in `js/wissen.js`:

```js
{
  id: "urlaub-sonderfall",          // eindeutig, kleingeschrieben
  kategorie: "urlaub",              // id aus T24_KATEGORIEN
  frage: "Wie läuft X?",            // erscheint in der Themenliste
  varianten: ["wie geht x", "..."], // ganze Formulierungen (starkes Signal)
  schlagworte: ["x", "y"],          // Einzelwörter (stärkstes Signal)
  kurz: "Die Kernantwort in 1–3 Sätzen. {{urlaub.vorlauf}}",
  schritte: ["Erst …", "Dann …"],   // optional
  hinweise: [                       // optional
    { ton: "warn", text: "Achtung: …" }   // info | ok | warn | urgent
  ],
  kontakt: "einsatzleitung",        // Schlüssel aus config.kontakt
  verwandt: ["urlaub-antrag"],      // Folgefragen
  rechtlich: true                   // nur bei allgemeiner Gesetzeslage
}
```

- `{{pfad.aus.config}}` wird zur Laufzeit ersetzt; fehlt der Wert, erscheint
  im Text nur das kurze Signal „noch offen“ (welche Angabe fehlt, steht im
  Tooltip und vollständig in `admin.html`). **Platzhalter ans Satzende setzen**, nicht mitten in einen
  Satz — sonst zerreißt der Marker den Lesefluss. Mehrere Angaben mit „ · “
  trennen statt mit Punkt.
- `**Text**` wird fett dargestellt.
- Nach jeder Änderung `npm test` ausführen — die Testfälle decken auf, wenn ein
  neuer Eintrag einen bestehenden verdrängt.

```bash
npm test
# Richtig auf Platz 1: 50/50 (100 %)
# In den Top 3:        50/50
```

Unter **Rückmeldungen** in `admin.html` stehen die Fragen, auf die der Assistent
nichts gefunden hat — das sind die Lücken, die als Nächstes dran sind.

---

## Optionaler KI-Modus

Ohne weitere Einrichtung läuft alles über die Wissensbasis: kostenlos, offline,
ohne Datenübertragung.

Zusätzlich kann `api/chat.js` die gefundene Antwort über die Claude API freier
auf die konkrete Frage zuschneiden:

```bash
npm install
# In Vercel: Settings → Environment Variables
#   ANTHROPIC_API_KEY = sk-ant-...
```

Dabei gilt:

- Das Modell **darf nichts hinzuerfinden** — es formuliert ausschließlich den
  gefundenen Wissensbasis-Eintrag um. Reicht der nicht, antwortet es
  `UNZUREICHEND` und die App zeigt die Standardantwort.
- Markierungen `<<fehlt:…>>` werden unverändert durchgereicht.
- Übertragen werden nur die Frage und der bereits gefundene Eintrag —
  **keine Klientendaten, keine Namen, keine Personaldaten.**
- Fehlt der Schlüssel oder ist der Endpunkt nicht erreichbar, fällt die App
  still auf die Wissensbasis zurück. Die Mitarbeitenden merken davon nichts.

Abschalten: in `js/config.js` `optionen.kiModus` auf `"aus"` setzen.

---

## Datenschutz

- Alle Chats, Bewertungen und unbeantworteten Fragen liegen **ausschließlich
  lokal** im Browser der jeweiligen Person (`localStorage`) und werden nicht
  übertragen. Für eine zentrale Auswertung wäre ein Backend nötig.
- Gelöschte Chats sind sofort weg und nicht wiederherstellbar.
- **Diktat:** Chrome und Safari übertragen das Gesprochene zur Erkennung an
  ihre eigenen Server. Die Mitarbeitenden sollten deshalb darauf hingewiesen
  werden, **keine Namen von Kindern oder Familien** zu diktieren — für die
  Fragen dieser App ist das ohnehin nie nötig.
- Der Assistent verarbeitet keine Klienten- oder Personaldaten. Die
  Wissensbasis enthält ausschließlich allgemeine Verfahrensinformationen.
- Ohne KI-Modus verlässt keine einzige Eingabe das Gerät.

---

## Spracheingabe

Umgesetzt mit der Spracherkennung des Browsers (Web Speech API) in
`js/sprache.js` — kein Server, kein Schlüssel, keine laufenden Kosten.

| | |
|---|---|
| Chrome, Edge, Android Chrome | funktioniert |
| Safari ab iOS 14.5 | funktioniert |
| Firefox | nicht unterstützt — der Knopf bleibt verborgen, Tippen geht weiter |
| Nur über HTTPS | über `http://` bietet der Browser kein Mikrofon an |
| Eingebettet in fremde Seiten | nur wenn der Rahmen `allow="microphone"` setzt |

`T24Sprache.zustand()` unterscheidet vier Lagen: `ok`, `kein-browser`,
`unsicher` (kein HTTPS) und `gesperrt` (eingebettet ohne Mikrofon-Freigabe).
Im Fall `gesperrt` erscheint kein toter Knopf, sondern ein Hinweis mit Verweis
zum Öffnen in einem eigenen Tab. Eine Artifact-Vorschau auf claude.ai ist so
ein Fall — dort läuft die Seite in einem Rahmen ohne Mikrofon-Freigabe.

**Wichtig für den Store-Weg:** In einer nativen Hülle (Capacitor, WKWebView)
steht diese Schnittstelle auf **iOS nicht** zur Verfügung. Dort wäre
`@capacitor-community/speech-recognition` nötig. `js/sprache.js` ist deshalb
gekapselt und bietet nur `verfuegbar()` und `erstellen()` nach außen — für
eine native App muss ausschließlich diese Datei ersetzt werden, nicht die
Anwendung.

Die Erkennung läuft bei Chrome und Safari über die Server des jeweiligen
Herstellers. Übertragen wird nur das Diktierte.

## Verteilung an die Mitarbeitenden

Drei Wege, Stand der Entscheidung: offen.

1. **PWA (sofort, 0 €)** — Link aufrufen, „Zum Startbildschirm hinzufügen“.
   Technisch vollständig vorbereitet: Manifest, Service Worker und PNG-Symbole
   liegen bereit. Nachteil: Die Installationsgeste ist auf dem iPhone versteckt
   und für technikferne Nutzende eine echte Hürde.
2. **Private Store-App (empfohlen, falls Store)** — Der Code wird mit
   Capacitor in eine native Hülle gepackt und privat verteilt: über
   *Managed Google Play* (nur für die eigene Organisation sichtbar) und
   Apple *Custom Apps* über den Apple Business Manager. Achtung: Apple prüft
   auch Custom Apps im regulären Review. Für iOS-Builds wird ein Mac mit
   Xcode gebraucht.
3. **Öffentlicher Store** — nicht empfohlen. Apple-Richtlinie 4.2
   („Minimum Functionality“) zielt auf eingepackte Websites, und interne
   Abläufe samt Durchwahlen gehören nicht in ein öffentlich durchsuchbares
   Verzeichnis. Dafür bräuchte es zwingend eine Anmeldung und damit ein
   Backend.

Vor einem Store-Weg zu erledigen: `optionen.apiPfad` in `js/config.js` auf eine
**absolute** URL setzen — in einer Capacitor-App zeigt der relative Pfad
`/api/chat` ins Leere, die App fiele still auf die Wissensbasis zurück.

Kosten: Google Play einmalig ~25 USD, Apple Developer Program ~99 USD pro Jahr,
Apple Business Manager kostenlos.

## Grenzen

- Die Suche arbeitet mit Stichwort- und Phrasenabgleich, nicht mit
  Sprachverständnis. Völlig neue Themen müssen ergänzt werden — sie werden
  nicht erraten, sondern als „nichts Verlässliches hinterlegt“ beantwortet.
- Die App ersetzt keine Rechtsberatung und keine verbindliche Auskunft.
  Im Zweifel gilt der Arbeitsvertrag.
- Gesetzesbezüge (EntgFG, BUrlG, ArbZG, SGB VIII, IfSG, TzBfG, MuSchG) geben
  den allgemeinen Stand wieder und sind als solche gekennzeichnet.
