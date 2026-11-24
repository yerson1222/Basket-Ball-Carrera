/* WORLD HOOPS V4 — Tres orígenes de carrera, combine de draft y cesiones juveniles. */
(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const select=a=>a[Math.floor(Math.random()*a.length)];
const TESTS=[
 {id:'shoot',title:'Tiro de tres puntos',text:'Tienes cinco segundos y una mano encima. ¿Cómo decides lanzar?',stat:'shooting',choices:[
  {label:'Finta y triple liberado',stat:'shooting',risk:.03,bonus:4},
  {label:'Triple tras bote y giro',stat:'athleticism',risk:.11,bonus:7},
  {label:'Buscar un pase al tirador',stat:'playmaking',risk:-.06,bonus:1}]},
 {id:'vision',title:'Lectura del pick and roll',text:'El defensor cambia y el pívot rueda hacia la canasta. El ojeador toma nota.',stat:'playmaking',choices:[
  {label:'Pase picado al interior',stat:'playmaking',risk:-.02,bonus:5},
  {label:'Tiro a media distancia',stat:'shooting',risk:.06,bonus:3},
  {label:'Acelerar hacia el aro',stat:'athleticism',risk:.08,bonus:5}]},
 {id:'defense',title:'Defensa contra una estrella',text:'Un alero muy rápido intenta superarte con un primer paso explosivo.',stat:'defense',choices:[
  {label:'Mantener la posición',stat:'defense',risk:-.06,bonus:4},
  {label:'Arriesgar el robo',stat:'defense',risk:.14,bonus:8},
  {label:'Forzarle a la ayuda',stat:'playmaking',risk:.01,bonus:4}]},
 {id:'sprint',title:'Finalización en transición',text:'Tienes el balón y solo queda un defensor entre tú y el aro.',stat:'athleticism',choices:[
  {label:'Atacar el aro con velocidad',stat:'athleticism',risk:.05,bonus:5},
  {label:'Pararte y lanzar de tres',stat:'shooting',risk:.09,bonus:6},
  {label:'Frenar y asistir al trailer',stat:'playmaking',risk:-.06,bonus:3}]},
 {id:'pressure',title:'Último tiro bajo presión',text:'Pierdes por dos puntos y quedan tres segundos. ¡Todo depende de ti!',stat:'shooting',choices:[
  {label:'Tirar el triple ganador',stat:'shooting',risk:.11,bonus:10},
  {label:'Buscar la bandeja del empate',stat:'athleticism',risk:-.02,bonus:5},
  {label:'Encontrar un compañero abierto',stat:'playmaking',risk:-.04,bonus:5}]},
 {id:'rebound',title:'Rebote de combate',text:'El balón golpea el aro y tres jugadores intentan quedarse con la posesión.',stat:'athleticism',choices:[
  {label:'Saltar buscando el rebote',stat:'athleticism',risk:.06,bonus:7},
  {label:'Cerrar la posición con el cuerpo',stat:'defense',risk:-.04,bonus:5},
  {label:'Esperar el bote para el robo',stat:'defense',risk:.10,bonus:6}]}
];
const SKILLS={PG:{shooting:63,playmaking:76,defense:60,athleticism:66},SG:{shooting:75,playmaking:65,defense:61,athleticism:67},SF:{shooting:67,playmaking:63,defense:68,athleticism:71},PF:{shooting:58,playmaking:59,defense:72,athleticism:75},C:{shooting:52,playmaking:57,defense:77,athleticism:73}};
const STYLE={scorer:'shooting',playmaker:'playmaking',defender:'defense',athlete:'athleticism'};
function startCombine(fields){
 const profile=SKILLS[fields.position]||SKILLS.SG,skills={...profile},style=STYLE[fields.style]||'shooting';skills[style]+=5;
 return {fields:{...fields},skills,index:0,score:0,maxScore:120,history:[],stepStarted:Date.now(),result:null,offer:null};
}
function activeTest(combine){return TESTS[combine.index]||null;}
function probability(combine,choice){
 const skill=combine.skills[choice.stat]||60;
 return clamp(.21+skill*.0065-choice.risk,.2,.89);
}
function attempt(combine,choiceIndex){
 const test=activeTest(combine);
 if(!test||!Number.isInteger(choiceIndex)||choiceIndex<0||choiceIndex>=test.choices.length)return null;
 const option=test.choices[choiceIndex],chance=probability(combine,option);
 const elapsed=Math.max(0,Date.now()-combine.stepStarted);
 // La barra de precisión se mueve entre 0 y 100 cada dos segundos.
 const phase=(elapsed%2400)/1200,needle=phase<=1?phase:2-phase;
 const precision=Math.round(needle*100);
 const timing=clamp(1-Math.abs(precision-50)/50,0,1);
 const success=Math.random()<clamp(chance+(timing-.5)*.16,.15,.96);
 const pts=success?clamp(Math.round(8+option.bonus+timing*7),6,20):Math.round(1+timing*5);
 combine.score+=pts;
 const delta=success?1:0;combine.skills[option.stat]=clamp(combine.skills[option.stat]+delta,1,95);
 const feedback={test:test.title,label:option.label,success,score:pts,timing:Math.round(timing*100),probability:Math.round(chance*100),total:combine.score};
 combine.history.push(feedback);
 combine.index++;
 return feedback;
}
function grade(combine){
 const performance=Math.round(combine.score/TESTS.length/20*100);
 if(performance>=84)return {name:'ELITE',rank:'Top prospecto',minQuality:88,letter:'A+'};
 if(performance>=69)return {name:'ALL-STAR',rank:'Primera ronda',minQuality:78,letter:'A'};
 if(performance>=54)return {name:'TALENTO',rank:'Segunda ronda',minQuality:70,letter:'B'};
 if(performance>=39)return {name:'PROYECTO',rank:'Proyecto profesional',minQuality:64,letter:'C'};
 return {name:'DESARROLLO',rank:'Liga de desarrollo',minQuality:50,letter:'D'};
}
function draft(combine,leagues,clubList){
 if(combine.index<TESTS.length)return null;
 const result=grade(combine), region=combine.fields.region||'north';
 const all=leagues.filter(l=>l.continent===region&&clubList(l.id).length>=2);
 if(!all.length)throw Error('No hay equipos disponibles en esta región.');
 const target=clamp(50+Math.round(combine.score/120*49),50,99);
 // Primeras rondas aspiran a ligas más competitivas; proyectos, a ligas de desarrollo.
 const ranking=all.map(l=>({l,fit:Math.abs(l.quality-target)+Math.random()*9+(l.quality>target+8?11:0)})).sort((a,b)=>a.fit-b.fit);
 const chosen=ranking[0].l,teams=clubList(chosen.id),sample=teams.sort((a,b)=>(Math.abs((a.rating||70)-(target-8))+Math.random()*7)-(Math.abs((b.rating||70)-(target-8))+Math.random()*7));
 const team=sample[Math.floor(Math.random()*Math.min(3,sample.length))];
 const skillsBonus=clamp(Math.round((combine.score/120-.4)*10),-2,7);
 return combine.offer={mode:'draft',grade:result,score:combine.score,performance:Math.round(combine.score/120*100),leagueId:chosen.id,teamId:team.id,skillBonus:skillsBonus,region:region};
}
function randomClub(leagues,clubList){
 const list=leagues.flatMap(l=>clubList(l.id).map(t=>({team:t.id,league:l.id})));
 if(!list.length)throw Error('No hay clubes para empezar.');
 const x=select(list);return {leagueId:x.league,teamId:x.team,mode:'random'};
}
function loanClub(parentLeague,parentTeam,leagues,clubList){
 const parent=leagues.find(x=>x.id===parentLeague);
 if(!parent)throw Error('Liga de origen no disponible.');
 if(parentLeague==='nba'){
  const affiliates=clubList('gleague').filter(t=>t.affiliate===parentTeam);
  if(affiliates.length){const t=select(affiliates);return {leagueId:'gleague',teamId:t.id,affiliate:true};}
 }
 let candidates=leagues.filter(l=>l.continent===parent.continent&&l.id!==parentLeague&&l.quality<=parent.quality-5);
 if(!candidates.length)candidates=leagues.filter(l=>l.continent===parent.continent&&l.id!==parentLeague&&l.quality<=parent.quality+2);
 const possible=candidates.flatMap(l=>clubList(l.id).map(t=>({leagueId:l.id,teamId:t.id,quality:l.quality})));
 if(possible.length){
  possible.sort((a,b)=>Math.abs(a.quality-(parent.quality-12))-Math.abs(b.quality-(parent.quality-12)));
  return select(possible.slice(0,Math.min(12,possible.length)));
 }
 const backups=clubList(parentLeague).filter(t=>t.id!==parentTeam);
 if(!backups.length)throw Error('No hay clubes disponibles para la cesión.');
 return {leagueId:parentLeague,teamId:select(backups).id};
}
window.WH_ORIGIN={tests:TESTS,startCombine,activeTest,probability,attempt,grade,draft,randomClub,loanClub};
})();
