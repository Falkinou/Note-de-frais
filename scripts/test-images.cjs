// Deterministic receipt scenes, independent of the detector's corner estimation.
const {createCanvas,ImageData,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('node:fs/promises');
const path=require('node:path');
const Pixels=require('../image-processing.js');
const {createWorker}=require('tesseract.js');
const {extractDates}=require('../receipt.js');
GlobalFonts.registerFromPath(path.join(__dirname,'../vendor/pdfjs/standard_fonts/LiberationSans-Regular.ttf'),'Fixture Sans');
GlobalFonts.registerFromPath(path.join(__dirname,'../vendor/pdfjs/standard_fonts/LiberationSans-Bold.ttf'),'Fixture Sans');
function inverse(m){const [a,b,c,d,e,f,g,h,i]=m;const q=[e*i-f*h,c*h-b*i,b*f-c*e,f*g-d*i,a*i-c*g,c*d-a*f,d*h-e*g,b*g-a*h,a*e-b*d];const det=a*q[0]+b*q[3]+c*q[6];return q.map(v=>v/det);}
function projection(quad){
  const uv=[[0,0],[1,0],[1,1],[0,1]],rows=[];
  quad.forEach((p,i)=>{const [u,v]=uv[i];rows.push([u,v,1,0,0,0,-p.x*u,-p.x*v,p.x],[0,0,0,u,v,1,-p.y*u,-p.y*v,p.y]);});
  for(let k=0;k<8;k++){
    let pivot=k;for(let i=k+1;i<8;i++)if(Math.abs(rows[i][k])>Math.abs(rows[pivot][k]))pivot=i;
    [rows[k],rows[pivot]]=[rows[pivot],rows[k]];const div=rows[k][k];for(let j=k;j<9;j++)rows[k][j]/=div;
    for(let i=0;i<8;i++){if(i===k)continue;const f=rows[i][k];for(let j=k;j<9;j++)rows[i][j]-=f*rows[k][j];}
  }
  return [...rows.map(r=>r[8]),1];
}
function receipt(){
  const canvas=createCanvas(600,1080),c=canvas.getContext('2d');c.fillStyle='#f9f5eb';c.fillRect(0,0,600,1080);
  c.textAlign='center';c.fillStyle='#4c4139';c.font='bold 34px "Fixture Sans"';c.fillText('BRASSERIE DU PARC',300,90);
  c.fillStyle='#9b5331';c.font='23px "Fixture Sans"';c.fillText('Ticket de démonstration',300,138);
  c.fillStyle='#77746c';c.textAlign='left';c.font='27px "Fixture Sans"';
  for(const [text,y] of [['Date : 10/10/2026',220],['Table 12   -   2 couverts',280],['Plat du jour      18,50',385],['Dessert            6,00',445],['Cafe               2,50',505],['TOTAL TTC         27,00 EUR',675],['TVA 10%            2,45 EUR',740],['Merci de votre visite',920]])c.fillText(text,40,y);
  c.strokeStyle='#8f8b83';for(const y of [320,570,810]){c.beginPath();c.moveTo(35,y);c.lineTo(565,y);c.stroke();}
  return c.getImageData(0,0,600,1080);
}
function scene(base,quad,{shadow=false,light=false}={}){
  const width=1000,height=1500,data=new Uint8ClampedArray(width*height*4),m=inverse(projection(quad));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=(y*width+x)*4,den=m[6]*x+m[7]*y+m[8],u=(m[0]*x+m[1]*y+m[2])/den,v=(m[3]*x+m[4]*y+m[5])/den;
    if(u>=0&&v>=0&&u<=1&&v<=1){
      const sx=Math.min(base.width-1,Math.floor(u*base.width)),sy=Math.min(base.height-1,Math.floor(v*base.height)),at=(sy*base.width+sx)*4;
      const illumination=shadow?.48+.49*u+.025*Math.sin(v*7):.98;
      for(let c=0;c<3;c++)data[i+c]=base.data[at+c]*illumination;
    }else{
      const texture=Math.sin(y*.095+x*.028)*5+Math.sin(x*.022)*3;
      const color=light?[186,181,172]:[64,50,40];for(let c=0;c<3;c++)data[i+c]=color[c]+texture;
    }
    data[i+3]=255;
  }
  return {width,height,data};
}
function canvas(image){const c=createCanvas(image.width,image.height);c.getContext('2d').putImageData(new ImageData(image.data,image.width,image.height),0,0);return c;}
function sample(image){const src=canvas(image),out=createCanvas(320,480);out.getContext('2d').drawImage(src,0,0,320,480);return out.getContext('2d').getImageData(0,0,320,480);}
(async()=>{
  const output=path.join(__dirname,'../.test-output/images');await fs.mkdir(output,{recursive:true});
  const base=receipt(),quad=[{x:265,y:65},{x:775,y:170},{x:885,y:1360},{x:90,y:1400}];
  const fixtures=[['perspective-shadow',{shadow:true}],['perspective-light',{light:true}],['perspective-dark',{}]];
  const report=[];let first;
  for(const [name,options] of fixtures){
    const input=scene(base,quad,options),start=performance.now(),detection=Pixels.detect(sample(input));
    if(!detection.found)throw new Error('Paper not found: '+name);
    const expected=quad.map(p=>({x:p.x/999*100,y:p.y/1499*100}));
    const error=Math.max(...detection.points.map((p,i)=>Math.hypot(p.x-expected[i].x,p.y-expected[i].y)));
    if(error>3)throw new Error('Incorrect corners: '+name+' '+error);
    const cropped=Pixels.rectify(input,detection.points),enhanced=Pixels.enhance(cropped),mono=Pixels.enhance(cropped,'mono');
    const elapsed=Math.round(performance.now()-start);
    for(const [suffix,image] of [['photo',input],['crop',cropped],['readable',enhanced],['mono',mono]])await fs.writeFile(path.join(output,name+'-'+suffix+'.png'),canvas(image).toBuffer('image/png'));
    report.push({name,cornerErrorPercent:Number(error.toFixed(2)),processingMilliseconds:elapsed});
    if(!first)first={input,cropped,enhanced,mono};
  }
  const board=createCanvas(1440,1040),ctx=board.getContext('2d');ctx.fillStyle='#e8e2d7';ctx.fillRect(0,0,1440,1040);ctx.fillStyle='#211d17';ctx.font='bold 30px "Fixture Sans"';
  const panels=[['Photo',first.input],['Redressé',first.cropped],['Lisible',first.enhanced],['N&B',first.mono]];
  panels.forEach(([name,image],i)=>{ctx.fillText(name,24+i*360,48);const ratio=Math.min(324/image.width,920/image.height);ctx.drawImage(canvas(image),24+i*360,82,image.width*ratio,image.height*ratio);});
  await fs.writeFile(path.join(output,'comparison.png'),board.toBuffer('image/png'));
  const worker=await createWorker('fra',1,{langPath:path.join(__dirname,'../vendor/ocr'),cachePath:path.join(__dirname,'../.test-output')});
  try {
    for(const suffix of ['crop','readable','mono']){
      const {data}=await worker.recognize(path.join(output,'perspective-shadow-'+suffix+'.png'),{rotateAuto:true});
      const dates=extractDates(data.text);if(suffix!=='crop'&&(dates.status!=='found'||dates.candidates[0].iso!=='2026-10-10'))throw new Error('OCR mismatch '+suffix+': '+data.text);
      report.push({ocr:suffix,date:dates.candidates[0]?.iso||null,confidence:data.confidence});
    }
  } finally { await worker.terminate(); }
  await fs.writeFile(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
