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
Object.assign(pinned,{"Subaru WRX":["2022 Subaru WRX front.jpg","DestinationFearFan","CC BY-SA 4.0"],"Kia K5":["2021 Kia K5 white front.jpg","Throwawayacc222","CC0 1.0"],"Nissan GT-R":["Nissan GT-R (4BA-R35) front.jpg","Tokumeigakarinoaoshima","CC BY-SA 4.0"],"Lexus IS":["2021 Lexus IS300 F-Sport, Front Left, 10-10-2021.jpg","Elise240SX","CC BY-SA 4.0"],"Hyundai Elantra":["2021 Hyundai Elantra SEL (Canada), front 8.28.21.jpg","Kevauto","CC BY-SA 4.0"],"Audi A4":["Audi A4 S line Package (B9) front.JPG","Tokumeigakarinoaoshima","CC BY-SA 4.0"],"Chevrolet Corvette":["2021 Chevrolet Corvette C8 front.jpg","DestinationFearFan","CC BY-SA 4.0"],"Volkswagen Golf":["2020 Volkswagen Golf Style ETSi S-A 1.5 Front.jpg","Vauxford","CC BY-SA 4.0"],"Mercedes AMG C43":["Mercedes-AMG C 43 4MATIC STATIONWAGON (S205) front.jpg","Tokumeigakarinoaoshima","CC BY-SA 4.0"],"Mazda3":["Mazda3 Hatchback.JPG","Bull-Doser","Public domain"]});
Object.assign(pinned,{"Honda CB650R":["2021 Honda CB650R.png","Chanokchon","CC BY-SA 4.0"],"Yamaha MT-07":["Yamaha MT-07.jpg","Na-Thur","CC BY-SA 3.0"],"Kawasaki Ninja motorcycle":["Kawasaki Ninja650.jpg","Tokumeigakarinoaoshima","CC BY-SA 4.0"],"Ducati Monster":["Monster 696.JPG","Kaczorjunior","CC BY-SA 3.0"],"Triumph Street Triple":["Triumph Street Triple 675 front.jpg","lmnop88a","CC BY 2.0"],"BMW S1000RR":["BMW S1000RR.jpg","Massimo","CC BY 2.0"],"Suzuki Hayabusa":["Hayabusa.jpg","Yuichiro Katsumoto","CC BY-SA 2.0"],"Ducati Panigale":["Ducati Panigale V4S 2025.jpg","AVMOTO","CC BY-SA 4.0"],"gym dumbbells":["A close-up view of a set of heavy dumbbells.jpg","Shixart1985 (Nenad Stojković)","CC BY 2.0"],"treadmill gym":["Treadmill-gym.jpg","GhoziSeptiandri","CC BY-SA 4.0"],"stationary exercise bike":["Stationary bike.jpg","Corn cheese","CC BY-SA 4.0"],"indoor basketball training court":["Indoor Basket ball stadium.jpg","Sathishnayak","CC BY-SA 4.0"],"Paris Eiffel Tower":["Eiffel Tower Paris France.jpg","TorbeyCharbel","CC BY 4.0"],"Rome Colosseum":["01 Colosseum Exterior.jpg","NateBergin","CC BY 4.0"],"New York skyline":["New York City, Skyline.jpg","Davidswiki","CC BY-SA 4.0"]});
// Exact item and tier references. Never reuse the same file for another card.
const tierPhotos={
 "3-0-0": [
  "Adidas Stan Smiths sneaker.jpg",
  "Jason V",
  "CC BY 2.0",
  "Adidas Stan Smith"
 ],
 "3-0-1": [
  "Nike Air Jordan I.jpg",
  "Osyffar",
  "CC0 1.0",
  "Nike Air Jordan 1"
 ],
 "3-0-2": [
  "2023-07-15-Balenciaga-Arena.jpg",
  "Mossmoon",
  "CC BY-SA 4.0",
  "Balenciaga Arena"
 ],
 "3-1-0": [
  "Sutu(Men's tailored suit).jpg",
  "Gaone1991",
  "CC0 1.0",
  "Traje de ceremonia"
 ],
 "3-1-1": [
  "Gentlemen's attire.jpg",
  "Oxfordian Kissuth",
  "CC BY-SA 3.0",
  "Traje de tres piezas"
 ],
 "3-1-2": [
  "Men's suit.JPG",
  "Eguanakla",
  "CC BY-SA 4.0",
  "Eguana Kampala"
 ],
 "3-5-0": [
  "Air Jordan I High OG « Next Chapter ».jpg",
  "HI 622",
  "CC BY-SA 4.0",
  "Air Jordan 1 High OG Next Chapter"
 ],
 "3-5-1": [
  "2023-07-15-Balenciaga-High.jpg",
  "Mossmoon",
  "CC BY-SA 4.0",
  "Balenciaga High"
 ],
 "3-5-2": [
  "2023-07-15-Balenciaga-Triple-S-1.jpg",
  "Mossmoon",
  "CC BY-SA 4.0",
  "Balenciaga Triple S"
 ],
 "3-6-1": [
  "Rimowa Koffer Topas-Serie.jpg",
  "1971markus",
  "CC BY-SA 4.0",
  "Rimowa Topas"
 ],
 "3-6-2": [
  "RIMOWA Photo.jpg",
  "Andermann",
  "CC BY-SA 4.0",
  "Rimowa Original Cabin"
 ],
 "3-7-1": [
  "Rayban Aviator.jpg",
  "Ulaupo",
  "CC BY 4.0",
  "Ray-Ban Aviator"
 ],
 "3-7-2": [
  "B&L Ray-Ban Leathers Outdoorsman II.jpg",
  "Tyrol5",
  "CC BY-SA 4.0",
  "Ray-Ban Outdoorsman II Vintage"
 ],
 "3-9-0": [
  "Leather boots.jpg",
  "Gioele Serra",
  "CC0 1.0",
  "Botas de cuero"
 ],
 "3-9-1": [
  "Brown Dr. Martens leather boots from 2007.jpeg",
  "Mishimishimishi",
  "Public domain",
  "Dr. Martens"
 ],
 "3-9-2": [
  "Leather boots men's.jpg",
  "Petar Milošević",
  "CC BY-SA 4.0",
  "Botas de cuero"
 ],
 "2-1-0": [
  "Loft interior.jpg",
  "globalreset",
  "CC BY-SA 2.0",
  "Loft abierto"
 ],
 "2-1-1": [
  "400SGreenLoft.jpg",
  "Jennifer D. Ames",
  "CC BY-SA 3.0",
  "Loft de Chicago"
 ],
 "2-1-2": [
  "Luxury Residential Apartments (Loft).JPG",
  "MichelleC28",
  "CC BY-SA 4.0",
  "Loft residencial de lujo"
 ],
 "2-2-1": [
  "The Lauren condo Bethesda MD 2021-12-12 10-11-55 1.jpg",
  "G. Edward Johnson",
  "CC BY 4.0",
  "Condominio The Lauren"
 ],
 "2-3-0": [
  "New Jersey Suburban house on Sunny evening 2016.jpg",
  "Shakher59",
  "CC BY-SA 4.0",
  "Casa suburbana"
 ],
 "2-3-1": [
  "Large Salinas house.jpg",
  "Brendel",
  "CC BY-SA 2.5",
  "Residencia amplia"
 ],
 "2-3-2": [
  "Modern suburban house in the outskirts - Ljubljana, Slovenia.jpg",
  "Sebastiaan Broekhoven",
  "CC BY-SA 4.0",
  "Residencia contemporánea"
 ],
 "2-4-1": [
  "Duerenstr-35-37 MG 3328.jpg",
  "Sozi",
  "CC0 1.0",
  "Dúplex residencial"
 ],
 "2-6-0": [
  "Là-haut sur la montagne, l'était un vieux chalet!.jpg",
  "Jeremy Blatti",
  "CC BY-SA 4.0",
  "Chalet alpino"
 ],
 "2-8-0": [
  "Vanderbilt Mansion, Hyde Park, 2012-06-25, 01.jpg",
  "Cbaile19",
  "CC0 1.0",
  "Mansión clásica · referencia"
 ],
 "2-10-0": [
  "Swimming pool with house.jpg",
  "Rubini Manikandan",
  "CC BY-SA 4.0",
  "Residencia con piscina"
 ],
 "2-10-1": [
  "Pool and main house of Virginia Robinson Estate.JPG",
  "Zigzig20s",
  "CC BY-SA 3.0",
  "Residencia con piscina y jardín"
 ],
 "chef": [
  "Chef cuts a piece of grilled meat on a wooden board in a kitchen setting.jpg",
  "Shixart1985",
  "CC BY 2.0",
  "Chef personal"
 ],
 "nutrition": [
  "Healthy meal prep with fresh salad, fruits, and planning tools displayed on a table.jpg",
  "Shixart1985",
  "CC BY 2.0",
  "Plan de alimentación"
 ],
 "gym": [
  "Woman performing plank exercise at home gym.jpg",
  "Shixart1985",
  "CC BY 2.0",
  "Entrenamiento en casa"
 ],
 "10-0-0": [
  "Preparing chicken.jpg",
  "Susan565",
  "CC0 1.0",
  "Servicio de cocina"
 ],
 "10-0-1": [
  "Demonstration Kitchen 2024.jpg",
  "Whoisjohngalt",
  "CC0 1.0",
  "Chef profesional"
 ],
 "6-3-0": [
  "Healthy meal planning with fresh fruits and vegetables in a bright kitchen setting.jpg",
  "Shixart1985",
  "CC BY 2.0",
  "Plan nutricional"
 ]
};
let observer;const assigned=new Map(),used=new Set();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parse=id=>/^v13-\d+-(\d+)-(\d+)-(\d+)$/.exec(id);
function baseSubject(id){const m=parse(id);return m?queries[+m[1]]?.[+m[2]]:originals[id];}
function subject(id){return id;}
const fileKey=t=>t.normalize('NFC').replaceAll('_',' ').toLowerCase();
function register(id,entry){
 if(!entry||assigned.has(id)||used.has(fileKey(entry[0])))return;
 const [title,author,license,model]=entry;used.add(fileKey(title));assigned.set(id,{title,author,license,model:model||null});
}
function configure(items){
 assigned.clear();used.clear();
 for(const i of items){const m=parse(i.id),key=m?m.slice(1).join('-'):i.id;register(i.id,tierPhotos[key]);}
 // A base-model photograph belongs to a single base edition, not all variants.
 for(const i of items){const m=parse(i.id);if(m&&+m[3]!==0)continue;register(i.id,pinned[baseSubject(i.id)]);}
}
function read(id){
 const v=assigned.get(id);if(!v)return null;
 const file=encodeURIComponent(v.title.replaceAll(' ','_')),page='https://commons.wikimedia.org/wiki/File:'+file,local=window.WH_ACQUISITION_PHOTOS?.[id];
 if(local?.title===v.title&&local.author===v.author&&local.license===v.license&&/^assets\/acquisitions\/[a-f0-9]{16}\.(png|jpg|webp)$/.test(local.src))return {...v,src:local.src,page};
 return {...v,src:'https://commons.wikimedia.org/wiki/Special:FilePath/'+file+'?width=500',page};
}
function art(item){
 const v=read(item.id);
 return '<figure class="wh14-acquisition wh153-acquisition" data-wh14-id="'+esc(item.id)+'" data-wh14-query="'+esc(item.id)+'"><div class="wh14-photo-fallback wh153-no-photo"><span>WORLD HOOPS / '+esc(item.prestige||'CATÁLOGO')+'</span><strong>'+esc(item.name)+'</strong><small>'+(v?'Cargando fotografía…':'Fotografía pendiente de revisión')+'</small></div><img class="wh14-photo" loading="lazy" decoding="async" alt="'+esc(v?.model||item.name)+'" hidden><figcaption class="wh14-photo-credit" hidden></figcaption></figure>'+(v?.model?'<div class="wh153-model">'+esc(v.model)+'</div>':'');
}
async function search(id){return read(id);}
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
  const failure=()=>{img.hidden=true;el.classList.remove('has-photo');credit.hidden=true;const msg=el.querySelector('.wh153-no-photo small');if(msg)msg.textContent='Fotografía no disponible';finish(false);};
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
window.WH_V14_ART={art,hydrate,subject,baseSubject,configure,search,read,allQueries:()=>[...assigned.keys()],approved:()=>[...assigned.keys()]};
})();
