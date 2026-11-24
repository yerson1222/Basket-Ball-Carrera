/* World Hoops V6 — international career, league simulation and team chemistry.
   All calendar dates, rosters' game lines and competition results are simulated. */
(function(){
'use strict';
const D=window.WH_DATA,E=window.WH_CAREER,S=window.WH_STORIES;
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>[...String(s)].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
const rng=s=>hash(s)/4294967296;
const league=id=>D.leagues.find(l=>l.id===id);
const team=id=>Object.values(D.realTeams||{}).flat().find(t=>t.id===id)||{id,name:id,abbr:'CLB',color:'#8296ad'};
const ovr=s=>Object.values(s.player.skills).reduce((a,b)=>a+b,0)/4;
const date=s=>new Date(Date.UTC(s.year,8,1)+Math.floor(365*clamp(s.world.week/Math.max(1,s.world.rounds.length),0,1))*86400000);
const month=s=>date(s).getUTCMonth();
const stamp=s=>s.season+':'+s.world.week;
const stats=['shooting','playmaking','defense','athleticism'];
const label={shooting:'Tiro',playmaking:'Creación',defense:'Defensa',athleticism:'Físico'};
const commons=f=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(f);
const competitions=[
 {id:'worldcup',name:'FIBA Basketball World Cup',kind:'national',region:'all',cycle:4,year:2027,logo:commons('FIBA Basketball World Cup logo.svg'),source:'https://about.fiba.basketball/en/our-sport/basketball/national-team-competition-systems/fiba-basketball-world-cup'},
 {id:'olympics',name:'Juegos Olímpicos · Baloncesto',kind:'national',region:'all',cycle:4,year:2028,source:'https://www.olympics.com/'},
 {id:'eurobasket',name:'EuroBasket',kind:'national',region:'europe',cycle:4,year:2029,logo:commons('FIBA EuroBasket logo.svg')},
 {id:'americup',name:'FIBA AmeriCup',kind:'national',region:'americas',cycle:4,year:2029,logo:commons('FIBA AmeriCup logo.svg')},
 {id:'asiacup',name:'FIBA Asia Cup',kind:'national',region:'asia',cycle:4,year:2029,logo:commons('FIBA Asia Cup logo.svg')},
 {id:'afrobasket',name:'FIBA AfroBasket',kind:'national',region:'africa',cycle:4,year:2029,logo:commons('FIBA AfroBasket logo.svg')},
 {id:'euroleague-cup',name:'EuroLeague',kind:'club',region:'europe',logo:league('euroleague')?.logo,source:'https://brandcenter.euroleague.net/en/'},
 {id:'bcl-americas',name:'Basketball Champions League Americas',kind:'club',region:'americas',source:'https://www.fiba.basketball/en/events/basketball-champions-league-americas'},
 {id:'bal',name:'Basketball Africa League',kind:'club',region:'africa',source:'https://bal.nba.com/'},
 {id:'bcl-asia',name:'Basketball Champions League Asia',kind:'club',region:'asia',source:'https://about.fiba.basketball/en/regions/asia/competitions/leagues'},
 {id:'intercontinental',name:'FIBA Intercontinental Cup',kind:'club',region:'all',logo:commons('FIBA Intercontinental logo.png')},
 {id:'allstar',name:'All-Star · selección de estrellas',kind:'star',region:'all'}
];
const nationalGroups={europe:['España','Francia','Italia','Alemania','Grecia','Turquía'],americas:['México','Canadá','Estados Unidos','Puerto Rico','Argentina','Brasil','Colombia','Chile','Uruguay','República Dominicana','Venezuela','Perú'],asia:['Japón','China','Corea del Sur','Filipinas','Líbano','Australia','Nueva Zelanda'],africa:['Egipto','Angola','Nigeria','Senegal','Marruecos']};
const nationalRegion=c=>Object.keys(nationalGroups).find(k=>nationalGroups[k].includes(c));
const clubRegion=s=>({north:'americas',south:'americas',oceania:'asia'}[league(s.leagueId)?.continent]||league(s.leagueId)?.continent);
function core(s){
 const c=S.core(s);
 if(!c.v6)c.v6={personality:0,chemistry:65,players:{},teamKey:'',seasonKey:0,helped:{},delayed:[],events:[],tournaments:[],celebrations:[],archive:[]};
 const v=c.v6;
 if(v.teamKey!==s.teamId){v.players={};v.chemistry=65;v.teamKey=s.teamId;}
 if(v.seasonKey!==s.season){v.seasonKey=s.season;v.helped={};v.birthdayMonth=hash(s.player.name)%12;v.annual=[];}
 let names=E.playerNames(team(s.teamId)).filter(n=>n!==s.player.name);
 if(names.length<2)names=[...names,...Array.from({length:8-names.length},(_,i)=>'Compañero '+(i+1))];
 for(const n of Object.keys(v.players))if(!names.includes(n))delete v.players[n];
 for(const n of names)if(!v.players[n])v.players[n]={morale:60+hash(n)%30,energy:60+hash(n+'e')%35,bond:50};
 return v;
}
function news(s,title,description,type='spark'){
 s.news.unshift({title,description,type,season:s.season,week:s.world.week});s.news=s.news.slice(0,28);
}
function celebrate(s,title,detail,logo){core(s).celebrations.push({title,detail,logo});news(s,title,detail,'trophy');}
function personality(v){return v.personality<=-25?'Humilde':v.personality>=25?'Pícaro':'Equilibrado';}
const topics=[
 ['Un compañero está frustrado por sus minutos','Escucharlo y practicar juntos','Presumir de tu titularidad','playmaking',8,-5],
 ['El entrenador propone una sesión de tiro extra','Trabajar en equipo','Descansar por tu cuenta','shooting',4,2],
 ['Un aficionado joven pide consejos','Dedicarle tiempo','Firmar rápido y marcharte','playmaking',5,1],
 ['Un patrocinador te pide una foto antes del salto','Saludar sin perder el foco','Convertirlo en un espectáculo','shooting',3,-3],
 ['La afición rival prepara cánticos contra ti','Mantener la calma','Responder con humor','defense',4,-2],
 ['El capitán busca voluntarios para estudiar vídeo','Analizar al rival juntos','Confiar en tu instinto','defense',5,-3],
 ['Un compañero llega cansado del viaje','Ofrecer ayuda en el calentamiento','Centrarte en tu preparación','athleticism',6,-1],
 ['Tu agente propone una aparición mediática','Aplazarla hasta después del partido','Aceptar la exposición','playmaking',3,-2],
 ['La cancha está más resbaladiza de lo habitual','Avisar al cuerpo técnico','Probar movimientos arriesgados','athleticism',3,-3],
 ['La prensa compara tus estadísticas con las de una estrella','Reconocer su talento','Prometer superarla','shooting',4,-4],
 ['Tu familia ha preparado una sorpresa','Compartir un momento tranquilo','Guardar toda la energía para el juego','athleticism',5,1],
 ['Un novato tiene dudas con una jugada','Explicarle el sistema','Pedir al entrenador que lo haga','playmaking',7,-1],
 ['La grada organiza un mosaico para el club','Agradecer el apoyo','Celebrar como una estrella','shooting',3,0],
 ['Un antiguo jugador visita el entrenamiento','Pedirle consejos','Retarlo a un concurso de tiro','shooting',4,0],
 ['Un rival comenta que tu defensa es débil','Preparar una respuesta en la cancha','Lanzar una pulla en redes','defense',3,-3],
 ['La dirección anuncia una actividad solidaria','Participar con tus compañeros','Priorizar el descanso','athleticism',5,1],
 ['El vestuario discute una jugada polémica','Mediar y escuchar','Defender tu opinión sin ceder','playmaking',7,-5],
 ['Un compañero falla varios tiros seguidos','Animarlo a seguir lanzando','Pedir que te pase el balón','shooting',8,-4],
 ['El entrenador cambia la rotación a última hora','Adaptarte al plan','Exigir más protagonismo','defense',4,-4],
 ['La sesión de recuperación se retrasa','Hacer movilidad con el equipo','Improvisar una rutina intensa','athleticism',4,-2],
 ['Un periodista filtra rumores de fichaje','Aclarar tu compromiso','Dejar abierta la puerta','playmaking',4,-4],
 ['Una escuela del barrio invita al equipo','Visitarla con el capitán','Enviar un saludo grabado','playmaking',5,1],
 ['Un compañero se equivoca en el calentamiento','Repetir la jugada juntos','Mostrarle cómo se hace','defense',5,-2],
 ['Un ojeador ocupa la primera fila','Jugar para el equipo','Buscar una acción espectacular','shooting',4,-3],
 ['El público celebra el aniversario del pabellón','Dedicar el partido a la afición','Concentrarte en tus récords','athleticism',5,-2],
 ['El club organiza un reto de tiros libres','Invitar al banquillo a participar','Competir por el primer premio','shooting',4,1]
];
const contexts=['Antes del salto inicial','En el entrenamiento de la mañana','Durante la concentración del equipo','En la previa del partido a domicilio','En el vestuario tras la charla técnica','A la llegada al pabellón','En la reunión de estrategia','Durante el calentamiento'];
const eventCards=topics.flatMap((t,i)=>contexts.map((f,j)=>({id:'v6-event-'+i+'-'+j,text:f+'. '+t[0]+'.',options:[{label:t[1],stat:t[3],morale:t[4],personality:-3},{label:t[2],stat:stats[(stats.indexOf(t[3])+1)%4],morale:t[5],personality:3}]})));
const holidays={0:['Año Nuevo','El equipo empieza el año con nuevos objetivos'],1:['Día de la amistad','Los compañeros organizan una comida'],2:['Mes de la comunidad','La fundación del club prepara una visita'],3:['Primavera','El cuerpo técnico celebra una jornada de recuperación'],4:['Día de la familia','Tu familia visita el pabellón'],5:['Inicio del verano','El equipo organiza una actividad al aire libre'],6:['Festival de verano','La afición prepara una celebración'],7:['Pretemporada','Los veteranos reciben a los nuevos jugadores'],8:['Inicio de curso','Un colegio visita al equipo'],9:['Halloween','El club organiza un concurso de disfraces'],10:['Mes de agradecimiento','La afición agradece el esfuerzo del equipo'],11:['Fiestas de fin de año','El equipo organiza una cena']};
function special(s,t){
 const v=core(s),m=month(s),key=s.season+':'+m,annual=v.annual;
 const make=(id,text,stat='playmaking',gift=0)=>({id,text,options:[{label:'Compartir el momento con el equipo',stat,morale:7,personality:-4,gift},{label:'Prepararme por mi cuenta',stat:'athleticism',morale:-1,personality:2,gift:0}]});
 if(!annual.includes('birthday')&&((m+4)%12)>=((v.birthdayMonth+4)%12)){annual.push('birthday');return make('v6-birthday','¡Feliz cumpleaños, '+s.player.name+'! El vestuario prepara una sorpresa.','shooting',2);}
 if(!annual.includes(key)&&rng(key+t.id)>.45){annual.push(key);return make('v6-holiday-'+m,holidays[m][0]+': '+holidays[m][1]+'.','athleticism',1);}
 if(s.world.week%7===2){const n=E.playerNames(t)[0]||'el capitán';return make('v6-club-'+t.id,'Noche especial de '+t.name+': '+n+' te invita a liderar una actividad con los aficionados.');}
 return null;
}
const oldPre=E.preparePregame;
E.preparePregame=function(s,t,o,phase){
 const p=oldPre(s,t,o,phase);if(!p||p.v6)return p;
 const v=core(s),recent=v.events.slice(0,35).map(e=>e.id);
 const specialCard=special(s,t),fresh=eventCards.filter(e=>!recent.includes(e.id));
 const card=specialCard||(Math.random()<.63?pick(fresh):null);
 if(card){Object.assign(p,{id:card.id,text:card.text,options:card.options.map(o=>({...o})),v6:true,guest:null});S.core(s).pregame=p;}
 return p;
};
const oldResolve=E.resolvePregame;
E.resolvePregame=function(s,i){const p=S.core(s).pregame,o=p?.options?.[i],result=oldResolve(s,i);if(!result||!p?.v6)return result;
 const v=core(s);v.chemistry=clamp(v.chemistry+(o.morale||0));v.personality=clamp(v.personality+(o.personality||0),-100,100);
 if(o.gift){s.player.skills[o.stat]=clamp(s.player.skills[o.stat]+o.gift,1,99);s.player.energy=clamp(s.player.energy+10);result.choice+=' · '+label[o.stat]+' +'+o.gift;}
 v.events.unshift({id:p.id,choice:o.label,season:s.season,week:s.world.week});v.events=v.events.slice(0,80);
 return result;};
const press=[
 ['¿Qué opinas de las críticas a tu compañero?','Todos necesitamos apoyo; confío en él','Yo no tengo la culpa de sus errores'],
 ['¿Crees que eres mejor que la estrella rival?','Todavía tengo mucho que aprender','Que mire el marcador y saque sus conclusiones'],
 ['¿Quién merece más minutos?','El entrenador decide; todos aportamos','Los minutos deberían ser para quien hace espectáculo'],
 ['¿Qué promesa haces a la afición?','Trabajar cada día por este escudo','Pronto van a hablar de mí en todo el mundo'],
 ['¿Cómo afrontas un partido decisivo?','Preparación y confianza en el grupo','Que el rival se prepare para sufrir'],
 ['¿Qué significaría una convocatoria internacional?','Sería un honor representar a mi país','Ya deberían haberme llamado'],
 ['¿Cómo celebras una gran victoria?','Con mis compañeros y la afición','Hoy es mi noche, mañana hablamos'],
 ['¿Por qué no has brillado hoy?','Voy a estudiar mis errores','A veces necesito que me pasen más el balón']
];
const oldSchedule=S.scheduleInterview;
S.scheduleInterview=function(s,line,stage){const p=oldSchedule(s,line,stage);if(!p||p.v6Press)return p;
 if(Math.random()<.65){const q=pick(press);Object.assign(p,{text:q[0],opts:[{label:q[1],pop:2,trust:3,rep:1,energy:0,tone:-1},{label:q[2],pop:5,trust:-2,rep:1,energy:-1,tone:1},{label:'Prefiero hablar de baloncesto y del siguiente partido',pop:1,trust:1,rep:0,energy:1,tone:0}]});}
 p.v6Press=true;return p;};
const oldInterview=S.resolveInterview;
S.resolveInterview=function(s,i){const q=S.core(s).interviewPending,o=q?.opts?.[i],out=oldInterview(s,i);if(!out)return out;
 const v=core(s),tone=o.tone??(o.trust>=2?-1:o.trust<0?1:0);
 v.personality=clamp(v.personality+tone*9,-100,100);v.chemistry=clamp(v.chemistry-tone*3);
 if(tone)v.delayed.push({due:S.core(s).totalGames+3+hash(out.answer)%4,tone,season:s.season,club:s.teamId});
 out.personality=personality(v);out.chemistry=v.chemistry;return out;};
const oldRecord=E.recordGame;
E.recordGame=function(s,line,...args){const r=oldRecord(s,line,...args),v=core(s),c=S.core(s);
 v.chemistry=clamp(v.chemistry+(line.win?2:-2));
 for(const [n,p] of Object.entries(v.players)){p.energy=clamp(p.energy-2+hash(n+stamp(s))%5);p.morale=clamp(p.morale+(line.win?3:-3)+hash(n+stamp(s)+'m')%3-1);}
 for(const d of v.delayed.filter(x=>x.due<=c.totalGames+1)){
  if(d.club!==s.teamId){c.popularity=clamp(c.popularity+(d.tone>0?2:1));continue;}
  if(d.tone<0){c.coachTrust=clamp(c.coachTrust+3);v.chemistry=clamp(v.chemistry+4);news(s,'Tus palabras dejan huella','El vestuario agradece tus declaraciones y el entrenador confía más en ti.');}
  else if(v.chemistry<65||!line.win){c.coachTrust=clamp(c.coachTrust-4);v.chemistry=clamp(v.chemistry-4);news(s,'La prensa vuelve a tus declaraciones','La presión de tus palabras aumenta después del último resultado.','warning');}
  else{c.popularity=clamp(c.popularity+4);s.fans+=250;news(s,'La afición celebra tu carácter','Tu respuesta atrevida se convierte en un momento viral.');}
 }
 v.delayed=v.delayed.filter(x=>x.due>c.totalGames+1);return r;};
const oldPrepare=E.prepare;
E.prepare=function(s,...args){const p=oldPrepare(s,...args),v=core(s);if(p&&!p.v6Chem){p.modifier+=Math.round((v.chemistry-60)/8);p.dayDesc+=' Química del vestuario: '+Math.round(v.chemistry)+'/100.';p.v6Chem=true;}return p;};
function help(s,name,action){const v=core(s),p=v.players[name];if(!p||!['talk','train','rest'].includes(action)||v.helped[stamp(s)]||s.player.energy<8||s.world.phase!=='regular')return false;
 v.helped[stamp(s)]=true;s.player.energy=clamp(s.player.energy-8);p.bond=clamp(p.bond+7);v.chemistry=clamp(v.chemistry+4);
 if(action==='talk')p.morale=clamp(p.morale+15);
 if(action==='train'){p.morale=clamp(p.morale+5);s.player.xp+=10;S.core(s).storyBoost=clamp((S.core(s).storyBoost||0)+3,-8,8);}
 if(action==='rest')p.energy=clamp(p.energy+18);
 news(s,'Compañeros antes que rivales','Ayudaste a '+name+'. Mejora la química del vestuario.');return true;}
function lineup(s,id,week,help){
 const t=team(id);let names=E.playerNames(t).filter(n=>n!==s.player.name);
 if(names.length>9){const offset=(week*9)%names.length;names=Array.from({length:9},(_,i)=>names[(offset+i)%names.length]);}
 if(!names.length)names=Array.from({length:7},(_,i)=>'Rotación '+(i+1));
 if(help?.ok&&!names.includes(help.name)){if(names.length>=9)names[names.length-1]=help.name;else names.push(help.name);}
 return names;
}
function boxScore(s,g,playerLine){
 const rows=[];
 for(const [id,score] of [[g.home,g.hs],[g.away,g.as]]){
  const line=id===s.teamId?playerLine:null,help=line?.teammateBoost,names=lineup(s,id,g.week,help);
  let remaining=score;
  if(line&&!line.dnp){rows.push({...line,id,name:s.player.name,synthetic:false});remaining=Math.max(0,score-line.pts);}
  const weights=names.map((n,i)=>Math.max(.3,1.6-i*.10+rng(n+g.week)*.9)),sum=weights.reduce((a,b)=>a+b,0);
  let used=0;
  names.forEach((n,i)=>{
   const pts=i===names.length-1?remaining-used:Math.floor(remaining*weights[i]/sum);used+=pts;
   const r={id,name:n,synthetic:n.startsWith('Rotación '),pts,reb:Math.floor(2+rng(n+g.week+'r')*8),ast:Math.floor(rng(n+g.week+'a')*7),stl:Math.floor(rng(n+g.week+'s')*3),blk:Math.floor(rng(n+g.week+'b')*3),threes:Math.min(Math.floor(pts/3),Math.floor(rng(n+g.week+'3')*4)),tov:Math.floor(rng(n+g.week+'t')*5),min:Math.floor(12+rng(n+g.week+'m')*25)};
   if(help?.ok&&help.name===n&&['ast','reb','stl','blk'].includes(help.stat))r[help.stat]+=help.boost;
   rows.push(r);
  });
 }
 return rows;
}
function rankings(s){
 const rows=new Map(),games=s.world.results.filter(g=>g.stage==='regular');
 for(const g of games){
  const line=s.world.playerGames.find(x=>x.stage==='regular'&&x.week===g.week);
  const lines=g.boxScore||boxScore(s,g,line);
  for(const l of lines){const key=l.id+'|'+l.name;if(!rows.has(key))rows.set(key,{id:l.id,name:l.name,synthetic:l.synthetic,gp:0,pts:0,reb:0,ast:0,stl:0,blk:0,threes:0,tov:0,min:0});
   const r=rows.get(key);r.gp++;for(const k of ['pts','reb','ast','stl','blk','threes','tov','min'])r[k]+=l[k]||0;}
 }
 return [...rows.values()].map(r=>({...r,ppg:r.pts/r.gp,rpg:r.reb/r.gp,apg:r.ast/r.gp,spg:r.stl/r.gp,bpg:r.blk/r.gp,eff:(r.pts+r.reb*1.2+r.ast*1.5+r.stl*2+r.blk*2)/r.gp}));
}
function rank(s){const a=Object.entries(s.world.table).sort((a,b)=>b[1].w-a[1].w||(b[1].pf-b[1].pa)-(a[1].pf-a[1].pa));return a.findIndex(x=>x[0]===s.teamId)+1;}
function offers(s){
 const v=core(s),p=s.world.week/Math.max(1,s.world.rounds.length),lines=rankings(s),mine=lines.find(x=>x.id===s.teamId&&x.name===s.player.name),c=S.core(s);
 if(!mine||mine.gp<3||p<.32)return;
 const top=lines.slice().sort((a,b)=>b.eff-a.eff).slice(0,Math.max(4,Math.ceil(lines.length*.1))).some(x=>x===mine);
 const prev=s.history.find(x=>x.season===s.season-1),nr=nationalRegion(s.player.country),cr=clubRegion(s);
 for(const def of competitions){
  if(v.tournaments.some(t=>t.season===s.season&&t.id===def.id))continue;
  let ok=false;
  if(def.kind==='star')ok=p>=.45&&p<=.8&&top&&mine.gp>=4;
  if(def.kind==='national')ok=!!nr&&p>=.45&&(s.year-def.year)%def.cycle===0&&(def.region==='all'||def.region===nr)&&ovr(s)>=72&&mine.eff>=19&&c.popularity>=45;
  if(def.kind==='club'&&def.id!=='intercontinental')ok=p>=.35&&def.region===cr&&s.leagueId!=='euroleague'&&!['nba','gleague','cebl','australia','newzealand'].includes(s.leagueId)&&(prev?.champion||prev?.rank<=2||s.season===1&&rank(s)<=2);
  if(def.id==='intercontinental')ok=p>=.7&&v.tournaments.some(t=>t.kind==='club'&&t.status==='won'&&t.season===s.season);
  if(!ok)continue;
  const t={id:def.id,name:def.name,kind:def.kind,season:s.season,status:'invited',round:0,rounds:def.kind==='star'?1:3,results:[],region:def.region,logo:def.logo};
  v.tournaments.push(t);celebrate(s,def.kind==='club'?'¡Clasificados!':'¡Convocado!',def.name+' · '+(def.kind==='national'?s.player.country:def.kind==='star'?'Tu rendimiento está entre los mejores':team(s.teamId).name),def.logo);
 }
}
function tournament(s,id){return core(s).tournaments.find(t=>t.id===id&&t.season===s.season);}
function accept(s,id,yes){const t=tournament(s,id);if(!t||t.status!=='invited')return false;t.status=yes?'active':'declined';return true;}
function opponents(s,t){
 if(t.kind==='national')return (t.region==='all'?Object.values(nationalGroups).flat():nationalGroups[t.region]||[]).filter(n=>n!==s.player.country);
 if(t.kind==='star')return ['Selección rival de estrellas'];
 const pool=D.leagues.filter(l=>l.id!==s.leagueId&&(t.region==='all'||({north:'americas',south:'americas',oceania:'asia'}[l.continent]||l.continent)===t.region)).flatMap(l=>D.realTeams[l.id]||[]);
 return pool.map(x=>x.name);
}
function rival(s,t){const pool=opponents(s,t);return pool.length?pool[hash(t.id+s.season+t.round)%pool.length]:'Selección invitada';}
function play(s,id,stat,timing,skillSuccess){
 const t=tournament(s,id),v=core(s);if(!t||t.status!=='active'||!stats.includes(stat)||s.player.injury>0||s.player.energy<10)return null;
 const opponent=rival(s,t),chance=clamp(.32+s.player.skills[stat]*.004+(timing-.5)*.42+(v.chemistry-60)*.0015,.12,.93);
 const clutch=typeof skillSuccess==='boolean'?skillSuccess:Math.random()<chance;let other=78+Math.floor(Math.random()*28),score=other+(clutch?2+Math.floor(timing*7):-2-Math.floor((1-timing)*7));
 const line={opponent,score,other,win:score>other,clutch,accuracy:Math.round(timing*100),pts:Math.round(7+ovr(s)*.15+timing*8),ast:stat==='playmaking'?7:3,reb:stat==='athleticism'?9:4};
 t.results.push(line);t.round++;s.player.energy=clamp(s.player.energy-8);s.player.xp+=line.win?18:8;
 if(t.kind==='star'){t.status='played';if(line.win&&line.pts>=24)award(s,'MVP All-Star',t.name);}
 else if(!line.win)t.status='eliminated';
 else if(t.round>=t.rounds){t.status='won';award(s,'Campeón · '+t.name,t.name,t.logo);}
 if(t.status==='won'||t.status==='played')S.core(s).popularity=clamp(S.core(s).popularity+5);
 return line;
}
function award(s,title,detail,logo){if(s.awards.some(a=>a.title===title&&a.year===s.year))return;s.awards.push({title,year:s.year,team:team(s.teamId).name});celebrate(s,title,detail,logo);}
function finalize(s){
 const rows=rankings(s),me=rows.find(x=>x.id===s.teamId&&x.name===s.player.name);
 if(me&&me.gp>=Math.max(4,s.world.week*.45)){
 const eligible=rows.filter(r=>r.gp>=Math.max(4,s.world.week*.45));
 for(const [k,title] of [['eff','MVP de la liga'],['ppg','Máximo anotador'],['rpg','Máximo reboteador'],['apg','Líder de asistencias'],['spg','Líder de robos'],['bpg','Líder de tapones']])if(eligible.slice().sort((a,b)=>b[k]-a[k])[0]===me)award(s,title,league(s.leagueId).name);
 if(s.player.age<=21&&eligible.filter(r=>r.eff>me.eff).length<10)award(s,'Joven revelación',league(s.leagueId).name);
 }
 if(s.world.champion===s.teamId)celebrate(s,'¡Campeones de liga!',team(s.teamId).name,league(s.leagueId).logo);
 const history=s.history[0];if(history?.season===s.season)history.awards=[...new Set([...history.awards,...s.awards.filter(a=>a.year===s.year).map(a=>a.title)])];
}
const logoPages={arg:['Liga Nacional de Básquet','Liga Nacional de Básquet'],nbb:['Novo Basquete Brasil','Novo Basquete Brasil'],uru:['Liga Uruguaya de Básquetbol','Liga Uruguaya de Básquetbol'],chi:['Liga Nacional de Básquetbol de Chile','Liga Nacional de Básquetbol de Chile'],col:['Baloncesto Profesional Colombiano','Baloncesto Profesional Colombiano'],japan:['B.League','B.League'],china:['Chinese Basketball Association','Chinese Basketball Association'],korea:['Korean Basketball League','Korean Basketball League'],philippines:['Philippine Basketball Association','Philippine Basketball Association'],lebanon:['Lebanese Basketball League','Lebanese Basketball League'],egypt:['Egyptian Basketball Super League','Egyptian Basketball Super League'],angola:['Angolan Basketball League','Angolan Basketball League'],nigeria:['Nigerian Premier League (basketball)','Nigerian Premier League (basketball)'],senegal:['National 1 (Senegal)','National 1 (Senegal)'],australia:['National Basketball League (Australia)','National Basketball League (Australia)'],newzealand:['National Basketball League (New Zealand)','National Basketball League (New Zealand)']};
const direct={arg:commons('Logo LNB.png'),uru:commons('Ícono Liga Uruguaya de Básquetbol (textlogo).png'),col:'https://motilonesdelnorte.com/assets/dpb.webp?v=da851f2c',nigeria:'https://thebalreport.com/league-logos/nigeria-premier-basketball-league.webp',japan:commons('B.League logo.svg'),australia:commons('NBL Logo.png')};
for(const l of D.leagues)if(!l.logo&&direct[l.id])l.logo=direct[l.id];
const extraPages={olympics:'Olympic symbols',bal:'Basketball Africa League','bcl-americas':'Basketball Champions League Americas','bcl-asia':'Basketball Champions League Asia'};
// All-Star is a fictional annual selection for each league; use a neutral star rather than the NBA-specific mark.
async function wikiLogo(title){try{const q=new URLSearchParams({action:'query',titles:title,prop:'pageimages',piprop:'thumbnail',pithumbsize:'400',redirects:'1',format:'json',origin:'*'});const r=await fetch('https://en.wikipedia.org/w/api.php?'+q);if(!r.ok)return null;const d=await r.json(),p=Object.values(d.query?.pages||{})[0],img=p?.thumbnail?.source;if(!img||!/(logo|wordmark|badge|emblem|symbol)/i.test(decodeURIComponent(img)))return null;return img;}catch{return null;}}
let logoStarted=false;
async function loadLogos(){if(logoStarted)return;logoStarted=true;
 const jobs=[...D.leagues.filter(l=>!l.logo&&logoPages[l.id]).map(l=>[l,logoPages[l.id][0]]),...competitions.filter(t=>!t.logo&&extraPages[t.id]).map(t=>[t,extraPages[t.id]])];
 for(let i=0;i<jobs.length;i+=3){await Promise.all(jobs.slice(i,i+3).map(async([o,p])=>{const url=await wikiLogo(p);if(url)o.logo=url;}));}
 window.dispatchEvent(new Event('worldhoops:resources'));}
const logo=(url,name)=>url?'<img class="v6-logo" loading="lazy" src="'+esc(url)+'" alt="" onerror="this.hidden=true">':'';
const button=(action,text,data='',disabled=false)=>'<button type="button" class="btn '+(disabled?'ghost':'primary')+'" data-action="'+action+'" '+data+(disabled?' disabled':'')+'>'+esc(text)+'</button>';
function teamPanel(s){
 const v=core(s),rec=s.world.table[s.teamId]||{w:0,l:0,streak:0},used=v.helped[stamp(s)]||s.player.energy<8||s.world.phase!=='regular';
 return '<section class="v6-panel"><div class="v6-kicker">ESTADO DEL EQUIPO</div><h2>'+esc(team(s.teamId).name)+'</h2><div class="v6-metrics"><div>Química<strong>'+Math.round(v.chemistry)+'/100</strong></div><div>Balance<strong>'+rec.w+'–'+rec.l+'</strong></div><div>Racha<strong>'+rec.streak+'</strong></div><div>Personalidad<strong>'+personality(v)+'</strong></div></div><div class="v6-meter"><i style="width:'+v.chemistry+'%"></i></div><p>Ayuda a un compañero por jornada (−8 de energía). La química afecta a tus partidos.</p><div class="v6-grid">'+Object.entries(v.players).map(([n,p])=>'<article class="v6-mini"><b>'+esc(n)+'</b><small>Ánimo '+p.morale+' · Energía '+p.energy+' · Afinidad '+p.bond+'</small>'+button('v6-help',p.morale<70?'Hablar y apoyar':p.energy<70?'Ayudar a recuperar':'Entrenar juntos','data-name="'+esc(n)+'" data-kind="'+(p.morale<70?'talk':p.energy<70?'rest':'train')+'"',!!used)+'</article>').join('')+'</div></section>';
}
function board(s,metric='ppg'){if(!['ppg','rpg','apg','spg','bpg','eff'].includes(metric))metric='ppg';const rows=rankings(s).sort((a,b)=>b[metric]-a[metric]);
 return '<section class="v6-panel"><div class="v6-kicker">ESTADÍSTICAS DE TEMPORADA</div><h2>Líderes · '+esc(league(s.leagueId).name)+'</h2><p>Temporada regular · clasificación individual de la liga.</p><div class="v6-tabs">'+[['ppg','Puntos'],['rpg','Rebotes'],['apg','Asistencias'],['spg','Robos'],['bpg','Tapones'],['eff','Valoración']].map(([k,l])=>button('v6-sort',l,'data-metric="'+k+'"',k===metric)).join('')+'</div><div class="v6-scroll"><table class="v6-table"><thead><tr><th>#</th><th>Jugador</th><th>Equipo</th><th>PJ</th><th>PTS</th><th>REB</th><th>AST</th><th>ROB</th><th>TAP</th></tr></thead><tbody>'+rows.slice(0,30).map((r,i)=>'<tr class="'+(r.id===s.teamId&&r.name===s.player.name?'v6-me':'')+'"><td>'+(i+1)+'</td><td>'+esc(r.name)+'</td><td>'+esc(team(r.id).abbr)+'</td><td>'+r.gp+'</td>'+['ppg','rpg','apg','spg','bpg'].map(k=>'<td>'+r[k].toFixed(1)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+(rows.length?'':'<p>Juega tu primer partido para generar las estadísticas.</p>')+'</section>';
}
function cupPanel(s){const v=core(s);return '<section class="v6-panel"><div class="v6-kicker">CALENDARIO INTERNACIONAL</div><h2>Selecciones, clubes y All-Star</h2><p>Destaca en la liga para recibir convocatorias. Las competiciones son independientes del calendario doméstico y tienen formato reducido.</p><div class="v6-grid">'+competitions.map(def=>{const t=tournament(s,def.id);return '<article class="v6-mini v6-cup">'+(logo(def.logo,def.name)||'<span class="v6-logo-placeholder" aria-hidden="true">'+(def.kind==='star'?'★':def.kind==='national'?'🌐':'🏆')+'</span>')+'<b>'+esc(def.name)+'</b><small>'+esc(def.kind==='star'?'Rendimiento de élite':def.kind==='national'?'Selección nacional · ciclo '+def.cycle+' años':'Clasificación de clubes')+'</small><span class="v6-status">'+esc(t?({invited:'¡Convocado!',active:'Ronda '+(t.round+1)+' / '+t.rounds,won:'Campeón',played:'Jugado',declined:'Rechazado',eliminated:'Eliminado'}[t.status]):'Por clasificar')+'</span>'+(t?.status==='invited'?button('v6-accept','Aceptar','data-id="'+def.id+'"')+button('v6-decline','Rechazar','data-id="'+def.id+'"'):t?.status==='active'?button('v6-cup-open','Jugar contra '+rival(s,t),'data-id="'+def.id+'"',s.player.injury>0||s.player.energy<10):'')+(t?.results||[]).map(x=>'<small>'+esc(x.opponent)+' · '+x.score+'–'+x.other+'</small>').join('')+'</article>';}).join('')+'</div><h3>Historial internacional</h3>'+v.tournaments.filter(t=>t.season!==s.season).slice(-12).reverse().map(t=>'<p>'+esc(t.name)+' · T'+t.season+' · '+esc(t.status)+'</p>').join('')+'</section>';}
function cupModal(s,id){const t=tournament(s,id);if(!t||t.status!=='active')return '';return '<div class="modal-backdrop"><div class="modal-card v6-panel v6-game" role="dialog" aria-modal="true"><h2>'+esc(t.name)+'</h2><p>Contra '+esc(rival(s,t))+' · posesión decisiva</p><div class="v6-court"><span class="v6-ball"></span><span class="v6-hoop"></span></div><div class="v6-timing"><i></i><span></span></div><p>Pulsa una jugada cuando el cursor llegue al centro.</p>'+stats.map(k=>button('v6-cup-play',label[k]+' · '+s.player.skills[k],'data-id="'+id+'" data-stat="'+k+'"')).join('')+button('close-modal','Volver')+'</div></div>';}
function celebrationModal(c){return '<div class="modal-backdrop"><div class="modal-card result-modal v6-celebration" role="dialog" aria-modal="true"><div class="v6-confetti">'+Array.from({length:24},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div>'+logo(c.logo,c.title)+'<div class="v6-trophy">🏆</div><h2>'+esc(c.title)+'</h2><p>'+esc(c.detail)+'</p>'+button('close-modal','Continuar')+'</div></div>';}
function resultModal(t,r){return '<div class="modal-backdrop"><div class="modal-card result-modal v6-game" role="dialog" aria-modal="true"><div class="v6-court '+(r.clutch?'v6-hit':'v6-miss')+'"><span class="v6-ball"></span><span class="v6-hoop"></span></div><h2>'+esc(t.name)+' · '+(r.win?'¡Victoria!':'Derrota')+'</h2><h1>'+r.score+' : '+r.other+'</h1><p>'+esc(r.opponent)+' · Precisión '+r.accuracy+'% · '+r.pts+' puntos, '+r.ast+' asistencias, '+r.reb+' rebotes.</p>'+button('close-modal','Continuar')+'</div></div>';}
window.WH_V6={core,personality,help,rankings,lineup,boxScore,offers,finalize,tournament,accept,play,teamPanel,board,cupPanel,cupModal,celebrationModal,resultModal,loadLogos,eventCards,competitions};
})();