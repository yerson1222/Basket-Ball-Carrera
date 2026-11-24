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
function header(s){const x=core(s);return '<div class="wh13-metrics">'+metric('SALDO FICTICIO',money(wallet(s).cash))+metric('BALANCE DE JUEGO',money(x.net))+metric('SUSPENSIÓN',x.suspension+' partidos')+'</div><p class="muted">Simulación de ficción · sin depósitos, retiros ni dinero real.</p>';}
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
 return result;
}
function book(s,f,club,league){
 const x=core(s),k=key(s);
 if(!f)return header(s)+panel('Sin partido disponible','<p>Vuelve cuando exista un próximo rival.</p>')+history(s);
 if(x.marketKey!==k){x.marketKey=k;x.slip=[];x.market=markets(s,f,club,league);}
 const ms=x.market||markets(s,f,club,league),selected=x.slip.map(id=>ms.find(m=>m.id===id)).filter(Boolean);
 const groups=[...new Set(ms.map(m=>m.group))],locked=!!s.liveMatch||!!s.career.pendingImpact;
 return header(s)+'<div class="wh13-layout"><div>'+panel(esc(club(f.home).name)+' vs '+esc(club(f.away).name),'<p>Mercados prepartido · '+(locked?'cerrados':'abiertos')+'</p>'+groups.map(g=>'<div class="wh13-market"><b>'+esc(g)+'</b><div class="wh13-options">'+ms.filter(m=>m.group===g).map(m=>btn(esc(m.label)+'<strong>'+m.odds.toFixed(2)+'</strong>','select','data-id="'+m.id+'" '+(locked?'disabled':''),x.slip.includes(m.id)?'primary':'ghost')).join('')+'</div></div>').join(''))+'</div><div>'+panel('Boleto '+(selected.length>1?'combinado':'simple'),selected.map(m=>'<p>'+esc(m.group)+' · '+esc(m.label)+' <b>'+m.odds.toFixed(2)+'</b></p>').join('')+'<p>Cuota combinada <b>'+selected.reduce((v,m)=>v*m.odds,1).toFixed(2)+'</b></p><label>Importe ficticio <input id="wh13-stake" type="number" min="1" step="1" max="'+Math.floor(wallet(s).cash)+'" value="'+(x.bookStake||100)+'"></label><p>Retorno potencial: <strong id="wh13-potential" data-odds="'+selected.reduce((v,m)=>v*m.odds,1)+'">'+money((x.bookStake||100)*selected.reduce((v,m)=>v*m.odds,1))+'</strong></p>'+btn('Confirmar boleto','place',locked?'disabled':'','primary')+btn('Limpiar','clear'))+panel('Decisión de carrera', '<p>Elige una variante ficticia de rendimiento. No garantiza ningún resultado; puede abrir un expediente disciplinario.</p>'+[['clean','Jugar normalmente'],['focus','Forzar protagonismo'],['withdraw','Reducir protagonismo'],['fix','Interferir en el partido']].map(([id,n])=>btn(n,'decision','data-id="'+id+'" '+(locked||x.suspension?'disabled':''),((x.decision?.key===k?x.decision.mode:'clean')===id?'primary':'ghost'))).join(''))+'</div></div>'+history(s);
}
function history(s){const x=core(s);return panel('Mis boletos',x.tickets.slice(0,35).map(t=>'<article class="wh13-ticket"><b>'+esc(t.state.toUpperCase())+' · '+money(t.stake)+'</b><span>'+t.legs.map(l=>esc(l.group)+': '+esc(l.label)).join(' / ')+'</span><strong>'+money(t.payout||0)+'</strong></article>').join('')||'<p>Sin boletos todavía.</p>');}
function select(s,id){const x=core(s),m=x.market?.find(v=>v.id===id);if(!m||x.marketKey!==key(s)||s.liveMatch||s.career.pendingImpact)return;
 if(x.slip.includes(id))x.slip=x.slip.filter(v=>v!==id);else{x.slip=x.slip.filter(v=>x.market.find(w=>w.id===v)?.group!==m.group);if(x.slip.length<8)x.slip.push(id);}
}
function place(s,stake){const x=core(s);if(s.liveMatch||s.career.pendingImpact||x.marketKey!==key(s))return 'Mercado cerrado.';
 const legs=x.slip.map(id=>x.market.find(m=>m.id===id)).filter(Boolean);if(!legs.length)return 'Selecciona un mercado.';
 if(!debit(s,stake,'Boleto deportivo'))return 'Importe inválido o saldo insuficiente.';
 x.tickets.unshift({key:key(s),legs:legs.map(m=>({...m})),stake,state:'pendiente'});x.slip=[];return 'Boleto confirmado.';
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
 if(['stat','dd','td'].includes(l.kind)&&g.dnp)return null;
 if(l.kind==='ml')return r.winner===l.side;
 if(l.kind==='spread'){const v=(r.home===l.side?r.hs-r.as:r.as-r.hs)+l.line;return v===0?null:v>0;}
 if(l.kind==='dd'||l.kind==='td'){const count=['pts','reb','ast','stl','blk'].filter(k=>g[k]>=10).length;return (count>=(l.kind==='dd'?2:3))===(l.side==='yes');}
 const v=l.kind==='total'?r.hs+r.as:l.kind==='teamtotal'?(l.stat==='homeTotal'?r.hs:r.as):value(g,l.stat);
 return v===l.line?null:l.side==='over'?v>l.line:v<l.line;
}
function settle(s,r,g,news){const x=core(s),k=key(s),m=g.dnp?'clean':mode(s);for(const t of x.tickets.filter(t=>t.state==='pendiente'&&t.key===k)){
 const results=t.legs.map(l=>grade(l,r,g));t.results=results;t.state=results.includes(false)?'perdido':results.every(v=>v===null)?'anulado':'ganado';
 t.payout=t.state==='perdido'?0:round(t.stake*t.legs.reduce((v,l,i)=>v*(results[i]===true?l.odds:1),1));t.settledSeason=s.season;t.settledWeek=g.week;t.settledStage=g.stage;t.approach=m;credit(s,t.payout,'Liquidación '+t.state);news('Boleto '+t.state,money(t.payout)+' de retorno ficticio.','activity');
 }
 if(m!=='clean')x.risk=clamp(x.risk+(m==='fix'?22:10),0,100);
 if(!x.case&&!x.suspension&&!g.suspended&&Math.random()<.012+x.risk*.0025){
  x.case={sequence:Array.from({length:5},()=>rand(1,4)),step:0,errors:0,started:false,season:s.season,week:g.week};news('Investigación de integridad','La liga ha abierto un expediente. Resuelve el desafío antes de volver a jugar.','warning');
 }else x.risk=Math.max(0,x.risk-1);
 delete x.decision; lifestyleEvent(s,news);
}
function refundPending(s){for(const t of core(s).tickets.filter(t=>t.state==='pendiente')){t.state='anulado';t.payout=t.stake;credit(s,t.stake,'Boleto anulado al cerrar temporada');}core(s).slip=[];delete core(s).decision;}
function postMatch(s,g){if(!g)return '';const ts=core(s).tickets.filter(t=>t.settledSeason===s.season&&t.settledWeek===g.week&&t.settledStage===g.stage);return ts.length?'<div class="wh13-match-summary"><h3>Resultado de tus apuestas</h3>'+ts.map(t=>'<p><b>'+esc(t.state.toUpperCase())+'</b> · '+money(t.stake)+' → '+money(t.payout)+'<br><small>'+t.legs.map((l,i)=>esc(l.group)+' '+(t.results[i]===true?'✓':t.results[i]===false?'✕':'—')).join(' · ')+'</small></p>').join('')+'</div>':'';}
function strategy(s){const x=core(s),m=mode(s);return '<div class="wh13-strategy"><b>Enfoque del partido</b><div class="wh13-options">'+[['clean','Normal'],['focus','Protagonismo'],['withdraw','Menor protagonismo'],['fix','Interferir']].map(([id,n])=>btn(n,'match-decision','data-id="'+id+'" '+(s.player.injury||x.suspension?'disabled':''),m===id?'primary':'ghost')).join('')+'</div><small>Decisiones ficticias. Los enfoques no normales pueden provocar investigaciones.</small></div>';}
function investigations(s){const x=core(s),c=x.case;return header(s)+panel('Comisión de integridad',c?'<p>Prueba de memoria ficticia: memoriza la secuencia y luego reprodúcela. Dos errores implican sanción.</p>'+(c.started?'<p>Progreso '+c.step+' / '+c.sequence.length+' · Errores '+c.errors+' / 2</p><div class="wh13-options">'+[1,2,3,4].map(n=>btn(''+n,'answer','data-id="'+n+'"','primary')).join('')+'</div>':'<div class="wh13-sequence">'+c.sequence.map(n=>'<b>'+n+'</b>').join('')+'</div>'+btn('He memorizado','start-case','','primary')):'<p>No tienes investigaciones abiertas.</p>')+panel('Historial disciplinario',x.cases.map(c=>'<p>Temporada '+c.season+' · J'+c.week+' · '+esc(c.verdict)+'</p>').join('')||'<p>Sin expedientes resueltos.</p>');}
function answer(s,n,news){const x=core(s),c=x.case;if(!c?.started||!Number.isInteger(n)||n<1||n>4)return;if(n===c.sequence[c.step])c.step++;else c.errors++;
 if(c.errors>=2||c.step===c.sequence.length){const lost=c.errors>=2;c.verdict=lost?'Culpable · 5 partidos':'Expediente cerrado';if(lost){x.suspension+=5;const w=E.initWorld(s);w.popularity=Math.max(0,w.popularity-20);w.coachTrust=Math.max(0,w.coachTrust-8);}x.cases.unshift(c);delete x.case;x.risk=0;news(lost?'Sanción disciplinaria':'Expediente cerrado',lost?'Suspendido 5 partidos. Popularidad −20.':'Has superado el desafío de integridad.','warning');}
}
function stake(){return Number(document.getElementById('wh13-casino-stake')?.value);}
const red=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const card=()=>({rank:rand(1,13),suit:['♠','♥','♣','♦'][rand(0,3)]});
function deck(){const d=[];for(let j=0;j<6;j++)for(const suit of ['♠','♥','♣','♦'])for(let rank=1;rank<=13;rank++)d.push({rank,suit});for(let i=d.length-1;i>0;i--){const j=rand(0,i);[d[i],d[j]]=[d[j],d[i]];}return d;}
const bjValue=cards=>{let sum=cards.reduce((a,c)=>a+Math.min(c.rank,10),0);if(cards.some(c=>c.rank===1)&&sum+10<=21)sum+=10;return sum;};
const natural=h=>h.cards.length===2&&bjValue(h.cards)===21&&!h.split;
const cardHTML=c=>'<span class="wh13-card '+(['♥','♦'].includes(c.suit)?'red':'')+'">'+(['','A','2','3','4','5','6','7','8','9','10','J','Q','K'][c.rank])+c.suit+'</span>';
const cardsHTML=cs=>cs.map(cardHTML).join('');
function casino(s){const x=core(s),b=x.bj,tab=x.casinoTab||'bj';return header(s)+'<div class="wh13-options">'+[['bj','Blackjack'],['roulette','Ruleta europea'],['baccarat','Baccarat']].map(([id,l])=>btn(l,'casino-tab','data-id="'+id+'"',tab===id?'primary':'ghost')).join('')+'</div>'+panel(tab==='bj'?'Blackjack':tab==='roulette'?'Ruleta europea':'Baccarat','<div class="wh13-table">'+(tab==='bj'&&b?'<h3>Crupier '+(b.done?bjValue(b.dealer):'')+'</h3><div class="wh13-cards">'+cardHTML(b.dealer[0])+(b.done?cardsHTML(b.dealer.slice(1)):'<span class="wh13-card back">WH</span>')+'</div>'+b.hands.map((h,i)=>'<div class="wh13-hand '+(i===b.index&&!b.done?'active':'')+'"><h3>Mano '+(i+1)+' · '+bjValue(h.cards)+' · '+money(h.stake)+'</h3><div class="wh13-cards">'+cardsHTML(h.cards)+'</div><p>'+esc(h.result||'')+'</p></div>').join('')+(b.done?'<p>'+esc(b.result)+'</p>':btn('Pedir','bj-hit','','primary')+btn('Plantarse','bj-stand')+btn('Doblar','bj-double',b.hands[b.index].cards.length!==2||wallet(s).cash<b.hands[b.index].stake?'disabled':'')+btn('Dividir','bj-split',b.hands.length>=4||b.hands[b.index].cards.length!==2||b.hands[b.index].cards[0].rank!==b.hands[b.index].cards[1].rank||wallet(s).cash<b.hands[b.index].stake?'disabled':'')):'')+
 (tab==='roulette'?'<div class="wh13-wheel">'+(x.roulette?.n??'0–36')+'</div><div class="wh13-roulette">'+Array.from({length:37},(_,n)=>btn(''+n,'roulette','data-id="n'+n+'"',n===0?'green':red.has(n)?'red':'black')).join('')+'</div><div class="wh13-options">'+[['red','Rojo'],['black','Negro'],['even','Par'],['odd','Impar'],['low','1–18'],['high','19–36'],['d1','1.ª docena'],['d2','2.ª docena'],['d3','3.ª docena'],['c1','Columna 1'],['c2','Columna 2'],['c3','Columna 3']].map(([id,l])=>btn(l,'roulette','data-id="'+id+'"')).join('')+'</div><p>'+esc(x.roulette?.message||'Selecciona una apuesta para girar.')+'</p>':'')+
 (tab==='baccarat'?'<h3>Jugador</h3><div class="wh13-cards">'+cardsHTML(x.baccarat?.player||[])+'</div><h3>Banca</h3><div class="wh13-cards">'+cardsHTML(x.baccarat?.banker||[])+'</div><p>'+esc(x.baccarat?.message||'Selecciona el resultado.')+'</p>'+[['player','Jugador · 1:1'],['banker','Banca · 0,95:1'],['tie','Empate · 8:1']].map(([id,l])=>btn(l,'baccarat','data-id="'+id+'"','primary')).join(''):'')+
 '</div><label>Importe ficticio <input id="wh13-casino-stake" type="number" min="1" step="1" value="'+(x.casinoStake||100)+'"></label>'+ (tab==='bj'&&(!b||b.done)?btn('Repartir cartas','bj-start','','primary'):'')+'<p class="muted">'+(tab==='bj'?'Crupier se planta en 17; blackjack 3:2, empate devuelve la apuesta.':tab==='roulette'?'Un solo cero. Pleno 35:1, docena o columna 2:1, apuestas simples 1:1.':'Reglas de tercera carta; comisión del 5% para banca.')+'</p>')+panel('Movimientos recientes',x.ledger.slice(0,15).map(l=>'<p>'+esc(l.label)+' · <b>'+money(l.delta)+'</b></p>').join('')||'<p>Sin movimientos.</p>');}
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
function roulette(s,id){const amount=stake();if(!/^(n(?:[0-9]|[12][0-9]|3[0-6])|red|black|even|odd|low|high|d[123]|c[123])$/.test(id)||!debit(s,amount,'Ruleta · apuesta'))return 'Importe inválido.';const n=rand(0,36);let mult=0;if(/^n\d/.test(id))mult=n===Number(id.slice(1))?36:0;else if(n!==0){if(id==='red')mult=red.has(n)?2:0;else if(id==='black')mult=!red.has(n)?2:0;else if(id==='even'||id==='odd')mult=(n%2===0)===(id==='even')?2:0;else if(id==='low'||id==='high')mult=(n<=18)===(id==='low')?2:0;else if(id[0]==='d')mult=Math.ceil(n/12)===+id[1]?3:0;else if(id[0]==='c')mult=(n-1)%3+1===+id[1]?3:0;}credit(s,amount*mult,'Ruleta · retorno');core(s).roulette={n,message:'Número '+n+' · retorno '+money(amount*mult)};}
const bacVal=c=>c.rank>=10?0:c.rank;
const bacTotal=cs=>cs.reduce((a,c)=>a+bacVal(c),0)%10;
function baccarat(s,id){const amount=stake();if(!['player','banker','tie'].includes(id)||!debit(s,amount,'Baccarat · apuesta'))return 'Importe inválido.';const d=deck(),p=[d.pop(),d.pop()],b=[d.pop(),d.pop()];let pt=bacTotal(p),bt=bacTotal(b);if(pt<8&&bt<8){let third=null;if(pt<=5){const c=d.pop();p.push(c);third=bacVal(c);}if(third===null?bt<=5:bt<=2||bt===3&&third!==8||bt===4&&third>=2&&third<=7||bt===5&&third>=4&&third<=7||bt===6&&[6,7].includes(third))b.push(d.pop());}pt=bacTotal(p);bt=bacTotal(b);const win=pt===bt?'tie':pt>bt?'player':'banker',mult=win===id?(id==='tie'?9:id==='banker'?1.95:2):win==='tie'&&id!=='tie'?1:0;credit(s,round(amount*mult),'Baccarat · retorno');core(s).baccarat={player:p,banker:b,message:'Jugador '+pt+' · Banca '+bt+' · retorno '+money(amount*mult)};}
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
 const confidence=Math.min(12,tier*2),risk=cat==='Automóviles'||cat==='Motocicletas'?Math.min(9,tier+1):Math.min(5,tier);
 candidates.push({id:'v13-'+cat.charCodeAt(0)+'-'+catalog.findIndex(a=>a[0]===cat)+'-'+i+'-'+j,name:names[i]+' · '+editions[j],price,category:cat,icon,pop,confidence,risk,desc:'+'+pop+' popularidad · +'+confidence+' confianza · riesgo '+risk+'/10'});
}
// Round-robin by category keeps every category represented.
const buckets=catalog.map(c=>{const items=candidates.filter(i=>i.category===c[0]);return items.filter((_,i)=>i%c[4].length===0).concat(items.filter((_,i)=>i%c[4].length!==0));});while(E.items.length<300&&buckets.some(b=>b.length))for(const b of buckets){if(E.items.length>=300)break;if(b.length)E.items.push(b.shift());}
const oldBuy=E.buy;
E.buy=function(s,id){const item=E.items.find(i=>i.id===id),r=oldBuy(s,id);if(r?.ok&&item?.category){const c=E.initWorld(s);c.popularity=clamp(c.popularity+item.pop,0,100);c.coachTrust=clamp(c.coachTrust+item.confidence,0,100);s.fans=(s.fans||0)+item.pop*120;if(c.lastPurchase)c.lastPurchase.popularity=item.pop;}return r;};
function shop(s){const x=core(s),cat=x.shopCat||'Todos',c=wallet(s),all=E.items.filter(i=>cat==='Todos'||(i.category||'Originales')===cat),page=clamp(x.shopPage||0,0,Math.max(0,Math.ceil(all.length/24)-1));return '<div class="wh13-options">'+['Todos','Originales',...catalog.map(c=>c[0])].map(n=>btn(esc(n),'shop-cat','data-id="'+esc(n)+'"',cat===n?'primary':'ghost')).join('')+'</div><p>'+all.length+' artículos · página '+(page+1)+' / '+Math.max(1,Math.ceil(all.length/24))+'</p><div class="life-shop-grid">'+all.slice(page*24,page*24+24).map(i=>'<article class="life-item"><div class="wh13-product">'+(i.icon||'★')+'</div><h3>'+esc(i.name)+'</h3><p>'+esc(i.desc)+'</p><strong>'+money(i.price)+'</strong><p>'+(c.owned.includes(i.id)?'Adquirido':V.available(s,i)?'<button class="btn primary" data-action="buy-life" data-id="'+esc(i.id)+'">Comprar</button>':'Bloqueado · saldo o progreso insuficiente')+'</p></article>').join('')+'</div>'+btn('Anterior','shop-page','data-id="-1" '+(page===0?'disabled':''))+btn('Siguiente','shop-page','data-id="1" '+(page>=Math.ceil(all.length/24)-1?'disabled':''));}
function lifestyleEvent(s,news){const c=E.initWorld(s),x=core(s),owned=E.items.filter(i=>i.category&&c.owned.includes(i.id));if(!owned.length||Math.random()>.13)return;const item=owned[rand(0,owned.length-1)],cat=item.category;let text='',delta=0;
 if(['Automóviles','Motocicletas'].includes(cat)&&Math.random()<item.risk*.035){const days=rand(1,4);s.player.injury=Math.max(s.player.injury||0,days);text='Accidente con '+item.name+' · recuperación de '+days+' partidos.';}
 else if(cat==='Negocios'){delta=rand(0,1)?Math.round(item.price*.025):-Math.round(item.price*.035);text=delta>0?'Beneficios de '+item.name:'Pérdidas de '+item.name;}
 else if(cat==='Salud'||cat==='Personal'||cat==='Entrenamiento'){s.player.energy=clamp(s.player.energy+rand(3,8),0,100);delta=-Math.round(item.price*.01);text='Servicio y recuperación: '+item.name;}
 else if(cat==='Viajes'||cat==='Entretenimiento'){s.player.energy=clamp(s.player.energy+rand(-9,8),0,100);text='Actividad fuera de cancha: '+item.name;}
 else {delta=-Math.round(item.price*.008);text='Mantenimiento, seguro o reparación: '+item.name;}
 delta=Math.max(-c.cash,delta);c.cash=round(c.cash+delta);x.events.unshift({text,delta,season:s.season,week:s.world.week});x.events=x.events.slice(0,40);news('Estilo de vida',text+(delta?' · '+money(delta):''),'activity');
}
function action(s,act,el,news){
 const x=core(s),id=el.dataset.id;
 const bookAmount=Number(document.getElementById('wh13-stake')?.value),casinoAmount=stake();if(Number.isFinite(bookAmount)&&bookAmount>=1)x.bookStake=bookAmount;if(Number.isFinite(casinoAmount)&&casinoAmount>=1)x.casinoStake=casinoAmount;
 switch(act){case 'select':select(s,id);break;case 'clear':x.slip=[];break;case 'place':return place(s,Number(document.getElementById('wh13-stake')?.value));case 'decision':case 'match-decision':decision(s,id);break;
 case 'casino-tab':x.casinoTab=id;break;case 'roulette':return roulette(s,id);case 'baccarat':return baccarat(s,id);
 case 'start-case':if(x.case&&!x.case.started)x.case.started=true;break;case 'answer':answer(s,+id,news);break;
 case 'shop-cat':x.shopCat=id;x.shopPage=0;break;case 'shop-page':x.shopPage=Math.max(0,(x.shopPage||0)+Number(id));break;
 default:if(act.startsWith('bj-'))return blackjack(s,act.slice(3));
 }
}
window.WH_V13={core,book,casino,investigations,shop,action,alterLine,alterScore,suspendLine,settle,mode,grade,bjValue,bacTotal,refundPending,postMatch,strategy};
})();
