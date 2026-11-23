/* WORLD HOOPS v1 — simulador original de carrera de basketball, 100% cliente.
   Sin librerías, servicios ni cuentas externas. La partida se guarda localmente. */
(() => {
'use strict';
const DATA=window.WH_DATA;
const CAREER=window.WH_CAREER;
const KEY='worldhoops_save_v1';
const COLORS=['#b9f16b','#7bc6ff','#ff9c75','#d8a6ff','#64d9c2','#fbd275','#ff8da8','#94a9ff'];
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rand=(a,b)=>a+Math.random()*(b-a);
const randint=(a,b)=>Math.floor(rand(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('es-ES').format(Math.round(n||0));
const money=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n||0);
const pct=(v)=>`${(v*100).toFixed(1)}%`;
const league=id=>DATA.leagues.find(x=>x.id===id);
const continent=id=>DATA.continents.find(x=>x.id===id);
const hash=s=>[...s].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0);
const initialSave=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(!s||s.version!==1||!s.player||!s.world)return null;if(s.leagueId==='lnbp'){s.leagueId='cibacopa';s.teamId='cibacopa-0';s.world=freshWorld('cibacopa');s.offers=[];s.salary=salaryEstimate('cibacopa',Math.round((s.player.skills.shooting+s.player.skills.playmaking+s.player.skills.defense+s.player.skills.athleticism)/4));s.news=Array.isArray(s.news)?s.news:[];s.news.unshift({title:'Liga mexicana actualizada',description:'¡Nuevo desafío! Tu carrera continúa en CIBACOPA, México.',type:'activity',season:s.season,week:0});localStorage.setItem(KEY,JSON.stringify(s));}return league(s.leagueId)&&club(s.teamId)?s:null;}catch{return null;}};
let save=initialSave();
if(save)CAREER.init(save);
const ui={tab:'home',browseContinent:save?league(save.leagueId).continent:'north',browseLeague:save?.leagueId||'nba',menu:false,modal:null};
const iconMap={
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  court:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18M3 7a5 5 0 0 1 0 10M21 7a5 5 0 0 0 0 10"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  transfer:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
  chart:'<path d="M4 20V11m6 9V4m6 16v-7m5 7H2"/>',
  trophy:'<path d="M8 21h8m-4-4v4M7 4h10v7a5 5 0 0 1-10 0zM7 6H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>',
  activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  bolt:'<path d="m13 2-9 11h7l-1 9 10-12h-7z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  disk:'<path d="M5 3h12l4 4v14H3V3zM7 3v6h10V3M7 21v-9h10v9"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  warning:'<path d="M12 3 2 21h20zM12 9v5m0 3h.01"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  fire:'<path d="M12 22c5 0 8-4 8-9 0-4-2-6-4-8 0 4-2 5-3 5C13 6 10 3 8 2c1 6-4 8-4 12a8 8 0 0 0 8 8z"/>',
  check:'<path d="m5 12 5 5L20 7"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  medal:'<circle cx="12" cy="16" r="5"/><path d="m7 3 5 8 5-8M9 3l3 5 3-5"/>'
};
function ico(name,size=20){return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconMap[name]||iconMap.spark}</svg>`;}
function avg(a,k){return a.length?a.reduce((sum,x)=>sum+(x[k]||0),0)/a.length:0;}
function clubList(lid){const l=league(lid);if(!l)return [];if(DATA.realTeams?.[lid])return DATA.realTeams[lid].map((t,i)=>({...t,rating:clamp(l.quality-6+((Math.abs(hash(`${lid}:${i}`))%15)-7),50,98)}));return l.cities.map((city,i)=>({id:`${lid}-${i}`,city,name:`${city} ${DATA.mascots[(i+(Math.abs(hash(lid))%8))%8]}`,abbr:city.split(/[ -]/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('')||'WH',rating:clamp(l.quality-6+((Math.abs(hash(`${lid}:${i}`))%15)-7),50,98),color:COLORS[(i+Math.abs(hash(lid)))%COLORS.length]}));}
function club(id){const lid=id?.split('-').slice(0,-1).join('-');return lid?clubList(lid).find(x=>x.id===id):null;}
function shortName(id){return club(id)?.name||'Equipo';}
function playerOverall(p=save?.player){if(!p)return 0;const a=p.skills;return Math.round((a.shooting+a.playmaking+a.defense+a.athleticism)/4);}
function allGames(){return save?.world?.playerGames||[];}
function seasonStats(){const games=allGames().filter(g=>!g.dnp);return {gp:games.length,ppg:avg(games,'pts'),rpg:avg(games,'reb'),apg:avg(games,'ast'),spg:avg(games,'stl'),bpg:avg(games,'blk'),total:games.reduce((a,g)=>a+g.pts,0),fg:games.length?avg(games,'fg'):0};}
function careerTotals(){const h=save.history||[];const g=allGames().filter(x=>!x.dnp);return {games:h.reduce((a,x)=>a+x.stats.gp,0)+g.length,pts:h.reduce((a,x)=>a+x.stats.points,0)+g.reduce((a,x)=>a+x.pts,0),titles:h.filter(x=>x.champion).length};}
function currentTeam(){return club(save.teamId);}
function tableRows(){return Object.entries(save.world.table).map(([id,r])=>({...r,id,team:club(id)})).sort((a,b)=>b.w-a.w||(b.pf-b.pa)-(a.pf-a.pa)||b.pf-a.pf);}
function myRank(){return tableRows().findIndex(x=>x.id===save.teamId)+1;}
function fixtureRounds(ids,lid){const order=[...ids].sort(()=>Math.random()-.5);if(order.length%2)order.push(null);const n=order.length,rounds=[];for(let i=0;i<n-1;i++){const matches=[];for(let j=0;j<n/2;j++){const a=order[j],b=order[n-1-j];if(a&&b)matches.push(i%2===0?{home:a,away:b}:{home:b,away:a});}rounds.push(matches);order.splice(1,0,order.pop());}const reverse=rounds.map(r=>r.map(m=>({home:m.away,away:m.home})));const full=[...rounds,...reverse];return lid==='nba'?[...full,...rounds.slice(0,24).map((r,i)=>r.map(m=>i%2?{home:m.away,away:m.home}:{...m}))]:full;}
function salaryEstimate(lid,rating){const l=league(lid),scale=clamp(.57+(rating-l.quality)*.037,.25,2.15);return Math.round(l.money*scale/1000)*1000;}
function initialSkills(pos,style){const a={shooting:62,playmaking:62,defense:62,athleticism:62};if(pos==='PG'){a.playmaking+=10;a.shooting+=3;a.defense-=3;}
  else if(pos==='SG'){a.shooting+=9;a.playmaking+=3;}
  else if(pos==='SF'){a.shooting+=4;a.defense+=4;a.athleticism+=4;}
  else if(pos==='PF'){a.defense+=6;a.athleticism+=8;a.playmaking-=3;}
  else if(pos==='C'){a.defense+=11;a.athleticism+=7;a.shooting-=5;a.playmaking-=4;}
  ({scorer:'shooting',playmaker:'playmaking',defender:'defense',athlete:'athleticism'})[style] && (a[({scorer:'shooting',playmaker:'playmaking',defender:'defense',athlete:'athleticism'})[style]]+=6);
  return a;
}
function freshWorld(lid){const teams=clubList(lid),ids=teams.map(t=>t.id),table={};ids.forEach(id=>table[id]={w:0,l:0,pf:0,pa:0,streak:0});return {table,rounds:fixtureRounds(ids,lid),week:0,phase:'regular',results:[],playerGames:[],playoffs:null,lastMatch:null,champion:null,trainingWeek:-1};}
function createCareer(fields){const lid=fields.league,teamId=fields.team,sk=initialSkills(fields.position,fields.style);const p={name:fields.name.trim().slice(0,24),country:fields.country,age:+fields.age,position:fields.position,style:fields.style,skills:sk,xp:0,energy:96,injury:0};const ov=playerOverall(p);
 save={version:1,player:p,leagueId:lid,teamId,salary:salaryEstimate(lid,ov),season:1,year:2026,fans:125,reputation:30,earnings:0,history:[],awards:[],offers:[],world:freshWorld(lid),news:[]};
 CAREER.init(save);addNews('¡Comienza tu historia!',`${p.name} firma su primer contrato con ${shortName(teamId)}. El mundo está mirando.`,'spark');
 ui.tab='home';ui.browseContinent=league(lid).continent;ui.browseLeague=lid;persist();render();closeModal();toast('¡Bienvenido a World Hoops!');
}
function addNews(title,description,type='activity'){save.news.unshift({title,description,type,season:save.season,week:save.world.week});save.news=save.news.slice(0,28);}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(save));}catch{toast('No se pudo guardar la partida; revisa el espacio del navegador.');}}
function teamScore(a,b,lid,home){const l=league(lid),pace=l.quality>=93?114:l.quality>=84?91:l.quality>=74?85:78;const strength=(a.rating-b.rating)*1.15;return clamp(Math.round(pace+strength+(home?3:0)+rand(-16,16)),53,155);}
function calcPlayerGame(teamPts,opponent,lid,round,stage='regular'){
 const p=save.player,ov=playerOverall(),t=currentTeam(),gap=ov-league(lid).quality;const dnp=p.injury>0;
 if(dnp){p.injury--;return {week:round,stage,opponent,pts:0,reb:0,ast:0,stl:0,blk:0,min:0,fg:0,threes:0,dnp:true};}
 const min=clamp(Math.round(25+(ov-t.rating)*.58+rand(-5,5)),8,39);
 const shots=clamp(13+(p.skills.shooting-65)*.25+gap*.15+(p.style==='scorer'?4:0),4,32);
 const pts=clamp(Math.round(shots*min/29+rand(-7,8)),0,Math.round(teamPts*.46));
 const reb=clamp(Math.round((p.position==='C'?8:p.position==='PF'?6:p.position==='SF'?4.5:3)+(.12*(p.skills.athleticism-65))+rand(-2.5,3)),0,19);
 const ast=clamp(Math.round((p.position==='PG'?7:p.position==='SG'?4:2.5)+(.14*(p.skills.playmaking-65))+rand(-2,3)),0,17);
 const stl=clamp(Math.round(1.2+(.045*(p.skills.defense-60))+rand(-.8,1.5)),0,6);
 const blk=clamp(Math.round((p.position==='C'||p.position==='PF'?1.5:.5)+(.035*(p.skills.defense-60))+rand(-.5,1.2)),0,6);
 const threes=clamp(Math.round((pts/9)+(p.position==='C'?-1:0)+rand(-1.5,1.3)),0,Math.floor(pts/3));
 const fg=clamp(.41+(.0028*(p.skills.shooting-60))+rand(-.07,.07),.31,.71);
 p.xp+=6+Math.round(pts*.4+reb*.45+ast*.6);
 p.energy=clamp(p.energy+11,25,100);
 save.fans+=Math.max(0,Math.round((pts+ast*2+reb)/5));
 save.reputation=clamp(save.reputation+(pts>=25?1.4:pts>=15?.6:.2),1,100);
 const injuryRisk=p.energy<50?.05:.015;
 if(Math.random()<injuryRisk){p.injury=randint(1,3);addNews('Molestia física',`${p.name} tendrá que descansar ${p.injury} partido(s).`,'warning');}
 const line={week:round,stage,opponent,pts,reb,ast,stl,blk,min,fg,threes,dnp:false};
 const impact=save.career?.pendingImpact;
 if(impact){
  line.pts=clamp(line.pts+impact.pts+impact.moodPts,0,Math.floor(teamPts*.55));
  line.ast=clamp(line.ast+impact.ast,0,22);
  line.reb=clamp(line.reb+impact.reb,0,24);
  line.stl=clamp(line.stl+impact.stl,0,10);
  line.blk=clamp(line.blk+impact.blk,0,10);
  line.decision={action:impact.action,day:impact.day,success:impact.success,details:impact.details};
 }
 return line;
}
function playFixture(m,stage,week){const home=club(m.home),away=club(m.away);let hs=teamScore(home,away,save.leagueId,true),as=teamScore(away,home,save.leagueId,false);
 const impact=save.career?.pendingImpact;
 if(impact&&(m.home===save.teamId||m.away===save.teamId)){
  const delta=impact.scoreDelta+impact.moodPts;
  if(m.home===save.teamId)hs=clamp(hs+delta,53,170);else as=clamp(as+delta,53,170);
 }
 if(hs===as){if(Math.random()<.5)hs+=randint(2,9);else as+=randint(2,9);}
 const result={home:m.home,away:m.away,hs,as,stage,week,winner:hs>as?m.home:m.away};
 if(m.home===save.teamId||m.away===save.teamId){const op=m.home===save.teamId?m.away:m.home;const mine=m.home===save.teamId?hs:as,other=m.home===save.teamId?as:hs;const line=calcPlayerGame(mine,op,save.leagueId,week,stage);line.win=mine>other;line.teamScore=mine;line.opponentScore=other;save.world.playerGames.push(line);save.world.lastMatch={...result,player:line};CAREER.pay(save);if(save.career)delete save.career.pendingImpact;if(!line.dnp&&line.pts>=30)addNews('¡Actuación estelar!',`${save.player.name} explotó con ${line.pts} puntos frente a ${shortName(op)}.`,'fire');}
 return result;
}
function simulateWeek(){if(!save||save.world.phase!=='regular')return null;
 const w=save.world,week=w.week+1,fixtures=w.rounds[w.week];let mine;
 fixtures.forEach(m=>{const result=playFixture(m,'regular',week);w.results.push(result);const h=w.table[m.home],a=w.table[m.away];h.pf+=result.hs;h.pa+=result.as;a.pf+=result.as;a.pa+=result.hs; if(result.hs>result.as){h.w++;a.l++;h.streak=h.streak>0?h.streak+1:1;a.streak=a.streak<0?a.streak-1:-1;}else{a.w++;h.l++;a.streak=a.streak>0?a.streak+1:1;h.streak=h.streak<0?h.streak-1:-1;} if(m.home===save.teamId||m.away===save.teamId)mine=result;});
 w.week++;if(mine){const won=mine.winner===save.teamId;addNews(won?'Victoria en la jornada':'Derrota en la jornada',`${shortName(save.teamId)} ${mine.home===save.teamId?mine.hs:mine.as} - ${mine.home===save.teamId?mine.as:mine.hs} ${shortName(mine.home===save.teamId?mine.away:mine.home)}.` ,won?'check':'activity');}
 if(w.week>=w.rounds.length){w.phase='playoffs';addNews('¡Termina la liga regular!',`Finalizas en el puesto #${myRank()}. Los cuatro primeros disputarán los playoffs.`,'trophy');w.playoffs={round:0,seed:tableRows().slice(0,4).map(x=>x.id),semis:[],final:null};}
 return mine;
}
function simulatePlayoffRound(){const w=save.world;if(w.phase!=='playoffs')return null;const p=w.playoffs;
 if(p.round===0){const m1={home:p.seed[0],away:p.seed[3]},m2={home:p.seed[1],away:p.seed[2]};p.semis=[playFixture(m1,'semifinal',w.rounds.length+1),playFixture(m2,'semifinal',w.rounds.length+1)];p.round=1;addNews('Semifinales completadas',`${shortName(p.semis[0].winner)} y ${shortName(p.semis[1].winner)} jugarán la gran final.`,'trophy');return {stage:'Semifinales',games:p.semis};}
 const home=p.semis[0].winner,away=p.semis[1].winner;p.final=playFixture({home,away},'final',w.rounds.length+2);p.round=2;w.champion=p.final.winner;w.phase='offseason';finalizeSeason();return {stage:'Gran final',games:[p.final]};
}
function finalizeSeason(){const w=save.world,p=save.player,stats=seasonStats(),champ=w.champion===save.teamId,teamWins=w.table[save.teamId].w;let honors=[];
 if(champ){honors.push('Campeón de liga');save.reputation=clamp(save.reputation+10,1,100);save.fans+=2500;}
 if(stats.ppg>=26&&stats.gp>=8){honors.push('Estrella de la temporada');save.reputation=clamp(save.reputation+6,1,100);}
 if(stats.ppg>=18&&stats.gp>=8)honors.push('Quinteto ideal');
 const record={year:save.year,season:save.season,age:p.age,team:currentTeam().name,league:league(save.leagueId).name,leagueId:save.leagueId,teamId:save.teamId,rank:myRank(),wins:teamWins,losses:w.table[save.teamId].l,champion:champ,stats:{gp:stats.gp,points:stats.total,ppg:stats.ppg,rpg:stats.rpg,apg:stats.apg},awards:honors,salary:save.salary};
 save.history.unshift(record);save.awards.push(...honors.map(title=>({title,year:save.year,team:currentTeam().name})));save.earnings+=save.salary;
 addNews(champ?'¡CAMPEONES DEL MUNDO HOOPS!':'Temporada terminada',champ?`${currentTeam().name} alza el trofeo. ${p.name} ya es parte de la historia.`:`Acabas la temporada #${save.season}. Llegó el momento de decidir tu futuro.`,'trophy');
 save.offers=generateOffers();
}
function generateOffers(){const p=save.player,ov=playerOverall(),current=league(save.leagueId);const eligible=DATA.leagues.filter(l=>l.id!==save.leagueId&&l.quality<=Math.max(ov+20,current.quality+12));const combos=[];
 const bands=[...eligible].sort((a,b)=>Math.abs(a.quality-(current.quality+3))-Math.abs(b.quality-(current.quality+3)));
 const pool=[...bands.slice(0,9).sort(()=>Math.random()-.5).slice(0,2),pick(eligible.filter(l=>l.continent!==current.continent).length?eligible.filter(l=>l.continent!==current.continent):eligible),pick(eligible)];
 for(const l of pool){if(!l||combos.some(c=>c.leagueId===l.id))continue;const t=pick(clubList(l.id));let salary=salaryEstimate(l.id,ov)*(1+rand(.05,.24));salary=Math.round(salary/1000)*1000;combos.push({id:`offer-${l.id}`,leagueId:l.id,teamId:t.id,salary,years:1,role:ov>=l.quality?'Titular':'Rotación'});}
 if(save.leagueId==='gleague'){const my=club(save.teamId),s=seasonStats();if(my?.affiliate&&(ov>=73||s.ppg>=16||save.reputation>=47)){const target=club(my.affiliate);combos.unshift({id:'offer-nba-callup',leagueId:'nba',teamId:target.id,salary:Math.max(900000,salaryEstimate('nba',ov)),years:1,role:'Ascenso a la NBA'});addNews('¡Oportunidad NBA!',`${target.name}, franquicia asociada a ${my.name}, quiere ficharte para la próxima temporada.`,'transfer');}}return combos.filter((c,i)=>combos.findIndex(o=>o.teamId===c.teamId)===i).slice(0,4);
}
function nextSeason(offer){if(save.world.phase!=='offseason')return;
 const prev=currentTeam().name,wasMoved=offer&&offer.teamId!==save.teamId;
 save.year++;save.season++;save.player.age++;save.player.energy=100;save.player.injury=0;save.player.xp+=20;
 if(offer){save.teamId=offer.teamId;save.leagueId=offer.leagueId;save.salary=offer.salary;}else{save.salary=Math.round(save.salary*1.08/1000)*1000;}
 save.world=freshWorld(save.leagueId);save.offers=[];
 addNews(wasMoved?'¡FICHAJE CONFIRMADO!':'Contrato renovado',wasMoved?`${save.player.name} deja ${prev} y ficha por ${shortName(save.teamId)}. Nuevo salario: ${money(save.salary)}.`:`${save.player.name} seguirá una temporada más en ${shortName(save.teamId)}.`,'transfer');
 ui.tab='home';ui.browseLeague=save.leagueId;ui.browseContinent=league(save.leagueId).continent;persist();render();toast(wasMoved?'¡Nuevo equipo, nuevo desafío!':'¡Nueva temporada!');
}
function train(skill){
 if(!save||save.world.phase!=='regular')return;
 if(save.world.trainingWeek===save.world.week)return toast('Ya entrenaste esta jornada.');
 if(save.player.injury)return toast('Debes recuperarte antes de entrenar.');
 if(save.player.energy<18)return toast('Necesitas más energía.');
 showModal(trainingChoiceModal(skill));
}
function finishTraining(skill,method){
 const outcome=CAREER.train(save,skill,method);
 if(!outcome)return toast('No es posible completar ese entrenamiento.');
 addNews('Entrenamiento de '+skillName(skill),(outcome.gain?'+'+outcome.gain+' en '+skillName(skill)+'. ':'')+(outcome.cost>=0?'Recuperaste energía.':'Sesión completada.'),'bolt');
 persist();closeModal();render();
 toast((outcome.gain?'+'+outcome.gain+' '+skillName(skill)+' · ':'')+(outcome.cost>=0?'Energía +'+outcome.cost:'Energía '+outcome.cost));
}
const skillName=s=>({shooting:'Tiro',playmaking:'Creación',defense:'Defensa',athleticism:'Atletismo'})[s]||s;
function avatar(name='WH'){const chars=name.trim().split(/\s+/);return (chars.length>1?chars[0][0]+chars[chars.length-1][0]:name.slice(0,2)).toUpperCase();}
function teamLogo(team,size='md'){if(!team)return '<span class="team-logo empty" aria-hidden="true">—</span>';const regional=/^(france|italy|germany)-/.test(team.id||'');return `<span class="team-logo ${size} ${team.logo?'real-logo':''} ${regional?'fr-it-de-logo':''}" style="--team-color:${team.color}" title="${esc(team.name)}" aria-label="${esc(team.name)}">${team.logo?`<img src="${esc(team.logo)}" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.append(document.createTextNode(this.dataset.abbr))" data-abbr="${esc(team.abbr)}">`:esc(team.abbr)}</span>`;}
function leagueBadge(l,size='sm'){if(!l)return '';const id=esc(l.id),name=esc(l.name);return l.logo?`<span class="league-badge ${size} league-badge--${id}" title="${name}" data-label="${esc(l.id==='cibacopa'?'CIBACOPA':l.id==='gleague'?'G LEAGUE':l.id==='nba'?'NBA':l.name)}"><img src="${esc(l.logo)}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.hidden=true;this.parentNode.classList.add('badge-image-failed');" ><span class="badge-label" aria-hidden="true">${esc(l.id==='cibacopa'?'CIBACOPA':l.id==='gleague'?'G LEAGUE':l.id==='nba'?'NBA':l.name)}</span></span>`:`<span class="league-flag ${size}">${esc(l.flag)}</span>`;}
function logoCoverage(l){return '';}
function statusPill(text,kind='neutral'){return `<span class="pill ${kind}">${esc(text)}</span>`;}
function actionButton(text,action,klass='primary',extra=''){return `<button type="button" class="btn ${klass}" data-action="${action}" ${extra}>${text}</button>`;}
function pageTitle(title,subtitle=''){return `<div class="page-header"><div><div class="eyebrow">MODO CARRERA / TEMPORADA ${save.year}</div><h1>${title}</h1><p>${subtitle}</p></div>${statusPill(save.world.phase==='regular'?`Jornada ${save.world.week+1} / ${save.world.rounds.length}`:save.world.phase==='playoffs'?'PLAYOFFS':'MERCADO ABIERTO',save.world.phase==='offseason'?'lime':'neutral')}</div>`;}
function navItem(tab,label,sym){return `<button class="nav-item ${ui.tab===tab?'active':''}" data-action="nav" data-tab="${tab}">${ico(sym,20)}<span>${label}</span>${ui.tab===tab?'<i class="active-dot"></i>':''}</button>`;}
function shell(){const t=currentTeam(),l=league(save.leagueId);return `<div class="app-shell ${ui.menu?'menu-open':''}"><div class="mobile-scrim" data-action="toggle-menu"></div><aside class="sidebar">
  <div class="brand"><span class="brand-ball">◉</span><span>WORLD<span class="brand-light">HOOPS</span><small>CAREER UNIVERSE</small></span></div>
  <div class="side-label">MENÚ PRINCIPAL</div><nav class="side-nav" aria-label="Menú principal">${navItem('home','Mi carrera','home')}${navItem('match','Partidos','court')}${navItem('leagues','Ligas del mundo','globe')}${navItem('market','Mercado','transfer')}${navItem('stats','Mi jugador','chart')}${navItem('life','Mi estilo de vida','spark')}${navItem('legacy','Mi legado','trophy')}</nav>
  <div class="sidebar-bottom"><div class="sidebar-profile"><span class="mini-avatar">${esc(avatar(save.player.name))}</span><span class="side-person"><b>${esc(save.player.name)}</b><small>${esc(save.player.position)} · ${esc(l.flag)} ${esc(l.name)}</small></span><span class="online-dot"></span></div><div class="side-foot">VERSIÓN 3.0 · GUARDADO LOCAL ${ico('disk',14)}</div></div>
  </aside><main class="main"><div class="topbar"><div class="topbar-left"><button class="icon-btn mobile-menu" data-action="toggle-menu" aria-label="Abrir menú">${ico('menu',22)}</button><span class="crumb">WORLD HOOPS <span>/</span> ${esc(({home:'MI CARRERA',match:'PARTIDOS',leagues:'LIGAS',market:'MERCADO',stats:'JUGADOR',life:'ESTILO DE VIDA',legacy:'LEGADO'})[ui.tab])}</span></div><div class="topbar-right"><span class="time-tag">${ico('calendar',15)} ${save.year}</span><div class="top-profile">${teamLogo(t,'sm')}<span>${esc(t.name)}</span></div></div></div><div class="page-content">${renderPage()}</div><footer class="footer">WORLD HOOPS <span>·</span> Tu carrera. Tu legado.</footer></main></div>`;}
function renderPage(){return ({home:renderHome,match:renderMatches,leagues:renderLeagues,market:renderMarket,stats:renderStats,life:renderLife,legacy:renderLegacy})[ui.tab]();}
function nextFixture(){const w=save.world;if(w.phase!=='regular')return null;const match=w.rounds[w.week].find(m=>m.home===save.teamId||m.away===save.teamId);return match?{...match,opponent:match.home===save.teamId?match.away:match.home}:null;}
function plotGames(games){const data=games.filter(g=>!g.dnp).slice(-9);if(!data.length)return `<div class="empty-chart">Tus primeros puntos están por llegar.</div>`;const max=Math.max(30,...data.map(x=>x.pts));return `<div class="chart-bars">${data.map((g,i)=>`<div class="bar-column" title="${g.pts} puntos · partido ${i+1}"><div class="bar-value">${g.pts}</div><div class="bar-track"><div class="bar-fill" style="height:${Math.max(6,(g.pts/max*100))}%;--delay:${i*50}ms"></div></div><small>${g.stage==='regular'?'J'+g.week:g.stage==='final'?'F':'SF'}</small></div>`).join('')}</div>`;}
function newsItems(max=4){return (save.news||[]).slice(0,max).map(n=>`<div class="news-item"><div class="news-icon">${ico(n.type,18)}</div><div><strong>${esc(n.title)}</strong><p>${esc(n.description)}</p><small>TEMP. ${n.season} · JORNADA ${n.week}</small></div></div>`).join('');}
function renderHome(){const p=save.player,t=currentTeam(),l=league(save.leagueId),s=seasonStats(),next=nextFixture(),w=save.world,totals=careerTotals();const opp=next?club(next.opponent):null;return `${pageTitle('Tu carrera comienza aquí','Cada partido cuenta. Cada decisión construye tu legado.')}
  <section class="hero"><div class="hero-grain"></div><div class="hero-content"><div class="hero-kicker">${ico('spark',16)} LA HISTORIA ES TUYA</div><div class="hero-name">${esc(p.name)}</div><div class="hero-meta"><span>${esc(p.position)} · ${esc(p.country)}</span><span class="meta-sep"></span><span>${p.age} AÑOS</span><span class="meta-sep"></span><span>TEMPORADA ${save.season}</span></div>
  <div class="hero-club">${teamLogo(t)}<div><small>ACTUALMENTE EN</small><b>${esc(t.name)}</b><span>${l.flag} ${esc(l.name)}${t.affiliate?' · Filial de '+esc(shortName(t.affiliate)):''}</span></div></div>
  <div class="hero-actions">${w.phase==='regular'?actionButton(`${ico('bolt',18)} Jugar siguiente partido`,'sim-one'):w.phase==='playoffs'?actionButton(`${ico('trophy',18)} Jugar playoffs`,'sim-playoffs'):actionButton(`${ico('transfer',18)} Ver ofertas de fichaje`,'go-market')}${actionButton('Ver mi jugador '+ico('arrow',16),'go-stats','outline')}</div></div>
  <div class="hero-figure"><div class="halo-circle"></div><div class="hoop-board"></div><div class="hoop-net"></div><div class="jersey-shadow"></div><div class="player-art"><div class="head"></div><div class="neck"></div><div class="torso"><span>${esc(p.position)}</span></div><div class="left-arm"></div><div class="right-arm"></div><div class="ball"></div></div></div><div class="hero-overall"><small>MEDIA GLOBAL</small><strong>${playerOverall()}</strong><span>OVR</span></div></section>
  <div class="kpi-grid"><div class="kpi"><div class="kpi-top">PUNTOS / PARTIDO ${ico('target',18)}</div><strong>${s.ppg.toFixed(1)}</strong><small>${s.gp} partidos jugados</small></div><div class="kpi"><div class="kpi-top">REBO / ASIST. ${ico('activity',18)}</div><strong>${s.rpg.toFixed(1)} <em>/</em> ${s.apg.toFixed(1)}</strong><small>Promedio de temporada</small></div><div class="kpi"><div class="kpi-top">POSICIÓN EN LIGA ${ico('chart',18)}</div><strong>#${myRank()} <em>/</em> ${Object.keys(w.table).length}</strong><small>${w.table[save.teamId].w} V · ${w.table[save.teamId].l} D</small></div><div class="kpi"><div class="kpi-top">REPUTACIÓN ${ico('spark',18)}</div><strong>${Math.round(save.reputation)}<em>/100</em></strong><small>${fmt(save.fans)} seguidores</small></div></div>
  <div class="columns columns-main"><div class="col-stack"><section class="panel next-panel"><div class="section-head"><div><div class="eyebrow">EN LA CANCHA</div><h2>${w.phase==='regular'?(next?'Próximo enfrentamiento':'Jornada de descanso'):w.phase==='playoffs'?'Camino al título':'Fin de temporada'}</h2></div>${statusPill(w.phase==='regular'?'JORNADA '+(w.week+1):w.phase==='playoffs'?'ELIMINATORIAS':'OFFSEASON','lime')}</div>${w.phase==='regular'?`<div class="matchup"><div class="match-team">${teamLogo(t,'lg')}<strong>${esc(t.name)}</strong><small>${next?.home===save.teamId?'LOCAL':'VISITANTE'}</small></div><div class="versus"><b>VS</b><small>JORNADA ${w.week+1}</small></div><div class="match-team">${teamLogo(opp,'lg')}<strong>${esc(opp?.name||'DESCANSO')}</strong><small>RIVAL</small></div></div><div class="match-footer"><span>${ico('bolt',16)} Energía: ${p.energy}% ${p.injury?'· LESIONADO':''}</span>${actionButton('Simular partido '+ico('arrow',17),'sim-one','primary small')}</div>`:w.phase==='playoffs'?`<div class="state-message"><div class="state-symbol">${ico('trophy',32)}</div><h3>Se juega el campeonato</h3><p>Los cuatro mejores de la temporada van por el trofeo.</p>${actionButton('Jugar siguiente ronda '+ico('arrow',17),'sim-playoffs','primary')}</div>`:`<div class="state-message"><div class="state-symbol">${ico('transfer',32)}</div><h3>Tu próximo capítulo te espera</h3><p>Consulta tus ofertas, negocia un cambio de liga o renueva tu contrato.</p>${actionButton('Entrar al mercado '+ico('arrow',17),'go-market','primary')}</div>`}</section>
  <section class="panel"><div class="section-head"><div><div class="eyebrow">RENDIMIENTO</div><h2>Últimos partidos</h2></div>${actionButton('Ver estadísticas '+ico('chevron',16),'go-stats','text-btn')}</div>${plotGames(allGames())}</section></div>
  <div class="col-stack"><section class="panel table-panel"><div class="section-head"><div><div class="eyebrow">${esc(l.name).toUpperCase()}</div><h2>Clasificación</h2></div>${actionButton('Ver liga '+ico('chevron',15),'go-leagues','text-btn')}</div>${smallTable()}</section><section class="panel"><div class="section-head"><div><div class="eyebrow">UNIVERSO WORLD HOOPS</div><h2>Últimas noticias</h2></div></div><div class="news-feed">${newsItems(3)}</div></section></div></div>`;}
function smallTable(){return `<div class="standings mini"><div class="stand-head"><span>POS · EQUIPO</span><span>V</span><span>D</span><span>DIF</span></div>${tableRows().slice(0,8).map((r,i)=>`<div class="stand-row ${r.id===save.teamId?'mine':''}"><span><small>${i+1}</small>${teamLogo(r.team,'tiny')}<b>${esc(r.team.city)}</b></span><span>${r.w}</span><span>${r.l}</span><span>${r.pf-r.pa>=0?'+':''}${r.pf-r.pa}</span></div>`).join('')}</div>`;}
function renderMatches(){const w=save.world,l=league(save.leagueId),nf=nextFixture(),opp=nf?club(nf.opponent):null;const myGameByWeek={};w.results.filter(m=>m.home===save.teamId||m.away===save.teamId).forEach(m=>myGameByWeek[m.week]=m);
 return `${pageTitle('Centro de partidos','Simula cada jornada, sigue los resultados y disputa los playoffs.')}
  <div class="columns columns-matches"><div class="col-stack"><section class="panel court-panel"><div class="section-head"><div><div class="eyebrow">${esc(l.name).toUpperCase()} · ${save.year}</div><h2>${w.phase==='regular'?'Próximo partido':w.phase==='playoffs'?'Playoffs':'Temporada completada'}</h2></div>${statusPill(w.phase==='regular'?'TEMPORADA REGULAR':w.phase==='playoffs'?'TOP 4':'FINALIZADA','lime')}</div>
  <div class="court-graphic"><div class="court-lines"><div class="court-mid"></div><div class="court-circle"></div><div class="paint paint-left"></div><div class="paint paint-right"></div><div class="three three-left"></div><div class="three three-right"></div></div><div class="court-match"><div>${teamLogo(currentTeam(),'xl')}<b>${esc(currentTeam().city)}</b></div><strong>VS</strong><div>${teamLogo(opp||club(w.playoffs?.seed?.find(x=>x!==save.teamId)||w.champion||save.teamId),'xl')}<b>${esc(opp?.city||(w.phase==='offseason'?'CAMPEONES':w.phase==='regular'?'DESCANSO':'PLAYOFFS'))}</b></div></div></div>
  <div class="match-actions">${w.phase==='regular'?`${actionButton(`${ico('bolt',18)} Simular una jornada`,'sim-one')}${actionButton('Entrenamientos','go-stats','outline')}${actionButton('Estilo de vida','go-life','ghost')}`:w.phase==='playoffs'?actionButton(`${ico('trophy',18)} Simular próxima ronda`,'sim-playoffs'):actionButton(`${ico('transfer',18)} Ir al mercado`,'go-market')}<span class="info-note">${w.phase==='regular'?`${w.rounds.length-w.week} jornadas restantes`:w.phase==='playoffs'?'Semifinales y final, a un partido':'Cierra el mercado para empezar una nueva temporada'}</span></div></section>
  <section class="panel"><div class="section-head"><div><div class="eyebrow">CALENDARIO PERSONAL</div><h2>Todos tus encuentros</h2></div>${statusPill(`${w.week} / ${w.rounds.length} jugadas`)}</div><div class="fixtures-list">${w.rounds.map((fixtures,i)=>{const m=fixtures.find(x=>x.home===save.teamId||x.away===save.teamId);if(!m)return `<div class="fixture bye"><div class="round-num">${String(i+1).padStart(2,'0')}</div><div class="fixture-info"><b>Jornada de descanso</b><small>SIN PARTIDO PROGRAMADO</small></div></div>`;const o=club(m.home===save.teamId?m.away:m.home),r=myGameByWeek[i+1],mine=r?(r.home===save.teamId?r.hs:r.as):0,theirs=r?(r.home===save.teamId?r.as:r.hs):0;return `<div class="fixture ${i===w.week&&w.phase==='regular'?'upcoming':''}"><div class="round-num">${String(i+1).padStart(2,'0')}</div><div class="fixture-logo">${teamLogo(o,'sm')}</div><div class="fixture-info"><b>${m.home===save.teamId?'vs':'@'} ${esc(o.name)}</b><small>JORNADA ${i+1} · ${m.home===save.teamId?'CASA':'FUERA'}</small></div><div class="fixture-result">${r?`<b>${mine} - ${theirs}</b>${statusPill(mine>theirs?'V':'D',mine>theirs?'win':'loss')}`:i===w.week&&w.phase==='regular'?statusPill('PRÓXIMO','lime'):'—'}</div></div>`}).join('')}</div></section></div>
  <div class="col-stack"><section class="panel"><div class="section-head"><div><div class="eyebrow">MIS DATOS</div><h2>Último resultado</h2></div></div>${lastResult()}</section><section class="panel"><div class="section-head"><div><div class="eyebrow">ELIMINATORIAS</div><h2>Ruta al campeonato</h2></div></div>${renderBracket()}</section><section class="panel"><div class="section-head"><div><div class="eyebrow">COMPETICIÓN</div><h2>Formato compacto</h2></div></div><p class="muted body-copy">${Object.keys(w.table).length} equipos · ${w.rounds.length} jornadas de simulación. Clasifican 4 a semifinales; semifinales y final son a partido único. El resto del mundo sigue disponible para nuevos fichajes y desafíos.</p></section></div></div>`;
}
function lastResult(){const r=save.world.lastMatch;if(!r)return `<div class="empty-state">${ico('court',28)}<strong>La pelota todavía no rueda</strong><p>Simula tu primer partido para conocer tu rendimiento.</p></div>`;const p=r.player,other=club(p.opponent);return `<div class="last-result"><div class="last-score"><div>${teamLogo(currentTeam(),'sm')}<span>${esc(currentTeam().city)}</span></div><strong>${p.teamScore} <em>:</em> ${p.opponentScore}</strong><div>${teamLogo(other,'sm')}<span>${esc(other?.city)}</span></div></div><div class="last-status">${statusPill(p.win?'VICTORIA':'DERROTA',p.win?'win':'loss')} ${statusPill(r.stage==='regular'?`JORNADA ${r.week}`:r.stage.toUpperCase())}</div>${p.dnp?`<p class="muted">No jugaste por lesión.</p>`:`<div class="result-stats"><div><strong>${p.pts}</strong><small>PTS</small></div><div><strong>${p.reb}</strong><small>REB</small></div><div><strong>${p.ast}</strong><small>AST</small></div><div><strong>${p.min}</strong><small>MIN</small></div></div>`}</div>`;}
function renderBracket(){const w=save.world,p=w.playoffs;if(!p){return `<div class="bracket-placeholder"><div class="bracket-dots"><i></i><i></i><i></i><i></i></div><h3>Los 4 mejores avanzan</h3><p>El cuadro se definirá al finalizar la fase regular.</p></div>`;}
 const semi1=p.semis[0],semi2=p.semis[1],final=p.final;function oneMatch(a,b,r){return `<div class="bracket-match"><div class="bracket-name">${teamLogo(club(a),'tiny')}<span>${esc(club(a)?.city)}</span>${r?`<b>${r.home===a?r.hs:r.as}</b>`:''}</div><div class="bracket-name">${teamLogo(club(b),'tiny')}<span>${esc(club(b)?.city)}</span>${r?`<b>${r.home===b?r.hs:r.as}</b>`:''}</div></div>`;}
 return `<div class="bracket"><div><small>SEMIFINALES</small>${oneMatch(p.seed[0],p.seed[3],semi1)}${oneMatch(p.seed[1],p.seed[2],semi2)}</div><div><small>GRAN FINAL</small>${final?oneMatch(final.home,final.away,final):p.semis.length?oneMatch(p.semis[0].winner,p.semis[1].winner,null):'<div class="bracket-empty">POR DEFINIR</div>'}${w.champion?`<div class="winner-title">${ico('trophy',17)} ${esc(shortName(w.champion))}</div>`:''}</div></div>`;}
function renderLeagues(){const selected=league(ui.browseLeague)||league(save.leagueId),active=selected.id===save.leagueId,clubs=clubList(selected.id),members=DATA.leagues.filter(l=>l.continent===ui.browseContinent);return `${pageTitle('Ligas del mundo','Descubre campeonatos, compara niveles y planifica tu próximo salto.')}
 <div class="world-banner"><div class="world-emblem">${ico('globe',40)}</div><div><div class="eyebrow">TU MUNDO. SIN FRONTERAS.</div><h2>${DATA.leagues.length} ligas · ${DATA.continents.length} continentes · ${DATA.leagues.reduce((n,l)=>n+clubList(l.id).length,0)} clubes</h2><p>Explora nuevas ligas, descubre clubes y lleva tu carrera a lo más alto.</p></div></div>
 <div class="continent-tabs">${DATA.continents.map(c=>`<button class="continent-tab ${c.id===ui.browseContinent?'active':''}" data-action="continent" data-continent="${c.id}"><span class="continent-icon" style="--region:${c.accent}">${c.symbol}</span><b>${c.name}</b><small>${DATA.leagues.filter(l=>l.continent===c.id).length} ligas</small></button>`).join('')}</div>
 <div class="columns columns-leagues"><section class="panel league-selector"><div class="section-head"><div><div class="eyebrow">EXPLORAR REGIÓN</div><h2>${esc(continent(ui.browseContinent).name)}</h2></div></div><div class="league-options">${members.map(l=>`<button class="league-option ${l.id===ui.browseLeague?'selected':''}" data-action="choose-league" data-league="${l.id}"><span class="flag">${leagueBadge(l)}</span><span><b>${esc(l.name)}</b><small>${esc(l.country)}</small></span><span class="league-rating">${l.quality} <small>NVL</small></span>${ico('chevron',17)}</button>`).join('')}</div></section>
 <div class="col-stack"><section class="panel league-detail"><div class="league-info-top"><span class="flag flag-large">${leagueBadge(selected,'lg')}</span><div><div class="eyebrow">${esc(continent(selected.continent).name).toUpperCase()} · ${esc(selected.country)}</div><h2>${esc(selected.name)}</h2>${selected.id==='bsn'&&selected.federationLogo?`<img class="puerto-rico-federation-badge" src="${esc(selected.federationLogo)}" alt="Federación de Baloncesto de Puerto Rico" loading="lazy">`:''}<p>${clubs.length} equipos · ${selected.seasonFormat?.games??14} partidos · playoffs TOP 4${logoCoverage(selected)?` · ${logoCoverage(selected)}`:''}</p></div>${active?statusPill('TU LIGA','lime'):statusPill('EXPLORAR')}</div><div class="league-metrics"><div><small>NIVEL COMPETITIVO</small><strong>${selected.quality}<em>/100</em></strong></div><div><small>SALARIO BASE ESTIMADO</small><strong>${money(selected.money)}</strong></div><div><small>CONTINENTE</small><strong>${esc(continent(selected.continent).name)}</strong></div></div><div class="level-gauge"><div style="width:${selected.quality}%"></div></div></section>
 <section class="panel"><div class="section-head"><div><div class="eyebrow">${active?'CLASIFICACIÓN REAL DE TU PARTIDA':'EQUIPOS DISPONIBLES'}</div><h2>${active?'Tabla de posiciones':'Clubes de la liga'}</h2></div></div>${active?`<div class="standings detailed"><div class="stand-head"><span>POS · EQUIPO</span><span>PJ</span><span>V</span><span>D</span><span>DIF</span></div>${tableRows().map((r,i)=>`<div class="stand-row ${r.id===save.teamId?'mine':''}"><span><small>${i+1}</small>${teamLogo(r.team,'tiny')}<b>${esc(r.team.name)}</b></span><span>${r.w+r.l}</span><span>${r.w}</span><span>${r.l}</span><span>${r.pf-r.pa>=0?'+':''}${r.pf-r.pa}</span></div>`).join('')}</div>`:`<div class="club-directory">${clubs.map(t=>`<div class="club-directory-row">${teamLogo(t,'sm')}<div><b>${esc(t.name)}</b><small>${esc(t.affiliate?'Filial de '+shortName(t.affiliate):t.city)}</small></div><span>NVL ${t.rating}</span></div>`).join('')}</div>`}</section></div></div>`;}
function offerCard(offer){const l=league(offer.leagueId),t=club(offer.teamId),increase=(offer.salary/save.salary-1)*100;return `<article class="offer-card"><div class="offer-top"><span class="offer-region">${l.flag} ${esc(l.country)} · ${esc(continent(l.continent).name)}</span>${statusPill(offer.role,'lime')}</div><div class="offer-team">${teamLogo(t,'lg')}<div><h3>${esc(t.name)}</h3><p>${esc(l.name)}</p></div></div><div class="offer-terms"><div><small>SALARIO ANUAL</small><strong>${money(offer.salary)}</strong><span class="growth ${increase<0?'down':''}">${increase>=0?'+':''}${Math.round(increase)}% vs. actual</span></div><div><small>DURACIÓN</small><strong>${offer.years} ${offer.years===1?'año':'años'}</strong></div></div>${actionButton('Firmar contrato '+ico('arrow',17),'sign','primary offer-sign',`data-offer="${offer.id}"`)}</article>`;}
function renderMarket(){const p=save.player,l=league(save.leagueId),offseason=save.world.phase==='offseason';return `${pageTitle('Mercado de fichajes','Los grandes cambios empiezan con una decisión.')}
 <div class="market-hero"><div><div class="eyebrow">AGENCIA WORLD HOOPS</div><h2>${offseason?'Tu futuro está sobre la mesa.':'La próxima oportunidad se está preparando.'}</h2><p>${offseason?'Tu contrato ha terminado. Puedes firmar por otro club o continuar donde estás.':'Los clubes internacionales siguen tu evolución. Las ofertas oficiales llegarán al concluir los playoffs.'}</p></div><div class="market-ball">${ico('transfer',50)}</div></div>
 <div class="market-metrics"><div class="market-metric"><small>CLUB ACTUAL</small><div>${teamLogo(currentTeam(),'sm')}<strong>${esc(currentTeam().name)}</strong></div></div><div class="market-metric"><small>SALARIO / AÑO</small><strong>${money(save.salary)}</strong></div><div class="market-metric"><small>VALORACIÓN</small><strong>${playerOverall()} OVR</strong></div><div class="market-metric"><small>POPULARIDAD</small><strong>${Math.round(save.reputation)} / 100</strong></div></div>
 ${offseason?`<div class="section-head section-outside"><div><div class="eyebrow">MERCADO INTERNACIONAL · ${save.year}</div><h2>${save.offers.length} ofertas sobre la mesa</h2></div></div><div class="offers-grid">${save.offers.map(offerCard).join('')||'<div class="empty-state">No hay ofertas. Puedes renovar.</div>'}</div><section class="panel renew-panel"><div><div class="eyebrow">CONTINÚA TU HISTORIA</div><h2>¿Prefieres quedarte?</h2><p>Renueva automáticamente por una temporada con un aumento salarial del 8%.</p></div>${actionButton('Renovar con mi club '+ico('arrow',17),'stay','outline')}</section>`:`<section class="panel upcoming-market"><div class="lock-symbol">${ico('lock',27)}</div><div><h2>Las ofertas se desbloquean al final de temporada</h2><p>Juega las ${save.world.rounds.length} jornadas y los playoffs. Tu rendimiento influye en tu reputación y tu siguiente contrato.</p></div>${actionButton('Ir a partidos '+ico('arrow',17),'go-match','outline')}</section><div class="section-head section-outside"><div><div class="eyebrow">DESTINOS POTENCIALES</div><h2>El mundo te espera</h2></div></div><div class="scout-grid">${DATA.continents.filter(x=>x.id!==l.continent).map(c=>`<div class="scout"><div class="scout-code" style="color:${c.accent}">${c.symbol}</div><b>${c.name}</b><small>${DATA.leagues.filter(x=>x.continent===c.id).length} ligas para explorar</small></div>`).join('')}</div>`}`;}
function skillBar(k){const v=save.player.skills[k];return `<div class="skill-row"><div class="skill-label"><b>${skillName(k)}</b><span>${v}</span></div><div class="skill-track"><div style="width:${v}%"></div></div></div>`;}
function renderStats(){const p=save.player,s=seasonStats(),w=save.world,available=CAREER.isTrainingDue(save);return `${pageTitle('Mi jugador','Entrena, mejora tus atributos y conviértete en una estrella mundial.')}
 <div class="player-header"><div class="player-id"><div class="profile-avatar">${esc(avatar(p.name))}<span>${p.position}</span></div><div><div class="eyebrow">CARRERA PROFESIONAL</div><h2>${esc(p.name)}</h2><p>${esc(p.country)} · ${p.age} años · ${DATA.positions.find(x=>x.id===p.position)?.name} · ${DATA.styles.find(x=>x.id===p.style)?.name}</p><div class="player-chips">${statusPill(league(save.leagueId).name)}${statusPill(`${save.season}ª temporada`,'lime')}${p.injury?statusPill(`Lesión: ${p.injury} partido(s)`,'loss'):statusPill('Disponible','win')}</div></div></div><div class="big-ovr"><small>VALORACIÓN GENERAL</small><strong>${playerOverall()}</strong><span>OVR</span></div></div>
 <div class="columns columns-main"><div class="col-stack"><section class="panel"><div class="section-head"><div><div class="eyebrow">MI POTENCIAL</div><h2>Atributos del jugador</h2></div>${statusPill('MÁX. 99')}</div><div class="skills-grid">${Object.keys(p.skills).map(skillBar).join('')}</div><div class="fitness"><div><b>${ico('bolt',17)} Energía</b><span>${p.energy}%</span></div><div class="fitness-track"><div style="width:${p.energy}%"></div></div><p>El entrenamiento gasta energía. Jugar partidos permite recuperarla.</p></div></section>
 <section class="panel"><div class="section-head"><div><div class="eyebrow">EL TRABAJO DIARIO</div><h2>Centro de entrenamiento</h2></div>${available?statusPill('1 SESIÓN DISPONIBLE','lime'):statusPill(w.phase==='offseason'?'FIN DE TEMPORADA':p.injury?'LESIONADO':'PRÓXIMA JORNADA')}</div><p class='muted'>Cada semana recibes tres cartas de entrenamiento. Solo puedes elegir una. Algunas cartas mejoran varios atributos y otras pueden restarte puntos.</p><div class='wh-weekly-training'>${available?actionButton('Escoger entrenamiento semanal','train','primary'):statusPill(p.injury?'LESIONADO':'ENTRENAMIENTO HECHO')}<small>Semana ${w.week+1} · 150 cartas posibles · cinco rarezas</small></div></div></section></div>
 <div class="col-stack"><section class="panel"><div class="section-head"><div><div class="eyebrow">TEMPORADA ${save.year}</div><h2>Mi rendimiento</h2></div></div><div class="stat-quad">${[['PTS',s.ppg.toFixed(1)],['REB',s.rpg.toFixed(1)],['AST',s.apg.toFixed(1)],['ROB',s.spg.toFixed(1)],['TAP',s.bpg.toFixed(1)],['FG%',pct(s.fg)]].map(x=>`<div><strong>${x[1]}</strong><small>${x[0]}</small></div>`).join('')}</div><div class="section-head section-sub"><h3>Últimos partidos</h3></div>${plotGames(allGames())}</section><section class="panel"><div class="section-head"><div><div class="eyebrow">PROGRESO DEL JUGADOR</div><h2>Perfil de carrera</h2></div></div><div class="profile-details">${[['Nivel global',`${playerOverall()} OVR`],['Experiencia acumulada',`${fmt(p.xp)} XP`],['Reputación',`${Math.round(save.reputation)} / 100`],['Seguidores',fmt(save.fans)],['Dinero ganado',money(save.earnings)],['Salario actual',money(save.salary)]].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div></section></div></div>`;}
function renderLegacy(){const totals=careerTotals(),hist=save.history||[],awards=save.awards||[];return `${pageTitle('Mi legado','Tus récords, trofeos y temporadas quedan aquí para siempre.')}
 <div class="legacy-banner"><div class="legacy-symbol">${ico('trophy',44)}</div><div><div class="eyebrow">HALL OF FAME</div><h2>Las leyendas no nacen. Se construyen.</h2><p>${esc(save.player.name)} · ${save.season}ª temporada profesional</p></div></div>
 <div class="kpi-grid"><div class="kpi"><div class="kpi-top">TEMPORADAS ${ico('calendar',18)}</div><strong>${save.season}</strong><small>Desde ${save.history.length?save.history[save.history.length-1].year:save.year}</small></div><div class="kpi"><div class="kpi-top">PUNTOS TOTALES ${ico('target',18)}</div><strong>${fmt(totals.pts)}</strong><small>${totals.games} partidos jugados</small></div><div class="kpi"><div class="kpi-top">TÍTULOS ${ico('trophy',18)}</div><strong>${totals.titles}</strong><small>Campeonatos ganados</small></div><div class="kpi"><div class="kpi-top">INGRESOS TOTALES ${ico('transfer',18)}</div><strong class="money-kpi">${money(save.earnings)}</strong><small>Contratos cobrados</small></div></div>
 <div class="columns columns-main"><section class="panel"><div class="section-head"><div><div class="eyebrow">UN CAPÍTULO CADA AÑO</div><h2>Historial de temporadas</h2></div></div>${hist.length?`<div class="history-list">${hist.map(h=>`<article class="history-item"><span class="history-year">${h.year}</span><div><b>${esc(h.team)}</b><small>${esc(h.league)} · ${h.wins} V / ${h.losses} D · puesto #${h.rank}</small><div class="history-stats">${h.stats.ppg.toFixed(1)} PTS · ${h.stats.rpg.toFixed(1)} REB · ${h.stats.apg.toFixed(1)} AST</div></div>${h.champion?`<span class="history-cup">${ico('trophy',20)}</span>`:statusPill(`#${h.rank}`)}</article>`).join('')}</div>`:`<div class="empty-state">${ico('calendar',30)}<strong>Tu primera temporada está en marcha</strong><p>Completa los playoffs para registrar tu primer año profesional.</p></div>`}</section><div class="col-stack"><section class="panel"><div class="section-head"><div><div class="eyebrow">VITRINA PERSONAL</div><h2>Premios y reconocimientos</h2></div></div>${awards.length?`<div class="awards">${awards.map(a=>`<div class="award">${ico('medal',24)}<div><b>${esc(a.title)}</b><small>${a.year} · ${esc(a.team)}</small></div></div>`).join('')}</div>`:`<div class="empty-state">${ico('medal',30)}<strong>Los trofeos te esperan</strong><p>Conquista títulos y consigue distinciones con tu juego.</p></div>`}</section>
 <section class="panel save-panel"><div class="section-head"><div><div class="eyebrow">TU PARTIDA</div><h2>Guardar y administrar</h2></div></div><p>La carrera se guarda automáticamente en este navegador. Exporta un archivo JSON para llevarla a otro dispositivo.</p><div class="save-buttons">${actionButton(ico('download',17)+' Exportar partida','export','outline')}${actionButton('Importar partida','import','ghost')}${actionButton('Nueva carrera','reset','danger')}</div><input type="file" id="save-import" accept=".json,application/json" hidden></section></div></div>`;}
function landing(){const leagues=DATA.leagues.length;return `<div class="landing"><div class="landing-top"><div class="brand"><span class="brand-ball">◉</span><span>WORLD<span class="brand-light">HOOPS</span><small>CAREER UNIVERSE</small></span></div><span class="version-chip">V3.0 · GLOBAL</span></div><main class="landing-main"><div class="landing-left"><div class="eyebrow"><span class="eyebrow-line"></span> EL MUNDO ES TU CANCHA</div><h1>DE CERO<br>A <span>LEYENDA.</span></h1><p>Crea tu jugador. Empieza desde abajo. Domina las canchas del planeta y escribe tu propia historia en el basketball profesional.</p><div class="landing-cta">${actionButton('Crear mi jugador '+ico('arrow',19),'start-career')}${actionButton('Explorar las ligas','landing-leagues','outline')}</div><div class="landing-features"><div><strong>${leagues}</strong><small>LIGAS</small></div><div><strong>6</strong><small>CONTINENTES</small></div><div><strong>${DATA.leagues.reduce((n,l)=>n+clubList(l.id).length,0)}</strong><small>CLUBES</small></div></div></div><div class="landing-right"><div class="landing-glow"></div><div class="intro-ball"><span class="ball-circle"></span><span class="ball-curve-a"></span><span class="ball-curve-b"></span><span class="ball-line"></span></div><div class="hero-floating card-1"><small>PLAYER RATING</small><strong>99 <span>OVR</span></strong><em>EL POTENCIAL NO TIENE LÍMITES</em></div><div class="hero-floating card-2">${ico('trophy',25)}<div><strong>MAKE HISTORY</strong><small>YOUR CAREER. YOUR RULES.</small></div></div></div></main><div class="landing-bottom"><div>${ico('globe',18)} UNA CARRERA GLOBAL · ${leagues} COMPETICIONES</div><span>100% LOCAL · SIN REGISTRO · PC Y MÓVIL</span></div></div>`;}
function landingLeaguesModal(){return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-card world-modal" role="dialog" aria-modal="true" aria-label="Ligas del mundo"><div class="modal-head"><div><div class="eyebrow">UN MUNDO POR CONQUISTAR</div><h2>${DATA.leagues.length} ligas en 6 continentes</h2><p>Elige tu próxima liga y conquista las canchas del mundo.</p></div><button class="icon-btn" data-action="close-modal" aria-label="Cerrar">${ico('close',22)}</button></div><div class="world-modal-list">${DATA.continents.map(c=>`<section><h3><span style="color:${c.accent}">${c.symbol}</span> ${c.name}</h3><div>${DATA.leagues.filter(l=>l.continent===c.id).map(l=>`<div><span>${l.flag} ${esc(l.name)}</span><small>${esc(l.country)}</small></div>`).join('')}</div></section>`).join('')}</div><button type="button" class="btn primary create-submit" data-action="start-career">Crear mi jugador ${ico('arrow',17)}</button></div></div>`;}
function createModal(){const defaultLeague='gleague';return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-card creation" role="dialog" aria-modal="true" aria-labelledby="creation-title"><div class="modal-head"><div><div class="eyebrow">TU HISTORIA EMPIEZA AQUÍ</div><h2 id="creation-title">Crea a tu próxima estrella</h2><p>Elige dónde empieza tu primera temporada.</p></div><button class="icon-btn" data-action="close-modal" aria-label="Cerrar">${ico('close',22)}</button></div><form id="career-form"><div class="form-grid"><label class="field field-full"><span>Nombre del jugador</span><input name="name" required maxlength="24" minlength="2" placeholder="Ej. Alex Rivera" autocomplete="off" autofocus value="Alex Rivera"></label><label class="field"><span>País de origen</span><select name="country">${DATA.countries.map(c=>`<option ${c==='México'?'selected':''} value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label><label class="field"><span>Edad inicial</span><select name="age">${[17,18,19,20,21].map(x=>`<option ${x===18?'selected':''} value="${x}">${x} años</option>`).join('')}</select></label><label class="field"><span>Posición</span><select name="position">${DATA.positions.map(x=>`<option value="${x.id}">${x.name}</option>`).join('')}</select></label><label class="field"><span>Tu estilo</span><select name="style">${DATA.styles.map(x=>`<option value="${x.id}">${x.name} · ${x.desc}</option>`).join('')}</select></label><label class="field"><span>Liga donde comenzar</span><select id="career-league" name="league">${DATA.continents.map(c=>`<optgroup label="${c.name}">${DATA.leagues.filter(l=>l.continent===c.id).map(l=>`<option ${l.id===defaultLeague?'selected':''} value="${l.id}">${l.flag} ${esc(l.name)} (${esc(l.country)})</option>`).join('')}</optgroup>`).join('')}</select></label><label class="field"><span>Tu primer equipo</span><select id="career-team" name="team">${clubList(defaultLeague).map(c=>`<option value="${c.id}">${esc(c.name)}${c.affiliate?' · '+esc(shortName(c.affiliate)):''}</option>`).join('')}</select></label></div><div class="modal-hint">${ico('spark',18)} Tu próximo club puede estar en cualquier parte del mundo. Elige tu destino.</div><button class="btn primary create-submit" type="submit">Empezar mi carrera ${ico('arrow',19)}</button></form></div></div>`;}
function resultModal(result,details){const p=save.world.lastMatch?.player;return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-card result-modal" role="dialog" aria-modal="true" aria-label="Resultado del partido"><button class="icon-btn modal-close" data-action="close-modal" aria-label="Cerrar">${ico('close',21)}</button><div class="result-kicker">${ico('court',20)} ${esc(details||'FINAL DEL PARTIDO')}</div>${result&&p?`<div class="result-teams"><div>${teamLogo(club(result.home),'lg')}<b>${esc(club(result.home)?.city)}</b></div><div class="result-score"><strong>${result.hs} <span>:</span> ${result.as}</strong><small>FINAL</small></div><div>${teamLogo(club(result.away),'lg')}<b>${esc(club(result.away)?.city)}</b></div></div><h2>${result.winner===save.teamId?'¡VICTORIA!':'A SEGUIR LUCHANDO'}</h2><p>${p.dnp?'No jugaste este encuentro por lesión.':`Gran trabajo. Tus números en la cancha: ${p.pts} puntos, ${p.reb} rebotes y ${p.ast} asistencias.`}</p>`:`<div class="result-big-icon">${ico('trophy',48)}</div><h2>${esc(details||'Ronda completada')}</h2><p>Consulta el calendario y tu rendimiento para conocer todos los resultados.</p>`}<button class="btn primary create-submit" data-action="close-modal">Continuar ${ico('arrow',18)}</button></div></div>`;}
function showModal(html){$('#modal-root').innerHTML=html;document.body.classList.add('modal-open');}
function closeModal(){const root=$('#modal-root');if(root)root.innerHTML='';document.body.classList.remove('modal-open');}
function toast(text){const root=$('#toast-root');if(!root)return;root.innerHTML=`<div class="toast">${ico('check',18)} ${esc(text)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{root.innerHTML='';},3400);}
function render(){document.title=save?`World Hoops | ${save.player.name}`:'World Hoops | Modo Carrera';$('#app').innerHTML=save?shell():landing();}
function runSimulation(n){requestMatchDecision('regular');}

function careerDecisionModal(){
 const p=CAREER.init(save).pending;
 if(!p)return '';
 const options=p.options.map((o,i)=>'<button type="button" class="decision-option" data-action="decide-game" data-choice="'+i+'"><span class="decision-num">0'+(i+1)+'</span><strong>'+esc(o.label)+'</strong><small>'+CAREER.estimate(save,o)+'% éxito</small><span class="decision-arrow">→</span></button>').join('');
 return '<div class="modal-backdrop decision-backdrop"><div class="modal-card decision-dialog" role="dialog" aria-modal="true" aria-label="Decisión del partido">'+
 '<div class="decision-eyebrow">WORLD HOOPS · TU PRÓXIMA DECISIÓN</div>'+
 '<div class="decision-context">'+esc(p.club)+' <span>VS</span> '+esc(p.rival)+'</div>'+
 '<div class="decision-mood"><strong>'+esc(p.day)+'</strong><p>'+esc(p.dayDesc)+'</p></div>'+
 '<h2>'+esc(p.prompt)+'</h2><p class="decision-help">Tus estadísticas, la energía y la preparación influyen en el resultado.</p>'+
 '<div class="decision-options">'+options+'</div>'+
 '<button type="button" class="btn ghost" data-action="close-modal">Volver</button></div></div>';
}
function trainingChoiceModal(skill){
 const name=skillName(skill);
 return '<div class="modal-backdrop decision-backdrop"><div class="modal-card decision-dialog" role="dialog" aria-modal="true" aria-label="Entrenamiento">'+
 '<div class="decision-eyebrow">CENTRO DE ENTRENAMIENTO</div><h2>¿Cómo quieres trabajar '+esc(name)+'?</h2>'+
 '<p class="decision-help">La intensidad puede mejorar más tu atributo, pero también te agota y aumenta el riesgo de lesión.</p>'+
 '<div class="decision-options">'+
 '<button type="button" class="decision-option" data-action="training-choice" data-skill="'+esc(skill)+'" data-method="intense"><strong>Entrenamiento intenso</strong><small>Progreso alto · mayor desgaste</small></button>'+
 '<button type="button" class="decision-option" data-action="training-choice" data-skill="'+esc(skill)+'" data-method="technical"><strong>Trabajo técnico</strong><small>Progreso equilibrado · desgaste moderado</small></button>'+
 '<button type="button" class="decision-option" data-action="training-choice" data-skill="'+esc(skill)+'" data-method="recovery"><strong>Sesión de recuperación</strong><small>Menor progreso · recuperas energía</small></button>'+
 '</div><button type="button" class="btn ghost" data-action="close-modal">Volver</button></div></div>';
}
function renderLife(){
 const c=CAREER.init(save);
 const items=CAREER.items.map(item=>{
  const owned=c.owned.includes(item.id);
  const symbol=item.stat==='shooting'?'target':item.stat==='defense'?'shield':item.stat==='athleticism'?'bolt':item.stat==='playmaking'?'activity':'spark';
  return '<article class="life-item"><div class="life-item-icon">'+ico(symbol,25)+'</div><h3>'+esc(item.name)+'</h3><p>'+esc(item.desc)+'</p>'+
   '<div class="life-item-bottom"><strong>'+money(item.price)+'</strong>'+
   '<button class="btn '+(owned?'outline':'primary')+' small" type="button" data-action="buy-life" data-id="'+esc(item.id)+'" '+(owned||c.cash<item.price?'disabled':'')+'>'+(owned?'Comprado':'Comprar')+'</button></div></article>';
 }).join('');
 const history=c.log.slice(0,5).map(h=>'<div class="life-history-row"><span>'+esc(h.day)+' · '+esc(h.club)+'</span><strong>'+esc(h.success?'Acertaste':'No salió')+'</strong></div>').join('')||'<p class="muted">Tu historia se está escribiendo en la cancha.</p>';
 return pageTitle('Mi estilo de vida','Invierte en tu carrera, recupera energía y toma decisiones fuera de la cancha.')+
 '<div class="life-wallet"><div><small>SALDO DISPONIBLE</small><strong>'+money(c.cash)+'</strong><p>Tu contrato te paga después de cada partido.</p></div><div><small>MEJORAS ADQUIRIDAS</small><strong>'+c.owned.length+' / '+CAREER.items.length+'</strong><p>Las mejoras te acompañan a cualquier equipo.</p></div></div>'+
 '<section class="panel"><div class="section-head"><div><div class="eyebrow">TU INVERSIÓN</div><h2>Entrenamiento, salud y estilo de vida</h2></div></div><div class="life-shop-grid">'+items+'</div></section>'+
 '<section class="panel"><div class="section-head"><div><div class="eyebrow">TU HISTORIA</div><h2>Últimas decisiones</h2></div></div>'+history+'</section>';
}
function requestMatchDecision(phase){
 if(!save)return;
 const w=save.world;
 if(phase==='regular'&&w.phase!=='regular')return;
 if(phase==='regular'&&CAREER.isTrainingDue(save)){
  CAREER.offerTraining(save);persist();showModal(weeklyTrainingModal());return;
 }
 if(phase==='playoffs'&&w.phase!=='playoffs')return;
 let target=null;
 if(phase==='regular'){
  const matches=w.rounds[w.week]||[];
  const myMatch=matches.find(m=>m.home===save.teamId||m.away===save.teamId);
  if(myMatch)target=myMatch.home===save.teamId?myMatch.away:myMatch.home;
 }else if(w.playoffs?.round===0){
  const seed=w.playoffs.seed||[];
  const pos=seed.indexOf(save.teamId);
  if(pos!==-1)target=seed[pos===0?3:pos===3?0:pos===1?2:1];
 }else if(w.playoffs?.round===1){
  const games=w.playoffs.semis||[];
  if(games.some(m=>m.winner===save.teamId))target=games.find(m=>m.winner!==save.teamId)?.winner;
 }
 if(!target||save.player.injury>0){
  if(phase==='regular'){const r=simulateWeek();persist();render();if(r)showModal(resultModal(r,'JORNADA '+save.world.week));}
  else{const r=simulatePlayoffRound();persist();render();if(r)showModal(resultModal(r.games?.find(x=>x.home===save.teamId||x.away===save.teamId)||null,r.stage));}
  return;
 }
 const career=CAREER.init(save);
 career.pregamePhase=phase;career.pregameOpponent=target;
 if(CAREER.needsPregame(save,phase)){
  CAREER.preparePregame(save,currentTeam(),club(target),phase);
  persist();showModal(pregameEventModal());return;
 }
 CAREER.prepare(save,currentTeam(),club(target),phase);
 persist();showModal(careerDecisionModal());
}
function chooseMatchDecision(index){
 if(!save||!save.career?.pending)return;
 const phase=save.career.pending.phase;
 const impact=CAREER.resolve(save,index);
 if(!impact)return;
 let result=null,details='';
 if(phase==='regular'){result=simulateWeek();details='JORNADA '+save.world.week;}
 else{
  const round=simulatePlayoffRound();
  if(round){result=round.games?.find(x=>x.home===save.teamId||x.away===save.teamId)||null;details=round.stage;}
 }
 addNews(impact.success?'¡Buena decisión!':'Aprender también es parte del juego',impact.action+' · '+impact.day+'. '+impact.details,'spark');
 persist();render();
 if(result)showModal(resultModal(result,details));
 else{closeModal();toast(impact.success?'¡Buena decisión!':'La siguiente jugada será mejor.');}
}

function exportSave(){const blob=new Blob([JSON.stringify(save,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`WorldHoops_${save.player.name.replace(/[^a-z\d]/gi,'_')}_Temporada${save.season}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('Partida exportada correctamente.');}
async function importSave(file){try{if(!file)return;if(file.size>2e6)throw Error('Archivo demasiado grande');const parsed=JSON.parse(await file.text());if(parsed.version!==1||!parsed.player||!parsed.world||!league(parsed.leagueId)||!club(parsed.teamId)||!Array.isArray(parsed.history))throw Error('Partida no compatible');save=parsed;CAREER.init(save);ui.tab='home';ui.browseContinent=league(save.leagueId).continent;ui.browseLeague=save.leagueId;persist();render();toast('Partida importada.');}catch(e){toast(`No se pudo importar: ${e.message}`);}}
document.addEventListener('submit',e=>{if(e.target.id==='career-form'){e.preventDefault();const form=new FormData(e.target);const fields=Object.fromEntries(form.entries());if(!fields.name||fields.name.trim().length<2)return toast('Escribe al menos 2 letras.');if(!league(fields.league)||!club(fields.team)||!club(fields.team).id.startsWith(fields.league+'-'))return toast('Selecciona un club válido.');createCareer(fields);}});
document.addEventListener('change',e=>{if(e.target.id==='career-league'){$('#career-team').innerHTML=clubList(e.target.value).map(c=>`<option value="${c.id}">${esc(c.name)}${c.affiliate?' · '+esc(shortName(c.affiliate)):''}</option>`).join('');}if(e.target.id==='save-import')importSave(e.target.files?.[0]);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;const act=el.dataset.action;
 if(act==='start-career'){showModal(createModal());return;}
 if(act==='landing-leagues'){showModal(landingLeaguesModal());return;}
 if(act==='close-modal'){if(el.classList.contains('modal-backdrop') && e.target!==el)return;closeModal();return;}
 if(act==='toggle-menu'){ui.menu=!ui.menu;render();return;}
 if(act==='nav'){ui.tab=el.dataset.tab;ui.menu=false;render();window.scrollTo(0,0);return;}
 if(!save)return;
 if(act==='go-market'||act==='go-stats'||act==='go-leagues'||act==='go-match'){ui.tab=act.slice(3)==='market'?'market':act.slice(3)==='stats'?'stats':act.slice(3)==='leagues'?'leagues':'match';render();window.scrollTo(0,0);return;}
 if(act==='sim-one'||act==='sim-three'||act==='sim-all'){runSimulation(act==='sim-one'?1:act==='sim-three'?3:save.world.rounds.length);return;}
 if(act==='sim-playoffs'){requestMatchDecision('playoffs');return;}
 if(act==='continent'){ui.browseContinent=el.dataset.continent;ui.browseLeague=DATA.leagues.find(l=>l.continent===ui.browseContinent)?.id||save.leagueId;render();return;}
 if(act==='choose-league'){ui.browseLeague=el.dataset.league;render();return;}
 if(act==='train'){showWeeklyTraining();return;}
 if(act==='training-card'){pickTrainingCard(el.dataset.card);return;}
 if(act==='training-rest'){restTrainingWeek();return;}
 if(act==='pregame-choice'){choosePregameEvent(Number(el.dataset.choice));return;}
 if(act==='decide-game'){chooseMatchDecision(Number(el.dataset.choice));return;}
 if(act==='go-life'){ui.tab='life';render();window.scrollTo(0,0);return;}
 if(act==='buy-life'){
  const item=CAREER.items.find(x=>x.id===el.dataset.id);
  if(!item)return;
  if(!window.confirm('¿Comprar '+item.name+' por '+money(item.price)+'?'))return;
  const r=CAREER.buy(save,item.id);
  if(!r.ok)return toast(r.message);
  addNews('Nueva inversión',r.message,'spark');
  persist();render();toast(r.message);return;
 }
 if(act==='sign'){const offer=save.offers?.find(o=>o.id===el.dataset.offer);if(offer&&window.confirm(`¿Firmar por ${shortName(offer.teamId)} en ${league(offer.leagueId).name} por ${money(offer.salary)} al año?`))nextSeason(offer);return;}
 if(act==='stay'){if(window.confirm('¿Renovar con tu club actual y comenzar otra temporada?'))nextSeason(null);return;}
 if(act==='export'){exportSave();return;}
 if(act==='import'){$('#save-import')?.click();return;}
 if(act==='reset'){if(window.confirm('¿Crear una carrera nueva? Tu partida actual se perderá si no la exportas antes.')){localStorage.removeItem(KEY);save=null;ui.tab='home';render();showModal(createModal());}return;}
});
render();
window.WorldHoopsDebug={getSave:()=>save,simulateWeek:()=>{simulateWeek();persist();render();},simulatePlayoffs:()=>{simulatePlayoffRound();persist();render();},createCareer};
})();
