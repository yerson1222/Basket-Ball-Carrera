/* WORLD HOOPS V5: consecuencias reales, prensa, visitas, minijuego clutch y cartas. */
(function(){
'use strict';
const E=window.WH_CAREER;if(!E)return;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const choice=a=>a[Math.floor(Math.random()*a.length)];
const STATS=['shooting','playmaking','defense','athleticism'];
const TIERS=[
 ['common','COMÚN',0,-7],['uncommon','POCO COMÚN',1,-10],
 ['epic','ÉPICA',2,-15],['legendary','LEGENDARIA',3,-20],['mythic','MÍTICA',4,-26]
];
const NEW_DRILLS=[
 ['Laboratorio de triples','shooting','playmaking','Tiro a diferentes ritmos mientras un defensor corta líneas.','athleticism'],
 ['Tiro sin equilibrio','shooting','athleticism','Lanzamientos en suspensión con cambios bruscos de dirección.','defense'],
 ['Clutch de madrugada','shooting','playmaking','Cien posesiones finales bajo presión del reloj.','athleticism'],
 ['Especialista en flotadoras','shooting','athleticism','Acércate a la zona evitando los tapones.','playmaking'],
 ['Reloj de posesión','shooting','playmaking','Toma decisiones de tiro en menos de tres segundos.','defense'],
 ['IQ de base','playmaking','defense','Reconoce patrones de ataque y anticipa movimientos.','athleticism'],
 ['Lectura de la ayuda','playmaking','shooting','Encuentra las ventajas cuando dos rivales te cierran.','defense'],
 ['Conexión con el pívot','playmaking','defense','Mejora las asistencias en pases interiores.','shooting'],
 ['Ataque sin bote','playmaking','athleticism','Cinco jugadores crean oportunidades con pases rápidos.','defense'],
 ['Taller de fintas','playmaking','shooting','Engaña a la primera línea defensiva sin perder el control.','athleticism'],
 ['Cierre de partido','defense','playmaking','Alineaciones difíciles y cambios defensivos en la última posesión.','shooting'],
 ['Defensa de perímetro','defense','athleticism','Persecución de tiradores tras pantallas dobles.','shooting'],
 ['Robos con anticipación','defense','playmaking','Reconocer señales y robar sin cometer falta.','athleticism'],
 ['Lectura del pívot','defense','athleticism','Neutraliza segundos intentos en el poste bajo.','shooting'],
 ['Manos rápidas','defense','playmaking','Trabajo de intercepción y reacción explosiva.','shooting'],
 ['Primer paso eléctrico','athleticism','shooting','Sprints cortos, explosividad y aceleraciones.','playmaking'],
 ['Rebote ofensivo','athleticism','defense','Aprende a ganar posición tras un tiro fallado.','shooting'],
 ['Resistencia de playoffs','athleticism','defense','Mantén el rendimiento cuando el partido llega al final.','playmaking'],
 ['Mate de contacto','athleticism','shooting','Finalizaciones difíciles con rivales encima.','playmaking'],
 ['Velocidad lateral','athleticism','defense','Ejercicios de desplazamiento para frenar al escolta rival.','shooting']
];
const freshCards=NEW_DRILLS.flatMap((d,i)=>TIERS.map(([rarity,rarityLabel,tier,energy])=>({
 id:'v5-drill-'+i+'-'+tier,title:d[0]+(tier?(' · '+['','PRO','ALL-STAR','ÉLITE','LEYENDA'][tier]):''),
 desc:d[3],focus:d[1],support:d[2],penalty:d[4],rarity,rarityLabel,tier,potential:1+tier+(tier>2?1:0),
 risk:Math.round((.18+tier*.095)*100),energy
})));
const currentIds=new Set(E.trainingCards.map(x=>x.id));
for(const item of freshCards)if(!currentIds.has(item.id))E.trainingCards.push(item);

const PURCHASES=[
 {id:'sports_car',name:'Coche deportivo',price:65000,desc:'Llama la atención de aficionados y marcas, pero requiere mantenimiento.',bonus:2},
 {id:'luxury_car',name:'Auto de lujo',price:115000,desc:'Tu imagen pública crece. La prensa y los gastos también.',bonus:3},
 {id:'personal_driver',name:'Conductor personal',price:28000,desc:'Ahorra energía en los desplazamientos y evita retrasos.',energy:6},
 {id:'penthouse',name:'Ático en la ciudad',price:170000,desc:'Más comodidad, exposición mediática y eventos exclusivos.',energy:5},
 {id:'image_agent',name:'Representante de imagen',price:22000,desc:'Negocia entrevistas y oportunidades con patrocinadores.',bonus:2},
 {id:'streaming_room',name:'Estudio para crear contenido',price:12000,desc:'Contenido con seguidores y nuevos eventos de popularidad.',bonus:1},
 {id:'family_trip',name:'Viaje para tu familia',price:12500,desc:'Tu familia viene a verte y mejora tu motivación.',energy:4},
 {id:'charity_foundation',name:'Fundación benéfica',price:44000,desc:'Ayuda a jóvenes del barrio y fortalece tu reputación.',bonus:2},
 {id:'private_court',name:'Cancha con simulador profesional',price:36000,desc:'Más trabajo con balón en cualquier momento.',stat:'shooting',bonus:4,training:1},
 {id:'sports_psychologist',name:'Especialista mental de élite',price:14500,desc:'Mejor serenidad en partidos y entrevistas importantes.',bonus:2}
];
const ownedIds=new Set(E.items.map(x=>x.id));for(const item of PURCHASES)if(!ownedIds.has(item.id))E.items.push(item);
const arcTemplates={
 sports_car:[
  {title:'Tu deportivo se avería antes de un partido',text:'Llegas tarde al aparcamiento y el coche no arranca. La prensa está esperando. ¿Qué haces?',options:[
   {label:'Pagar una reparación urgente',cash:-8500,popularity:0,energy:0,boost:2},
   {label:'Pedir ayuda a tu compañero',cash:0,popularity:1,energy:-4,boost:0},
   {label:'Hacer una historia viral sobre el problema',cash:0,popularity:3,energy:-7,boost:-2}]},
  {title:'Invitación a un evento de automóviles',text:'Te invitan a una concentración de coches deportivos donde estarán varios patrocinadores.',options:[
   {label:'Asistir y fotografiarte con los fans',cash:1200,popularity:4,energy:-3,boost:1},
   {label:'Ir solo con tu representante',cash:2800,popularity:2,energy:-2,boost:2},
   {label:'No ir y concentrarte en el baloncesto',cash:0,popularity:-1,energy:6,boost:3}]}
 ],
 luxury_car:[
  {title:'Una actriz conocida aparece junto a tu auto de lujo',text:'Una actriz muy popular quiere una foto contigo a la salida de un evento. Los medios publicarán lo que hagas.',options:[
   {label:'Aceptar la foto y conversar',cash:0,popularity:6,energy:-2,boost:1},
   {label:'Ser discreto y agradecerle',cash:0,popularity:2,energy:2,boost:2},
   {label:'Negarte de forma brusca',cash:0,popularity:-5,energy:0,boost:-3}]},
  {title:'Llegan los gastos del auto de lujo',text:'Seguro, impuestos y mantenimiento. Tu representante te presenta una factura inesperada.',options:[
   {label:'Pagar el mantenimiento premium',cash:-14000,popularity:1,energy:2,boost:1},
   {label:'Negociar con un patrocinador',cash:-4000,popularity:3,energy:-3,boost:0},
   {label:'Aplazar el pago y arriesgar titulares',cash:0,popularity:-3,energy:-4,boost:-2}]}
 ],
 personal_driver:[{title:'Tu conductor te da una ventaja',text:'El partido es fuera de casa y tu conductor te ayuda a llegar descansado.',options:[
  {label:'Dormir durante el camino',cash:0,popularity:0,energy:8,boost:3},
  {label:'Repasar videos del rival',cash:0,popularity:0,energy:1,boost:5},
  {label:'Invitar a un compañero al viaje',cash:0,popularity:2,energy:2,boost:2}]}],
 penthouse:[{title:'Fiesta en tu nueva vivienda',text:'Te invitan a una celebración en tu ático justo antes de una jornada importante.',options:[
  {label:'Invitar a compañeros y marcharte temprano',cash:-1200,popularity:3,energy:-3,boost:1},
  {label:'Celebrar hasta tarde',cash:-3500,popularity:5,energy:-15,boost:-5},
  {label:'Cancelar y descansar',cash:0,popularity:-1,energy:9,boost:3}]}],
 image_agent:[{title:'Contrato publicitario sobre la mesa',text:'Tu representante de imagen recibe una propuesta que compite con tu horario de entrenamiento.',options:[
  {label:'Firmar la campaña completa',cash:11000,popularity:5,energy:-7,boost:-2},
  {label:'Negociar una campaña corta',cash:4500,popularity:3,energy:-2,boost:1},
  {label:'Concentrarte en el partido',cash:0,popularity:0,energy:4,boost:3}]}],
 streaming_room:[{title:'Tu directo se vuelve viral',text:'Un clip de tu sala de contenido suma miles de visualizaciones, pero mañana tienes partido.',options:[
  {label:'Seguir transmitiendo',cash:2000,popularity:5,energy:-9,boost:-2},
  {label:'Despedirte pronto de los seguidores',cash:500,popularity:2,energy:1,boost:2},
  {label:'Invitar a un compañero al próximo directo',cash:1000,popularity:3,energy:-2,boost:1}]}],
 family_trip:[{title:'Tu madre llega para verte jugar',text:'Tu madre viajó para acompañarte. Te llama antes del partido y te cuenta cuánto confía en ti.',options:[
  {label:'Pasar un rato con ella',cash:-250,popularity:1,energy:5,boost:4},
  {label:'Dedicarle tu próximo partido',cash:0,popularity:2,energy:0,boost:5},
  {label:'Concentrarte y hablar después',cash:0,popularity:0,energy:2,boost:1}]}],
 charity_foundation:[{title:'La fundación organiza un torneo de niños',text:'Tus seguidores esperan que asistas y el club te pide estar en el entrenamiento.',options:[
  {label:'Asistir a la inauguración',cash:-1500,popularity:6,energy:-4,boost:2},
  {label:'Mandar una ayuda económica',cash:-4000,popularity:3,energy:0,boost:1},
  {label:'Invitar a los niños al partido',cash:-750,popularity:5,energy:-2,boost:4}]}],
 private_court:[{title:'Tu cancha personal impresiona al entrenador',text:'El preparador ve tu trabajo extra y te pide demostrarlo.',options:[
  {label:'Tirar cien triples',cash:0,popularity:0,energy:-7,boost:5},
  {label:'Practicar jugadas con el base',cash:0,popularity:1,energy:-5,boost:5},
  {label:'Recuperarte para el partido',cash:0,popularity:0,energy:6,boost:2}]}],
 sports_psychologist:[{title:'Nueva rutina mental para la presión',text:'Tu especialista te recomienda una preparación antes del partido más difícil del mes.',options:[
  {label:'Practicar visualización',cash:0,popularity:0,energy:4,boost:5},
  {label:'Hablar de los últimos errores',cash:0,popularity:0,energy:3,boost:4},
  {label:'Seguir tu rutina habitual',cash:0,popularity:0,energy:2,boost:1}]}]
};
const GUESTS=[
 {name:'Tu madre',prompt:'Tu madre te espera a la entrada del pabellón. Está emocionada y quiere hablar contigo antes del salto.',opt:['Abrazarla y prometer esfuerzo|playmaking','Dedicarle una canasta|shooting','Ir a descansar para estar en forma|athleticism']},
 {name:'Una actriz famosa',prompt:'Una actriz muy conocida está en primera fila y pide conocer al jugador del que todos hablan.',opt:['Saludarla con tranquilidad|playmaking','Prometer una jugada espectacular|shooting','Centrarte en el partido|defense']},
 {name:'Un representante internacional',prompt:'Un representante de una liga importante viene a verte desde las gradas. Tu futuro podría cambiar.',opt:['Jugar para impresionar|shooting','Mostrar visión de juego|playmaking','Demostrar disciplina defensiva|defense']},
 {name:'Una leyenda retirada',prompt:'Un exjugador famoso visita el vestuario y ofrece consejos antes del partido.',opt:['Escuchar y aprender|playmaking','Pedir consejo de tiro|shooting','Solicitar técnicas defensivas|defense']},
 {name:'Tu mejor amigo',prompt:'Tu mejor amigo viajó sin avisar y trae una camiseta de tu infancia.',opt:['Hablar de vuestros sueños|playmaking','Regalarle una camiseta actual|shooting','Mantener la calma antes de jugar|defense']},
 {name:'Un ojeador de la selección',prompt:'Hay un ojeador nacional sentado en la grada. Ha venido a evaluar tu capacidad defensiva.',opt:['Apostar por los robos|defense','Organizar a tus compañeros|playmaking','Mostrar todo tu repertorio de tiro|shooting']},
 {name:'Un cantante popular',prompt:'Un cantante muy conocido te felicita por tus últimos partidos. Miles de seguidores ven el encuentro.',opt:['Saludar a la afición|playmaking','Buscar un triple muy largo|shooting','Hacer una actuación discreta y sólida|defense']},
 {name:'Tu antiguo entrenador',prompt:'El entrenador que te descubrió aparece en la grada y recuerda tus primeros entrenamientos.',opt:['Agradecerle su ayuda|playmaking','Demostrar tu evolución|shooting','Concentrarte en tus tareas defensivas|defense']},
 {name:'Un patrocinador',prompt:'Una marca importante quiere usar tu imagen para una campaña. Observa cómo gestionas la presión.',opt:['Responder con serenidad|playmaking','Ofrecer espectáculo|shooting','Ser profesional y disciplinado|defense']},
 {name:'La afición visitante',prompt:'Un grupo de aficionados rivales te provoca desde la grada durante el calentamiento.',opt:['Ignorar los abucheos|defense','Responder con un triple|shooting','Liderar una charla de equipo|playmaking']},
 {name:'Tu hermano pequeño',prompt:'Tu hermano aparece en la primera fila y te pide que le dediques la siguiente canasta.',opt:['Prometerle una bandeja|athleticism','Darle una camiseta antes del juego|playmaking','Dedicarle un triple|shooting']},
 {name:'La prensa deportiva',prompt:'Una periodista te pregunta por qué no has sido titular en los últimos partidos.',opt:['Reconocer que debes mejorar|playmaking','Prometer puntos|shooting','Defender el trabajo del entrenador|defense']}
];
const INTERVIEWS=[
 {id:'wins',text:'La prensa pregunta: «¿Por qué habéis ganado hoy?»',opts:[
  {label:'Ganamos gracias a mis compañeros',pop:2,trust:2,rep:0,energy:0},
  {label:'Fui decisivo; quiero más protagonismo',pop:4,trust:-2,rep:1,energy:-1},
  {label:'El próximo partido será todavía más difícil',pop:1,trust:1,rep:1,energy:1}]},
 {id:'losses',text:'Tras la derrota, un periodista te pregunta quién tuvo la culpa.',opts:[
  {label:'Asumo mi parte y trabajaré más',pop:1,trust:3,rep:1,energy:-1},
  {label:'El entrenador no me dio suficientes minutos',pop:3,trust:-6,rep:-1,energy:0},
  {label:'Esto se gana y se pierde entre todos',pop:2,trust:1,rep:0,energy:1}]},
 {id:'rumors',text:'Una reportera pregunta si aceptarías jugar en un equipo más grande.',opts:[
  {label:'Estoy comprometido con mi club',pop:1,trust:3,rep:1,energy:0},
  {label:'Escucharía ofertas si llegan',pop:3,trust:-2,rep:1,energy:0},
  {label:'Mi agente se encarga de esas cosas',pop:1,trust:0,rep:1,energy:1}]},
 {id:'star',text:'Te preguntan si quieres ser la gran estrella de la liga.',opts:[
  {label:'Quiero ganarme ese puesto en la cancha',pop:3,trust:1,rep:2,energy:-2},
  {label:'La prioridad es ganar el campeonato',pop:2,trust:3,rep:1,energy:0},
  {label:'Voy a superar a todos mis rivales',pop:5,trust:-3,rep:2,energy:-1}]},
 {id:'celebrity',text:'Una actriz famosa ha visto tu partido. La prensa quiere saber si te distrae tanta atención.',opts:[
  {label:'Lo agradezco, pero mi vida es baloncesto',pop:3,trust:2,rep:1,energy:0},
  {label:'Quiero más focos y grandes escenarios',pop:6,trust:-3,rep:0,energy:-2},
  {label:'Todos los aficionados son importantes',pop:2,trust:2,rep:1,energy:0}]},
 {id:'family',text:'Un periodista menciona que tu familia vino a verte. ¿Qué les dirías?',opts:[
  {label:'Gracias por creer siempre en mí',pop:4,trust:1,rep:1,energy:2},
  {label:'Les dedicaré cada buena actuación',pop:3,trust:0,rep:1,energy:1},
  {label:'Prefiero mantenerlos lejos de la prensa',pop:0,trust:1,rep:0,energy:1}]}
];
function core(s){const c=E.initWorld(s);if(!Array.isArray(c.storyQueue))c.storyQueue=[];if(!Array.isArray(c.storyHistory))c.storyHistory=[];if(!Array.isArray(c.interviewHistory))c.interviewHistory=[];if(!Number.isFinite(c.totalGames))c.totalGames=s.world?.playerGames?.length||0;return c;}
const originalBuy=E.buy;
E.buy=function(s,id){
 const res=originalBuy(s,id);
 if(!res?.ok)return res;
 const c=core(s),item=res.item;
 const boost={sports_car:5,luxury_car:9,personal_driver:2,penthouse:5,image_agent:5,streaming_room:4,family_trip:2,charity_foundation:7,private_court:1,sports_psychologist:1}[id]||0;
 if(boost){c.popularity=clamp(c.popularity+boost,0,100);s.fans+=boost*120;}
 if(arcTemplates[id]){
  const due=c.totalGames+3+Math.floor(Math.random()*8);
  c.storyQueue.push({id:'ownership-'+id+'-'+c.totalGames,type:'ownership',asset:id,dueAt:due,createdAt:c.totalGames});
 }
 c.lastPurchase={item:item.name,popularity:boost,cash:-item.price};
 return res;
};
const oldPay=E.pay;
E.pay=function(s){const amount=oldPay(s);core(s).totalGames++;return amount;};
function nextStory(s){
 const c=core(s);
 return c.storyQueue.find(x=>!x.done&&x.dueAt<=c.totalGames)||null;
}
function prepareStory(s){
 const c=core(s),item=nextStory(s);if(!item)return null;
 if(c.pendingStory?.id===item.id)return c.pendingStory;
 const templates=arcTemplates[item.asset]||[];if(!templates.length)return null;
 const e=choice(templates);
 c.pendingStory={...e,id:item.id,asset:item.asset};
 return c.pendingStory;
}
function resolveStory(s,index){
 const c=core(s),p=c.pendingStory;
 if(!p||!Number.isInteger(index)||index<0||index>=p.options.length)return null;
 const opt=p.options[index];const paid=opt.cash<0?Math.max(opt.cash,-c.cash):opt.cash;
 c.cash=Math.max(0,c.cash+paid);c.popularity=clamp(c.popularity+opt.popularity,0,100);
 s.player.energy=clamp(s.player.energy+opt.energy,0,100);
 s.fans=Math.max(0,s.fans+opt.popularity*85);
 c.storyBoost=clamp((c.storyBoost||0)+opt.boost,-8,8);
 const queue=c.storyQueue.find(x=>x.id===p.id);if(queue)queue.done=true;
 c.storyHistory.unshift({title:p.title,choice:opt.label,season:s.season,week:s.world.week,paid,popularity:opt.popularity,boost:opt.boost});
 c.storyHistory=c.storyHistory.slice(0,40);delete c.pendingStory;
 return {title:p.title,choice:opt.label,cash:paid,popularity:opt.popularity,energy:opt.energy,boost:opt.boost};
}
const oldPreparePregame=E.preparePregame;
E.preparePregame=function(s,team,opponent,phase){
 const e=oldPreparePregame(s,team,opponent,phase);
 if(!e||e.v5)return e;
 if(Math.random()<.64){
  const guest=choice(GUESTS);e.id='visit-'+GUESTS.indexOf(guest);
  e.text=guest.prompt;e.options=guest.opt.map(x=>{const [label,stat]=x.split('|');return {label,stat};});
  e.guest=guest.name;e.v5=true;
  const c=core(s);c.pregame=e;
 }
 return e;
};
const originalResolvePregame=E.resolvePregame;
E.resolvePregame=function(s,index){
 const c=core(s),event=c.pregame,guest=event?.guest;
 const result=originalResolvePregame(s,index);
 if(result&&guest){
  const bump=result.success?2:-1;c.popularity=clamp(c.popularity+bump,0,100);
  s.fans=Math.max(0,s.fans+bump*35);
  c.lastGuest=guest;
 }
 return result;
};
const originalPrepare=E.prepare;
E.prepare=function(s,team,opponent,phase){
 const p=originalPrepare(s,team,opponent,phase);
 const c=core(s);
 if(p&&Number.isFinite(c.storyBoost)&&c.storyBoost!==0&&!p.v5Boosted){
  p.modifier+=c.storyBoost;p.dayDesc+=' Tus decisiones fuera de la cancha afectan tu estado de ánimo.';
  p.v5Boosted=true;c.storyBoost=0;
 }
 return p;
};
function scheduleInterview(s,line,stage){
 if(!line||line.dnp)return null;
 const c=core(s);if(c.interviewPending)return c.interviewPending;
 if(stage!=='regular'||c.totalGames%2===0||Math.random()<.25){
  const p=line.win?INTERVIEWS.filter(v=>v.id!=='losses'):INTERVIEWS.filter(v=>v.id!=='wins');
  const e=choice(p);c.interviewPending={...e,stage,week:line.week,season:s.season,team:s.teamId};
  return c.interviewPending;
 }
 return null;
}
function resolveInterview(s,index){
 const c=core(s),q=c.interviewPending;if(!q||!Number.isInteger(index)||index<0||index>=q.opts.length)return null;
 const ans=q.opts[index],pop=ans.pop+(c.owned.includes('image_agent')?1:0);
 c.popularity=clamp(c.popularity+pop,0,100);c.coachTrust=clamp(c.coachTrust+ans.trust,0,100);
 s.reputation=clamp(s.reputation+ans.rep,0,100);s.player.energy=clamp(s.player.energy+ans.energy,0,100);
 s.fans=Math.max(0,s.fans+pop*65);c.interviewHistory.unshift({question:q.text,answer:ans.label,week:q.week,season:q.season,pop,trust:ans.trust});
 c.interviewHistory=c.interviewHistory.slice(0,45);delete c.interviewPending;
 return {answer:ans.label,pop,trust:ans.trust,rep:ans.rep,energy:ans.energy};
}
const CLUTCH_OPTS=[
 {label:'Buscar el triple de la victoria',stat:'shooting',risk:.13,good:8,bad:-6,pts:3},
 {label:'Crear un pase para el compañero libre',stat:'playmaking',risk:-.03,good:7,bad:-3,ast:2},
 {label:'Apretar en defensa y robar el balón',stat:'defense',risk:.03,good:7,bad:-3,stl:1},
 {label:'Penetrar y buscar una falta',stat:'athleticism',risk:.02,good:7,bad:-4,pts:2}
];
function needsClutch(s,phase,opponent){
 const c=core(s);if(c.clutchPending)return true;
 if(!opponent||s.player.injury>0)return false;
 if(phase==='playoffs')return true;
 const mine=E.teamStrength(window.WH_DATA.realTeams?.[s.leagueId]?.find(t=>t.id===s.teamId)||{rating:78});
 const theirs=E.teamStrength(opponent);
 return Math.abs(mine-theirs)<=12&&Math.random()<.42;
}
function startClutch(s,phase,opponent){
 const c=core(s);if(c.clutchPending)return c.clutchPending;
 c.clutchPending={phase,opponent:opponent?.name||'el rival',startAt:Date.now(),options:CLUTCH_OPTS};
 return c.clutchPending;
}
function clutchProbability(s,opt,timing){
 const value=s.player.skills[opt.stat]||60;
 const fatigue=(s.player.energy-60)*.0018;
 return clamp(.17+value*.0065-opt.risk+(timing-.5)*.24+fatigue+E.bonus(s,opt.stat)*.007,.14,.95);
}
function resolveClutch(s,index){
 const c=core(s),p=c.clutchPending;if(!p||!Number.isInteger(index)||index<0||index>=p.options.length)return null;
 const item=p.options[index],dt=Math.max(0,Date.now()-p.startAt),t=(dt%1800)/900;
 const needle=t<=1?t:2-t,accuracy=clamp(1-Math.abs(needle-.5)*2,0,1);
 const chance=clutchProbability(s,item,accuracy),won=Math.random()<chance;
 const impact=c.pendingImpact;if(!impact)return null;
 const delta=won?item.good:item.bad;
 impact.scoreDelta+=delta;impact.pts=(impact.pts||0)+(won?(item.pts||0):0);
 impact.ast=(impact.ast||0)+(won?(item.ast||0):0);
 impact.stl=(impact.stl||0)+(won?(item.stl||0):0);
 impact.fans=(impact.fans||0)+(won?220:0);
 impact.details+=' '+(won?'Conseguiste la posesión decisiva.':'Fallaste la posesión decisiva.');
 impact.clutch={success:won,choice:item.label,accuracy:Math.round(accuracy*100),probability:Math.round(chance*100),delta};
 c.coachTrust=clamp(c.coachTrust+(won?2.5:-1),0,100);
 c.popularity=clamp(c.popularity+(won?2:-1),0,100);
 c.clutchHistory=c.clutchHistory||[];c.clutchHistory.unshift({season:s.season,week:s.world.week,choice:item.label,won,delta});
 c.clutchHistory=c.clutchHistory.slice(0,40);delete c.clutchPending;
 return {success:won,choice:item.label,accuracy:Math.round(accuracy*100),probability:Math.round(chance*100),delta};
}
window.WH_STORIES={newCards:freshCards,purchases:PURCHASES,guests:GUESTS,interviews:INTERVIEWS,
 core,nextStory,prepareStory,resolveStory,scheduleInterview,resolveInterview,needsClutch,startClutch,resolveClutch,clutchProbability};
})();
