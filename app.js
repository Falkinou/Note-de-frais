(function(){
"use strict";

// SVG Icons (replaces all emoji)
function ic(name,sz){
  sz=sz||16;var s='<svg aria-hidden="true" focusable="false" width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">';
  var paths={
    bolt:'<path d="M13 3l0 7h6l-8 11v-7H5l8-11"/>',
    camera:'<path d="M5 7h1a2 2 0 0 0 2-2 1 1 0 0 1 1-1h6a1 1 0 0 1 1 1 2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2"/><circle cx="12" cy="13" r="3"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    pdf:'<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 15v-1h1.5a1.5 1.5 0 0 1 0 3H9"/><path d="M13 15v3"/>',
    lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    rotate:'<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>',
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    sparkle:'<path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275z"/>',
    home:'<path d="M5 12l-2 0l9-9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/>',
    search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
    check:'<polyline points="20 6 9 17 4 12"/>',
    back:'<path d="M19 12H5M12 19l-7-7 7-7"/>'
  };
  return s+(paths[name]||'')+'</svg>';
}

var SC=[
  {n:"Orange",bg:"rgba(249,115,22,.88)",bd:"#fb923c",tx:"#fff"},
  {n:"Corail",bg:"rgba(244,63,94,.88)",bd:"#fb7185",tx:"#fff"},
  {n:"Ambre",bg:"rgba(245,158,11,.88)",bd:"#fbbf24",tx:"#fff"},
  {n:"Fuchsia",bg:"rgba(217,70,239,.88)",bd:"#e879f9",tx:"#fff"},
  {n:"Noir",bg:"rgba(15,15,20,.92)",bd:"#555",tx:"#fff"}
];
var TC=[
  {n:"Blanc",v:"#ffffff"},{n:"Noir",v:"#111111"},
  {n:"Orange",v:"#fb923c"},{n:"Corail",v:"#fb7185"},
  {n:"Ambre",v:"#fbbf24"},{n:"Fuchsia",v:"#e879f9"},
  {n:"Rouge",v:"#ef4444"},{n:"Vert",v:"#4ade80"}
];
var FONTS=[
  {n:"Helvetica (classique)",f:'"Helvetica Neue",Helvetica,Arial,sans-serif',w:700,w2:600},
  {n:"Helvetica Black",f:'"Helvetica Neue",Helvetica,Arial,sans-serif',w:900,w2:800},
  {n:"Inter (très lisible)",f:'"Inter",sans-serif',w:800,w2:700},
  {n:"Inter Black",f:'"Inter",sans-serif',w:900,w2:800},
  {n:"Roboto Condensé",f:'"Roboto Condensed",sans-serif',w:700,w2:400},
  {n:"Roboto Condensé Black",f:'"Roboto Condensed",sans-serif',w:900,w2:700},
  {n:"Oswald (narrow)",f:'"Oswald",sans-serif',w:700,w2:500},
  {n:"Archivo Black",f:'"Archivo Black",sans-serif',w:400,w2:400},
  {n:"Barlow Condensé",f:'"Barlow Condensed",sans-serif',w:700,w2:600},
  {n:"Barlow Condensé Black",f:'"Barlow Condensed",sans-serif',w:800,w2:700}
];
var DS={address:"Orange SA\n111, Quai du Pr\u00e9sident Roosevelt,\n92130 Issy Les Moulineaux",colorIdx:0,scale:1,showDate:false,shape:"rect",noBg:true,textColor:"#111111",bold:true,vintage:true,rotation:0,fontIdx:3,arcText:false};

var S,scr="home",img=null,imgFull=null,sp={x:60,y:70},tt;
var crop={x1:10,y1:10,x2:90,y2:90},cropDrag=null;
var stampCount=0;
var ndfDate="";
var saveMethod="share";
var imgEnhanced=false;
var imgOriginal=null;
var ticket=null, ticketSequence=0, importSequence=0, exportBusy=false, expressReturnTimer=null;
var stampCache=null, imageWidth=0, imageHeight=0, editorObserver=null;

try{var r=localStorage.getItem("ndf_stamp_v10");S=r?Object.assign({},DS,JSON.parse(r)):Object.assign({},DS)}catch(e){S=Object.assign({},DS)}
try{stampCount=parseInt(localStorage.getItem("ndf_count"))||0}catch(e){}
try{var lp=JSON.parse(localStorage.getItem("ndf_lastpos"));if(lp&&lp.x)sp=lp}catch(e){}
try{var sm=localStorage.getItem("ndf_savemethod");if(sm)saveMethod=sm}catch(e){}
S.address=typeof S.address==="string"?S.address.slice(0,500):DS.address;
S.scale=Math.max(.3,Math.min(2.5,Number(S.scale)||1));
S.rotation=Math.max(-180,Math.min(180,Number(S.rotation)||0));
S.fontIdx=Number.isInteger(S.fontIdx)&&FONTS[S.fontIdx]?S.fontIdx:DS.fontIdx;
S.colorIdx=Number.isInteger(S.colorIdx)&&SC[S.colorIdx]?S.colorIdx:0;
S.shape=S.shape==="circle"?"circle":"rect";
if(!/^#[0-9a-f]{3,8}$/i.test(S.textColor))S.textColor=DS.textColor;
if(!["share","download"].includes(saveMethod))saveMethod="share";
var globalCount=null;
var COUNTER_URL="https://stampcounter.flkn68.workers.dev";

function incCount(){
  stampCount++;try{localStorage.setItem("ndf_count",String(stampCount))}catch(e){}
  fetch(COUNTER_URL+"/hit").then(function(r){return r.json()}).then(function(d){
    if(d&&d.count!=null){globalCount=d.count;var el=document.getElementById("globalCounter");if(el)el.textContent=d.count}
  }).catch(function(){});
}
function initGlobalCount(){
  fetch(COUNTER_URL+"/get").then(function(r){return r.json()}).then(function(d){
    if(d&&d.count!=null){globalCount=d.count;var el=document.getElementById("globalCounter");if(el)el.textContent=d.count}
    else{var el2=document.getElementById("globalCounter");if(el2)el2.textContent="0"}
  }).catch(function(){var el3=document.getElementById("globalCounter");if(el3)el3.textContent="—"});
}
function savePos(){try{localStorage.setItem("ndf_lastpos",JSON.stringify(sp))}catch(e){}}

// Smart stamp positioning: analyze image to find the emptiest zone
function findBestPosition(imgSrc,callback){
  var im2=new Image();
  im2.onload=function(){
    var cv2=document.createElement("canvas"),cx2=cv2.getContext("2d");
    // Downscale for fast analysis
    var ratio=240/Math.max(im2.width,im2.height),aw=Math.max(4,Math.round(im2.width*ratio)),ah=Math.max(4,Math.round(im2.height*ratio));
    cv2.width=aw;cv2.height=ah;
    cx2.drawImage(im2,0,0,aw,ah);
    var id=cx2.getImageData(0,0,aw,ah),d=id.data;

    // Convert to grayscale
    var gray=new Float32Array(aw*ah);
    for(var i=0;i<aw*ah;i++)gray[i]=d[i*4]*0.299+d[i*4+1]*0.587+d[i*4+2]*0.114;

    // Compute variance in blocks (lower variance = emptier area)
    // Measure the whole rotated stamp, including its selected date.
    var geometry=StampRenderer.layout(stampSettings(false),aw,ah);
    var bw=Math.max(2,Math.ceil(geometry.boundWidth)),bh=Math.max(2,Math.ceil(geometry.boundHeight));
    var bestX=50,bestY=75,bestScore=Infinity;
    var stepX=Math.max(2,Math.round(aw/20)),stepY=Math.max(2,Math.round(ah/20));

    for(var by=Math.ceil(bh/2);by<=ah-Math.ceil(bh/2);by+=stepY){
      for(var bx=Math.round(bw/2);bx<aw-Math.round(bw/2);bx+=stepX){
        var sum=0,sum2=0,count=0;
        var x0=bx-Math.round(bw/2),y0=by-Math.round(bh/2);
        for(var yy=y0;yy<y0+bh&&yy<ah;yy++){
          for(var xx=x0;xx<x0+bw&&xx<aw;xx++){
            var v=gray[yy*aw+xx];
            sum+=v;sum2+=v*v;count++;
          }
        }
        if(count<10)continue;
        var mean=sum/count;
        var variance=(sum2/count)-(mean*mean);

        // Bonus: prefer bottom half (more natural), avoid very top
        var yPenalty=by<ah*0.15?500:0;
        var yBonus=by>ah*0.5?-variance*0.1:0;

        var score=variance+yPenalty+yBonus+(255-mean)*3;
        if(score<bestScore){bestScore=score;bestX=(bx/aw)*100;bestY=(by/ah)*100}
      }
    }

    callback({x:Math.round(bestX),y:Math.round(bestY)});
  };
  im2.onerror=function(){callback({x:50,y:75})};
  im2.src=imgSrc;
}

function save(){try{localStorage.setItem("ndf_stamp_v10",JSON.stringify(S))}catch(e){}}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function dateStr(){return Receipt.displayDate(ndfDate)}
function fname(){return Receipt.filename(ndfDate)}
function stampSettings(preview){
  return Object.assign({},S,{date:S.showDate?(dateStr()||(preview?"JJ/MM/AAAA":"")):""});
}
function stampLayer(preview){
  var settings=Object.assign(stampSettings(preview),{scale:1,rotation:0}),font=FONTS[S.fontIdx]||FONTS[0],color=SC[S.colorIdx]||SC[0];
  var key=JSON.stringify([settings,font,color]);
  if(!stampCache||stampCache.key!==key){
    var layer=StampRenderer.create(settings,font,color,73129);
    stampCache={key:key,canvas:layer,url:layer.toDataURL("image/png")};
  }
  return stampCache;
}
async function stampFontReady(){
  if(!document.fonts)return;
  var f=FONTS[S.fontIdx]||FONTS[0];
  try{await Promise.race([Promise.all([400,f.w,f.w2].map(function(weight){return document.fonts.load(weight+" 51px "+f.f)})),new Promise(resolve=>setTimeout(resolve,3000))])}catch(e){}
  stampCache=null;
}
function updateStampOverlay(){
  var image=document.getElementById("ei"),stamp=document.getElementById("sd");
  if(!image||!stamp||!image.naturalWidth||!image.clientWidth)return;
  imageWidth=image.naturalWidth;imageHeight=image.naturalHeight;
  var settings=stampSettings(false),g=StampRenderer.layout(settings,imageWidth,imageHeight);
  sp=StampRenderer.clampPosition(sp,g,imageWidth,imageHeight);
  var ratio=image.clientWidth/imageWidth,layer=stampLayer(false);
  stamp.style.width=(g.width*g.factor*ratio)+"px";
  stamp.style.height=(g.height*g.factor*ratio)+"px";
  stamp.style.left=sp.x+"%";stamp.style.top=sp.y+"%";
  stamp.style.transform="translate(-50%,-50%) rotate("+S.rotation+"deg)";
  var bitmap=stamp.querySelector("img");if(bitmap.src!==layer.url)bitmap.src=layer.url;
}
function loadImage(source){return new Promise(function(resolve,reject){
  var image=new Image();image.onload=function(){resolve(image)};image.onerror=function(){reject(new Error("Image illisible ou format non pris en charge"))};image.src=source;
})}
function updateDateUI(){
  if(!ticket)return;
  ndfDate=ticket.date;
  var input=document.getElementById("ndfDateIn");
  if(input&&document.activeElement!==input)input.value=ndfDate;
  var status=document.getElementById("dateStatus"),choices=document.getElementById("dateChoices");
  var messages={uncertain:"Date peu lisible : confirmez la proposition ou saisissez-la.",reading:"Lecture de la date sur le ticket…",found:"Date lue sur le ticket · à vérifier",ambiguous:"Plusieurs dates trouvées : choisissez celle du ticket.",missing:"Aucune date trouvée. Saisissez la date du ticket.",error:"Lecture indisponible. Saisissez la date ou réessayez."};
  if(status)status.textContent=ticket.dateSource==="manual"?"Date renseignée manuellement":messages[ticket.ocrStatus]||"";
  if(choices){
    choices.replaceChildren();
    if(ticket.dateSource!=="manual"&&(ticket.ocrStatus==="ambiguous"||ticket.ocrStatus==="uncertain"))ticket.candidates.forEach(function(candidate){
      var button=document.createElement("button");button.type="button";button.className="sec-btn date-choice";
      button.textContent=Receipt.displayDate(candidate.iso);button.title=candidate.evidence;
      button.onclick=function(){window._setDate(candidate.iso);updateDateUI()};choices.appendChild(button);
    });
    if(ticket.dateSource!=="manual"&&ticket.ocrStatus==="found"&&ticket.candidates[0]){
      var evidence=document.createElement("small");evidence.textContent=ticket.candidates[0].evidence;choices.appendChild(evidence);
    }
  }
  var retry=document.getElementById("retryDate");if(retry)retry.hidden=ticket.ocrStatus==="reading";
  var name=document.getElementById("exportFilename");if(name)name.textContent=fname();
  updateStampOverlay();
}
async function readTicketDate(current){
  var revision=current.ocrRevision=(current.ocrRevision||0)+1;
  current.ocrStatus="reading";updateDateUI();
  try{
    var result=await ReceiptOCR.recognize(current.source);
    if(ticket!==current||current.cancelled||current.ocrRevision!==revision)return;
    current.applyOCR(result);
  }catch(error){if(ticket!==current||current.cancelled||current.ocrRevision!==revision)return;current.applyOCR({status:"error",candidates:[]})}
  updateDateUI();
}
window._retryDate=function(){if(!ticket)return;ReceiptOCR.cancel();readTicketDate(ticket)};
function toast(m){clearTimeout(tt);var t=document.getElementById("toast");t.textContent=m;t.style.display="block";tt=setTimeout(function(){t.style.display="none"},2400)}

// ── STAMP HTML ──
function shtml(){
  return '<img class="stamp-preview-bitmap" alt="Aperçu du tampon" src="'+stampLayer(true).url+'" style="display:block;width:'+Math.min(340,280*S.scale)+'px;max-width:100%;height:auto">';
}

function togHTML(fn,on,label){return '<button type="button" class="tog '+(on?"on":"off")+'" role="switch" aria-checked="'+on+'" aria-label="'+esc(label)+'" onclick="'+fn+'"><span class="dot"></span></button>'}

function render(){
  if(editorObserver){editorObserver.disconnect();editorObserver=null}
  var el=document.getElementById("app");
  if(scr==="home")renderHome(el);
  else if(scr==="stamp")renderStamp(el);
  else if(scr==="crop")renderCrop(el);
  else if(scr==="edit")renderEdit(el);
  if(scr==="edit"||scr==="crop")updateDateUI();
}

// ── HOME ──
function renderHome(el){
  var fl=esc(S.address.split("\n")[0]);
  var fl2=S.address.split("\n").length>1?esc(S.address.split("\n").slice(1).map(function(line){return line.trim().replace(/,+$/,"")}).join(", ")):"";
  var h='<div class="scr" style="padding-bottom:40px">';

  // Header: Stampfel centered
  h+='<div style="padding:32px 24px 24px;padding-top:max(32px,calc(env(safe-area-inset-top,20px) + 24px));text-align:center">';
  h+='<div style="font-family:\'Darker Grotesque\',sans-serif;font-size:60px;font-weight:900;letter-spacing:-.04em;line-height:.75"><span style="color:#fff">Stamp</span><span style="color:#fb923c">fel</span></div>';
  h+='</div>';

  // Stamp preview card — floating glass
  h+='<div style="padding:0 20px;animation:fadeUp .5s ease .05s both">';
  h+='<button type="button" class="glass stamp-home-card" onclick="window._go(\'stamp\')" aria-label="Configurer mon tampon">';
  h+='<div style="display:flex;align-items:center;gap:16px">';
  h+='<div style="background:rgba(255,255,255,.92);border-radius:14px;padding:12px 14px;flex:1;min-width:0;overflow-wrap:anywhere">';
  h+='<div style="font-family:\'Instrument Sans\',sans-serif;font-size:11px;font-weight:700;color:#111;text-align:center;line-height:1.5">'+fl+'</div>';
  if(fl2)h+='<div style="font-family:\'Instrument Sans\',sans-serif;font-size:9px;font-weight:500;color:#555;text-align:center;line-height:1.4;margin-top:1px">'+fl2+'</div>';
  h+='</div>';
  h+='<div style="flex:0 0 102px;min-width:0">';
  h+='<div style="font-family:\'Instrument Sans\',sans-serif;font-size:16px;font-weight:700;color:#fff">Mon Tampon</div>';
  h+='<div style="font-family:\'Instrument Sans\',sans-serif;font-size:12px;color:rgba(255,255,255,.85);margin-top:3px">Configurer →</div>';
  h+='</div></div></button>';

  // Save preference — compact inline
  h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:0 24px;margin-bottom:16px;animation:fadeUp .5s ease .1s both">';
  h+='<span style="font-family:\'Instrument Sans\',sans-serif;font-size:12px;color:rgba(255,255,255,.75)">Sauvegarde</span>';
  h+='<div style="display:flex;gap:2px">';
  h+='<button type="button" class="save-method" onclick="window._setSaveMethod(\'share\')" style="cursor:pointer;font-family:\'Instrument Sans\',sans-serif;font-size:11px;padding:5px 12px;border-radius:8px;'+(saveMethod==="share"?"background:rgba(251,146,60,.1);color:rgba(251,146,60,.9);font-weight:600":"color:rgba(255,255,255,.85)")+'">'+ic("share",12)+' Partager</button>';
  h+='<button type="button" class="save-method" onclick="window._setSaveMethod(\'download\')" style="cursor:pointer;font-family:\'Instrument Sans\',sans-serif;font-size:11px;padding:5px 12px;border-radius:8px;'+(saveMethod==="download"?"background:rgba(251,146,60,.1);color:rgba(251,146,60,.9);font-weight:600":"color:rgba(255,255,255,.85)")+'">'+ic("download",12)+' Direct</button>';
  h+='</div></div>';

  // Action buttons
  h+='<div style="padding:0 20px;display:flex;flex-direction:column;gap:10px;animation:fadeUp .5s ease .15s both">';
  h+='<button class="primary-btn" onclick="window._express()">'+ic('bolt',18)+' Mode Rapide</button>';
  h+='<button class="glass-btn" onclick="window._showComplet()">'+ic('camera',18)+' Mode Complet</button>';
  h+='<div id="completChoice" style="display:none;animation:fadeUp .3s ease">';
  h+='<div style="display:flex;gap:8px;margin-top:2px">';
  h+='<button class="sec-btn" onclick="window._cam()" style="flex:1;padding:14px;font-size:13px">'+ic('camera',14)+' Photo</button>';
  h+='<button class="sec-btn" onclick="window._gal()" style="flex:1;padding:14px;font-size:13px">'+ic('image',14)+' Importer</button>';
  h+='</div></div>';
  h+='</div></div>';

  // Counters — minimal, centered
  h+='<div style="margin-top:28px;display:flex;justify-content:center;gap:24px;animation:fadeUp .5s ease .25s both">';
  if(stampCount>0){
    h+='<div style="text-align:center"><div style="font-family:monospace;font-size:22px;font-weight:700;color:rgba(251,146,60,.7)">'+stampCount+'</div><div style="font-size:10px;color:rgba(255,255,255,.95);margin-top:2px">perso</div></div>';
    h+='<div style="width:1px;height:30px;background:rgba(255,255,255,.06)"></div>';
  }
  h+='<div style="text-align:center"><div id="globalCounter" style="font-family:monospace;font-size:22px;font-weight:700;color:rgba(255,255,255,.95)">'+(globalCount==null?"...":globalCount)+'</div><div style="font-size:10px;color:rgba(255,255,255,.95);margin-top:2px">communauté</div></div>';
  h+='</div>';

  // Privacy — single line
  h+='<div style="margin-top:28px;text-align:center;font-family:\'Instrument Sans\',sans-serif;font-size:10px;color:rgba(255,255,255,.85);animation:fadeUp .5s ease .3s both">'+ic('lock',12)+' Photos et lecture de date traitées sur votre appareil</div>';

  // Copyright
  h+='<div style="margin-top:12px;text-align:center"><p style="font-size:9px;color:rgba(255,255,255,.85);letter-spacing:.02em">© '+new Date().getFullYear()+' Lo\u00efc Arnold · v1.7.0</p></div>';

  h+='<div class="blob1"></div><div class="blob2"></div>';
  el.innerHTML=h;
  initGlobalCount();
}

// ── STAMP CONFIG ──
function renderStamp(el){
  var h='<div class="hdr"><span class="htitle">Mon Tampon</span>';
  h+='<button class="glass-btn" style="width:auto;padding:8px 18px;font-size:13px;gap:6px" onclick="window._savestamp()">✓ Sauvegarder</button></div>';
  h+='<div class="scr" style="padding:20px;display:flex;flex-direction:column;gap:20px;padding-bottom:40px">';
  var prevBg="background:#f4f2eb;border-radius:16px;padding:16px;max-width:100%;";
  h+='<div id="stampPreview" style="display:flex;justify-content:center;padding:24px 0;animation:fadeUp .4s ease"><div style="'+prevBg+'">'+shtml(false)+'</div></div>';
  h+='<div class="glass" style="padding:16px"><label class="lbl" for="addr">Adresse</label>';
  h+='<textarea id="addr" rows="4" maxlength="500" oninput="window._addr(this.value)">'+esc(S.address)+'</textarea></div>';
  h+='<div class="glass" style="padding:16px"><div class="lbl">Forme</div><div style="display:flex;gap:10px">';
  h+='<button class="shape-btn '+(S.shape==="rect"?"active":"")+'" onclick="window._shape(\'rect\')">▬ Rectangle</button>';
  h+='<button class="shape-btn '+(S.shape==="circle"?"active":"")+'" onclick="window._shape(\'circle\')">● Cercle</button>';
  h+='</div>';
  if(S.shape==="circle"){h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px"><div><div style="font-size:13px;font-weight:600;color:#fff">⭕ Texte en arc de cercle</div><div style="font-size:11px;color:rgba(255,255,255,.75)">Texte qui suit la courbure</div></div>'+togHTML("window._tarc()",S.arcText,"Texte en arc de cercle")+'</div>'}
  h+='</div>';
  h+='<div class="glass" style="padding:16px"><div class="lbl">Couleur du fond</div><div style="display:flex;gap:12px;flex-wrap:wrap">';
  for(var i=0;i<SC.length;i++){var act=i===S.colorIdx;var shd=act?"0 0 20px "+SC[i].bd+",0 2px 10px rgba(0,0,0,.3)":"0 2px 10px rgba(0,0,0,.3)";
    h+='<button type="button" aria-label="Fond '+SC[i].n+'" aria-pressed="'+act+'" class="cdot" style="width:34px;height:34px;background:'+SC[i].bg+";border-color:"+(act?"#fff":"transparent")+";transform:scale("+(act?1.15:1)+");box-shadow:"+shd+";opacity:"+(S.noBg?0.35:1)+'" onclick="window._ci('+i+')"></button>';}
  h+='</div></div>';
  h+='<div class="glass" style="padding:16px"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:14px;font-weight:600;color:#fff">Fond transparent</div><div style="font-size:12px;color:rgba(255,255,255,.75)">Texte seul</div></div>'+togHTML("window._tnobg()",S.noBg,"Fond transparent")+'</div></div>';
  h+='<div class="glass" style="padding:16px"><div class="lbl">Couleur du texte</div><div style="display:flex;gap:10px;flex-wrap:wrap">';
  for(var j=0;j<TC.length;j++){var ta=S.textColor===TC[j].v;var tsb=ta?"0 0 16px rgba(249,115,22,.5),0 2px 8px rgba(0,0,0,.3)":(TC[j].v==="#111111"?"inset 0 0 0 1px rgba(255,255,255,.15),0 2px 8px rgba(0,0,0,.3)":"0 2px 8px rgba(0,0,0,.3)");
    h+='<button type="button" aria-label="Texte '+TC[j].n+'" aria-pressed="'+ta+'" class="cdot" style="width:30px;height:30px;background:'+TC[j].v+";border-color:"+(ta?"#fb923c":"transparent")+";transform:scale("+(ta?1.15:1)+");box-shadow:"+tsb+'" onclick="window._tc(\''+TC[j].v+'\')" title="'+TC[j].n+'"></button>';}
  h+='</div></div>';
  // Font picker
  h+='<div class="glass" style="padding:16px"><div class="lbl">🔤 Police</div>';
  h+='<div style="display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto;padding:4px 0">';
  for(var fi=0;fi<FONTS.length;fi++){
    var isAct=fi===(S.fontIdx||0);
    h+='<button type="button" aria-pressed="'+isAct+'" onclick="window._setFont('+fi+')" style="cursor:pointer;padding:10px 12px;border-radius:10px;border:1.5px solid '+(isAct?"#fb923c":"rgba(255,255,255,.08)")+";background:"+(isAct?"rgba(249,115,22,.12)":"rgba(255,255,255,.03)")+';display:flex;align-items:center;justify-content:space-between;transition:all .2s">';
    h+='<span style="font-family:'+esc(FONTS[fi].f)+";font-weight:"+FONTS[fi].w+';font-size:13px;color:#fff">'+FONTS[fi].n+'</span>';
    if(isAct)h+='<span style="color:#fb923c;font-size:14px">✓</span>';
    h+='</button>';
  }
  h+='</div></div>';
  // Bold toggle
  h+='<div class="glass" style="padding:16px"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:14px;font-weight:600;color:#fff;display:flex;align-items:center;gap:8px"><span style="font-weight:800;font-size:18px;font-family:\'Space Grotesk\',sans-serif">B</span> Texte en gras</div><div style="font-size:12px;color:rgba(255,255,255,.85)">'+(S.bold?"Police épaisse":"Police fine")+'</div></div>'+togHTML("window._tbold()",S.bold,"Texte en gras")+'</div></div>';
  h+='<div class="glass" style="padding:16px"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:14px;font-weight:600;color:#fff">🏚️ Effet usé / vintage</div><div style="font-size:12px;color:rgba(255,255,255,.85)">'+(S.vintage?"Tampon vieilli":"Tampon net")+'</div></div>'+togHTML("window._tvint()",S.vintage,"Effet usé ou vintage")+'</div></div>';
  h+='<div class="glass" style="padding:16px"><div class="lbl">Taille</div><div style="display:flex;align-items:center;gap:12px"><span style="font-size:16px;opacity:.5">A</span><input aria-label="Taille du tampon" type="range" min="0.6" max="1.6" step="0.05" value="'+S.scale+'" oninput="window._sc(this.value)" style="flex:1"><span style="font-size:26px;font-weight:700">A</span></div></div>';
  h+='<div class="glass" style="padding:16px"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:14px;font-weight:600;color:#fff">Afficher la date</div><div style="font-size:12px;color:rgba(255,255,255,.75)">'+(dateStr()||'Date lue ou saisie sur le ticket')+'</div></div>'+togHTML("window._tdate()",S.showDate,"Afficher la date du ticket")+'</div></div>';
  h+='</div>';
  el.innerHTML=h;
  stampFontReady().then(function(){if(scr==='stamp')updateConfigPreview()});
}

// ── CROP ──
function renderCrop(el){
  var h='<div class="hdr">';
  h+='<span class="htitle">Recadrer</span>';
  h+='</div>';
  h+='<div class="crop-stage">';
  h+='<div id="cropBox">';
  h+='<img id="cropImg" alt="Ticket à recadrer" src="'+imgFull+'" draggable="false">';
  h+='<div id="cropOverlay" style="position:absolute;inset:0;touch-action:none"></div>';
  h+='</div>';
  h+='</div>';

  // Fixed bottom bar - always visible
  h+='<div style="padding:10px 16px 24px;border-top:1px solid rgba(255,255,255,.06);background:rgba(17,10,4,.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);flex-shrink:0">';
  h+='<p style="font-size:11px;color:rgba(255,255,255,.95);text-align:center;margin-bottom:8px">Déplacez les poignées pour recadrer</p><p id="dateStatus" role="status" aria-live="polite" style="text-align:center;margin-bottom:8px"></p>';
  h+='<div style="display:flex;gap:8px;margin-bottom:8px">';
  h+='<button class="sec-btn" aria-label="Retour à l’accueil" onclick="window._go(\'home\')" style="flex:0 0 44px;width:44px;padding:12px 0;font-size:14px">←</button>';
  h+='<button class="sec-btn" onclick="window._autoCrop()" style="flex:1;padding:12px 8px;font-size:12px">'+ic('search',14)+' Auto</button>';
  h+='<button class="sec-btn" onclick="window._rotate90()" style="flex:1;padding:12px 8px;font-size:13px">'+ic('rotate',14)+' 90°</button>';
  h+='<button class="primary-btn" onclick="window._applyCrop()" style="flex:1;padding:12px 8px;font-size:14px">Valider ✓</button>';
  h+='</div>';
  h+='<button class="sec-btn" onclick="window._skipCrop()" style="padding:10px;font-size:12px;opacity:.7">Passer le recadrage →</button>';
  h+='</div>';

  el.innerHTML=h;
  setupCrop();
}

function setupCrop(){
  var box=document.getElementById("cropBox"),ov=document.getElementById("cropOverlay");
  if(!box||!ov)return;
  drawCropUI();

  function getPos(e){
    var rect=box.getBoundingClientRect();
    var cx=e.clientX;
    var cy=e.clientY;
    return{x:Math.max(0,Math.min(100,((cx-rect.left)/rect.width)*100)),y:Math.max(0,Math.min(100,((cy-rect.top)/rect.height)*100))}
  }

  ov.addEventListener("pointerdown",function(e){
    var t=e.target;if(!t.dataset||!t.dataset.corner)return;
    e.preventDefault();e.stopPropagation();
    cropDrag=t.dataset.corner;
    ov.setPointerCapture(e.pointerId);
  });
  ov.addEventListener("pointermove",function(e){
    if(!cropDrag)return;
    e.preventDefault();
    var p=getPos(e);
    moveCrop(cropDrag,p.x,p.y);
  });
  ov.addEventListener("keydown",function(e){
    var corner=e.target.dataset.corner,delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(!corner||!delta)return;e.preventDefault();
    var step=e.shiftKey?5:1;
    moveCrop(corner,crop[corner[1]==='l'?'x1':'x2']+delta[0]*step,crop[corner[0]==='t'?'y1':'y2']+delta[1]*step);
  });
  ov.addEventListener("pointerup",function(){cropDrag=null});
  ov.addEventListener("pointercancel",function(){cropDrag=null});
}

function moveCrop(corner,x,y){
  x=Math.max(0,Math.min(100,x));y=Math.max(0,Math.min(100,y));
  if(corner[1]==='l')crop.x1=Math.min(x,crop.x2-8);else crop.x2=Math.max(x,crop.x1+8);
  if(corner[0]==='t')crop.y1=Math.min(y,crop.y2-8);else crop.y2=Math.max(y,crop.y1+8);
  drawCropUI();
}

function drawCropUI(){
  var ov=document.getElementById("cropOverlay");if(!ov)return;
  var focused=document.activeElement&&document.activeElement.dataset.corner;
  var x1=crop.x1,y1=crop.y1,x2=crop.x2,y2=crop.y2;
  var h='';
  // Dim regions
  h+='<div class="crop-dim" style="top:0;left:0;right:0;height:'+y1+'%"></div>';
  h+='<div class="crop-dim" style="bottom:0;left:0;right:0;height:'+(100-y2)+'%"></div>';
  h+='<div class="crop-dim" style="top:'+y1+'%;left:0;width:'+x1+'%;height:'+(y2-y1)+'%"></div>';
  h+='<div class="crop-dim" style="top:'+y1+'%;right:0;width:'+(100-x2)+'%;height:'+(y2-y1)+'%"></div>';
  // Border
  h+='<div style="position:absolute;left:'+x1+'%;top:'+y1+'%;width:'+(x2-x1)+'%;height:'+(y2-y1)+'%;border:2px solid rgba(249,115,22,.8);pointer-events:none;border-radius:4px"></div>';
  // Handles
  h+='<button type="button" aria-label="Recadrage : coin supérieur gauche, flèches pour déplacer" class="crop-handle" data-corner="tl" style="left:'+x1+'%;top:'+y1+'%"></button>';
  h+='<button type="button" aria-label="Recadrage : coin supérieur droit, flèches pour déplacer" class="crop-handle" data-corner="tr" style="left:'+x2+'%;top:'+y1+'%"></button>';
  h+='<button type="button" aria-label="Recadrage : coin inférieur gauche, flèches pour déplacer" class="crop-handle" data-corner="bl" style="left:'+x1+'%;top:'+y2+'%"></button>';
  h+='<button type="button" aria-label="Recadrage : coin inférieur droit, flèches pour déplacer" class="crop-handle" data-corner="br" style="left:'+x2+'%;top:'+y2+'%"></button>';
  ov.innerHTML=h;
  if(focused){var handle=ov.querySelector('[data-corner="'+focused+'"]');if(handle)handle.focus({preventScroll:true})}
}

function finishCrop(current,source){
  if(ticket!==current||current.cancelled)return;
  current.replaceImage(source);img=source;imgOriginal=null;imgEnhanced=false;
  var revision=current.revision;
  findBestPosition(img,function(pos){
    if(ticket!==current||current.cancelled||revision!==current.revision)return;
    sp=pos;S.rotation=0;scr='edit';render();toast('Placement proposé · ajustez si nécessaire');
  });
}
window._applyCrop=async function(){
  var current=ticket,selection=Object.assign({},crop),source=imgFull;
  if(!current||current.cancelled)return;
  try{
    var image=await loadImage(source);if(ticket!==current||current.cancelled||imgFull!==source||scr!=='crop')return;
    var x=Math.round(image.width*selection.x1/100),y=Math.round(image.height*selection.y1/100);
    var width=Math.max(1,Math.round(image.width*(selection.x2-selection.x1)/100)),height=Math.max(1,Math.round(image.height*(selection.y2-selection.y1)/100));
    var canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    canvas.getContext('2d').drawImage(image,x,y,width,height,0,0,width,height);
    finishCrop(current,canvas.toDataURL('image/png'));
  }catch(error){toast('Recadrage impossible. Réessayez.')}
};
window._skipCrop=function(){finishCrop(ticket,imgFull)};

// Auto-detect ticket borders and set crop handles
window._autoCrop=function(){
  var current=ticket,source=imgFull;if(!current||current.cancelled)return;
  toast("Détection en cours...");
  var im=new Image();
  im.onload=function(){
    if(ticket!==current||current.cancelled||imgFull!==source)return;
    var cv2=document.createElement("canvas"),cx=cv2.getContext("2d");
    var aw=Math.min(im.width,300),ah=Math.round(aw*im.height/im.width);
    cv2.width=aw;cv2.height=ah;
    cx.drawImage(im,0,0,aw,ah);
    var id=cx.getImageData(0,0,aw,ah),d=id.data;
    // Convert to grayscale and find edges via Sobel-like gradient
    var gray=new Float32Array(aw*ah);
    for(var i=0;i<aw*ah;i++)gray[i]=d[i*4]*0.299+d[i*4+1]*0.587+d[i*4+2]*0.114;
    // Find edges using gradient magnitude
    var edges=new Float32Array(aw*ah);
    for(var y=1;y<ah-1;y++){
      for(var x=1;x<aw-1;x++){
        var gx=gray[(y-1)*aw+x+1]-gray[(y-1)*aw+x-1]+2*(gray[y*aw+x+1]-gray[y*aw+x-1])+gray[(y+1)*aw+x+1]-gray[(y+1)*aw+x-1];
        var gy=gray[(y+1)*aw+x-1]-gray[(y-1)*aw+x-1]+2*(gray[(y+1)*aw+x]-gray[(y-1)*aw+x])+gray[(y+1)*aw+x+1]-gray[(y-1)*aw+x+1];
        edges[y*aw+x]=Math.sqrt(gx*gx+gy*gy);
      }
    }
    // Find bounding box of strong edges (ticket area)
    var thresh=40,minX=aw,maxX=0,minY=ah,maxY=0,found=false;
    for(var y2=2;y2<ah-2;y2++){
      for(var x2=2;x2<aw-2;x2++){
        if(edges[y2*aw+x2]>thresh){
          if(x2<minX)minX=x2;if(x2>maxX)maxX=x2;
          if(y2<minY)minY=y2;if(y2>maxY)maxY=y2;
          found=true;
        }
      }
    }
    if(found&&(maxX-minX)>aw*0.15&&(maxY-minY)>ah*0.15){
      // Add small margin
      var mx=aw*0.02,my=ah*0.02;
      crop.x1=Math.max(0,((minX-mx)/aw)*100);
      crop.y1=Math.max(0,((minY-my)/ah)*100);
      crop.x2=Math.min(100,((maxX+mx)/aw)*100);
      crop.y2=Math.min(100,((maxY+my)/ah)*100);
      drawCropUI();
      toast("Recadrage proposé · vérifiez les bords");
    }else{
      toast("Détection impossible — ajustez manuellement");
    }
  };
  im.src=imgFull;
};

// ── EDIT ──
function renderEdit(el){
  el.innerHTML='<div class="hdr"><button class="glass-btn compact" onclick="window._go(\'home\')">← Accueil</button><span class="htitle">Positionner</span></div>'+
    '<div class="scr editor-content"><div class="glass image-panel"><div id="ic"><img id="ei" alt="Ticket à tamponner" src="'+img+'" draggable="false"><button type="button" id="sd" aria-label="Déplacer le tampon avec les flèches du clavier" onkeydown="window._moveStamp(event)"><img alt="" draggable="false"></button></div></div>'+
    '<p class="pinch-hint">Glissez le tampon · Pincez pour ajuster</p>'+
    '<div class="glass edit-field"><label for="rotSlider">Rotation</label><div class="rotation-controls"><input id="rotSlider" type="range" min="-180" max="180" value="'+S.rotation+'" oninput="window._rot(this.value)" aria-label="Rotation du tampon"><input id="rotNum" type="number" min="-180" max="180" value="'+Math.round(S.rotation)+'" oninput="window._rot(this.value)" aria-label="Rotation en degrés"><span>°</span></div></div>'+
    '<div class="glass edit-field date-panel"><label for="ndfDateIn">Date du ticket</label><input id="ndfDateIn" type="date" value="'+ndfDate+'" oninput="window._setDate(this.value)" aria-describedby="dateStatus"><p id="dateStatus" role="status" aria-live="polite"></p><div id="dateChoices"></div><button id="retryDate" class="date-retry" onclick="window._retryDate()" type="button">Relire la date</button></div>'+
    '<button id="enhBtn" class="sec-btn" aria-pressed="'+imgEnhanced+'" onclick="window._toggleEnhance()">'+ic('sparkle',14)+(imgEnhanced?' Revenir à l’image originale':' Améliorer le ticket')+'</button></div>'+
    '<div class="export-bar"><p id="exportFilename"></p>'+
    (expressMode?'<button id="dlb" class="primary-btn" onclick="window._expressSave()">'+ic('bolt',16)+' Sauvegarder express</button><button class="sec-btn" onclick="window._normalMode()">Passer en mode normal</button>':'<button id="dlb" class="primary-btn" onclick="window._gen()">'+ic('save',16)+' Sauvegarder l’image</button><button id="dlbpdf" class="sec-btn" onclick="window._genPDF()">'+ic('pdf',16)+' Exporter en PDF</button>')+'</div>';
  setupDragAndPinch();
  stampFontReady().then(function(){if(scr==='edit')updateStampOverlay()});
}

function setupDragAndPinch(){
  var container=document.getElementById('ic'),stamp=document.getElementById('sd'),image=document.getElementById('ei');
  var points=new Map(),gesture=null,offset=null;
  image.onload=updateStampOverlay;if(image.complete)updateStampOverlay();
  function two(){return Array.from(points.values()).slice(0,2)}
  function distance(p){return Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y)}
  function angle(p){return Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180/Math.PI}
  container.onpointerdown=function(e){
    if(!stamp.contains(e.target)&&points.size===0){points.set(e.pointerId,{x:e.clientX,y:e.clientY});container.setPointerCapture(e.pointerId);return}
    e.preventDefault();points.set(e.pointerId,{x:e.clientX,y:e.clientY});container.setPointerCapture(e.pointerId);
    if(points.size===2){var pair=two();gesture={distance:distance(pair),angle:angle(pair),scale:S.scale,rotation:S.rotation};offset=null}
    else{var rect=container.getBoundingClientRect();offset={x:e.clientX-rect.left-rect.width*sp.x/100,y:e.clientY-rect.top-rect.height*sp.y/100}}
  };
  container.onpointermove=function(e){
    if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(points.size===2&&gesture){var pair=two();S.scale=Math.max(.3,Math.min(2.5,gesture.scale*distance(pair)/Math.max(1,gesture.distance)));S.rotation=((gesture.rotation+angle(pair)-gesture.angle+540)%360)-180;updateRotationInputs()}
    else if(offset&&points.size===1){var rect=container.getBoundingClientRect();sp={x:(e.clientX-rect.left-offset.x)/rect.width*100,y:(e.clientY-rect.top-offset.y)/rect.height*100}}
    updateStampOverlay();
  };
  function finish(e){points.delete(e.pointerId);gesture=null;offset=null;save();savePos()}
  container.onpointerup=finish;container.onpointercancel=finish;container.onlostpointercapture=finish;
  if(window.ResizeObserver){editorObserver=new ResizeObserver(updateStampOverlay);editorObserver.observe(image)}
}
function updateRotationInputs(){
  var slider=document.getElementById('rotSlider'),number=document.getElementById('rotNum');
  if(slider)slider.value=S.rotation;if(number&&document.activeElement!==number)number.value=Math.round(S.rotation);
}

// ── FILE ──
var MAX_PX=2400;
async function resizeImage(source){
  var image=await loadImage(source),ratio=Math.min(1,MAX_PX/Math.max(image.width,image.height));
  var canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
  var context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',.94);
}
function beginTicket(source,express){
  clearTimeout(expressReturnTimer);if(ticket)ticket.cancel();ReceiptOCR.cancel();
  ticket=new Receipt.Session(++ticketSequence,source,express);var current=ticket;
  img=imgFull=source;imgOriginal=null;imgEnhanced=false;ndfDate='';expressMode=express;S.rotation=0;exportBusy=false;
  crop={x1:5,y1:5,x2:95,y2:95};sp={x:50,y:75};stampCache=null;
  scr=express?'edit':'crop';render();readTicketDate(current);
  if(express){var revision=current.revision;findBestPosition(source,function(position){if(ticket!==current||current.cancelled||current.revision!==revision||scr!=='edit')return;sp=position;updateStampOverlay()})}
}
function fileInput(capture,express){
  var input=document.createElement('input');input.type='file';input.accept='image/*';if(capture)input.setAttribute('capture','environment');
  input.style.display='none';document.body.appendChild(input);
  input.addEventListener('cancel',function(){input.remove()},{once:true});
  input.addEventListener('change',async function(){
    var file=input.files&&input.files[0];input.remove();if(!file)return;
    var request=++importSequence,source=URL.createObjectURL(file);toast('Ouverture du ticket…');
    try{var resized=await resizeImage(source);if(request===importSequence)beginTicket(resized,!!express)}
    catch(error){if(request===importSequence)toast(error.message)}
    finally{URL.revokeObjectURL(source)}
  },{once:true});
  input.click();
}

// The preview and every export use the same deterministic stamp bitmap.
function drawStampOnCanvas(canvas,context,width,height){
  var geometry=StampRenderer.layout(stampSettings(false),width,height);
  var position=StampRenderer.clampPosition(sp,geometry,width,height);
  StampRenderer.composite(context,stampLayer(false).canvas,geometry,position,width,height);
}

function createPDF(canvas){
    var cv=canvas,jpgData=cv.toDataURL("image/jpeg",0.92),jpgRaw=atob(jpgData.split(",")[1]),jpgLen=jpgRaw.length,jpgBytes=new Uint8Array(jpgLen);
    for(var j=0;j<jpgLen;j++)jpgBytes[j]=jpgRaw.charCodeAt(j);
    // PDF size proportional to image (72 DPI, max 595pt wide)
    var iw=cv.width,ih=cv.height;
    var maxW=595.28;
    var scale2=Math.min(maxW/iw,1);
    var pw=iw*scale2,ph=ih*scale2;
    var dw=pw,dh=ph;
    var ox=0,oy=0;

    var o=[];
    function addObj(s){o.push(s);return o.length}
    addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
    addObj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
    addObj("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+pw.toFixed(2)+" "+ph.toFixed(2)+"] /Contents 4 0 R /Resources << /XObject << /Img 5 0 R >> >> >>\nendobj");
    addObj("4 0 obj\n<< /Length "+(("q "+dw.toFixed(2)+" 0 0 "+dh.toFixed(2)+" "+ox.toFixed(2)+" "+oy.toFixed(2)+" cm /Img Do Q").length)+" >>\nstream\nq "+dw.toFixed(2)+" 0 0 "+dh.toFixed(2)+" "+ox.toFixed(2)+" "+oy.toFixed(2)+" cm /Img Do Q\nendstream\nendobj");
    addObj("5 0 obj\n<< /Type /XObject /Subtype /Image /Width "+iw+" /Height "+ih+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpgLen+" >>\nstream\n");

    // Build PDF bytes
    var header="%PDF-1.4\n";
    var parts=[header];
    var offsets=[];
    for(var p=0;p<o.length;p++){
      var pos=0;for(var q=0;q<parts.length;q++)pos+=(typeof parts[q]==="string")?parts[q].length:parts[q].length;
      offsets.push(pos);
      parts.push(o[p]);
      if(p===4){parts.push(jpgBytes);parts.push("\nendstream\nendobj\n")}else{parts.push("\n")}
    }
    var xrefPos=0;for(var q2=0;q2<parts.length;q2++)xrefPos+=(typeof parts[q2]==="string")?parts[q2].length:parts[q2].length;
    var xref="xref\n0 "+(o.length+1)+"\n0000000000 65535 f \n";
    for(var r2=0;r2<offsets.length;r2++){var os2=String(offsets[r2]);while(os2.length<10)os2="0"+os2;xref+=os2+" 00000 n \n"}
    xref+="trailer\n<< /Size "+(o.length+1)+" /Root 1 0 R >>\nstartxref\n"+xrefPos+"\n%%EOF";
    parts.push(xref);

    // Combine all parts into one Uint8Array
    var totalLen=0;for(var t=0;t<parts.length;t++)totalLen+=(typeof parts[t]==="string")?parts[t].length:parts[t].length;
    var pdfBuf=new Uint8Array(totalLen);
    var off=0;
    for(var t2=0;t2<parts.length;t2++){
      if(typeof parts[t2]==="string"){for(var c2=0;c2<parts[t2].length;c2++){pdfBuf[off++]=parts[t2].charCodeAt(c2)}}
      else{pdfBuf.set(parts[t2],off);off+=parts[t2].length}
    }

    return new Blob([pdfBuf],{type:"application/pdf"});
}
var expressMode=false;
function setExportBusy(busy){
  exportBusy=busy;document.querySelectorAll('#app button,#app input').forEach(function(el){el.disabled=busy});
}
function downloadBlob(blob,name){
  var url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url)},10000);
}
async function saveBlob(blob,name){
  var result=await ExportFile.deliver(blob,name,saveMethod,{navigator:navigator,File:File,download:downloadBlob});
  return result==='cancelled'?null:result==='shared'?'Partagé ✓':'Téléchargement lancé ✓';
}
function postSaveActions(){
  var bar=document.querySelector('.export-bar');if(!bar||document.getElementById('postSaveWrap'))return;
  var wrap=document.createElement('div');wrap.id='postSaveWrap';wrap.innerHTML='<button class="sec-btn" onclick="window._go(\'home\')">Accueil</button><button class="primary-btn" onclick="window._cam()">Nouvelle photo</button>';bar.appendChild(wrap);
}
async function exportDocument(format,express){
  if(exportBusy||!ticket||!img)return;
  if(ticket.ocrStatus==="reading"&&ticket.dateSource!=="manual"){toast('Lecture en cours. Attendez ou saisissez la date.');document.getElementById('ndfDateIn').focus();return}
  if(!Receipt.validDate(ticket.date)){toast('Vérifiez la date du ticket avant de sauvegarder');document.getElementById('ndfDateIn').focus();return}
  var current=ticket,source=img,name=Receipt.filename(ticket.date,format);
  setExportBusy(true);
  try{
    await stampFontReady();if(ticket!==current||current.cancelled)return;
    updateStampOverlay();
    var image=await loadImage(source);if(ticket!==current||current.cancelled)return;
    var canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    var context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0);
    drawStampOnCanvas(canvas,context,image.width,image.height);
    var blob=format==='pdf'?createPDF(canvas):await new Promise(function(resolve,reject){canvas.toBlob(function(value){if(value)resolve(value);else reject(new Error('Export impossible'))},'image/png')});
    var result=await saveBlob(blob,name);
    if(!result){toast('Partage annulé');return}
    incCount();if(navigator.vibrate)navigator.vibrate([20,50,20]);showSuccess();toast(result);
    if(express){expressReturnTimer=setTimeout(function(){if(ticket===current&&scr==='edit'){expressMode=false;scr='home';render()}},1600)}
    else postSaveActions();
  }catch(error){toast('Sauvegarde impossible. Réessayez.');console.error('Export:',error)}
  finally{setExportBusy(false)}
}
window._gen=function(){return exportDocument('png',false)};
window._genPDF=function(){return exportDocument('pdf',false)};
window._express=function(){fileInput(true,true)};
window._expressSave=function(){return exportDocument('png',true)};
window._normalMode=function(){expressMode=false;if(ticket)ticket.express=false;render()};

// ── GLOBALS ──
window._go=function(s){
  clearTimeout(expressReturnTimer);
  if(s==='home'){importSequence++;if(ticket)ticket.cancel();ReceiptOCR.cancel();expressMode=false;}
  scr=s;render();
};
window._cam=function(){fileInput(true)};
window._gal=function(){fileInput(false)};
window._showComplet=function(){
  var el=document.getElementById("completChoice");
  if(el)el.style.display=el.style.display==="none"?"block":"none";
};
window._setSaveMethod=function(m){saveMethod=m;try{localStorage.setItem("ndf_savemethod",m)}catch(e){}render()};

// Toggle image enhancement (contrast + brightness + sharpness)
window._toggleEnhance=async function(){
  var current=ticket;if(!current||current.cancelled)return;
  if(imgEnhanced){img=current.original;current.image=img;current.enhanced=false;current.revision++;imgEnhanced=false;render();toast('Image originale restaurée');return}
  var source=img,revision=++current.revision;
  toast('Amélioration…');
  try{
    var image=await loadImage(source);if(ticket!==current||current.cancelled||revision!==current.revision)return;
    var canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    var context=canvas.getContext('2d');context.filter='contrast(1.25) brightness(1.08) saturate(1.05)';context.drawImage(image,0,0);context.filter='none';
    var pixels=context.getImageData(0,0,image.width,image.height),data=pixels.data,original=new Uint8ClampedArray(data),w=image.width,h=image.height;
    for(var y=1;y<h-1;y++)for(var x=1;x<w-1;x++)for(var channel=0;channel<3;channel++){
      var index=(y*w+x)*4+channel,blur=(original[index-w*4]+original[index+w*4]+original[index-4]+original[index+4])/4;
      data[index]=Math.min(255,Math.max(0,original[index]+.4*(original[index]-blur)));
    }
    context.putImageData(pixels,0,0);current.original=source;imgOriginal=source;
    img=canvas.toDataURL('image/jpeg',.94);current.image=img;current.enhanced=true;imgEnhanced=true;render();toast('Image améliorée ✓');
  }catch(error){toast('Amélioration impossible. Image conservée.')}
};
window._savestamp=function(){toast("Tampon sauvegardé ✓");scr="home";render()};
function updateConfigPreview(){var preview=document.getElementById('stampPreview');if(preview)preview.innerHTML='<div class="stamp-config-paper">'+shtml(false)+'</div>'}
window._addr=function(v){S.address=v.slice(0,500);save();updateConfigPreview()};
window._shape=function(v){S.shape=v;save();render()};
window._ci=function(i){S.colorIdx=i;save();render()};
window._tnobg=function(){S.noBg=!S.noBg;save();render()};
window._tc=function(v){S.textColor=v;save();render()};
window._tbold=function(){S.bold=!S.bold;save();render()};
window._setFont=function(i){S.fontIdx=i;save();render()};
window._tarc=function(){S.arcText=!S.arcText;save();render()};
window._tvint=function(){S.vintage=!S.vintage;save();render()};
window._sc=function(v){S.scale=Math.max(.3,Math.min(2.5,parseFloat(v)||1));save();updateConfigPreview()};
window._tdate=function(){S.showDate=!S.showDate;save();render()};
window._rot=function(v){S.rotation=Math.max(-180,Math.min(180,Number(v)||0));save();updateRotationInputs();updateStampOverlay()};
window._moveStamp=function(event){var delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!delta)return;event.preventDefault();sp.x+=delta[0]*(event.shiftKey?5:1);sp.y+=delta[1]*(event.shiftKey?5:1);updateStampOverlay();savePos()};
window._setDate=function(v){if(!ticket)return;ticket.setDate(v);ndfDate=ticket.date;updateDateUI()};
window._rotate90=async function(){
  var current=ticket,source=imgFull;if(!current||current.cancelled)return;
  try{
    var image=await loadImage(source);if(ticket!==current||current.cancelled||imgFull!==source)return;
    var canvas=document.createElement('canvas');canvas.width=image.height;canvas.height=image.width;
    var context=canvas.getContext('2d');context.translate(image.height,0);context.rotate(Math.PI/2);context.drawImage(image,0,0);
    // Rotation changes framing only. Keep reading the original photo so that a
    // quarter-turn cannot replace a correctly read date with a sideways OCR result.
    imgFull=canvas.toDataURL('image/png');current.replaceImage(imgFull);img=imgFull;imgEnhanced=false;imgOriginal=null;
    crop={x1:5,y1:5,x2:95,y2:95};scr='crop';render();toast('Rotation 90° ✓');
  }catch(error){toast('Rotation impossible. Image conservée.')}
};

// ── SUCCESS ANIMATION ──
function showSuccess(){
  var ov=document.createElement("div");
  ov.style.cssText="position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fadeIn .3s ease";
  ov.innerHTML='<div style="text-align:center;animation:popIn .5s cubic-bezier(.17,.67,.21,1.27)"><div style="font-size:80px;margin-bottom:16px">✅</div><div style="font-size:20px;font-weight:700;color:#fff">Tamponné !</div></div>';
  document.body.appendChild(ov);
  setTimeout(function(){ov.style.opacity="0";ov.style.transition="opacity .3s";setTimeout(function(){document.body.removeChild(ov)},300)},1200);
}

// A real same-origin service worker can cache the app and the local OCR engine.
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(function(error){console.warn('Mode hors ligne indisponible:',error)});
}
if(document.fonts)document.fonts.addEventListener('loadingdone',function(){stampCache=null;updateConfigPreview();updateStampOverlay()});

render();
})();
