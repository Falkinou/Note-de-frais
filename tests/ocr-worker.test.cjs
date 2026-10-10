const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(recognize){let creates=0,terminated=0,calls=0;const window={Tesseract:{}},worker={recognize:(...args)=>{calls++;return recognize(...args)},terminate:async()=>{terminated++}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../ocr.js'),'utf8'),{window,URL,document:{currentScript:{src:'https://stamp.test/ocr.js'}},Tesseract:{createWorker:async()=>{creates++;return worker}},ReceiptReading:require('../reading.js'),ReceiptImage:{enhance:async source=>source},performance,setTimeout,clearTimeout});
 return {ocr:window.ReceiptOCR,counts:()=>({creates,terminated,calls})};}
const data=(text)=>({data:{text,confidence:96}});
test('le moteur OCR chargé est réutilisé entre tickets',async()=>{
 const app=setup(async()=>data('06/10/2026 13:50'));await app.ocr.recognize('A');app.ocr.cancel();await app.ocr.recognize('B');assert.deepEqual(app.counts(),{creates:1,terminated:0,calls:2});
});
test('une annulation libère immédiatement le ticket puis ignore le résultat tardif',async()=>{
 let resolve,first=true;const app=setup(()=>first?(first=false,new Promise(r=>resolve=r)):Promise.resolve(data('07/10/2026 20:15')));
 const old=app.ocr.recognize('A');await new Promise(r=>setImmediate(r));app.ocr.cancel();await assert.rejects(old,/remplacée/);const fresh=await app.ocr.recognize('B');resolve(data('06/10/2026 13:50'));assert.equal(fresh.candidates[0].iso,'2026-10-07');assert.equal(app.counts().creates,2);
});
test('une seule relance ciblée sur un manque, sans effacer la première lecture si elle échoue',async()=>{
 let calls=0;const app=setup(async()=>{if(++calls===2)throw new Error('engine');return data('06/10/2026')});const result=await app.ocr.recognize('A');assert.equal(result.status,'found');assert.equal(result.candidates[0].iso,'2026-10-06');assert.equal(calls,2);
});
