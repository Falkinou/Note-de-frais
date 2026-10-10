const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),{createHash,webcrypto}=require('node:crypto');
function setup(){
 const content={'index.html':'app','vendor/ocr/model.gz':'model','vendor/pdfjs/pdf.mjs':'pdf'},messages=[],events={},stores=new Map(),calls=[];let broken='',network=true,activated=false;
 const assets=Object.entries(content).map(([path,text])=>({path,size:Buffer.byteLength(text),sha256:createHash('sha256').update(text).digest('hex')}));
 const manifest={version:'test',assets};
 const caches={open:async name=>{if(!stores.has(name))stores.set(name,new Map());const map=stores.get(name);return {match:async key=>map.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,value)=>map.set(typeof key==='string'?key:key.url,value.clone()),keys:async()=>[...map.keys()].map(url=>({url})),delete:async key=>map.delete(typeof key==='string'?key:key.url)}},keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name)};
 const self={STAMPFEL_OFFLINE:manifest,location:{href:'https://stamp.test/sub/sw.js'},clients:{matchAll:async()=>[{postMessage:message=>messages.push(message)}],claim:async()=>{}},skipWaiting:async()=>{activated=true},addEventListener:(name,handler)=>events[name]=handler};
 vm.runInNewContext(fs.readFileSync(require.resolve('../sw.js'),'utf8'),{self,importScripts:()=>{},caches,URL,Request,crypto:webcrypto,fetch:async request=>{calls.push(request.url);if(!network)throw new Error('offline');const path=new URL(request.url).pathname.slice(5);return new Response(broken===path?'corrupt':content[path],{status:200})}});
 return {manifest,messages,calls,stores,caches,network:value=>network=value,broken:value=>broken=value,activated:()=>activated,event:async(name,data)=>{let wait,result;events[name]({data,request:data,waitUntil:p=>wait=p,respondWith:p=>result=p});await wait;return result?await result:undefined}};
}
test('première ouverture hors ligne : application, OCR et PDF sont tous prêts avant activation',async()=>{
 const app=setup();await app.event('install');assert.equal(app.activated(),true);assert.equal(app.messages.at(-1).status,'ready');app.network(false);
 for(const asset of app.manifest.assets){const response=await app.event('fetch',new Request('https://stamp.test/sub/'+asset.path));assert.ok(response.ok)}
 assert.equal(app.calls.length,3);assert.equal(await (await app.event('fetch',new Request('https://stamp.test/sub/?v=2'))).text(),'app');assert.equal(await app.event('fetch',new Request('https://stamp.test/api/counters')),undefined);
});
test('téléchargement incomplet ou corrompu : jamais prêt, ancienne version intacte, reprise partielle',async()=>{
 const app=setup();const old=await app.caches.open('stampfel-v1.10.1');await old.put('https://stamp.test/sub/index.html',new Response('old'));app.broken('vendor/ocr/model.gz');await assert.rejects(app.event('install'));assert.equal(app.activated(),false);assert.equal(app.messages.at(-1).status,'error');assert.ok(!app.messages.some(m=>m.status==='ready'));assert.equal(await (await old.match('https://stamp.test/sub/index.html')).text(),'old');
 app.broken('');const count=app.calls.length;await app.event('message',{type:'PREPARE_OFFLINE'});assert.equal(app.calls.length-count,1);assert.equal(app.messages.at(-1).status,'ready');
});
test('une ressource évincée invalide le statut puis est réparée au retour du réseau',async()=>{
 const app=setup();await app.event('install');const cache=await app.caches.open('stampfel-assets-v1');await cache.delete('https://stamp.test/sub/__offline__/'+app.manifest.assets[1].sha256);await app.event('message',{type:'OFFLINE_STATUS'});assert.equal(app.messages.at(-1).status,'incomplete');await app.event('message',{type:'PREPARE_OFFLINE'});assert.equal(app.messages.at(-1).status,'ready');
});
test('manifest de livraison : versions alignées, empreintes exactes, toutes les ressources déclarées',()=>{
 const context={self:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../offline-assets.js'),'utf8'),context);const manifest=context.self.STAMPFEL_OFFLINE;
 const root=require('node:path').join(__dirname,'..'),pkg=require('../package.json');assert.equal(manifest.version,pkg.version);assert.ok(fs.readFileSync(root+'/index.html','utf8').includes('content="'+pkg.version+'"'));
 const paths=new Set(manifest.assets.map(a=>a.path));
 for(const path of ['vendor/ocr/fra.traineddata.gz','vendor/ocr/tesseract-core-lstm.wasm.js','vendor/ocr/tesseract-core-simd-lstm.wasm.js','vendor/ocr/tesseract-core-relaxedsimd-lstm.wasm.js','vendor/pdfjs/pdf.min.mjs','vendor/pdfjs/pdf.worker.min.mjs','vendor/pdf-lib/pdf-lib.min.js','vendor/fonts/fonts.css','reading.js','offline.js'])assert.ok(paths.has(path),path);
 for(const asset of manifest.assets)assert.equal(createHash('sha256').update(fs.readFileSync(root+'/'+asset.path)).digest('hex'),asset.sha256,asset.path+' : run build:offline');
 const html=fs.readFileSync(root+'/index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g))assert.ok(paths.has(match[1]),match[1]);
 const css=fs.readFileSync(root+'/vendor/fonts/fonts.css','utf8');for(const match of css.matchAll(/url\(([^)]+)\)/g))assert.ok(paths.has('vendor/fonts/'+match[1]),match[1]);
});
