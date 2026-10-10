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
    back:'<path d="M19 12H5M12 19l-7-7 7-7"/>',
    edit:'<path d="M16 3l5 5L8 21H3v-5L16 3z"/><path d="M14 5l5 5"/>',
    import:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-7M9 14l3-3 3 3"/>'
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
var crop=ReceiptPixels.fullFrame(),cropDrag=null,cropRevision=0,cropEntry=null,photoBusy=false,photoSequence=0;
var ndfDate="";
var ticket=null, ticketSequence=0, importSequence=0, exportBusy=false;
var pdfImport=null, pdfPage=1, pdfPreviewSequence=0, pendingAppReload=false;
var stampCache=null, imageWidth=0, imageHeight=0, editorObserver=null;
var localStore=ReceiptLocal.create({indexedDB:window.indexedDB}),resumeEnabled=false,resumable=null,draftTimer=null,marginTimer=null;
var draftNoticeShown=false;

try{var r=localStorage.getItem("ndf_stamp_v10");S=r?Object.assign({},DS,JSON.parse(r)):Object.assign({},DS)}catch(e){S=Object.assign({},DS)}
try{var lp=JSON.parse(localStorage.getItem("ndf_lastpos"));if(lp&&lp.x)sp=lp}catch(e){}
S.address=typeof S.address==="string"?S.address.slice(0,500):DS.address;
S.scale=Math.max(.3,Math.min(2.5,Number(S.scale)||1));
S.rotation=Math.max(-180,Math.min(180,Number(S.rotation)||0));
S.fontIdx=Number.isInteger(S.fontIdx)&&FONTS[S.fontIdx]?S.fontIdx:DS.fontIdx;
S.colorIdx=Number.isInteger(S.colorIdx)&&SC[S.colorIdx]?S.colorIdx:0;
S.shape=S.shape==="circle"?"circle":"rect";
if(!/^#[0-9a-f]{3,8}$/i.test(S.textColor))S.textColor=DS.textColor;
function randomHex(bytes){return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(function(value){return value.toString(16).padStart(2,'0')}).join('')}
function eventId(){var hex=randomHex(16);return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20)}
var counters=StampfelCounters.create({
  storage:{getItem:function(key){return localStorage.getItem(key)},setItem:function(key,value){localStorage.setItem(key,value)}},
  fetch:window.fetch.bind(window),randomId:eventId,randomDevice:function(){return randomHex(32)},
  locks:navigator.locks,
  url:location.hostname==='falkinou.github.io'?'https://stampfel.mycloudapi.fr/api/counters':'/api/counters',
  onChange:updateCounters
});
function updateCounters(values){
  var personal=document.getElementById('personalCounter'),community=document.getElementById('globalCounter');
  if(personal)personal.textContent=values.personal.toLocaleString('fr-FR');
  if(community)community.textContent=values.community===null?'—':values.community.toLocaleString('fr-FR');
}
function incCount(current){
  if(current.counted)return;
  current.counted=true;
  void counters.record(current.counterEvent);
}
window.addEventListener('online',function(){void counters.sync()});
window.addEventListener('storage',function(event){if(event.key===StampfelCounters.KEY)counters.refresh()});
function savePos(){try{localStorage.setItem("ndf_lastpos",JSON.stringify(sp))}catch(e){}queueDraft()}

// Placement follows glyph edges, with a margin offered when no blank zone fits.
async function proposePlacement(current){
  var source=img,revision=current.revision;
  try{
    var bitmap=await loadImage(source),g=StampRenderer.layout(stampSettings(false),bitmap.width,bitmap.height);
    var result=await ReceiptImage.placement(source,{width:g.boundWidth/bitmap.width,height:g.boundHeight/bitmap.height});
    if(ticket!==current||current.cancelled||revision!==current.revision||img!==source)return;
    current.needsMargin=!result.clear;
    if(!current.placementTouched&&!current.margin){sp={x:result.x,y:result.y};updateStampOverlay()}
    updatePhotoHints();queueDraft();
  }catch(error){/* Manual placement remains available. */}
}
async function inspectPhoto(current,source){
  var revision=current.qualityRevision=(current.qualityRevision||0)+1;
  try{
    var result=await ReceiptImage.inspect(source);
    if(ticket!==current||current.cancelled||revision!==current.qualityRevision)return;
    current.quality=result.warnings;updatePhotoHints();
  }catch(error){/* A quality hint must never prevent processing a ticket. */}
}
function updatePhotoHints(){
  var node=document.getElementById('photoHints');if(!node||!ticket)return;
  var warnings=ticket.quality||[],label=ticket.needsMargin&&!ticket.margin?'Peu de place pour le tampon':warnings.length?'Photo à vérifier':'';
  node.hidden=!label;node.textContent=label+' · Voir';
}

function save(){try{localStorage.setItem("ndf_stamp_v10",JSON.stringify(S))}catch(e){}}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function dateStr(){return Receipt.displayDate(ndfDate,ticket&&!ticket.cancelled?ticket.meal:"")}
function fname(format){var key=ndfDate+"|"+(ticket?ticket.meal:"");return Receipt.filename(ndfDate,format||"png",ticket?ticket.meal:"",ticket&&ticket.fileNumbers&&ticket.fileNumbers[key]||"")}
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
  var image=document.getElementById("ei"),stamp=document.getElementById("sd"),container=document.getElementById('ic'),panel=document.querySelector('.image-panel');
  if(!image||!stamp||!image.naturalWidth||!panel)return;
  var fit=Math.min(panel.clientWidth/image.naturalWidth,panel.clientHeight/image.naturalHeight);
  if(!Number.isFinite(fit)||fit<=0)return;
  container.style.width=image.naturalWidth*fit+'px';container.style.height=image.naturalHeight*fit+'px';
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
  var meal=document.getElementById('mealSelect');if(meal)meal.value=ticket.meal;
  var times=ticket.times.filter(function(time){return !time.date||time.date===ticket.date});
  if(status&&ticket.ocrStatus==='found'&&ticket.dateSource!=='manual')status.textContent='Date lue · à vérifier';
  if(status&&ticket.mealSource==='manual')status.textContent+=' · Repas corrigé';
  else if(status&&times.length&&ticket.timeStatus==='found')status.textContent+=' · '+times.map(function(t){return t.time}).join(', ');
  else if(status&&ticket.timeStatus==='ambiguous')status.textContent='Heures différentes · choisissez midi ou soir';
  var name=document.getElementById("exportFilename");if(name)name.textContent=fname();
  updateStampOverlay();queueDraft();queueMarginRefresh();
}
function needsReading(current){return !current.date&&current.dateSource!=='manual'||!current.times.length&&current.mealSource!=='manual'}
async function readTicketDate(current){
  var revision=current.ocrRevision=(current.ocrRevision||0)+1;
  current.ocrStatus="reading";updateDateUI();
  try{
    var result=current.pdfText?Receipt.extractDetails(current.pdfText):null;
    if(!result||result.status==='missing')result=await ReceiptOCR.recognize(current.processed||current.image);
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
  else if(scr==="pdf")renderPDFPicker(el);
  if(scr==="edit"||scr==="crop")updateDateUI();
  updatePhotoHints();
}

// ── HOME ──
function renderHome(el){
  if(pendingAppReload){location.reload();return}
  var title=S.address.split("\n")[0]||'Votre tampon';
  el.innerHTML='<main class="scr home">'+
    '<header class="home-brand"><h1>Stamp<span>fel</span></h1><span class="brand-rule" aria-hidden="true"></span></header>'+
    '<button type="button" class="home-stamp" onclick="window._go(\'stamp\')" aria-label="Modifier mon tampon : '+esc(title)+'">'+
      '<span class="home-stamp-paper"><img src="'+stampLayer(true).url+'" alt="" draggable="false"></span>'+
      '<span class="home-stamp-label"><span>Mon tampon</span><strong>'+esc(title)+'</strong></span>'+
      '<span class="home-stamp-edit">'+ic('edit',18)+'<span>Modifier</span></span></button>'+
    '<section class="home-actions" aria-labelledby="newTicketTitle"><h2 id="newTicketTitle">Nouveau ticket</h2>'+
      '<button type="button" class="primary-btn home-photo" onclick="window._cam()">'+ic('camera',22)+'Photographier un ticket</button>'+
      '<button type="button" class="home-import" onclick="window._gal()" aria-label="Importer une image ou un PDF">'+ic('import',22)+'Importer</button></section>'+
    '<dl class="home-stats" aria-label="Tickets traités"><div><dd id="personalCounter">—</dd><dt>personnel</dt></div><div><dd id="globalCounter">—</dd><dt>communauté</dt></div></dl>'+
    '<div id="resumeCard" class="resume-card" '+(resumable?'':'hidden')+'><button type="button" onclick="window._resumeDraft()">Reprendre le ticket</button><button type="button" onclick="window._discardDraft()" aria-label="Effacer le ticket en attente">Effacer</button></div>'+
    '<button type="button" class="home-options" onclick="window._options()">Options</button>'+
    '</main>';
  updateCounters(counters.snapshot());
  void counters.sync();
  stampFontReady().then(function(){if(scr==='home'){var preview=document.querySelector('.home-stamp-paper img');if(preview)preview.src=stampLayer(true).url}});
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
  el.innerHTML='<div class="hdr"><button class="glass-btn compact" onclick="window._cancelCrop()" aria-label="'+(cropEntry?'Revenir au ticket':'Retour à l’accueil')+'">← Retour</button><span class="htitle">Recadrer</span></div>'+
    '<div class="crop-stage"><div id="cropBox"><img id="cropImg" alt="Ticket à recadrer" src="'+imgFull+'" draggable="false"><div id="cropOverlay"></div></div><canvas id="cropLoupe" width="220" height="220" aria-hidden="true" hidden></canvas></div>'+
    '<div class="crop-bar"><button id="photoHints" class="crop-quality" onclick="window._adjust()" hidden></button><p id="cropStatus" role="status">Placez les quatre coins sur le ticket</p><div class="crop-actions">'+
    '<button id="autoCrop" class="sec-btn" onclick="window._autoCrop()">'+ic('search',16)+' Auto</button>'+
    '<button id="rotatePhoto" class="sec-btn" onclick="window._rotate90()">'+ic('rotate',16)+' 90°</button>'+
    '<button id="resetCrop" class="sec-btn" onclick="window._resetCrop()">Tout garder</button></div>'+
    '<button id="applyCrop" class="primary-btn" onclick="window._applyCrop()">Redresser et continuer</button>'+
    '<button id="skipCrop" class="crop-skip" onclick="window._skipCrop()">Passer le recadrage →</button></div>';
  setupCrop();
}
function setupCrop(){
  var box=document.getElementById('cropBox'),overlay=document.getElementById('cropOverlay');
  var names=['supérieur gauche','supérieur droit','inférieur droit','inférieur gauche'];
  overlay.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path id="cropShade" fill="rgba(0,0,0,.6)" fill-rule="evenodd"></path><polygon id="cropPolygon" fill="transparent" stroke="#edb28b" stroke-width="2" vector-effect="non-scaling-stroke"></polygon></svg>'+names.map(function(name,i){return '<button type="button" class="crop-handle" data-corner="'+i+'" aria-label="Recadrage : coin '+name+', flèches pour déplacer"><span></span></button>'}).join('');
  drawCropUI();
  var cropImage=document.getElementById('cropImg'),stage=document.querySelector('.crop-stage');
  function fitCrop(){if(!cropImage.naturalWidth)return;var ratio=Math.min((stage.clientWidth-48)/cropImage.naturalWidth,(stage.clientHeight-48)/cropImage.naturalHeight);cropImage.style.width=Math.max(1,cropImage.naturalWidth*ratio)+'px';cropImage.style.height=Math.max(1,cropImage.naturalHeight*ratio)+'px'}
  cropImage.onload=fitCrop;if(cropImage.complete)fitCrop();if(window.ResizeObserver){editorObserver=new ResizeObserver(fitCrop);editorObserver.observe(stage)}
  function position(e){var rect=box.getBoundingClientRect();return {x:Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100)),y:Math.max(0,Math.min(100,(e.clientY-rect.top)/rect.height*100))}}
  overlay.addEventListener('pointerdown',function(e){
    var handle=e.target.closest('[data-corner]');if(!handle||photoBusy||cropDrag)return;
    e.preventDefault();cropRevision++;
    var corner=Number(handle.dataset.corner),pointer=position(e);
    cropDrag={corner:corner,pointer:e.pointerId,offset:{x:crop[corner].x-pointer.x,y:crop[corner].y-pointer.y}};
    overlay.setPointerCapture(e.pointerId);handle.classList.add('dragging');drawCropLoupe(corner);
  });
  overlay.addEventListener('pointermove',function(e){
    if(!cropDrag||e.pointerId!==cropDrag.pointer)return;e.preventDefault();
    var p=position(e);moveCrop(cropDrag.corner,p.x+cropDrag.offset.x,p.y+cropDrag.offset.y);drawCropLoupe(cropDrag.corner);
  });
  function finish(e){
    if(!cropDrag||e.pointerId!==cropDrag.pointer)return;
    cropDrag=null;overlay.querySelectorAll('.dragging').forEach(function(handle){handle.classList.remove('dragging')});
    var loupe=document.getElementById('cropLoupe');if(loupe)loupe.hidden=true;
  }
  overlay.addEventListener('pointerup',finish);overlay.addEventListener('pointercancel',finish);overlay.addEventListener('lostpointercapture',finish);
  overlay.addEventListener('keydown',function(e){
    var value=e.target.dataset.corner,delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(value===undefined||!delta||photoBusy)return;e.preventDefault();var corner=Number(value),step=e.shiftKey?3:.5;
    moveCrop(corner,crop[corner].x+delta[0]*step,crop[corner].y+delta[1]*step);
  });
}
function moveCrop(corner,x,y){
  var next=crop.map(function(p){return {x:p.x,y:p.y}});next[corner]={x:Math.max(0,Math.min(100,x)),y:Math.max(0,Math.min(100,y))};
  if(!ReceiptPixels.validQuad(next))return;
  crop=next;cropRevision++;drawCropUI();queueDraft();
  var status=document.getElementById('cropStatus');if(status)status.textContent='Coins ajustés · perspective corrigée à la validation';
}
function drawCropUI(){
  var overlay=document.getElementById('cropOverlay');if(!overlay)return;
  var path=crop.map(function(p){return p.x+','+p.y}).join(' ');
  overlay.querySelector('#cropPolygon').setAttribute('points',path);
  overlay.querySelector('#cropShade').setAttribute('d','M0 0H100V100H0Z M'+crop.map(function(p){return p.x+' '+p.y}).join('L')+'Z');
  overlay.querySelectorAll('[data-corner]').forEach(function(handle){var p=crop[Number(handle.dataset.corner)];handle.style.left=p.x+'%';handle.style.top=p.y+'%'});
}
function drawCropLoupe(corner){
  var canvas=document.getElementById('cropLoupe'),image=document.getElementById('cropImg');if(!canvas||!image||!image.naturalWidth)return;
  var point=crop[corner],sample=image.naturalWidth/Math.max(1,image.clientWidth)*44,context=canvas.getContext('2d');
  canvas.hidden=false;canvas.style.left=point.x>50?'12px':'auto';canvas.style.right=point.x>50?'auto':'12px';
  context.fillStyle='#13120f';context.fillRect(0,0,220,220);context.imageSmoothingEnabled=true;
  context.drawImage(image,point.x/100*image.naturalWidth-sample/2,point.y/100*image.naturalHeight-sample/2,sample,sample,0,0,220,220);
  context.strokeStyle='#bd8057';context.lineWidth=2;context.beginPath();context.moveTo(94,110);context.lineTo(126,110);context.moveTo(110,94);context.lineTo(110,126);context.stroke();
}
function setPhotoBusy(value){
  photoBusy=value;
  document.querySelectorAll('#applyCrop,#autoCrop,#rotatePhoto,#resetCrop,#skipCrop,#recrop,#imageModes button,#dlb,#dlbpdf,.crop-handle').forEach(function(control){control.disabled=value});
  var status=document.getElementById('photoStatus');if(status){status.textContent=value?'Traitement de l’image…':'';status.hidden=!value}
}
function finishCrop(current,source,selection){
  if(ticket!==current||current.cancelled||scr!=='crop')return;
  current.replaceImage(source);current.cropPoints=selection.map(function(p){return {x:p.x,y:p.y}});current.imageMode='original';current.enhancementCache={};
  img=source;cropEntry=null;cropDrag=null;setPhotoBusy(false);
  current.placementTouched=false;S.rotation=0;
  scr='edit';render();
  current.processed=source;current.margin=false;current.marginHeight=0;proposePlacement(current);inspectPhoto(current,source);queueDraft();
  if(needsReading(current)){ReceiptOCR.cancel();readTicketDate(current)}
}
window._applyCrop=async function(){
  var current=ticket,selection=crop.map(function(p){return {x:p.x,y:p.y}}),source=imgFull;
  if(photoBusy||!current||current.cancelled)return;
  cropRevision++;var operation=++photoSequence;setPhotoBusy(true);
  try{
    var result=await ReceiptImage.rectify(source,selection);
    if(ticket!==current||current.cancelled||imgFull!==source||scr!=='crop'||operation!==photoSequence)return;
    finishCrop(current,result,selection);
  }catch(error){if(ticket===current&&!current.cancelled&&scr==='crop'&&operation===photoSequence)toast('Recadrage impossible. Ajustez les coins et réessayez.')}
  finally{if(ticket===current&&operation===photoSequence)setPhotoBusy(false)}
};
window._skipCrop=function(){if(!photoBusy){cropRevision++;finishCrop(ticket,imgFull,ReceiptPixels.fullFrame())}};
window._resetCrop=function(){if(photoBusy)return;crop=ReceiptPixels.fullFrame();cropRevision++;drawCropUI();queueDraft();var status=document.getElementById('cropStatus');if(status)status.textContent='Image entière conservée'};
window._recrop=function(){
  if(photoBusy||!ticket||ticket.pdf)return;
  cropEntry={source:imgFull,points:crop};crop=(ticket.cropPoints||ReceiptPixels.fullFrame()).map(function(p){return {x:p.x,y:p.y}});cropRevision++;scr='crop';render();
};
window._cancelCrop=function(){
  cropRevision++;photoSequence++;ReceiptImage.cancel();setPhotoBusy(false);cropDrag=null;
  if(cropEntry){imgFull=cropEntry.source;crop=cropEntry.points;cropEntry=null;scr='edit';render()}
  else window._go('home');
};
window._autoCrop=async function(silent){
  var current=ticket,source=imgFull,revision=++cropRevision;
  if(photoBusy||!current||current.cancelled||scr!=='crop')return;
  var button=document.getElementById('autoCrop'),status=document.getElementById('cropStatus');
  if(button)button.disabled=true;if(status)status.textContent='Recherche des bords…';
  try{
    var result=await ReceiptImage.detect(source);
    if(ticket!==current||current.cancelled||imgFull!==source||scr!=='crop'||revision!==cropRevision)return;
    if(result.found){crop=result.points;drawCropUI();queueDraft();status.textContent='Bords proposés · vérifiez les quatre coins'}
    else status.textContent='Bords peu nets · placez les coins à la main';
  }catch(error){if(ticket===current&&!current.cancelled&&revision===cropRevision&&scr==='crop')status.textContent='Placez les quatre coins sur le ticket'}
  finally{if(ticket===current&&scr==='crop'&&!photoBusy){var active=document.getElementById('autoCrop');if(active)active.disabled=false}}
};

// ── EDIT ──
function renderEdit(el){
  var photoTools=ticket.pdf?'<span class="pdf-kept">PDF · page '+ticket.pdf.page+' sur '+ticket.pdf.pages+'</span>':'<button id="recrop" class="photo-recrop" onclick="window._recrop()">Recadrer</button><div id="imageModes" class="image-modes" role="group" aria-label="Rendu de la photo">'+[['original','Original'],['readable','Lisible'],['mono','N&B']].map(function(mode){return '<button type="button" data-mode="'+mode[0]+'" aria-pressed="'+(ticket.imageMode===mode[0])+'" onclick="window._imageMode(\''+mode[0]+'\')">'+mode[1]+'</button>'}).join('')+'</div>';
  el.innerHTML='<div class="hdr editor-header"><button class="glass-btn compact" onclick="window._go(\'home\')">← Accueil</button><span class="htitle">Positionner</span><button class="header-zoom" onclick="window._zoom()" aria-label="Agrandir le ticket">'+ic('search',18)+'</button></div>'+
    '<div class="editor-content"><div class="glass image-panel"><div id="ic"><img id="ei" alt="Ticket à tamponner, touchez pour agrandir" src="'+img+'" draggable="false"><button type="button" id="sd" aria-label="Déplacer le tampon avec les flèches du clavier" onkeydown="window._moveStamp(event)"><img alt="" draggable="false"></button></div><button id="photoHints" class="photo-hint" onclick="window._adjust()" hidden></button></div>'+
    '<div class="photo-tools">'+photoTools+'</div><p id="photoStatus" role="status" hidden></p>'+
    '<div class="stamp-actions"><span>Glissez · Pincez le tampon</span><button type="button" onclick="window._adjust()">Ajuster '+ic('edit',13)+'</button></div>'+
    '<div class="date-panel"><div class="date-labels"><label for="ndfDateIn">Date du ticket</label><label for="mealSelect">Repas</label></div><div class="date-fields"><input id="ndfDateIn" type="date" value="'+ndfDate+'" oninput="window._setDate(this.value)" aria-describedby="dateStatus"><select id="mealSelect" aria-label="Repas" onchange="window._setMeal(this.value)"><option value="">—</option><option value="midi">Midi</option><option value="soir">Soir</option></select></div><div class="date-reading"><p id="dateStatus" role="status" aria-live="polite"></p><button type="button" onclick="window._dateDetails()" aria-label="Vérifier la lecture de la date et de l’heure">'+ic('search',15)+'</button></div></div>'+
    '</div><div class="export-bar compact-export"><p id="exportFilename"></p><div class="export-buttons">'+
    '<button id="dlb" class="sec-btn" onclick="window._gen()">'+ic('image',16)+' Image</button><button id="dlbpdf" class="primary-btn" onclick="window._genPDF()">'+ic('pdf',16)+' '+(ticket.pdf?'PDF complet':'PDF')+'</button></div></div>';
  setupDragAndPinch();
  stampFontReady().then(function(){if(scr==='edit')updateStampOverlay()});
}

function setupDragAndPinch(){
  var container=document.getElementById('ic'),stamp=document.getElementById('sd'),image=document.getElementById('ei');
  var points=new Map(),gesture=null,offset=null,backgroundTap=null;
  image.onload=updateStampOverlay;if(image.complete)updateStampOverlay();
  function two(){return Array.from(points.values()).slice(0,2)}
  function distance(p){return Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y)}
  function angle(p){return Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180/Math.PI}
  container.onpointerdown=function(e){
    if(photoBusy||exportBusy)return;
    if(!stamp.contains(e.target)&&points.size===0){backgroundTap={x:e.clientX,y:e.clientY,time:Date.now()};points.set(e.pointerId,{x:e.clientX,y:e.clientY});container.setPointerCapture(e.pointerId);return}
    backgroundTap=null;if(ticket)ticket.placementTouched=true;
    e.preventDefault();points.set(e.pointerId,{x:e.clientX,y:e.clientY});container.setPointerCapture(e.pointerId);
    if(points.size===2){var pair=two();gesture={distance:distance(pair),angle:angle(pair),scale:S.scale,rotation:S.rotation};offset=null}
    else{var rect=container.getBoundingClientRect();offset={x:e.clientX-rect.left-rect.width*sp.x/100,y:e.clientY-rect.top-rect.height*sp.y/100}}
  };
  container.onpointermove=function(e){
    if(!points.has(e.pointerId))return;if(backgroundTap&&Math.hypot(e.clientX-backgroundTap.x,e.clientY-backgroundTap.y)>8)backgroundTap=null;points.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(points.size===2&&gesture){var pair=two();S.scale=Math.max(.3,Math.min(2.5,gesture.scale*distance(pair)/Math.max(1,gesture.distance)));S.rotation=((gesture.rotation+angle(pair)-gesture.angle+540)%360)-180;updateRotationInputs()}
    else if(offset&&points.size===1){var rect=container.getBoundingClientRect();sp={x:(e.clientX-rect.left-offset.x)/rect.width*100,y:(e.clientY-rect.top-offset.y)/rect.height*100}}
    updateStampOverlay();
  };
  function finish(e){var zoom=e.type==='pointerup'&&backgroundTap&&points.size===1&&Date.now()-backgroundTap.time<500;points.delete(e.pointerId);gesture=null;offset=null;backgroundTap=null;save();savePos();queueMarginRefresh();if(zoom)window._zoom()}
  container.onpointerup=finish;container.onpointercancel=finish;container.onlostpointercapture=finish;
  if(window.ResizeObserver){editorObserver=new ResizeObserver(updateStampOverlay);editorObserver.observe(document.querySelector('.image-panel'))}
}
function updateRotationInputs(){
  var slider=document.getElementById('rotSlider'),number=document.getElementById('rotNum');
  if(slider)slider.value=S.rotation;if(number&&document.activeElement!==number)number.value=Math.round(S.rotation);
}

// ── FILE ──
var MAX_PX=2400;
async function resizeImage(source){
  var image=await loadImage(source),ratio=Math.min(1,MAX_PX/Math.max(image.width,image.height),Math.sqrt(4000000/(image.width*image.height)));
  var canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
  var context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',.94);
}
function beginTicket(source,metadata){
  if(ticket)ticket.cancel();ReceiptOCR.cancel();ReceiptImage.cancel();
  ticket=new Receipt.Session(++ticketSequence,source);var current=ticket;
  current.counterEvent=eventId();current.counted=false;
  clearTimeout(draftTimer);void localStore.clearDraft().catch(function(){});resumable=null;
  current.pdfText=metadata&&metadata.text||'';current.pdfPage=metadata&&metadata.page||0;current.pdf=metadata&&metadata.pdf||null;
  img=imgFull=source;ndfDate='';S.rotation=0;exportBusy=false;photoBusy=false;
  current.imageMode='original';current.enhancementCache={};current.processed=source;current.margin=false;current.marginHeight=0;
  crop=ReceiptPixels.fullFrame();cropEntry=null;cropDrag=null;cropRevision++;photoSequence++;sp={x:50,y:75};stampCache=null;
  scr=current.pdf?'edit':'crop';render();readTicketDate(current);
  if(current.pdf)proposePlacement(current);else{window._autoCrop(true);inspectPhoto(current,source)}
  queueDraft();
}
function closePDFImport(){
  pdfPreviewSequence++;
  var previous=pdfImport;pdfImport=null;
  if(previous)void previous.document.destroy().catch(function(){});
}
function renderPDFPicker(el){
  if(!pdfImport){scr='home';render();return}
  var current=pdfImport,sequence=++pdfPreviewSequence,page=pdfPage;
  el.innerHTML='<div class="hdr"><button class="glass-btn compact" onclick="window._go(\'home\')">← Retour</button><span class="htitle">Choisir une page</span></div>'+
    '<div class="scr pdf-picker"><p class="pdf-name">'+esc(current.name)+'</p><div class="pdf-preview"><p id="pdfLoading" role="status">Ouverture de la page…</p><img id="pdfPreview" alt="Aperçu de la page '+page+'" hidden></div></div>'+
    '<div class="export-bar"><div class="pdf-navigation"><button type="button" class="glass-btn compact" onclick="window._pdfPage('+Math.max(1,page-1)+')" aria-label="Page précédente" '+(page===1?'disabled':'')+'>←</button>'+
    '<label for="pdfPageNumber">Page <input id="pdfPageNumber" type="number" inputmode="numeric" min="1" max="'+current.document.pages+'" value="'+page+'" onchange="window._pdfPage(this.value)"> sur '+current.document.pages+'</label>'+
    '<button type="button" class="glass-btn compact" onclick="window._pdfPage('+Math.min(current.document.pages,page+1)+')" aria-label="Page suivante" '+(page===current.document.pages?'disabled':'')+'>→</button></div>'+
    '<p class="pdf-preserved">Le PDF complet sera conservé.</p><button type="button" id="pdfUse" class="primary-btn" disabled onclick="window._usePDFPage()">Tamponner cette page</button></div>';
  current.document.renderPage(page,900).then(function(result){
    if(pdfImport!==current||sequence!==pdfPreviewSequence||scr!=='pdf')return;
    var preview=document.getElementById('pdfPreview');preview.src=result.image;preview.hidden=false;
    document.getElementById('pdfLoading').hidden=true;document.getElementById('pdfUse').disabled=false;
  }).catch(function(){if(pdfImport===current&&sequence===pdfPreviewSequence){document.getElementById('pdfLoading').textContent='Cette page est illisible. Essayez une autre page.'}});
}
window._pdfPage=function(value){
  if(!pdfImport)return;
  pdfPage=Math.max(1,Math.min(pdfImport.document.pages,Math.floor(Number(value)||1)));render();
};
window._usePDFPage=async function(){
  if(!pdfImport||pdfImport.busy)return;
  var current=pdfImport,page=pdfPage,request=++importSequence;
  current.busy=true;document.getElementById('pdfUse').disabled=true;
  document.querySelectorAll('.pdf-navigation button,.pdf-navigation input').forEach(function(control){control.disabled=true});
  document.getElementById('pdfUse').textContent='Ouverture…';
  try{
    var result=await current.document.renderPage(page);
    if(request!==importSequence||pdfImport!==current)return;
    closePDFImport();beginTicket(result.image,result);
  }catch(error){if(pdfImport===current){current.busy=false;toast('Impossible d’ouvrir cette page.');render()}}
};
function fileInput(capture){
  var input=document.createElement('input');input.type='file';input.accept=capture?'image/*':'image/*,application/pdf,.pdf';if(capture)input.setAttribute('capture','environment');
  input.style.display='none';document.body.appendChild(input);
  input.addEventListener('cancel',function(){input.remove()},{once:true});
  input.addEventListener('change',async function(){
    var file=input.files&&input.files[0];input.remove();if(!file)return;
    var request=++importSequence,source=null,document=null;toast('Ouverture du ticket…');
    try{
      if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){
        document=await ReceiptPDF.open(file);
        if(request!==importSequence){await document.destroy();return}
        if(document.pages===1){
          var page=await document.renderPage(1);
          await document.destroy();document=null;
          if(request===importSequence)beginTicket(page.image,page);
        }else{
          if(ticket)ticket.cancel();ReceiptOCR.cancel();ReceiptImage.cancel();closePDFImport();
          pdfImport={document:document,name:file.name};document=null;pdfPage=1;scr='pdf';render();
        }
      }else{
        source=URL.createObjectURL(file);
        var resized=await resizeImage(source);if(request===importSequence)beginTicket(resized);
      }
    }
    catch(error){if(request===importSequence)toast(error.message)}
    finally{if(source)URL.revokeObjectURL(source);if(document)void document.destroy().catch(function(){})}
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
function setExportBusy(busy){
  exportBusy=busy;document.querySelectorAll('#app button,#app input,#app select').forEach(function(el){el.disabled=busy});
}
function downloadBlob(blob,name){
  var url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url)},10000);
}
async function saveBlob(blob,name){
  var isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var result=await ExportFile.deliver(blob,name,isMobile?'share':'download',{navigator:navigator,File:File,download:downloadBlob});
  return result==='cancelled'?null:result==='shared'?'Partagé ✓':'Téléchargement lancé ✓';
}
function postSaveActions(filename){
  var name=document.getElementById('exportFilename');if(!name)return;
  name.replaceChildren();var label=document.createElement('span');label.textContent=filename||fname();name.appendChild(label);
  var next=document.createElement('button');next.className='next-ticket';next.type='button';next.textContent='Nouveau ticket';next.onclick=function(){window._go('home')};name.appendChild(next);
}
async function exportDocument(format){
  if(exportBusy||photoBusy||!ticket||!img)return;
  if(ticket.ocrStatus==="reading"&&ticket.dateSource!=="manual"){toast('Lecture en cours. Attendez ou saisissez la date.');document.getElementById('ndfDateIn').focus();return}
  if(!Receipt.validDate(ticket.date)){toast('Vérifiez la date du ticket avant de sauvegarder');document.getElementById('ndfDateIn').focus();return}
  var current=ticket;
  setExportBusy(true);
  try{
    await stampFontReady();if(ticket!==current||current.cancelled)return;
    clearTimeout(marginTimer);if(current.margin)await refreshMargin(current,false);
    var key=current.date+'|'+current.meal;current.fileNumbers=current.fileNumbers||{};
    if(!current.fileNumbers[key]){
      try{current.fileNumbers[key]=await localStore.reserveName(current.counterEvent,current.date,current.meal)}
      catch(error){current.fileNumbers[key]=Date.now().toString(36)+'-'+current.counterEvent.slice(0,8)}
    }
    var name=fname(format),source=img;document.getElementById('exportFilename').textContent=name;queueDraft();
    updateStampOverlay();
    var image=await loadImage(source);if(ticket!==current||current.cancelled)return;
    var canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    var context=canvas.getContext('2d');
    if(!(format==='pdf'&&current.pdf)){context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0)}
    drawStampOnCanvas(canvas,context,image.width,image.height);
    var blob=format==='pdf'?(current.pdf?new Blob([await ReceiptPDFExport.stamp({pdf:current.pdf,overlay:canvas.toDataURL('image/png'),outputHeight:canvas.height})],{type:'application/pdf'}):createPDF(canvas)):await new Promise(function(resolve,reject){canvas.toBlob(function(value){if(value)resolve(value);else reject(new Error('Export impossible'))},'image/png')});
    var result=await saveBlob(blob,name);
    if(!result){toast('Partage annulé');return}
    incCount(current);clearTimeout(draftTimer);await localStore.clearDraft().catch(function(){});resumable=null;
    if(navigator.vibrate)navigator.vibrate([20,50,20]);toast(result);
    postSaveActions(name);
  }catch(error){toast('Sauvegarde impossible. Réessayez.');console.error('Export:',error)}
  finally{setExportBusy(false)}
}
window._gen=function(){return exportDocument('png')};
window._genPDF=function(){return exportDocument('pdf')};

// Secondary controls live in sheets; the editor itself always fits the viewport.
function sheet(title,content){
  var previous=document.querySelector('.tool-sheet');if(previous)previous.close();
  var focus=document.activeElement,dialog=document.createElement('dialog');dialog.className='tool-sheet';
  dialog.innerHTML='<header><h2>'+title+'</h2><button type="button" aria-label="Fermer les réglages">Fermer</button></header><div class="sheet-content">'+content+'</div>';
  document.body.appendChild(dialog);dialog.showModal();dialog.querySelector('header button').onclick=function(){dialog.close()};
  dialog.onclose=function(){dialog.remove();if(focus&&focus.isConnected)focus.focus()};return dialog;
}
function resumeControl(){return '<label class="resume-toggle"><input type="checkbox" '+(resumeEnabled?'checked':'')+' onchange="window._toggleResume(this.checked)"><span>Reprendre après une fermeture<small>Sur cet appareil, pendant 24 h. Effacé après export.</small></span></label>'}
window._options=function(){sheet('Options',resumeControl()+'<p class="version-info">Stampfel 1.10.0 · '+(navigator.onLine?'En ligne':'Hors ligne')+'</p>')};
window._adjust=function(){
  if(!ticket||photoBusy||exportBusy)return;
  var content='',labels={blur:'La photo semble floue. Vérifiez les petits caractères.',edges:'Du contenu est proche du cadre. Vérifiez les bords.',glare:'Un reflet est possible. Vérifiez que le texte reste lisible.',dark:'La photo est très sombre. Essayez le rendu Lisible ou une nouvelle photo.'};
  if((ticket.quality||[]).length)content+='<div class="quality-details">'+ticket.quality.map(function(code){return '<p>'+labels[code]+'</p>'}).join('')+(!ticket.pdf?'<button type="button" class="sec-btn" onclick="this.closest(\'dialog\').close();window._cam()">Reprendre la photo</button>':'')+'</div>';
  if(scr==='edit'){
    content+='<label class="sheet-label" for="rotSlider">Rotation</label><div class="rotation-controls"><input id="rotSlider" type="range" min="-180" max="180" value="'+S.rotation+'" oninput="window._rot(this.value)" aria-label="Rotation du tampon"><input id="rotNum" type="number" min="-180" max="180" value="'+Math.round(S.rotation)+'" oninput="window._rot(this.value)" aria-label="Rotation en degrés"><span>°</span></div>'+
      '<label class="sheet-label" for="stampSize">Taille du tampon</label><input id="stampSize" type="range" min="0.3" max="2.5" step="0.05" value="'+S.scale+'" oninput="window._editorScale(this.value)">'+
      '<button type="button" class="sec-btn" onclick="this.closest(\'dialog\').close();window._margin()">'+(ticket.margin?'Retirer la marge blanche':'Ajouter une marge pour le tampon')+'</button>'+
      (ticket.needsMargin&&!ticket.margin?'<p class="sheet-note">Le ticket est chargé. Une marge permet de garder toutes les informations visibles.</p>':'')+
      '<label class="resume-toggle"><input type="checkbox" '+(S.showDate?'checked':'')+' onchange="window._editorShowDate(this.checked)"><span>Afficher la date sur le tampon</span></label>';
    if(ticket.pdf)content+='<button type="button" class="sec-btn" onclick="this.closest(\'dialog\').close();window._pdfPhoto()">Retoucher une copie de cette page</button><p class="sheet-note">Pour recadrer ou améliorer un PDF scanné. La copie contiendra uniquement cette page, sous forme d’image.</p>';
  }
  content+=resumeControl();sheet(scr==='edit'?'Ajuster le tampon':'Vérifier la photo',content);
};
window._dateDetails=function(){
  sheet('Date et repas','<p class="sheet-note">Midi : 10 h à 14 h. Soir : 18 h à minuit.</p><div id="dateChoices"></div><button type="button" class="sec-btn" onclick="this.closest(\'dialog\').close();window._retryDate()">Relire la date et l’heure</button>');updateDateUI();
};
window._editorScale=function(value){S.scale=Math.max(.3,Math.min(2.5,Number(value)||1));ticket.placementTouched=true;save();updateStampOverlay();queueMarginRefresh();queueDraft()};
window._editorShowDate=function(value){S.showDate=value;save();updateStampOverlay();queueMarginRefresh();queueDraft()};
window._pdfPhoto=function(){
  if(!ticket||!ticket.pdf||photoBusy||exportBusy)return;var previous=ticket;
  beginTicket(previous.original,{text:previous.pdfText});
  ticket.counterEvent=previous.counterEvent;ticket.counted=previous.counted;ticket.fileNumbers=previous.fileNumbers;
  if(previous.dateSource==='manual')ticket.setDate(previous.date);
  if(previous.mealSource==='manual')ticket.setMeal(previous.meal);
  updateDateUI();queueDraft();
};
async function imageWithMargin(source,height){
  if(!height)return source;var image=await loadImage(source),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height+height;
  var context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0);return canvas.toDataURL('image/png');
}
async function refreshMargin(current,center){
  var source=current.processed||current.original,base=await loadImage(source),revision=current.revision;
  var geometry=StampRenderer.layout(stampSettings(false),base.width,base.height+base.width*2);
  var height=current.margin?Math.ceil(geometry.boundHeight+base.width*.06):0;
  if(current.marginHeight===height&&current.displaySource===source)return;
  var result=await imageWithMargin(source,height);
  if(ticket!==current||current.cancelled||current.revision!==revision)return;
  current.marginHeight=height;current.displaySource=source;current.image=result;img=result;
  if(center&&height){sp={x:50,y:(base.height+height/2)/(base.height+height)*100};current.placementTouched=true}
  else if(center)sp={x:50,y:75};
  var image=document.getElementById('ei');if(image)image.src=result;
  updatePhotoHints();updateStampOverlay();queueDraft();
}
function queueMarginRefresh(){
  clearTimeout(marginTimer);if(!ticket||!ticket.margin||ticket.cancelled||scr!=='edit')return;
  var current=ticket;marginTimer=setTimeout(function(){if(!photoBusy&&!exportBusy)void refreshMargin(current,true).catch(function(){})},150);
}
window._margin=async function(){
  if(!ticket||photoBusy||exportBusy)return;var current=ticket;setPhotoBusy(true);current.margin=!current.margin;current.revision++;
  try{await refreshMargin(current,true)}catch(error){current.margin=!current.margin;toast('Marge indisponible. Réessayez.')}finally{if(ticket===current)setPhotoBusy(false)}
};
window._zoom=async function(){
  if(!ticket||photoBusy||exportBusy)return;var current=ticket,source=img;
  try{
    var image=await loadImage(source),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    var context=canvas.getContext('2d');context.drawImage(image,0,0);drawStampOnCanvas(canvas,context,image.width,image.height);
    var original=await imageWithMargin(current.original,current.marginHeight||0);
    if(ticket===current&&!current.cancelled&&scr==='edit')ReceiptViewer.open({image:canvas.toDataURL('image/png'),original:original});
  }catch(error){toast('Zoom indisponible. Réessayez.')}
};

// A single opt-in local draft. Export and opt-out remove it; no history is kept.
function snapshotDraft(){
  if(!ticket||ticket.cancelled||ticket.counted||!['crop','edit'].includes(scr))return null;
  var fields=['source','original','image','processed','imageMode','cropPoints','date','dateSource','meal','mealSource','times','timeStatus','ocrStatus','candidates','pdfText','pdfPage','pdf','counterEvent','counted','fileNumbers','margin','marginHeight','displaySource','needsMargin','quality'];
  var state={};fields.forEach(function(key){if(ticket[key]!==undefined)state[key]=ticket[key]});
  return {ticket:state,imgFull:imgFull,crop:crop.map(function(p){return {x:p.x,y:p.y}}),cropEntry:cropEntry,screen:scr,position:Object.assign({},sp),stamp:Object.assign({},S)};
}
async function saveDraftNow(){
  clearTimeout(draftTimer);if(!resumeEnabled)return;var payload=snapshotDraft();if(!payload)return;
  try{await localStore.saveDraft(payload);resumable=await localStore.readDraft();refreshResumeCard()}
  catch(error){if(!draftNoticeShown){draftNoticeShown=true;toast('Reprise locale indisponible. Gardez ce ticket ouvert.')}}
}
function queueDraft(){clearTimeout(draftTimer);if(resumeEnabled)draftTimer=setTimeout(saveDraftNow,350)}
function refreshResumeCard(){var card=document.getElementById('resumeCard');if(card)card.hidden=!resumable}
window._toggleResume=async function(value){
  try{await localStore.setEnabled(value);resumeEnabled=value;resumable=null;draftNoticeShown=false;if(value)await saveDraftNow();refreshResumeCard()}
  catch(error){resumeEnabled=false;document.querySelectorAll('.resume-toggle input').forEach(function(input){if(input.onchange&&input.getAttribute('onchange').includes('_toggleResume'))input.checked=false});toast('Le stockage local n’est pas disponible.')}
};
window._discardDraft=async function(){await localStore.clearDraft().catch(function(){});resumable=null;refreshResumeCard()};
window._resumeDraft=async function(){
  try{
    var saved=await localStore.readDraft();if(!saved){resumable=null;refreshResumeCard();toast('Ce ticket n’est plus disponible.');return;}
    var payload=saved.payload,state=payload.ticket;
    if(!state||!['source','original','image','processed'].every(function(key){return typeof state[key]==='string'&&/^data:image\/(png|jpeg);base64,/.test(state[key])})||!ReceiptPixels.validQuad(payload.crop))throw new Error('Brouillon invalide');
    if(ticket)ticket.cancel();ReceiptOCR.cancel();ReceiptImage.cancel();
    ticket=Object.assign(new Receipt.Session(++ticketSequence,state.source),state);ticket.cancelled=false;ticket.revision=0;ticket.enhancementCache={};ticket.placementTouched=true;
    if(!Receipt.validDate(ticket.date))ticket.date='';if(!Receipt.validMeal(ticket.meal))ticket.meal='';
    S=Object.assign({},DS,payload.stamp);sp=payload.position;img=ticket.image;imgFull=payload.imgFull;crop=payload.crop;cropEntry=payload.cropEntry;ndfDate=ticket.date;
    scr=payload.screen==='crop'?'crop':'edit';photoBusy=exportBusy=false;cropDrag=null;cropRevision++;photoSequence++;stampCache=null;render();
    if(ticket.ocrStatus==='reading')readTicketDate(ticket);
  }catch(error){toast('Impossible de reprendre ce ticket. Importez-le à nouveau.')}
};
localStore.enabled().then(async function(value){resumeEnabled=value;resumable=await localStore.readDraft();refreshResumeCard();if(ticket)queueDraft()}).catch(function(){});
document.addEventListener('visibilitychange',function(){if(document.hidden)void saveDraftNow();else if(scr==='home')void localStore.readDraft().then(function(value){resumable=value;refreshResumeCard()}).catch(function(){})});
window.addEventListener('pagehide',function(){void saveDraftNow()});

// ── GLOBALS ──
window._go=function(s){
  if(s==='home'){void saveDraftNow();clearTimeout(marginTimer);ReceiptViewer.close();importSequence++;cropRevision++;photoSequence++;if(ticket)ticket.cancel();ReceiptOCR.cancel();ReceiptImage.cancel();closePDFImport();photoBusy=false;cropEntry=null;cropDrag=null;}
  scr=s;render();
};
window._cam=function(){fileInput(true)};
window._gal=function(){fileInput(false)};

// Always process the unfiltered crop, with a cache for immediate comparisons.
window._imageMode=async function(mode){
  var current=ticket;if(photoBusy||!current||current.cancelled||current.pdf||!['original','readable','mono'].includes(mode))return;
  if(current.imageMode===mode)return;
  var revision=++current.revision,source=current.original,operation=++photoSequence;setPhotoBusy(true);
  try{
    var result=mode==='original'?source:current.enhancementCache[mode]||await ReceiptImage.enhance(source,mode);
    if(ticket!==current||current.cancelled||revision!==current.revision||scr!=='edit')return;
    if(mode!=='original')current.enhancementCache[mode]=result;
    current.imageMode=mode;current.processed=result;current.enhanced=mode!=='original';await refreshMargin(current,false);
    document.querySelectorAll('#imageModes button').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.mode===mode))});
    if(needsReading(current)){ReceiptOCR.cancel();readTicketDate(current)}queueDraft();
  }catch(error){if(ticket===current&&!current.cancelled)toast('Traitement indisponible. Image conservée.')}
  finally{if(ticket===current&&operation===photoSequence)setPhotoBusy(false)}
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
window._rot=function(v){S.rotation=Math.max(-180,Math.min(180,Number(v)||0));if(ticket)ticket.placementTouched=true;save();updateRotationInputs();updateStampOverlay();queueMarginRefresh();queueDraft()};
window._moveStamp=function(event){var delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!delta)return;event.preventDefault();if(ticket)ticket.placementTouched=true;sp.x+=delta[0]*(event.shiftKey?5:1);sp.y+=delta[1]*(event.shiftKey?5:1);updateStampOverlay();savePos()};
window._setDate=function(v){if(!ticket)return;ticket.setDate(v);ndfDate=ticket.date;updateDateUI()};
window._setMeal=function(v){if(!ticket)return;ticket.setMeal(v);updateDateUI()};
window._rotate90=async function(){
  var current=ticket,source=imgFull;if(photoBusy||!current||current.cancelled)return;
  cropRevision++;var operation=++photoSequence;setPhotoBusy(true);
  try{
    var image=await loadImage(source);if(ticket!==current||current.cancelled||imgFull!==source||scr!=='crop'||operation!==photoSequence)return;
    var canvas=document.createElement('canvas');canvas.width=image.height;canvas.height=image.width;
    var context=canvas.getContext('2d');context.translate(image.height,0);context.rotate(Math.PI/2);context.drawImage(image,0,0);
    imgFull=canvas.toDataURL('image/png');crop=ReceiptPixels.rotateQuad(crop);cropDrag=null;scr='crop';render();
  }catch(error){if(ticket===current&&!current.cancelled&&scr==='crop'&&operation===photoSequence)toast('Rotation impossible. Image conservée.')}
  finally{if(ticket===current&&operation===photoSequence)setPhotoBusy(false)}
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
  var wasControlled=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',function(){
    if(!wasControlled){wasControlled=true;return}
    if(scr==='home')location.reload();else pendingAppReload=true;
  });
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(function(registration){
    document.addEventListener('visibilitychange',function(){if(!document.hidden){void registration.update();void counters.sync()}});
  }).catch(function(error){console.warn('Mode hors ligne indisponible:',error)});
}
if(document.fonts)document.fonts.addEventListener('loadingdone',function(){stampCache=null;updateConfigPreview();updateStampOverlay()});

render();
})();
