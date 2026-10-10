const {test}=require('node:test'),assert=require('node:assert/strict');
const {IDBFactory}=require('fake-indexeddb'),{create,TTL}=require('../local-store.js');
test('reprise désactivée par défaut : aucune image écrite',async()=>{
  const db=create({indexedDB:new IDBFactory()});assert.equal(await db.enabled(),false);assert.equal(await db.saveDraft({photo:'private'}),false);assert.equal(await db.readDraft(),null);
});
test('brouillon local récupéré après réouverture, puis expiré',async()=>{
  const indexedDB=new IDBFactory();let now=1000;const db=create({indexedDB,now:()=>now});await db.setEnabled(true);
  await db.saveDraft({photo:'A',pdf:new Uint8Array([1,2,3]),meal:'midi'});
  const reloaded=create({indexedDB,now:()=>now});assert.equal((await reloaded.readDraft()).payload.meal,'midi');assert.deepEqual((await reloaded.readDraft()).payload.pdf,new Uint8Array([1,2,3]));
  now+=TTL+1;assert.equal(await reloaded.readDraft(),null);
});
test('désactiver et effacer ne laisse aucun brouillon, même avec une sauvegarde en attente',async()=>{
  const db=create({indexedDB:new IDBFactory()});await db.setEnabled(true);await db.saveDraft({photo:'A'});
  await Promise.all([db.setEnabled(false),db.saveDraft({photo:'late'})]);assert.equal(await db.readDraft(),null);
  await db.setEnabled(true);assert.equal(await db.readDraft(),null);await db.saveDraft({photo:'B'});await db.clearDraft();assert.equal(await db.readDraft(),null);
});
test('noms alloués atomiquement entre fenêtres, stables entre PNG et PDF',async()=>{
  const indexedDB=new IDBFactory(),a=create({indexedDB}),b=create({indexedDB});
  const values=await Promise.all(Array.from({length:15},(_,i)=>(i%2?a:b).reserveName('ticket'+i,'2026-10-10','midi')));
  assert.equal(new Set(values).size,15);assert.equal(await b.reserveName('ticket0','2026-10-10','midi'),values[0]);
  assert.equal(await a.reserveName('ticket16','2026-10-10','soir'),16);assert.equal(await b.reserveName('ticket17','2026-10-11','soir'),1);
});
