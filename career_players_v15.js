/* V15 — world roster depth, stable profiles and match-day form. */
(function(){
'use strict';
const E=window.WH_CAREER,D=window.WH_DATA,V=window.WH_V6;
const raw=E.playerNames,hash=x=>[...String(x)].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261),rnd=x=>hash(x)/4294967296;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),uniq=x=>[...new Set(x)];
const pools={
 north:['Jordan,Marcus,Isaiah,Malik,Noah,Ethan,Jaylen,Tyler,Devin,Caleb,Adrian,Andre,Elijah,Isaac,Micah,Darius,Tristan,Lucas','Johnson,Reed,Brooks,Carter,Mitchell,Hayes,Grant,Walker,Price,Bennett,Ellis,Foster,Marshall,Collins,Morgan,Turner,James,Wright'],
 lat:['Mateo,Diego,Andrés,Javier,Nicolás,Emiliano,Santiago,Facundo,Lautaro,Tomás,Bruno,Juan,Matías,Luciano,Agustín,Valentín,Thiago,Martín','García,Ramírez,Silva,Torres,Medina,Morales,Castro,Navarro,Vega,Ortiz,Acosta,Rojas,Rivera,Romero,Reyes,Suárez,Pereira,Méndez'],
 brazil:['Lucas,Matheus,João,Pedro,Gabriel,Henrique,Arthur,Thiago,Bruno,Rafael,Diego,Felipe,Victor,Leonardo','Silva,Santos,Oliveira,Souza,Lima,Pereira,Costa,Almeida,Ribeiro,Rocha,Ferreira,Barbosa,Gomes,Cardoso'],
 france:['Mathis,Théo,Lucas,Noé,Enzo,Antoine,Maxime,Jules,Hugo,Louis,Amine,Malik,Axel,Clément','Moreau,Martin,Bernard,Petit,Robert,Durand,Leroy,Simon,Michel,Garcia,Lefebvre,Roux,David,Laurent'],
 germany:['Lukas,Jonas,Leon,Felix,Maximilian,Paul,Anton,Tim,Julian,David,Niklas,Emil,Tom,Moritz','Müller,Schmidt,Weber,Fischer,Wagner,Becker,Hoffmann,Schäfer,Koch,Richter,Wolf,Neumann,Schwarz,Zimmermann'],
 italy:['Lorenzo,Matteo,Andrea,Marco,Alessandro,Leonardo,Giovanni,Tommaso,Filippo,Simone,Davide,Riccardo','Rossi,Russo,Ferrari,Esposito,Bianchi,Romano,Colombo,Ricci,Marino,Greco,Bruno,Gallo'],
 turkey:['Emir,Kerem,Arda,Mert,Deniz,Efe,Can,Berk,Ali,Burak,Ömer,Onur','Yılmaz,Kaya,Demir,Şahin,Çelik,Yıldız,Yıldırım,Öztürk,Aydın,Arslan,Koç,Polat'],
 greece:['Nikos,Georgios,Dimitris,Ioannis,Kostas,Alexandros,Andreas,Petros,Christos,Manolis,Stavros','Papadopoulos,Georgiou,Nikolaou,Dimitriou,Ioannou,Christou,Karalis,Stavrou,Alexiou,Pappas,Markou'],
 japan:['Haruto,Yuto,Sota,Ren,Daiki,Shota,Kaito,Riku,Hayato,Takumi,Keita,Ryota','Sato,Suzuki,Takahashi,Tanaka,Ito,Watanabe,Yamamoto,Nakamura,Kobayashi,Kato,Yoshida,Yamada'],
 china:['Wei,Hao,Ming,Jie,Yu,Tao,Jun,Lei,Xin,Yang,Chen,Feng','Wang,Li,Zhang,Liu,Chen,Yang,Huang,Zhao,Wu,Zhou,Xu,Sun'],
 korea:['Min-jun,Ji-ho,Hyun-woo,Seo-jun,Do-yun,Jun-ho,Tae-hyun,Jae-min,Seung-ho,Ji-hun','Kim,Lee,Park,Choi,Jung,Kang,Cho,Yoon,Jang,Lim,Han,Shin'],
 philippines:['Miguel,Paolo,Joshua,Gabriel,Christian,Adrian,Mark,Jose,Daniel,Rafael,Andre,Francis','Santos,Reyes,Cruz,Garcia,Mendoza,Torres,Ramos,Flores,Castillo,Rivera,Del Rosario,Navarro'],
 arab:['Omar,Karim,Ali,Hassan,Ahmed,Youssef,Adam,Ziad,Amir,Samir,Tarek,Nabil','Haddad,Saleh,Mansour,Khalil,Saad,Hamdan,Nassar,Abbas,Farah,Kamel,Hassan,Mahmoud'],
 africa:['Amadou,Moussa,Ibrahim,Mamadou,Cheikh,Abdoulaye,Ousmane,Malick,Chidi,Emeka,Daniel,Samuel,David,Isaac','Diop,Ndiaye,Fall,Diallo,Ba,Sow,Traoré,Okafor,Okeke,Adeyemi,Mensah,Kamara,Koné,Abebe'],
 angola:['João,Paulo,Carlos,Manuel,Pedro,António,José,Miguel,André,Bruno,Edson','Mendes,Silva,Domingos,Manuel,Fernandes,Costa,Lopes,Cardoso,Moreira,Almeida']
};
const group=id=>({cibacopa:'lat',bsn:'lat',arg:'lat',uru:'lat',chi:'lat',col:'lat',acb:'lat',nbb:'brazil',france:'france',germany:'germany',italy:'italy',turkey:'turkey',greece:'greece',japan:'japan',china:'china',korea:'korea',philippines:'philippines',lebanon:'arab',egypt:'arab',angola:'angola',senegal:'africa',nigeria:'africa'})[id]||'north';
const clubs=new Map(Object.values(D.realTeams||{}).flat().map(t=>[t.id,t]));
function team(id){return clubs.get(id)||{id,name:id,rating:76};}
const valid=n=>typeof n==='string'&&n.trim().includes(' ')&&!/^(rotaci[oó]n|compañero|jugador|player|reserva|unknown|tbd)\s+\d+/i.test(n.trim());
// BBL 2026/27 reference: https://www.sportschau.de/live-und-ergebnisse/basketball/deutschland-bbl/ma12415816/ratiopharm-ulm_ewe-baskets-oldenburg/spiel-kader
const snapshots={"ewe baskets oldenburg":["Jeremy Roach","Nate Johnson","Zachary Ensminger","Ja'Qualyn Gilbreath","Oré Ewert","Djordje Klaric","Noah Wendland","Le'Tre Darthard","Kyle Gruhler","Johann Helwig","Seth Hinrichs","Lazar Klaric","Stefan Momirov","Tylan James Pope","Nicholas Tischler","Joel Harms","Marcel Keßen","Finn Stuehlmeyer","Demajeo Wiggins"],"ratiopharm ulm":["Christopher Anthony Jr.","Adam Atamna","Lucas Fischer","Marvin Heckel","Teo Milicic","Zoran Milicic","Namori Omog","Devin Schmidt","Jaylen Sims","Yanu Slingerland","Mohamed Diakite","Nil Failenschmid","Meissa Faye","Dwayne Koroma","Lenny Liedtke","Michael Rataj","Armel Traore","Ibi Watson","Juom Bol","Simisola Shittu"]};
const cache=new Map();
function roster(t){
 if(!t?.id)return [];
 if(cache.has(t.id))return cache.get(t.id);
 const source=snapshots[(clubs.get(t.id)?.name||t.name||'').toLowerCase()]||raw(t)||[];
 const original=uniq(source.filter(valid).map(n=>n.trim())),names=[...original];
 const l=t.id.split('-').slice(0,-1).join('-'),g=group(l),[first,last]=pools[g].map(x=>x.split(','));
 for(let i=0;names.length<12&&i<300;i++){const a=first[hash(t.id+'f'+i)%first.length],b=last[hash(t.id+'l'+i)%last.length],n=['china','korea'].includes(g)?b+' '+a:a+' '+b;if(!names.includes(n))names.push(n);}
 const out=names.map((name,i)=>({name,reference:original.includes(name),role:i<5?'Titular':i<10?'Rotación':'Reserva',position:['PG','SG','SF','PF','C'][i%5],rating:clamp((t.rating||D.leagues.find(lg=>lg.id===l)?.quality||76)+4-i*.9+Math.round(rnd(name+t.id)*6-3),48,98)}));
 cache.set(t.id,out);return out;
}
E.playerNames=t=>roster(t).map(p=>p.name);
const baseCore=V.core;
V.core=function(s){const v=baseCore(s);return v;};
function record(s,id,name,week){
 const games=(s.world.results||[]).filter(g=>g.week<week&&(g.home===id||g.away===id)).slice(-5);
 return games.map(g=>decode(g,id)?.find(p=>p.name===name)||g.boxScore?.[id]?.find(p=>p.name===name)).filter(p=>p&&!p.dnp);
}
function profile(s,id,name,week){
 const list=roster(team(id)),p=list.find(x=>x.name===name)||{name,role:'Rotación',position:'SG',rating:70,reference:false};
 const past=record(s,id,name,week),recent=past.slice(-3),avg=recent.length?recent.reduce((a,g)=>a+g.pts,0)/recent.length:0,base=Math.max(4,(p.rating-40)*.35),form=recent.length?clamp(50+(avg-base)*2.2,20,90):50+Math.round((rnd(id+name+s.season+'form')-.5)*16);
 const seed=[s.season,id,name,week].join('|'),prev=past.at(-1),locker=id===s.teamId?V.core(s).players[name]:null;
 const energy=clamp(Math.round((locker?.energy??(85-rnd(seed+'energy')*16))*.7+(prev?clamp(102-prev.min*.5,65,98):87)*.3),30,100);
 const morale=clamp(locker?.morale??(60+Math.round(rnd(seed+'morale')*28)),0,100);
 const physical=energy<48?'Fatigado':energy<67?'Cansado':'Disponible';
 const help=id===s.teamId?s.career?.v12Help:null,boost=help?.ok&&help.name===name?help.boost:0;
 return {...p,form:Math.round(form),energy,morale,physical,streak:form>=64?'En racha':form<=38?'Racha fría':'Estable',avg:recent.length?Math.round(avg*10)/10:null,boost};
}
const fields=['name','pts','reb','ast','stl','blk','threes','tov','min','energy','form','morale'];
function encode(rows){return rows.map(p=>fields.map(k=>p[k]??null));}
function decode(g,id){const rows=g.boxV15?.[id];return rows?.map(a=>Object.fromEntries(fields.map((k,i)=>[k,a[i]])))||null;}
function preview(s,id,week){return roster(team(id)).filter(p=>id!==s.teamId||p.name!==s.player.name).map(p=>profile(s,id,p.name,week));}
function box(s,g,id,line=null){
 const saved=decode(g,id);if(saved)return saved;
 const existing=g.boxScore?.[id];if(existing)return existing;
 const score=id===g.home?g.hs:g.as,all=preview(s,id,g.week),help=line?.teammateBoost;
 const players=all.length<=12?all:all.slice(0,8).concat(Array.from({length:4},(_,i)=>all[8+((g.week-1)*4+i)%(all.length-8)]));
 if(help?.ok&&!players.some(p=>p.name===help.name)){const target=all.find(p=>p.name===help.name);if(target)players[players.length-1]=target;}
 const remain=Math.max(0,score-(!line?.dnp&&line?line.pts:0));
 const seed=[s.season,g.stage,g.week,id].join(':');
 const rows=players.map((p,i)=>{
  const h=help?.ok&&help.name===p.name?help:null,noise=.68+rnd(seed+p.name+'w')*.67,
   formFactor=.75+p.form/200,fitness=.55+p.energy/220,mood=.8+p.morale/400,
   weight=Math.max(.15,(p.rating-40)*(i<5?1.42:i<10?1:.58)*formFactor*fitness*mood*noise*(h?1.12:1));
  return {...p,weight,extra:h};
 });
 const weights=rows.reduce((a,p)=>a+p.weight,0)||1;
 let used=0;const result=rows.map(p=>{const exact=remain*p.weight/weights,pts=Math.floor(exact);used+=pts;const key=seed+p.name;
  const min=clamp(Math.round((p.role==='Titular'?30:p.role==='Rotación'?19:10)*(.65+p.energy/230)+rnd(key+'m')*7+(p.extra?2:0)),3,40);
  const factor=(min/25)*(.7+p.form/170)*(.65+p.energy/220);
  const roll=(k,b)=>Math.max(0,Math.round((b*.6+rnd(key+k)*b*.8)*factor));
  const row={name:p.name,pts,reb:roll('r',['PF','C'].includes(p.position)?8:4),ast:roll('a',['PG','SG'].includes(p.position)?5:2.4),stl:roll('s',1.4),blk:roll('b',p.position==='C'?1.6:.6),threes:0,tov:roll('t',2),min,energy:p.energy,form:p.form,morale:p.morale,frac:exact-pts};
  if(p.extra&&['ast','reb','stl','blk'].includes(p.extra.stat))row[p.extra.stat]+=p.extra.boost||0;
  return row;
 });
 const order=[...result].sort((a,b)=>b.frac-a.frac);for(let i=0;i<remain-used&&order.length;i++)order[i%order.length].pts++;
 for(const p of result){p.threes=Math.min(Math.floor(p.pts/3),Math.round(rnd(seed+p.name+'3')*Math.min(5,p.min/6)));delete p.frac;}
 if(line&&!line.dnp)result.unshift({...line,name:s.player.name});
 return result;
}
function commit(s,g,id,line){const rows=box(s,g,id,line);g.boxV15??={};g.boxV15[id]=encode(rows);return rows;}
function recover(s,g){const own=g.boxV15?.[s.teamId];if(!own)return;const v=V.core(s);for(const p of decode(g,s.teamId)){const x=v.players[p.name];if(!x)continue;x.energy=clamp(x.energy+7-Math.round(p.min*.24),30,100);x.morale=clamp(x.morale+(g.winner===s.teamId?2:-2),0,100);}}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function status(p){return '<span class="wh15-player-state"><b>'+esc(p.streak)+'</b><small>'+esc(p.physical)+' · Energía '+p.energy+'% · Forma '+p.form+'%</small><span class="wh15-meter"><i style="width:'+p.energy+'%"></i></span></span>';}
function teamPanel(s){const week=s.world.phase==='regular'?s.world.week+1:s.world.rounds.length+1+(s.world.playoffs?.round||0);
 return '<section class="panel wh15-roster"><div class="eyebrow">VESTUARIO · INFORME DE RENDIMIENTO</div><h2>Estado de la plantilla</h2><div class="wh15-roster-grid">'+preview(s,s.teamId,week).map(p=>'<article><div class="wh15-player-avatar">'+esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join(''))+'</div><div><b>'+esc(p.name)+'</b><small>'+p.position+' · '+p.role+' · NVL '+p.rating+'</small>'+status(p)+(p.avg!==null?'<small>Últimos partidos: '+p.avg+' PTS</small>':'')+'</div></article>').join('')+'</div></section>';}
window.WH_V15={roster,profile,preview,box,commit,decode,recover,status,teamPanel};
})();
