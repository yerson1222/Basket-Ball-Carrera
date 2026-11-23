/* Base editable de competiciones. Los nombres de los clubes son ficticios.
   El calendario de cada liga está reducido a 8 clubes para hacer ágil esta versión. */
window.WH_DATA = {
  continents: [
    {id:'north',name:'Norteamérica',symbol:'NA',accent:'#85caff'},
    {id:'south',name:'Sudamérica',symbol:'SA',accent:'#65edba'},
    {id:'europe',name:'Europa',symbol:'EU',accent:'#c4a0ff'},
    {id:'asia',name:'Asia',symbol:'AS',accent:'#ffcd86'},
    {id:'africa',name:'África',symbol:'AF',accent:'#ff9d83'},
    {id:'oceania',name:'Oceanía',symbol:'OC',accent:'#a4e8ee'}
  ],
  leagues: [
    {id:'nba', name:'NBA', country:'Estados Unidos / Canadá', continent:'north', flag:'🇺🇸', quality:94, money:2100000, cities:['New York','Los Ángeles','Chicago','Toronto','Miami','Boston','Dallas','San Francisco']},
    {id:'gleague',name:'NBA G League',country:'Estados Unidos',continent:'north',flag:'🇺🇸',quality:77,money:65000,cities:['Austin','Westchester','Sioux Falls','Ontario','Reno','Grand Rapids','Birmingham','Des Moines']},
    {id:'cebl',name:'CEBL',country:'Canadá',continent:'north',flag:'🇨🇦',quality:72,money:52000,cities:['Montréal','Ottawa','Vancouver','Calgary','Edmonton','Winnipeg','Hamilton','Saskatoon']},
    {id:'lnbp',name:'LNBP — México',country:'México',continent:'north',flag:'🇲🇽',quality:73,money:71000,cities:['Ciudad de México','Monterrey','Guadalajara','Puebla','Mexicali','Querétaro','Chihuahua','Xalapa']},
    {id:'bsn',name:'BSN',country:'Puerto Rico',continent:'north',flag:'🇵🇷',quality:75,money:74000,cities:['San Juan','Ponce','Bayamón','Arecibo','Caguas','Mayagüez','Carolina','Guaynabo']},
    {id:'arg',name:'Liga Nacional de Básquet',country:'Argentina',continent:'south',flag:'🇦🇷',quality:76,money:85000,cities:['Buenos Aires','Córdoba','Rosario','Mar del Plata','La Plata','Santa Fe','Corrientes','Bahía Blanca']},
    {id:'nbb',name:'Novo Basquete Brasil',country:'Brasil',continent:'south',flag:'🇧🇷',quality:78,money:93000,cities:['São Paulo','Rio de Janeiro','Brasília','Belo Horizonte','Curitiba','Campinas','Florianópolis','Fortaleza']},
    {id:'uru',name:'Liga Uruguaya de Básquetbol',country:'Uruguay',continent:'south',flag:'🇺🇾',quality:69,money:49000,cities:['Montevideo','Salto','Paysandú','Maldonado','Colonia','Rivera','Melo','Mercedes']},
    {id:'chi',name:'Liga Nacional de Básquetbol',country:'Chile',continent:'south',flag:'🇨🇱',quality:67,money:45000,cities:['Santiago','Valparaíso','Concepción','Temuco','Osorno','Valdivia','Puerto Montt','Antofagasta']},
    {id:'col',name:'Liga Profesional de Baloncesto',country:'Colombia',continent:'south',flag:'🇨🇴',quality:67,money:42000,cities:['Bogotá','Medellín','Cali','Barranquilla','Bucaramanga','Pereira','Manizales','Cartagena']},
    {id:'acb',name:'Liga ACB',country:'España',continent:'europe',flag:'🇪🇸',quality:89,money:620000,cities:['Madrid','Barcelona','Valencia','Málaga','Bilbao','Sevilla','Granada','Zaragoza']},
    {id:'france',name:'Betclic Élite',country:'Francia',continent:'europe',flag:'🇫🇷',quality:84,money:330000,cities:['Paris','Lyon','Monaco','Marseille','Lille','Strasbourg','Limoges','Dijon']},
    {id:'italy',name:'Lega Basket Serie A',country:'Italia',continent:'europe',flag:'🇮🇹',quality:86,money:380000,cities:['Milano','Bologna','Roma','Napoli','Torino','Venezia','Brescia','Treviso']},
    {id:'germany',name:'Basketball Bundesliga',country:'Alemania',continent:'europe',flag:'🇩🇪',quality:83,money:310000,cities:['Berlin','München','Hamburg','Frankfurt','Bonn','Köln','Ulm','Leipzig']},
    {id:'turkey',name:'Basketbol Süper Ligi',country:'Turquía',continent:'europe',flag:'🇹🇷',quality:87,money:440000,cities:['İstanbul','Ankara','İzmir','Bursa','Antalya','Konya','Mersin','Gaziantep']},
    {id:'greece',name:'Greek Basket League',country:'Grecia',continent:'europe',flag:'🇬🇷',quality:85,money:360000,cities:['Atenas','Salónica','Patras','Larisa','Heraclión','Volos','Ioánina','Kavala']},
    {id:'japan',name:'B.League',country:'Japón',continent:'asia',flag:'🇯🇵',quality:82,money:290000,cities:['Tokyo','Osaka','Kyoto','Nagoya','Yokohama','Sapporo','Hiroshima','Fukuoka']},
    {id:'china',name:'Chinese Basketball Association',country:'China',continent:'asia',flag:'🇨🇳',quality:86,money:500000,cities:['Beijing','Shanghai','Shenzhen','Guangzhou','Nanjing','Hangzhou','Tianjin','Wuhan']},
    {id:'korea',name:'Korean Basketball League',country:'Corea del Sur',continent:'asia',flag:'🇰🇷',quality:79,money:220000,cities:['Seoul','Busan','Incheon','Daegu','Daejeon','Suwon','Ulsan','Goyang']},
    {id:'philippines',name:'Philippine Basketball Association',country:'Filipinas',continent:'asia',flag:'🇵🇭',quality:79,money:185000,cities:['Manila','Quezon City','Cebu','Davao','Pasig','Makati','Taguig','Baguio']},
    {id:'lebanon',name:'Liga Libanesa',country:'Líbano',continent:'asia',flag:'🇱🇧',quality:76,money:135000,cities:['Beirut','Trípoli','Sidón','Tiro','Jounieh','Zahlé','Byblos','Baabda']},
    {id:'egypt',name:'Superliga Egipcia',country:'Egipto',continent:'africa',flag:'🇪🇬',quality:72,money:82000,cities:['El Cairo','Alejandría','Giza','Port Said','Suez','Mansura','Asuán','Luxor']},
    {id:'angola',name:'Liga Angoleña',country:'Angola',continent:'africa',flag:'🇦🇴',quality:73,money:88000,cities:['Luanda','Benguela','Huambo','Lubango','Lobito','Cabinda','Malanje','Soyo']},
    {id:'nigeria',name:'Liga Nigeriana',country:'Nigeria',continent:'africa',flag:'🇳🇬',quality:68,money:51000,cities:['Lagos','Abuja','Kano','Ibadan','Benin City','Port Harcourt','Kaduna','Enugu']},
    {id:'senegal',name:'Liga Senegalesa',country:'Senegal',continent:'africa',flag:'🇸🇳',quality:67,money:43000,cities:['Dakar','Thiès','Saint-Louis','Kaolack','Ziguinchor','Mbour','Rufisque','Louga']},
    {id:'australia',name:'National Basketball League',country:'Australia',continent:'oceania',flag:'🇦🇺',quality:84,money:360000,cities:['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra','Hobart','Gold Coast']},
    {id:'newzealand',name:'New Zealand NBL',country:'Nueva Zelanda',continent:'oceania',flag:'🇳🇿',quality:74,money:94000,cities:['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Dunedin','Napier','Nelson']}
  ],
  countries:['México','Canadá','Estados Unidos','Puerto Rico','Argentina','Brasil','Colombia','Chile','Uruguay','España','Francia','Italia','Alemania','Grecia','Turquía','Japón','China','Corea del Sur','Filipinas','Líbano','Egipto','Angola','Nigeria','Senegal','Australia','Nueva Zelanda','República Dominicana','Venezuela','Perú','Marruecos','Otro'],
  positions:[{id:'PG',name:'Base (PG)'},{id:'SG',name:'Escolta (SG)'},{id:'SF',name:'Alero (SF)'},{id:'PF',name:'Ala-pívot (PF)'},{id:'C',name:'Pívot (C)'}],
  styles:[{id:'scorer',name:'Anotador',desc:'Más puntos y mejor tiro'},{id:'playmaker',name:'Creador',desc:'Más asistencias y manejo'},{id:'defender',name:'Defensivo',desc:'Robos, tapones y resistencia'},{id:'athlete',name:'Atlético',desc:'Explosividad y rebotes'}],
  mascots:['Meteoros','Centellas','Titanes','Auroras','Centuriones','Halcones','Vórtices','Lobos']
};
