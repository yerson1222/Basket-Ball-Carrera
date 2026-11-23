/* World Hoops 2026-27: tema de club, confianza, popularidad y avisos. */
(function(){
'use strict';
const E=window.WH_CAREER;
const ALT={ATL:'#ffcd00',BOS:'#ba9653',BKN:'#f6f7fa',CHA:'#1d1160',CHI:'#e1e1e1',CLE:'#860038',DAL:'#002b5e',DEN:'#fec524',DET:'#006bb6',GSW:'#ffc72c',HOU:'#f5f5f5',IND:'#fdbb30',LAC:'#c8102e',LAL:'#fdb927',MEM:'#5d76a9',MIA:'#f9a01b',MIL:'#00471b',MIN:'#236192',NOP:'#b4975a',NYK:'#f58426',OKC:'#ef3b24',ORL:'#0077c0',PHI:'#ed174c',PHX:'#e56020',POR:'#e03a3e',SAC:'#5a2d81',SAS:'#c4ced4',TOR:'#eb253b',UTA:'#f9a01b',WAS:'#002b5c'};
function hex(s){return /^#[0-9a-f]{6}$/i.test(s||'')?s.toLowerCase():'#8de1ed'}
function rgb(s){s=hex(s);return [1,3,5].map(n=>parseInt(s.slice(n,n+2),16))}
function mix(a,b,weight){const x=rgb(a),y=rgb(b);return '#'+x.map((v,i)=>Math.round(v*(1-weight)+y[i]*weight).toString(16).padStart(2,'0')).join('')}
function theme(doc,team){
 const primary=hex(team?.color||'#c8fa5b'),v=rgb(primary),brightness=v[0]*.2126+v[1]*.7152+v[2]*.0722;
 const accent=brightness<105?mix(primary,'#ffffff',.45):brightness>220?mix(primary,'#bce1f2',.14):primary;
 const secondary=hex(ALT[team?.abbr]||mix(primary,'#eaf4fb',.56));
 const list={'--club-primary':primary,'--club-secondary':secondary,'--club-accent':accent,'--club-bright':mix(primary,'#ffffff',.7),'--lime':accent,'--lime2':mix(accent,'#ffffff',.25)};
 if(doc.documentElement?.style?.setProperty)Object.entries(list).forEach(([k,val])=>doc.documentElement.style.setProperty(k,val));
 return list;
}
function available(s){
 if(!s)return {training:false,shop:false};
 const c=E.init(s);
 return {training:E.isTrainingDue(s),shop:E.items.some(x=>!c.owned.includes(x.id)&&c.cash>=x.price)};
}
function badge(s,tab){
 const r=available(s),on=(tab==='stats'&&r.training)||(tab==='life'&&r.shop);
 return on?'<span class="wh-upgrade-badge" title="Mejora disponible" aria-label="Mejora disponible">✦</span>':'';
}
function upgrades(s){
 const r=available(s);if(!r.training&&!r.shop)return '';
 const parts=[];
 if(r.training)parts.push('<button class="wh-upgrade-notice" type="button" data-action="go-stats"><span class="wh-upgrade-symbol">✦</span><strong>Entrenamiento disponible</strong><small>Elige tu carta semanal</small></button>');
 if(r.shop)parts.push('<button class="wh-upgrade-notice" type="button" data-action="go-life"><span class="wh-upgrade-symbol">✦</span><strong>Mejora disponible</strong><small>Visita tu tienda personal</small></button>');
 return '<div class="wh-improvement-strip">'+parts.join('')+'</div>';
}
function role(s){
 const c=E.initWorld(s),value=Math.round(c.coachTrust),name=E.roleStatus(s),last=c.roleHistory?.[0],low=value<23;
 const delta=last?(last.delta>=0?'+':'')+last.delta.toFixed(1)+' tras el último partido':'Tus actuaciones decidirán tu titularidad';
 return '<section class="wh-role-card"><div class="wh-role-top"><div><span>CONFIANZA DEL ENTRENADOR</span><h3>'+name+'</h3></div><strong>'+value+'/100</strong></div>'+
 '<div class="wh-role-track" role="progressbar" aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="100" aria-label="Confianza del entrenador"><div class="wh-role-fill'+(low?' risk':'')+'" style="width:'+value+'%"></div><i class="mark23"></i><i class="mark56"></i></div>'+
 '<div class="wh-role-labels"><span>RESCISIÓN</span><span>SUPLENTE</span><span>TITULAR</span></div>'+
 '<p>'+delta+(low?' · Sin mejorar, el club podría no renovarte.':'')+'</p></section>';
}
function popularity(s){
 const value=Math.round(E.initWorld(s).popularity);
 return '<div class="wh-popularity"><div><span>POPULARIDAD</span><strong>'+value+'/100</strong></div>'+
 '<div class="wh-popularity-track"><div style="width:'+value+'%"></div></div>'+
 '<small>Más seguidores y grandes actuaciones te abren puertas a otros clubes.</small></div>';
}
window.WH_UI={theme,available,badge,upgrades,role,popularity};
})();
