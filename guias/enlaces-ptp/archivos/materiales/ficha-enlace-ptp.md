# Ficha del taller PtP · Cerro Sombrero–Codigua

Referencia oficial: captura de UISP designada por el usuario para el taller.
La distancia mostrada es 17,98 km, superior al mínimo de 5 km del ejercicio.
Las cifras de UISP no se presentan como resultados de Radio Mobile.
Completar con los datos obtenidos manualmente y dejar pendientes los no comprobados.

## Orden de trabajo

1. UISP Design Center: propuesta inicial y equipos candidatos.
2. Google Earth Pro: marcadores reales, coordenadas completas, traza y relieve.
3. Radio Mobile: análisis de factibilidad del conjunto radio–antena.
4. Google Earth Pro: visualizar la exportación del escenario listo y su geografía.

## Caso

- Nombre del caso: Cerro Sombrero (punto más alto indicado) hacia Codigua.
- Fecha de incorporación de la referencia: 2026-10-27. Fecha de simulación no confirmada.
- Necesidad de conexión y capacidad requerida:
- Distancia de referencia: 17,98 km mostrados en UISP; confirmar con coordenadas completas.

## Sitios

| Dato | Sitio A | Sitio B |
| --- | --- | --- |
| Nombre | Cerro Sombrero | Codigua |
| Latitud (grados, minutos, segundos) | 33°42′1.50″ S · propiedades de Earth Pro | 33°47′41,5″ S · captura de Units properties de Radio Mobile |
| Longitud (grados, minutos, segundos) | 71°14′3.95″ O · propiedades de Earth Pro | 71°23′30,6″ O · captura de Units properties de Radio Mobile |
| Latitud y longitud decimales, aproximadas | -33.7004167, -71.2344306 | Pendiente |
| Modo de altitud preferido en Earth Pro | Relativa al suelo | Relativa al suelo; comprobar en su marcador |
| Altitud del marcador base | 0 m sobre el suelo · captura recibida | Pendiente |
| Elevación del terreno y fuente | Pendiente | Pendiente |
| Campo Height de UISP (m) | 15 · escenario oficial | 15 · escenario oficial |
| Referencia de altura, edificio y mástil | Confirmar antes de introducir en Radio Mobile | Confirmar antes de introducir en Radio Mobile |
| Modelo de radio | Ubiquiti airFiber 5XHD · AF-5XHD | Ubiquiti airFiber 5XHD · AF-5XHD |
| Banda elegida | 5 GHz | 5 GHz |
| Modelo y tipo de antena; integrada o separada | Direccional externa compatible; modelo pendiente | Direccional externa compatible; modelo pendiente |
| Reflector/plato y alimentador, si corresponde | Pendiente | Pendiente |
| Ganancia de antena del escenario | 30 dBi · supuesto de simulación | 30 dBi · supuesto de simulación |
| Patrón del escenario | Corner.ant · genérico | Corner.ant · genérico |
| Polarización y ancho de haz de la antena física | Pendiente de ficha | Pendiente de ficha |
| Azimut e inclinación de instalación | Pendiente | Pendiente |

## Marcadores de Google Earth Pro

- Cerro Sombrero: coordenadas transcritas de la ventana de propiedades de la captura recibida.
- Captura: ../../imagenes/taller/originales/earth-cerro-sombrero-marcador.png
- Modo: Relativa al suelo; marcador base a 0 m. No equivale a la elevación del terreno.
- La altura de antena del escenario sigue siendo 15 m sobre el terreno; no sumarla dos veces.
- La elevación del punto no se deduce de la barra inferior de la captura, que puede corresponder al cursor.
- Codigua: coordenadas visibles en Units properties de Radio Mobile, tras pegarlas desde Earth Pro según el procedimiento del usuario. Falta su captura de propiedades en Earth Pro para contrastarlas.

## Referencias de UISP

- Captura de referencia: selección automática activa y nombre del modelo recortado.
- Radio elegido posteriormente por el usuario: airFiber 5XHD (AF-5XHD), uno por extremo.
- Banda del taller: 5 GHz. Antena externa y canal exacto pendientes.
- Ficha del radio: https://dl.ui.com/datasheets/airfiber/airFiber_5XHD_DS.pdf
- Distancia mostrada: 17,98 km.
- Alturas del escenario oficial en el campo Height: Cerro Sombrero 15 m; Codigua 15 m.
- Azimut mostrado: Cerro Sombrero 234°; Codigua 54°.
- Tilt mostrado: Cerro Sombrero −1,17°; Codigua 1°.
- Coordenadas y ubicación: faltan campos completos; no inferir caracteres ocultos.
- Captura: ../../imagenes/taller/originales/uisp-cerro-sombrero-codigua-oficial.png
- Referencia del usuario: punto más alto de cerro Sombrero hacia Codigua; confirmar los puntos exactos.

No utilizar la señal, capacidad o disponibilidad automática de UISP como
resultado de factibilidad. Si aparecen en una captura, conservarlos sin
retocar e identificar su procedencia en el pie de imagen.

## Preparación del terreno en Radio Mobile

- Pegar cada marcador mediante Paste en Units properties y revisar nombre y coordenadas.
- Codigua muestra Elevation = 0 m antes de preparar el terreno; no es un resultado final.
- Abrir Map properties, seleccionar Cerro Sombrero o Codigua en Select a unit y pulsar Extract.
- Tras terminar Extract, cerrar Map properties y repetir el copiado desde Google Earth Pro y el pegado con Paste en cada unidad de Radio Mobile.
- Empezar por el sitio seleccionado para la extracción: Cerro Sombrero → pegar Cerro Sombrero y luego Codigua; Codigua → pegar Codigua y luego Cerro Sombrero.
- Antes de cada Paste, seleccionar la unidad correspondiente al marcador copiado. Después comprobar nombre, coordenadas y elevación de ambos sitios y guardar con OK.
- Comprobar que el área cubre ambos extremos y que la fuente de elevación tiene datos para el caso.
- Las capturas previas muestran un mapa y centro anteriores; no son las coordenadas del tramo de Chile.
- Verificación posterior de elevaciones: pendiente de captura.
- La elevación del terreno y los 15 m de altura de antena se registran por separado.

## Fichas técnicas de los equipos

- Radio: fabricante, modelo y variante; enlace o archivo del datasheet; revisión o fecha:
- Antena/plato y alimentador: modelos y combinación; enlace o archivo del datasheet; revisión o fecha:
- Página o tabla de potencia TX y sensibilidad para el modo y ancho de canal elegidos:
- Página o tabla de ganancia, polarización, ancho de haz y patrón de antena:
- Fuente y cálculo de pérdidas según frecuencia, longitud de cable y conectores:

Interpretar las unidades antes de introducir los datos: dBm para potencia y
sensibilidad, dBi para ganancia y dB para pérdidas. No sumar dos veces la
ganancia del conjunto de antena. Documentar aparte las fuentes y supuestos
de clima, refractividad, suelo y porcentajes estadísticos del modelo.

## Configuración de Radio Mobile

- Versión e idioma utilizados:
- Fuente o resolución del terreno, si está indicada:
- Banda elegida: 5 GHz.
- Frecuencia de cálculo del escenario: 5800 MHz (5,8 GHz), según la captura de Parameters.
- Ancho de canal del escenario final: 20 MHz.
- Modulación de referencia: 64QAM (6x).
- Potencia TX por extremo: 21 dBm · 0,1258925 W.
- Ganancia por extremo: 30 dBi · 27,85 dBd; supuesto del escenario.
- Pérdidas fijas por extremo: 0,5 dB; estimación del escenario.
- Pérdida adicional por cambios de altura: 0 dB/m.
- Altura sobre el terreno por extremo: 15 m.
- Patrón elegido: Corner.ant.
- Sensibilidad: −75 dBm · 39,8107 µV en Radio Mobile, para 20 MHz y 64QAM (6x).
- Fuente de sensibilidad: ficha AF-5XHD, página 9, tabla Receive Sensitivity.
- Otros parámetros del modelo y unidades:

## Networks properties · Parameters

Captura: ../../imagenes/taller/originales/radio-mobile-networks-parameters.png

| Campo | Valor de la captura |
| --- | --- |
| Net name | PtP Sombrero–Codigua |
| Minimum frequency | 5800 MHz |
| Maximum frequency | 5800 MHz |
| Surface refractivity | 301 N-Units |
| Ground conductivity | 0,005 S/m |
| Relative ground permittivity | 15 |
| Polarization | Vertical; aproximación inicial pendiente de contrastar con la antena |
| Mode of variability | Spot |
| % of time | 90; deshabilitado |
| % of locations | 90; deshabilitado |
| % of situations | 70 |
| Additional loss | 0 %; City y Forest sin seleccionar |
| Climate | Maritime temperate over land; hipótesis inicial |

Los campos de frecuencia no representan el ancho de canal. El 70 % de
situaciones no es disponibilidad anual. Los valores ambientales se
documentan como supuestos del modelo; no proceden de la ficha de la antena.

## Networks properties · Topology

Captura: ../../imagenes/taller/originales/radio-mobile-networks-topology.png

| Opción | Estado del caso |
| --- | --- |
| Visible | Activada |
| Data net, star topology (Master/Slave) | Seleccionada |
| Voice net / Data net, cluster | Sin seleccionar |
| If a unit is set to master, set all others as slave | Desmarcada |
| Slave unit must have a directional antenna pointing toward a master | Desmarcada |

Criterio del taller: utilizar estrella siguiendo la recomendación del profesor.
En este PtP habrá un Master y un Slave. Cerro Sombrero será Master y Codigua será Slave,
según la configuración definida en Membership. Ambos extremos usarán antenas direccionales;
la casilla inferior desmarcada no cambia ese criterio de diseño.

## Propiedades de red · Systems

| Parámetro | Cerro Sombrero | Codigua |
| --- | --- | --- |
| System name | Cerro sombrero | Codigua |
| Transmit power (dBm) | 21 | 21 |
| Receiver threshold (dBm) | −75 | −75 |
| Line loss | 0,5 dB | 0,5 dB |
| Antenna type | Corner.ant | Corner.ant |
| Antenna gain (dBi) | 30 | 30 |
| Antenna height | 15 m AGL | 15 m AGL |
| Additional cable loss | 0 dB/m | 0 dB/m |

Capturas finales:
- ../../imagenes/taller/originales/radio-mobile-systems-cerro-sombrero.png
- ../../imagenes/taller/originales/radio-mobile-systems-codigua.png

Corner.ant aporta el patrón relativo, no una ganancia absoluta.
Los 30 dBi y los 0,5 dB son supuestos documentados de la simulación.
El modelo físico de antena y las pérdidas reales del montaje siguen por verificar.

## Propiedades de red · Membership

Capturas finales:
- ../../imagenes/taller/originales/radio-mobile-membership-cerro-sombrero-final.png
- ../../imagenes/taller/originales/radio-mobile-membership-codigua-final.png

| Campo | Cerro Sombrero | Codigua |
| --- | --- | --- |
| Casilla de unidad | Marcada | Marcada |
| Role | Master | Slave |
| System | Cerro sombrero | Codigua |
| Antenna height | System · 15 m sobre el terreno | System · 15 m sobre el terreno |
| Antenna direction | Codigua | Cerro Sombrero |
| Azimuth mostrado | 234,1° | 54,2° |
| Elevation angle mostrado | −1,223492° | 1,062107° |

Orden de configuración: 1 marcar unidades, 2 roles, 3 perfiles System,
4 altura desde System, 5 dirección al sitio opuesto.
Los 15 m se configuran en Systems. El 0,5 de Other no está seleccionado.
Recorrido: Topología → Systems → Membership.

## Resultados de Radio Mobile

Escenario final: 5800 MHz, 20 MHz, 64QAM (6x), con los perfiles anteriores.
Captura: ../../imagenes/taller/originales/radio-mobile-enlace-20mhz.png

- Distancia mostrada: 17,94 km (referencia inicial de UISP: 17,98 km).
- Worst Fresnel mostrado: 11,1 F1; despeje señalado a 8,47 km.
- Pérdidas del trayecto: 139,8 dB.
- Nivel recibido Cerro Sombrero → Codigua: −59,8 dBm.
- Rx Relative: 15,2 dB = −59,8 − (−75).
- Sentido inverso con Swap: mismo nivel y margen, confirmado por el usuario y por la captura posterior de Radio Link en sentido Codigua → Cerro Sombrero.
- Comparación inicial a 40 MHz y 64QAM: umbral −71 dBm, margen 11,2 dB.
- La mejora de 4 dB procede del umbral del modo de 20 MHz; el nivel recibido no cambió.
- Visita de terreno, antena física, pérdidas del montaje y condiciones de operación: por verificar.

## Exportación y vista final en Google Earth Pro

- Escenario: 5800 MHz, 20 MHz, 64QAM; perfiles de 21 dBm, 30 dBi y 15 m por extremo.
- Radio Link listo: captura en sentido Codigua → Cerro Sombrero, con 15,2 dB de margen.
- Menú: Radio Link → Edit → Export to… (Ctrl + F9).
- Export path profile: Custom, Nb of records = 500; Destination = Google Earth.
- Carpeta de destino utilizada: Descargas de Windows 11.
- Archivo generado observado: profile4.kml.
- El KML contiene el enlace Codigua - Cerro Sombrero [PtP Sombrero–Codigua].
- Modo de altitud del archivo: absolute; conservar la referencia al importarlo.
- Apertura observada: Google Earth Pro carga el enlace en Lugares temporales y anima la cámara hasta encuadrar el tramo.
- Si no se abre automáticamente en otra instalación: Archivo → Abrir y seleccionar el KML de Descargas.
- Los 500 registros de exportación no cambian la resolución del terreno original.

Capturas:
- ../../imagenes/taller/originales/radio-mobile-radio-link-listo.png
- ../../imagenes/taller/originales/radio-mobile-export-to-menu.png
- ../../imagenes/taller/originales/radio-mobile-export-path-profile.png
- ../../imagenes/taller/originales/earth-enlace-importado-final.png

El original de Earth Pro se conserva completo. La vista publicada está recortada
para quitar la barra de Windows y mostrar los dos extremos y su geografía.
El archivo KML se comprobó en Descargas; no se adjuntó como descarga en la web.
Guardar también el proyecto de Radio Mobile. Si cambia el diseño, recalcular
y volver a exportar.

## Guardar y retomar el proyecto

Categoría: Resultados y guardado · dos módulos:
1. Radio Link y exportación.
2. Guardar y retomar el proyecto.

Google Earth Pro:
- Crear en Mis lugares una carpeta PtP Sombrero–Codigua.
- Reunir los marcadores iniciales y la entrada completa importada desde Radio Mobile.
- Clic derecho en la carpeta → Guardar lugar como… → KMZ.
- Guardar en Descargas/PtP-Sombrero-Codigua/PtP-Sombrero-Codigua.kmz.
- Para abrir otro día: Archivo → Abrir y seleccionar el KMZ.
- Si se modifica el contenido, actualizar la copia KMZ con Guardar lugar como…

Radio Mobile, ventana principal:
- File → Save map as…: Sombrero-Codigua.map.
- File → Save picture as…: guardar cada imagen de mapa necesaria, por ejemplo Sombrero-Codigua.bmp.
- File → Save networks as…: Sombrero-Codigua.net.
- File → Save networks: incluir mapa e imágenes en el cuadro de archivos relacionados.
- Para abrir otro día: File → Open networks y seleccionar el NET.
- Si faltan archivos asociados: File → Open map / Open picture, y recuperar los archivos guardados.
- Mantener juntos NET, MAP e imágenes; conservar también Corner.ant si se traslada a otro equipo.
- Verificar parámetros y Radio Link en ambos sentidos después de reabrir.

El KMZ/KML es la presentación geográfica; no reemplaza el proyecto editable de Radio Mobile.

## Capturas y archivos

- UISP: modelos, distancia, coordenadas y alturas iniciales.
- Google Earth Pro inicial: marcadores A–B, medición y perfil con ejes y unidades.
- Radio Mobile: parámetros del radio y la antena, perfil y resultados legibles.
- Google Earth Pro final: exportación del escenario y vistas de su geografía.
- KML/KMZ y proyecto de Radio Mobile, si se pueden compartir.

Enviar capturas originales. No cambiar números, curvas, mapas ni etiquetas.
Evitar incluir cuentas, correos u otros datos privados al tomar la captura.
Los recortes de presentación deben conservar el contexto técnico necesario.
