/* ===========================================================================
   THERAPON24 ASSISTENT — SUCH- UND ANTWORT-ENGINE
   ---------------------------------------------------------------------------
   Arbeitet vollständig im Browser, ohne Server und ohne Netzverbindung.
   Deutschsprachiges Matching: Normalisierung (Umlaute, Satzzeichen),
   einfache Stammformbildung, Stoppwörter, Gewichtung nach Feld.
   =========================================================================== */

(function (global) {
  "use strict";

  /* ---------- Normalisierung --------------------------------------------- */

  const UMLAUTE = { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss",
                    "á": "a", "à": "a", "â": "a", "é": "e", "è": "e", "ê": "e" };

  function normalisieren(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[äöüßáàâéèê]/g, (c) => UMLAUTE[c] || c)
      .replace(/[^a-z0-9\s§-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Wörter ohne Aussagekraft - fliegen aus der Suche raus. */
  const STOPP = new Set([
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem",
    "einer", "eines", "und", "oder", "aber", "wenn", "dann", "als", "wie",
    "was", "wer", "wo", "wann", "warum", "weshalb", "wieso", "welche",
    "welcher", "welches", "ich", "du", "er", "sie", "es", "wir", "ihr",
    "mir", "mich", "mein", "meine", "meinen", "meiner", "meinem", "dir",
    "dich", "dein", "deine", "man", "sich", "ist", "sind", "war", "waren",
    "bin", "bist", "hat", "habe", "haben", "hatte", "hatten", "wird",
    "werden", "wurde", "wurden", "kann", "kannst", "koennen", "koennte",
    "muss", "musst", "muessen", "soll", "sollte", "sollen", "darf",
    "duerfen", "will", "moechte", "mochte", "zu", "zum", "zur", "in",
    "im", "an", "am", "auf", "aus", "bei", "mit", "nach", "von", "vom",
    "vor", "ueber", "unter", "fuer", "um", "ohne", "gegen", "durch",
    "noch", "nur", "auch", "schon", "sehr", "mal", "denn", "doch",
    "nicht", "kein", "keine", "es", "da", "hier", "dass", "sowie",
    "bitte", "danke", "hallo", "hey", "guten", "tag", "morgen", "abend"
  ]);

  /* Sehr einfache Stammformbildung: schneidet häufige deutsche Endungen ab.
     Kein echter Stemmer, aber robust genug, damit "Krankmeldungen",
     "krankgemeldet" und "Krankmeldung" zusammenfinden. */
  const ENDUNGEN = ["ungen", "erung", "keiten", "igkeit", "lichen", "lich",
                    "ungs", "ung", "enden", "ende", "end", "ern", "erns",
                    "este", "sten", "ste", "eten", "ete", "ten", "te",
                    "nen", "en", "er", "es", "em", "s", "e"];

  function stamm(wort) {
    if (wort.length <= 4) return wort;
    for (const e of ENDUNGEN) {
      if (wort.length - e.length >= 4 && wort.endsWith(e)) {
        return wort.slice(0, -e.length);
      }
    }
    return wort;
  }

  function tokenisieren(text, behalteStopp) {
    return normalisieren(text)
      .split(" ")
      .filter((w) => w.length > 1 && (behalteStopp || !STOPP.has(w)))
      .map(stamm);
  }

  /* ---------- Platzhalter aus der Konfiguration auflösen ------------------ */

  function configWert(pfad, config) {
    return String(pfad).split(".").reduce(
      (o, k) => (o && typeof o === "object" ? o[k] : undefined), config);
  }

  /* Ersetzt {{pfad}} durch den Wert aus config.js.
     Fehlender/leerer Wert -> Markierung <<fehlt:Beschriftung>>, die die
     Oberfläche als gelben Hinweis "noch zu ergänzen" rendert. */
  function platzhalterFuellen(text, config) {
    if (!text) return "";
    return String(text).replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (treffer, pfad) => {
      const wert = configWert(pfad, config);
      if (wert === undefined || wert === null || String(wert).trim() === "") {
        return "<<fehlt:" + beschriftung(pfad) + ">>";
      }
      return String(wert);
    });
  }

  /* Lesbare Beschriftung für einen Konfigurationspfad. */
  const BESCHRIFTUNG = {
    "zeiterfassung.tool": "Name des Zeiterfassungssystems",
    "zeiterfassung.toolLink": "Link zum Zeiterfassungssystem",
    "zeiterfassung.abgabefrist": "Abgabefrist für den Stundennachweis",
    "zeiterfassung.fahrzeitRegel": "Regelung zur Fahrzeit",
    "krankmeldung.uhrzeit": "Uhrzeit für die Krankmeldung",
    "krankmeldung.meldewegPrimaer": "Meldeweg für die Krankmeldung",
    "krankmeldung.auAbTag": "ab wann eine AU nötig ist",
    "krankmeldung.auWeg": "Weg für die AU-Einreichung",
    "krankmeldung.schuleInfo": "wer die Schule informiert",
    "urlaub.anspruch": "Urlaubsanspruch",
    "urlaub.antragsweg": "Antragsweg für Urlaub",
    "urlaub.vorlauf": "Vorlauffrist für Urlaubsanträge",
    "urlaub.ferienRegel": "Regelung für die Schulferien",
    "entgelt.zahltag": "Zahltag",
    "entgelt.abrechnungPortal": "Portal für Lohnabrechnungen",
    "entgelt.abrechnungLink": "Link zum Abrechnungsportal",
    "fahrtkosten.regelung": "Fahrtkostenregelung",
    "fahrtkosten.abrechnungsweg": "Abrechnungsweg für Fahrtkosten",
    "fahrtkosten.deutschlandticket": "Regelung zum Deutschlandticket",
    "links.mitarbeiterportal": "Link zum Mitarbeiterportal",
    "links.formulare": "Link zu den Formularen",
    "links.fortbildungen": "Link zum Fortbildungsangebot"
  };

  function beschriftung(pfad) {
    if (BESCHRIFTUNG[pfad]) return BESCHRIFTUNG[pfad];
    if (pfad.startsWith("kontakt.")) {
      const teile = pfad.split(".");
      const feld = { tel: "Telefonnummer", mail: "E-Mail-Adresse",
                     name: "Name", zeiten: "Erreichbarkeit" }[teile[2]] || teile[2];
      return feld + " der Rolle „" + teile[1] + "“";
    }
    return "Angabe „" + pfad + "“";
  }

  /* ---------- Index ------------------------------------------------------- */

  function indexBauen(eintraege) {
    return eintraege.map((e) => ({
      eintrag: e,
      /* Gewichte: Schlagwort > Frage > Variante > Fließtext */
      schlagwortTokens: new Set((e.schlagworte || []).flatMap((s) => tokenisieren(s))),
      schlagwortPhrasen: (e.schlagworte || []).map(normalisieren),
      frageTokens: new Set(tokenisieren(e.frage)),
      fragePhrase: normalisieren(e.frage),
      variantenTokens: new Set((e.varianten || []).flatMap((v) => tokenisieren(v))),
      variantenPhrasen: (e.varianten || []).map(normalisieren),
      textTokens: new Set(tokenisieren(
        [e.kurz, (e.schritte || []).join(" "),
         (e.hinweise || []).map((h) => h.text).join(" ")].join(" ")))
    }));
  }

  /* ---------- Bewertung --------------------------------------------------- */

  const GEWICHT = { schlagwort: 10, frage: 6, variante: 7, text: 2 };

  function bewerten(index, frageText) {
    const roh = normalisieren(frageText);
    const tokens = tokenisieren(frageText);
    if (!tokens.length) return [];

    return index.map((eintrag) => {
      let tokenPunkte = 0;
      let treffer = [];

      for (const t of tokens) {
        if (eintrag.schlagwortTokens.has(t)) { tokenPunkte += GEWICHT.schlagwort; treffer.push(t); }
        else if (eintrag.variantenTokens.has(t)) { tokenPunkte += GEWICHT.variante; treffer.push(t); }
        else if (eintrag.frageTokens.has(t)) { tokenPunkte += GEWICHT.frage; treffer.push(t); }
        else if (eintrag.textTokens.has(t)) { tokenPunkte += GEWICHT.text; treffer.push(t); }
      }

      /* Abdeckung: welcher Anteil der Frage wurde überhaupt verstanden?
         Dämpft nur die Einzelwort-Treffer. */
      const abdeckung = treffer.length / tokens.length;
      tokenPunkte *= (0.55 + 0.45 * abdeckung);

      /* Kurze Fragen mit einem starken Schlagwort nicht benachteiligen */
      if (tokens.length <= 2 && treffer.length === tokens.length) tokenPunkte += 8;

      /* Phrasentreffer: die Formulierung kommt wörtlich vor. Das ist ein
         starkes Signal und wird deshalb NACH der Dämpfung addiert - sonst
         verliert "ich bin krank" gegen einen Eintrag, der nur zufällig
         mehr Einzelwörter abdeckt. */
      let phrasenPunkte = 0;
      for (const p of eintrag.variantenPhrasen) {
        if (p.length > 6 && (roh.includes(p) || p.includes(roh))) phrasenPunkte += 22;
      }
      for (const p of eintrag.schlagwortPhrasen) {
        if (p.includes(" ") && roh.includes(p)) phrasenPunkte += 14;
      }
      if (eintrag.fragePhrase && roh.includes(eintrag.fragePhrase)) phrasenPunkte += 18;

      return {
        eintrag: eintrag.eintrag,
        punkte: tokenPunkte + phrasenPunkte,
        abdeckung: abdeckung
      };
    })
    .filter((t) => t.punkte > 0)
    .sort((a, b) => b.punkte - a.punkte);
  }

  /* ---------- Öffentliche Schnittstelle ----------------------------------- */

  function Engine(eintraege, kategorien, config) {
    this.eintraege = eintraege;
    this.kategorien = kategorien;
    this.config = config || {};
    this.index = indexBauen(eintraege);
    this.nachId = Object.fromEntries(eintraege.map((e) => [e.id, e]));
  }

  /* Schwellen: ab welcher Punktzahl gilt eine Antwort als sicher bzw. unsicher */
  Engine.SCHWELLE_SICHER = 14;
  Engine.SCHWELLE_VAGE = 6;

  Engine.prototype.antwort = function (frage) {
    const treffer = bewerten(this.index, frage);

    if (!treffer.length || treffer[0].punkte < Engine.SCHWELLE_VAGE) {
      return { status: "unbekannt", vorschlaege: this.beliebteThemen(4) };
    }

    const beste = treffer[0];
    const status = beste.punkte >= Engine.SCHWELLE_SICHER ? "treffer" : "unsicher";

    /* Weitere Vorschläge: erst inhaltlich verwandte, dann nächstbeste Treffer */
    const verwandte = (beste.eintrag.verwandt || [])
      .map((id) => this.nachId[id]).filter(Boolean);
    const weitere = treffer.slice(1, 4).map((t) => t.eintrag)
      .filter((e) => !verwandte.some((v) => v.id === e.id));

    return {
      status: status,
      eintrag: this.aufbereiten(beste.eintrag),
      punkte: Math.round(beste.punkte),
      vorschlaege: [...verwandte, ...weitere].slice(0, 4)
        .map((e) => ({ id: e.id, frage: e.frage })),
      alternativen: treffer.slice(1, 3).map((t) => ({
        id: t.eintrag.id, frage: t.eintrag.frage
      }))
    };
  };

  /* Füllt Platzhalter und reicht den Ansprechpartner mit. */
  Engine.prototype.aufbereiten = function (e) {
    const f = (s) => platzhalterFuellen(s, this.config);
    const kontaktSchluessel = e.kontakt;
    const k = kontaktSchluessel && this.config.kontakt
      ? this.config.kontakt[kontaktSchluessel] : null;

    return {
      id: e.id,
      kategorie: e.kategorie,
      kategorieLabel: (this.kategorien.find((c) => c.id === e.kategorie) || {}).label || "",
      frage: e.frage,
      kurz: f(e.kurz),
      schritte: (e.schritte || []).map(f),
      hinweise: (e.hinweise || []).map((h) => ({ ton: h.ton || "info", text: f(h.text) })),
      rechtlich: !!e.rechtlich,
      kontakt: k ? {
        schluessel: kontaktSchluessel,
        label: k.label || kontaktSchluessel,
        name: k.name || "", tel: k.tel || "",
        mail: k.mail || "", zeiten: k.zeiten || ""
      } : null
    };
  };

  Engine.prototype.eintragNachId = function (id) {
    const e = this.nachId[id];
    return e ? this.aufbereiten(e) : null;
  };

  Engine.prototype.nachKategorie = function (katId) {
    return this.eintraege.filter((e) => e.kategorie === katId)
      .map((e) => ({ id: e.id, frage: e.frage }));
  };

  /* Startvorschläge: die Fragen, die erfahrungsgemäß am häufigsten kommen. */
  Engine.STARTFRAGEN = ["abwesenheit-krank", "zeit-erfassen", "urlaub-antrag",
                        "zeit-ausfall-kind", "geld-abrechnung",
                        "einsatz-aufgaben", "vertrag-ansprechpartner"];

  /* Einstiegsvorschläge unter der Eingabe: bewusst kurze Beschriftungen,
     damit vier Stück nebeneinander lesbar bleiben. */
  Engine.STARTVORSCHLAEGE = [
    { id: "abwesenheit-krank", label: "Ich bin krank" },
    { id: "zeit-erfassen",     label: "Stunden eintragen" },
    { id: "urlaub-antrag",     label: "Urlaub beantragen" },
    { id: "zeit-ausfall-kind", label: "Kind fehlt heute" }
  ];

  Engine.prototype.startVorschlaege = function () {
    return Engine.STARTVORSCHLAEGE.filter((v) => this.nachId[v.id]);
  };

  Engine.prototype.beliebteThemen = function (anzahl) {
    return Engine.STARTFRAGEN.map((id) => this.nachId[id]).filter(Boolean)
      .slice(0, anzahl || 6).map((e) => ({ id: e.id, frage: e.frage }));
  };

  /* Volltextsuche für die Themenübersicht. */
  Engine.prototype.suchen = function (text) {
    if (!normalisieren(text)) return [];
    return bewerten(this.index, text).slice(0, 12)
      .map((t) => ({ id: t.eintrag.id, frage: t.eintrag.frage,
                     kategorie: t.eintrag.kategorie }));
  };

  /* Zählt, wie viele Platzhalter in der Konfiguration noch offen sind. */
  Engine.prototype.offenePlatzhalter = function () {
    const offen = new Set();
    const sammeln = (s) => {
      String(s || "").replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (_, pfad) => {
        const w = configWert(pfad, this.config);
        if (w === undefined || w === null || String(w).trim() === "") offen.add(pfad);
        return "";
      });
    };
    this.eintraege.forEach((e) => {
      sammeln(e.kurz);
      (e.schritte || []).forEach(sammeln);
      (e.hinweise || []).forEach((h) => sammeln(h.text));
    });
    return [...offen].sort();
  };

  /* Export: Browser und Node (für die Tests) */
  const API = { Engine, normalisieren, tokenisieren, platzhalterFuellen, stamm };
  if (typeof module === "object" && module.exports) module.exports = API;
  global.T24Engine = API;

})(typeof window !== "undefined" ? window : globalThis);
