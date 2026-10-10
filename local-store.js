(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ReceiptLocal = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const TTL = 24 * 60 * 60 * 1000;
  function create({indexedDB, now = Date.now, name = 'stampfel-local'}) {
    let opening;
    function open() {
      if (!indexedDB) return Promise.reject(new Error('Stockage local indisponible'));
      if (!opening) opening = new Promise((resolve, reject) => {
        const request = indexedDB.open(name, 1);
        request.onupgradeneeded = () => ['meta','draft','names','sequences'].forEach(store => request.result.createObjectStore(store));
        request.onsuccess = () => { const db=request.result; db.onversionchange=()=>{db.close();opening=null;}; resolve(db); };
        request.onerror = () => { opening=null; reject(request.error); };
        request.onblocked = () => { opening=null; reject(new Error('Stockage occupé par une autre fenêtre')); };
      });
      return opening;
    }
    async function transact(stores, mode, run) {
      const db = await open();
      return new Promise((resolve,reject) => {
        const tx=db.transaction(stores,mode);let result;
        tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||new Error('Écriture locale interrompue'));tx.onerror=()=>{};
        try { run(tx, value=>{result=value;}); } catch(error) { tx.abort();reject(error); }
      });
    }
    function enabled() { return transact(['meta'],'readonly',(tx,done)=>{tx.objectStore('meta').get('resume').onsuccess=e=>done(e.target.result===true);}); }
    function setEnabled(value) {
      return transact(['meta','draft'],'readwrite',(tx)=>{tx.objectStore('meta').put(!!value,'resume');if(!value)tx.objectStore('draft').clear();});
    }
    function saveDraft(payload) {
      return transact(['meta','draft'],'readwrite',(tx,done)=>{
        tx.objectStore('meta').get('resume').onsuccess=e=>{
          if(e.target.result!==true){done(false);return;}
          tx.objectStore('draft').put({version:1,savedAt:now(),expiresAt:now()+TTL,payload},'current');done(true);
        };
      });
    }
    function readDraft() {
      return transact(['meta','draft'],'readwrite',(tx,done)=>{
        tx.objectStore('meta').get('resume').onsuccess=e=>{
          if(e.target.result!==true){tx.objectStore('draft').clear();done(null);return;}
          tx.objectStore('draft').get('current').onsuccess=event=>{
            const value=event.target.result;
            if(!value||value.version!==1||value.expiresAt<=now()){tx.objectStore('draft').clear();done(null);}
            else done(value);
          };
        };
      });
    }
    function clearDraft() { return transact(['draft'],'readwrite',tx=>tx.objectStore('draft').clear()); }
    function reserveName(eventId,date,meal) {
      const key=eventId+'|'+date+'|'+meal;
      return transact(['names','sequences'],'readwrite',(tx,done)=>{
        const names=tx.objectStore('names'),sequences=tx.objectStore('sequences');
        names.get(key).onsuccess=e=>{
          if(e.target.result){done(e.target.result);return;}
          sequences.get(date).onsuccess=event=>{
            const next=(Number(event.target.result)||0)+1;
            sequences.put(next,date);names.put(next,key);done(next);
          };
        };
      });
    }
    return {enabled,setEnabled,saveDraft,readDraft,clearDraft,reserveName};
  }
  return {create,TTL};
});
