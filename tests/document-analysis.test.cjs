const {test}=require('node:test'),assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
const {inspect,placement}=require('../document-analysis.js');
function canvas(){const c=createCanvas(400,600),ctx=c.getContext('2d');ctx.fillStyle='#eee';ctx.fillRect(0,0,400,600);return {c,ctx,pixels:()=>ctx.getImageData(0,0,400,600)};}
test('placement dans une zone libre, à distance des caractères même pâles',()=>{
  const {ctx,pixels}=canvas();ctx.fillStyle='#aaa';
  for(let y=20;y<420;y+=20)for(let x=15;x<380;x+=9)ctx.fillRect(x,y,5,9);
  const p=placement(pixels(),{width:.55,height:.12});assert.equal(p.clear,true);assert.ok(p.y>75,p.y);
});
test('ticket chargé : propose une marge au lieu de prétendre avoir trouvé de la place',()=>{
  const {ctx,pixels}=canvas();ctx.fillStyle='#555';for(let y=5;y<600;y+=15)for(let x=5;x<400;x+=10)ctx.fillRect(x,y,5,9);
  const p=placement(pixels(),{width:.55,height:.15});assert.equal(p.clear,false);
});
test('le blanc du papier n’est pas pris pour un reflet et les caractères nets ne sont pas dits flous',()=>{
  const {ctx,pixels}=canvas();ctx.fillStyle='#fff';ctx.fillRect(0,0,400,600);ctx.fillStyle='#333';for(let y=60;y<520;y+=40)ctx.fillRect(40,y,250,3);
  const result=inspect(pixels());assert.ok(!result.warnings.includes('glare'));assert.ok(!result.warnings.includes('blur'));assert.ok(!result.warnings.includes('edges'));
});
test('signale un reflet local et du contenu touchant le bord sans bloquer le ticket',()=>{
  const {ctx,pixels}=canvas();ctx.fillStyle='#999';ctx.fillRect(0,0,400,600);ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(200,220,70,80,0,0,Math.PI*2);ctx.fill();
  assert.ok(inspect(pixels()).warnings.includes('glare'));
  ctx.fillStyle='#111';for(let y=1;y<580;y+=10)ctx.fillRect(0,y,180,4);assert.ok(inspect(pixels()).warnings.includes('edges'));
});
test('un flou optique simulé est signalé alors que le même document net ne l’est pas',()=>{
  const original=canvas();original.ctx.fillStyle='#333';
  for(let y=50;y<550;y+=35)for(let x=30;x<340;x+=12)original.ctx.fillRect(x,y,6,12);
  const soft=canvas();soft.ctx.filter='blur(4px)';soft.ctx.drawImage(original.c,0,0);
  assert.ok(!inspect(original.pixels()).warnings.includes('blur'));assert.ok(inspect(soft.pixels()).warnings.includes('blur'));
});
