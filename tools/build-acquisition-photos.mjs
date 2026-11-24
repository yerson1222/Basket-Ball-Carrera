// Run from the repository root: node tools/build-acquisition-photos.mjs
// Fetches openly licensed reference images and preserves their attribution.
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
const base='assets/acquisitions',manifestPath=base+'/manifest.js';
await mkdir(base,{recursive:true});
const context={window:{},localStorage:{getItem(){return null},setItem(){}},URLSearchParams,AbortController,setTimeout,clearTimeout,fetch:(url,options={})=>fetch(url,{...options,headers:{...options.headers,'User-Agent':'WorldHoopsAcquisitionBuilder/1.0 (https://github.com/yerson1222/Basket-Ball-Carrera)'}})};
try{runInNewContext(await readFile(manifestPath,'utf8'),context);}catch{}
const manifest=context.window.WH_ACQUISITION_PHOTOS||{};
for(const file of ['data.js','career_mode.js','career_expansion.js','career_world_v3.js','career_stories_v5.js','career_international_v6.js','career_immersion_v92.js','career_players_v15.js','career_photos_v14.js','career_catalog_v154.js','career_nightlife_v13.js'])runInNewContext(await readFile(file,'utf8'),context);
const art=context.window.WH_V14_ART,queries=art.allQueries();
if(!queries.length)throw Error('No approved per-item photographs registered');
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const args=new Set(process.argv.slice(2));
let success=0,fail=0;
for(const q of queries){
 const existing=manifest[q],approved=art.read(q);
 if(approved?.src===existing?.src&&existing?.src?.startsWith(base+'/')&&!args.has('--refresh')){
  try{await access(existing.src);success++;continue;}catch{}
 }
 try{
  let source=art.read(q);if(source?.src.startsWith(base+'/')){const name=encodeURIComponent(source.title.replaceAll(' ','_'));source={...source,src:'https://commons.wikimedia.org/wiki/Special:FilePath/'+name+'?width=640'};}
  if(!source)throw Error('No suitable licensed image');
  let res=await context.fetch(source.src,{signal:AbortSignal.timeout(18000)});
  if(!res.ok)throw Error('Approved file unavailable: HTTP '+res.status);
  if(!res.ok)throw Error('HTTP '+res.status);
  const type=(res.headers.get('content-type')||'').split(';')[0],ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[type];
  if(!ext)throw Error('Unsupported '+type);
  const bytes=Buffer.from(await res.arrayBuffer());if(bytes.length<200||bytes.length>12e6)throw Error('Unexpected size');
  const path=base+'/'+createHash('sha256').update(q).digest('hex').slice(0,16)+'.'+ext;
  await writeFile(path,bytes);manifest[q]={...source,src:path};success++;console.log('OK',q);
 }catch(error){fail++;console.error('Missing',q,error.message);}
 // Save progress after every query so an interrupted run can be resumed.
 await writeFile(manifestPath,'window.WH_ACQUISITION_PHOTOS='+JSON.stringify(manifest,null,2).replace(/</g,'\\u003c')+';\n');
 await pause(350);
}
console.log('Photos available:',success,'unresolved:',fail,'total subjects:',queries.length);
if(fail)process.exitCode=1;
