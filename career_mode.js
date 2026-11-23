/* WORLD HOOPS — Carrera interactiva. Decisiones, entrenamientos y estilo de vida. */
(function(){
'use strict';
const SEEDS=[
["Quedan segundos ante {rival}. {star} te pide el balón y el público de {club} está de pie.","Tomar el tiro ganador|shoot","Pasársela a {star}|pass","Atacar el aro y buscar contacto|drive"],
["{rival} cambia a una defensa en zona en la última posesión.","Lanzar desde la esquina|shoot","Mover el balón con {star}|pass","Cortar por la línea de fondo|drive"],
["El entrenador exige una jugada para empatar ante {rival}.","Buscar un triple rápido|shoot","Crear una asistencia|pass","Penetrar buscando dos puntos|drive"],
["{star} atrae a dos defensores; tienes espacio para decidir.","Recibir y lanzar|shoot","Devolverle el balón|pass","Ir directo al aro|drive"],
["Una falta te ha puesto nervioso y {rival} presiona a toda la cancha.","Probar tiro a media distancia|shoot","Organizar la salida|pass","Romper la presión con velocidad|run"],
["En el último cuarto, {club} necesita remontar frente a {rival}.","Forzar un lanzamiento decisivo|shoot","Buscar un compañero libre|pass","Presionar en defensa|defend"],
["{rival} defiende el perímetro y deja abierto el camino al aro.","Castigar desde el triple|shoot","Alimentar al pívot|pass","Atacar el espacio|drive"],
["El reloj de posesión está a cinco segundos mientras {star} corta hacia el aro.","Lanzar de inmediato|shoot","Asistir a {star}|pass","Cambiar de dirección|drive"],
["Dos defensores de {rival} saltan a cerrar tu tiro.","Elevarte por encima|shoot","Asistir al hombre libre|pass","Usar una finta y penetrar|drive"],
["El partido ante {rival} está igualado y el entrenador te da libertad.","Asumir el lanzamiento|shoot","Confiar en {star}|pass","Atacar con potencia|drive"],
["Te encuentras solo en transición ante {rival}.","Pararte y lanzar|shoot","Esperar y asistir|pass","Terminar con bandeja|drive"],
["Un contraataque de {club} te encuentra con dos compañeros corriendo.","Buscar el triple en carrera|shoot","Dar la asistencia al compañero|pass","Ir hasta el aro|run"],
["{rival} deja a su pívot defendiendo tu tiro exterior.","Buscar tu tiro|shoot","Ejecutar un pick and roll|pass","Atacar con velocidad|drive"],
["El base de {rival} pierde el control cerca de la banda.","Robar el balón|steal","Mantener la posición|defend","Cerrar el pase interior|block"],
["{rival} domina la pintura. Necesitas frenar su siguiente posesión.","Negar la entrada|defend","Buscar el tapón|block","Cerrar el rebote|rebound"],
["Tu rival directo te provoca después de una canasta.","Responder con un triple|shoot","Mantener la calma y asistir|pass","Contestar con defensa intensa|defend"],
["Una jugada de {rival} deja un tirador libre en la esquina.","Cambiar y puntear|defend","Arriesgar un robo|steal","Proteger la pintura|block"],
["Tu equipo está acumulando faltas personales ante {rival}.","Defender sin contacto|defend","Buscar una interceptación|steal","Conservar energía y cerrar rebote|rebound"],
["En un rebote ofensivo, el balón cae entre tres jugadores.","Pelear el rebote|rebound","Replegar para defender|defend","Salir al contraataque|run"],
["{rival} intenta sorprender con una puerta atrás.","Anticipar el pase|steal","Cambiar la marca|defend","Esperar para taponar|block"],
["Tu entrenador pide agresividad en el rebote ante {rival}.","Cerrar el rebote defensivo|rebound","Disputar cada balón|defend","Salir rápido tras el rebote|run"],
["El pívot de {rival} te supera por altura.","Buscar el tapón|block","Forzar un pase difícil|steal","Ganarle la posición|rebound"],
["Un árbitro advierte que no tolerará más contactos.","Mantener defensa limpia|defend","Intentar un robo valiente|steal","Evitar el contacto y correr|run"],
["{star} te pide que lideres un ajuste defensivo.","Coordinar la rotación|leader","Cerrar la línea de pase|steal","Proteger el aro|block"],
["El pabellón ruge tras una pérdida de {club}.","Robar en la siguiente jugada|steal","Parar al atacante|defend","Conseguir el siguiente rebote|rebound"],
["Un compañero falla tres tiros seguidos y baja la cabeza.","Animarlo en voz alta|leader","Buscarlo con un buen pase|pass","Tomar tú la iniciativa|shoot"],
["El entrenador te pide asumir más liderazgo en {club}.","Dirigir la ofensiva|leader","Dar ejemplo defendiendo|defend","Anotar para cambiar la energía|shoot"],
["Tienes un desacuerdo táctico con {star} durante un tiempo muerto.","Escuchar y cooperar|leader","Proponer una nueva asistencia|pass","Demostrarlo anotando|shoot"],
["La grada exige espectáculo mientras {club} juega en casa.","Buscar un mate|drive","Lanzar un triple lejano|shoot","Hacer lucir a un compañero|pass"],
["{rival} inicia una racha de diez puntos consecutivos.","Organizar a {club}|leader","Responder con tiros|shoot","Subir la presión defensiva|defend"],
["La prensa local critica tu último partido y hoy enfrentas a {rival}.","Responder con puntos|shoot","Concentrarte en asistencias|pass","Recuperar confianza defendiendo|defend"],
["Has salido desde el banquillo y tienes poco tiempo para impresionar.","Atacar en cada posesión|drive","Crear ventajas para otros|pass","Ser un muro en defensa|defend"],
["El entrenador duda entre mantenerte en cancha o descansar.","Pedir el balón para demostrar|shoot","Priorizar juego en equipo|pass","Dar una última defensa intensa|defend"],
["{club} quiere que conectes con sus aficionados esta noche.","Regalar una asistencia espectacular|pass","Intentar una jugada vistosa|drive","Celebrar junto al equipo|leader"],
["Te enfrentan a tu antiguo equipo, {rival}, bajo una enorme presión.","Buscar un tiro decisivo|shoot","Jugar para tus compañeros|pass","Responder con defensa|defend"],
["Un compañero joven necesita confianza en su debut.","Buscar su primer punto|pass","Darle un consejo|leader","Absorber la presión con puntos|shoot"],
["{rival} ha estudiado todos tus movimientos habituales.","Inventar un tiro nuevo|shoot","Cambiar el ritmo de pase|pass","Sorprender con un corte|run"],
["Vas camino de tu mejor actuación, pero tus piernas empiezan a pesar.","Intentar otro triple|shoot","Controlar el ritmo|pass","Conservar fuerzas para defender|defend"],
["Una jugada rota deja a {club} sin sistema ofensivo.","Crear una canasta individual|drive","Improvisar con {star}|pass","Buscar la línea de tres|shoot"],
["El entrenador te pide una defensa crucial después de un fallo.","Proteger el aro|block","Puntear el tiro exterior|defend","Anticipar un pase|steal"],
["{rival} cambia a una alineación pequeña y rápida.","Responder con velocidad|run","Atacar con pases interiores|pass","Aprovechar tu físico cerca del aro|rebound"],
["El marcador se estrecha con menos de un minuto por jugar.","Controlar el reloj|leader","Buscar tres puntos|shoot","Provocar un fallo del rival|defend"],
["La defensa te invita a tirar desde una posición incómoda.","Aceptar el lanzamiento|shoot","Elegir un pase inteligente|pass","Buscar una posición mejor|drive"],
["Una falta no señalada enfurece a {club}.","Concentrarte en el siguiente tiro|shoot","Calmar a los compañeros|leader","Volver fuerte a defender|defend"],
["En una posesión especial, el entrenador dibuja una jugada para {star}.","Respetar la jugada y asistir|pass","Ofrecer una pantalla y cortar|run","Pedir una segunda opción de tiro|shoot"],
["El partido ante {rival} pasa a un ritmo frenético.","Correr toda la cancha|run","Controlar los pases|pass","Frenar el juego defendiendo|defend"]
];
const FRAMES=[
"Última posesión del cuarto.",
"Con la grada al máximo.",
"Después de un tiempo muerto crucial.",
"Con el rival cambiando de marca.",
"En una noche de máxima rivalidad."
];
const ACTIONS={
 shoot:{stat:'shooting',pts:3,ast:0,reb:0,stl:0,blk:0,score:3,energy:-4,xp:9,fans:28,risk:.05,fail:-2},
 pass:{stat:'playmaking',pts:0,ast:2,reb:0,stl:0,blk:0,score:2,energy:-1,xp:8,fans:17,risk:-.02,fail:-1},
 drive:{stat:'athleticism',pts:2,ast:0,reb:0,stl:0,blk:0,score:2,energy:-6,xp:9,fans:23,risk:.04,fail:-2},
 run:{stat:'athleticism',pts:2,ast:0,reb:1,stl:0,blk:0,score:2,energy:-5,xp:8,fans:20,risk:.02,fail:-1},
 defend:{stat:'defense',pts:0,ast:0,reb:0,stl:1,blk:0,score:2,energy:-3,xp:8,fans:13,risk:-.01,fail:-1},
 steal:{stat:'defense',pts:0,ast:0,reb:0,stl:2,blk:0,score:3,energy:-4,xp:10,fans:17,risk:.06,fail:-2},
 block:{stat:'defense',pts:0,ast:0,reb:0,stl:0,blk:2,score:2,energy:-4,xp:9,fans:15,risk:.05,fail:-1},
 rebound:{stat:'athleticism',pts:0,ast:0,reb:2,stl:0,blk:0,score:1,energy:-2,xp:7,fans:11,risk:-.03,fail:-1},
 leader:{stat:'playmaking',pts:0,ast:1,reb:0,stl:0,blk:0,score:2,energy:1,xp:9,fans:16,risk:-.08,fail:0}
};
const DAYS=[
{name:'Día inspirado',modifier:13,energy:5,desc:'Te sientes imparable. La confianza está por las nubes.'},
{name:'Día normal',modifier:0,energy:0,desc:'Tu cuerpo responde como de costumbre.'},
{name:'Día de piernas pesadas',modifier:-11,energy:-9,desc:'Los viajes y la temporada empiezan a pesar.'},
{name:'Día de máxima concentración',modifier:9,energy:1,desc:'Estás leyendo la cancha mejor que nunca.'},
{name:'Día de poco sueño',modifier:-13,energy:-12,desc:'Dormiste mal y necesitas gestionar tus esfuerzos.'},
{name:'Día de energía total',modifier:11,energy:8,desc:'Te sientes rápido y explosivo.'},
{name:'Día de presión',modifier:-6,energy:-4,desc:'El ruido exterior te incomoda.'},
{name:'Día de mucha química',modifier:7,energy:2,desc:'Conectas con tus compañeros al primer toque.'},
{name:'Día de recuperación',modifier:3,energy:10,desc:'Tu trabajo fuera de la cancha está dando frutos.'}
];
const ITEMS=[
{id:'gym',name:'Gimnasio en casa',price:12000,desc:'Más fuerza y progreso en atletismo.',stat:'athleticism',bonus:5,training:1},
{id:'chef',name:'Chef personal',price:8000,desc:'Mejor alimentación y energía en días difíciles.',energy:10,bonus:2},
{id:'trainer',name:'Entrenador privado',price:16000,desc:'Sesiones más efectivas y mejor lectura de juego.',stat:'playmaking',bonus:5,training:1},
{id:'shooting',name:'Máquina de tiro',price:6500,desc:'Práctica diaria desde cualquier distancia.',stat:'shooting',bonus:5,training:1},
{id:'physio',name:'Fisioterapeuta personal',price:9000,desc:'Recuperación y menor desgaste por partido.',energy:9,bonus:3},
{id:'sleep',name:'Dormitorio de recuperación',price:5500,desc:'Dormir mejor reduce los días de cansancio.',energy:7,bonus:2},
{id:'nutrition',name:'Plan de nutrición deportiva',price:2500,desc:'Mejora la forma física general.',stat:'athleticism',bonus:3,energy:3},
{id:'film',name:'Sala de análisis de video',price:4500,desc:'Mejor toma de decisiones y pases.',stat:'playmaking',bonus:4},
{id:'coachdef',name:'Especialista defensivo',price:7500,desc:'Trabajo en robos, bloqueos y colocación.',stat:'defense',bonus:5,training:1},
{id:'massage',name:'Equipo de recuperación muscular',price:3800,desc:'Menor fatiga tras jugar.',energy:6},
{id:'shoes',name:'Zapatillas profesionales',price:900,desc:'Mayor confianza al atacar el aro.',stat:'athleticism',bonus:2},
{id:'basket',name:'Cancha privada de baloncesto',price:23000,desc:'Trabajo constante de tiro y creación.',stat:'shooting',bonus:6,training:1},
{id:'mind',name:'Psicólogo deportivo',price:3500,desc:'Gestiona los días de presión.',bonus:5},
{id:'recovery',name:'Piscina de recuperación',price:11500,desc:'Recuperación de energía durante la temporada.',energy:9},
{id:'academy',name:'Campus de verano privado',price:29000,desc:'Mejora el desarrollo de todas las capacidades.',bonus:4,training:1},
{id:'travel',name:'Preparador para viajes',price:4200,desc:'Menos impacto de las jornadas fuera de casa.',energy:6}
];
const SCENES=SEEDS.flatMap((s,i)=>FRAMES.map((f,j)=>({id:'game-'+(i*FRAMES.length+j+1),text:f+' '+s[0],options:s.slice(1).map(v=>{const p=v.split('|');return {label:p[0],action:p[1]};})})));
const STAR_HINTS={
 'Cleveland Cavaliers':'James Harden',
 'Golden State Warriors':'Stephen Curry',
 'Los Angeles Lakers':'Luka Dončić',
 'Denver Nuggets':'Nikola Jokić',
 'Milwaukee Bucks':'Giannis Antetokounmpo',
 'Oklahoma City Thunder':'Shai Gilgeous-Alexander',
 'San Antonio Spurs':'Victor Wembanyama',
 'New York Knicks':'Jalen Brunson',
 'Minnesota Timberwolves':'Anthony Edwards',
 'Boston Celtics':'Jayson Tatum'
};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fill=(str,context)=>str.replace(/\{(club|rival|star|player)\}/g,(_,k)=>context[k]||'tu equipo');
function init(s){
 if(!s)return null;
 if(!s.career||typeof s.career!=='object')s.career={};
 const c=s.career;
 if(!Array.isArray(c.owned))c.owned=[];
 if(!Array.isArray(c.seen))c.seen=[];
 if(!Array.isArray(c.log))c.log=[];
 if(!Number.isFinite(c.cash))c.cash=2500;
 if(!Number.isFinite(c.totalDecisions))c.totalDecisions=0;
 return c;
}
function teammate(name){return STAR_HINTS[name]||'el capitán de '+name;}
function bonus(s,stat){const c=init(s);return ITEMS.filter(i=>c.owned.includes(i.id)).reduce((a,i)=>a+(i.stat===stat?(i.bonus||0):i.stat?0:Math.round((i.bonus||0)/2)),0);}
function recovery(s){return ITEMS.filter(i=>init(s).owned.includes(i.id)).reduce((a,i)=>a+(i.energy||0),0);}
function prepare(s,team,opponent,phase){
 const c=init(s);
 if(c.pending)return c.pending;
 const unused=SCENES.filter(x=>!c.seen.includes(x.id));
 if(!unused.length)c.seen=[];
 const chosen=pick(unused.length?unused:SCENES);
 const day=pick(DAYS);
 const context={club:team.name,rival:opponent?.name||'tu próximo rival',star:teammate(team.name),player:s.player.name};
 c.pending={sceneId:chosen.id,phase,day:day.name,modifier:day.modifier,dayEnergy:day.energy,dayDesc:day.desc,prompt:fill(chosen.text,context),options:chosen.options.map(o=>({action:o.action,label:fill(o.label,context)})),rival:context.rival,club:team.name};
 return c.pending;
}
function resolve(s,index){
 const c=init(s),p=c.pending;if(!p)return null;
 const choice=p.options[index];if(!choice)return null;
 const action=ACTIONS[choice.action],skill=s.player.skills[action.stat]||55, extra=bonus(s,action.stat);
 const chance=clamp(.24+skill*.0055+extra*.007+p.modifier*.006-action.risk, .13,.92);
 const good=Math.random()<chance;
 const impact={sceneId:p.sceneId,day:p.day,action:choice.label,success:good,pts:good?action.pts:0,ast:good?action.ast:0,reb:good?action.reb:0,stl:good?action.stl:0,blk:good?action.blk:0,scoreDelta:good?action.score:action.fail,energy:action.energy+p.dayEnergy+recovery(s)*.35,xp:good?action.xp:3,fans:good?action.fans:0,reputation:good?0.7:-0.15,moodPts:p.modifier>=10?2:p.modifier<=-10?-2:0,details:good?'¡La decisión funcionó!':'La jugada no salió como esperabas.',probability:Math.round(chance*100)};
 c.seen.push(p.sceneId);c.seen=c.seen.slice(-SCENES.length);
 c.log.unshift({sceneId:p.sceneId,day:p.day,choice:choice.label,success:good,club:p.club,rival:p.rival,season:s.season,week:s.world.week+1});c.log=c.log.slice(0,45);
 c.totalDecisions++;
 c.pendingImpact=impact;delete c.pending;
 s.player.energy=clamp(s.player.energy+impact.energy,0,100);
 s.player.xp+=impact.xp;
 s.fans=Math.max(0,s.fans+impact.fans);
 s.reputation=clamp(s.reputation+impact.reputation,0,100);
 return impact;
}
function train(s,stat,method){
 const c=init(s),p=s.player;const keys=['shooting','playmaking','defense','athleticism'];
 if(!keys.includes(stat)||!['intense','technical','recovery'].includes(method))return null;
 if(s.world.phase!=='regular'||s.world.trainingWeek===s.world.week||p.injury>0||p.energy<18)return null;
 const plus=ITEMS.filter(i=>c.owned.includes(i.id)).reduce((n,i)=>n+(i.training||0)*(i.stat===stat||!i.stat?1:0),0);
 let gain=0,cost=0,experience=0,injuryRisk=0;
 if(method==='intense'){gain=1+Math.floor(Math.random()*3)+Math.min(2,plus);cost=-21;experience=16;injuryRisk=.035;}
 if(method==='technical'){gain=1+Math.floor(Math.random()*2)+Math.min(1,plus);cost=-11;experience=12;}
 if(method==='recovery'){gain=Math.random()<.45?1:0;cost=12+Math.round(recovery(s)*.4);experience=7;}
 p.skills[stat]=clamp(p.skills[stat]+gain,1,99);p.energy=clamp(p.energy+cost,0,100);p.xp+=experience;
 if(Math.random()<injuryRisk){p.injury=1;}
 s.world.trainingWeek=s.world.week;
 return {gain,cost,experience,injury:p.injury>0,method};
}
function buy(s,id){
 const c=init(s),item=ITEMS.find(x=>x.id===id);
 if(!item)return {ok:false,message:'Artículo no disponible.'};
 if(c.owned.includes(id))return {ok:false,message:'Ya tienes esta mejora.'};
 if(c.cash<item.price)return {ok:false,message:'Saldo insuficiente para esta compra.'};
 c.cash-=item.price;c.owned.push(id);
 return {ok:true,item,message:'Has adquirido '+item.name+'.'};
}
function pay(s){
 const c=init(s);
 const rounds=Math.max(1,s.world.rounds?.length||30);
 const amount=Math.max(100,Math.round((s.salary||30000)/rounds));
 c.cash+=amount;return amount;
}
window.WH_CAREER={scenes:SCENES,items:ITEMS,init,prepare,resolve,train,buy,pay,recovery,bonus};
})();
