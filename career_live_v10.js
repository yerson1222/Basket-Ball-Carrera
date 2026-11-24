/* V10 live match presentation: saved quarter-by-quarter scoreboard and player choices. */
(function(){
'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const choices=[
 {stat:'shooting',label:'Atacar el aro',modes:['shooting','timing'],points:3},
 {stat:'playmaking',label:'Mover el balón',modes:['passing','pickroll','shell'],points:2},
 {stat:'defense',label:'Cerrar la defensa',modes:['defense','steal','pattern'],points:2},
 {stat:'athleticism',label:'Dominar el rebote',modes:['rebound','shooting'],points:2}
];
function split(total){const a=[];let left=total;for(let i=0;i<3;i++){const x=clamp(Math.round(left/(4-i)+(Math.random()-.5)*8),8,left-(3-i)*8);a.push(x);left-=x;}a.push(left);return a;}
function buckets(n){const out=[];while(n>0){const p=n===1?1:n===2?2:Math.random()<.33?3:2;out.push(p);n-=p;}return out;}
function make(s,home,away,hs,as,title,phase){return {season:s.season,week:s.world.week,team:s.teamId,home,away,title,phase,quarter:0,hs:0,as:0,homeQuarters:split(hs),awayQuarters:split(as),queue:[],index:0,state:'quarter',plays:[],choice:null};}
function queue(g){const h=buckets(g.homeQuarters[g.quarter]),a=buckets(g.awayQuarters[g.quarter]),q=[];while(h.length||a.length){const side=!a.length?'home':!h.length?'away':Math.random()<.5?'home':'away';q.push({side,pts:(side==='home'?h:a).shift()});}return q;}
function advance(g){if(g.state!=='quarter')return null;if(!g.queue.length)g.queue=queue(g);const p=g.queue[g.index++];if(!p){g.state='choice';return null;}if(p.side==='home')g.hs+=p.pts;else g.as+=p.pts;if(g.index>=g.queue.length)g.state='choice';return p;}
function resolve(g,i,r){if(g.state!=='challenge'||g.choice!==i||!choices[i])return null;const c=choices[i],ok=!!r.success,own=g.team===g.home?'hs':'as',opp=own==='hs'?'as':'hs';const pts=ok?c.points:2;
 // Successful offensive possessions score for the player's club; a failed
 // possession yields a transition basket for the opponent.
 if(ok)g[own]+=pts;else g[opp]+=pts;
 const p={quarter:g.quarter+1,stat:c.stat,label:c.label,ok,pts,side:ok?(own==='hs'?'home':'away'):(opp==='hs'?'home':'away'),accuracy:Math.round((r.accuracy||0)*100)};
 g.plays.push(p);g.choice=null;g.state='feedback';return p;
}
function next(g){if(g.state!=='feedback')return false;if(g.quarter>=3){if(g.hs===g.as){g.quarter++;g.overtime=true;g.queue=[];g.index=0;g.state='choice';}else g.state='done';}else{g.quarter++;g.queue=[];g.index=0;g.state='quarter';}return true;}
function markup(g,home,away,logo,modeFor){const score=(t,side,n)=>'<div class="v10-side">'+logo(t,'sm')+'<b>'+esc(t?.abbr||t?.name||'CLUB')+'</b><strong id="v10-'+side+'">'+n+'</strong></div>';
 const stage=g.state==='done'?'FINAL':g.state==='feedback'?'RESULTADO DE LA JUGADA':g.state==='choice'||g.state==='challenge'?'TU POSESIÓN':'EN JUEGO';
 const last=g.plays.at(-1);
 return '<div class="modal-backdrop"><section class="modal-card v10-live" role="dialog" aria-modal="true" aria-label="Partido en directo"><div class="v10-heading">'+esc(g.title)+'</div><div class="v10-score">'+score(home,'home',g.hs)+'<div class="v10-period"><b>'+(g.quarter>=4?'PRÓRROGA':'CUARTO '+(g.quarter+1)+' / 4')+'</b><small>'+stage+'</small></div>'+score(away,'away',g.as)+'</div><div class="v10-court"><svg viewBox="0 0 320 170" aria-hidden="true"><rect x="5" y="5" width="310" height="160" rx="7" fill="none" stroke="#fff8" stroke-width="2"/><path d="M160 5v160M315 45h-66v80h66M5 45h66v80H5" fill="none" stroke="#fff8" stroke-width="2"/><circle cx="160" cy="85" r="25" fill="none" stroke="#fff8" stroke-width="2"/><rect x="262" y="17" width="46" height="29" rx="3" fill="#e7edf4" stroke="#7c94a8" stroke-width="2"/><rect x="274" y="26" width="22" height="14" fill="none" stroke="#778c9f"/><path d="M273 47l5 25h14l5-25M280 49l3 23m9-23-4 23" stroke="#fff" stroke-width="1.5" fill="none"/><ellipse cx="285" cy="47" rx="14" ry="4" stroke="#e96333" stroke-width="4" fill="none"/></svg><div class="v10-ball" id="v10-ball"></div><div class="v10-call" id="v10-call" aria-live="off">'+(g.state==='feedback'&&last?(last.ok?'¡BUENA JUGADA!':'CONTRAATAQUE RIVAL'):g.state==='done'?'¡FINAL!':'')+'</div></div><div class="v10-progress" aria-label="Progreso del cuarto"><i id="v10-progress" style="width:'+Math.round(g.index/Math.max(1,g.queue.length)*100)+'%"></i></div>'+
 (g.state==='choice'||g.state==='challenge'?'<h3>'+(['Primer cuarto · Elige tu jugada','Descanso · Ajuste táctico','Tercer cuarto · Cambia el ritmo','Última posesión · Decide el partido'][g.quarter]||'Prórroga · Canasta de oro')+'</h3><p>Supera el minijuego para sumar puntos; si fallas, el rival anota.</p><div class="v10-choices">'+choices.map((c,i)=>'<button class="v7-activity" data-action="v10-choice" data-choice="'+i+'"><strong>'+esc(c.label)+'</strong><small>'+esc(window.WH_V7.modes[modeFor(c,i)]?.title||'Desafío')+'</small></button>').join('')+'</div>':g.state==='feedback'?'<p>'+esc(last.label)+' · '+(last.ok?'Acierto':'Fallo')+' · '+last.accuracy+'% · '+last.pts+' puntos '+(last.ok?'para tu equipo':'para el rival')+'</p><button class="btn primary" data-action="v10-next">'+(g.quarter>=3?(g.hs===g.as?'Jugar prórroga':'Finalizar partido'):'Comenzar siguiente cuarto')+'</button>':g.state==='done'?'<p>'+(g.overtime?'Prórroga: tu última intervención rompió el empate.':'Marcador definitivo.')+'</p><button class="btn primary" data-action="v10-next">Ver resultado</button>':'<p>Las posesiones se desarrollan en directo. Prepárate para intervenir.</p><button class="btn ghost" data-action="v10-pause">Guardar y pausar</button>')+'</section></div>';
}
window.WH_V10={make,advance,resolve,next,markup,choices};
})();