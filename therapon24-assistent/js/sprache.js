/* ===========================================================================
   THERAPON24 ASSISTENT — SPRACHEINGABE (Diktat)
   ---------------------------------------------------------------------------
   Nutzt die Spracherkennung des Browsers (Web Speech API). Kein Server,
   kein Schlüssel, keine Kosten.

   Wichtig für die Planung:
   · Läuft nur über HTTPS (oder localhost). Über http:// bietet der Browser
     kein Mikrofon an — der Knopf bleibt dann verborgen.
   · Chrome, Edge und Safari (ab iOS 14.5) können das. Firefox nicht.
   · In einer nativen Hülle (Capacitor, WKWebView) steht diese Schnittstelle
     auf iOS NICHT zur Verfügung. Dort wäre stattdessen das Plugin
     @capacitor-community/speech-recognition nötig. Diese Datei ist deshalb
     bewusst gekapselt: Nur sie müsste ausgetauscht werden.
   · Die Erkennung läuft bei den meisten Browsern über die Server des
     Herstellers. Es wird ausschließlich das Diktierte übertragen.
   =========================================================================== */

(function (global) {
  "use strict";

  const Erkennung = global.SpeechRecognition || global.webkitSpeechRecognition;

  /* Ohne sicheren Kontext gibt es kein Mikrofon. */
  function sichererKontext() {
    return global.isSecureContext === true ||
           location.protocol === "https:" ||
           location.hostname === "localhost" ||
           location.hostname === "127.0.0.1";
  }

  function verfuegbar() {
    return !!Erkennung && sichererKontext() && zustand() === "ok";
  }

  /* Läuft die Seite in einem fremden Rahmen? */
  function eingebettet() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }

  /* Ein Rahmen muss das Mikrofon ausdrücklich durchreichen
     (<iframe allow="microphone">). Fehlt das, ist jeder Mikrofonknopf tot —
     dann lieber gar keinen zeigen, sondern den Grund nennen. */
  function mikrofonDurchgereicht() {
    const richtlinie = document.permissionsPolicy || document.featurePolicy;
    if (richtlinie && typeof richtlinie.allowsFeature === "function") {
      try { return richtlinie.allowsFeature("microphone"); } catch (e) { /* weiter */ }
    }
    return null;   // nicht feststellbar (z. B. Safari)
  }

  /**
   * Warum geht Diktat (nicht)?
   *   "ok"           einsatzbereit
   *   "kein-browser" Browser kann keine Spracherkennung (z. B. Firefox)
   *   "unsicher"     kein HTTPS — der Browser gibt kein Mikrofon frei
   *   "gesperrt"     eingebettet, der Rahmen reicht das Mikrofon nicht durch
   */
  function zustand() {
    if (!Erkennung) return "kein-browser";
    if (!sichererKontext()) return "unsicher";
    if (mikrofonDurchgereicht() === false) return "gesperrt";
    return "ok";
  }

  /* Meldungen in Alltagssprache statt Fehlercodes. */
  const MELDUNG = {
    "not-allowed":        "Kein Zugriff aufs Mikrofon. Bitte in den Browser­einstellungen für diese Seite erlauben.",
    "service-not-allowed":"Kein Zugriff aufs Mikrofon. Bitte in den Browser­einstellungen für diese Seite erlauben.",
    "audio-capture":      "Kein Mikrofon gefunden.",
    "network":            "Die Spracherkennung ist gerade nicht erreichbar. Bitte tippen.",
    "aborted":            null,      /* vom Nutzer beendet - keine Meldung */
    "no-speech":          null       /* nichts gesagt - stillschweigend beenden */
  };

  /**
   * Erzeugt eine Diktierfunktion.
   * @param {object} opt
   *   sprache        Sprachkennung, Vorgabe "de-DE"
   *   onZwischenstand(text)  noch unsicherer Text während des Sprechens
   *   onErgebnis(text)       erkannter Satz, endgültig
   *   onStatus(zustand)      "aus" | "hoert"
   *   onFehler(meldung)      Text für die Oberfläche, oder null
   */
  function erstellen(opt) {
    if (!verfuegbar()) return null;
    opt = opt || {};

    const melde = {
      zwischenstand: opt.onZwischenstand || function () {},
      ergebnis:      opt.onErgebnis      || function () {},
      status:        opt.onStatus        || function () {},
      fehler:        opt.onFehler        || function () {}
    };

    let erk = null;
    let laeuft = false;          // Nutzerabsicht: soll zugehört werden?
    let neustarts = 0;           // gegen Endlosschleifen bei sofortigem Abbruch
    let letzterStart = 0;

    const MAX_NEUSTARTS = 12;

    function bauen() {
      const r = new Erkennung();
      r.lang = opt.sprache || "de-DE";
      r.continuous = true;       // nicht nach dem ersten Satz aufhören
      r.interimResults = true;   // schon beim Sprechen anzeigen
      r.maxAlternatives = 1;

      r.onresult = (ev) => {
        let offen = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const stueck = ev.results[i];
          if (stueck.isFinal) {
            neustarts = 0;       // es kommt etwas an - Zähler zurücksetzen
            melde.ergebnis(stueck[0].transcript.trim());
          } else {
            offen += stueck[0].transcript;
          }
        }
        melde.zwischenstand(offen.trim());
      };

      r.onerror = (ev) => {
        const text = Object.prototype.hasOwnProperty.call(MELDUNG, ev.error)
          ? MELDUNG[ev.error]
          : "Die Spracherkennung hat abgebrochen. Bitte noch einmal versuchen.";
        /* Harte Fehler beenden das Diktat, "no-speech" nicht. */
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed" ||
            ev.error === "audio-capture" || ev.error === "network") {
          laeuft = false;
        }
        if (text) melde.fehler(text);
      };

      /* Safari und Chrome beenden die Erkennung nach Sprechpausen von selbst.
         Solange der Nutzer nicht gestoppt hat, wird neu gestartet - aber
         begrenzt, damit daraus keine Schleife wird. */
      r.onend = () => {
        if (!laeuft) { zustandMelden(); return; }

        const sofortBeendet = Date.now() - letzterStart < 400;
        if (sofortBeendet) neustarts++;
        if (neustarts >= MAX_NEUSTARTS) {
          laeuft = false;
          zustandMelden();
          return;
        }
        try {
          letzterStart = Date.now();
          r.start();
        } catch (e) {
          laeuft = false;
          zustandMelden();
        }
      };

      return r;
    }

    function zustandMelden() {
      melde.status(laeuft ? "hoert" : "aus");
    }

    function starten() {
      if (laeuft) return;
      if (!erk) erk = bauen();
      laeuft = true;
      neustarts = 0;
      try {
        letzterStart = Date.now();
        erk.start();
        zustandMelden();
      } catch (e) {
        /* "already started" o. Ä. - Zustand sauber zurücksetzen */
        laeuft = false;
        zustandMelden();
      }
    }

    function stoppen() {
      if (!laeuft) return;
      laeuft = false;
      try { erk.stop(); } catch (e) { /* schon beendet */ }
      melde.zwischenstand("");
      zustandMelden();
    }

    return {
      umschalten() { laeuft ? stoppen() : starten(); },
      starten,
      stoppen,
      hoert() { return laeuft; }
    };
  }

  global.T24Sprache = { verfuegbar, erstellen, zustand, eingebettet };

})(typeof window !== "undefined" ? window : globalThis);
