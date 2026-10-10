const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const {createWorker}=require('tesseract.js'),Receipt=require('../receipt.js');
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
GlobalFonts.registerFromPath(path.join(__dirname,'../vendor/pdfjs/standard_fonts/LiberationSans-Regular.ttf'),'Receipt Test');
(async()=>{
  const output=path.join(__dirname,'../.test-output/v1.10');await fs.mkdir(output,{recursive:true});
  const worker=await createWorker('fra',1,{langPath:path.join(__dirname,'../vendor/ocr'),cachePath:path.join(__dirname,'../.test-output')});const results=[];
  try{
    for(const [time,meal] of [['10:00','midi'],['13:50','midi'],['14:01',''],['18:00','soir'],['23:59','soir'],['00:01','']]){
      const canvas=createCanvas(700,1000),c=canvas.getContext('2d');c.fillStyle='#faf8f1';c.fillRect(0,0,700,1000);c.fillStyle='#25211c';c.font='32px "Receipt Test"';
      const lines=['BRASSERIE DU PARC','Ticket de demonstration','Date : 06/10/2026   '+time,'Plat du jour       18,50 EUR','Dessert               6,00 EUR','Cafe                    2,50 EUR','TOTAL TTC : 27,00 EUR','TVA 10% : 2,45 EUR','Merci de votre visite'];
      lines.forEach((line,i)=>c.fillText(line,35,80+i*90));
      const file=path.join(output,'heure-'+time.replace(':','')+'.png');await fs.writeFile(file,canvas.toBuffer('image/png'));
      const {data}=await worker.recognize(file,{rotateAuto:true}),detail=Receipt.extractDetails(data.text),ticket=new Receipt.Session(1,'fixture');ticket.applyOCR({...detail,timeUncertain:data.confidence<70});
      assert.equal(ticket.date,'2026-10-06');assert.equal(ticket.meal,meal,time);assert.ok(data.confidence>=70,time+' : confiance insuffisante');
      results.push({time,expected:meal,read:ticket.times,confidence:data.confidence});console.log('PASS '+time+' → '+(meal||'sans précision'));
    }
  }finally{await worker.terminate();}
  await fs.writeFile(path.join(output,'ocr-meals.json'),JSON.stringify(results,null,2)+'\n');
})().catch(error=>{console.error(error);process.exitCode=1;});
