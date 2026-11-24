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
Object.assign(pinned,{"casual sneakers":["Air Force 1.JPG","Xanor","CC0 1.0"],"basketball shoes":["Air Force 1.JPG","Xanor","CC0 1.0"],"designer jacket":["Leather Jacket (51011162080).jpg","ajay_suresh","CC BY 2.0"],"travel suitcase":["Suitcase.jpg","Appraiser","Public domain"],"sports wristwatch":["Garmin Forerunner 55.jpg","Melyanac","CC0 1.0"],"diving watch":["Seiko SKX781 Orange Monster diver watch (2026-02-13).jpg","Olgierd Rudak","CC BY-SA 4.0"],"smartwatch":["Garmin Forerunner 55.jpg","Melyanac","CC0 1.0"],"smartphone":["IPhone 15 pro model.jpg","WikiGrower1","CC BY 4.0"],"physical therapy sports":["Man receives a leg treatment while lying on a clinic examination bed.jpg","Shixart1985","CC BY 2.0"],"billiard table":["Billiards table.jpg","Kurt Kaiser","CC0 1.0"],"electric guitar":["Guitarra Electrica.jpg","Prácticas Intraescolares","CC BY-SA 4.0"],"OLED television":["Oled tv.jpg","Merlinmula","CC BY-SA 4.0"],"music recording studio":["Rock Factory Recording Studio control room.jpg","Mike Logan","CC BY-SA 3.0"],"recording studio":["Mixing console setup in a modern studio showcasing professional sound equipment and controls undefined.jpg","Shixart1985","CC BY 2.0"]});
Object.assign(pinned,{"video game console":["PlayStation 5 and DualSense.jpg","Osh33m","CC BY-SA 4.0"],"cryotherapy chamber":["Whole Body Electric Cryotherapy Chamber.jpg","Mwlsn11","CC BY-SA 4.0"],"home cinema theater":["Home theater 1.jpg","NPat318","CC BY-SA 4.0"],"laptop computer":["Laptop PC.jpg","KK IN HK","CC BY-SA 4.0"],"sports massage therapy":["DoD Warrior Games 2016 160618-A-UN836-017.jpg","Master Sgt. D. Keith Johnson","Public domain"],"video gaming room":["Simple Setup Image.jpg","Muhammed-Huseyin Arikan","CC0 1.0"]});
let observer;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parse=id=>/^v13-\d+-(\d+)-(\d+)-\d+$/.exec(id);
function subject(id){const m=parse(id);return m?queries[+m[1]]?.[+m[2]]:originals[id];}
function art(item,fallbackHTML){const q=subject(item.id)||item.name;return '<figure class="wh14-acquisition" data-wh14-id="'+esc(item.id)+'" data-wh14-query="'+esc(q)+'"><div class="wh14-photo-fallback">'+(window.WH_V151_ART?.illustrate(item,q)||fallbackHTML)+'<div class="wh15-photo-fallback-label"><span>'+esc(item.name)+'</span><span>WH</span></div></div><img class="wh14-photo" loading="lazy" decoding="async" alt="'+esc(item.name)+'" hidden><figcaption class="wh14-photo-credit" hidden></figcaption></figure>';}
function read(q){
 if(!Object.hasOwn(pinned,q))return null;
 const [title,author,license]=pinned[q],file=encodeURIComponent(title.replaceAll(' ','_'));
 const page='https://commons.wikimedia.org/wiki/File:'+file,local=window.WH_ACQUISITION_PHOTOS?.[q];
 // Ignore any image obtained by the old approximate search, including cached/local candidates.
 if(local?.title===title&&local.author===author&&local.license===license&&/^assets\/acquisitions\/[a-f0-9]{16}\.(png|jpg|webp)$/.test(local.src))return {...local,page};
 return {title,author,license,src:'https://commons.wikimedia.org/wiki/Special:FilePath/'+file+'?width=640',page};
}
async function search(q){return read(q);}
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
 const v=read(el.dataset.wh14Query);if(v)await showPhoto(el,v,false);
}
function hydrate(root){if(!observer&&'IntersectionObserver' in window)observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){observer.unobserve(e.target);load(e.target);}}, {rootMargin:'150px'});
 observer?.disconnect();for(const el of root.querySelectorAll('[data-wh14-id]:not([data-wh14-started])')){if(observer)observer.observe(el);else load(el);}
}
window.WH_V14_ART={art,hydrate,subject,search,read,allQueries:()=>Object.keys(pinned),approved:()=>Object.keys(pinned)};
})();
