/* ===========================================================================
   THERAPON24 ASSISTENT — OPTIONALER KI-ENDPUNKT (Vercel Serverless Function)
   ---------------------------------------------------------------------------
   Diese Datei ist OPTIONAL. Ohne sie läuft die App vollständig über die
   Wissensbasis — kostenlos, offline, ohne Server.

   Aufgabe hier: die gefundene Antwort aus der Wissensbasis natürlicher auf
   die konkrete Frage zuschneiden. Die Wissensbasis bleibt die einzige
   inhaltliche Quelle — das Modell darf NICHTS hinzuerfinden.

   Einrichtung:
     1) npm install
     2) In Vercel unter Settings → Environment Variables hinterlegen:
          ANTHROPIC_API_KEY = sk-ant-...
     3) Deployen. Fehlt der Schlüssel, antwortet die Funktion mit 204 und
        die App nutzt still die Wissensbasis-Antwort.

   Datenschutz: Es wird ausschließlich die Frage der mitarbeitenden Person
   plus der bereits gefundene Wissensbasis-Eintrag übertragen. Keine
   Klientendaten, keine Namen, keine Personaldaten.
   =========================================================================== */

import Anthropic from "@anthropic-ai/sdk";

const MODELL = "claude-opus-5-5";

const SYSTEM = `Du bist der interne Assistent von Therapon24, einem Anbieter für
Schulbegleitung, Assistenz und ambulante Hilfen zur Erziehung. Du antwortest
Mitarbeitenden — überwiegend Schulbegleiterinnen und Schulbegleitern — auf
Fragen aus dem Arbeitsalltag.

UNVERRÜCKBARE REGELN:
1. Du formulierst AUSSCHLIESSLICH den dir übergebenen Wissensbasis-Eintrag um,
   zugeschnitten auf die konkrete Frage. Du fügst KEINE Fakten hinzu, die nicht
   im Eintrag stehen — keine Fristen, Telefonnummern, Beträge, Namen, Systeme
   oder Regelungen.
2. Steht im Eintrag eine Markierung der Form <<fehlt:…>>, übernimmst du sie
   unverändert in deine Antwort. Sie kennzeichnet eine Angabe, die im Betrieb
   noch hinterlegt werden muss. Du ersetzt sie NIEMALS durch eine Vermutung.
3. Reicht der Eintrag nicht aus, um die Frage zu beantworten, antwortest du
   ausschließlich mit dem Wort: UNZUREICHEND
4. Du gibst keine Rechtsberatung und sprichst keine verbindlichen Zusagen aus.
   Bei Unsicherheit verweist du auf die zuständige Ansprechperson.

STIL:
- Deutsch, Du-Form, freundlich und direkt — wie eine erfahrene Kollegin, die
  kurz erklärt, was zu tun ist.
- 2 bis 4 Sätze. Keine Aufzählungen (die stehen bereits separat in der App),
  keine Überschriften, keine Wiederholung der Frage.
- Wichtiges darf mit **Sternchen** hervorgehoben werden.
- Bei Gefahr, Kindeswohl oder Notfall: zuerst der wichtigste Handlungsschritt.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ fehler: "Nur POST." });
  }

  /* Ohne Schlüssel: still abbrechen. Die App nutzt dann die Wissensbasis. */
  if (!process.env.ANTHROPIC_API_KEY) return res.status(204).end();

  try {
    const { frage, treffer, status } = req.body || {};

    if (typeof frage !== "string" || !frage.trim()) {
      return res.status(400).json({ fehler: "Feld 'frage' fehlt." });
    }
    /* Kein Treffer in der Wissensbasis -> nichts zum Umformulieren.
       Lieber gar keine Antwort als eine frei erfundene. */
    if (!treffer || !treffer.kurz) return res.status(204).end();

    /* Harte Längenbegrenzung gegen Missbrauch des Endpunkts */
    const frageKurz = frage.trim().slice(0, 500);

    const eintragText = [
      "THEMA: " + (treffer.frage || ""),
      "KERNANTWORT: " + (treffer.kurz || ""),
      (treffer.schritte || []).length
        ? "SCHRITTE:\n- " + treffer.schritte.join("\n- ") : "",
      (treffer.hinweise || []).length
        ? "HINWEISE:\n- " + treffer.hinweise.map((h) => h.text).join("\n- ") : "",
      treffer.rechtlich
        ? "ART: allgemeine Rechtslage, keine Therapon24-interne Regelung" : "",
      status === "unsicher"
        ? "ACHTUNG: Die Zuordnung ist unsicher. Frage einleitend kurz nach, " +
          "ob dieses Thema gemeint ist." : ""
    ].filter(Boolean).join("\n\n");

    const client = new Anthropic();

    const antwort = await client.beta.messages.create({
      model: MODELL,
      max_tokens: 700,
      system: SYSTEM,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [{
        role: "user",
        content:
          "FRAGE DER MITARBEITENDEN PERSON:\n" + frageKurz +
          "\n\nWISSENSBASIS-EINTRAG:\n" + eintragText +
          "\n\nFormuliere die Kernantwort passend zur Frage. " +
          "Halte dich strikt an den Eintrag."
      }]
    });

    /* Sicherheitsklassifikator hat abgelehnt -> Wissensbasis nutzen */
    if (antwort.stop_reason === "refusal") return res.status(204).end();

    const text = antwort.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!text || text.toUpperCase().includes("UNZUREICHEND")) {
      return res.status(204).end();
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ text, modell: MODELL });

  } catch (fehler) {
    /* Bewusst keine Fehlermeldung an den Browser: Die App fällt still auf
       die Wissensbasis zurück, die Mitarbeitenden merken nichts. */
    console.error("[t24-chat]", fehler && fehler.message);
    return res.status(204).end();
  }
}
