/* ===========================================================================
   THERAPON24 ASSISTENT — ZENTRALE KONFIGURATION
   ---------------------------------------------------------------------------
   HIER WERDEN ALLE FIRMENSPEZIFISCHEN DETAILS EINGETRAGEN.
   Die Wissensbasis (js/wissen.js) verweist mit Platzhaltern wie
   {{kontakt.einsatzleitung.tel}} auf diese Werte.

   Solange ein Wert leer ("") ist, zeigt die App an dieser Stelle einen
   gelben Hinweis "noch zu ergänzen" statt einer erfundenen Angabe.
   Es wird also NIE etwas behauptet, was nicht hier hinterlegt wurde.
   =========================================================================== */

window.T24_CONFIG = {

  /* ---------- Allgemein ---------------------------------------------------- */
  firma: "Therapon24",
  appName: "Therapon24 Assistent",
  claim: "Fragen aus dem Arbeitsalltag — rund um die Uhr beantwortet.",
  stand: "",                       // z. B. "Stand: 01.12.2025"

  /* ---------- Ansprechpartner ---------------------------------------------
     Pro Rolle: name, tel, mail, zeiten. Leer lassen = "noch zu ergänzen".   */
  kontakt: {
    einsatzleitung: {
      label: "Einsatzleitung / Koordination",
      name: "", tel: "", mail: "",
      zeiten: ""                   // z. B. "Mo–Fr 8:00–16:00 Uhr"
    },
    personalabteilung: {
      label: "Personalabteilung",
      name: "", tel: "", mail: "",
      zeiten: ""
    },
    lohnbuchhaltung: {
      label: "Lohnbuchhaltung",
      name: "", tel: "", mail: "",
      zeiten: ""
    },
    notfall: {
      label: "Rufbereitschaft / Notfall",
      name: "", tel: "", mail: "",
      zeiten: ""
    },
    zentrale: {
      label: "Zentrale",
      name: "", tel: "", mail: "",
      zeiten: ""
    }
  },

  /* ---------- Zeiterfassung ------------------------------------------------ */
  zeiterfassung: {
    tool: "",                      // z. B. "Papershift", "Clockodo", "Stundenzettel (PDF)"
    toolLink: "",                  // Direktlink zum Tool
    abgabefrist: "",               // z. B. "bis zum 3. des Folgemonats"
    rundung: "",                   // z. B. "auf 5 Minuten"
    fahrzeitRegel: "",             // z. B. "Fahrten zwischen zwei Einsätzen zählen als Arbeitszeit"
    vorbereitungszeit: ""          // z. B. "15 Minuten pro Einsatztag"
  },

  /* ---------- Krankmeldung ------------------------------------------------- */
  krankmeldung: {
    meldewegPrimaer: "",           // z. B. "telefonisch bei der Einsatzleitung"
    uhrzeit: "",                   // z. B. "spätestens 1 Stunde vor Dienstbeginn, bis 7:00 Uhr"
    auAbTag: "",                   // z. B. "ab dem 1. Tag" / "ab dem 4. Tag"
    auWeg: "",                     // z. B. "eAU – Krankenkasse meldet automatisch"
    schuleInfo: ""                 // z. B. "Schule wird von der Einsatzleitung informiert"
  },

  /* ---------- Urlaub ------------------------------------------------------- */
  urlaub: {
    anspruch: "",                  // z. B. "30 Tage bei 5-Tage-Woche"
    antragsweg: "",                // z. B. "über das Mitarbeiterportal"
    vorlauf: "",                   // z. B. "spätestens 4 Wochen vorher"
    ferienRegel: ""                // z. B. "Urlaub ist in den Schulferien zu nehmen"
  },

  /* ---------- Entgelt ------------------------------------------------------ */
  entgelt: {
    zahltag: "",                   // z. B. "zum 15. des Folgemonats"
    abrechnungPortal: "",          // z. B. "Datev Arbeitnehmer online"
    abrechnungLink: ""
  },

  /* ---------- Fahrtkosten -------------------------------------------------- */
  fahrtkosten: {
    regelung: "",                  // z. B. "Kilometerpauschale 0,30 €/km ab dem 2. Einsatzort"
    abrechnungsweg: "",
    deutschlandticket: ""          // z. B. "Zuschuss 25 €/Monat"
  },

  /* ---------- Dokumente / Portale ------------------------------------------ */
  links: {
    mitarbeiterportal: "",
    intranet: "",
    formulare: "",
    fortbildungen: ""
  },

  /* ---------- Verhalten des Assistenten ------------------------------------ */
  optionen: {
    /* true  = Antworten werden zusätzlich von der Claude-API frei formuliert,
               sofern /api/chat erreichbar ist und ein Key hinterlegt wurde.
       false = ausschließlich Wissensbasis (offline, kostenlos).
       "auto"= versucht die API, fällt bei Fehlern still auf die Basis zurück. */
    kiModus: "auto",
    apiPfad: "/api/chat",
    verlaufSpeichern: true,        // Chatverlauf lokal im Browser behalten
    feedbackSammeln: true          // Daumen hoch/runter anbieten
  }
};
