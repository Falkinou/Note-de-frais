(function(){
  'use strict';
  const workerURL=new URL('image-worker.js',document.currentScript.src);
  let worker=null,sequence=0,generation=0;
  const pending=new Map();
  function cancel(){
    generation++;
    if(worker)worker.terminate();worker=null;
    for(const job of pending.values()){clearTimeout(job.timer);job.reject(new Error('Traitement annulé'));}
    pending.clear();
  }
  function getWorker(){
    if(!worker){
      worker=new Worker(workerURL);
      worker.onmessage=function(event){
        const {id,result,error}=event.data,job=pending.get(id);if(!job)return;
        pending.delete(id);clearTimeout(job.timer);
        if(error)job.reject(new Error(error));else job.resolve(result);
      };
      worker.onerror=cancel;
    }
    return worker;
  }
  function run(operation,image,options){
    return new Promise((resolve,reject)=>{
      const active=getWorker(),id=++sequence;
      const timer=setTimeout(cancel,30000);
      pending.set(id,{resolve,reject,timer});
      try { active.postMessage({id,operation,image,...options},[image.data.buffer]); }
      catch(error){pending.delete(id);clearTimeout(timer);reject(error);}
    });
  }
  async function pixels(source,limit=2400){
    const image=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Image illisible'));image.src=source;});
    const ratio=Math.min(1,limit/Math.max(image.width,image.height),Math.sqrt(4000000/(image.width*image.height)));
    const canvas=document.createElement('canvas');canvas.width=Math.max(2,Math.round(image.width*ratio));canvas.height=Math.max(2,Math.round(image.height*ratio));
    const context=canvas.getContext('2d',{willReadFrequently:true});context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
    const result=context.getImageData(0,0,canvas.width,canvas.height);canvas.width=canvas.height=0;
    return {width:result.width,height:result.height,data:result.data};
  }
  function encode(result){
    const canvas=document.createElement('canvas');canvas.width=result.width;canvas.height=result.height;
    canvas.getContext('2d').putImageData(new ImageData(result.data,result.width,result.height),0,0);
    const source=canvas.toDataURL('image/png');canvas.width=canvas.height=0;return source;
  }
  async function process(operation,source,options){
    const requested=generation,image=await pixels(source,operation==='detect'?480:2400);
    if(requested!==generation)throw new Error('Traitement annulé');
    return run(operation,image,options);
  }
  window.ReceiptImage={
    detect:source=>process('detect',source),
    rectify:async(source,points)=>encode(await process('rectify',source,{points})),
    enhance:async(source,mode)=>encode(await process('enhance',source,{mode})),
    cancel
  };
})();
