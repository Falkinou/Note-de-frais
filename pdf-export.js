(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(()=>Promise.resolve(require('pdf-lib')));
  else {
    const url=new URL('vendor/pdf-lib/pdf-lib.min.js',document.currentScript.src);let loading;
    root.ReceiptPDFExport=factory(()=>{
      if(root.PDFLib)return Promise.resolve(root.PDFLib);
      if(!loading)loading=new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src=url.href;
        script.onload=()=>resolve(root.PDFLib);
        script.onerror=()=>{loading=null;script.remove();reject(new Error('Export PDF indisponible'));};
        document.head.appendChild(script);
      });return loading;
    });
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(library){
  'use strict';
  function invert([a,b,c,d,e,f]){
    const det=a*d-b*c;if(!Number.isFinite(det)||Math.abs(det)<1e-10)throw new Error('Repère PDF invalide');
    return [d/det,-b/det,-c/det,a/det,(c*f-d*e)/det,(b*e-a*f)/det];
  }
  function point(m,x,y){return {x:m[0]*x+m[2]*y+m[4],y:m[1]*x+m[3]*y+m[5]};}
  // Map the same preview pixels used by the editor to the original PDF user space.
  // This handles rotated pages, non-zero CropBox origins and rounding in PDF.js.
  function overlayMatrix(pdf,outputHeight){
    const m=invert(pdf.viewport.transform),sx=pdf.viewport.width/pdf.width,sy=pdf.viewport.height/pdf.height;
    return [m[0]*sx,m[1]*sx,-m[2]*sy,-m[3]*sy,m[2]*outputHeight*sy+m[4],m[3]*outputHeight*sy+m[5]];
  }
  async function stamp({pdf,overlay,outputHeight}){
    const lib=await library();
    const doc=await lib.PDFDocument.load(pdf.bytes.slice(),{updateMetadata:false});
    const page=doc.getPage(pdf.page-1),matrix=overlayMatrix(pdf,outputHeight);
    if(!page||!Number.isFinite(outputHeight)||outputHeight<pdf.height)throw new Error('Page PDF invalide');
    const extra=outputHeight-pdf.height;
    if(extra){
      const corners=[[0,0],[pdf.width,0],[pdf.width,outputHeight],[0,outputHeight]].map(([x,y])=>point(matrix,x,y));
      const x0=Math.min(...corners.map(p=>p.x)),y0=Math.min(...corners.map(p=>p.y)),x1=Math.max(...corners.map(p=>p.x)),y1=Math.max(...corners.map(p=>p.y));
      const media=page.getMediaBox(),mx=Math.min(media.x,x0),my=Math.min(media.y,y0);
      page.setMediaBox(mx,my,Math.max(media.x+media.width,x1)-mx,Math.max(media.y+media.height,y1)-my);
      page.setCropBox(x0,y0,x1-x0,y1-y0);
    }
    const png=await doc.embedPng(overlay);
    page.pushOperators(lib.pushGraphicsState(),lib.concatTransformationMatrix(...matrix));
    if(extra)page.drawRectangle({x:0,y:0,width:pdf.width,height:extra,color:lib.rgb(1,1,1)});
    page.drawImage(png,{x:0,y:0,width:pdf.width,height:outputHeight});
    page.pushOperators(lib.popGraphicsState());
    // Existing widgets and their appearances stay intact; only a stamp is appended.
    return doc.save({updateFieldAppearances:false});
  }
  return {stamp,overlayMatrix,invert};
});
