/* V9.3: team-ID keyed roster snapshots; no abbreviation collisions. */
(function(){const E=window.WH_CAREER,D=window.WH_DATA,R=window.WH_ROSTERS_V93||{},old=E.playerNames;
for(const [league,clubs] of Object.entries(D.realTeams))for(const t of clubs){if(!Object.hasOwn(R,t.id))continue;t.players=[...new Set(R[t.id])];t.rosterSeason=league==='gleague'?'2026–27 (8 nov. 2026)':'2026 (participantes de temporada)';}
E.playerNames=function(t){if(!t)return [];if(Object.hasOwn(R,t.id))return [...new Set(R[t.id])];return old(t);};
})();