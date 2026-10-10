import {mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const destination=new URL('../vendor/fonts/',import.meta.url);
await mkdir(destination,{recursive:true});
const families=[['Outfit','100..900'],['Instrument Sans','400..700'],['Inter','100..900'],['Roboto Condensed','100..900'],['Oswald','200..700'],['Archivo Black','400'],['Barlow Condensed','600;700;800']];
let css='/* Local Google Fonts: SIL Open Font License, see *-OFL.txt. */\n';const files={};
for(const [family,weights] of families){
  const slug=family.toLowerCase().replaceAll(' ',''), url='https://fonts.googleapis.com/css2?family='+family.replaceAll(' ','+')+':wght@'+weights+'&display=swap';
  const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});if(!response.ok)throw new Error(url);
  const sheet=await response.text();
  for(const block of sheet.matchAll(/\/\* (latin(?:-ext)?) \*\/\s*(@font-face\s*\{[\s\S]*?\})/g)){
    let rule=block[2];const remote=/url\(([^)]+)\)/.exec(rule)?.[1];if(!remote)throw new Error('Font source missing');
    const asset=await fetch(remote);if(!asset.ok)throw new Error(remote);const bytes=Buffer.from(await asset.arrayBuffer());
    const hash=createHash('sha256').update(bytes).digest('hex');const filename=slug+'-'+block[1]+'-'+hash.slice(0,12)+'.woff2';
    await writeFile(new URL(filename,destination),bytes);files[filename]={source:remote,sha256:hash};css+=rule.replace(remote,filename)+'\n';
  }
  const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/'+slug+'/OFL.txt');if(!license.ok)throw new Error('License '+slug);
  await writeFile(new URL(slug+'-OFL.txt',destination),await license.text());
}
if(Object.keys(files).length<7)throw new Error('Missing fonts');
await writeFile(new URL('fonts.css',destination),css);await writeFile(new URL('versions.json',destination),JSON.stringify({source:'https://github.com/google/fonts',license:'OFL-1.1',files},null,2)+'\n');
console.log(Object.keys(files).length+' local font files');
