/* V9 cognitive arcade. All rounds are playable by touch and keyboard. */
(function(){
'use strict';
const V=window.WH_V7;
const extra={shell:{title:'Sigue el balón',icon:'🏀',stat:'playmaking',description:'Sigue el balón oculto durante las mezclas. Cinco rondas, cada vez más rápidas.'},code:{title:'Código de la jugada',icon:'🔢',stat:'playmaking',description:'Memoriza el código y escríbelo cuando desaparezca. Cada ronda añade una cifra.'},pattern:{title:'Memoria táctica',icon:'🧠',stat:'defense',description:'Memoriza las zonas iluminadas de la cancha y repite el patrón en orden.'}};
Object.assign(V.modes,extra);
const oldStart=V.start,oldChoose=V.chooseMode;
const rotation={shooting:['timing','shooting','code'],playmaking:['passing','pickroll','shell','code'],defense:['defense','steal','pattern'],athleticism:['rebound','shooting','shell']};
V.chooseMode=(stat,seed=0)=>{const a=rotation[stat];return a?a[Math.abs(seed)%a.length]:oldChoose(stat,seed);};
V.combineModes.splice(0,V.combineModes.length,'shooting','shell','pattern','code','timing','rebound');
let g=null,job=null;
const rand=n=>Math.floor(Math.random()*n);
const root=()=>document.querySelector('#modal-root');
function model(mode,round){if(mode==='shell'){const slots=[0,1,2,3],ball=rand(4),swaps=[];let target=ball;for(let i=0;i<5+round*2;i++){let a=rand(3),b=a+1;swaps.push([a,b]);if(target===a)target=b;else if(target===b)target=a;}return {ball,target,swaps,slots};}
 if(mode==='code'){return {answer:Array.from({length:4+round},()=>rand(10)).join('')};}
 return {answer:Array.from({length:4+round},()=>rand(9))};}
function clear(){if(job!==null){clearTimeout(job);job=null;}}
function later(fn,ms){clear();const game=g;job=setTimeout(()=>{if(g===game&&g)fn();},ms);}
function draw(content,sub=''){const r=root();if(!r||!g)return;r.innerHTML='<div class="modal-backdrop v7-backdrop"><section class="modal-card v7-arcade" role="dialog" aria-modal="true"><div class="v6-kicker">V9 · DESAFÍO ÉLITE</div><h2>'+extra[g.mode].icon+' '+extra[g.mode].title+'</h2><p>'+extra[g.mode].description+'</p><div class="v7-hud"><span>RONDA '+(g.round+1)+' / 5</span><span>ACIERTOS '+g.hits+'</span></div><p class="v9-instruction">'+sub+'</p>'+content+'<button type="button" class="btn ghost" data-v9-forfeit>Abandonar (fallo)</button></section></div>';document.body.classList.add('modal-open');}
function finish(forfeit=false){if(!g)return;const old=g;clear();g=null;const acc=forfeit?0:old.hits/5;old.cb({mode:old.mode,stat:extra[old.mode].stat,accuracy:acc,hits:old.hits,points:old.hits*2,attempts:old.round,success:!forfeit&&old.hits>=4});}
function complete(ok){if(!g||g.phase!=='answer')return;g.phase='feedback';clear();g.hits+=ok?1:0;draw('<div class="v9-feedback '+(ok?'good':'bad')+'">'+(ok?'✓ ACIERTO':'× FALLO')+'</div>',ok?'¡Bien leído!':'Mantén la concentración');later(()=>{g.round++;if(g.round>=5)finish();else round();},650);}
function cards(show=false,answer=false){return '<div class="v9-shell">'+g.data.slots.map((slot,i)=>'<button type="button" class="v9-card" '+(answer?'data-v9-pick="'+i+'"':'disabled')+' style="--pos:'+i+'">'+(show&&i===g.data.ball?'🏀':'<span class="v9-cardback">WH</span>')+'</button>').join('')+'</div>';}
function shellStep(i){if(i>=g.data.swaps.length){g.phase='answer';draw(cards(false,true),'¿Dónde está el balón?');later(()=>complete(false),Math.max(900,2400-g.round*280));return;}
 const [a,b]=g.data.swaps[i];const duration=Math.max(135,430-g.round*60);const r=root(),nodes=r?.querySelectorAll('.v9-card');if(nodes?.length===4){nodes[a].style.transform='translateX(110%)';nodes[b].style.transform='translateX(-110%)';nodes[a].style.transitionDuration=duration+'ms';nodes[b].style.transitionDuration=duration+'ms';nodes[a].style.zIndex=2;nodes[b].style.zIndex=1;}later(()=>{[g.data.slots[a],g.data.slots[b]]=[g.data.slots[b],g.data.slots[a]];draw(cards(),'Sigue la mezcla…');later(()=>shellStep(i+1),70);},duration);}
function grid(active=-1,answer=false){return '<div class="v9-pattern">'+Array.from({length:9},(_,i)=>'<button type="button" class="'+(active===i?'lit':'')+'" '+(answer?'data-v9-pick="'+i+'"':'disabled')+' aria-label="Zona '+(i+1)+'">'+(i+1)+'</button>').join('')+'</div>';}
function patternStep(i){if(i>=g.data.answer.length){g.phase='answer';g.entered=[];draw(grid(-1,true),'Repite la secuencia · 0 / '+g.data.answer.length);later(()=>complete(false),6000+g.round*300);return;}
 draw(grid(g.data.answer[i]),'Memoriza el campo…');later(()=>{draw(grid(),'Memoriza el campo…');later(()=>patternStep(i+1),110);},Math.max(200,550-g.round*65));}
function round(){g.data=model(g.mode,g.round);g.phase='show';g.entered=[];if(g.mode==='shell'){draw(cards(true),'Memoriza dónde está el balón');later(()=>{draw(cards(),'Preparado…');later(()=>shellStep(0),350);},850);}
 else if(g.mode==='code'){draw('<div class="v9-code">'+g.data.answer+'</div>','Memoriza el código');later(()=>{g.phase='answer';draw('<form id="v9-code-form"><input id="v9-code-input" type="text" inputmode="numeric" autocomplete="off" maxlength="'+g.data.answer.length+'" aria-label="Código memorizado" placeholder="Escribe el código"><button type="submit" class="btn primary">Confirmar</button></form>','Escribe el código sin mirar');later(()=>complete(false),Math.max(3600,7000-g.round*600));},Math.max(900,2300-g.round*300));}
 else patternStep(0);}
V.start=function(mode,skill,names,cb){if(!extra[mode]){if(g)finish(true);return oldStart(mode,skill,names,cb);}V.stop();clear();g={mode,round:0,hits:0,cb,phase:'ready'};round();};
document.addEventListener('click',e=>{const b=e.target.closest('[data-v9-pick],[data-v9-forfeit]');if(!b||!g)return;e.preventDefault();e.stopImmediatePropagation();if(b.hasAttribute('data-v9-forfeit')){finish(true);return;}if(g.phase!=='answer')return;const x=Number(b.dataset.v9Pick);if(g.mode==='shell')complete(x===g.data.target);else if(g.mode==='pattern'){const idx=g.entered.length;if(x!==g.data.answer[idx]){complete(false);return;}g.entered.push(x);if(g.entered.length===g.data.answer.length)complete(true);else{const p=root()?.querySelector('.v9-instruction');if(p)p.textContent='Repite la secuencia · '+g.entered.length+' / '+g.data.answer.length;b.classList.add('v9-correct');laterFlash(b);}}},true);
function laterFlash(b){setTimeout(()=>b.classList.remove('v9-correct'),140);}
document.addEventListener('submit',e=>{if(e.target.id!=='v9-code-form'||!g||g.phase!=='answer')return;e.preventDefault();e.stopImmediatePropagation();complete(root().querySelector('#v9-code-input').value.trim()===g.data.answer);},true);
document.addEventListener('keydown',e=>{if(g&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finish(true);}},true);
window.WH_V9Memory={model,extra};
})();