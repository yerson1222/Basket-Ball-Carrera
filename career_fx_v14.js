/* V15.1 — Sequential presentation of already committed casino outcomes. */
(function(){
'use strict';
let before=null,pending=null,busy=false,serial=0;
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const casinoAction=a=>/^v13-(roulette(?:-select|-spin)?|baccarat|bj-|casino-tab|bac-reset)/.test(a);
const zones=table=>Object.fromEntries([...table?.querySelectorAll('[data-deal-zone]')||[]].map(z=>[z.dataset.dealZone,[...z.querySelectorAll('.wh13-card')]]));
function capture(a,root){
 const table=root.querySelector('.wh14-casino-table');
 before={action:a,cards:Object.fromEntries(Object.entries(zones(table)).map(([k,v])=>[k,v.map(c=>c.dataset.card||'back')])),stop:table?.querySelector('.wh14-wheel-rotor')?.style.getPropertyValue('--stop')||'0deg'};
}
function blocked(a){return casinoAction(a)&&busy;}
function prepare(a,error){
 if(a==='v13-place'&&error==='Boleto confirmado.')pending={effect:'ticket'};
 else if(error)pending=null;
 else if(a==='v13-roulette-spin')pending={effect:'spin',before};
 else if(a==='v13-baccarat'||/^v13-bj-(start|hit|stand|double|split)$/.test(a))pending={effect:'deal',before};
 else if(a==='v13-select')pending={effect:'pick'};
 else pending=null;
 before=null;
}
function wait(ms){return new Promise(r=>setTimeout(r,ms));}
function orderCards(next,old,act){
 const out=[],seen=new Set();
 function push(zone,i,flip=false){const c=next[zone]?.[i];if(c&&!seen.has(c)){seen.add(c);out.push({card:c,flip});}}
 if(act==='v13-bj-start'){push('hand-0',0);push('dealer',0);push('hand-0',1);push('dealer',1);for(let i=2;i<(next.dealer||[]).length;i++)push('dealer',i);}
 else if(act==='v13-baccarat'){for(let i=0;i<3;i++){push('player',i);push('banker',i);}}
 else if(act==='v13-bj-split'){
  for(const k of Object.keys(next).filter(k=>k.startsWith('hand-'))){const prev=old[k]||[];for(let i=1;i<next[k].length;i++)if(prev[i]!==next[k][i].dataset.card||!prev[i])push(k,i);}
 }else{
  for(const k of Object.keys(next).filter(k=>k!=='dealer'))for(let i=(old[k]||[]).length;i<next[k].length;i++)push(k,i);
 }
 if(act!=='v13-baccarat'&&act!=='v13-bj-start'){
  if(old.dealer?.[1]==='back'&&next.dealer?.[1]?.dataset.card!=='back')push('dealer',1,true);
  for(let i=(old.dealer||[]).length;i<(next.dealer||[]).length;i++)push('dealer',i);
 }
 return out;
}
function lock(root,table){
 busy=true;table.setAttribute('aria-busy','true');
 const buttons=[...root.querySelectorAll('button[data-action^="v13-"]:not(:disabled)')].filter(b=>casinoAction(b.dataset.action));
 buttons.forEach(b=>b.disabled=true);
 return ()=>{busy=false;table.removeAttribute('aria-busy');buttons.forEach(b=>b.disabled=false);};
}
async function deal(root,table,info){
 const seq=orderCards(zones(table),info.before?.cards||{},info.before?.action);
 if(!seq.length)return;
 const token=++serial,unlock=lock(root,table),arm=table.querySelector('.wh15-dealer-arm'),source=table.querySelector('.wh151-deck-origin');
 const results=[...table.querySelectorAll('.wh14-round-result,.wh15-road,.wh14-card-zone h3,.wh13-hand h3')];
 table.classList.add('wh151-deal-active');
 seq.forEach(({card})=>card.style.visibility='hidden');
 results.forEach(el=>el.style.visibility='hidden');
 const stop=()=>token!==serial||!table.isConnected;
 try{
  for(const {card,flip} of seq){
   if(stop())break;
   const r=card.getBoundingClientRect(),o=source?.getBoundingClientRect()||table.getBoundingClientRect();
   if(arm?.animate)arm.animate([{transform:'rotate(0deg)'},{transform:'translate(14px,11px) rotate(11deg)'},{transform:'rotate(0deg)'}],{duration:420,easing:'ease-in-out'});
   card.style.visibility='visible';
   if(card.animate){
    const dx=o.left+o.width/2-r.left-r.width/2,dy=o.top+o.height/2-r.top-r.height/2;
    const frames=flip?[{transform:'rotateY(90deg)',opacity:0},{transform:'rotateY(0)',opacity:1}]:[{transform:'translate('+dx+'px,'+dy+'px) scale(.42) rotate(-18deg)',opacity:.3},{transform:'translate(0,0) scale(1) rotate(0)',opacity:1}];
    await card.animate(frames,{duration:flip?260:420,easing:'cubic-bezier(.2,.75,.25,1)'}).finished.catch(()=>{});
   }else await wait(400);
   await wait(90);
  }
 }finally{
  seq.forEach(({card})=>card.style.visibility='');results.forEach(el=>el.style.visibility='');table.classList.remove('wh151-deal-active');unlock();
 }
}
async function spin(root,table,info){
 const wheel=table.querySelector('.wh14-wheel-stage'),rotor=table.querySelector('.wh14-wheel-rotor'),ball=table.querySelector('.wh14-wheel-ball');
 if(!wheel||!rotor)return;
 const unlock=lock(root,table);++serial;
 const old=parseFloat(info.before?.stop)||0,target=parseFloat(rotor.style.getPropertyValue('--stop'))||0,delta=((target-old)%360+360)%360,end=old+5*360+delta;
 table.classList.add('wh151-spin-active');wheel.classList.remove('wh151-wheel-focus');
 const result=table.querySelector('.wh14-round-result'),history=table.querySelector('.wh15-wheel-history'),number=wheel.dataset.number;
 const winning=table.querySelector('[data-action="v13-roulette-select"][data-id="n'+number+'"]');
 [result,history].forEach(e=>{if(e)e.style.visibility='hidden';});
 try{
  const anim=rotor.animate?.([{transform:'rotate('+old+'deg)'},{transform:'rotate('+end+'deg)'}],{duration:4200,easing:'cubic-bezier(.12,.72,.14,1)',fill:'both'});
  const orbit=ball?.animate?.([{transform:'rotate(0deg)'},{transform:'rotate(-1800deg)'}],{duration:4100,easing:'cubic-bezier(.12,.64,.18,1)',fill:'both'});
  await wait(3000);if(wheel.isConnected)wheel.classList.add('wh151-wheel-focus');
  await Promise.all([anim?.finished?.catch(()=>{}),orbit?.finished?.catch(()=>{})]);if(!anim)await wait(1200);
  anim?.cancel();orbit?.cancel();
  if(wheel.isConnected){winning?.classList.add('wh14-winning-number');wheel.classList.add('wh151-wheel-landed');}
  if(result)result.style.visibility='';if(history)history.style.visibility='';
  await wait(650);
 }finally{wheel.classList.remove('wh151-wheel-focus');table.classList.remove('wh151-spin-active');[result,history].forEach(e=>{if(e)e.style.visibility='';});unlock();}
}
function afterRender(root){
 const table=root.querySelector('.wh14-casino-table'),wheel=table?.querySelector('.wh14-wheel-stage');
 const job=pending;pending=null;
 if(wheel&&wheel.dataset.number!==''&&job?.effect!=='spin')table.querySelector('[data-action="v13-roulette-select"][data-id="n'+wheel.dataset.number+'"]')?.classList.add('wh14-winning-number');
 if(!job||reduced())return;
 if(job.effect==='deal'&&table)void deal(root,table,job);
 else if(job.effect==='spin'&&table)void spin(root,table,job);
 else if(job.effect==='pick')root.querySelector('.wh14-betslip')?.classList.add('wh14-pick-enter');
 else if(job.effect==='ticket')root.querySelector('.wh13-ticket')?.classList.add('wh14-ticket-enter');
}
window.WH_V14_FX={blocked,capture,prepare,afterRender,orderCards};
})();
