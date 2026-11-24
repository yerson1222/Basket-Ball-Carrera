/* WORLD HOOPS V7 — skill-based arcade and locker-room consequences. */
(function(){
'use strict';
const E=window.WH_CAREER,S=window.WH_STORIES,V=window.WH_V6,O=window.WH_ORIGIN,D=window.WH_DATA;
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rand=n=>Math.floor(Math.random()*n);
const modes={timing:{title:'Triple bajo presión',icon:'🏀',stat:'shooting',description:'Encesta tres tiros. La zona se estrecha y el cursor acelera en cada intento.'},passing:{title:'Circulación de balón',icon:'🤝',stat:'playmaking',description:'Pasa al compañero libre indicado antes de que termine cada posesión.'},shooting:{title:'Concurso de tiro',icon:'🎯',stat:'shooting',description:'Toca la canasta iluminada antes de que cambie de posición. Suma tantos puntos como puedas en 15 segundos.'},defense:{title:'Defensa 1 contra 1',icon:'🛡️',stat:'defense',description:'Observa la finta y el hombro del atacante. Cierra su trayectoria antes de que arranque.'},steal:{title:'Intercepción',icon:'⚡',stat:'defense',description:'Lee la dirección del pase y toca el carril antes de que el balón llegue.'},pickroll:{title:'Pick and roll',icon:'🧠',stat:'playmaking',description:'Lee la cobertura defensiva y elige la mejor respuesta.'},rebound:{title:'Batalla por el rebote',icon:'💪',stat:'athleticism',description:'Observa el rebote y ocupa la zona de caída antes de que aterrice el balón.'}};
const byStat={shooting:['timing','shooting'],playmaking:['passing','pickroll'],defense:['defense','steal'],athleticism:['rebound','shooting']};
const combineModes=['shooting','passing','defense','pickroll','timing','rebound'];
let game=null,timer=null,ready=null;
const now=()=>Date.now();
function stop(){if(timer!==null)clearInterval(timer);timer=null;game=null;ready=null;}
function make(mode,skill=70,names=[],callback=()=>{},clock=now,rng=Math.random){
 if(!modes[mode])mode='timing';
 return {mode,skill:clamp(skill,1,99),names:names.slice(0,4),callback,clock,rng,round:0,hits:0,points:0,attempts:0,history:[],started:clock(),roundStarted:clock(),target:0,done:false,locked:false};
}
function choice(g,n){return Math.floor(g.rng()*n);}
function setup(g){
 g.roundStarted=g.clock();g.locked=false;const prior=g.target;g.target=choice(g,g.mode==='passing'?4:3);if(g.round>0&&g.target===prior&&g.rng()>.4)g.target=(g.target+1)%(g.mode==='passing'?4:3);
 if(g.mode==='pickroll')g.target=choice(g,3);
 if(g.mode==='shooting')g.target=choice(g,3);
}
function count(g){return g.mode==='timing'?3:g.mode==='pickroll'?5:7;}
function limit(g){return g.mode==='timing'?4500:g.mode==='passing'?Math.max(650,1450-g.round*135):g.mode==='defense'?Math.max(550,1050-g.round*85):g.mode==='steal'?Math.max(525,1050-g.round*90):g.mode==='rebound'?Math.max(650,1300-g.round*105):g.mode==='pickroll'?2100:15000;}
function timing(g){const half=[740,470,300][Math.min(g.round,2)],q=((g.clock()-g.roundStarted)%(half*2))/half;return q<=1?q:2-q;}
function score(g){const max=g.mode==='shooting'?34:count(g);return clamp(g.mode==='shooting'?g.points/max:g.hits/max,0,1);}
function result(g){return {mode:g.mode,stat:modes[g.mode].stat,accuracy:score(g),hits:g.hits,points:g.points,attempts:g.attempts,success:g.mode==='timing'?g.hits===3:g.mode==='shooting'?g.points>=34:g.hits>=count(g)-1};}
function step(g,index,timeout=false){
 if(g.done||g.locked)return null;
 const elapsed=g.clock()-g.roundStarted;
 if(g.mode==='shooting'){
  if(g.clock()-g.started>=15000){g.done=true;return result(g);}
  if(timeout){setup(g);return null;}
  if(elapsed<240)return null;
  const good=index===g.target&&elapsed<780;g.attempts++;g.hits+=good?1:0;g.points=Math.max(0,g.points+(good?(index===1?3:2):-2));g.history.push(good);setup(g);return null;
 }
 if(elapsed>=limit(g))timeout=true;
 let good=false;
 if(!timeout){
  if(g.mode==='timing'){const tolerance=[.115,.075,.047][g.round]+(g.skill-50)*.0008;good=Math.abs(timing(g)-.5)<=tolerance;}
  else good=index===g.target&&elapsed>=120;
 }
 g.attempts++;g.hits=Math.max(0,g.hits+(good?1:-1));g.points=Math.max(0,g.points+(good?2:-1));g.history.push(good);g.round++;
 if(g.round>=count(g)){g.done=true;return result(g);}
 setup(g);return null;
}
function button(i,label,cls='',extra=''){return '<button type="button" class="v7-target '+cls+'" data-v7-input="'+i+'" '+extra+'>'+label+'</button>';}
function player(n,cls=''){return '<span class="v7-person '+cls+'" aria-hidden="true"><i></i><b></b></span><span>'+esc(n)+'</span>';}
const directions=['← Izquierda','↑ Centro','Derecha →'];
const defensive=['Carga el hombro izquierdo','Baja el hombro hacia el centro','Carga el hombro derecho'];
const covers=['El pívot rival sale a presionarte; tu bloqueador queda libre.','El defensor del lado débil colapsa hacia el aro; el tirador está libre.','El defensor retrocede y protege la línea de pase; tienes espacio para atacar.'];
function markup(g){
 const m=modes[g.mode],left=g.mode==='shooting'?Math.ceil(Math.max(0,15000-(g.clock()-g.started))/1000):Math.ceil(Math.max(0,limit(g)-(g.clock()-g.roundStarted))/1000);
 const dots=g.history.slice(-12).map(x=>'<i class="'+(x?'ok':'bad')+'">'+(x?'✓':'×')+'</i>').join('');
 let field='';
 if(g.mode==='timing'){const width=2*([.115,.075,.047][g.round]+(g.skill-50)*.0008)*100;field='<div class="v7-hoop">🏀<span>CANASTA</span></div><div class="v7-track"><i style="width:'+width+'%;left:'+(50-width/2)+'%"></i><b id="v7-needle"></b></div>'+button(0,'LANZAR','v7-launch');}
 if(g.mode==='passing'){field='<div class="v7-court"><div class="v7-passer">🏀 Tú</div><div class="v7-formation">'+Array.from({length:4},(_,i)=>button(i,player(g.names[i]||'Compañero '+(i+1),i===g.target?'open':''),i===g.target?'open':'guarded')).join('')+'</div></div><p>Necesitas 6 de 7 puntos netos; cada fallo resta uno. El tiempo se reduce en cada ronda.</p>';}
 if(g.mode==='shooting'){field='<div class="v7-court v7-shooting">'+[0,1,2].map(i=>button(i,'<span class="v7-basket">▱</span><span>'+(i===1?'3 PTS':'2 PTS')+'</span>',i===g.target?'open':'guarded')).join('')+'</div><p>Necesitas 34 puntos. Los fallos restan 2; el aro cambia cada 0,78 s.</p>';}
 if(g.mode==='defense'){field='<div class="v7-court v7-lanes"><div class="v7-attacker" style="--lean:'+(g.target-1)*18+'deg">'+player('Rival')+'<span>🏀</span></div><strong>'+defensive[g.target]+'</strong><div class="v7-lane-buttons">'+directions.map((s,i)=>button(i,s)).join('')+'</div></div><p>Cierra la dirección que indica el hombro antes de que arranque.</p>';}
 if(g.mode==='steal'){field='<div class="v7-court v7-lanes"><div class="v7-attacker">'+player('Pasador')+' 🏀</div><div class="v7-pass-line" style="--lane:'+(g.target-1)*32+'deg"></div><strong>Pase hacia '+['la izquierda','el centro','la derecha'][g.target]+'</strong><div class="v7-lane-buttons">'+directions.map((s,i)=>button(i,s)).join('')+'</div></div>';}
 if(g.mode==='pickroll'){field='<div class="v7-court v7-play"><span>🏀</span><span>▰ Bloqueador</span><span>● Defensa</span><strong>'+covers[g.target]+'</strong></div>'+['Pase al bloqueador','Pase al tirador','Penetrar'].map((x,i)=>button(i,x)).join('');}
 if(g.mode==='rebound'){field='<div class="v7-court v7-lanes"><div class="v7-hoop">🏀</div><div class="v7-bounce" style="--lane:'+(g.target-1)*32+'deg"></div><strong>El rebote sale hacia '+['la izquierda','el centro','la derecha'][g.target]+'</strong><div class="v7-lane-buttons">'+directions.map((x,i)=>button(i,x)).join('')+'</div></div>';}
 return '<div class="modal-backdrop v7-backdrop"><section class="modal-card v7-arcade" role="dialog" aria-modal="true" aria-label="'+esc(m.title)+'"><div class="v6-kicker">WORLD HOOPS · NIVEL PROFESIONAL</div><h2>'+m.icon+' '+m.title+'</h2><p>'+m.description+'</p><div class="v7-hud"><span>'+(g.mode==='shooting'?'PUNTOS '+g.points:'ACIERTO '+g.hits+' / '+count(g))+'</span><span id="v7-clock">'+left+' s</span><span>'+(g.mode==='shooting'?'15 SEGUNDOS':'RONDA '+(g.round+1))+'</span></div><div class="v7-dots">'+dots+'</div>'+field+'<small class="v7-help">Habilidad de tu jugador: '+g.skill+'/99 · El resultado afecta a tu carrera.</small><button type="button" class="btn ghost" data-v7-forfeit>Abandonar prueba (cuenta como fallo)</button></section></div>';
}
function draw(){const root=document.querySelector('#modal-root');if(root&&game){root.innerHTML=markup(game);document.body.classList.add('modal-open');}}
function finish(g,r){const cb=g.callback;stop();cb(r);}
function tick(){
 const g=game;if(!g)return;
 const root=document.querySelector('#modal-root');if(!root||!root.querySelector('.v7-arcade')){finish(g,{...result(g),accuracy:0,success:false});return;}
 const elapsed=g.clock()-g.roundStarted,remaining=g.mode==='shooting'?15000-(g.clock()-g.started):limit(g)-elapsed;
 const clock=root.querySelector('#v7-clock');if(clock)clock.textContent=Math.ceil(Math.max(0,remaining)/1000)+' s';
 const needle=root.querySelector('#v7-needle');if(needle)needle.style.left=(timing(g)*100)+'%';
 if(g.mode==='shooting'&&remaining<=0){g.done=true;finish(g,result(g));return;}
 if(g.mode==='shooting'&&elapsed>=780){setup(g);draw();return;}
 if(g.mode!=='shooting'&&remaining<=0){const r=step(g,-1,true);if(r)finish(g,r);else draw();}
}
function start(mode,skill,names,cb){stop();const m=modes[mode]||modes.timing;ready={mode,skill,names,cb};const root=document.querySelector('#modal-root');if(!root){ready=null;return;}root.innerHTML='<div class="modal-backdrop v7-backdrop"><section class="modal-card v7-arcade" role="dialog" aria-modal="true"><div class="v6-kicker">PREPARACIÓN · TIEMPO EN PAUSA</div><h2>'+m.icon+' '+esc(m.title)+'</h2><p>'+esc(m.description)+'</p><p>El cronómetro no empieza hasta que pulses Listo.</p><button class="btn primary" type="button" data-v7-ready>¡Listo! Empezar</button></section></div>';document.body.classList.add('modal-open');}
function launchReady(){if(!ready)return;const r=ready;ready=null;game=make(r.mode,r.skill,r.names,r.cb);setup(game);draw();timer=setInterval(tick,35);}
document.addEventListener('click',e=>{if(!e.target.closest('[data-v7-ready]')||!ready)return;e.preventDefault();e.stopImmediatePropagation();launchReady();},true);
document.addEventListener('keydown',e=>{if(ready&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();}},true);
function input(i){if(!game)return;const g=game,r=step(g,i);if(r)finish(g,r);else draw();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-v7-input],[data-v7-forfeit]');if(!b||!game)return;e.preventDefault();e.stopImmediatePropagation();if(b.hasAttribute('data-v7-forfeit')){const g=game;finish(g,{...result(g),accuracy:0,success:false});}else input(Number(b.dataset.v7Input));},true);
document.addEventListener('keydown',e=>{if(game&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();const g=game;finish(g,{...result(g),accuracy:0,success:false});}},true);
function chooseMode(stat,seed=0){const a=byStat[stat]||byStat.shooting;return a[Math.abs(seed)%a.length];}
function combineResult(draft,r){const test=O.activeTest(draft);if(!test)return null;const pts=Math.round(r.accuracy*20);draft.score+=pts;draft.skills[test.stat]=clamp(draft.skills[test.stat]+(r.success?1:0),1,95);const out={test:test.title,label:modes[r.mode].title,success:r.success,score:pts,timing:Math.round(r.accuracy*100),probability:100,total:draft.score};draft.history.push(out);draft.index++;return out;}
function clutchResult(s,index,r){const c=S.core(s),p=c.clutchPending,item=p?.options?.[index],impact=c.pendingImpact;if(!p||!item||!impact)return null;const won=r.success,delta=won?item.good:item.bad;impact.scoreDelta=(impact.scoreDelta||0)+delta;for(const k of ['pts','ast','stl'])impact[k]=(impact[k]||0)+(won?(item[k]||0):0);impact.details+=' '+modes[r.mode].title+': '+(won?'éxito.':'fallo.');impact.clutch={success:won,choice:item.label,accuracy:Math.round(r.accuracy*100),probability:100,delta,mode:r.mode};c.coachTrust=clamp(c.coachTrust+(won?3:-2));c.popularity=clamp(c.popularity+(won?2:-1));c.clutchHistory=c.clutchHistory||[];c.clutchHistory.unshift({season:s.season,week:s.world.week,choice:item.label,won,delta,mode:r.mode});c.clutchHistory=c.clutchHistory.slice(0,40);delete c.clutchPending;return impact.clutch;}
const activities={
 talk:{icon:'💬',name:'Hablar y apoyar',cost:5,base:.8,good:[10,0,7,4],bad:[-6,0,-4,-2],text:'Escuchar sus preocupaciones'},
 train:{icon:'🏋️',name:'Entrenamiento extra',cost:12,base:.68,good:[5,-5,9,5],bad:[-4,-8,-3,-3],text:'Trabajar juntos en la cancha'},
 rest:{icon:'🩹',name:'Recuperación conjunta',cost:6,base:.85,good:[3,15,6,3],bad:[-3,2,-2,-1],text:'Ayudarle con la recuperación'},
 dinner:{icon:'🍽️',name:'Cena de equipo',cost:9,base:.76,good:[9,0,8,7],bad:[-3,-6,-2,-4],text:'Organizar una salida de grupo'},
 mediate:{icon:'🤝',name:'Mediar en un conflicto',cost:8,base:.57,good:[12,0,12,10],bad:[-12,0,-9,-8],text:'Intentar resolver tensiones'},
 film:{icon:'🎬',name:'Estudiar al rival',cost:7,base:.72,good:[4,0,6,5],bad:[-3,-4,-3,-2],text:'Analizar jugadas y preparar el partido'}
};
function weekKey(s){return s.season+':'+s.world.week+(s.world.phase==='playoffs'?':p'+s.world.playoffs.round:'');}
function available(s){const v=V.core(s);return ['regular','playoffs'].includes(s.world.phase)&&!v.helped[weekKey(s)];}
function chance(s,p,a){const v=V.core(s);return clamp(a.base+(p.bond-50)*.003+(v.chemistry-60)*.002+(s.player.skills.playmaking-65)*.0015,.25,.96);}
function act(s,name,id,rng=Math.random){const v=V.core(s),p=v.players[name],a=activities[id];if(!a||!p||!available(s)||s.player.energy<a.cost)return null;
 const probability=chance(s,p,a),ok=rng()<probability,[morale,energy,bond,chemistry]=ok?a.good:a.bad;
 v.helped[weekKey(s)]=true;s.player.energy=clamp(s.player.energy-a.cost);p.morale=clamp(p.morale+morale);p.energy=clamp(p.energy+energy);p.bond=clamp(p.bond+bond);v.chemistry=clamp(v.chemistry+chemistry);
 if(id==='dinner'||id==='mediate')for(const other of Object.values(v.players))if(other!==p)other.morale=clamp(other.morale+(ok?3:-2));
 if(ok&&['train','film'].includes(id)){s.player.xp+=10;S.core(s).storyBoost=clamp((S.core(s).storyBoost||0)+3,-8,8);}
 v.activities=v.activities||[];const out={name,id,title:a.name,ok,probability:Math.round(probability*100),morale,energy,bond,chemistry,cost:a.cost,season:s.season,week:s.world.week};
 v.activities.unshift(out);v.activities=v.activities.slice(0,30);return out;}
function teamPanel(s){const v=V.core(s),rec=s.world.table[s.teamId]||{w:0,l:0,streak:0},open=available(s);const sign=n=>(n>0?'+':'')+n;
 return '<section class="v6-panel"><div class="v6-kicker">🤝 VESTUARIO · UNA ACTIVIDAD POR SEMANA</div><h2>Estado del equipo</h2><div class="v6-metrics"><div>🧩 Química<strong>'+Math.round(v.chemistry)+'/100</strong></div><div>🏆 Balance<strong>'+rec.w+'–'+rec.l+'</strong></div><div>🔥 Racha<strong>'+rec.streak+'</strong></div><div>🎭 Personalidad<strong>'+V.personality(v)+'</strong></div></div><div class="v6-meter"><i style="width:'+v.chemistry+'%"></i></div><p class="v7-week '+(open?'ready':'used')+'">'+(open?'● Actividad disponible esta semana':'✓ Actividad semanal agotada o fuera de temporada')+'</p><p>Las acciones pueden mejorar o empeorar la relación y la química. Solo puedes elegir una en toda la jornada.</p><div class="v6-grid">'+Object.entries(v.players).map(([n,p])=>'<article class="v6-mini v7-teammate"><div class="v7-face">'+player(n)+'</div><small>🙂 Ánimo '+Math.round(p.morale)+' · ⚡ Energía '+Math.round(p.energy)+' · 🤝 Afinidad '+Math.round(p.bond)+'</small><div class="v7-morale"><i style="width:'+p.morale+'%"></i></div><button class="btn primary" data-action="v7-team-open" data-name="'+esc(n)+'" '+(!open?'disabled':'')+'>Elegir actividad</button></article>').join('')+'</div><h3>Historial del vestuario</h3>'+((v.activities||[]).slice(0,5).map(x=>'<p>'+(x.ok?'✓':'⚠')+' '+esc(x.title)+' · '+esc(x.name)+' · Química '+sign(x.chemistry)+'</p>').join('')||'<p>Aún no hay actividades.</p>')+'</section>';}
function activityModal(s,name){const v=V.core(s),p=v.players[name];if(!p||!available(s))return '';return '<div class="modal-backdrop"><section class="modal-card v7-arcade" role="dialog" aria-modal="true"><h2>🤝 '+esc(name)+'</h2><p>Elige tu única actividad semanal. No todas saldrán bien.</p>'+Object.entries(activities).map(([id,a])=>'<button class="v7-activity" data-action="v7-team-act" data-name="'+esc(name)+'" data-kind="'+id+'" '+(s.player.energy<a.cost?'disabled':'')+'><strong>'+a.icon+' '+a.name+'</strong><span>'+a.text+'</span><small>'+Math.round(chance(s,p,a)*100)+'% de éxito · −'+a.cost+' energía</small></button>').join('')+'<button class="btn ghost" data-action="close-modal">Volver</button></section></div>';}
function activityResult(r){const sign=x=>(x>0?'+':'')+x;return '<div class="modal-backdrop"><div class="modal-card v7-arcade" role="dialog" aria-modal="true"><h2>'+(r.ok?'🤝 ¡Salió bien!':'⚠ No salió como esperabas')+'</h2><p>'+esc(r.title)+' · '+esc(r.name)+'</p><div class="v6-metrics"><div>Química<strong>'+sign(r.chemistry)+'</strong></div><div>Ánimo<strong>'+sign(r.morale)+'</strong></div><div>Afinidad<strong>'+sign(r.bond)+'</strong></div></div><p>Actividad semanal utilizada.</p><button class="btn primary" data-action="close-modal">Continuar</button></div></div>';}
function risk(o){return (o.tone===1||o.trust<0)?(o.trust<=-5||o.pop>=5?'alto':'medio'):'bajo';}
function riskLabel(o){const r=risk(o);return '<small class="v7-risk '+r+'"> '+(r==='alto'?'⚠ RIESGO ALTO':r==='medio'?'◐ RIESGO MEDIO':'✓ RIESGO BAJO')+'</small>';}
const prevInterview=S.resolveInterview;
S.resolveInterview=function(s,i){const q=S.core(s).interviewPending,o=q?.opts?.[i];const r=prevInterview(s,i);if(!r||!o)return r;const v=V.core(s),c=S.core(s),level=risk(o);r.risk=level;
 if(level!=='bajo'){const bad=Math.random()<(level==='alto'?.45:.24);r.backlash=bad;const trust=bad?(level==='alto'?-7:-3):0,chem=bad?-5:0;c.coachTrust=clamp(c.coachTrust+trust);v.chemistry=clamp(v.chemistry+chem);r.trust+=trust;r.chemistry=v.chemistry;if(!bad){c.popularity=clamp(c.popularity+2);r.pop+=2;}v.pressure=v.pressure||[];v.pressure.push({due:c.totalGames+2+rand(4),club:s.teamId,level});}
 return r;};
const prevRecord=E.recordGame;
E.recordGame=function(s,line,...args){const r=prevRecord(s,line,...args),c=S.core(s),v=V.core(s);v.pressure=v.pressure||[];for(const p of v.pressure.filter(x=>x.due<=c.totalGames+1)){if(p.club!==s.teamId)continue;const ok=line.win&&!line.dnp&&(line.pts+line.ast*2>=18);c.coachTrust=clamp(c.coachTrust+(ok?2:p.level==='alto'?-8:-4));c.popularity=clamp(c.popularity+(ok?5:-2));v.chemistry=clamp(v.chemistry+(ok?2:-5));s.news.unshift({title:ok?'🎤 Tus palabras respaldadas':'🎤 La prensa te pone contra las cuerdas',description:ok?'Tu rendimiento respondió a tus declaraciones.':'Tus declaraciones arriesgadas vuelven a perjudicarte.',type:ok?'spark':'warning',season:s.season,week:s.world.week});s.news=s.news.slice(0,28);}v.pressure=v.pressure.filter(x=>x.due>c.totalGames+1);return r;};
window.WH_V7={modes,combineModes,make,setup,step,result,score,start,stop,chooseMode,combineResult,clutchResult,activities,available,act,teamPanel,activityModal,activityResult,risk,riskLabel};
})();