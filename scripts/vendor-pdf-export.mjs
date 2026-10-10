import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const source=new URL('../node_modules/pdf-lib/',import.meta.url),destination=new URL('../vendor/pdf-lib/',import.meta.url);
await mkdir(destination,{recursive:true});
const files=[['dist/pdf-lib.min.js','pdf-lib.min.js'],['LICENSE.md','LICENSE.md']],sha256={};
for(const [from,to] of files){await copyFile(new URL(from,source),new URL(to,destination));sha256[to]=createHash('sha256').update(await readFile(new URL(to,destination))).digest('hex');}
const {version}=JSON.parse(await readFile(new URL('package.json',source))),dependencies={};
for(const [name,file] of [['@pdf-lib/standard-fonts','LICENSE.md'],['@pdf-lib/upng','LICENSE'],['pako','LICENSE'],['tslib','LICENSE.txt']]){
  const dependency=new URL('../node_modules/'+name+'/',import.meta.url),target=name.replace(/[@/]/g,'')+'-LICENSE';
  const metadata=JSON.parse(await readFile(new URL('package.json',dependency)));dependencies[name]={version:metadata.version,license:metadata.license};
  await copyFile(new URL(file,dependency),new URL(target,destination));sha256[target]=createHash('sha256').update(await readFile(new URL(target,destination))).digest('hex');
}
await writeFile(new URL('versions.json',destination),JSON.stringify({version,source:'https://github.com/Hopding/pdf-lib',license:'MIT',dependencies,sha256},null,2)+'\n');
console.log('PDF-Lib '+version+' : ressources locales prêtes.');
