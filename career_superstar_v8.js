/* World Hoops V8 — fictional career stories, sponsorships, awards and arena atmosphere. */
(function(){
'use strict';
const D=window.WH_DATA,E=window.WH_CAREER,S=window.WH_STORIES,V=window.WH_V6;
const leagueLogos={nbb:'https://scoutbasketball.com/img/competitions/images/Brazil-Nbb_1721771892.png',china:'https://scoutbasketball.com/img/competitions/images/China-Cba_1653652754.png',lebanon:'https://scoutbasketball.com/img/competitions/images/Lebanon-Division-A_1653652774.jpg',newzealand:'https://scoutbasketball.com/img/competitions/images/New-Zealand-Nbl_1750786654.png',japan:'https://commons.wikimedia.org/wiki/Special:FilePath/B.League%20logo%20(2026).svg',korea:'https://www.footylogos.com/sports-assets/logos/kbl/kbl-logo-footylogos.svg',australia:'https://commons.wikimedia.org/wiki/Special:FilePath/NBL%20Logo.png'};
for(const l of D.leagues)if(leagueLogos[l.id])l.logo=leagueLogos[l.id];
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(x);
const hash=x=>[...String(x)].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);
const teams=Object.values(D.realTeams).flat(),team=id=>teams.find(t=>t.id===id)||{id,name:'Tu club',city:'tu ciudad'};
const brand=(slug)=>'https://cdn.simpleicons.org/'+slug;
const sponsors=[
 ['nike','Nike','Calzado','👟','nike',55,16,100000,'pts'],
 ['adidas','adidas','Calzado','👟','adidas',40,14,72000,'pts'],
 ['puma','PUMA','Calzado','👟','puma',25,10,42000,'pts'],
 ['underarmour','Under Armour','Calzado','👟','underarmour',35,12,56000,'pts'],
 ['newbalance','New Balance','Calzado','👟','newbalance',30,11,48000,'pts'],
 ['reebok','Reebok','Calzado','👟','reebok',20,8,30000,'pts'],
 ['redbull','Red Bull','Bebidas','🥤','redbull',45,13,65000,'win'],
 ['cocacola','Coca-Cola','Bebidas','🥤','cocacola',50,12,80000,'win'],
 ['pepsi','Pepsi','Bebidas','🥤','pepsi',35,10,47000,'win'],
 ['gatorade','Gatorade','Bebidas','🥤','gatorade',30,10,42000,'win'],
 ['samsung','Samsung','Tecnología','📱','samsung',42,12,70000,'eff'],
 ['apple','Apple','Tecnología','📱','apple',65,18,140000,'eff'],
 ['sony','Sony','Tecnología','🎧','sony',35,10,55000,'eff'],
 ['playstation','PlayStation','Gaming','🎮','playstation',45,14,82000,'ast'],
 ['xbox','Xbox','Gaming','🎮','xbox',38,12,60000,'ast'],
 ['twitch','Twitch','Gaming','🎮','twitch',22,8,32000,'ast'],
 ['spotify','Spotify','Entretenimiento','🎵','spotify',28,9,38000,'eff'],
 ['netflix','Netflix','Entretenimiento','🎬','netflix',60,16,110000,'eff'],
 ['youtube','YouTube','Entretenimiento','🎥','youtube',40,12,60000,'eff'],
 ['bmw','BMW','Automóviles','🚗','bmw',55,15,120000,'win'],
 ['mercedes','Mercedes-Benz','Automóviles','🚗','mercedesbenz',70,18,190000,'win'],
 ['toyota','Toyota','Automóviles','🚙','toyota',30,9,55000,'win'],
 ['porsche','Porsche','Automóviles','🏎️','porsche',75,20,220000,'win'],
 ['rolex','Rolex','Moda y lujo','⌚','rolex',80,20,240000,'eff'],
 ['gucci','Gucci','Moda y lujo','👜','gucci',60,16,125000,'eff'],
 ['louisvuitton','Louis Vuitton','Moda y lujo','👜','louisvuitton',72,18,175000,'eff'],
 ['visa','Visa','Finanzas','💳','visa',48,12,85000,'win'],
 ['mastercard','Mastercard','Finanzas','💳','mastercard',50,13,90000,'win'],
 ['mcdonalds',"McDonald's",'Alimentación','🍔','mcdonalds',30,9,42000,'win'],
 ['subway','Subway','Alimentación','🥪','subway',18,7,25000,'win'],
 ['starbucks','Starbucks','Alimentación','☕','starbucks',35,10,52000,'win']
].map(([id,name,category,icon,slug,pop,min,base,goal])=>({id,name,category,icon,logo:brand(slug),pop,min,base,goal}));
const byId=id=>sponsors.find(x=>x.id===id);
const guests=[
 ['Zendaya','cine'],['Timothée Chalamet','cine'],['Tom Holland','cine'],['Michael B. Jordan','cine'],['Margot Robbie','cine'],['Ryan Reynolds','cine'],['Dwayne Johnson','cine'],['Ana de Armas','cine'],['Jenna Ortega','cine'],['Pedro Pascal','cine'],['Keanu Reeves','cine'],['Will Smith','cine'],
 ['Bad Bunny','música'],['Taylor Swift','música'],['Drake','música'],['Beyoncé','música'],['Rihanna','música'],['The Weeknd','música'],['Shakira','música'],['Karol G','música'],['Feid','música'],['J Balvin','música'],['Dua Lipa','música'],['Billie Eilish','música'],['Bruno Mars','música'],['Travis Scott','música'],['Ed Sheeran','música'],['Rosalía','música'],['Ariana Grande','música'],
 ['Ibai Llanos','streaming'],['IShowSpeed','streaming'],['Kai Cenat','streaming'],['MrBeast','creación digital'],['AuronPlay','streaming'],['Rubius','streaming'],['TheGrefg','streaming'],['Spreen','streaming'],['JuanSGuarnizo','streaming'],['Pokimane','streaming'],['Valkyrae','streaming'],['Ninja','streaming'],['Marques Brownlee','creación digital'],['Ludwig','streaming'],['WestCOL','streaming'],['Amouranth','streaming'],
 ['Serena Williams','deporte'],['Lionel Messi','deporte'],['Cristiano Ronaldo','deporte'],['Simone Biles','deporte'],['Lewis Hamilton','deporte'],['Kylian Mbappé','deporte'],['Rafael Nadal','deporte'],['Usain Bolt','deporte'],['Stephen Curry','baloncesto'],['LeBron James','baloncesto'],['Shaquille O’Neal','baloncesto'],['Magic Johnson','baloncesto'],['Pau Gasol','baloncesto'],['Manu Ginóbili','baloncesto'],['Dirk Nowitzki','baloncesto']
];
// Distinct scenarios; each is instantiated per club with local city, teammates and opponent.
const topics=[
 ['🎟️','Abono familiar','Una familia de {city} visita el entrenamiento de {club}.','Invitarlos a ver el calentamiento','Mantener tu rutina','playmaking',5,-1],
 ['🏫','Escuela local','Una escuela de {city} invita a {club} a una clínica.','Enseñar fundamentos','Enviar un mensaje de apoyo','playmaking',6,0],
 ['🎨','Mural de la afición','Los seguidores de {club} preparan un mural del equipo.','Participar con {mate}','Dedicarte al partido','shooting',4,0],
 ['🏀','Reto de triples','{mate} propone un reto de triples en la pista de {city}.','Aceptar el reto','Observar y estudiar su técnica','shooting',4,1],
 ['🎬','Sesión de vídeo','{club} estudia las últimas jugadas de {rival}.','Preparar un informe para todos','Hacer análisis individual','defense',6,-1],
 ['🧤','Entreno defensivo','{mate} pide trabajar las ayudas antes de enfrentar a {rival}.','Practicar cambios defensivos','Concentrarte en tu tiro','defense',6,-2],
 ['🍲','Tradición gastronómica','El vestuario de {club} organiza una comida típica de {city}.','Compartir la comida','Seguir tu dieta estricta','athleticism',5,0],
 ['🚌','Viaje retrasado','El traslado de {club} se retrasa antes del encuentro con {rival}.','Organizar una rutina ligera','Dormir durante la espera','athleticism',3,1],
 ['💬','Capitán preocupado','{mate} necesita consejo antes del partido de {club}.','Escucharlo en privado','Dejar que lo resuelva el entrenador','playmaking',7,-1],
 ['📸','Foto histórica','La afición de {club} solicita una foto colectiva en {city}.','Posar con todos','Pedir que la hagan después','playmaking',4,0],
 ['🧢','Día de la camiseta','{club} organiza una jornada dedicada a su uniforme.','Firmar camisetas con {mate}','Prepararte en silencio','shooting',4,0],
 ['🎧','Lista del vestuario','{mate} te invita a elegir la música del vestuario de {club}.','Crear una lista conjunta','Elegir tu música favorita','athleticism',4,-1],
 ['🧠','Pizarra táctica','El técnico de {club} pide propuestas contra {rival}.','Proponer una jugada colectiva','Proponer una jugada para ti','playmaking',7,-3],
 ['🤝','Bienvenida al novato','Un joven de la cantera de {club} llega al primer equipo.','Presentarlo al grupo','Dejar que se adapte solo','playmaking',6,-2],
 ['🩹','Recuperación','{mate} necesita una sesión de recuperación tras un viaje de {club}.','Acompañarlo con el fisio','Reservar energía para ti','athleticism',5,0],
 ['📚','Examen de cantera','Los jóvenes de {club} te piden consejo para compaginar estudios y deporte.','Compartir tu experiencia','Derivarlos al tutor','playmaking',5,0],
 ['🛡️','Rivalidad amistosa','Los seguidores de {club} llenan la grada ante {rival}.','Motivar al vestuario sin provocar','Prometer una victoria espectacular','defense',5,-3],
 ['🏟️','Aniversario del pabellón','{club} celebra su historia con la afición de {city}.','Dedicar el partido a la afición','Pensar en tu récord personal','shooting',6,-2],
 ['🎁','Juguetes solidarios','Una campaña de {club} recoge juguetes en {city}.','Ayudar con {mate}','Realizar una donación virtual','playmaking',5,1],
 ['🏃','Circuito físico','El preparador de {club} propone un circuito de resistencia.','Trabajar al ritmo del grupo','Intentar romper tu récord','athleticism',4,-2],
 ['🧊','Día de recuperación','Tras un partido exigente, {club} organiza recuperación colectiva.','Seguir el protocolo del equipo','Hacer una sesión extra','athleticism',5,-2],
 ['📻','Radio de la ciudad','La radio de {city} invita a varios jugadores de {club}.','Dar voz al equipo','Centrar la entrevista en ti','playmaking',5,-3],
 ['🎯','Tiros libres','{mate} pide una competición de tiros libres en {club}.','Practicar juntos','Competir por la mejor marca','shooting',5,0],
 ['🎮','Torneo de videojuegos','El vestuario de {club} organiza una tarde de videojuegos.','Jugar por parejas','Retar al mejor jugador','playmaking',5,-1],
 ['🌧️','Cambio de instalaciones','El entrenamiento de {club} cambia de pista por mal tiempo.','Adaptar ejercicios con el grupo','Mantener tu rutina individual','athleticism',3,0],
 ['🧑‍🍳','Concurso de cocina','{mate} propone un concurso de recetas saludables en {city}.','Cocinar en grupo','Hacer tu propia receta','athleticism',5,0],
 ['📈','Datos de rendimiento','El analista de {club} detecta oportunidades ante {rival}.','Revisar datos con {mate}','Usar los datos para tu juego','defense',6,0],
 ['🎙️','Podcast del club','El podcast de {club} quiere entrevistar a dos jugadores.','Invitar a {mate}','Aceptar la entrevista individual','playmaking',5,-2],
 ['🏅','Homenaje a veteranos','{club} celebra a antiguos jugadores en {city}.','Escuchar sus historias','Seguir tu preparación','defense',5,0],
 ['🧳','Primer viaje largo','Un compañero de {club} necesita ayuda para organizar su equipaje.','Ayudarlo antes de salir','Confiar en el personal del club','athleticism',4,0],
 ['🎭','Día temático','La afición de {city} prepara un espectáculo para {club}.','Ensayar una presentación colectiva','Evitar distracciones','shooting',4,1],
 ['📖','Biblioteca comunitaria','{club} participa en una campaña de lectura de {city}.','Leer con los jóvenes','Compartir la campaña en redes','playmaking',5,1],
 ['⚡','Cambio de quinteto','El técnico de {club} ensaya una rotación distinta frente a {rival}.','Ayudar a {mate} a adaptarse','Defender tus minutos','defense',6,-4],
 ['🧩','Escape room','{mate} organiza un reto de coordinación para el vestuario de {club}.','Escuchar y repartir tareas','Liderar todo el desafío','playmaking',6,-2],
 ['🕯️','Noche de leyendas','El pabellón de {city} celebra una noche de leyendas de {club}.','Honrar la historia del club','Buscar tu propio momento histórico','shooting',6,-2],
 ['🎉','Cumpleaños en el vestuario','El equipo de {club} prepara una sorpresa de cumpleaños para un compañero.','Participar con el grupo','Felicitarlos y descansar','playmaking',6,0],
 ['🎄','Fiesta de temporada','La plantilla de {club} prepara una celebración de fin de año.','Participar con moderación','Priorizar descanso','athleticism',5,1],
 ['🪙','Reto solidario','La fundación de {club} premia cada asistencia ante {rival}.','Buscar pases inteligentes','Mantener tu juego habitual','playmaking',6,0],
 ['🧪','Ensayo de zapatillas','{club} prueba nuevo material deportivo antes del partido.','Probarlo con el preparador','Usar el equipo habitual','athleticism',3,1],
 ['🗺️','Ruta por la ciudad','{mate} propone visitar un lugar conocido de {city}.','Compartir una salida corta','Descansar en casa','athleticism',5,0]
];
const localIdentity={ATL:'el ambiente musical de Atlanta',BOS:'la tradición de los campeonatos de Boston',BKN:'la cultura urbana de Brooklyn',CHA:'la tradición del baloncesto de Carolina',CHI:'el legado histórico del baloncesto de Chicago',CLE:'la pasión deportiva de Cleveland',DAL:'la afición de Dallas',DEN:'la altura de Denver',DET:'la identidad trabajadora de Detroit',GSW:'el baloncesto de la Bahía',HOU:'la cultura de Houston',IND:'la tradición cestista de Indiana',LAC:'la afición de Los Ángeles',LAL:'las noches de estrellas de Los Ángeles',MEM:'la cultura musical de Memphis',MIA:'el ambiente de Miami',MIL:'la afición de Milwaukee',MIN:'el invierno de Minnesota',NOP:'la música de Nueva Orleans',NYK:'el ambiente del baloncesto neoyorquino',OKC:'la pasión de Oklahoma City',ORL:'el ambiente familiar de Orlando',PHI:'la afición de Filadelfia',PHX:'el calor de Arizona',POR:'la afición de Portland',SAC:'la comunidad de Sacramento',SAS:'la tradición de San Antonio',TOR:'la cultura multicultural de Toronto',UTA:'la altura de Utah',WAS:'la comunidad de Washington'};
const clubCards={};
for(const t of teams){const list=topics.map((x,i)=>({id:'v8-club-'+t.id+'-'+i,icon:x[0],title:x[1],text:x[2],yes:x[3],no:x[4],stat:x[5],good:x[6],bad:x[7],team:t.id}));clubCards[t.id]=list;}
function core(s){const c=S.core(s);if(!c.v8)c.v8={sponsors:{},contracts:[],clubSeen:{},guestSeen:[],achievements:{},lastSponsor:[],specialSeen:{},events:[]};return c.v8;}
function pushNews(s,title,description,type='spark'){s.news.unshift({title,description,type,season:s.season,week:s.world.week});s.news=s.news.slice(0,28);}
function celebration(s,title,detail,logo){V.core(s).celebrations.push({title,detail,logo});pushNews(s,title,detail,'trophy');}
function achievement(s,id,title,detail,reward=0){const v=core(s);if(v.achievements[id])return false;v.achievements[id]={title,detail,year:s.year,season:s.season,week:s.world.week};s.player.xp+=reward;celebration(s,title,detail);return true;}
function clubEvent(s,t,o){
 const v=core(s),cards=clubCards[t.id]||[],seen=v.clubSeen[t.id]||(v.clubSeen[t.id]=[]);
 if(!cards.length)return null;
 let available=cards.filter(c=>!seen.includes(c.id));if(!available.length){seen.length=0;available=cards;}
 const card=pick(available),mate=pick(E.playerNames(t))||'el capitán';
 const fill=x=>x.replace(/\{(club|city|rival|mate)\}/g,(_,k)=>({club:t.name,city:t.city||'tu ciudad',rival:o?.name||'el rival',mate}[k]));
 const identity=localIdentity[t.abbr]||('la afición de '+(t.city||t.name));
 return {id:card.id,text:card.icon+' '+card.title+' · '+fill(card.text)+' El ambiente refleja '+identity+'.',options:[{label:fill(card.yes),stat:card.stat,v8Chem:card.good,v8Pop:1},{label:fill(card.no),stat:card.stat,v8Chem:card.bad,v8Pop:0}],v8Club:t.id,v8Title:card.title};
}
const specialEvents=[
 ['newyear','🎆 Año Nuevo','El equipo abre el año con un reto de objetivos.',0,'athleticism'],
 ['valentine','💌 Día de la amistad','El vestuario celebra una jornada de compañerismo.',1,'playmaking'],
 ['community','🌱 Semana comunitaria','El club participa en actividades con la ciudad.',2,'playmaking'],
 ['spring','🌷 Festival de primavera','La afición prepara una jornada especial.',3,'shooting'],
 ['family','👪 Noche de las familias','Los familiares de los jugadores visitan el pabellón.',4,'athleticism'],
 ['summer','☀️ Festival de verano','Los aficionados celebran el cierre del curso.',5,'athleticism'],
 ['preseason','🏋️ Campus del club','Una actividad de formación reúne a los jóvenes.',7,'defense'],
 ['halloween','🎃 Halloween','La plantilla organiza un concurso de disfraces.',9,'playmaking'],
 ['thanks','🍂 Noche de agradecimiento','El equipo agradece el apoyo de sus aficionados.',10,'shooting'],
 ['holidays','🎄 Fiestas de invierno','El vestuario prepara una celebración.',11,'athleticism']
];
function seasonal(s){const v=core(s),date=new Date(Date.UTC(s.year,8,1)+Math.floor(365*s.world.week/Math.max(1,s.world.rounds.length))*86400000),m=date.getUTCMonth(),a=specialEvents.find(x=>x[3]===m);if(!a||v.specialSeen[s.season+':'+a[0]])return null;return {id:'v8-special-'+a[0],text:a[1]+' · '+a[2],options:[{label:'Participar con el equipo',stat:a[4],v8Chem:5,v8Gift:1,v8Pop:2},{label:'Descansar y concentrarte',stat:'athleticism',v8Chem:0,v8Energy:5}],v8Special:s.season+':'+a[0],v8Title:a[1]};}
function celebrity(s){const v=core(s);let available=guests.filter(([n])=>!v.guestSeen.includes(n)&&n!==s.player.name&&!E.playerNames(team(s.teamId)).includes(n));if(!available.length){v.guestSeen=[];available=guests;}const [n,type]=pick(available);return {id:'v8-guest-'+n,text:'🌟 En este universo ficticio de World Hoops, '+n+' ('+type+') asiste al partido. Las cámaras enfocan la cancha.',options:[{label:'Mantener la concentración y jugar para el equipo',stat:'playmaking',v8Chem:4,v8Pop:2},{label:'Intentar una jugada espectacular',stat:'shooting',v8Chem:-1,v8Pop:5},{label:'Saludar brevemente y volver a tu rutina',stat:'athleticism',v8Chem:1,v8Pop:1}],v8Guest:n,v8Title:'Invitado especial'};}
const oldPrep=E.preparePregame;
E.preparePregame=function(s,t,o,phase){const prior=S.core(s).pregame;if(prior?.v8)return prior;const p=oldPrep(s,t,o,phase);if(!p||p.v8||p.id?.startsWith('v6-birthday'))return p;const v=core(s),roll=Math.random();const candidate=(!p.id?.startsWith('v6-birthday')&&Math.random()<.35?seasonal(s):null)||(roll<.18?celebrity(s):roll<.80?clubEvent(s,t,o):null);if(candidate){Object.assign(p,candidate,{v8:true,v6:false,guest:null});S.core(s).pregame=p;}return p;};
const oldResolve=E.resolvePregame;
E.resolvePregame=function(s,i){const p=S.core(s).pregame,o=p?.options?.[i],out=oldResolve(s,i);if(!out||!p?.v8||!o)return out;const v=core(s),c=S.core(s),cv=V.core(s);if(p.v8Club){const seen=v.clubSeen[p.v8Club]||(v.clubSeen[p.v8Club]=[]);seen.push(p.id);}if(p.v8Guest)v.guestSeen.push(p.v8Guest);if(p.v8Special)v.specialSeen[p.v8Special]=true;
 const chem=out.success?(o.v8Chem||0):Math.min(-1,(o.v8Chem||0)-4),pop=out.success?(o.v8Pop||0):-(o.v8Pop>=4?2:0);cv.chemistry=clamp(cv.chemistry+chem);c.popularity=clamp(c.popularity+pop);s.fans=Math.max(0,s.fans+pop*70);
 if(out.success&&o.v8Gift){s.player.skills[o.stat]=clamp(s.player.skills[o.stat]+o.v8Gift,1,99);out.choice+=' · Atributo +'+o.v8Gift;}
 if(o.v8Energy)s.player.energy=clamp(s.player.energy+o.v8Energy);
 out.choice+=' · Química '+(chem>0?'+':'')+chem;v.events.unshift({id:p.id,title:p.v8Title,success:out.success,season:s.season,week:s.world.week});v.events=v.events.slice(0,100);return out;};
function value(s,b){return Math.round(b.base*(.4+Math.min(1.1,(D.leagues.find(l=>l.id===s.leagueId)?.quality||70)/100)));}
function goalText(b){return b.goal==='pts'?b.min+' puntos':b.goal==='ast'?'Al menos '+Math.ceil(b.min/3)+' asistencias':b.goal==='win'?'Ganar el partido':'Valoración (PTS + REB + AST×2) ≥ '+(b.min+8);}
function sign(s,id){const b=byId(id),v=core(s),c=S.core(s);if(!b||c.popularity<b.pop||v.sponsors[b.category]||v.lastSponsor.includes(s.season+':'+id))return null;
 const total=value(s,b),contract={id,category:b.category,start:s.season,remaining:6,completed:0,failures:0,paid:Math.round(total*.2),total};v.sponsors[b.category]=contract;c.cash+=contract.paid;v.lastSponsor.push(s.season+':'+id);pushNews(s,'Nuevo patrocinio simulado',b.name+' · '+money(contract.paid)+' de prima.');celebration(s,'¡Nuevo patrocinador!',b.name+' · contrato ficticio de 6 partidos',b.logo);return contract;}
function cancel(s,category){const v=core(s),c=S.core(s),a=v.sponsors[category];if(!a)return null;const b=byId(a.id),fine=Math.min(c.cash,Math.round(a.total*.12));c.cash-=fine;v.contracts.unshift({...a,status:'cancelado',year:s.year});delete v.sponsors[category];return {name:b?.name||a.id,fine};}
function sponsorGame(s,line){const v=core(s),c=S.core(s);for(const [category,a] of Object.entries(v.sponsors)){const b=byId(a.id);if(!b){delete v.sponsors[category];continue;}const ok=!line.dnp&&(b.goal==='pts'?line.pts>=b.min:b.goal==='ast'?line.ast>=Math.ceil(b.min/3):b.goal==='win'?line.win:line.pts+line.reb+line.ast*2>=b.min+8);a.remaining--;if(ok){a.completed++;const bonus=Math.round(a.total*.8/6);a.paid+=bonus;c.cash+=bonus;}else a.failures++;
 if(a.failures>=3||a.remaining<=0){const status=a.failures>=3?'rescindido':'completado';v.contracts.unshift({...a,status,year:s.year});delete v.sponsors[category];pushNews(s,status==='completado'?'Contrato publicitario finalizado':'Contrato publicitario rescindido',b.name+' · '+a.completed+' objetivos cumplidos de 6.',status==='completado'?'spark':'warning');if(status==='completado')achievement(s,'sponsor-'+a.id+'-'+s.season,'Embajador de marca',b.name+' · '+money(a.paid),15);}}
 v.contracts=v.contracts.slice(0,40);}
const oldRecord=E.recordGame;
E.recordGame=function(s,line,...args){const r=oldRecord(s,line,...args);sponsorGame(s,line);if(!line.dnp){
 if(line.pts>=30)achievement(s,'30pts','Noche de 30 puntos','Primera actuación de 30 puntos.',15);
 if(line.pts>=50)achievement(s,'50pts','Noche histórica','Primera actuación de 50 puntos.',30);
 if([line.pts,line.reb,line.ast,line.stl,line.blk].filter(x=>x>=10).length>=3)achievement(s,'triple-double','¡Triple-doble!','Al menos diez en tres categorías.',25);
 if(line.decision?.clutch?.success&&line.win)achievement(s,'clutch','Héroe del último segundo','Una jugada decisiva que termina en victoria.',15);
 if(line.ast>=12)achievement(s,'12ast','Director de juego','12 asistencias en un partido.',15);
 if(line.reb>=15)achievement(s,'15reb','Dominio del rebote','15 rebotes en un partido.',15);
 if(s.fans>=10000)achievement(s,'10kfans','10.000 seguidores','Tu carrera gana visibilidad.',10);
 if(s.fans>=100000)achievement(s,'100kfans','100.000 seguidores','Tu nombre llega a nuevos aficionados.',25);
 }return r;};
function trophy(s,title,detail){if(s.awards.some(a=>a.title===title&&a.year===s.year))return;s.awards.push({title,year:s.year,team:team(s.teamId).name});celebration(s,title,detail);}
const oldFinalize=V.finalize;
V.finalize=function(s){oldFinalize(s);const games=s.world.playerGames.filter(x=>!x.dnp&&x.stage==='regular'),n=games.length;if(n>=Math.max(4,s.world.week*.45)){const avg=k=>games.reduce((sum,g)=>sum+(g[k]||0),0)/n;
 const rows=V.rankings(s).filter(r=>r.gp>=Math.max(4,s.world.week*.45)),me=rows.find(r=>r.id===s.teamId&&r.name===s.player.name);
 if(me&&rows.sort((a,b)=>(b.spg*2+b.bpg*2+b.rpg*.5)-(a.spg*2+a.bpg*2+a.rpg*.5))[0]===me)trophy(s,'Defensor del año','Líder en valoración defensiva de la liga.');
 if(s.season===1&&avg('pts')+avg('ast')*2+avg('reb')>=26)trophy(s,'Novato del año · World Hoops','Gran rendimiento en tu primera temporada.');
 if(avg('min')<24&&avg('pts')>=15)trophy(s,'Sexto hombre · World Hoops','Impacto destacado con minutos de rotación.');
 const finals=s.world.playerGames.filter(x=>x.stage==='final'&&!x.dnp);if(s.world.champion===s.teamId&&finals.some(g=>g.pts+g.reb+g.ast*2>=30))trophy(s,'MVP de la final · World Hoops','Actuación decisiva en la final.');
 const prev=s.history?.find(x=>x.season===s.season-1);if(prev&&avg('pts')>=prev.stats.ppg+5)trophy(s,'Jugador más mejorado','Promedio de puntos al menos 5 superior al año anterior.');
 }
 const rec=s.history?.[0];if(rec?.season===s.season)rec.awards=[...new Set([...rec.awards,...s.awards.filter(a=>a.year===s.year).map(a=>a.title)])];
};
function logo(b){return '<span class="v8-brand-logo"><img src="'+esc(b.logo)+'" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>'+b.icon+'</span></span>';}
function sponsorPanel(s){const v=core(s),c=S.core(s);return '<section class="v6-panel"><div class="v6-kicker">💼 CONTRATOS COMERCIALES</div><h2>Patrocinios</h2><p>Marcas reales; acuerdos, ofertas y cifras exclusivamente ficticios. Un contrato por categoría, seis partidos de duración. Tres objetivos fallidos rescinden el acuerdo.</p><div class="v6-metrics"><div>Popularidad<strong>'+Math.round(c.popularity)+'/100</strong></div><div>Contratos activos<strong>'+Object.keys(v.sponsors).length+'</strong></div><div>Ingresos comerciales<strong>'+money([...Object.values(v.sponsors),...v.contracts].reduce((a,x)=>a+x.paid,0))+'</strong></div></div><div class="v8-sponsors">'+sponsors.map(b=>{const active=v.sponsors[b.category],mine=active?.id===b.id,blocked=!!active||c.popularity<b.pop||v.lastSponsor.includes(s.season+':'+b.id);return '<article class="v8-sponsor">'+logo(b)+'<b>'+esc(b.name)+'</b><small>'+b.icon+' '+esc(b.category)+'</small><strong>'+money(value(s,b))+'</strong><small>Objetivo: '+esc(goalText(b))+'</small><small>Popularidad mínima: '+b.pop+'</small>'+(mine?'<p>Activo · '+active.remaining+' partidos · '+active.completed+' objetivos</p><button class="btn ghost" data-action="v8-cancel" data-category="'+esc(b.category)+'">Rescindir (penalización)</button>':'<button class="btn primary" data-action="v8-sign" data-id="'+b.id+'" '+(blocked?'disabled':'')+'>'+(active?'Categoría ocupada':c.popularity<b.pop?'Bloqueado':'Firmar oferta')+'</button>')+'</article>';}).join('')+'</div><h3>Historial de acuerdos</h3>'+(v.contracts.slice(0,10).map(a=>'<p>'+esc(byId(a.id)?.name||a.id)+' · '+esc(a.status)+' · '+money(a.paid)+'</p>').join('')||'<p>Todavía no hay contratos cerrados.</p>')+'</section>';}
function achievementPanel(s){const v=core(s);return '<section class="v6-panel"><div class="v6-kicker">✨ HITOS DE CARRERA</div><h2>Logros desbloqueados</h2><div class="v8-achievements">'+Object.values(v.achievements).map(a=>'<article><span>🏅</span><b>'+esc(a.title)+'</b><small>'+esc(a.detail)+' · '+a.year+'</small></article>').join('')+'</div>'+(Object.keys(v.achievements).length?'':'<p>Tus primeras grandes actuaciones desbloquearán celebraciones.</p>')+'</section>';}
function atmosphere(s,opponent,phase){const t=team(s.teamId),o=team(opponent);const pairs=[['BOS','LAL'],['LAL','LAC'],['NYK','BKN'],['CHI','DET'],['GSW','SAC'],['MIA','ORL'],['DAL','HOU'],['DAL','SAS'],['BOS','PHI'],['CLE','GSW'],['NYK','BOS'],['TOR','BOS']];
 const rivalry=pairs.some(p=>p.includes(t.abbr)&&p.includes(o.abbr)&&t.abbr!==o.abbr)||!!(o.city&&t.city===o.city&&t.id!==o.id);
 if(phase==='playoffs')return {title:s.world.playoffs?.round===1?'GRAN FINAL':'SEMIFINAL',kind:'final'};
 if(rivalry)return {title:'NOCHE DE RIVALIDAD',kind:'rival'};
 if(s.world.week===0)return {title:'NOCHE INAUGURAL',kind:'opening'};
 if(s.world.week===s.world.rounds.length-1)return {title:'ÚLTIMA JORNADA',kind:'final'};
 return null;}
function lights(title,kind='final'){return '<div class="v8-arena v8-'+esc(kind)+'" aria-hidden="true"><div class="v8-beam"></div><div class="v8-beam"></div><div class="v8-beam"></div><span class="v8-arena-ball">🏀</span><strong>'+esc(title)+'</strong><div class="v8-sparks">'+Array.from({length:16},(_,i)=>'<i style="--n:'+i+'"></i>').join('')+'</div></div>';}
function decorateResult(html,s,result){if(!result)return html;const op=result.home===s.teamId?result.away:result.home;const special=atmosphere(s,op,result.stage==='regular'?'regular':'playoffs');const p=s.world.lastMatch?.player;if(!special&&!p?.decision?.clutch?.success&&!(p?.pts>=30))return html;return html.replace('<div class="result-kicker">',lights(special?.title||(p?.pts>=30?'ACTUACIÓN ESTELAR':'JUGADA DECISIVA'),special?.kind||'highlight')+'<div class="result-kicker">');}
window.WH_V8={core,sponsors,sign,cancel,sponsorPanel,achievementPanel,clubCards,guests,atmosphere,lights,decorateResult,achievement};
})();