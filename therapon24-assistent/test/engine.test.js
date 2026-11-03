/* ===========================================================================
   Tests für die Such- und Antwort-Engine.
   Ausführen mit:  npm test      (oder: node test/engine.test.js)

   Die Dateien unter js/ sind klassische Browser-Skripte, keine Module.
   Deshalb werden sie hier genauso geladen, wie der Browser es tut:
   als Quelltext im globalen Kontext ausgewertet.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const JS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "js");

globalThis.window = globalThis;          // Browser-Umgebung nachbilden
for (const datei of ["config.js", "wissen.js", "engine.js"]) {
  vm.runInThisContext(fs.readFileSync(path.join(JS, datei), "utf8"),
                      { filename: datei });
}

const eng = new globalThis.T24Engine.Engine(
  globalThis.T24_WISSEN, globalThis.T24_KATEGORIEN, globalThis.T24_CONFIG);

// [Frage, erwartete id]
const faelle = [
 ["ich bin krank was mache ich",                    "abwesenheit-krank"],
 ["krankmeldung",                                   "abwesenheit-krank"],
 ["wie melde ich mich krank",                       "abwesenheit-krank"],
 ["wo gebe ich meinen gelben schein ab",            "abwesenheit-au"],
 ["Wie trage ich meine Stunden ein?",               "zeit-erfassen"],
 ["ich habe vergessen die zeit einzutragen",        "zeit-vergessen"],
 ["bis wann muss der stundenzettel abgegeben werden","zeit-frist"],
 ["zählt die fahrt zur schule als arbeitszeit",     "zeit-fahrzeit"],
 ["wie lange pause steht mir zu",                   "zeit-pause"],
 ["urlaub beantragen",                              "urlaub-antrag"],
 ["wie viele urlaubstage habe ich",                 "urlaub-anspruch"],
 ["was ist in den schulferien",                     "urlaub-ferien"],
 ["resturlaub verfällt",                            "urlaub-rest"],
 ["ich bin im urlaub krank geworden",               "urlaub-krank-im-urlaub"],
 ["mein kind ist heute nicht in der schule",        "zeit-ausfall-kind"],
 ["mein eigenes kind ist krank",                    "abwesenheit-kind-krank"],
 ["darf ich dem kind tabletten geben",              "einsatz-pflege"],
 ["wann kommt mein gehalt",                         "geld-zahltag"],
 ["wo finde ich meine lohnabrechnung",              "geld-abrechnung"],
 ["meine abrechnung stimmt nicht",                  "geld-fehler"],
 ["fahrtkosten",                                    "geld-fahrtkosten"],
 ["deutschlandticket zuschuss",                     "geld-ticket"],
 ["ich bin umgezogen neue adresse",                 "geld-steuerklasse"],
 ["klassenfahrt mitfahren?",                        "einsatz-ausflug"],
 ["was sind meine aufgaben",                        "einsatz-aufgaben"],
 ["darf ich aufsicht für die klasse übernehmen",    "einsatz-aufsicht"],
 ["das kind wird aggressiv",                        "einsatz-verhalten"],
 ["es ist ein unfall passiert",                     "einsatz-notfall"],
 ["eltern wollen meine handynummer",                "einsatz-eltern"],
 ["wie dokumentiere ich richtig",                   "einsatz-doku"],
 ["ich bin überfordert und brauche hilfe",          "entwicklung-supervision"],
 ["kann ich eine fortbildung machen",               "entwicklung-fortbildung"],
 ["mein erster tag im neuen einsatz",               "entwicklung-erster-tag"],
 ["führungszeugnis",                                "recht-fuehrungszeugnis"],
 ["masernimpfung nachweis",                         "recht-masern"],
 ["darf ich fotos vom kind machen",                 "recht-fotos"],
 ["schweigepflicht",                                "recht-schweigepflicht"],
 ["verdacht auf kindeswohlgefährdung",              "recht-kindeswohl"],
 ["ich habe etwas kaputt gemacht",                  "recht-haftung"],
 ["wen frage ich wobei",                            "vertrag-ansprechpartner"],
 ["ich möchte meine stunden aufstocken",            "vertrag-stunden"],
 ["ich brauche eine arbeitgeberbescheinigung",      "vertrag-bescheinigung"],
 ["kündigungsfrist",                                "vertrag-kuendigung"],
 ["ich bin schwanger",                              "vertrag-elternzeit"],
 ["ich komme heute zu spät",                        "abwesenheit-verspaetung"],
 ["darf ich zum arzt während der arbeitszeit",      "abwesenheit-arzttermin"],
 ["sonderurlaub umzug",                             "abwesenheit-sonderurlaub"],
 ["überstunden abbauen",                            "zeit-ueberstunden"],
 ["wo sehe ich meinen dienstplan",                  "zeit-dienstplan"],
 ["bekomme ich bei krankheit weiter gehalt",        "abwesenheit-lohnfortzahlung"]
];

let top1 = 0, top3 = 0, unsicher = 0;
const fehler = [];
for (const [frage, soll] of faelle) {
  const r = eng.antwort(frage);
  const ist = r.eintrag ? r.eintrag.id : null;
  const alle = [ist, ...(r.alternativen || []).map(a => a.id)];
  if (ist === soll) top1++;
  else fehler.push([frage, soll, ist, r.status]);
  if (alle.includes(soll)) top3++;
  if (r.status === "unsicher") unsicher++;
}
console.log("Testfälle:        " + faelle.length);
console.log("Richtig auf Platz 1: " + top1 + "/" + faelle.length +
            "  (" + Math.round(top1 / faelle.length * 100) + " %)");
console.log("In den Top 3:        " + top3 + "/" + faelle.length);
console.log("Als 'unsicher' markiert: " + unsicher);
if (fehler.length) {
  console.log("\nAbweichungen:");
  fehler.forEach(([f, s, i, st]) =>
    console.log("  " + JSON.stringify(f) + "\n     soll: " + s + "   ist: " + i + " [" + st + "]"));
}
// Negativtests: dürfen NICHT beantwortet werden
console.log("\nNegativtests (sollen 'unbekannt' liefern):");
["wo ist die kantine", "wie wird das wetter", "asdfghjkl",
 "wer gewinnt die bundesliga"].forEach(q => {
  const r = eng.antwort(q);
  console.log("  " + (r.status === "unbekannt" ? "OK  " : "!!  ") +
              JSON.stringify(q) + " -> " + r.status +
              (r.eintrag ? " (" + r.eintrag.id + ")" : ""));
});

/* Rückgabewert für CI: 0 nur, wenn jeder Fall auf Platz 1 richtig ist. */
if (top1 !== faelle.length) {
  console.error("\nFEHLGESCHLAGEN: " + (faelle.length - top1) +
                " Testfall/Testfälle treffen nicht.");
  process.exit(1);
}
console.log("\nAlle Tests bestanden.");
