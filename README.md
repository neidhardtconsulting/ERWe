# ERWE Immobilien AG — Website

Statische Website (reines HTML/CSS/JS, kein Build-Schritt) für die ERWE Immobilien AG.
Design orientiert sich an McKinsey.de: editoriale Serif-Headlines, Cobalt/Navy-Akzente,
grosszügiger Whitespace. Inhalte und Bildmaterial basieren auf erwe-ag.com.

## Seitenstruktur

| Datei | Seite |
|---|---|
| `index.html` | Startseite |
| `unternehmen.html` | Unternehmensprofil, Historie, Mission, Management |
| `immobilien.html` | Immobilienportfolio |
| `investor-relations.html` | Aktie, Anleihen, Corporate Governance |
| `presse.html` | Pressemitteilungen |
| `kontakt.html` | Kontakt |
| `impressum.html` | Impressum (Pflichtseite) |
| `datenschutz.html` | Datenschutzerklärung (Pflichtseite) |

`vercel.json` aktiviert „Clean URLs" (z. B. `/unternehmen` statt `/unternehmen.html`).

## Deployment

Repository ist mit Vercel verbunden (Import über GitHub) — jeder Push auf `main`
veröffentlicht automatisch die neue Version.
