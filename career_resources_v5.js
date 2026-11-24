/* WORLD HOOPS V5 — Plantillas y escudos de baloncesto verificados cuando la fuente los ofrece.
 * No reemplaza imágenes locales. No rellena huecos con nombres/logos inventados.
 * Fuente externa opcional: TheSportsDB API, base de datos comunitaria. */
(function(){
'use strict';
const D=window.WH_DATA,E=window.WH_CAREER;
if(!D||!E)return;
const API='https://www.thesportsdb.com/api/v1/json/123/';
const STORAGE='wh_verified_clubs_v5';
const scores={};
let memo={},loaded=false;
try{memo=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};loaded=true;}catch{memo={};}
const simplify=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(bc|b\.c\.|basketball|basquetbol|basquet|basket|club|baloncesto|team|the)\b/g,' ').replace(/[^a-z0-9]/g,'').trim();
function matchName(team,hit){
 const name=simplify(team.name),other=simplify(hit.strTeam);
 if(name.length<5||other.length<5)return false;
 if(name===other)return true;
 const alt=[hit.strTeamAlternate,hit.strAlternate,hit.strTeamShort,hit.strKeywords].filter(Boolean).flatMap(v=>v.split(/[;|,]/g)).map(simplify);
 if(alt.includes(name))return true;
 const shorter=name.length<other.length?name:other,longer=name.length>=other.length?name:other;
 // Coincidencia de nombre significativa, no solo ciudad o apodo común.
 return shorter.length>=12&&longer.length-shorter.length<=9&&longer.startsWith(shorter);
}
function isBasketball(hit){return String(hit?.strSport||'').toLowerCase()==='basketball'}
function safeImage(url){
 return typeof url==='string'&&/^https:\/\/(?:r2\.thesportsdb\.com|www\.thesportsdb\.com|thesportsdb\.com|cdn\.thesportsdb\.com)(?:\/|$)/i.test(url)?url:null;
}
function cacheWrite(){
 try{localStorage.setItem(STORAGE,JSON.stringify(memo));}catch{}
}
function notify(){
 if(typeof window.dispatchEvent==='function'&&typeof CustomEvent==='function')window.dispatchEvent(new CustomEvent('worldhoops:resources'));
}
function rawTeam(id){
 const leagueId=id?.split('-').slice(0,-1).join('-');
 return D.realTeams?.[leagueId]?.find(t=>t.id===id)||null;
}
function applyCached(id){
 const team=rawTeam(id),entry=memo[id];
 if(!team||!entry)return;
 if(!team.logo&&entry.logo)team.logo=entry.logo;
 if(Array.isArray(entry.players)&&entry.players.length&&(!Array.isArray(team.players)||!team.players.length))team.players=[...entry.players];
}
for(const id of Object.keys(memo))applyCached(id);
const inProgress=new Map();
const fetchJson=async url=>{
 const res=await fetch(url,{headers:{Accept:'application/json'},mode:'cors',credentials:'omit'});
 if(!res.ok)throw Error('Servidor '+res.status);
 return await res.json();
};
async function loadTeam(team,force=false){
 if(!team||!rawTeam(team.id))return {ok:false};
 if(typeof fetch!=='function')return {ok:false,reason:'Sin conexión de datos'};
 if(!force&&memo[team.id]&&Date.now()-memo[team.id].timestamp<1000*60*60*24*45){
  applyCached(team.id);return {ok:true,cached:true,players:memo[team.id].players?.length||0,logo:!!memo[team.id].logo};
 }
 if(inProgress.has(team.id))return inProgress.get(team.id);
 const job=(async()=>{
  try{
   const candidate=await fetchJson(API+'searchteams.php?t='+encodeURIComponent(team.name));
   const hits=(candidate.teams||[]).filter(h=>isBasketball(h)&&matchName(team,h));
   const match=hits.find(h=>h.strTeam&&simplify(h.strTeam)===simplify(team.name))||hits[0];
   if(!match?.idTeam)return {ok:false,reason:'No confirmado'};
   let players=[];
   try{
    const roster=await fetchJson(API+'lookup_all_players.php?id='+encodeURIComponent(match.idTeam));
    players=(roster.player||roster.players||[]).filter(p=>p&&p.strPlayer&&(!p.strSport||isBasketball(p))&&(!p.idTeam||String(p.idTeam)===String(match.idTeam))).map(p=>p.strPlayer.trim()).filter(Boolean);
    players=[...new Set(players)].slice(0,22);
   }catch{}
   const logo=safeImage(match.strBadge||match.strTeamBadge||match.strLogo);
   const value={logo,players,timestamp:Date.now(),source:'TheSportsDB',matchedName:match.strTeam};
   memo[team.id]=value;applyCached(team.id);cacheWrite();notify();
   return {ok:true,players:players.length,logo:!!logo};
  }catch(err){return {ok:false,reason:String(err.message||err)};}
 })();
 inProgress.set(team.id,job);
 try{return await job}finally{inProgress.delete(team.id)}
}
const progress={};
async function loadLeagueLogo(l){
 if(l.logo||typeof fetch!=='function')return;
 const country=l.country==='EE. UU.'?'United States':l.country||'';
 if(!country)return;
 try{
  const response=await fetchJson(API+'search_all_leagues.php?c='+encodeURIComponent(country)+'&s=Basketball');
  const options=(response.countrys||response.leagues||[]).filter(x=>isBasketball(x)&&simplify(x.strLeague)===simplify(l.name));
  const item=options[0],logo=safeImage(item?.strBadge||item?.strTeamBadge||item?.strLogo);
  if(logo){l.logo=logo;notify();}
 }catch{}
}
async function hydrateLeague(id,force=false){
 const l=D.leagues.find(x=>x.id===id);if(!l)return {error:'Liga no disponible'};
 if(progress[id]?.running)return progress[id];
 const clubs=D.realTeams?.[id]||[];
 const p=progress[id]={running:true,checked:0,total:clubs.length,foundBadges:0,foundPlayers:0,failed:0,startedAt:Date.now()};
 notify();
 // Parejas de solicitudes para respetar las limitaciones del servicio público.
 let offset=0;const workers=Array.from({length:2},async()=>{
  while(offset<clubs.length){
   const team=clubs[offset++];
   const result=await loadTeam(team,force);
   p.checked++;if(result.logo)p.foundBadges++;if(result.players)p.foundPlayers++;if(!result.ok)p.failed++;
   notify();
  }
 });
 await Promise.all(workers);
 await loadLeagueLogo(l);
 p.running=false;p.finished=true;notify();return p;
}
const oldPlayerNames=E.playerNames;
E.playerNames=function(team){
 if(!team)return [];
 // Plantillas NBA de referencia preexistentes con identificación específica.
 if(team.id?.startsWith('nba-'))return oldPlayerNames(team);
 const t=rawTeam(team.id)||team;
 return Array.isArray(t.players)&&t.players.length?[...t.players]:oldPlayerNames(team);
};
window.WH_RESOURCES={hydrateLeague,loadTeam,progress,applyCached,roster:E.playerNames,
 coverage:(id)=>{const clubs=D.realTeams?.[id]||[];return {teams:clubs.length,logos:clubs.filter(t=>!!t.logo).length,players:clubs.filter(t=>Array.isArray(t.players)&&t.players.length).length}},source:'TheSportsDB'};
})();
