# Veröffentlichen auf Vercel

Ziel: eine echte HTTPS-Adresse, unter der die App läuft — damit das Diktat
funktioniert, die Seite präsentierbar ist und Mitarbeitende testen können.

---

## Wichtig vorab: der Ordner liegt noch nicht auf `main`

Dieses Repository enthält die ERWE-Immobilien-Website. Der Assistent liegt im
Unterordner `therapon24-assistent/` auf dem Branch **`ccr-f384b727-s2fzau`** —
auf `main` gibt es ihn noch nicht.

Vercel baut standardmäßig den Standard-Branch. Würdest du das Projekt jetzt
importieren, bräche der erste Build sofort ab:

> The specified Root Directory "therapon24-assistent" does not exist.

Deshalb **zuerst einen der beiden Wege** gehen:

**Weg A — Branch nach `main` übernehmen (empfohlen)**
Auf GitHub einen Pull Request von `ccr-f384b727-s2fzau` nach `main` öffnen und
zusammenführen. Danach liegt der Ordner auf `main`, und der Import läuft ohne
Umweg. Nebeneffekt: Die bestehende ERWE-Website wird dadurch **nicht**
verändert — es kommt nur ein Unterordner dazu.

**Weg B — Vercel auf den Branch zeigen lassen**
Projekt wie unten importieren (der erste Build schlägt fehl, das ist in
Ordnung), dann unter *Settings → Git → Production Branch* auf
`ccr-f384b727-s2fzau` umstellen und *Redeploy* klicken.

---

## Import in fünf Schritten

1. [vercel.com](https://vercel.com) → **Add New… → Project**
2. Repository `neidhardtconsulting/ERWe` importieren
3. **Root Directory**: auf `Edit` klicken und `therapon24-assistent` wählen
   — das ist der entscheidende Schritt
4. **Framework Preset**: `Other` (es gibt keinen Build-Schritt)
5. **Deploy**

Nach etwa einer Minute steht die Adresse, etwa
`therapon24-assistent.vercel.app`.

> Das Projekt der ERWE-Website bleibt davon unberührt. Es entsteht ein
> **zweites** Vercel-Projekt aus demselben Repository, nur mit einem anderen
> Root Directory.

---

## Danach prüfen

| | |
|---|---|
| Startseite lädt, Eingabe mittig | |
| **Mikrofonknopf ist sichtbar** | erscheint nur über HTTPS und außerhalb eines Rahmens |
| Diktat fragt einmal nach Erlaubnis und schreibt mit | |
| `/admin` öffnet die Pflegeseite | |
| Auf dem Handy: „Zum Startbildschirm hinzufügen“ zeigt das Therapon24-Symbol | |

---

## Optional: KI-Modus einschalten

Ohne Schlüssel antwortet die App ausschließlich aus der Wissensbasis — das ist
der Normalfall und kostet nichts.

Soll Claude die Antworten zusätzlich auf die konkrete Frage zuschneiden:
*Settings → Environment Variables* → `ANTHROPIC_API_KEY` = `sk-ant-…`,
danach einmal *Redeploy*. Fehlt der Schlüssel, fällt die App still auf die
Wissensbasis zurück; die Mitarbeitenden merken davon nichts.

---

## Vor der Präsentation: die Felder füllen

Solange `js/config.js` leer ist, steht in den Antworten an rund zwei Dutzend
Stellen „noch offen“. Das wirkt unfertig, ist aber in zehn Minuten erledigt:
`/admin` öffnen, ausfüllen, **config.js herunterladen**, die Datei nach
`js/config.js` legen und committen.

Diese Angaben haben die größte Wirkung, weil sie in den häufigsten Antworten
vorkommen:

- **Einsatzleitung**: Name, Telefon, E-Mail, Erreichbarkeit
- **Personalabteilung** und **Lohnbuchhaltung**: dasselbe
- **Rufbereitschaft** für Notfälle außerhalb der Bürozeiten
- **Zeiterfassung**: Name des Systems, Link, Abgabefrist
- **Krankmeldung**: Meldeweg, bis wann, ab wann eine AU nötig ist,
  wer die Schule informiert
- **Urlaub**: Anspruch, Antragsweg, Vorlauffrist, Ferienregelung
- **Entgelt**: Zahltag, Abrechnungsportal
- **Fahrtkosten**: Regelung und Abrechnungsweg

Den Rest kann man später nachtragen — die Seite `/admin` zeigt unten jederzeit,
wie viele Felder noch offen sind.

---

## Später: Store-App

Die hier veröffentlichten Dateien sind zugleich die Grundlage für eine native
App (Capacitor). Siehe Abschnitt „Verteilung an die Mitarbeitenden“ in
`README.md`. Zu beachten: Die Browser-Spracherkennung steht in einer nativen
Hülle auf iOS nicht zur Verfügung — dort müsste `js/sprache.js` gegen
`@capacitor-community/speech-recognition` getauscht werden.
