const {test}=require('node:test'),assert=require('node:assert/strict'),R=require('../reading.js'),Receipt=require('../receipt.js');
const box=(x=0)=>({x0:x,y0:10,x1:x+60,y1:30});
const word=(text,confidence=95,x=0)=>({text,confidence,bbox:box(x)});
function line(words,confidence=40){return {text:words.map(w=>w.text).join(' ')+'\n',words,confidence,bbox:R.union(words.map(w=>w.bbox))};}
test('date et heure nettes restent valides même sur une page globalement mal reconnue',()=>{
 const result=R.analyze([line([word('Date',12),word('06/10/2026',96,80),word('13:50',97,160)])]);
 assert.equal(result.status,'found');assert.equal(result.times[0].meal,'midi');assert.equal(result.candidates[0].confidence,96);assert.deepEqual(result.candidates[0].box,box(80));assert.deepEqual(result.times[0].box,box(160));
});
test('des chiffres incertains demandent confirmation même si la ligne est nette',()=>{
 const result=R.analyze([line([word('Date'),word('06/10/2026',30),word('13:50',40)],99)]);
 assert.equal(result.status,'uncertain');assert.equal(result.times.length,0);assert.equal(result.timeCandidates[0].time,'13:50');
});
test('preuve des mois français et dates séparées en plusieurs mots',()=>{
 const words=[word('6',98,0),word('octobre',97,70),word('2026',96,140),word('à',12,210),word('13',98,230),word('h',99,300),word('50',98,370)];
 const result=R.analyze([line(words)]);assert.equal(result.status,'found');assert.deepEqual(result.candidates[0].box,{x0:0,y0:10,x1:200,y1:30});assert.equal(result.times[0].time,'13:50');
});
test('plusieurs dates et heures conservent leur association entre lignes OCR',()=>{
 const result=R.analyze([line([word('06/10/2026')]),line([word('13:50')]),line([word('07/10/2026')]),line([word('20:15')])]);
 assert.equal(result.status,'ambiguous');assert.deepEqual(result.times.map(t=>t.date),['2026-10-06','2026-10-07']);
});
test('la seconde passe complète les données mais une contradiction retire le préremplissage',()=>{
 const first=R.analyze([line([word('06/10/2026')])]),second=R.analyze([line([word('07/10/2026'),word('20:15')])]);
 const ticket=new Receipt.Session(1,'photo');ticket.applyOCR(first);assert.equal(ticket.date,'2026-10-06');ticket.applyOCR(R.merge(first,second));assert.equal(ticket.date,'');assert.equal(ticket.ocrStatus,'ambiguous');
 ticket.setDate('2026-10-06');ticket.applyOCR(R.merge(first,second));assert.equal(ticket.date,'2026-10-06');
 assert.equal(R.needsRefinement(R.merge(first,second)),false);
});
test('deux passes sur la même date conservent la meilleure preuve sans doublon',()=>{
 const first=R.analyze([line([word('06/10/2026',50)])]),second=R.analyze([line([word('06/10/2026',96),word('13:50')])]);
 const result=R.merge(first,second);assert.equal(result.status,'found');assert.equal(result.candidates.length,1);assert.equal(R.needsRefinement(result),false);
});
test('horaires et dates de validité ne deviennent jamais des candidats',()=>{
 const result=R.analyze([line([word('Ouvert de 10:00 à 23:00')]),line([word('Expiration 06/10/2026')])]);assert.equal(result.status,'missing');assert.equal(result.timeCandidates.length,0);
});
test('les preuves PDF suivent rotation et origine de la page',()=>{
 const items=[{str:'06/10/2026',transform:[10,0,0,10,30,100],width:50,fontName:'F',hasEOL:true}];
 for(const [transform,expected] of [[[2,0,0,-2,-20,300],{x0:40,y0:84,x1:140,y1:104}],[[0,2,2,0,-20,-40],{x0:176,y0:20,x1:196,y1:120}]]){
  const lines=R.pdfLines(items,{transform},{F:{ascent:.8,descent:-.2}});assert.deepEqual(lines[0].bbox,expected);assert.equal(R.analyze(lines).status,'found');
 }
});
