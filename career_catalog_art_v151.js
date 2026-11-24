/* Item-specific offline catalogue illustrations. These are not photographs. */
(function(){
'use strict';
const symbols=[
 Array(25).fill('🚘'),Array(8).fill('🏍️'),
 ['🏢','🛋️','🏙️','🏡','🏘️','🏙️','🏔️','🏖️','🏰','🏡','🏊','🏞️'],
 ['👟','🤵','🧥','🧥','🥋','👟','🧳','🕶️','👕','🥾'],
 ['⌚','⌚','⌚','📿','📿','💍','💎','⌚','⌚','💎'],
 ['🏀','🏋️','🏃','🚴','⛹️','🏀','🏀','📊','🏀','🛡️'],
 ['💆','🩺','❄️','🥗','🦵','🛏️','🧘','🏊','🦿','🧠'],
 ['💻','📱','📷','🎮','📺','🎙️','🎧','⌚','🏎️','🎛️'],
 ['🏔️','🗼','🏝️','⛩️','🦒','🚢','🗽','🏙️','🏛️','🏝️'],
 ['☕','🍽️','🏀','🏀','🏋️','👔','🎬','🏢','💻','🩺'],
 ['👨‍🍳','🚗','🤝','🗂️','🛡️','🏋️','📱','👔','🧮','📷'],
 ['🎬','🎛️','🖼️','🎤','🎮','🎱','🎸','⛳','🏛️','🎵']
];
const original={gym:'🏋️',chef:'👨‍🍳',trainer:'🏀',shooting:'🏀',physio:'🩺',sleep:'🛏️',nutrition:'🥗',film:'📊',coachdef:'🛡️',massage:'💆',shoes:'👟',basket:'🏀',mind:'🧠',recovery:'🏊',academy:'🏀',travel:'✈️',sports_car:'🚘',luxury_car:'🚘',personal_driver:'🚗',penthouse:'🏙️',image_agent:'🤝',streaming_room:'🎙️',family_trip:'🏝️',charity_foundation:'🤝',private_court:'🏀',sports_psychologist:'🧠'};
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette=['#97b6d8','#a3b8aa','#d7af80','#ba9cdb','#d9c38b','#77b9cc','#83bfba','#9ba6d8','#8fc6ce','#bda58c','#a7adc3','#c69cae'];
const shapes={
 'travel suitcase':'<rect x="64" y="37" width="112" height="97" rx="13" fill="currentColor"/><path d="M104 37V19h32v18M80 50v71m80-71v71" fill="none" stroke="#172332" stroke-width="6"/><circle cx="81" cy="138" r="7" fill="#172332"/><circle cx="159" cy="138" r="7" fill="#172332"/>',
 'racing simulator cockpit':'<path d="M58 137h138M76 136l24-73m68 73-18-48m-65 30h62" stroke="currentColor" stroke-width="7" fill="none"/><path d="M99 83l-20-42-15 5 12 52h49l12-15z" fill="#aeb9c9"/><rect x="143" y="17" width="79" height="43" rx="4" fill="#152031" stroke="currentColor" stroke-width="5"/><path d="M155 48l22-19 29 19" fill="none" stroke="#80c4e2" stroke-width="3"/><circle cx="145" cy="76" r="17" fill="#172332" stroke="currentColor" stroke-width="5"/><path d="M132 76h26m-13 0v15" stroke="currentColor" stroke-width="3"/>',
 'sports recovery compression boots':'<g fill="currentColor" stroke="#1b2a3e" stroke-width="3"><path d="M65 20h39l-1 76 15 23v15H66q-12 0-12-10l11-34z"/><path d="M136 20h39l-1 76 15 23v15h-52q-12 0-12-10l11-34z"/></g><path d="M64 44h39M61 65h42M58 86h45m32-42h39m-42 21h42m-45 21h45" stroke="#e0e6ee" stroke-width="3"/>',
 'hydrotherapy pool':'<rect x="25" y="39" width="190" height="87" rx="20" fill="#a4b7c8"/><rect x="34" y="47" width="172" height="70" rx="14" fill="#4b9bc4"/><path d="M46 66q13-10 26 0t26 0 26 0 26 0 26 0M46 88q13-10 26 0t26 0 26 0 26 0 26 0" stroke="#d0eff8" fill="none" stroke-width="3"/><path d="M170 73V24q0-12 10-12t10 12v49m-20-26h20m-20 13h20" fill="none" stroke="#e2e8ef" stroke-width="4"/>',
 'sports biomechanics laboratory':'<circle cx="95" cy="27" r="12" fill="currentColor"/><path d="M95 43l13 45 29 33m-29-33-36 33m25-69 35 9 25-22M98 52l-40 24" stroke="currentColor" stroke-linecap="round" stroke-width="9" fill="none"/><g fill="#75e0cf"><circle cx="95" cy="43" r="4"/><circle cx="108" cy="88" r="4"/><circle cx="132" cy="61" r="4"/><circle cx="72" cy="121" r="4"/></g><rect x="162" y="35" width="55" height="53" rx="4" fill="#172332" stroke="#90acc4" stroke-width="3"/><path d="M169 75l11-13 10 6 17-22" fill="none" stroke="#75e0cf" stroke-width="3"/>',
 'sports psychology consultation':'<rect x="27" y="87" width="78" height="46" rx="12" fill="currentColor"/><rect x="139" y="87" width="74" height="46" rx="12" fill="#8ca3bb"/><circle cx="66" cy="41" r="15" fill="#d6b291"/><circle cx="175" cy="41" r="15" fill="#c7a280"/><path d="M42 90V69q24-25 48 0v21M151 90V69q24-25 48 0v21" fill="#4b607d"/><path d="M104 18h49v30h-17l-12 11V48h-20z" fill="#e1e9f3"/><path d="M115 32h26" stroke="#617b99" stroke-width="3"/>',
 'sports wristwatch':'<rect x="100" y="6" width="40" height="138" rx="10" fill="#546779"/><circle cx="120" cy="75" r="39" fill="currentColor"/><circle cx="120" cy="75" r="32" fill="#152233"/><path d="M92 80l13-12 11 8 18-22 15 10" fill="none" stroke="#8ce1b0" stroke-width="4"/><text x="120" y="94" text-anchor="middle" font-size="10" fill="#eaf3f8">GPS</text>',
 'gold chain necklace':'<path d="M48 17C36 75 75 137 120 137S204 75 192 17" fill="none" stroke="#d5b564" stroke-width="13" stroke-dasharray="7 3"/><path d="M48 17C36 75 75 137 120 137S204 75 192 17" fill="none" stroke="#ffe8a7" stroke-width="3" stroke-dasharray="7 3"/>',
 'bracelet jewelry':'<ellipse cx="120" cy="74" rx="70" ry="35" fill="none" stroke="currentColor" stroke-width="18" stroke-dasharray="10 4"/><ellipse cx="120" cy="74" rx="70" ry="35" fill="none" stroke="#eaf3fa" stroke-width="4" stroke-dasharray="8 6"/>',
 'billiard table':'<path d="M35 37h170l21 70H14z" fill="#7b5237" stroke="#d0af85" stroke-width="6"/><path d="M43 46h154l13 51H30z" fill="#277c62"/><g fill="#122322"><circle cx="43" cy="46" r="6"/><circle cx="120" cy="46" r="5"/><circle cx="197" cy="46" r="6"/><circle cx="30" cy="97" r="6"/><circle cx="120" cy="97" r="5"/><circle cx="210" cy="97" r="6"/></g><g fill="#f4d36d"><circle cx="103" cy="65" r="4"/><circle cx="116" cy="75" r="4"/><circle cx="128" cy="64" r="4"/></g><circle cx="151" cy="80" r="4" fill="#fff"/><path d="M31 110v26m178-26v26" stroke="#916747" stroke-width="9"/>',
 'home cinema theater':'<rect x="35" y="13" width="170" height="84" rx="5" fill="#111d2d" stroke="currentColor" stroke-width="5"/><path d="M44 77l55-40 43 37 31-24 23 27v10H44z" fill="#678ca6"/><g fill="#805a59" stroke="#c2918b" stroke-width="2"><rect x="23" y="99" width="60" height="37" rx="9"/><rect x="90" y="99" width="60" height="37" rx="9"/><rect x="157" y="99" width="60" height="37" rx="9"/></g>',
 'basketball shooting machine':'<path d="M144 14h72v44h-72z" fill="#b8cbd7" stroke="#e2ecf2" stroke-width="3"/><ellipse cx="180" cy="59" rx="25" ry="6" fill="none" stroke="#eb9d68" stroke-width="5"/><path d="M155 61l10 29h30l10-29m-44 0 29 29m8-29-30 29" stroke="#e1e5ed" fill="none" stroke-width="2"/><path d="M33 113l38-36h49l30 36v20H33z" fill="currentColor"/><path d="M84 76V60m16 16V60" stroke="#9caec1" stroke-width="5"/><circle cx="94" cy="48" r="15" fill="#df9348" stroke="#724b29" stroke-width="2"/>',
 'limited edition sneakers':'<path d="M26 100l20-28 15-42h32l10 32 32 21 48 12 30 17-3 15H30z" fill="currentColor" stroke="#e4ecf6" stroke-width="3"/><path d="M29 115h180v13H29z" fill="#e9edf1"/><path d="M64 51l33 5m-37 6 39 6m-42 5 52 9" stroke="#354963" stroke-width="4" stroke-linecap="round"/>',
 'graphic t-shirt':'<path d="M83 18l-45 18-28 34 34 22 18-18v64h116V74l18 18 34-22-28-34-45-18q-15 26-37 26T83 18z" fill="currentColor" stroke="#e1e9f0" stroke-width="2"/><circle cx="120" cy="83" r="24" fill="#152435"/><text x="120" y="91" fill="#d9c29c" font-size="22" text-anchor="middle" font-weight="800">WH</text>',
 'bespoke suit':'<path d="M79 15l-41 24-18 99h54l12-56 34 43 34-43 12 56h54l-18-99-41-24-41 56z" fill="currentColor" stroke="#d6e2ec" stroke-width="2"/><path d="M79 15l41 56 41-56-17 56-24 54-24-54z" fill="#e2e8ef"/><path d="M115 45h10l4 43-9 12-9-12z" fill="#26364d"/>',
 'healthy nutrition meal':'<ellipse cx="120" cy="76" rx="83" ry="59" fill="#e5ebee"/><ellipse cx="120" cy="76" rx="70" ry="47" fill="#b6c7cf"/><g fill="#68a968"><circle cx="82" cy="64" r="18"/><circle cx="99" cy="50" r="12"/><circle cx="86" cy="88" r="13"/><circle cx="110" cy="93" r="12"/></g><path d="M126 45q36-10 48 22t-30 36q-27-7-18-58z" fill="#c6945a"/><path d="M132 57l34 20m-37-8 31 19" stroke="#89613e" stroke-width="3"/><g fill="#d66c53"><circle cx="110" cy="70" r="7"/><circle cx="65" cy="78" r="6"/><circle cx="105" cy="109" r="7"/></g>'
};
function illustrate(item,q){
 const match=/^v13-\d+-(\d+)-(\d+)-(\d+)$/.exec(item.id||''),cat=match?+match[1]:7,index=match?+match[2]:0,tier=match?+match[3]:0;
 const glyph=match?symbols[cat]?.[index]:original[item.id],color=tier%3===1?'#d2b278':tier%3===2?'#c9d4e4':palette[cat%palette.length];
 const art=shapes[q]||'<text x="120" y="106" text-anchor="middle" font-size="87">'+escape(glyph||'◆')+'</text>';
 return '<div class="wh151-art" role="img" aria-label="Ilustración de '+escape(item.name)+'"><small>ILUSTRACIÓN</small><svg viewBox="0 0 240 150" aria-hidden="true" style="color:'+color+'"><ellipse cx="120" cy="136" rx="80" ry="9" fill="#0b1522" opacity=".65"/>'+art+'</svg></div>';
}
window.WH_V151_ART={illustrate};
})();
