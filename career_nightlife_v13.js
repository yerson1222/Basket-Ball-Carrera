/* World Hoops V13 — fictional career economy. No real-money transactions. */
(function(){
'use strict';
const E=window.WH_CAREER, V=window.WH_V92;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(x);
const round=x=>Math.round(x*100)/100;
const btn=(label,act,attrs='',kind='ghost')=>'<button type="button" class="btn '+kind+'" data-action="v13-'+act+'" '+attrs+'>'+label+'</button>';
const panel=(title,body)=>'<section class="panel wh13-panel"><h2>'+title+'</h2>'+body+'</section>';
const metric=(name,value)=>'<div><small>'+name+'</small><strong>'+value+'</strong></div>';
function core(s){
 const c=E.initWorld(s);
 if(!c.v13)c.v13={};
 const x=c.v13;
 for(const k of ['tickets','slip','ledger','events','cases'])if(!Array.isArray(x[k]))x[k]=[];
 for(const k of ['suspension','risk','net'])if(!Number.isFinite(x[k]))x[k]=0;
 return x;
}
const key=s=>[s.season,s.teamId,s.world.phase,s.world.week,s.world.playoffs?.round??0].join(':');
const wallet=s=>E.init(s);
function log(s,label,delta){const x=core(s);x.ledger.unshift({label,delta,season:s.season,week:s.world.week});x.ledger=x.ledger.slice(0,100);x.net=round(x.net+delta);}
function debit(s,n,label){const c=wallet(s);if(!Number.isFinite(n)||n<1||n>c.cash||round(n)!==n)return false;c.cash=round(c.cash-n);log(s,label,-n);return true;}
function credit(s,n,label){if(n>0){wallet(s).cash=round(wallet(s).cash+n);log(s,label,n);}}
function header(s){const x=core(s);return '<div class="wh13-metrics">'+metric('SALDO DISPONIBLE',money(wallet(s).cash))+metric('BALANCE DE JUEGO',money(x.net))+metric('SUSPENSIÓN',x.suspension+' partidos')+'</div>';}
const stats=[['pts','Puntos',14,7],['reb','Rebotes',5,3],['ast','Asistencias',4,3],['stl','Robos',1.5,1],['blk','Tapones',1,1],['threes','Triples',1.5,1],['min','Minutos',24,5],['tov','Pérdidas',2,1.5],['pra','Puntos + rebotes + asistencias',23,9],['pr','Puntos + rebotes',19,8],['pa','Puntos + asistencias',18,8],['ra','Rebotes + asistencias',9,5]];
function value(g,k){if(k==='pra')return g.pts+g.reb+g.ast;if(k==='pr')return g.pts+g.reb;if(k==='pa')return g.pts+g.ast;if(k==='ra')return g.reb+g.ast;return g[k]||0;}
const odds=p=>round(1/(clamp(p,.08,.92)*1.045));
function markets(s,f,club,league){
 const home=club(f.home),away=club(f.away),h=E.teamStrength(home),a=E.teamStrength(away),c=E.initWorld(s),rec=s.world.table||{};
 const form=id=>{const r=rec[id];return r?(r.w-r.l)/Math.max(4,r.w+r.l)*4:0;};
 const own=(s.player.injury||core(s).suspension?-3:clamp((c.coachTrust-55)*.045,-2.1,2));
 const diff=(h-a)*1.32+3+form(f.home)-form(f.away)+(f.home===s.teamId?own:-own);
 const p=clamp(1/(1+Math.exp(-diff/9)),.08,.92);
 const pace=league(s.leagueId).quality>=93?111:league(s.leagueId).quality>=84?90:league(s.leagueId).quality>=74?84:77;
 const result=[{id:'home',group:'Ganador',label:home.name,kind:'ml',side:f.home,odds:odds(p)},{id:'away',group:'Ganador',label:away.name,kind:'ml',side:f.away,odds:odds(1-p)}];
 const spread=-Math.round(diff)-.5;
 function pair(k,name,line,kind='stat',sd=1,mean=line,alternate=false){
 const pOver=1/(1+Math.exp((line-mean)/Math.max(.65,sd*.65)));
 for(const side of ['over','under'])result.push({id:k+side+(alternate?'-'+line:''),group:name,label:(side==='over'?'Más de ':'Menos de ')+line,kind,stat:k,line,side,odds:odds(side==='over'?pOver:1-pOver)});
 }
 pair('total','Total del partido',pace*2-.5,'total',12,pace*2);
 const homeMean=pace+(h-a)*1.32+2.6,awayMean=pace+(a-h)*1.32-1.4;
 pair('homeTotal','Total '+home.name,Math.floor(homeMean)+.5,'teamtotal',8,homeMean);pair('awayTotal','Total '+away.name,Math.floor(awayMean)+.5,'teamtotal',8,awayMean);
 for(const [id,label,line,side] of [['spread-h',home.name,spread,f.home],['spread-a',away.name,-spread,f.away]])result.push({id,group:'Hándicap',label:label+' '+(line>0?'+':'')+line,kind:'spread',line,side,odds:1.91});
 if(!s.player.injury&&!core(s).suspension){
  const games=s.world.playerGames.filter(g=>!g.dnp).slice(-12);
  for(const [k,n,base,sd] of stats){const valid=k==='tov'?games.filter(g=>Number.isFinite(g.tov)):games;const mean=valid.length?valid.reduce((v,g)=>v+value(g,k),0)/valid.length:base;const line=Math.max(.5,Math.floor(mean)+.5);pair(k,n,line,'stat',sd,mean);if(['pts','reb','ast','pra','threes'].includes(k)){const step=Math.max(1,Math.round(sd*.65));if(line-step>=.5)pair(k,n,line-step,'stat',sd,mean,true);pair(k,n,line+step,'stat',sd,mean,true);}}
  for(const [k,n,pr] of [['dd','Doble-doble',.27],['td','Triple-doble',.08]])for(const side of ['yes','no'])result.push({id:k+side,group:n,label:side==='yes'?'Sí':'No',kind:k,side,odds:odds(side==='yes'?pr:1-pr)});
 }
 const V15=window.WH_V15,week=s.world.phase==='regular'?s.world.week+1:s.world.rounds.length+1+(s.world.playoffs?.round||0);
 if(V15)for(const id of [s.teamId,f.home===s.teamId?f.away:f.home]){
  const players=V15.preview(s,id,week),records=s.world.results||[];
  players.forEach((p,i)=>{
   const name=p.name,participant=(id===s.teamId?'mate-':'opp-')+i;
   const history=records.filter(g=>g.home===id||g.away===id).slice(-12).map(g=>(V15.decode(g,id)||g.boxScore?.[id]||[]).find(row=>row.name===name)).filter(Boolean);
   const modifier=(.75+p.form/200)*(.65+p.energy/220)*(.85+p.morale/350);
   for(const [k,n,base,sd] of stats){
    const typical=k==='pts'?Math.max(2,(pace-(id===s.teamId?14:0))/12*(p.role==='Titular'?1.45:p.role==='Rotación'?1:.65)):k==='pra'?Math.max(5,base*(p.role==='Titular'?.8:.55)):k==='reb'?(['PF','C'].includes(p.position)?6:3):k==='ast'?(['PG','SG'].includes(p.position)?4:2):k==='min'?(p.role==='Titular'?30:p.role==='Rotación'?20:12):base;
    const old=history.length?history.reduce((v,g)=>v+value(g,k),0)/history.length:typical;
    const mean=Math.max(.15,(old*.65+typical*.35)*modifier+(p.boost&&['pts','pra','pr','pa','reb','ast'].includes(k)?p.boost*.18:0));
    const line=Math.max(.5,Math.floor(mean)+.5);
    for(const side of ['over','under']){
     const pr=1/(1+Math.exp((line-mean)/Math.max(.65,sd*.65)));
     result.push({id:participant+'-'+k+'-'+side,group:name+' · '+n+' · '+club(id).abbr,marketName:n,participant,name,teamId:id,label:(side==='over'?'Más de ':'Menos de ')+line,kind:'stat',stat:k,line,side,odds:odds(side==='over'?pr:1-pr)});
    }
   }
   for(const [k,n,pr] of [['dd','Doble-doble',.2],['td','Triple-doble',.08]])for(const side of ['yes','no'])result.push({id:participant+'-'+k+'-'+side,group:name+' · '+n+' · '+club(id).abbr,marketName:n,participant,name,teamId:id,kind:k,side,odds:odds(side==='yes'?pr:1-pr)});
  });
 }
 return result;
}
function book(s,f,club,league,teamLogo){
 const x=core(s),k=key(s);
 if(!f)return header(s)+panel('Sin partido disponible','<p>Vuelve cuando exista un próximo rival.</p>'+btn('Investigaciones','integrity'))+history(s);
 const revision=JSON.stringify([s.career.v12Help||null,window.WH_V6.core(s).players]);
 if(x.marketKey!==k||x.marketVersion!==15||x.marketRevision!==revision){if(x.marketKey!==k||x.marketVersion!==15)x.slip=[];x.marketKey=k;x.marketVersion=15;x.marketRevision=revision;x.market=markets(s,f,club,league);}
 const ms=x.market||[],selected=x.slip.map(id=>ms.find(m=>m.id===id)).filter(Boolean),locked=!!s.liveMatch||!!s.career.pendingImpact;
 const team=m=>['ml','spread','total','teamtotal'].includes(m.kind),personal=m=>!m.participant&&!team(m),mates=[...new Map(ms.filter(m=>m.participant).map(m=>[m.participant,m.name])).entries()];
 const tabs=[['team','Partido'],['self',s.player.name],...mates],tab=tabs.some(t=>t[0]===x.bookTab)?x.bookTab:'team';
 const visible=ms.filter(m=>tab==='team'?team(m):tab==='self'?personal(m):m.participant===tab);
 const groups=[...new Set(visible.map(m=>m.group))],total=selected.reduce((v,m)=>v*m.odds,1);
 const home=club(f.home),away=club(f.away);
 const banner='<div class="wh14-sports-hero"><span class="wh14-eyebrow">WORLD HOOPS · MATCHDAY</span><div class="wh14-versus"><div>'+(teamLogo?teamLogo(home,'lg'):'')+'<strong>'+esc(home.name)+'</strong><small>LOCAL</small></div><i>VS</i><div>'+(teamLogo?teamLogo(away,'lg'):'')+'<strong>'+esc(away.name)+'</strong><small>VISITANTE</small></div></div><div class="wh14-hero-foot"><span class="wh14-status '+(locked?'closed':'')+'">'+(locked?'Mercados cerrados':'Mercados abiertos')+'</span><span>Jornada '+(s.world.week+1)+'</span></div></div>';
 const tabHTML=([id,name])=>btn(esc(name),'book-tab','data-id="'+esc(id)+'" aria-pressed="'+(id===tab)+'"',id===tab?'primary':'ghost');
 const selectedPlayer=ms.find(m=>m.participant===tab),week=s.world.phase==='regular'?s.world.week+1:s.world.rounds.length+1+(s.world.playoffs?.round||0);
 const tabsHTML='<div class="wh14-market-tabs">'+tabs.slice(0,2).map(tabHTML).join('')+'</div><details class="wh15-player-select" '+(tab.startsWith('mate-')?'open':'')+'><summary>Mis compañeros · '+mates.filter(t=>t[0].startsWith('mate-')).length+'</summary><div class="wh14-market-tabs">'+mates.filter(t=>t[0].startsWith('mate-')).map(tabHTML).join('')+'</div></details><details class="wh15-player-select" '+(tab.startsWith('opp-')?'open':'')+'><summary>Equipo rival · '+mates.filter(t=>t[0].startsWith('opp-')).length+'</summary><div class="wh14-market-tabs">'+mates.filter(t=>t[0].startsWith('opp-')).map(tabHTML).join('')+'</div></details>'+(selectedPlayer?'<div class="wh15-market-profile"><strong>'+esc(selectedPlayer.name)+'</strong>'+window.WH_V15.status(window.WH_V15.profile(s,selectedPlayer.teamId,selectedPlayer.name,week))+'</div>':'');
 const marketHTML=groups.map(g=>'<div class="wh13-market"><b>'+esc(visible.find(m=>m.group===g)?.marketName||g)+'</b><div class="wh13-options">'+visible.filter(m=>m.group===g).map(m=>btn(esc(m.label||((m.side==='over'?'Más de ':'Menos de ')+m.line))+'<strong>'+m.odds.toFixed(2)+'</strong>','select','data-id="'+esc(m.id)+'" aria-pressed="'+x.slip.includes(m.id)+'" '+(locked?'disabled':''),x.slip.includes(m.id)?'primary':'ghost')).join('')+'</div></div>').join('')||'<p class="muted">No hay mercados disponibles para este jugador.</p>';
 const ticket=panel('Mi boleto <span class="wh14-count">'+selected.length+'</span>',(selected.length?selected.map(m=>'<div class="wh14-pick"><div><small>'+esc(m.group)+'</small><strong>'+esc(m.label||((m.side==='over'?'Más de ':'Menos de ')+m.line))+'</strong></div><b>'+m.odds.toFixed(2)+'</b>'+btn('×','select','aria-label="Quitar selección" data-id="'+esc(m.id)+'" '+(locked?'disabled':''))+'</div>').join(''):'<div class="wh14-empty-ticket">Selecciona un mercado para crear tu boleto.</div>')+'<div class="wh14-total">Cuota total <b>'+total.toFixed(2)+'</b></div><label>Importe <input id="wh13-stake" type="number" min="1" step="1" max="'+Math.floor(wallet(s).cash)+'" value="'+(x.bookStake||100)+'"></label><div class="wh14-total">Retorno potencial <strong id="wh13-potential" data-odds="'+total+'">'+money((x.bookStake||100)*total)+'</strong></div>'+btn('Confirmar boleto','place',locked||!selected.length?'disabled':'','primary')+btn('Limpiar','clear'));
 return header(s)+banner+'<div class="wh13-layout wh14-book"><div>'+panel('Mercados del encuentro',tabsHTML+marketHTML)+'</div><aside class="wh14-betslip">'+ticket+panel('Integridad deportiva','<p>Consulta tus expedientes y sanciones de la liga.</p>'+btn(x.case?'Expediente pendiente':'Investigaciones','integrity','','ghost'))+'</aside></div>'+history(s);
}
function history(s){const x=core(s);return panel('Mis boletos',x.tickets.slice(0,35).map(t=>'<article class="wh13-ticket '+esc(t.state)+'"><b>'+esc(t.state.toUpperCase())+' · '+money(t.stake)+'</b><span>'+t.legs.map(l=>esc(l.group)+': '+esc(l.label)).join(' / ')+'</span><strong>'+money(t.payout||0)+'</strong></article>').join('')||'<p>Sin boletos todavía.</p>');}
function select(s,id){const x=core(s),m=x.market?.find(v=>v.id===id);if(!m||x.marketKey!==key(s)||s.liveMatch||s.career.pendingImpact)return;
 if(x.slip.includes(id))x.slip=x.slip.filter(v=>v!==id);else{x.slip=x.slip.filter(v=>x.market.find(w=>w.id===v)?.group!==m.group);if(x.slip.length<8)x.slip.push(id);}
}
function place(s,stake){const x=core(s);if(s.liveMatch||s.career.pendingImpact||x.marketKey!==key(s))return 'Mercado cerrado.';
 const legs=x.slip.map(id=>x.market.find(m=>m.id===id)).filter(Boolean);if(!legs.length)return 'Selecciona un mercado.';
 if(!debit(s,stake,'Boleto deportivo'))return 'Importe inválido o saldo insuficiente.';
 x.tickets.unshift({key:key(s),legs:legs.map(m=>({...m,label:m.label||((m.side==='over'?'Más de ':'Menos de ')+m.line)})),stake,state:'pendiente'});x.slip=[];return 'Boleto confirmado.';
}
function mode(s){const d=core(s).decision;return d?.key===key(s)&&!core(s).suspension?d.mode:'clean';}
function decision(s,id){if(!['clean','focus','withdraw','fix'].includes(id)||s.liveMatch||s.career.pendingImpact||core(s).suspension||s.player.injury)return;core(s).decision={key:key(s),mode:id};}
function alterLine(s,line,teamPts){
 if(line.dnp)return line;
 const m=mode(s);if(m==='clean')return line;
 const delta=m==='focus'?rand(0,7):m==='withdraw'?rand(-8,-1):rand(-8,5);
 line.pts=clamp(line.pts+delta,0,Math.floor(teamPts*.55));
 line.ast=clamp(line.ast+(m==='focus'?rand(-2,1):rand(-3,1)),0,22);
 line.reb=clamp(line.reb+rand(-2,2),0,24);line.tov=clamp((line.tov||0)+rand(-1,2),0,10);line.threes=Math.min(line.threes,Math.floor(line.pts/3));return line;
}
function alterScore(s,own){return mode(s)==='fix'&&!s.player.injury?clamp(own+rand(-12,3),53,170):own;}
function suspendLine(s,round,stage,opponent){const x=core(s);if(!x.suspension)return null;x.suspension--;if(s.player.injury>0)s.player.injury--;return {week:round,stage,opponent,pts:0,reb:0,ast:0,stl:0,blk:0,min:0,fg:0,threes:0,tov:0,dnp:true,suspended:true};}
function grade(l,r,g){
 if(l.participant){const id=l.teamId||Object.keys(r.boxV15||r.boxScore||{}).find(id=>(window.WH_V15?.decode(r,id)||r.boxScore?.[id]||[]).some(p=>p.name===l.name));g=(window.WH_V15?.decode(r,id)||r.boxScore?.[id]||[]).find(p=>p.name===l.name);if(!g)return null;}
 if(['stat','dd','td'].includes(l.kind)&&g.dnp)return null;
 if(l.kind==='ml')return r.winner===l.side;
 if(l.kind==='spread'){const v=(r.home===l.side?r.hs-r.as:r.as-r.hs)+l.line;return v===0?null:v>0;}
 if(l.kind==='dd'||l.kind==='td'){const count=['pts','reb','ast','stl','blk'].filter(k=>g[k]>=10).length;return (count>=(l.kind==='dd'?2:3))===(l.side==='yes');}
 const v=l.kind==='total'?r.hs+r.as:l.kind==='teamtotal'?(l.stat==='homeTotal'?r.hs:r.as):value(g,l.stat);
 return v===l.line?null:l.side==='over'?v>l.line:v<l.line;
}
function settle(s,r,g,news){const x=core(s),k=key(s),m=g.dnp?'clean':mode(s);for(const t of x.tickets.filter(t=>t.state==='pendiente'&&t.key===k)){
 const results=t.legs.map(l=>grade(l,r,g));t.results=results;t.state=results.includes(false)?'perdido':results.every(v=>v===null)?'anulado':'ganado';
 t.payout=t.state==='perdido'?0:round(t.stake*t.legs.reduce((v,l,i)=>v*(results[i]===true?l.odds:1),1));t.settledSeason=s.season;t.settledWeek=g.week;t.settledStage=g.stage;t.approach=m;credit(s,t.payout,'Liquidación '+t.state);news('Boleto '+t.state,money(t.payout)+' de retorno.','activity');
 }
 if(m!=='clean')x.risk=clamp(x.risk+(m==='fix'?22:10),0,100);
 if(!x.case&&!x.suspension&&!g.suspended&&Math.random()<.012+x.risk*.0025){
  x.case={sequence:Array.from({length:5},()=>rand(1,4)),step:0,errors:0,started:false,season:s.season,week:g.week};news('Investigación de integridad','La liga ha abierto un expediente. Resuelve el desafío antes de volver a jugar.','warning');
 }else x.risk=Math.max(0,x.risk-1);
 delete x.decision; lifestyleEvent(s,news);
}
function refundPending(s){for(const t of core(s).tickets.filter(t=>t.state==='pendiente')){t.state='anulado';t.payout=t.stake;credit(s,t.stake,'Boleto anulado al cerrar temporada');}core(s).slip=[];delete core(s).decision;}
function postMatch(s,g){if(!g)return '';const ts=core(s).tickets.filter(t=>t.settledSeason===s.season&&t.settledWeek===g.week&&t.settledStage===g.stage);return ts.length?'<div class="wh13-match-summary"><h3>Resultado de tus apuestas</h3>'+ts.map(t=>'<p><b>'+esc(t.state.toUpperCase())+'</b> · '+money(t.stake)+' → '+money(t.payout)+'<br><small>'+t.legs.map((l,i)=>esc(l.group)+' '+(t.results[i]===true?'✓':t.results[i]===false?'✕':'—')).join(' · ')+'</small></p>').join('')+'</div>':'';}
function strategy(s){const x=core(s),m=mode(s);return '<div class="wh13-strategy"><b>Enfoque del partido</b><div class="wh13-options">'+[['clean','Normal'],['focus','Protagonismo'],['withdraw','Menor protagonismo'],['fix','Interferir']].map(([id,n])=>btn(n,'match-decision','data-id="'+id+'" '+(s.player.injury||x.suspension?'disabled':''),m===id?'primary':'ghost')).join('')+'</div><small>Las decisiones de riesgo pueden provocar investigaciones.</small></div>';}
function investigations(s){const x=core(s),c=x.case;return header(s)+'<button class="btn ghost" data-action="nav" data-tab="odds">← Casa de apuestas</button>'+panel('Comisión de integridad',c?'<p>Prueba de memoria: memoriza la secuencia y luego reprodúcela. Dos errores implican sanción.</p>'+(c.started?'<p>Progreso '+c.step+' / '+c.sequence.length+' · Errores '+c.errors+' / 2</p><div class="wh13-options">'+[1,2,3,4].map(n=>btn(''+n,'answer','data-id="'+n+'"','primary')).join('')+'</div>':'<div class="wh13-sequence">'+c.sequence.map(n=>'<b>'+n+'</b>').join('')+'</div>'+btn('He memorizado','start-case','','primary')):'<p>No tienes investigaciones abiertas.</p>')+panel('Historial disciplinario',x.cases.map(c=>'<p>Temporada '+c.season+' · J'+c.week+' · '+esc(c.verdict)+'</p>').join('')||'<p>Sin expedientes resueltos.</p>');}
function answer(s,n,news){const x=core(s),c=x.case;if(!c?.started||!Number.isInteger(n)||n<1||n>4)return;if(n===c.sequence[c.step])c.step++;else c.errors++;
 if(c.errors>=2||c.step===c.sequence.length){const lost=c.errors>=2;c.verdict=lost?'Culpable · 5 partidos':'Expediente cerrado';if(lost){x.suspension+=5;const w=E.initWorld(s);w.popularity=Math.max(0,w.popularity-20);w.coachTrust=Math.max(0,w.coachTrust-8);}x.cases.unshift(c);delete x.case;x.risk=0;news(lost?'Sanción disciplinaria':'Expediente cerrado',lost?'Suspendido 5 partidos. Popularidad −20.':'Has superado el desafío de integridad.','warning');}
}
function stake(){return Number(document.getElementById('wh13-casino-stake')?.value);}
const red=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const card=()=>({rank:rand(1,13),suit:['♠','♥','♣','♦'][rand(0,3)]});
function deck(){const d=[];for(let j=0;j<6;j++)for(const suit of ['♠','♥','♣','♦'])for(let rank=1;rank<=13;rank++)d.push({rank,suit});for(let i=d.length-1;i>0;i--){const j=rand(0,i);[d[i],d[j]]=[d[j],d[i]];}return d;}
const bjValue=cards=>{let sum=cards.reduce((a,c)=>a+Math.min(c.rank,10),0);if(cards.some(c=>c.rank===1)&&sum+10<=21)sum+=10;return sum;};
const natural=h=>h.cards.length===2&&bjValue(h.cards)===21&&!h.split;
const cardHTML=(c,i=0)=>{const rank=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'][c.rank];return '<span class="wh13-card '+(['♥','♦'].includes(c.suit)?'red':'')+'" style="--deal:'+i+'"><span class="wh14-card-corner">'+rank+'<small>'+c.suit+'</small></span><b>'+c.suit+'</b><span class="wh14-card-corner bottom">'+rank+'<small>'+c.suit+'</small></span></span>';};
const cardsHTML=cs=>cs.map((c,i)=>cardHTML(c,i)).join('');
function dealer(){
 return '<div class="wh15-dealer" aria-hidden="true"><svg viewBox="0 0 330 140"><defs><linearGradient id="wh15-vest" x2="1" y2="1"><stop stop-color="#303b46"/><stop offset="1" stop-color="#101821"/></linearGradient><linearGradient id="wh15-skin" x2="1" y2="1"><stop stop-color="#d7a780"/><stop offset="1" stop-color="#946349"/></linearGradient></defs><path d="M86 140V92Q90 65 133 61L195 61Q240 68 244 92V140" fill="url(#wh15-vest)"/><path d="M132 61l32 47 31-47-13-12h-35z" fill="#f4eee2"/><path d="M156 73l8 7 8-7 4 12-12-5-12 5z" fill="#20212a"/><ellipse cx="164" cy="37" rx="24" ry="29" fill="url(#wh15-skin)"/><path d="M141 32Q135 8 158 4 188 0 189 31L182 24Q158 28 146 20Z" fill="#29272a"/><path d="M154 42q10 8 20 0" fill="none" stroke="#6d4b3f" stroke-width="1.4"/><circle cx="155" cy="34" r="1.8" fill="#252026"/><circle cx="173" cy="34" r="1.8" fill="#252026"/><g class="wh15-dealer-arm"><path d="M92 88Q76 104 104 123L151 112 145 97 116 104 119 83" fill="#e5e4df"/><path d="M143 98q18-8 28 0l9 5-8 13-21-5" fill="url(#wh15-skin)"/><rect x="168" y="94" width="23" height="32" rx="3" fill="#4b395f" stroke="#dfd3c4" stroke-width="2" transform="rotate(-14 179 110)"/></g><path d="M227 86q18 21-6 37l-44-6 5-14 30 5-8-26" fill="#e5e4df"/><path d="M185 103q-13-8-23 0l-7 10 9 7 17-3" fill="url(#wh15-skin)"/><path d="M0 132H330V140H0z" fill="#9c7b4c"/><rect x="146" y="123" width="42" height="11" rx="2" fill="#554568" stroke="#c4ad8b"/></svg><span>CRUPIER · WORLD HOOPS</span></div>';
}
function baccaratHistory(x){
 const rows=x.baccaratHistory||[],counts={player:0,banker:0,tie:0};for(const r of rows)counts[r.winner]++;
 return '<div class="wh15-road"><div class="wh15-road-head"><div><small>HISTORIAL DE LA SESIÓN</small><h3>Registro de baccarat</h3></div>'+btn('Nueva sesión','bac-reset','','ghost')+'</div><div class="wh15-road-summary"><span>Jugador <b>'+counts.player+'</b></span><span>Banca <b>'+counts.banker+'</b></span><span>Empate <b>'+counts.tie+'</b></span></div><div class="wh15-bead-scroll"><div class="wh15-beads">'+rows.map((r,i)=>'<div class="wh15-bead '+r.winner+'" title="Ronda '+(i+1)+' · '+r.player+'–'+r.banker+'"><b>'+({player:'J',banker:'B',tie:'E'}[r.winner])+'</b><small>'+r.player+'–'+r.banker+'</small></div>').join('')+'</div></div><details><summary>Todos los resultados de esta sesión ('+rows.length+')</summary><div class="v6-scroll"><table class="v6-table"><thead><tr><th>#</th><th>Jugador</th><th>Banca</th><th>Ganador</th></tr></thead><tbody>'+rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+r.player+'</td><td>'+r.banker+'</td><td>'+({player:'Jugador',banker:'Banca',tie:'Empate'}[r.winner])+'</td></tr>').join('')+'</tbody></table></div></details></div>';
}
function rouletteHistory(x){return '<div class="wh15-wheel-history"><small>ÚLTIMOS RESULTADOS</small><div>'+((x.rouletteHistory||[]).slice(-25).reverse().map(n=>'<span class="'+(n===0?'green':red.has(n)?'red':'black')+'">'+n+'</span>').join('')||'<span>—</span>')+'</div></div>';}
const wheelOrder=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
function wheel(n){
 const segment=360/37,gradient='conic-gradient(from '+(-segment/2)+'deg, '+wheelOrder.map((v,i)=>(v===0?'#21794e':red.has(v)?'#a12e40':'#1a2730')+' '+(i*segment)+'deg '+((i+1)*segment)+'deg').join(',')+')';
 const slots=wheelOrder.map((v,i)=>'<span class="wh14-wheel-slot '+(v===0?'green':red.has(v)?'red':'black')+'" style="--angle:'+(i*360/37)+'deg">'+v+'</span>').join('');
 return '<div class="wh14-wheel-stage" data-number="'+(n??'')+'"><div class="wh14-wheel-pointer"></div><div class="wh14-wheel-rotor" style="--stop:'+(-Math.max(0,wheelOrder.indexOf(n))*360/37)+'deg;--wheel-colors:'+gradient+'">'+slots+'<div class="wh14-wheel-hub"><small>WORLD HOOPS</small><strong>'+ (n??'WH')+'</strong></div></div><span class="wh14-wheel-ball"></span></div>';
}
function casino(s){
 const x=core(s),b=x.bj,tab=x.casinoTab||'bj';
 const tabs=[['bj','BLACKJACK','21 · CARTAS'],['roulette','RULETA','EUROPEA · 0–36'],['baccarat','BACCARAT','PUNTO Y BANCA']];
 const hero='<div class="wh14-casino-hero"><div><span class="wh14-eyebrow">WORLD HOOPS · PRIVATE CLUB</span><h2>Casino</h2><p>Mesas de juego</p></div><div class="wh14-chip-stack"><i></i><i></i><i></i><i></i><i></i></div></div>';
 let table='';
 if(tab==='bj'){
  table='<div class="wh14-table-label"><span>BLACKJACK</span><small>3:2 · CRUPIER 17</small></div>'+dealer();
  if(b){
   table+='<div class="wh14-card-zone"><h3>Crupier '+(b.done?'· '+bjValue(b.dealer):'')+'</h3><div class="wh13-cards">'+cardHTML(b.dealer[0])+(b.done?cardsHTML(b.dealer.slice(1)):'<span class="wh13-card back" style="--deal:1">WH</span>')+'</div></div><div class="wh14-felt-line"></div>';
   table+=b.hands.map((h,i)=>'<div class="wh13-hand '+(i===b.index&&!b.done?'active':'')+'"><h3>Mano '+(i+1)+' · '+bjValue(h.cards)+' · '+money(h.stake)+'</h3><div class="wh13-cards">'+cardsHTML(h.cards)+'</div>'+(h.result?'<p class="wh14-round-result">'+esc(h.result)+'</p>':'')+'</div>').join('');
   table+=b.done?'<div class="wh14-round-result">'+esc(b.result)+'</div>':'<div class="wh14-table-actions">'+btn('Pedir carta','bj-hit','','primary')+btn('Plantarse','bj-stand')+btn('Doblar','bj-double',b.hands[b.index].cards.length!==2||wallet(s).cash<b.hands[b.index].stake?'disabled':'')+btn('Dividir','bj-split',b.hands.length>=4||b.hands[b.index].cards.length!==2||b.hands[b.index].cards[0].rank!==b.hands[b.index].cards[1].rank||wallet(s).cash<b.hands[b.index].stake?'disabled':'')+'</div>';
  }else table+='<div class="wh14-card-zone"><h3>Crupier</h3><div class="wh13-cards"><span class="wh13-card back">WH</span><span class="wh13-card back">WH</span></div></div><div class="wh14-felt-line"></div><div class="wh14-card-zone"><h3>Tu mano</h3><div class="wh14-empty-hand">Esperando el reparto</div></div>';
 }else if(tab==='roulette'){
  const last=x.roulette;table='<div class="wh14-table-label"><span>RULETA EUROPEA</span><small>37 NÚMEROS</small></div>'+wheel(last?.n)+'<div class="wh13-roulette wh14-roulette-grid">'+Array.from({length:37},(_,n)=>btn(''+n,'roulette','data-id="n'+n+'" aria-label="Número '+n+'"',n===0?'green':red.has(n)?'red':'black')).join('')+'</div><div class="wh13-options wh14-table-actions">'+[['red','Rojo'],['black','Negro'],['even','Par'],['odd','Impar'],['low','1–18'],['high','19–36'],['d1','1.ª docena'],['d2','2.ª docena'],['d3','3.ª docena'],['c1','Columna 1'],['c2','Columna 2'],['c3','Columna 3']].map(([id,l])=>btn(l,'roulette','data-id="'+id+'"')).join('')+'</div><div class="wh14-round-result">'+esc(last?.message||'Selecciona tu apuesta para girar.')+'</div>'+rouletteHistory(x);
 }else{
  const last=x.baccarat;table='<div class="wh14-table-label"><span>BACCARAT</span><small>PUNTO Y BANCA</small></div>'+dealer()+'<div class="wh14-baccarat-hands"><div class="wh14-card-zone"><h3>Jugador '+(last?'· '+bacTotal(last.player):'')+'</h3><div class="wh13-cards">'+(last?cardsHTML(last.player):'<span class="wh13-card back">WH</span><span class="wh13-card back">WH</span>')+'</div></div><div class="wh14-card-zone"><h3>Banca '+(last?'· '+bacTotal(last.banker):'')+'</h3><div class="wh13-cards">'+(last?cardsHTML(last.banker):'<span class="wh13-card back">WH</span><span class="wh13-card back">WH</span>')+'</div></div></div><div class="wh14-round-result">'+esc(last?.message||'Elige jugador, banca o empate.')+'</div><div class="wh14-table-actions">'+[['player','Jugador · 1:1'],['banker','Banca · 0,95:1'],['tie','Empate · 8:1']].map(([id,l])=>btn(l,'baccarat','data-id="'+id+'"','primary')).join('')+'</div>'+baccaratHistory(x);
 }
 const stakePanel='<div class="wh14-stake-bar"><label>Importe de la apuesta<input id="wh13-casino-stake" type="number" min="1" step="1" value="'+(x.casinoStake||100)+'" '+(tab==='bj'&&b&&!b.done?'disabled':'')+'></label>'+(tab==='bj'&&(!b||b.done)?btn('Repartir cartas','bj-start','','primary'):'')+'</div>';
 return header(s)+hero+'<div class="wh14-casino-tabs">'+tabs.map(([id,l,d])=>btn('<b>'+l+'</b><small>'+d+'</small>','casino-tab','data-id="'+id+'" aria-pressed="'+(tab===id)+'"',tab===id?'primary':'ghost')).join('')+'</div>'+panel(tabs.find(t=>t[0]===tab)?.[1]||'Casino',stakePanel+'<div class="wh13-table wh14-casino-table" data-game="'+tab+'">'+table+'</div><p class="muted">'+(tab==='bj'?'Crupier se planta en 17; blackjack 3:2, empate devuelve la apuesta.':tab==='roulette'?'Un solo cero. Pleno 35:1, docena o columna 2:1, apuestas simples 1:1.':'Reglas de tercera carta; comisión del 5% para banca.')+'</p>')+panel('Movimientos recientes',x.ledger.slice(0,15).map(l=>'<p>'+esc(l.label)+' · <b>'+money(l.delta)+'</b></p>').join('')||'<p>Sin movimientos.</p>');
}
function finishBJ(s,b){while(bjValue(b.dealer)<17)b.dealer.push(b.deck.pop());const d=bjValue(b.dealer),dn=b.dealer.length===2&&d===21;let total=0;for(const h of b.hands){const v=bjValue(h.cards);let pay=0;if(v>21)h.result='Pasado';else if(natural(h)&&dn){pay=h.stake;h.result='Empate';}else if(natural(h)){pay=h.stake*2.5;h.result='Blackjack';}else if(dn)h.result='Blackjack del crupier';else if(d>21||v>d){pay=h.stake*2;h.result='Ganada';}else if(v===d){pay=h.stake;h.result='Empate';}else h.result='Perdida';total+=pay;}credit(s,round(total),'Blackjack · retorno');b.done=true;b.result='Retorno: '+money(total);}
function advanceBJ(s,b){while(b.index<b.hands.length&&b.hands[b.index].done)b.index++;if(b.index===b.hands.length)finishBJ(s,b);}
function blackjack(s,act){const x=core(s);let b=x.bj;
 if(act==='start'){if(b&&!b.done)return;if(!debit(s,stake(),'Blackjack · apuesta'))return 'Importe inválido.';const amount=stake(),d=deck();b=x.bj={deck:d,dealer:[d.pop(),d.pop()],hands:[{cards:[d.pop(),d.pop()],stake:amount}],index:0,done:false};if(natural(b.hands[0])||bjValue(b.dealer)===21)finishBJ(s,b);return;}
 if(!b||b.done)return;const h=b.hands[b.index];if(!h)return;
 if(act==='hit'){h.cards.push(b.deck.pop());if(bjValue(h.cards)>=21)h.done=true;}
 if(act==='stand')h.done=true;
 if(act==='double'){if(h.cards.length!==2||!debit(s,h.stake,'Blackjack · doblar'))return;h.stake*=2;h.cards.push(b.deck.pop());h.done=true;}
 if(act==='split'){if(b.hands.length>=4||h.cards.length!==2||h.cards[0].rank!==h.cards[1].rank||!debit(s,h.stake,'Blackjack · dividir'))return;const second=h.cards.pop(),ace=second.rank===1;h.cards.push(b.deck.pop());h.split=true;h.done=ace||bjValue(h.cards)===21;const h2={cards:[second,b.deck.pop()],stake:h.stake,split:true};h2.done=ace||bjValue(h2.cards)===21;b.hands.splice(b.index+1,0,h2);}
 advanceBJ(s,b);
}
function roulette(s,id){const amount=stake();if(!/^(n(?:[0-9]|[12][0-9]|3[0-6])|red|black|even|odd|low|high|d[123]|c[123])$/.test(id)||!debit(s,amount,'Ruleta · apuesta'))return 'Importe inválido.';const n=rand(0,36);let mult=0;if(/^n\d/.test(id))mult=n===Number(id.slice(1))?36:0;else if(n!==0){if(id==='red')mult=red.has(n)?2:0;else if(id==='black')mult=!red.has(n)?2:0;else if(id==='even'||id==='odd')mult=(n%2===0)===(id==='even')?2:0;else if(id==='low'||id==='high')mult=(n<=18)===(id==='low')?2:0;else if(id[0]==='d')mult=Math.ceil(n/12)===+id[1]?3:0;else if(id[0]==='c')mult=(n-1)%3+1===+id[1]?3:0;}credit(s,amount*mult,'Ruleta · retorno');const x=core(s);x.rouletteHistory??=[];x.rouletteHistory.push(n);x.rouletteHistory=x.rouletteHistory.slice(-100);x.roulette={n,selection:id,stake:amount,payout:amount*mult,message:'Número '+n+' · retorno '+money(amount*mult)};}
const bacVal=c=>c.rank>=10?0:c.rank;
const bacTotal=cs=>cs.reduce((a,c)=>a+bacVal(c),0)%10;
function baccarat(s,id){const amount=stake();if(!['player','banker','tie'].includes(id)||!debit(s,amount,'Baccarat · apuesta'))return 'Importe inválido.';const d=deck(),p=[d.pop(),d.pop()],b=[d.pop(),d.pop()];let pt=bacTotal(p),bt=bacTotal(b);if(pt<8&&bt<8){let third=null;if(pt<=5){const c=d.pop();p.push(c);third=bacVal(c);}if(third===null?bt<=5:bt<=2||bt===3&&third!==8||bt===4&&third>=2&&third<=7||bt===5&&third>=4&&third<=7||bt===6&&[6,7].includes(third))b.push(d.pop());}pt=bacTotal(p);bt=bacTotal(b);const win=pt===bt?'tie':pt>bt?'player':'banker',mult=win===id?(id==='tie'?9:id==='banker'?1.95:2):win==='tie'&&id!=='tie'?1:0;credit(s,round(amount*mult),'Baccarat · retorno');const x=core(s);x.baccaratHistory??=[];x.baccaratHistory.push({player:pt,banker:bt,winner:win});x.baccarat={player:p,banker:b,winner:win,stake:amount,payout:round(amount*mult),message:'Jugador '+pt+' · Banca '+bt+' · retorno '+money(amount*mult)};}
/* Preserve original item IDs and fill to exactly 300. */
const catalog=[
 ['Automóviles','🚗',25000,['Toyota Corolla','Honda Civic','Mazda 3','Volkswagen Golf','Hyundai Elantra','Kia K5','Subaru WRX','Tesla Model 3','Audi A4','BMW M340i','Mercedes C43','Lexus IS','Ford Mustang GT','Chevrolet Corvette','BMW M4','Audi RS5','Porsche 911','Mercedes AMG GT','Nissan GT-R','Porsche GT3 RS','McLaren Artura','Ferrari Roma','Lamborghini Huracán','Ferrari 296','Bugatti Chiron'],['Base','Performance']],
 ['Motocicletas','🏍',8000,['Honda CB650R','Yamaha MT-07','Kawasaki Ninja','Ducati Monster','Triumph Street Triple','BMW S1000RR','Suzuki Hayabusa','Ducati Panigale'],['Estándar','Premium']],
 ['Propiedades','🏠',65000,['Apartamento urbano','Loft','Condominio','Casa suburbana','Dúplex','Ático','Chalet','Villa costera','Mansión','Casa de montaña','Residencia con piscina','Finca privada'],['Esencial','Lujo','Signature']],
 ['Ropa y calzado','👟',250,['Zapatillas de calle','Traje a medida','Chaqueta de diseñador','Abrigo','Colección deportiva','Sneakers exclusivas','Maleta de viaje','Gafas de sol','Camiseta edición limitada','Botas de cuero'],['Clásico','Elite','Coleccionista']],
 ['Joyas y relojes','⌚',1800,['Reloj automático','Cronógrafo','Reloj deportivo','Cadena de oro','Pulsera','Anillo','Pendientes','Reloj de buceo','Reloj tourbillon','Collar de diamantes'],['Acero','Oro','Alta joyería']],
 ['Entrenamiento','🏀',450,['Máquina de tiro','Pesas','Cinta de correr','Bicicleta indoor','Entrenamiento de salto','Sesiones de tiro','Cancha privada','Análisis de vídeo','Coach de técnica','Entrenador de defensa'],['Inicio','Pro','Elite']],
 ['Salud','🩺',400,['Masaje deportivo','Fisioterapia','Crioterapia','Nutricionista','Cámara de recuperación','Colchón ergonómico','Yoga','Piscina terapéutica','Evaluación biomecánica','Psicología deportiva'],['Básico','Avanzado','Premium']],
 ['Tecnología','💻',450,['Portátil','Teléfono','Cámara','Consola','Pantalla OLED','Equipo streaming','Auriculares','Smartwatch','Simulador de conducción','Estudio multimedia'],['Estándar','Pro']],
 ['Viajes','✈',1600,['Retiro de montaña','Fin de semana en París','Playas del Caribe','Viaje a Japón','Safari','Crucero','Nueva York','Dubai','Roma','Maldivas'],['Confort','VIP']],
 ['Negocios','💼',10000,['Cafetería','Restaurante','Tienda deportiva','Academia juvenil','Gimnasio','Marca de ropa','Estudio de medios','Inmueble de alquiler','Empresa tecnológica','Centro de recuperación'],['Participación','Propiedad']],
 ['Personal','👤',1500,['Chef','Conductor','Representante','Asistente','Guardaespaldas','Preparador físico','Community manager','Estilista','Contable','Fotógrafo'],['Parcial','Exclusivo']],
 ['Entretenimiento','🎵',500,['Home cinema','Estudio musical','Colección de arte','Concierto privado','Sala de juegos','Mesa de billar','Instrumento musical','Club de golf','Patrocinio cultural','Festival'],['Básico','VIP']]
];
const candidates=[];
for(const [cat,icon,base,names,editions] of catalog)for(let i=0;i<names.length;i++)for(let j=0;j<editions.length;j++){
 const tier=1+Math.floor(i*4/names.length)+j;let price=Math.round(base*(1+i*.28)**2*(1+j*1.8)/50)*50;
 if(cat==='Automóviles'&&i>=20)price*=4;if(cat==='Automóviles'&&i===24)price=2500000*(j+1);
 const pop=Math.min(15,Math.max(1,Math.round(tier*(['Automóviles','Joyas y relojes','Propiedades'].includes(cat)?1.7:.7))));
 const confidence=Math.min(12,tier*2),risk=cat==='Automóviles'||cat==='Motocicletas'?Math.min(9,tier*2):Math.min(5,tier);
 const skill=cat==='Entrenamiento'?['shooting','athleticism','athleticism','athleticism','athleticism','shooting','shooting','playmaking','playmaking','defense'][i]:null,skillBoost=skill?Math.min(2,1+j):0,energyGain=['Salud','Personal'].includes(cat)?Math.min(12,tier*2):0;
 const skillNames={shooting:'tiro',playmaking:'creación',defense:'defensa',athleticism:'atletismo'};
 candidates.push({id:'v13-'+cat.charCodeAt(0)+'-'+catalog.findIndex(a=>a[0]===cat)+'-'+i+'-'+j,name:names[i]+' · '+editions[j],price,category:cat,icon,pop,confidence,risk,skill,skillBoost,energyGain,desc:'+'+pop+' popularidad · +'+confidence+' confianza · riesgo '+risk+'/10'+(skill?' · +'+skillBoost+' '+skillNames[skill]:'')+(energyGain?' · +'+energyGain+' energía':'')});
}
// Round-robin by category keeps every category represented.
const buckets=catalog.map(c=>{const items=candidates.filter(i=>i.category===c[0]);const models=items.filter((_,i)=>i%c[4].length===0),versions=items.filter((_,i)=>i%c[4].length!==0);if(c[0]==='Automóviles'){const flagship=models.pop();models.splice(2,0,flagship);}return models.concat(versions);});while(E.items.length<300&&buckets.some(b=>b.length))for(const b of buckets){if(E.items.length>=300)break;if(b.length)E.items.push(b.shift());}
const oldBuy=E.buy;
E.buy=function(s,id){const item=E.items.find(i=>i.id===id),r=oldBuy(s,id);if(r?.ok&&item?.category){const c=E.initWorld(s);c.popularity=clamp(c.popularity+item.pop,0,100);core(s).personalConfidence=clamp((core(s).personalConfidence??50)+item.confidence,0,100);if(item.skill&&s.player.skills) s.player.skills[item.skill]=clamp(s.player.skills[item.skill]+item.skillBoost,1,99);if(item.energyGain)s.player.energy=clamp(s.player.energy+item.energyGain,0,100);s.fans=(s.fans||0)+item.pop*120;if(c.lastPurchase){c.lastPurchase.popularity=item.pop;c.lastPurchase.id=item.id;c.lastPurchase.confidence=item.confidence;}}return r;};
const photo=(item,illustration)=>window.WH_V14_ART?window.WH_V14_ART.art(item,illustration):illustration;
const categoryArt={'Automóviles':'sports_car','Motocicletas':'sports_car','Propiedades':'penthouse','Ropa y calzado':'shoes','Joyas y relojes':'image_agent','Entrenamiento':'gym','Salud':'physio','Tecnología':'streaming_room','Viajes':'family_trip','Negocios':'image_agent','Personal':'trainer','Entretenimiento':'streaming_room'};
function purchase(data){const i=E.items.find(x=>x.id===data.id);if(!i)return V.purchase(data);if(!i.category)return V.purchase(data).replace(V.art(i),photo(i,V.art(i)));return '<div class="modal-backdrop decision-backdrop"><section class="modal-card decision-dialog v92-purchase" role="dialog" aria-modal="true"><div class="decision-eyebrow">NUEVA ADQUISICIÓN</div>'+photo(i,V.art({id:categoryArt[i.category],name:i.name}))+'<h2>¡Ya es tuyo!</h2><h3>'+esc(i.name)+'</h3><p>'+esc(i.desc)+'</p><div class="wh13-metrics">'+metric('INVERSIÓN',money(i.price))+metric('POPULARIDAD','+'+i.pop)+metric('CONFIANZA','+'+i.confidence)+'</div><button class="btn primary" data-action="close-modal">Continuar</button></section></div>';}
function lifeNotice(s){const x=core(s),e=x.lifePending;if(!e)return '';return panel(esc(e.title),'<p>'+esc(e.text)+'</p>'+e.options.map((o,i)=>btn(esc(o.label)+(o.cash?' · '+money(o.cash):''),'life-answer','data-id="'+i+'" '+(o.cash<0&&wallet(s).cash<Math.abs(o.cash)?'disabled':''),'primary')).join(''));}
function shop(s){
 const x=core(s),cat=x.shopCat||'Todos',c=wallet(s),all=E.items.filter(i=>cat==='Todos'||cat==='Mis adquisiciones'&&c.owned.includes(i.id)||(i.category||'Originales')===cat),page=clamp(x.shopPage||0,0,Math.max(0,Math.ceil(all.length/24)-1));
 return '<div class="wh13-metrics">'+metric('CATÁLOGO',E.items.length)+metric('PATRIMONIO EN COMPRAS',money(E.items.filter(i=>c.owned.includes(i.id)).reduce((a,i)=>a+i.price,0)))+metric('CONFIANZA PERSONAL',x.personalConfidence??50)+'</div>'+lifeNotice(s)+'<div class="wh13-options">'+['Todos','Mis adquisiciones','Originales',...catalog.map(c=>c[0])].map(n=>btn(esc(n),'shop-cat','data-id="'+esc(n)+'"',cat===n?'primary':'ghost')).join('')+'</div><p>'+all.length+' artículos · página '+(page+1)+' / '+Math.max(1,Math.ceil(all.length/24))+'</p><div class="life-shop-grid">'+all.slice(page*24,page*24+24).map(i=>'<article class="life-item">'+photo(i,V.art?V.art(i.category?{id:categoryArt[i.category],name:i.name}:i):'<div class="wh13-product">'+(i.icon||'★')+'</div>')+'<h3>'+esc(i.name)+'</h3><p>'+esc(i.desc)+'</p><strong>'+money(i.price)+'</strong><p>'+(c.owned.includes(i.id)?'Adquirido':V.available(s,i)?'<button class="btn primary" data-action="buy-life" data-id="'+esc(i.id)+'">Comprar</button>':'Bloqueado · saldo o progreso insuficiente')+'</p></article>').join('')+'</div>'+btn('Anterior','shop-page','data-id="-1" '+(page===0?'disabled':''))+btn('Siguiente','shop-page','data-id="1" '+(page>=Math.ceil(all.length/24)-1?'disabled':''))+panel('Eventos de estilo de vida',x.events.slice(0,10).map(e=>'<p>'+esc(e.text)+' · '+money(e.delta)+'</p>').join('')||'<p>Tus adquisiciones pueden generar nuevas historias durante la temporada.</p>');
}
const option=(label,cash=0,pop=0,energy=0,injury=0,confidence=0)=>({label,cash,pop,energy,injury,confidence});
function lifestyleEvent(s,news){
 const c=E.initWorld(s),x=core(s),owned=E.items.filter(i=>i.category&&c.owned.includes(i.id));
 if(!owned.length||x.lifePending||Math.random()>.16)return;
 const item=owned[rand(0,owned.length-1)],cat=item.category,fee=Math.max(50,Math.round(item.price*.008)),service=Math.max(100,Math.round(item.price*.015)),income=Math.max(100,Math.round(item.price*.025));
 let event;
 if(['Automóviles','Motocicletas'].includes(cat)){
  if(Math.random()<item.risk*.055){const games=rand(1,4);s.player.injury=Math.max(s.player.injury||0,games);event={title:'Accidente fuera de la cancha',text:'Tu '+item.name+' sufrió un accidente. Recuperación prevista: '+games+' partido(s).',options:[option('Tratamiento especializado',-service,0,5,-1,1),option('Recuperación habitual',0,0,3,0,-1)]};}
  else event={title:'Una visita al taller',text:'Tu '+item.name+' necesita mantenimiento antes de volver a circular.',options:[option('Mantenimiento completo',-fee,0,1,0,2),option('Dejarlo guardado',0,-1,0,0,-1),option('Participar en una exhibición',income,2,-5,0,1)]};
 }else if(cat==='Negocios'){
  const good=Math.random()<.55;
  event=good?{title:'Oportunidad comercial',text:item.name+' tiene una propuesta de expansión.',options:[option('Reinvertir en el negocio',-service,2,-2,0,2),option('Retirar beneficios',income,0,0,0,1),option('Delegar la gestión',Math.round(income*.5),1,3)]}:{title:'Problemas de liquidez',text:item.name+' necesita ayuda para cubrir sus gastos.',options:[option('Cubrir los gastos',-service,1,-1),option('Reducir operaciones',0,-2,2,0,-2)]};
 }else if(cat==='Propiedades'){
  event={title:'Tu propiedad requiere atención',text:item.name+' tiene una factura imprevista de mantenimiento.',options:[option('Reparación completa',-service,1,4,0,2),option('Reparación básica',-fee,0,1),option('Posponer obras',0,-2,-5,0,-2)]};
 }else if(cat==='Joyas y relojes'||cat==='Ropa y calzado'){
  event=Math.random()<.25?{title:'Incidente con una adquisición',text:'Se perdió un accesorio de '+item.name+' durante un viaje.',options:[option('Reponerlo y mejorar la seguridad',-service,0,0,0,1),option('Asumir la pérdida',0,-1,-2,0,-2)]}:{title:'Invitación de moda',text:'Una marca quiere que luzcas '+item.name+' en un evento público.',options:[option('Participar en la campaña',income,4,-7,0,2),option('Sesión breve de fotos',Math.round(income*.3),2,-2),option('Rechazar y descansar',0,0,5)]};
 }else if(cat==='Entrenamiento'||cat==='Salud'||cat==='Personal'){
  event={title:'Tu equipo personal propone un cambio',text:item.name+' puede ayudarte a mejorar la recuperación, pero exige recursos y tiempo.',options:[option('Programa intensivo',-service,1,10,-1,2),option('Programa habitual',-fee,0,5,0,1),option('Descanso sin coste',0,0,3)]};
 }else if(cat==='Viajes'||cat==='Entretenimiento'){
  event={title:'Planes fuera de la cancha',text:'Te han invitado a una actividad relacionada con '+item.name+'.',options:[option('Asistir toda la noche',-fee,4,-14,0,2),option('Asistir brevemente',-Math.max(1,Math.round(fee*.35)),2,-3),option('Priorizar el descanso',0,0,8)]};
 }else{
  event={title:'Propuesta digital',text:'Tu '+item.name+' abre una oportunidad de contenido con tus seguidores.',options:[option('Grabar una colaboración',income,3,-6,0,1),option('Mejorar el equipo',-service,2,2),option('No participar',0,0,4)]};
 }
 x.lifePending={...event,asset:item.id,season:s.season,week:s.world.week};news('Nuevo evento de estilo de vida',event.text,'activity');
}
function resolveLife(s,i,news){
 const x=core(s),e=x.lifePending,o=e?.options[i],c=wallet(s);if(!o||o.cash<0&&c.cash<Math.abs(o.cash))return 'Opción no disponible.';
 c.cash=round(c.cash+o.cash);const w=E.initWorld(s);w.popularity=clamp(w.popularity+o.pop,0,100);s.player.energy=clamp(s.player.energy+o.energy,0,100);s.player.injury=Math.max(0,(s.player.injury||0)+o.injury);x.personalConfidence=clamp((x.personalConfidence??50)+o.confidence,0,100);
 const text=e.title+' · '+o.label;x.events.unshift({text,delta:o.cash,season:s.season,week:s.world.week});x.events=x.events.slice(0,40);delete x.lifePending;news('Decisión personal',text+(o.cash?' · '+money(o.cash):''),'activity');return text;
}
function action(s,act,el,news){
 const x=core(s),id=el.dataset.id;
 const bookAmount=Number(document.getElementById('wh13-stake')?.value),casinoAmount=stake();if(Number.isFinite(bookAmount)&&bookAmount>=1)x.bookStake=bookAmount;if(Number.isFinite(casinoAmount)&&casinoAmount>=1)x.casinoStake=casinoAmount;
 switch(act){case 'book-tab':x.bookTab=id;break;case 'select':select(s,id);break;case 'clear':x.slip=[];break;case 'place':return place(s,Number(document.getElementById('wh13-stake')?.value));case 'decision':case 'match-decision':decision(s,id);break;
 case 'bac-reset':if(window.confirm('¿Comenzar un nuevo registro de baccarat? El saldo no cambia.'))x.baccaratHistory=[];break;case 'casino-tab':x.casinoTab=id;break;case 'roulette':return roulette(s,id);case 'baccarat':return baccarat(s,id);
 case 'start-case':if(x.case&&!x.case.started)x.case.started=true;break;case 'answer':answer(s,+id,news);break;
 case 'life-answer':return resolveLife(s,Number(id),news);
 case 'shop-cat':x.shopCat=id;x.shopPage=0;break;case 'shop-page':x.shopPage=Math.max(0,(x.shopPage||0)+Number(id));break;
 default:if(act.startsWith('bj-'))return blackjack(s,act.slice(3));
 }
}
window.WH_V13={core,book,casino,investigations,shop,action,alterLine,alterScore,suspendLine,settle,mode,grade,bjValue,bacTotal,refundPending,postMatch,strategy,purchase};
})();
