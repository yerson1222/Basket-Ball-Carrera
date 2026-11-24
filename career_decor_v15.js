/* Decorative broadcast motifs. No gameplay state is modified. */
(function(){
'use strict';
const sections={
 match:['MATCHDAY','CENTRO DE PARTIDOS','M3 3h18v18H3zM12 3v18M3 12h18M3 7a5 5 0 0 1 0 10M21 7a5 5 0 0 0 0 10'],
 home:['CAREER HQ','TU CARRERA','M3 10l9-7 9 7v11h-7v-7h-4v7H3z'],
 stats:['PLAYER LAB','DESARROLLO DEPORTIVO','M12 3a5 5 0 1 0 0 10 5 5 0 1 0 0-10M3 22v-3a9 9 0 0 1 18 0v3'],
 team:['LOCKER ROOM','INFORME DEL VESTUARIO','M8 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8m8 0a4 4 0 1 0 0 8M1 22v-4a7 7 0 0 1 14 0v4m3-8a5 5 0 0 1 5 5v3'],
 life:['LIFESTYLE','PATRIMONIO Y ADQUISICIONES','M3 7h18l-2 14H5zM8 7V4a4 4 0 0 1 8 0v3'],
 leaders:['LEAGUE DATA','LÍDERES Y RENDIMIENTO','M3 21h19M6 19v-8m5 8V4m5 15v-5m5 5V7'],
 international:['WORLD TOUR','COMPETICIONES INTERNACIONALES','M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20M2 12h20M12 2a14 14 0 0 1 0 20 14 14 0 0 1 0-20'],
 sponsors:['COMMERCIAL','MARCAS Y CONTRATOS','M2 8l5-5 5 3 4-3 6 5-4 9-6 4-9-8zm5 1 5 5 3-2 4 4'],
 odds:['SPORTSBOOK','MERCADOS DEL ENCUENTRO','M2 5h20v5a3 3 0 0 0 0 6v5H2v-5a3 3 0 0 0 0-6zM15 5v3m0 3v3m0 3v4'],
 casino:['PRIVATE CLUB','MESAS DE JUEGO','M5 2h14l3 3v14l-3 3H5l-3-3V5zM7 7h.1M17 7h.1M12 12h.1M7 17h.1M17 17h.1'],
 leagues:['GLOBAL BASKETBALL','DIRECTORIO DE CLUBES','M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20M2 12h20M12 2v20M5 5l14 14'],
 market:['TRANSFER WINDOW','MERCADO DE FICHAJES','M2 7h19l-5-5m5 5-5 5m6 5H3l5-5m-5 5 5 5'],
 legacy:['HALL OF FAME','HISTORIA DE TU CARRERA','M7 3h10v8a5 5 0 0 1-10 0zM7 6H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v5m-5 0h10'],
 integrity:['LEAGUE OFFICE','INTEGRIDAD DEPORTIVA','M12 2l9 4v7c0 4-4 7-9 9-5-2-9-5-9-9V6zM7 12l3 3 7-7']
};
function apply(root,tab,s){
 const page=root.querySelector('.page-content'),head=page?.querySelector('.page-header'),def=sections[tab];if(!page||!head||!def)return;
 page.classList.add('wh15-page');page.dataset.section=tab;
 const mark=root.createElement('div');mark.className='wh15-watermark';mark.setAttribute('aria-hidden','true');mark.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="'+def[2]+'"/></svg>';head.appendChild(mark);
 const strip=root.createElement('div');strip.className='wh15-section-strip';const brand=root.createElement('strong');brand.textContent=def[0];const label=root.createTextNode(def[1]);const season=root.createElement('span');season.textContent='TEMPORADA '+s.year;strip.append(brand,label,season);head.after(strip);
}
window.WH_V15_DECOR={apply};
})();
