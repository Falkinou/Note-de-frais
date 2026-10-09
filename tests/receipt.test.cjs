const { test } = require("node:test");
const assert = require("node:assert/strict");
const Receipt = require("../receipt.js");
test("dates françaises, ISO et mois français", () => {
  for (const text of ["08/10/2026", "8-10-26", "2026-10-08", "8 octobre 2026", "8 oct. 2026", "Le 08/10/2026.", "2026-10-08."]) {
    const result = Receipt.extractDates(text);
    assert.equal(result.status, "found", text);
    assert.equal(result.candidates[0].iso, "2026-10-08", text);
  }
});
test("dates impossibles, numéros et validité ne deviennent pas une date de ticket", () => {
  for (const text of ["31/02/2026", "29/02/2025", "01.02.20.26.78", "Tel 08 10 20 26", "Valable au 08/10/2026", "Expiration 08/10/2026"]) {
    assert.equal(Receipt.extractDates(text).status, "missing", text);
  }
  assert.equal(Receipt.extractDates("29/02/2024").status, "found");
});
test("dates différentes ambiguës, répétition de la même date dédupliquée", () => {
  assert.equal(Receipt.extractDates("07/10/2026\n08/10/2026").status, "ambiguous");
  assert.equal(Receipt.extractDates("08/10/2026\n08.10.2026").candidates.length, 1);
});
test("format ISO conservé pour le champ, le tampon et le nom du fichier", () => {
  const ticket = new Receipt.Session(1, "A");
  ticket.setDate("2026-10-08");
  assert.equal(ticket.date, "2026-10-08");
  assert.equal(Receipt.displayDate(ticket.date), "08/10/2026");
  assert.equal(Receipt.filename(ticket.date, "pdf"), "NDF_08102026.pdf");
  assert.equal(Receipt.filename(""), "NDF_sans-date.png");
});
test("une correction manuelle, même vide, résiste à une lecture tardive", () => {
  for (const manual of ["2026-10-07", ""]) {
    const ticket = new Receipt.Session(1, "A");
    ticket.setDate(manual);
    ticket.applyOCR(Receipt.extractDates("08/10/2026"));
    assert.equal(ticket.date, manual);
  }
});
test("une date incertaine ou plusieurs dates attendent un choix", () => {
  const ticket = new Receipt.Session(1, "A");
  ticket.applyOCR({ status: "uncertain", candidates: [{ iso: "2026-10-08" }] });
  assert.equal(ticket.date, "");
  ticket.applyOCR(Receipt.extractDates("07/10/2026\n08/10/2026"));
  assert.equal(ticket.date, "");
});
test("ticket B indépendant du filtre, de la date et du mode rapide du ticket A", () => {
  const a = new Receipt.Session(1, "A", true);
  a.setDate("2026-10-08"); a.enhanced = true; a.image = "A enhanced"; a.cancel();
  const b = new Receipt.Session(2, "B");
  a.applyOCR(Receipt.extractDates("07/10/2026"));
  assert.deepEqual([b.image, b.original, b.enhanced, b.express, b.date], ["B", "B", false, false, ""]);
  b.replaceImage("B cropped");
  assert.equal(b.source, "B", "le recadrage et la rotation conservent la photo utilisée par la lecture");
  assert.equal(b.original, "B cropped");
  assert.equal(b.enhanced, false);
});
