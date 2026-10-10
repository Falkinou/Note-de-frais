const {test}=require('node:test'),assert=require('node:assert/strict');
const {PDFDocument,StandardFonts,degrees,rgb}=require('pdf-lib');
const {createCanvas}=require('@napi-rs/canvas');
const {stamp}=require('../pdf-export.js');
const path=require('node:path'),fs=require('node:fs/promises');
async function reader(bytes){
  const lib=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task=lib.getDocument({data:new Uint8Array(bytes),standardFontDataUrl:path.join(__dirname,'../vendor/pdfjs/standard_fonts/'),isEvalSupported:false});
  return Object.assign(await task.promise,{close:()=>task.destroy()});
}
async function fixture(rotation){
  const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica),page=doc.addPage([360,520]);
  doc.setTitle('SOURCE-INTACTE');page.setCropBox(20,30,300,450);page.setRotation(degrees(rotation));
  page.drawText('REFERENCE-ORIGINALE 06/10/2026 13:50',{x:35,y:440,size:11,font});
  page.drawRectangle({x:40,y:80,width:80,height:70,color:rgb(.1,.2,.5)});
  const second=doc.addPage([360,520]);second.drawText('ANNEXE-INTACTE',{x:40,y:450,size:16,font});
  const field=doc.getForm().createTextField('reference');field.setText('CHAMP-CONSERVE');field.addToPage(second,{x:40,y:300,width:180,height:25});
  return doc.save();
}
async function view(doc,number){const page=await doc.getPage(number),viewport=page.getViewport({scale:1.5});return {page,viewport,width:Math.ceil(viewport.width),height:Math.ceil(viewport.height)};}
async function render(v){const canvas=createCanvas(v.width,v.height);await v.page.render({canvasContext:canvas.getContext('2d'),viewport:v.viewport}).promise;return canvas;}
for(const rotation of [0,90,180,270])test('PDF natif : texte, formulaire, pages et placement conservés, rotation '+rotation,async()=>{
  const bytes=await fixture(rotation),original=await reader(bytes),v=await view(original,1),overlay=createCanvas(v.width,v.height),ctx=overlay.getContext('2d');
  ctx.fillStyle='#d56a22';ctx.fillRect(v.width*.3,v.height*.7,40,22);
  const pdf={bytes,page:1,pages:2,width:v.width,height:v.height,viewport:{width:v.viewport.width,height:v.viewport.height,transform:v.viewport.transform}};
  const result=await stamp({pdf,overlay:overlay.toBuffer('image/png'),outputHeight:v.height}),reopened=await PDFDocument.load(result),output=await reader(result);
  assert.equal(reopened.getPageCount(),2);assert.equal(reopened.getTitle(),'SOURCE-INTACTE');assert.equal(reopened.getForm().getTextField('reference').getText(),'CHAMP-CONSERVE');
  const text=await (await output.getPage(1)).getTextContent();assert.ok(text.items.some(t=>t.str.includes('REFERENCE-ORIGINALE')));
  const a=await render(await view(original,2)),b=await render(await view(output,2));assert.deepEqual(a.toBuffer('image/png'),b.toBuffer('image/png'),'la deuxième page et son champ restent visuellement identiques');
  const painted=await render(await view(output,1)),pixel=painted.getContext('2d').getImageData(Math.floor(v.width*.3+10),Math.floor(v.height*.7+10),1,1).data;
  assert.ok(Math.abs(pixel[0]-213)<3&&Math.abs(pixel[1]-106)<3&&Math.abs(pixel[2]-34)<3,Array.from(pixel));
  await original.close();await output.close();
});
test('marge PDF : le contenu reste sélectionnable, le tampon est dans la nouvelle bande',async()=>{
  for(const rotation of [0,90,180,270]){
    const bytes=await fixture(rotation),original=await reader(bytes),v=await view(original,1),extra=90,overlay=createCanvas(v.width,v.height+extra),ctx=overlay.getContext('2d');
    ctx.fillStyle='#d56a22';ctx.fillRect(30,v.height+20,50,25);
    const pdf={bytes,page:1,pages:2,width:v.width,height:v.height,viewport:{width:v.viewport.width,height:v.viewport.height,transform:v.viewport.transform}};
    const result=await stamp({pdf,overlay:overlay.toBuffer('image/png'),outputHeight:v.height+extra}),output=await reader(result),next=await view(output,1),painted=await render(next);
    assert.equal(next.width,v.width);assert.equal(next.height,v.height+extra);
    const pixels=painted.getContext('2d'),color=pixels.getImageData(40,v.height+30,1,1).data;
    assert.ok(Math.abs(color[0]-213)<3&&Math.abs(color[1]-106)<3,'position dans la marge, rotation '+rotation);
    const text=await next.page.getTextContent();assert.ok(text.items.some(t=>t.str.includes('REFERENCE-ORIGINALE')));
    if(rotation===0){await fs.mkdir(path.join(__dirname,'../.test-output/v1.10'),{recursive:true});await fs.writeFile(path.join(__dirname,'../.test-output/v1.10/native-margin.pdf'),result);await fs.writeFile(path.join(__dirname,'../.test-output/v1.10/native-margin.png'),painted.toBuffer('image/png'));}
    await original.close();await output.close();
  }
});
