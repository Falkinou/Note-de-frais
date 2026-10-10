const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {createCanvas,loadImage,ImageData}=require('@napi-rs/canvas'),{createWorker}=require('tesseract.js'),R=require('../reading.js'),P=require('../image-processing.js');
(async()=>{
 const root=path.join(__dirname,'..'),output=path.join(root,'.test-output/v1.11');await fs.mkdir(output,{recursive:true});
 const fixtures=(await fs.readFile(path.join(root,'tests/fixtures/expected.json'),'utf8')).toString();
 const cases=JSON.parse(fixtures).map(item=>({...item,file:path.join(root,'tests/fixtures',item.name+'.png')}));
 for(const [time,meal] of [['10:00','midi'],['13:50','midi'],['14:01',''],['18:00','soir'],['23:59','soir'],['00:01','']])cases.push({name:time,file:path.join(root,'.test-output/v1.10/heure-'+time.replace(':','')+'.png'),status:'found',dates:['2026-10-06'],time,meal});
 const source=await loadImage(path.join(root,'.test-output/v1.10/heure-1350.png'));
 for(const name of ['incline','ombre','petit']){
  const canvas=createCanvas(700,1000),ctx=canvas.getContext('2d');ctx.fillStyle='#faf8f1';ctx.fillRect(0,0,700,1000);
  if(name==='incline'){ctx.translate(350,500);ctx.rotate(.035);ctx.translate(-350,-500)}
  if(name==='petit'){const small=createCanvas(350,500);small.getContext('2d').drawImage(source,0,0,350,500);ctx.drawImage(small,0,0,700,1000)}else ctx.drawImage(source,0,0);
  if(name==='ombre'){const gradient=ctx.createLinearGradient(0,0,700,0);gradient.addColorStop(0,'rgba(0,0,0,.60)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,700,1000)}
  const file=path.join(output,name+'.png');await fs.writeFile(file,canvas.toBuffer('image/png'));cases.push({name,file,status:'found',dates:['2026-10-06'],time:'13:50',meal:'midi'});
 }
 const start=performance.now(),worker=await createWorker('fra',1,{langPath:path.join(root,'vendor/ocr'),cachePath:path.join(root,'.test-output')});const initializationMs=Math.round(performance.now()-start),results=[];
 try{
  for(const fixture of cases){
   const begin=performance.now();let passes=1;
   const image=await loadImage(fixture.file),canvas=createCanvas(image.width,image.height),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const processed=P.enhance(ctx.getImageData(0,0,image.width,image.height),'readable');ctx.putImageData(new ImageData(processed.data,processed.width,processed.height),0,0);
   const {data}=await worker.recognize(canvas.toBuffer('image/png'),{rotateAuto:true,tessedit_pageseg_mode:'6',user_defined_dpi:'300'},{text:true,blocks:true,imageColor:true});let result=R.fromOCR(data);
   if(R.needsRefinement(result)){
    const next=await worker.recognize(fixture.file,{rotateAuto:true,tessedit_pageseg_mode:'11',user_defined_dpi:'300'},{text:true,blocks:true,imageColor:true});result=R.merge(result,R.fromOCR(next.data));passes++;
   }
   const milliseconds=Math.round(performance.now()-begin);assert.equal(result.status,fixture.status,fixture.name);assert.deepEqual(result.candidates.map(c=>c.iso).sort(),fixture.dates.sort(),fixture.name);
   if(fixture.time){assert.equal(result.times.length,1,fixture.name);assert.equal(result.times[0].time,fixture.time);assert.equal(result.times[0].meal,fixture.meal);assert.ok(result.times[0].box);assert.ok(result.candidates[0].box)}
   results.push({name:fixture.name,milliseconds,passes,result});console.log('PASS '+fixture.name+' '+milliseconds+' ms / '+passes+' passe(s)');
  }
 }finally{await worker.terminate()}
 await fs.writeFile(path.join(output,'reading-benchmark.json'),JSON.stringify({initializationMs,results},null,2)+'\n');
})().catch(error=>{console.error(error);process.exitCode=1});
