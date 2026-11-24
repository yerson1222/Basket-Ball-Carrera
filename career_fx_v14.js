/* Cosmetic effects only; game results and wallet updates are committed by V13. */
(function(){
'use strict';
let pending=null,lockedUntil=0;
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const casinoAction=a=>/^v13-(roulette|baccarat|bj-(start|hit|stand|double|split))$/.test(a);
function blocked(a){return casinoAction(a)&&Date.now()<lockedUntil;}
function prepare(a,error){if(error&&a!=='v13-place')return;if(a==='v13-place'&&error!=='Boleto confirmado.')return;
 if(a==='v13-roulette')pending='spin';else if(a==='v13-baccarat'||a.startsWith('v13-bj-'))pending='deal';else if(a==='v13-select')pending='pick';else if(a==='v13-place')pending='ticket';else pending=null;
}
function afterRender(root){
 const table=root.querySelector('.wh14-casino-table'),wheel=root.querySelector('.wh14-wheel-stage');
 if(wheel?.dataset.number!==''){const n=wheel?.dataset.number;if(n!==undefined&&/^\d+$/.test(n))root.querySelector('.wh14-roulette-grid [data-id="n'+n+'"]')?.classList.add('wh14-winning-number');}
 if(!pending)return;const effect=pending;pending=null;
 if(reduced())return;
 if(effect==='spin'||effect==='deal'){
  if(!table)return;const ms=effect==='spin'?2200:750;lockedUntil=Date.now()+ms;
  const cls=effect==='spin'?'wh14-spinning':'wh14-dealing';table.classList.add(cls);
  table.setAttribute('aria-busy','true');
  const buttons=[...table.querySelectorAll('button:not(:disabled)'),...root.querySelectorAll('[data-action="v13-bj-start"]:not(:disabled)')];
  buttons.forEach(b=>b.disabled=true);
  setTimeout(()=>{table.classList.remove(cls);table.removeAttribute('aria-busy');buttons.forEach(b=>b.disabled=false);},ms);
 }else if(effect==='pick')root.querySelector('.wh14-betslip')?.classList.add('wh14-pick-enter');
 else if(effect==='ticket')root.querySelector('.wh13-ticket')?.classList.add('wh14-ticket-enter');
}
window.WH_V14_FX={blocked,prepare,afterRender};
})();
