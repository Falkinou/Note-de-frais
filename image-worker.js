'use strict';
importScripts('image-processing.js','document-analysis.js');
self.onmessage=function(event){
  const {id,operation,image,points,mode,bounds}=event.data;
  try {
    const result=operation==='detect'?ReceiptPixels.detect(image):operation==='rectify'?ReceiptPixels.rectify(image,points):operation==='enhance'?ReceiptPixels.enhance(image,mode):operation==='inspect'?DocumentAnalysis.inspect(image):operation==='placement'?DocumentAnalysis.placement(image,bounds):null;
    if(!result)throw new Error('Traitement inconnu');
    self.postMessage({id,result},result.data?[result.data.buffer]:[]);
  } catch(error) { self.postMessage({id,error:error.message}); }
};
