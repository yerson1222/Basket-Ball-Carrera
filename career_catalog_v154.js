/* V15.4 — hand-balanced USD game prices, product classes and functional descriptions.
   Vehicle estimates are rounded reference values (not live dealer quotations). */
(function(){
'use strict';
const prices=[
 [23125,25000,26000,32000,22625,28000,34000,40000,44000,62000,63000,42000,45000,70000,82000,80000,130000,125000,120000,245000,250000,245000,270000,342000,3200000],
 [9500,8200,8500,13000,11000,19000,19500,26000],
 [180000,230000,260000,320000,420000,800000,380000,650000,2400000,480000,700000,1200000],
 [100,450,250,180,100,180,140,90,50,160],
 [450,900,250,500,250,350,180,650,12000,2500],
 [3500,350,1000,600,250,350,18000,350,700,700],
 [120,250,180,400,1800,700,150,18000,300,350],
 [650,500,650,350,800,650,100,200,700,4000],
 [750,1800,1600,3000,4500,1800,1300,2500,1800,3500],
 [18000,45000,25000,30000,45000,20000,20000,60000,30000,35000],
 [600,700,1000,500,1500,700,500,400,450,500],
 [1200,1800,500,2500,800,1000,450,1200,2000,150]
];
const desc=[
 ['Sedán compacto, práctico y de bajo consumo.','Compacto fiable para los desplazamientos diarios.','Compacto con acabado cuidado y buen comportamiento.','Hatchback versátil, cómodo en ciudad.','Sedán compacto económico, sin pretensiones de lujo.','Sedán mediano con buen equipamiento.','Sedán deportivo de tracción integral.','Sedán eléctrico para trayectos cotidianos.','Sedán ejecutivo de entrada a la gama premium.','Sedán premium de alto rendimiento.','Mercedes-AMG compacto de carácter deportivo.','Sedán ejecutivo con acabados premium.','Muscle car de alto rendimiento.','Deportivo americano de motor central.','Coupé BMW M de alto rendimiento.','Coupé deportivo Audi RS.','Deportivo Porsche de uso diario y circuito.','Gran turismo Mercedes-AMG.','Deportivo japonés de alto rendimiento.','Porsche de circuito homologado para carretera.','Superdeportivo híbrido de motor central.','Gran turismo Ferrari de altas prestaciones.','Superdeportivo Lamborghini de motor central.','Superdeportivo híbrido Ferrari.','Hiperdeportivo de colección, con mantenimiento excepcionalmente caro.'],
 ['Moto naked de media cilindrada.','Naked ligera para desplazamientos y ocio.','Moto deportiva de uso cotidiano.','Naked italiana de carácter deportivo.','Naked británica de tres cilindros.','Superbike BMW de alto rendimiento.','Moto deportiva de gran cilindrada.','Superbike Ducati orientada al circuito.'],
 ['Apartamento funcional cerca de servicios.','Vivienda de planta abierta.','Unidad residencial con servicios comunes.','Casa familiar independiente.','Inmueble de dos unidades residenciales.','Vivienda en la última planta con vistas.','Refugio de montaña para descanso.','Vivienda cerca del mar.','Gran residencia con amplios espacios.','Casa de descanso en zona montañosa.','Vivienda con piscina privada.','Terreno y residencia de uso privado.'],
 ['Calzado cómodo de uso diario.','Traje para actos oficiales y entrevistas.','Chaqueta con acabado de diseño.','Abrigo para la temporada fría.','Conjunto de ropa para entrenar y viajar.','Zapatillas de edición especial.','Equipaje para desplazamientos de temporada.','Gafas para exteriores.','Camiseta de edición especial.','Botas de cuero para uso diario.'],
 ['Reloj mecánico de carga automática.','Reloj con función de cronómetro.','Reloj orientado a actividad deportiva.','Cadena de oro como accesorio.','Pulsera de joyería.','Anillo de joyería.','Pendientes de joyería.','Reloj diseñado para actividades acuáticas.','Reloj mecánico con complicación tourbillon.','Collar con diamantes.'],
 ['Equipo para repetir lanzamientos y recibir pases.','Material de fuerza para trabajo individual.','Equipo cardiovascular para sesiones en interior.','Bicicleta estática de acondicionamiento.','Programa de salto y explosividad.','Sesiones de técnica de lanzamiento.','Acceso privado a una cancha equipada.','Revisión de jugadas y toma de decisiones.','Sesiones individuales de técnica.','Trabajo especializado de defensa.'],
 ['Sesión de masaje y recuperación muscular.','Atención de fisioterapia deportiva.','Sesiones de exposición controlada al frío.','Plan de alimentación y seguimiento.','Equipo de recuperación y compresión muscular.','Colchón para mejorar el descanso.','Sesiones de movilidad y respiración.','Acceso o instalación de piscina de recuperación.','Análisis de movimiento y técnica corporal.','Sesiones de acompañamiento psicológico deportivo.'],
 ['Ordenador portátil para estudio y viajes.','Teléfono móvil para comunicación.','Cámara para contenido y fotografía.','Consola para ocio en casa.','Televisor con panel OLED.','Equipo para retransmisiones y contenido.','Auriculares para música y viajes.','Reloj inteligente de uso diario.','Cabina de conducción para ocio.','Estudio para producción audiovisual.'],
 ['Estancia de descanso en montaña.','Escapada a París.','Vacaciones junto al mar Caribe.','Viaje de ocio a Japón.','Experiencia de observación de fauna.','Viaje en crucero.','Escapada urbana a Nueva York.','Estancia en Dubái.','Viaje cultural a Roma.','Estancia en las Maldivas.'],
 ['Participación en una cafetería.','Inversión en restauración.','Negocio de venta de artículos deportivos.','Proyecto de formación juvenil.','Inversión en un centro de entrenamiento.','Proyecto comercial de moda.','Negocio de producción audiovisual.','Inversión inmobiliaria para alquiler.','Participación en una empresa tecnológica.','Inversión en servicios de recuperación.'],
 ['Servicio de preparación de comidas.','Servicio de transporte privado.','Gestión de contratos y representación.','Apoyo con agenda y organización.','Servicio de seguridad personal.','Plan de preparación física individual.','Gestión de redes sociales y contenido.','Asesoría de imagen y vestuario.','Gestión contable y presupuesto.','Sesiones de fotografía profesional.'],
 ['Sala de cine doméstica.','Equipo para grabación musical.','Piezas de arte para colección privada.','Actuación musical contratada.','Sala de entretenimiento y videojuegos.','Mesa de billar para ocio.','Instrumento musical personal.','Acceso o membresía de golf.','Apoyo económico a una actividad cultural.','Entrada y experiencia en festival.']
];
const carClasses=['Esencial','Esencial','Esencial','Esencial','Esencial','Esencial','Deportivo','Premium','Premium','Deportivo','Deportivo','Premium','Deportivo','Deportivo','Deportivo','Deportivo','Deportivo','Lujo','Deportivo','Superdeportivo','Superdeportivo','Lujo','Superdeportivo','Superdeportivo','Hiperdeportivo'];
const carOptions=['XSE','Sport Touring','Turbo','GTI','N Line','GT','tS','Performance','S line','xDrive','4MATIC','F Sport','Dark Horse','Z06','Competition','Competition','GTS','63 S','Nismo','Weissach','Spider','Spider','STO','Assetto Fiorano','Pur Sport'];
const multipliers=[[1,1.32],[1,1.3],[1,1.65,2.6],[1,3,7],[1,3,8],[1,2,3.5],[1,2.1,4],[1,2.2],[1,2.8],[1,4],[1,3],[1,3.5]];
const round=(n)=>n<1000?Math.round(n/5)*5:n<100000?Math.round(n/50)*50:Math.round(n/1000)*1000;
const special={'0-0-0':23125,'0-4-0':22625,'0-4-1':30650,'0-0-1':28500,'0-1-1':32000,'0-2-1':36000,'0-3-1':36500,'0-5-1':34500,'0-6-1':46000,'0-7-1':55000,'0-9-1':66000,'0-13-1':115000,'0-14-1':95000,'0-16-1':175000,'0-18-1':215000,'0-19-1':285000,'0-24-1':3900000,'3-0-0':100,'3-0-1':180,'3-0-2':850,'3-5-0':180,'3-5-1':850,'3-5-2':1100,'3-6-1':1200,'3-6-2':1500};
const extras=['Configuración estándar.','Equipamiento y servicio superiores.','Acabados exclusivos y atención personalizada.'];
function apply(item){
 const m=/^v13-\d+-(\d+)-(\d+)-(\d+)$/.exec(item.id);if(!m){item.prestige=['sports_car'].includes(item.id)?'Deportivo':['luxury_car','penthouse'].includes(item.id)?'Lujo':['shoes','nutrition','massage','mind','film'].includes(item.id)?'Esencial':'Premium';return;}
 const c=+m[1],i=+m[2],j=+m[3],key=c+'-'+i+'-'+j;
 item.price=special[key]??round(prices[c][i]*multipliers[c][j]);
 item.prestige=c===0?carClasses[i]:c===1?(i>=5?'Deportivo':i>=3?'Premium':'Esencial'):c===2?(i===8?'Lujo':j===0?'Residencial':j===1?'Lujo':'Signature'):j===0?'Esencial':j===1?'Premium':'Signature';
 if(c===0&&j===1)item.name=item.name.split(' · ')[0]+' · '+carOptions[i];
 item.description=desc[c][i]+' '+(c===0?(j===0?'Versión de referencia.':'Versión mejor equipada o deportiva.'):(c===10?'Paquete de servicios: ':'')+extras[j]);
 item.risk=c===0?(i<6?1:i<10?2:i<19?4:i===24?8:6)+(j?1:0):c===1?4+(i>=5?2:0)+j:Math.min(5,1+j+(c===9?2:0));
 if(c===9||c===10)item.priceBasis=c===9?'Inversión inicial':'Paquete de servicios';
 else if(c===8)item.priceBasis='Presupuesto del viaje';
}
window.WH_V154_CATALOG={apply};
})();
