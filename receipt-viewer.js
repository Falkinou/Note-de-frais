(function(){
  'use strict';
  let active=null;
  function open({image,original}){
    if(active)active.close();
    const before=document.activeElement,dialog=document.createElement('dialog');dialog.className='receipt-viewer';
    dialog.innerHTML='<header><strong>Vérifier le ticket</strong><button type="button" data-action="close" aria-label="Fermer le zoom">Fermer</button></header><div class="viewer-stage" tabindex="0" aria-label="Ticket agrandi, déplacez l’image pour lire"><div class="viewer-paper"><img alt="Ticket agrandi" draggable="false"></div></div><footer><div><button type="button" data-action="out" aria-label="Réduire">−</button><button type="button" data-action="fit">Ajuster</button><button type="button" data-action="actual">100 %</button><button type="button" data-action="in" aria-label="Agrandir">+</button></div><button type="button" data-action="original">Maintenir pour voir l’original</button></footer>';
    document.body.appendChild(dialog);dialog.showModal();active=dialog;
    const stage=dialog.querySelector('.viewer-stage'),paper=dialog.querySelector('.viewer-paper'),bitmap=dialog.querySelector('img'),points=new Map();
    let scale=1,fit=1,gesture=null,baseWidth=0,baseHeight=0,showOriginal=false;
    function setScale(value,anchor){
      if(!baseWidth)return;
      const r=stage.getBoundingClientRect(),p=anchor||{x:r.width/2,y:r.height/2},old=scale;
      scale=Math.max(fit,Math.min(4,value));paper.style.width=Math.max(r.width,baseWidth*scale)+'px';paper.style.height=Math.max(r.height,baseHeight*scale)+'px';
      bitmap.style.width=baseWidth*scale+'px';bitmap.style.height=baseHeight*scale+'px';
      const oldX=Math.max(0,(r.width-baseWidth*old)/2),oldY=Math.max(0,(r.height-baseHeight*old)/2);
      const newX=Math.max(0,(r.width-baseWidth*scale)/2),newY=Math.max(0,(r.height-baseHeight*scale)/2);
      stage.scrollLeft=(stage.scrollLeft+p.x-oldX)*scale/old+newX-p.x;stage.scrollTop=(stage.scrollTop+p.y-oldY)*scale/old+newY-p.y;
      dialog.querySelector('[data-action="actual"]').setAttribute('aria-label','Taille réelle, zoom actuel '+Math.round(scale*100)+' %');
    }
    bitmap.onload=()=>{if(baseWidth)return;baseWidth=bitmap.naturalWidth;baseHeight=bitmap.naturalHeight;fit=Math.min(1,stage.clientWidth/baseWidth,stage.clientHeight/baseHeight);setScale(fit);};
    bitmap.src=image;
    const pair=()=>Array.from(points.values()).slice(0,2),distance=p=>Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y);
    stage.onpointerdown=e=>{
      points.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId);
      gesture=points.size===2?{distance:distance(pair()),scale}:{x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop};
    };
    stage.onpointermove=e=>{
      if(!points.has(e.pointerId)||!gesture)return;e.preventDefault();points.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(points.size===2&&gesture.distance){const p=pair(),r=stage.getBoundingClientRect();setScale(gesture.scale*distance(p)/Math.max(1,gesture.distance),{x:(p[0].x+p[1].x)/2-r.left,y:(p[0].y+p[1].y)/2-r.top});}
      else if(points.size===1&&gesture.left!==undefined){stage.scrollLeft=gesture.left+gesture.x-e.clientX;stage.scrollTop=gesture.top+gesture.y-e.clientY;}
    };
    function finish(e){points.delete(e.pointerId);gesture=null;}
    stage.onpointerup=finish;stage.onpointercancel=finish;stage.onlostpointercapture=finish;
    stage.ondblclick=()=>setScale(scale>fit*1.5?fit:Math.min(1,fit*2.5));
    function compare(value){showOriginal=value;bitmap.src=value?original:image;dialog.querySelector('[data-action="original"]').classList.toggle('comparing',value);}
    dialog.querySelectorAll('[data-action]').forEach(button=>{
      const action=button.dataset.action;
      if(action==='original'){
        button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);compare(true);};
        button.onpointerup=button.onpointercancel=button.onlostpointercapture=()=>{if(showOriginal)compare(false);};
        button.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();compare(true);}};
        button.onkeyup=()=>compare(false);button.onblur=()=>{if(showOriginal)compare(false);};
      }else button.onclick=()=>{if(action==='close')dialog.close();else setScale(action==='fit'?fit:action==='actual'?1:scale*(action==='in'?1.5:1/1.5));};
    });
    dialog.onclose=()=>{dialog.remove();if(active===dialog)active=null;if(before&&before.isConnected)before.focus();};
  }
  window.ReceiptViewer={open,close:()=>{if(active)active.close();}};
})();
