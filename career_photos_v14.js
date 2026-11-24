/* V14 – Product photography: licensed Wikimedia Commons images, lazy discovery and cache. */
(function(){
'use strict';
const queries=[
 ['Toyota Corolla','Honda Civic','Mazda3','Volkswagen Golf','Hyundai Elantra','Kia K5','Subaru WRX','Tesla Model 3','Audi A4','BMW M340i','Mercedes AMG C43','Lexus IS','Ford Mustang GT','Chevrolet Corvette','BMW M4','Audi RS5','Porsche 911','Mercedes AMG GT','Nissan GT-R','Porsche 911 GT3 RS','McLaren Artura','Ferrari Roma','Lamborghini Huracán','Ferrari 296 GTB','Bugatti Chiron'],
 ['Honda CB650R','Yamaha MT-07','Kawasaki Ninja motorcycle','Ducati Monster','Triumph Street Triple','BMW S1000RR','Suzuki Hayabusa','Ducati Panigale'],
 ['modern apartment interior','loft apartment interior','condominium building','suburban detached house','duplex house','luxury penthouse interior','alpine chalet','seaside villa','luxury mansion','mountain house','house outdoor swimming pool','country estate manor house'],
 ['casual sneakers','bespoke suit','designer jacket','wool overcoat','sportswear','limited edition sneakers','travel suitcase','sunglasses','graphic t-shirt','leather boots'],
 ['automatic wristwatch','chronograph wristwatch','sports wristwatch','gold chain necklace','bracelet jewelry','gold ring','earrings jewelry','diving watch','tourbillon watch','diamond necklace'],
 ['basketball shooting machine','gym dumbbells','treadmill gym','stationary exercise bike','basketball jump training','basketball shooting practice','private basketball court','basketball video analysis','basketball coach practice','basketball defense drill'],
 ['sports massage therapy','physical therapy sports','cryotherapy chamber','healthy nutrition meal','sports recovery compression boots','mattress bedroom','yoga exercise','hydrotherapy pool','sports biomechanics laboratory','sports psychology consultation'],
 ['laptop computer','smartphone','digital camera','video game console','OLED television','live streaming setup','over ear headphones','smartwatch','racing simulator cockpit','recording studio'],
 ['mountain resort','Paris Eiffel Tower','Caribbean beach','Japan Kyoto','African safari','cruise ship','New York skyline','Dubai skyline','Rome Colosseum','Maldives resort'],
 ['coffee shop interior','restaurant interior','sporting goods store','youth basketball academy','fitness gym interior','clothing boutique','media production studio','apartment building rental','technology office','physical rehabilitation center'],
 ['professional chef cooking','chauffeur driving car','business agent meeting','office assistant','security guard','personal fitness trainer','social media office','fashion stylist','accountant office','professional photographer'],
 ['home cinema theater','music recording studio','art gallery collection','live concert stage','video gaming room','billiard table','electric guitar','golf course clubhouse','art museum exhibition','music festival stage']
];
const originals={gym:'home gym weights',chef:'professional chef cooking',trainer:'basketball personal trainer',shooting:'basketball shooting machine',physio:'physical therapy sports',sleep:'modern bedroom',nutrition:'healthy sports nutrition meal',film:'sports video analysis room',coachdef:'basketball defense training coach',massage:'sports massage equipment',shoes:'basketball shoes',basket:'private basketball court',mind:'psychology consultation',recovery:'hydrotherapy swimming pool',academy:'basketball training camp',travel:'airport lounge',sports_car:'Porsche 911 sports car',luxury_car:'Mercedes Benz S Class',personal_driver:'chauffeur driving car',penthouse:'luxury penthouse interior',image_agent:'business agent meeting',streaming_room:'streaming studio setup',family_trip:'family vacation resort',charity_foundation:'youth basketball charity',private_court:'indoor basketball training court',sports_psychologist:'sports psychology consultation'};
const fallback=['sports car','sport motorcycle','modern house','clothing store','wristwatch','gym equipment','physical therapy','consumer electronics','holiday resort','modern office','professional office','concert stage'];
const pinned={"Honda Civic":["Honda CIVIC EX (6BA-FL1) front.jpg","Tokumeigakarinoaoshima","CC BY-SA 4.0"],"BMW M4":["BMW M4 Coupé (F82) front.JPG","Tokumeigakarinoaoshima","CC0 1.0"],"Porsche 911 GT3 RS":["Porsche 911 GT3 RS - 01.jpg","Oleg Yunakov","CC BY-SA 4.0"],"Lamborghini Huracán":["The frontview of Lamborghini Huracán LP610-4.JPG","Tokumeigakarinoaoshima","CC0 1.0"],"Bugatti Chiron":["A Chiron.jpg","MrWalkr","CC BY-SA 4.0"]};
Object.assign(pinned,{"Toyota Corolla":["2017 Toyota Corolla, Front Left, 01-07-2021.jpg","SsmIntrigue","CC BY-SA 4.0"],"Tesla Model 3":["2024 Tesla Model 3.jpg","Lcaa9","CC BY 4.0"],"Ford Mustang GT":["Ford Mustang GT.JPG","Thomas doerfer","CC BY-SA 3.0"],"luxury penthouse interior":["Modern luxury living room with kitchen interior.jpg","Shixart1985","CC BY 2.0"],"modern apartment interior":["Modern luxury living room with kitchen interior.jpg","Shixart1985","CC BY 2.0"],"wristwatch":["Wrist Watch.jpg","SanoTRajah","CC BY-SA 4.0"],"restaurant interior":["The Beach Restaurant Interior.jpg","riyadh.albalushi","CC BY-SA 2.0"]});
const cache=new Map(), jobs=new Map(), queue=[];let running=0,observer;
const allowed=/^(CC BY(?:-SA)?(?: [\d.]+)?|CC0(?: [\d.]+)?|Public domain|PDM(?: [\d.]+)?)$/i;
const plain=value=>String(value||'').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').trim().slice(0,220);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parse=id=>/^v13-\d+-(\d+)-(\d+)-\d+$/.exec(id);
function subject(id){const m=parse(id);return m?queries[+m[1]]?.[+m[2]]:originals[id];}
function category(id){const m=parse(id);return m?fallback[+m[1]]:null;}
function art(item,fallbackHTML){const q=subject(item.id)||item.name;return '<figure class="wh14-acquisition" data-wh14-id="'+esc(item.id)+'" data-wh14-query="'+esc(q)+'"><div class="wh14-photo-fallback">'+fallbackHTML+'<div class="wh15-photo-fallback-label"><span>'+esc(item.name)+'</span><span>WH</span></div></div><img class="wh14-photo" loading="lazy" decoding="async" alt="'+esc(item.name)+'" hidden><figcaption class="wh14-photo-credit" hidden></figcaption></figure>';}
function read(q){const local=window.WH_ACQUISITION_PHOTOS?.[q];if(local&&valid(local))return local;if(cache.has(q))return cache.get(q);if(pinned[q]){const [title,author,license]=pinned[q],file=encodeURIComponent(title.replaceAll(' ','_'));return {title,author,license,src:'https://commons.wikimedia.org/wiki/Special:FilePath/'+file+'?width=960',page:'https://commons.wikimedia.org/wiki/File:'+file};}if(cache.has(q))return cache.get(q);try{const v=JSON.parse(localStorage.getItem('wh14-photo:'+q)||'null');if(v?.time>Date.now()-30*864e5&&valid(v.data)){cache.set(q,v.data);return v.data;}}catch{}return null;}
function valid(v){return v&&(/^(https:\/\/(upload|thumb)\.wikimedia\.org\/|https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/)/.test(v.src)||/^assets\/acquisitions\/[a-f0-9]{16}\.(png|jpg|webp)$/.test(v.src))&&/^https:\/\/commons\.wikimedia\.org\//.test(v.page)&&allowed.test(v.license)&&typeof v.author==='string';}
function save(q,v){if(v)cache.set(q,v);if(v)try{localStorage.setItem('wh14-photo:'+q,JSON.stringify({time:Date.now(),data:v}));}catch{}}
async function search(q){
 const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:q,gsrnamespace:'6',gsrlimit:'20',prop:'imageinfo',iiprop:'url|size|mime|extmetadata',iiurlwidth:'960',iiextmetadatafilter:'LicenseShortName|Artist|Credit',format:'json',formatversion:'2',origin:'*'});
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),9000);
 try{const res=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:ctrl.signal});if(!res.ok)return null;const body=await res.json();
 const ranked=(body.query?.pages||[]).flatMap(p=>{const i=p.imageinfo?.[0],meta=i?.extmetadata;if(!i||!meta||!/^image\/(png|jpeg|webp)$/.test(i.mime)||i.width<350||i.height<220)return [];
 const value={src:i.thumburl||i.url,page:i.descriptionurl,license:plain(meta.LicenseShortName?.value),author:plain(meta.Artist?.value||meta.Credit?.value)||'Wikimedia Commons',title:p.title.replace(/^File:/,'')};
 if(!valid(value)||/logo|diagram|map|icon|flag|stamp|screenshot|drawing|poster|illustration/i.test(p.title))return [];
 const words=q.toLowerCase().split(/\W+/).filter(w=>w.length>2);const rank=words.filter(w=>p.title.toLowerCase().includes(w)).length*5+(i.mime==='image/png'?1:0)+(i.width/i.height>1.1&&i.width/i.height<2.6?2:0)-(p.index||0)*.15;
 return [{value,rank}];}).sort((a,b)=>b.rank-a.rank);return ranked[0]?.value||null;
 }catch{return null;}finally{clearTimeout(timer);}
}
function request(q){const hit=read(q);if(hit)return Promise.resolve(hit);if(jobs.has(q))return jobs.get(q);
 let resolve;const p=new Promise(r=>resolve=r);jobs.set(q,p);queue.push({q,resolve});pump();return p;}
function pump(){while(running<3&&queue.length){const job=queue.shift();running++;search(job.q).then(v=>{save(job.q,v);job.resolve(v);}).finally(()=>{jobs.delete(job.q);running--;pump();});}}
function showPhoto(el,v,generic){
 return new Promise(resolve=>{
  if(!el.isConnected||!v){resolve(false);return;}
  const img=el.querySelector('img'),credit=el.querySelector('figcaption');let done=false;
  const finish=ok=>{if(done)return;done=true;clearTimeout(timer);img.removeEventListener('load',success);img.removeEventListener('error',failure);resolve(ok);};
  const success=()=>{if(!el.isConnected){finish(false);return;}
   const link=document.createElement('a');link.href=v.page;link.target='_blank';link.rel='noopener noreferrer';link.textContent=(generic?'Referencia · ':'')+v.author+' · '+v.license;link.title=v.title;
   const license=document.createElement('a');license.target='_blank';license.rel='noopener noreferrer';license.textContent='Licencia';license.href=v.license.startsWith('CC BY-SA')?'https://creativecommons.org/licenses/by-sa/'+v.license.split(' ').at(-1)+'/':v.license.startsWith('CC BY')?'https://creativecommons.org/licenses/by/'+v.license.split(' ').at(-1)+'/':v.license.startsWith('CC0')?'https://creativecommons.org/publicdomain/zero/1.0/':v.page;
   img.hidden=false;el.classList.add('has-photo');credit.replaceChildren(link,document.createTextNode(' · '),license);credit.hidden=false;finish(true);
  };
  const failure=()=>{img.hidden=true;el.classList.remove('has-photo');credit.hidden=true;finish(false);};
  const timer=setTimeout(failure,12000);img.addEventListener('load',success);img.addEventListener('error',failure);img.loading='eager';img.src=v.src;
 });
}
async function load(el){
 if(el.dataset.wh14Started)return;el.dataset.wh14Started='1';
 const q=el.dataset.wh14Query,id=el.dataset.wh14Id;
 let v=await request(q);
 if(v&&await showPhoto(el,v,false))return;
 if(!el.isConnected)return;
 if(v){const alternate=await search(q);if(alternate&&alternate.src!==v.src&&await showPhoto(el,alternate,false)){save(q,alternate);return;}}
 if(!el.isConnected)return;
 const general=category(id);
 if(general){const alt=await request(general);if(alt)await showPhoto(el,alt,true);}
}
function hydrate(root){if(!observer&&'IntersectionObserver' in window)observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){observer.unobserve(e.target);load(e.target);}}, {rootMargin:'150px'});
 observer?.disconnect();for(const el of root.querySelectorAll('[data-wh14-id]:not([data-wh14-started])')){if(observer)observer.observe(el);else load(el);}
}
window.WH_V14_ART={art,hydrate,subject,search,read,allQueries:()=>[...new Set([...queries.flat(),...Object.values(originals),...fallback])]};
})();
