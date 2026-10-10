const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function environment(){
  const images=[],workers=[];
  class Image {constructor(){this.width=100;this.height=140;images.push(this);}}
  class Worker {
    constructor(){workers.push(this);this.terminated=false;}
    postMessage(request){this.request=request;}
    terminate(){this.terminated=true;}
  }
  const context={window:{},document:{currentScript:{src:'https://example.test/image-tools.js'},createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},drawImage(){},getImageData:()=>({width:100,height:140,data:new Uint8ClampedArray(100*140*4)})})})},Image,Worker,URL,Uint8ClampedArray,Map,setTimeout,clearTimeout};
  vm.runInNewContext(fs.readFileSync(require.resolve('../image-tools.js'),'utf8'),context);
  return {api:context.window.ReceiptImage,images,workers};
}
const turn=()=>new Promise(resolve=>setImmediate(resolve));
test('annuler pendant le décodage empêche un ancien ticket de relancer un traitement',async()=>{
  const {api,images,workers}=environment(),pending=api.detect('photo-A');
  const rejection=assert.rejects(pending,/annulé/);api.cancel();images[0].onload();await rejection;
  assert.equal(workers.length,0);
});
test('annuler un worker libère le ticket suivant et ignore la réponse tardive',async()=>{
  const {api,images,workers}=environment(),pending=api.detect('photo-A');
  images[0].onload();await turn();const old=workers[0],rejection=assert.rejects(pending,/annulé/);api.cancel();await rejection;
  assert.equal(old.terminated,true);
  const next=api.detect('photo-B');images[1].onload();await turn();
  old.onmessage({data:{id:old.request.id,result:{found:true,stale:true}}});
  const current=workers[1];current.onmessage({data:{id:current.request.id,result:{found:false}}});
  assert.deepEqual(await next,{found:false});api.cancel();
});
test('une erreur de traitement permet de réessayer sans rester bloqué',async()=>{
  const {api,images,workers}=environment(),pending=api.detect('photo-A');
  images[0].onload();await turn();const rejected=assert.rejects(pending,/annulé/);workers[0].onerror();await rejected;
  const next=api.detect('photo-B');images[1].onload();await turn();workers[1].onmessage({data:{id:workers[1].request.id,result:{found:true}}});
  assert.deepEqual(await next,{found:true});api.cancel();
});
