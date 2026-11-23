/* World Hoops: 150 cartas de entrenamiento, eventos y jugadores NBA 2026–27. */
(function(){
'use strict';
const E=window.WH_CAREER;if(!E)return;
const RARITIES=[
 {id:'common',name:'COMÚN',weight:50,level:0,success:.82,energy:-8},
 {id:'uncommon',name:'POCO COMÚN',weight:28,level:1,success:.73,energy:-12},
 {id:'epic',name:'ÉPICA',weight:13,level:2,success:.63,energy:-16},
 {id:'legendary',name:'LEGENDARIA',weight:7,level:3,success:.53,energy:-21},
 {id:'mythic',name:'MÍTICA',weight:2,level:4,success:.44,energy:-26}
];
const DRILLS=[
 ['Tiro de esquina','shooting','playmaking','Series rápidas desde ambas esquinas.','defense'],
 ['Francotirador de triples','shooting','athleticism','Lanzamientos de tres con marcadores encima.','defense'],
 ['Tiro bajo presión','shooting','playmaking','Simula un cierre de partido delante de la afición.','athleticism'],
 ['Media distancia letal','shooting','athleticism','Domina la zona del codo y el tiro tras bote.','defense'],
 ['Línea de tiros libres','shooting','playmaking','Entrena la serenidad cuando todo depende de ti.','athleticism'],
 ['Catch and shoot','shooting','playmaking','Recibe, gira y lanza con la defensa encima.','defense'],
 ['Tiros imposibles','shooting','athleticism','Trabaja el equilibrio en lanzamientos difíciles.','defense'],
 ['Rutina del anotador','shooting','playmaking','Repite tiros tras pantalla y paradas rápidas.','athleticism'],
 ['Visión de juego','playmaking','shooting','Encuentra al compañero libre antes que la defensa.','defense'],
 ['Pick and roll','playmaking','shooting','Coordina bloqueos con el interior de tu equipo.','athleticism'],
 ['Pases sin mirar','playmaking','athleticism','Mejora la creatividad en transiciones rápidas.','defense'],
 ['Lectura del rival','playmaking','defense','Analiza movimientos y anticipa las ayudas.','athleticism'],
 ['Control del balón','playmaking','athleticism','Trabajo a dos manos con contacto constante.','shooting'],
 ['Transición perfecta','playmaking','athleticism','Organiza la contra mientras corres a máxima velocidad.','defense'],
 ['Director de orquesta','playmaking','defense','Decide cuándo acelerar y cuándo pausar.','shooting'],
 ['Asistencias de élite','playmaking','shooting','Pases al hueco y sincronización con tus compañeros.','athleticism'],
 ['Marcaje individual','defense','athleticism','Aguanta a los anotadores en el uno contra uno.','shooting'],
 ['Manos veloces','defense','playmaking','Lectura de pases, robos y manos activas.','shooting'],
 ['Protección del aro','defense','athleticism','Posicionamiento interior y tapones sin falta.','playmaking'],
 ['Rotaciones defensivas','defense','playmaking','Cubre las ayudas en sistemas cambiantes.','shooting'],
 ['Persecución de tiradores','defense','athleticism','Navega pantallas y llega a puntear triples.','playmaking'],
 ['Cierre de rebote','defense','athleticism','Domina la posición y asegura cada balón.','shooting'],
 ['Defensa sin faltas','defense','playmaking','Entrena la paciencia ante ataques agresivos.','athleticism'],
 ['Muro en la pintura','defense','athleticism','Resiste el contacto y corta penetraciones.','shooting'],
 ['Velocidad explosiva','athleticism','defense','Mejora primeros pasos y cambios de dirección.','shooting'],
 ['Mate y finalización','athleticism','shooting','Termina por encima del aro y absorbe contacto.','playmaking'],
 ['Piernas de acero','athleticism','defense','Trabaja saltos, aceleración y estabilidad.','playmaking'],
 ['Circuito de resistencia','athleticism','playmaking','Mantén el ritmo durante todo el encuentro.','shooting'],
 ['Potencia en el poste','athleticism','defense','Gana espacio cerca de la canasta.','playmaking'],
 ['Recuperación activa','athleticism','defense','Movilidad, respiración y prevención de fatiga.','shooting']
];
const CARDS=DRILLS.flatMap((d,i)=>RARITIES.map((rarity,level)=>({
 id:'training-'+i+'-'+level,title:d[0]+(level?' · '+['','PRO','ALL-STAR','ÉLITE','LEYENDA'][level]:''),
 desc:d[3],focus:d[1],support:d[2],penalty:d[4],rarity:rarity.id,rarityLabel:rarity.name,
 tier:level,potential:1+level+(level>2?1:0),risk:Math.round((1-rarity.success)*100),energy:rarity.energy
})));
const NBA={
 ATL:['Jalen Johnson','CJ McCollum','Nickeil Alexander-Walker'],
 BOS:['Jayson Tatum','Paul George'],
 BKN:['Julius Randle'],
 CHA:['Kon Knueppel','LaMelo Ball'],
 CHI:['Josh Giddey','Matas Buzelis','Buddy Hield'],
 CLE:['James Harden','Donovan Mitchell','Evan Mobley','Jarrett Allen','Peyton Watson'],
 DAL:['Kyrie Irving','Cooper Flagg'],
 DEN:['Nikola Jokić','DeMar DeRozan'],
 DET:['Cade Cunningham'],
 GSW:['Stephen Curry','Draymond Green','Jimmy Butler'],
 HOU:['Kevin Durant','Alperen Şengün'],
 IND:['Pascal Siakam','Braden Smith'],
 LAC:['Darius Garland','Brandon Ingram','Max Strus'],
 LAL:['Luka Dončić'],
 MEM:['Ty Jerome','Cameron Boozer','GG Jackson II','Scotty Pippen Jr.'],
 MIA:['Giannis Antetokounmpo','Bam Adebayo'],
 MIL:['Jaime Jaquez Jr.'],
 MIN:['Anthony Edwards','Rudy Gobert'],
 NOP:['DeAndre Jordan'],
 NYK:['Jalen Brunson'],
 OKC:['Shai Gilgeous-Alexander'],
 ORL:['Paolo Banchero','Franz Wagner','Desmond Bane'],
 PHI:['LeBron James','Joel Embiid','Jaylen Brown'],
 PHX:['Devin Booker'],
 POR:['Damian Lillard','Ja Morant'],
 SAC:['Zach LaVine','Keegan Murray','Domantas Sabonis'],
 SAS:['Victor Wembanyama','Stephon Castle'],
 TOR:['Kawhi Leonard','Scottie Barnes'],
 UTA:['Lauri Markkanen','Keyonte George'],
 WAS:['Anthony Davis']
};
const OLD={
 CLE:'James Harden',GSW:'Stephen Curry',LAL:'Luka Dončić',DEN:'Nikola Jokić',
 MIL:'Giannis Antetokounmpo',OKC:'Shai Gilgeous-Alexander',SAS:'Victor Wembanyama',
 NYK:'Jalen Brunson',MIN:'Anthony Edwards',BOS:'Jayson Tatum'
};
const PREGAME_SEEDS=[
 ['{star} te propone una charla táctica antes de enfrentar a {rival}.','Escuchar y estudiar la jugada|playmaking','Ignorar el consejo y entrenar tiro|shooting','Concentrarte en tu defensa|defense'],
 ['Un reportero te pregunta si puedes superar a {opponentStar}.','Prometer una noche histórica|shooting','Hablar bien del rival|playmaking','Responder en la cancha|defense'],
 ['Has dormido mal tras el viaje a la cancha de {rival}.','Dormir una siesta|athleticism','Hacer tiros para activarte|shooting','Analizar videos con el cuerpo técnico|playmaking'],
 ['El entrenador plantea cambiar tu función para este partido.','Pedir más tiros|shooting','Aceptar como creador|playmaking','Ofrecerte para defender al líder|defense'],
 ['{star} no está fino en los calentamientos.','Animarlo y asistir|playmaking','Asumir más tiros|shooting','Trabajar juntos en defensa|defense'],
 ['Los aficionados de {rival} silban tu nombre al entrar.','Buscar el espectáculo|athleticism','No hacer caso|playmaking','Usar la presión para defender más|defense'],
 ['La prensa habla de una posible rivalidad con {opponentStar}.','Retarlo desde el triple|shooting','Enfocarte en el equipo|playmaking','Marcarlo a toda cancha|defense'],
 ['Una molestia muscular aparece en el calentamiento.','Reducir carga para protegerte|defense','Jugar al límite|athleticism','Apostar por tiros sin contacto|shooting'],
 ['Hay tensión en el vestuario antes de enfrentar a {rival}.','Dar un discurso de unión|playmaking','Concentrarte solo en anotar|shooting','Liderar con defensa|defense'],
 ['Te ofrecen una breve entrevista antes de saltar a pista.','Prometer un triple importante|shooting','Hablar del juego colectivo|playmaking','Elogiar la defensa del equipo|defense'],
 ['{star} te desafía a una competencia amistosa en el calentamiento.','Competir a triples|shooting','Competir en pases de precisión|playmaking','Competir en velocidad|athleticism'],
 ['La sesión de video revela un punto débil de {rival}.','Atacar desde fuera|shooting','Buscar pases a la pintura|playmaking','Presionar sus pérdidas|defense'],
 ['El entrenador te pregunta cómo quieres cerrar el partido.','Ser la primera opción|shooting','Crear para {star}|playmaking','Defender al mejor de {rival}|defense'],
 ['Un antiguo compañero te envía un mensaje antes del encuentro.','Usarlo de motivación|athleticism','Recordar los consejos tácticos|playmaking','Concentrarte en las marcas|defense'],
 ['El hotel de concentración tuvo una noche ruidosa.','Recuperar fuerzas|athleticism','Practicar tus tiros habituales|shooting','Meditar y leer la estrategia|playmaking'],
 ['El fisio recomienda una preparación especial.','Movilidad y descanso|athleticism','Activación de hombros para lanzar|shooting','Trabajar desplazamientos laterales|defense'],
 ['Una estrella de la NBA aparece en las gradas viendo a {club}.','Demostrar tu talento anotador|shooting','Crear una jugada espectacular|playmaking','Ofrecer un tapón memorable|defense'],
 ['Algunos aficionados esperan tu autógrafo en la entrada.','Quedarte a saludarlos|playmaking','Mantener tu rutina de tiros|shooting','Ir a descansar|athleticism'],
 ['El rival anuncia una alineación muy física.','Trabajar finalizaciones con contacto|athleticism','Buscar tiros abiertos|shooting','Preparar defensa intensa|defense'],
 ['Se corta el calentamiento por un problema técnico.','Mantener la concentración|playmaking','Hacer ejercicios de movilidad|athleticism','Repasar tu mecánica mentalmente|shooting'],
 ['El capitán de {club} pide una última palabra antes del salto.','Prometer correr hasta el final|athleticism','Hablar de oportunidades de pase|playmaking','Prometer esfuerzo defensivo|defense'],
 ['El partido se juega en horario inusual y tu rutina se altera.','Cuidar descanso e hidratación|athleticism','Ajustar el calentamiento de tiro|shooting','Estudiar jugadas de inicio|playmaking'],
 ['Hay rumores de traspaso alrededor de {club}.','Responder con puntos|shooting','Mantener el vestuario unido|playmaking','Jugar con disciplina defensiva|defense'],
 ['Un entrenador rival halaga tus habilidades frente a la prensa.','Buscar una gran noche anotadora|shooting','Seguir con humildad|playmaking','Sorprender en defensa|defense'],
 ['Un compañero se retrasa y el equipo está nervioso.','Asumir el liderazgo|playmaking','Aumentar intensidad de calentamiento|athleticism','Enfocarte en tu tiro|shooting'],
 ['{opponentStar} se lesiona levemente durante los calentamientos, pero puede jugar.','Atacar su marca|athleticism','Crear para compañeros|playmaking','No cambiar la estrategia|defense'],
 ['Te piden controlar el ritmo ante {rival}.','Dirigir cada posesión|playmaking','Resolver con tiros rápidos|shooting','Apretar la defensa para correr|defense'],
 ['Algunos compañeros sienten nervios en un partido decisivo.','Dar confianza con pases|playmaking','Anotar los primeros puntos|shooting','Empezar con una defensa fuerte|defense'],
 ['Una discusión con los árbitros calienta el ambiente.','Mantener la cabeza fría|playmaking','Transformar rabia en agresividad|athleticism','Defender sin faltas|defense'],
 ['El entrenador llega con un plan sorpresa contra {rival}.','Ejecutar la jugada de tiro|shooting','Mover el balón sin parar|playmaking','Aplicar presión al base rival|defense']
];
const PREGAME_FRAMES=['Antes del salto inicial.','Durante el calentamiento.','A pocos minutos del partido.'];
const EVENTS=PREGAME_SEEDS.flatMap((e,i)=>PREGAME_FRAMES.map((f,j)=>({
 id:'pregame-'+(i*PREGAME_FRAMES.length+j),text:f+' '+e[0],options:e.slice(1).map(x=>{const [label,stat]=x.split('|');return {label,stat};})
})));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const replaceVars=(s,v)=>String(s).replace(/\{(star|opponentStar|club|rival)\}/g,(_,k)=>v[k]||'tu compañero');
function roster(team){
 if(!team)return [];
 if(team.id&&team.id.startsWith('nba-'))return NBA[team.abbr]||[];
 return [];
}
function teammate(team){const r=roster(team);return r.length?pick(r):'el capitán de '+(team?.name||'tu equipo');}
function seed(s){const c=E.init(s);if(!Array.isArray(c.trainingHistory))c.trainingHistory=[];return c;}
function rarityRoll(){
 const n=Math.random()*100;let sum=0;
 for(const t of RARITIES){sum+=t.weight;if(n<sum)return t;}
 return RARITIES[0];
}
function offerTraining(s){
 if(!s||s.world.phase!=='regular')return [];
 const c=seed(s),week=s.season+':'+s.world.week;
 if(c.trainingOffer?.week===week&&Array.isArray(c.trainingOffer.cards))return c.trainingOffer.cards;
 const offers=[],taken=new Set();
 for(let i=0;i<3;i++){
  const tier=rarityRoll();let pool=CARDS.filter(v=>v.rarity===tier.id&&!taken.has(v.title.split(' · ')[0]));
  if(!pool.length)pool=CARDS.filter(v=>!taken.has(v.title.split(' · ')[0]));
  const card=pick(pool);
  offers.push(card);taken.add(card.title.split(' · ')[0]);
 }
 c.trainingOffer={week,cards:offers};
 return offers;
}
function isTrainingDue(s){
 return !!(s&&s.world.phase==='regular'&&s.world.trainingWeek!==s.world.week&&s.player.injury<=0);
}
function applyCard(s,cardId){
 if(!isTrainingDue(s))return {ok:false,message:'Ya completaste el entrenamiento de esta semana.'};
 const c=seed(s),offer=offerTraining(s),card=offer.find(x=>x.id===cardId);
 if(!card)return {ok:false,message:'Esa carta no pertenece a tus opciones semanales.'};
 const player=s.player,r=RARITIES[card.tier];
 const energy=player.energy,facility=E.bonus(s,card.focus);
 const chance=clamp(r.success+(player.skills[card.focus]-65)*.006+facility*.005+(energy-65)*.0025,.20,.97);
 const success=Math.random()<chance;
 const deltas={shooting:0,playmaking:0,defense:0,athleticism:0};
 if(success){
  deltas[card.focus]+=1+card.tier+(Math.random()<.3?1:0);
  if(Math.random()<(.37+.08*card.tier))deltas[card.support]+=1+Number(card.tier>=3&&Math.random()<.35);
  // Alta intensidad: ganar mucho en un atributo puede sacrificar otro.
  if(card.tier>=2&&Math.random()<(.15+.08*card.tier))deltas[card.penalty]-=1;
 }else{
  deltas[card.focus]-=1+(card.tier>=3&&Math.random()<.4?1:0);
  if(Math.random()<.28)deltas[card.penalty]-=1;
  if(card.tier===0&&Math.random()<.5)deltas[card.support]+=1;
 }
 // Algunos entrenamientos salen regulares aun cuando el objetivo principal mejora.
 if(card.tier===0&&Math.random()<.07)deltas[card.penalty]-=1;
 for(const [stat,delta] of Object.entries(deltas))player.skills[stat]=clamp(player.skills[stat]+delta,1,99);
 const finalEnergy= r.energy+Math.min(8,Math.round(E.recovery(s)*.35));
 player.energy=clamp(player.energy+finalEnergy,0,100);
 const xp=success?(10+card.tier*7):4;
 player.xp+=xp;
 if(card.tier>=3&&!success&&Math.random()<.06)player.injury=Math.max(player.injury||0,1);
 s.world.trainingWeek=s.world.week;
 c.trainingHistory.unshift({season:s.season,week:s.world.week+1,cardId:card.id,title:card.title,rarity:card.rarity,success,deltas,energy:finalEnergy,xp});
 c.trainingHistory=c.trainingHistory.slice(0,36);
 delete c.trainingOffer;
 return {ok:true,card,success,deltas,energy:finalEnergy,xp,injured:player.injury>0};
}
function restTraining(s){
 if(!isTrainingDue(s))return {ok:false,message:'Esta semana ya tienes el entrenamiento completado.'};
 const c=seed(s),p=s.player,energy=16+Math.min(15,Math.round(E.recovery(s)*.55));
 p.energy=clamp(p.energy+energy,0,100);const deltas={shooting:0,playmaking:0,defense:0,athleticism:0};
 if(Math.random()<.12){const key=pick(Object.keys(deltas));deltas[key]=-1;p.skills[key]=clamp(p.skills[key]-1,1,99);}
 s.world.trainingWeek=s.world.week;delete c.trainingOffer;
 c.trainingHistory.unshift({season:s.season,week:s.world.week+1,cardId:'rest',title:'Descanso y recuperación',rarity:'rest',success:true,deltas,energy,xp:2});
 c.trainingHistory=c.trainingHistory.slice(0,36);p.xp+=2;
 return {ok:true,card:{title:'Descanso y recuperación',rarityLabel:'DESCANSO'},success:true,deltas,energy,xp:2};
}
function gameKey(s,phase){return s.season+':'+s.world.week+':'+phase+':'+(s.world.playoffs?.round??0);}
function needsPregame(s,phase){const c=seed(s);return c.pregameComplete!==gameKey(s,phase);}
function preparePregame(s,team,opponent,phase){
 const c=seed(s),key=gameKey(s,phase);
 if(c.pregame&&c.pregame.key===key)return c.pregame;
 if(c.pregameComplete===key)return null;
 const candidate=pick(EVENTS);
 const context={club:team?.name||'tu club',rival:opponent?.name||'el rival',star:teammate(team),opponentStar:teammate(opponent)};
 const e={key,id:candidate.id,text:replaceVars(candidate.text,context),options:candidate.options.map(o=>({label:replaceVars(o.label,context),stat:o.stat})),team:context.club,rival:context.rival,opponentStar:context.opponentStar};
 c.pregame=e;return e;
}
function resolvePregame(s,index){
 const c=seed(s),event=c.pregame;
 if(!event)return null;
 if(!Number.isInteger(index)||index<0||index>=event.options.length)return null;
 const o=event.options[index],stat=o.stat;
 const skill=s.player.skills[stat]||60;
 const chance=clamp(.28+skill*.006+E.bonus(s,stat)*.006+(s.player.energy-60)*.002,.2,.91);
 const success=Math.random()<chance;
 const roll=Math.random();
 const energy=success?(roll<.35?5:0):-(3+Math.floor(roll*8));
 const modifier=success?5+Math.floor(Math.random()*8):-(5+Math.floor(Math.random()*10));
 s.player.energy=clamp(s.player.energy+energy,0,100);
 s.player.xp+=(success?7:2);
 if(success)s.reputation=clamp(s.reputation+.35,1,100);
 if(!success&&Math.random()<.16){s.player.skills[stat]=clamp(s.player.skills[stat]-1,1,99);}
 c.pregameBoost={modifier,stat,success,energy,label:o.label};
 c.pregameComplete=event.key;
 c.pregameHistory=c.pregameHistory||[];
 c.pregameHistory.unshift({id:event.id,season:s.season,week:s.world.week,choice:o.label,success,modifier});c.pregameHistory=c.pregameHistory.slice(0,40);
 delete c.pregame;
 return {success,modifier,energy,choice:o.label,stat,probability:Math.round(chance*100)};
}
const originalPrepare=E.prepare;
E.prepare=function(s,team,opponent,phase){
 const c=seed(s),p=originalPrepare(s,team,opponent,phase);
 const real=teammate(team);
 const old=OLD[team?.abbr]||'el capitán de '+team.name;
 if(p&&!c.replacedStarFor){p.prompt=p.prompt.split(old).join(real);p.options.forEach(o=>o.label=o.label.split(old).join(real));c.replacedStarFor=p.sceneId;}
 if(p&&c.pregameBoost&&!p.pregameApplied){p.modifier+=c.pregameBoost.modifier;p.dayDesc+=' '+(c.pregameBoost.success?'El calentamiento previo salió bien.':'El calentamiento previo te dejó dudas.');p.pregameApplied=true;}
 if(p&&!p.energyApplied){p.modifier+=Math.round((s.player.energy-70)*.18);p.energyApplied=true;}
 return p;
};
const originalResolve=E.resolve;
E.resolve=function(s,index){
 const res=originalResolve(s,index);
 if(res){delete seed(s).pregameBoost;delete seed(s).replacedStarFor;}
 return res;
};
function estimate(s,o){
 const c=seed(s),p=c.pending;
 if(!o||!p)return 0;
 const A={shoot:['shooting',.05],pass:['playmaking',-.02],drive:['athleticism',.04],run:['athleticism',.02],defend:['defense',-.01],steal:['defense',.06],block:['defense',.05],rebound:['athleticism',-.03],leader:['playmaking',-.08]};
 const x=A[o.action]||['playmaking',0];
 return Math.round(100*clamp(.24+(s.player.skills[x[0]]||55)*.0055+E.bonus(s,x[0])*.007+p.modifier*.006-x[1],.13,.92));
}
Object.assign(E,{
 trainingCards:CARDS,trainingRarities:RARITIES,pregameEvents:EVENTS,nbaPlayers:NBA,playerNames:roster,
 offerTraining,isTrainingDue,trainCard:applyCard,restTraining,preparePregame,resolvePregame,needsPregame,estimate
});
})();
