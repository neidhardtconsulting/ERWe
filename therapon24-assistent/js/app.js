/* ===========================================================================
   THERAPON24 ASSISTENT — OBERFLÄCHENLOGIK
   =========================================================================== */

(function () {
  "use strict";

  const CONFIG = window.T24_CONFIG || {};
  const engine = new window.T24Engine.Engine(
    window.T24_WISSEN, window.T24_KATEGORIEN, CONFIG);

  const $ = (sel) => document.querySelector(sel);
  const app        = $("#app");
  const verlauf    = $("#verlauf");
  const buehne     = $("#buehne");
  const buehnenSlot = $("#buehnenSlot");
  const dock       = $("#dock");
  const vorschlaege = $("#vorschlaege");
  const formular   = $("#formular");
  const feld       = $("#feld");
  const btnSenden  = $("#btnSenden");
  const schublade  = $("#schublade");
  const themenListe = $("#themenListe");
  const suche      = $("#suche");

  const SPEICHER_VERLAUF = "t24.verlauf";
  const SPEICHER_THEME   = "t24.theme";
  const SPEICHER_FEEDBACK = "t24.feedback";

  /* ---------- Kleine Helfer ---------------------------------------------- */

  function el(tag, klasse, text) {
    const n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function ikon(name, strich) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", strich || "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  /* Browserspeicher kann blockiert sein (privater Modus, Unternehmensrichtlinie).
     Deshalb jeder Zugriff abgesichert — die App funktioniert auch ohne. */
  const speicher = {
    lesen(key, fallback) {
      try {
        const roh = localStorage.getItem(key);
        return roh === null ? fallback : JSON.parse(roh);
      } catch (e) { return fallback; }
    },
    schreiben(key, wert) {
      try { localStorage.setItem(key, JSON.stringify(wert)); } catch (e) { /* egal */ }
    },
    loeschen(key) {
      try { localStorage.removeItem(key); } catch (e) { /* egal */ }
    }
  };

  /* ---------- Text mit Markierungen in DOM-Knoten umsetzen ---------------- */
  /* Unterstützt: **fett** und <<fehlt:Beschreibung>> aus der Engine.
     Alles wird als Textknoten gesetzt — kein innerHTML, also kein XSS-Risiko. */

  function textKnoten(ziel, text) {
    const muster = /\*\*(.+?)\*\*|<<fehlt:(.+?)>>|(https?:\/\/[^\s<]+)/g;
    let letzte = 0, treffer;

    while ((treffer = muster.exec(text)) !== null) {
      if (treffer.index > letzte) {
        ziel.appendChild(document.createTextNode(text.slice(letzte, treffer.index)));
      }
      if (treffer[1] !== undefined) {
        ziel.appendChild(el("strong", null, treffer[1]));
      } else if (treffer[2] !== undefined) {
        /* Bewusst nur zwei Wörter im Lesefluss - welche Angabe fehlt, steht
           im Tooltip und vollständig in admin.html. Sonst besteht eine
           halbfertige Antwort zur Hälfte aus Warnhinweisen. */
        const chip = el("span", "fehlt", "noch offen");
        chip.title = treffer[2].charAt(0).toUpperCase() + treffer[2].slice(1) +
                     " — bei Therapon24 noch nicht hinterlegt. " +
                     "Bitte bei der Ansprechperson nachfragen.";
        ziel.appendChild(chip);
      } else {
        const a = el("a", null, treffer[3]);
        a.href = treffer[3];
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        ziel.appendChild(a);
      }
      letzte = muster.lastIndex;
    }
    if (letzte < text.length) {
      ziel.appendChild(document.createTextNode(text.slice(letzte)));
    }
    return ziel;
  }

  /* ---------- Darstellung: Nutzerfrage ------------------------------------ */

  function frageAnzeigen(text) {
    const blase = el("div", "blase blase--ich");
    const mitte = el("div", "mitte");
    mitte.appendChild(el("div", "text", text));
    blase.appendChild(mitte);
    verlauf.appendChild(blase);
    runter();
  }

  /* Antwortblase: Hülle mit Mittelachse, damit alles auf einer Linie liegt. */
  function antwortBlase(karte) {
    const blase = el("div", "blase");
    const mitte = el("div", "mitte");
    mitte.appendChild(karte);
    blase.appendChild(mitte);
    return blase;
  }

  /* Inhalte gehören neben das Signet, nicht in die Flex-Hülle. */
  function leibVon(karte) { return karte.querySelector(".antwort__leib") || karte; }

  /* ---------- Darstellung: Antwortkarte -----------------------------------
     Grundsatz: so wenig wie möglich auf einmal. Sichtbar ist nur, was zum
     Handeln nötig ist — Kernantwort, Schritte, dringende Warnung und die
     Ansprechperson. Erklärungen und Rechtsgrundlagen liegen unter
     „Mehr dazu“ und stören nicht beim schnellen Nachschlagen.            */

  function hinweisBox(h) {
    const box = el("div", "hinweis hinweis--" + h.ton);
    const name = { info: "info", ok: "ok", warn: "warn", urgent: "urgent" }[h.ton] || "info";
    box.appendChild(ikon(name, "1.9"));
    box.appendChild(textKnoten(el("div"), h.text));
    return box;
  }

  function antwortKarte(e, status) {
    const karte = el("article", "antwort");

    const signet = document.createElement("img");
    signet.className = "antwort__signet";
    signet.src = "img/mark.svg";
    signet.alt = "";
    signet.setAttribute("aria-hidden", "true");
    karte.appendChild(signet);

    const leib = el("div", "antwort__leib");
    karte.appendChild(leib);

    /* Nur bei unsicherer Zuordnung zeigen, was verstanden wurde.
       Bei einem klaren Treffer wäre das bloße Wiederholung der Frage. */
    if (status === "unsicher" && e.frage) {
      const z = el("p", "deutung");
      z.appendChild(document.createTextNode("Ich verstehe das als: "));
      z.appendChild(el("em", null, e.frage));
      leib.appendChild(z);
    }

    /* Kernantwort */
    leib.appendChild(textKnoten(el("p", "antwort__kurz"), e.kurz));

    /* Schritte */
    if (e.schritte && e.schritte.length) {
      const ol = el("ol", "schritte");
      e.schritte.forEach((s) => ol.appendChild(textKnoten(el("li"), s)));
      leib.appendChild(ol);
    }

    /* Nur Dringendes steht sofort da — alles Erklärende wandert nach unten. */
    const hinweise = e.hinweise || [];
    hinweise.filter((h) => h.ton === "urgent")
            .forEach((h) => leib.appendChild(hinweisBox(h)));

    /* Ansprechpartner als eine ruhige Zeile, nicht als Kasten */
    if (e.kontakt) leib.appendChild(kontaktKarte(e.kontakt));

    /* Aufklappbar: Erklärungen, Rechtsgrundlage */
    const rest = hinweise.filter((h) => h.ton !== "urgent");
    if (rest.length || e.rechtlich) {
      const mehr = document.createElement("details");
      mehr.className = "mehr";
      const titel = document.createElement("summary");
      titel.textContent = "Mehr dazu";
      mehr.appendChild(titel);
      rest.forEach((h) => mehr.appendChild(hinweisBox(h)));
      if (e.rechtlich) {
        mehr.appendChild(el("p", "rechtsnote",
          "Allgemeine Gesetzeslage — keine Therapon24-interne Regelung."));
      }
      /* Beim Aufklappen am unteren Rand bliebe der Inhalt sonst unsichtbar. */
      mehr.addEventListener("toggle", () => {
        if (mehr.open) mehr.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
      leib.appendChild(mehr);
    }

    return karte;
  }

  /* Ansprechpartner: eine Zeile mit Anruf- und Mail-Verweis. */
  function kontaktKarte(k) {
    const zeile = el("div", "kontaktzeile");
    zeile.appendChild(ikon("phone", "1.8"));
    zeile.appendChild(el("span", "kontaktzeile__label", k.label));

    if (!k.tel && !k.mail) {
      const chip = el("span", "fehlt");
      chip.appendChild(document.createTextNode("Kontaktdaten noch offen"));
      chip.title = "Telefon und E-Mail für „" + k.label +
                   "“ sind in js/config.js noch nicht hinterlegt.";
      zeile.appendChild(chip);
      return zeile;
    }
    if (k.tel) {
      const a = el("a", null, k.tel);
      a.href = "tel:" + k.tel.replace(/[^\d+]/g, "");
      zeile.appendChild(a);
    }
    if (k.mail) {
      const a = el("a", null, "E-Mail");
      a.href = "mailto:" + k.mail;
      zeile.appendChild(a);
    }
    return zeile;
  }

  /* Folgefragen: höchstens drei, als ruhige Textverweise statt als Kacheln. */
  function folgefragen(titel, liste) {
    if (!liste || !liste.length) return null;
    const box = el("div", "folge");
    box.appendChild(document.createTextNode(titel + ": "));
    liste.slice(0, 2).forEach((v, i) => {
      if (i) box.appendChild(document.createTextNode(" · "));
      const b = el("button", null, v.frage);
      b.type = "button";
      b.addEventListener("click", () => themaOeffnen(v.id));
      box.appendChild(b);
    });
    return box;
  }

  /* ---------- Bewertung ---------------------------------------------------- */

  function bewertungsZeile(eintragId, frageText) {
    if (!(CONFIG.optionen || {}).feedbackSammeln) return null;
    const zeile = el("div", "bewertung");
    zeile.appendChild(el("span", null, "War das hilfreich?"));

    const machBtn = (richtung, ikonName, label) => {
      const b = el("button", "bewertung__btn");
      b.type = "button";
      b.title = label;
      b.setAttribute("aria-label", label);
      b.setAttribute("aria-pressed", "false");
      b.appendChild(ikon(ikonName, "1.7"));
      b.addEventListener("click", () => {
        zeile.querySelectorAll(".bewertung__btn")
             .forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        feedbackMerken(eintragId, frageText, richtung);
        const dank = zeile.querySelector(".bewertung__dank");
        if (!dank) zeile.appendChild(el("span", "bewertung__dank",
          richtung > 0 ? "Danke!" : "Danke — wir ergänzen das."));
      });
      return b;
    };

    zeile.appendChild(machBtn(1, "up", "Hilfreich"));
    zeile.appendChild(machBtn(-1, "down", "Nicht hilfreich"));
    return zeile;
  }

  /* Rückmeldungen bleiben lokal im Browser. Export über admin.html. */
  function feedbackMerken(eintragId, frageText, richtung) {
    const liste = speicher.lesen(SPEICHER_FEEDBACK, []);
    liste.push({ id: eintragId, frage: frageText, wert: richtung,
                 zeit: new Date().toISOString() });
    speicher.schreiben(SPEICHER_FEEDBACK, liste.slice(-300));
  }

  /* Nicht beantwortete Fragen sammeln - die Lücken der Wissensbasis. */
  function lueckeMerken(frageText) {
    const liste = speicher.lesen("t24.luecken", []);
    liste.push({ frage: frageText, zeit: new Date().toISOString() });
    speicher.schreiben("t24.luecken", liste.slice(-300));
  }

  /* ---------- Antwort ausgeben -------------------------------------------- */

  function antwortAnzeigen(ergebnis, frageText) {
    let karte;

    if (ergebnis.status === "unbekannt") {
      lueckeMerken(frageText);
      karte = antwortKarte({
        frage: "", kurz:
          "Dazu habe ich **nichts Verlässliches hinterlegt** — und ich rate hier " +
          "lieber nicht. Frag bitte direkt bei deiner Ansprechperson nach.",
        kontakt: null
      }, "treffer");
      const leib = leibVon(karte);
      const k = (CONFIG.kontakt || {}).einsatzleitung;
      if (k) leib.appendChild(kontaktKarte({
        label: k.label || "Einsatzleitung", name: k.name || "",
        tel: k.tel || "", mail: k.mail || "", zeiten: k.zeiten || ""
      }));
      const f = folgefragen("Häufig gefragt", ergebnis.vorschlaege);
      if (f) leib.appendChild(f);
    } else {
      karte = antwortKarte(ergebnis.eintrag, ergebnis.status);
      const leib = leibVon(karte);

      if (ergebnis.status === "unsicher" && ergebnis.alternativen.length) {
        const alt = folgefragen("Oder", ergebnis.alternativen);
        if (alt) leib.appendChild(alt);
      }
      const f = folgefragen("Auch dazu", ergebnis.vorschlaege);
      if (f) leib.appendChild(f);

      const b = bewertungsZeile(ergebnis.eintrag.id, frageText);
      if (b) leib.appendChild(b);
    }

    verlauf.appendChild(antwortBlase(karte));
    runter();
  }

  function runter() {
    requestAnimationFrame(() => { verlauf.scrollTop = verlauf.scrollHeight; });
  }

  /* ---------- Tippindikator ------------------------------------------------ */

  function tipptAnzeigen() {
    const blase = el("div", "blase");
    blase.id = "tippt";
    const mitte = el("div", "mitte");
    const box = el("div", "tippt");
    box.appendChild(el("span")); box.appendChild(el("span")); box.appendChild(el("span"));
    mitte.appendChild(box);
    blase.appendChild(mitte);
    verlauf.appendChild(blase);
    runter();
  }
  function tipptEntfernen() {
    const n = document.getElementById("tippt");
    if (n) n.remove();
  }

  /* ---------- Frage verarbeiten -------------------------------------------- */

  let laeuft = false;

  async function fragen(text) {
    text = String(text || "").trim();
    if (!text || laeuft) return;
    laeuft = true;

    chatzustand();
    frageAnzeigen(text);
    verlaufMerken({ rolle: "ich", text: text });

    feld.value = "";
    feldHoeheAnpassen();
    btnSenden.disabled = true;

    tipptAnzeigen();

    const ergebnis = engine.antwort(text);

    /* Optional: freiere Formulierung über die Claude-API.
       Schlägt das fehl oder ist kein Schlüssel hinterlegt, bleibt es
       bei der Antwort aus der Wissensbasis. */
    let kiText = null;
    const opt = CONFIG.optionen || {};
    if (opt.kiModus && opt.kiModus !== false && opt.kiModus !== "aus") {
      kiText = await kiVersuchen(text, ergebnis);
    }

    /* Kurze Verzögerung, damit die Antwort nicht "springt" */
    await new Promise((r) => setTimeout(r, kiText ? 60 : 260));
    tipptEntfernen();

    if (kiText) {
      ergebnis.eintrag = ergebnis.eintrag || {};
      ergebnis.eintrag.kurz = kiText;
    }

    antwortAnzeigen(ergebnis, text);
    verlaufMerken({ rolle: "bot", frage: text,
                    id: ergebnis.eintrag ? ergebnis.eintrag.id : null,
                    status: ergebnis.status });

    laeuft = false;
    btnSenden.disabled = !feld.value.trim();
  }

  /* Ruft /api/chat auf. Fehler werden still geschluckt - die Wissensbasis
     ist die verlässliche Grundlage, die KI nur die Kür. */
  let kiNichtVerfuegbar = false;   /* einmal fehlgeschlagen -> nicht erneut versuchen */

  async function kiVersuchen(frage, ergebnis) {
    const opt = CONFIG.optionen || {};
    if (!opt.apiPfad || kiNichtVerfuegbar) return null;
    try {
      const steuerung = new AbortController();
      const timeout = setTimeout(() => steuerung.abort(), 8000);
      const antwort = await fetch(opt.apiPfad, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: steuerung.signal,
        body: JSON.stringify({
          frage: frage,
          treffer: ergebnis.eintrag || null,
          status: ergebnis.status
        })
      });
      clearTimeout(timeout);
      /* 404/405 = kein Endpunkt vorhanden, 204 = kein Schlüssel hinterlegt.
         In beiden Fällen bleibt es dauerhaft bei der Wissensbasis. */
      if (antwort.status === 404 || antwort.status === 405) {
        kiNichtVerfuegbar = true;
        return null;
      }
      if (!antwort.ok || antwort.status === 204) return null;
      const daten = await antwort.json();
      return (daten && typeof daten.text === "string" && daten.text.trim())
        ? daten.text.trim() : null;
    } catch (e) {
      /* offline, Netzfehler, Zeitüberschreitung - die Wissensbasis trägt. */
      kiNichtVerfuegbar = true;
      return null;
    }
  }

  function themaOeffnen(id) {
    const e = engine.eintragNachId(id);
    if (!e) return;
    schubladeSchliessen();
    chatzustand();
    frageAnzeigen(e.frage);
    verlaufMerken({ rolle: "ich", text: e.frage });

    const karte = antwortKarte(e, "treffer");
    const leib = leibVon(karte);
    const verwandte = (window.T24_WISSEN.find((x) => x.id === id) || {}).verwandt || [];
    const f = folgefragen("Auch dazu", verwandte
      .map((vid) => window.T24_WISSEN.find((x) => x.id === vid))
      .filter(Boolean).map((x) => ({ id: x.id, frage: x.frage })));
    if (f) leib.appendChild(f);
    const b = bewertungsZeile(e.id, e.frage);
    if (b) leib.appendChild(b);

    verlauf.appendChild(antwortBlase(karte));
    verlaufMerken({ rolle: "bot", frage: e.frage, id: e.id, status: "treffer" });
    runter();
  }

  /* ---------- Zustände: leer <-> Chat --------------------------------------
     Im Leerzustand sitzt die Eingabe mittig auf der Bühne, im Chatzustand
     dockt sie unten an. Dafür wandert dasselbe Element zwischen beiden
     Plätzen - so bleiben Inhalt, Fokus und Ereignisse erhalten.           */

  function leerzustand() {
    app.setAttribute("data-zustand", "leer");
    buehnenSlot.appendChild(dock);
    vorschlaegeRendern();
  }

  function chatzustand() {
    if (app.getAttribute("data-zustand") === "chat") return;
    app.setAttribute("data-zustand", "chat");
    app.appendChild(dock);
  }

  /* Vier Einstiegsfragen unter der Eingabe. */
  function vorschlaegeRendern() {
    vorschlaege.textContent = "";
    engine.startVorschlaege().forEach((v) => {
      const b = el("button", "vorschlag", v.label);
      b.type = "button";
      b.addEventListener("click", () => themaOeffnen(v.id));
      vorschlaege.appendChild(b);
    });
  }

  /* Einrichtungshinweis gehört nicht in den Chat, sondern in die
     Seitenleiste - die Mitarbeitenden sollen nicht damit anfangen. */
  function setupHinweisRendern() {
    const ziel = $("#setupHinweis");
    if (!ziel) return;
    const offen = engine.offenePlatzhalter().length;
    const ohneKontakt = !Object.values(CONFIG.kontakt || {})
      .some((k) => k && (k.tel || k.mail));
    if (!offen && !ohneKontakt) return;

    const box = el("div", "setup");
    box.appendChild(el("b", null, "Einrichtung offen"));
    box.appendChild(document.createTextNode(
      offen + " firmenspezifische Angabe" + (offen === 1 ? "" : "n") +
      (ohneKontakt ? " und die Kontaktdaten" : "") + " fehlen noch. "));
    const a = el("a", null, "Jetzt pflegen");
    a.href = "admin.html";
    box.appendChild(a);
    ziel.appendChild(box);
  }

  /* ---------- Themen-Schublade --------------------------------------------- */

  function themenRendern(filterText, nurKategorie) {
    themenListe.textContent = "";

    if (filterText && filterText.trim()) {
      const treffer = engine.suchen(filterText);
      if (!treffer.length) {
        themenListe.appendChild(el("p", "leer",
          "Keine Treffer. Formuliere die Frage anders oder frag direkt im Chat."));
        return;
      }
      const gruppe = el("div", "gruppe");
      gruppe.appendChild(el("div", "gruppe__titel",
        treffer.length + " Treffer"));
      const ul = el("ul", "frageliste");
      treffer.forEach((t) => ul.appendChild(frageZeile(t)));
      gruppe.appendChild(ul);
      themenListe.appendChild(gruppe);
      return;
    }

    (window.T24_KATEGORIEN || []).forEach((kat) => {
      if (nurKategorie && kat.id !== nurKategorie) return;
      const fragen = engine.nachKategorie(kat.id);
      if (!fragen.length) return;
      const gruppe = el("div", "gruppe");
      const titel = el("div", "gruppe__titel");
      titel.appendChild(ikon(kat.icon, "1.9"));
      titel.appendChild(document.createTextNode(kat.label));
      gruppe.appendChild(titel);
      const ul = el("ul", "frageliste");
      fragen.forEach((f) => ul.appendChild(frageZeile(f)));
      gruppe.appendChild(ul);
      themenListe.appendChild(gruppe);
    });
  }

  function frageZeile(f) {
    const li = el("li");
    const b = el("button", null, f.frage);
    b.type = "button";
    b.addEventListener("click", () => themaOeffnen(f.id));
    li.appendChild(b);
    return li;
  }

  function kategorieFiltern(katId) {
    suche.value = "";
    themenRendern("", katId);
    themenListe.scrollTop = 0;
  }

  let zuletztFokussiert = null;

  function schubladeOeffnen() {
    zuletztFokussiert = document.activeElement;
    schublade.classList.add("auf");
    $("#btnThemen").setAttribute("aria-expanded", "true");
    themenRendern(suche.value, null);
    setTimeout(() => suche.focus(), 60);
    document.addEventListener("keydown", escBehandeln);
  }

  function schubladeSchliessen() {
    schublade.classList.remove("auf");
    $("#btnThemen").setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", escBehandeln);
    if (zuletztFokussiert && zuletztFokussiert.focus) zuletztFokussiert.focus();
  }

  function escBehandeln(ev) {
    if (ev.key === "Escape") schubladeSchliessen();
  }

  /* ---------- Verlauf speichern -------------------------------------------- */

  function verlaufMerken(eintrag) {
    if (!(CONFIG.optionen || {}).verlaufSpeichern) return;
    const liste = speicher.lesen(SPEICHER_VERLAUF, []);
    liste.push(eintrag);
    speicher.schreiben(SPEICHER_VERLAUF, liste.slice(-60));
  }

  function verlaufHerstellen() {
    if (!(CONFIG.optionen || {}).verlaufSpeichern) return false;
    const liste = speicher.lesen(SPEICHER_VERLAUF, []);
    if (!liste.length) return false;

    liste.forEach((p) => {
      if (p.rolle === "ich") {
        frageAnzeigen(p.text);
      } else if (p.id) {
        const e = engine.eintragNachId(p.id);
        if (!e) return;
        verlauf.appendChild(antwortBlase(antwortKarte(e, p.status || "treffer")));
      }
    });
    return true;
  }

  function verlaufLeeren() {
    speicher.loeschen(SPEICHER_VERLAUF);
    verlauf.textContent = "";
    leerzustand();
    feld.focus();
  }

  /* ---------- Hell / Dunkel ------------------------------------------------- */

  function themeSetzen(wert) {
    const wurzel = document.documentElement;
    if (wert === "dark" || wert === "light") {
      wurzel.setAttribute("data-theme", wert);
    } else {
      wurzel.removeAttribute("data-theme");
    }
    const dunkel = wert === "dark" || (wert !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
    const use = document.querySelector("#themeIkon");
    if (use) use.setAttribute("href", dunkel ? "#i-sunny" : "#i-moon");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dunkel ? "#0E1826" : "#42628F");
    /* Die Wortmarke ist im Original dunkelblau und wäre auf dunklem Grund
       kaum lesbar - deshalb eine helle Variante. */
    const logo = document.querySelector(".kopf__logo");
    if (logo) logo.src = dunkel ? "img/logo-dark.svg" : "img/logo.svg";
  }

  /* ---------- Eingabefeld --------------------------------------------------- */

  function feldHoeheAnpassen() {
    feld.style.height = "auto";
    feld.style.height = Math.min(feld.scrollHeight, 120) + "px";
  }

  /* ---------- Verdrahtung ---------------------------------------------------- */

  formular.addEventListener("submit", (ev) => {
    ev.preventDefault();
    fragen(feld.value);
  });

  feld.addEventListener("input", () => {
    btnSenden.disabled = !feld.value.trim() || laeuft;
    feldHoeheAnpassen();
  });

  feld.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      fragen(feld.value);
    }
  });

  $("#btnThemen").addEventListener("click", () => {
    schublade.classList.contains("auf") ? schubladeSchliessen() : schubladeOeffnen();
  });

  schublade.querySelectorAll("[data-schliessen]").forEach((n) =>
    n.addEventListener("click", schubladeSchliessen));

  suche.addEventListener("input", () => themenRendern(suche.value, null));

  $("#btnNeu").addEventListener("click", () => {
    if (verlauf.querySelector(".blase") &&
        !confirm("Gespräch löschen und neu beginnen?")) return;
    verlaufLeeren();
  });

  $("#btnTheme").addEventListener("click", () => {
    const jetzt = document.documentElement.getAttribute("data-theme");
    const systemDunkel = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const neu = jetzt ? (jetzt === "dark" ? "light" : "dark")
                      : (systemDunkel ? "light" : "dark");
    themeSetzen(neu);
    speicher.schreiben(SPEICHER_THEME, neu);
  });

  /* ---------- Start ---------------------------------------------------------- */

  themeSetzen(speicher.lesen(SPEICHER_THEME, null));

  const untertitel = document.getElementById("kopfSub");
  if (untertitel && CONFIG.firma) {
    untertitel.textContent = CONFIG.firma + " — intern";
  }

  /* Nur bei wiederhergestelltem Verlauf ans Ende springen -
     der Startbildschirm beginnt oben. */
  if (verlaufHerstellen()) chatzustand(); else leerzustand();
  setupHinweisRendern();
  if (app.getAttribute("data-zustand") === "chat") runter();

  if (window.matchMedia("(min-width: 720px)").matches) feld.focus();

  /* Offlinefähigkeit (nur über http/https, nicht beim lokalen Öffnen) */
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* optional */ });
    });
  }

  /* Für die Konsole / admin.html */
  window.T24 = { engine, fragen, themaOeffnen, verlaufLeeren };

})();
