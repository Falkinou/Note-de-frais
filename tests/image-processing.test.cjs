const {test}=require('node:test');
const assert=require('node:assert/strict');
const Pixels=require('../image-processing.js');
function raster(w,h,pixel){const data=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const rgb=pixel(x,y);data.set([...rgb,255],(y*w+x)*4);}return {width:w,height:h,data};}
function inside(x,y,quad){return quad.every((a,i)=>{const b=quad[(i+1)%4];return (b.x-a.x)*(y-a.y)-(b.y-a.y)*(x-a.x)>=0;});}
function paperImage(quad,{shadow=false,background=48}={}){
  return raster(320,460,(x,y)=>{
    if(!inside(x,y,quad))return [background,background,background];
    const brightness=shadow?140+x*.3:242;
    const ink=y%22<3&&y>100&&y<350&&x>100&&x<205;
    const value=ink?brightness*.45:brightness;return [value,value,value];
  });
}
test('quatre coins indépendants : refuse croisements, coins confondus et entrées invalides',()=>{
  assert.equal(Pixels.validQuad(Pixels.fullFrame()),true);
  assert.equal(Pixels.validQuad([{x:8,y:10},{x:80,y:16},{x:94,y:94},{x:4,y:90}]),true);
  for(const points of [[{x:0,y:0},{x:100,y:100},{x:100,y:0},{x:0,y:100}],Array(4).fill({x:10,y:10}),[{x:NaN,y:0},...Pixels.fullFrame().slice(1)]])assert.equal(Pixels.validQuad(points),false);
});
test('détecte le papier en perspective malgré ses lignes de texte et une ombre',()=>{
  const quad=[{x:80,y:30},{x:248,y:64},{x:280,y:400},{x:38,y:427}];
  for(const shadow of [false,true]){
    const result=Pixels.detect(paperImage(quad,{shadow}));assert.equal(result.found,true);
    result.points.forEach((p,i)=>assert.ok(Math.hypot(p.x/100*319-quad[i].x,p.y/100*459-quad[i].y)<10,'Coin '+i+' proche du vrai bord'));
  }
});
test('ne confond pas le texte d’une page entière ni un aplat avec les bords du ticket',()=>{
  const full=Pixels.fullFrame().map(p=>({x:p.x/100*319,y:p.y/100*459}));
  assert.equal(Pixels.detect(paperImage(full)).found,false);
  assert.equal(Pixels.detect(raster(320,460,()=>[160,160,160])).found,false);
});
test('la détection ne sélectionne pas seulement la moitié éclairée d’un document',()=>{
  const quad=[{x:60,y:20},{x:270,y:20},{x:270,y:440},{x:60,y:440}];
  const image=raster(320,460,(x,y)=>{const v=inside(x,y,quad)?110+x*.45:45;return [v,v,v];});
  const result=Pixels.detect(image);assert.equal(result.found,true);
  assert.ok(result.points[0].x<22&&result.points[1].x>80);
});
test('redressement identité : aucun pixel perdu, bords et résolution conservés',()=>{
  const image=raster(64,96,(x,y)=>[x*3,y*2,100]);
  const result=Pixels.rectify(image,Pixels.fullFrame());
  assert.equal(result.width,64);assert.equal(result.height,96);assert.deepEqual(result.data,image.data);
});
test('redressement perspectif : retrouve les quatre coins colorés sans inverser les côtés',()=>{
  const image=raster(100,120,(x,y)=>[x*2,y*2,0]);
  const quad=[{x:20,y:5},{x:80,y:15},{x:95,y:90},{x:5,y:98}],out=Pixels.rectify(image,quad);
  const corners=[0,out.width-1,out.width*out.height-1,(out.height-1)*out.width];
  corners.forEach((position,i)=>{assert.ok(Math.abs(out.data[position*4]-quad[i].x/100*99*2)<2);assert.ok(Math.abs(out.data[position*4+1]-quad[i].y/100*119*2)<2)});
  assert.throws(()=>Pixels.rectify(image,[quad[1],quad[0],quad[2],quad[3]]));
});
test('quatre rotations retrouvent exactement le recadrage initial',()=>{
  const initial=[{x:12,y:6},{x:78,y:13},{x:93,y:92},{x:9,y:97}];
  let quad=initial;for(let i=0;i<4;i++){quad=Pixels.rotateQuad(quad);assert.ok(Pixels.validQuad(quad));}assert.deepEqual(quad,initial);
});
test('correction d’éclairage : réduit l’ombre et garde une impression pâle',()=>{
  const image=raster(240,360,(x,y)=>{const paper=125+x*.45;const ink=y%24<3&&x>25&&x<215;const v=ink?paper-16:paper;return [v,v,v];});
  const original=new Uint8ClampedArray(image.data),out=Pixels.enhance(image);
  const luminance=(r,x,y)=>r.data[(y*r.width+x)*4];
  assert.ok(Math.abs(luminance(out,45,110)-luminance(out,195,110))<15,'fond homogène');
  assert.ok(luminance(out,100,110)-luminance(out,100,121)>18,'impression pâle préservée');
  assert.ok(luminance(out,100,121)<240,'texte non blanchi');
  assert.deepEqual(image.data,original,'la source reste intacte');
});
test('N&B conserve les niveaux de gris et le mode lisible garde les couleurs',()=>{
  const image=raster(150,180,(x,y)=>x>50&&x<95&&y>65&&y<90?[100,30,25]:[235,225,210]);
  const color=Pixels.enhance(image,'readable'),mono=Pixels.enhance(image,'mono'),index=(70*150+60)*4;
  assert.ok(color.data[index]>color.data[index+1]+40);
  assert.equal(mono.data[index],mono.data[index+1]);assert.equal(mono.data[index+1],mono.data[index+2]);
  assert.ok(new Set(Array.from(mono.data).filter((_,i)=>i%4===0)).size>2,'pas de seuil binaire destructeur');
});
