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
test("espaces ajoutés par l’OCR dans les chiffres d’une date", () => {
  for (const text of ["Date : 1 0/ 1 0/ 2026 111, Quai", "1 0 / 1 0 / 2 0 2 6", "2 0 2 6-1 0-1 0"]) {
    const result = Receipt.extractDates(text);
    assert.equal(result.status, "found", text);
    assert.equal(result.candidates[0].iso, "2026-10-10", text);
  }
  for (const text of ["3 1/0 2/2026", "Expiration 1 0/1 0/2026", "Tel 01 02 20 26 78"]) {
    assert.equal(Receipt.extractDates(text).status, "missing", text);
  }
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
test("ticket B indépendant du filtre et de la date du ticket A", () => {
  const a = new Receipt.Session(1, "A");
  a.setDate("2026-10-08"); a.enhanced = true; a.image = "A enhanced"; a.cancel();
  const b = new Receipt.Session(2, "B");
  a.applyOCR(Receipt.extractDates("07/10/2026"));
  assert.deepEqual([b.image, b.original, b.enhanced, b.date], ["B", "B", false, ""]);
  b.replaceImage("B cropped");
  assert.equal(b.source, "B", "le recadrage et la rotation conservent la photo utilisée par la lecture");
  assert.equal(b.original, "B cropped");
  assert.equal(b.enhanced, false);
});
test('plages repas exactes : 10 h à 14 h et 18 h à minuit',()=>{
  for(const time of ['10:00','12:43','13:59','14:00'])assert.equal(Receipt.mealAt(time),'midi',time);
  for(const time of ['18:00','20:35','23:59','00:00'])assert.equal(Receipt.mealAt(time),'soir',time);
  for(const time of ['09:59','14:01','17:59','00:01','24:00','12:61',''])assert.equal(Receipt.mealAt(time),'',time);
});
test('lecture des heures imprimées, avec secondes, h et AM/PM',()=>{
  for(const value of ['13:50:07','13 h 50','1:50 PM']){
    const detail=Receipt.extractDetails('mardi 6 octobre 2026 à '+value),ticket=new Receipt.Session(1,'image');ticket.applyOCR(detail);
    assert.equal(ticket.date,'2026-10-06');assert.equal(ticket.meal,'midi');assert.equal(ticket.times[0].time,'13:50');
  }
  assert.equal(Receipt.extractTimes('Heure : 12:00 AM')[0].meal,'soir');
});
test('horaires d’ouverture, plages et heures invalides ne donnent pas un repas',()=>{
  for(const text of ['Ouvert de 10:00 à 23:00','Horaires : 12h00','10:00 - 14:00','Tel 12:45','Heure 25:30','Heure 12:99','12:30:99','10.50 EUR'])assert.deepEqual(Receipt.extractTimes(text),[],text);
});
test('heures ambiguës : pas de midi/soir inventé, choix manuel prioritaire',()=>{
  const ticket=new Receipt.Session(1,'image');ticket.applyOCR(Receipt.extractDetails('06/10/2026\n12:43\n20:15'));
  assert.equal(ticket.meal,'');assert.equal(ticket.timeStatus,'ambiguous');ticket.setMeal('soir');ticket.applyOCR(Receipt.extractDetails('06/10/2026 12:43'));assert.equal(ticket.meal,'soir');
  ticket.setMeal('');ticket.applyOCR(Receipt.extractDetails('06/10/2026 12:43'));assert.equal(ticket.meal,'');
});
test('l’heure suit la date choisie et une lecture faible ne préremplit pas le repas',()=>{
  const ticket=new Receipt.Session(1,'image');ticket.applyOCR(Receipt.extractDetails('06/10/2026 12:43\n07/10/2026 20:15'));
  assert.equal(ticket.meal,'');ticket.setDate('2026-10-07');assert.equal(ticket.meal,'soir');ticket.setDate('2026-10-06');assert.equal(ticket.meal,'midi');
  ticket.applyOCR({...Receipt.extractDetails('06/10/2026 12:43'),timeUncertain:true});assert.equal(ticket.meal,'');
});
test('le suffixe repas suit la date dans le tampon et le nom numéroté',()=>{
  assert.equal(Receipt.displayDate('2026-10-06','midi'),'06/10/2026 · midi');
  assert.equal(Receipt.filename('2026-10-06','pdf','soir',2),'NDF_06102026_soir_02.pdf');
  assert.equal(Receipt.filename('2026-10-06','png','',1),'NDF_06102026_01.png');
});
test('une relecture sans heure ni date ne supprime pas une date déjà trouvée',()=>{
  const ticket=new Receipt.Session(1,'image');ticket.applyOCR(Receipt.extractDetails('06/10/2026'));
  ticket.applyOCR({status:'missing',candidates:[],times:[]});assert.equal(ticket.date,'2026-10-06');
});
