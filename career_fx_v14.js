/* V15.2: explicit cinematic timeline, independent of OS animation preferences. */
(function(){
'use strict';
let before=null,pending=null,busy=false;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const frame=()=>new Promise(r=>requestAnimationFrame(r));
const motion=()=>{try{return localStorage.getItem('wh-casino-motion')!=='off';}catch{return true;}};
const zones=t=>Object.fromEntries(Array.from(t?.querySelectorAll('[data-deal-zone]')||[]).map(z=>[z.dataset.dealZone,Array.from(z.querySelectorAll('.wh13-card'))]));
const casinoAction=a=>/^v13-(roulette|baccarat|bj-|casino-tab|bac-reset)/.test(a);
function capture(a,root){const t=root.querySelector('.wh14-casino-table');before={action:a,cards:Object.fromEntries(Object.entries(zones(t)).map(([k,v])=>[k,v.map(c=>c.dataset.card||'back')])),stop:parseFloat(t?.querySelector('.wh14-wheel-rotor')?.style.getPropertyValue('--stop'))||0};}
function blocked(a){return busy&&casinoAction(a);}
function prepare(a,error){pending=null;if(a==='v13-place'&&error==='Boleto confirmado.')pending={effect:'ticket'};else if(!error){if(a==='v13-roulette-spin')pending={effect:'spin',before};else if(a==='v13-baccarat'||/^v13-bj-(start|hit|stand|double|split)$/.test(a))pending={effect:'deal',before};else if(a==='v13-select')pending={effect:'pick'};}before=null;}
function orderCards(next,old,act){
 const out=[],seen=new Set();function add(z,i,flip=false){const c=next[z]?.[i];if(c&&!seen.has(c)){seen.add(c);out.push({card:c,flip,zone:z});}}
 if(act==='v13-bj-start'){add('hand-0',0);add('dealer',0);add('hand-0',1);add('dealer',1);for(let i=2;i<(next.dealer||[]).length;i++)add('dealer',i);}
 else if(act==='v13-baccarat'){for(let i=0;i<3;i++){add('player',i);add('banker',i);}}
 else if(act==='v13-bj-split'){for(const k of Object.keys(next).filter(k=>k.startsWith('hand-')))for(let i=1;i<next[k].length;i++)if(old[k]?.[i]!==next[k][i].dataset.card)add(k,i);}
 else{for(const k of Object.keys(next).filter(k=>k!=='dealer'))for(let i=(old[k]||[]).length;i<next[k].length;i++)add(k,i);}
 if(act!=='v13-baccarat'&&act!=='v13-bj-start'){if(old.dealer?.[1]==='back'&&next.dealer?.[1]?.dataset.card!=='back')add('dealer',1,true);for(let i=(old.dealer||[]).length;i<(next.dealer||[]).length;i++)add('dealer',i);}
 return out;
}
function lock(root,t){
 busy=true;t.setAttribute('aria-busy','true');const buttons=Array.from(root.querySelectorAll('button[data-action^="v13-"]:not(:disabled)')).filter(b=>casinoAction(b.dataset.action));buttons.forEach(b=>b.disabled=true);
 const status=root.createElement('div');status.className='wh152-stage-status';status.setAttribute('role','status');t.prepend(status);
 return {status,unlock(){busy=false;t.removeAttribute('aria-busy');buttons.forEach(b=>b.disabled=false);status.remove();}};
}
function tween(ms,fn){return new Promise(resolve=>{let start;const tick=now=>{if(start===undefined)start=now;const p=Math.min(1,(now-start)/ms);fn(p);if(p<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});}
function hide(t,sel){const nodes=Array.from(t.querySelectorAll(sel));nodes.forEach(n=>n.style.visibility='hidden');return ()=>nodes.forEach(n=>n.style.visibility='');}
async function deal(root,t,info){
 const seq=orderCards(zones(t),info.before?.cards||{},info.before?.action);if(!seq.length)return;
 const {status,unlock}=lock(root,t),show=hide(t,'.wh14-round-result,.wh15-road,.wh14-card-zone h3,.wh13-hand h3');
 seq.forEach(o=>o.card.style.visibility='hidden');const source=t.querySelector('.wh151-deck-origin'),arm=t.querySelector('.wh15-dealer-arm');
 try{
  status.textContent='Repartiendo cartas…';await frame();await frame();await wait(180);
  for(let i=0;i<seq.length;i++){
   if(!t.isConnected)break;const {card,flip,zone}=seq[i];status.textContent=(flip?'Revelando carta':'Repartiendo carta '+(i+1)+' de '+seq.length)+' · '+(zone==='dealer'?'Crupier':zone==='banker'?'Banca':'Jugador');
   if(flip){card.style.visibility='visible';await tween(350,p=>{card.style.transform='rotateY('+(90*(1-p))+'deg)';card.style.opacity=String(p);});card.style.transform='';card.style.opacity='';}
   else{
    const from=source?.getBoundingClientRect()||t.getBoundingClientRect(),to=card.getBoundingClientRect(),fly=root.createElement('div');fly.className='wh152-flying-card';fly.textContent='WH';
    const x=from.left+from.width/2-to.width/2,y=from.top+from.height/2-to.height/2;Object.assign(fly.style,{left:x+'px',top:y+'px',width:to.width+'px',height:to.height+'px'});root.body.appendChild(fly);
    try{await tween(460,p=>{const e=1-Math.pow(1-p,2),arc=Math.sin(Math.PI*p);fly.style.transform='translate('+((to.left-x)*e)+'px,'+((to.top-y)*e-34*arc)+'px) rotate('+(-14*(1-p))+'deg) scale('+(.65+.35*e)+')';if(arm)arm.style.transform='translate('+(14*arc)+'px,'+(8*arc)+'px) rotate('+(12*arc)+'deg)';});}finally{fly.remove();if(arm)arm.style.transform='';}
    card.style.visibility='visible';
   }await wait(180);
  }
 }finally{seq.forEach(o=>{o.card.style.visibility='';o.card.style.transform='';o.card.style.opacity='';});show();unlock();}
}
async function spin(root,t,info){
 const wheel=t.querySelector('.wh14-wheel-stage'),rotor=t.querySelector('.wh14-wheel-rotor'),ball=t.querySelector('.wh14-wheel-ball');if(!wheel||!rotor)return;
 const {status,unlock}=lock(root,t),show=hide(t,'.wh14-round-result,.wh15-wheel-history,.wh14-wheel-hub strong');
 const old=info.before?.stop||0,target=parseFloat(rotor.style.getPropertyValue('--stop'))||0,end=old+1440+((target-old)%360+360)%360;
 const number=wheel.dataset.number,win=t.querySelector('[data-action="v13-roulette-select"][data-id="n'+number+'"]');
 try{
  wheel.classList.remove('wh151-wheel-landed');rotor.style.transform='rotate('+old+'deg)';status.textContent='La rueda está girando…';await frame();await frame();
  await tween(3000,p=>{const e=1-Math.pow(1-p,2.5);rotor.style.transform='rotate('+(old+(end-old)*e)+'deg)';if(ball)ball.style.transform='rotate('+(-1440*(1-Math.pow(1-p,2)))+'deg)';if(p>.72){wheel.style.transform='scale('+(1+.24*Math.min(1,(p-.72)/.22))+')';status.textContent='La bola está cayendo…';}});
  rotor.style.transform='rotate('+target+'deg)';if(ball)ball.style.transform='rotate(0deg)';win?.classList.add('wh14-winning-number');wheel.classList.add('wh151-wheel-landed');status.textContent='Número ganador: '+number;show();await wait(700);
 }finally{wheel.style.transform='';rotor.style.transform='';if(ball)ball.style.transform='';show();unlock();}
}
function afterRender(root){
 const t=root.querySelector('.wh14-casino-table'),job=pending;pending=null;
 if(t){const toggle=root.createElement('button');toggle.type='button';toggle.className='btn ghost wh152-motion-toggle';toggle.textContent='Animaciones: '+(motion()?'activadas':'desactivadas');toggle.onclick=()=>{if(busy)return;try{localStorage.setItem('wh-casino-motion',motion()?'off':'on');}catch{}toggle.textContent='Animaciones: '+(motion()?'activadas':'desactivadas');};t.before(toggle);}
 const wheel=t?.querySelector('.wh14-wheel-stage');if(wheel?.dataset.number&&job?.effect!=='spin')t.querySelector('[data-action="v13-roulette-select"][data-id="n'+wheel.dataset.number+'"]')?.classList.add('wh14-winning-number');
 if(!job)return;if(!motion()){if(job.effect==='spin'&&wheel)t.querySelector('[data-id="n'+wheel.dataset.number+'"]')?.classList.add('wh14-winning-number');return;}
 if(job.effect==='deal'&&t)deal(root,t,job).catch(console.error);else if(job.effect==='spin'&&t)spin(root,t,job).catch(console.error);else if(job.effect==='pick')root.querySelector('.wh14-betslip')?.classList.add('wh14-pick-enter');else if(job.effect==='ticket')root.querySelector('.wh13-ticket')?.classList.add('wh14-ticket-enter');
}
window.WH_V14_FX={capture,blocked,prepare,afterRender,orderCards};
})();
