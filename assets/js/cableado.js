const cabCategories = [
  {title:'Primeros conceptos y el cable', modules:[
    {title:'Qué es un enlace de cableado', model:null, lead:'Imagina que necesitas conectar un computador a la red. Sigamos la conexión para descubrir qué hay dentro del cable y por qué el edificio necesita una instalación organizada.', standard:'TIA-568', sections:[
      ['Empecemos con una conexión','Tienes un computador y quieres conectarlo a la red mediante un switch o un router. Necesitas un camino físico entre ambos: normalmente conectas un cable al puerto de red del computador y el otro extremo a una toma o al equipo de red. Ese cable no es solo una cubierta con cobre dentro. Su construcción permite que la información viaje como señales eléctricas.'],
      ['¿Qué hay dentro del cable?','Si observas un cable Ethernet de cobre habitual por dentro, encontrarás ocho conductores agrupados en cuatro parejas. Cada pareja se enrolla sobre sí misma: por eso se llama par trenzado. Los dos conductores de un par trabajan juntos para transportar una señal; el equipo interpreta la diferencia eléctrica entre ellos.','El trenzado ayuda a que una perturbación externa afecte de forma parecida a ambos conductores. También reduce la interferencia entre pares. Si los separas demasiado al terminar el cable, puedes perjudicar esa ventaja aunque los hilos sigan conectados.'],
      ['¿Por qué aparece una toma de pared?','Un cable directo entre computador y switch puede servir en una práctica pequeña. En un edificio, sería difícil mantener muchos cables largos sueltos. Por eso se deja instalado un cable fijo desde la toma del puesto hasta un patch panel en un rack. Un cordón corto conecta el computador a la toma y otro une el panel con el switch.','Ese recorrido organizado es un enlace de cableado estructurado. El switch procesa el tráfico; el panel, la toma y el cable proporcionan un camino físico identificable y fácil de mantener.'],
      ['Cómo recorrer la guía','En esta categoría aprenderás a reconocer el cable. Las siguientes muestran las piezas del rack y del puesto, cómo terminarlas, por dónde instalarlas y cómo comprobar el resultado. No necesitas conocer las siglas U/UTP o T568B para comenzar.']]},
    {title:'Anatomía y transmisión', model:'anatomy', lead:'Observa cómo se construye un cable de cuatro pares y por qué su trenzado importa para transportar la señal.', standard:'TIA-568', sections:[
      ['Del centro hacia afuera','Cada conductor de cobre transporta una parte de la señal. Dos conductores aislados forman un par; el cable habitual para Ethernet reúne cuatro pares. El aislamiento evita contacto eléctrico, mientras la cubierta exterior protege al conjunto. Algunos cables agregan separador, pantalla metálica y un conductor de drenaje.','El trenzado ayuda a que las perturbaciones afecten de modo semejante a ambos conductores del par. El receptor interpreta su diferencia; por eso conservar la geometría del cable importa tanto como su continuidad.'],
      ['Qué observar en un corte','Identifica conductor, aislamiento, cuatro pares, separador si existe, blindaje si existe y chaqueta. No confundas una cubierta gruesa con una categoría superior: la construcción y las prestaciones deben verificarse en la ficha del producto.','Un par dividido puede mostrar continuidad correcta y aun así fallar por interferencia entre pares.'],
      ['Rígido y flexible','El conductor sólido suele destinarse al tramo fijo. El cable multifilar soporta mejor el movimiento repetido de cordones de conexión. El conector debe ser compatible con la construcción concreta del cable.','La categoría del enlace depende del conjunto instalado, no solo del texto impreso en el cable.']]},
    {title:'Categorías y cubiertas', model:'categories', lead:'Distingue las prestaciones del enlace de la construcción de su chaqueta y del ambiente donde se instala.', standard:'TIA-568', sections:[
      ['Categoría frente a aplicación','Cat 5e, Cat 6 y Cat 6A describen prestaciones de componentes y enlaces bajo condiciones de prueba. IEEE 802.3 define aplicaciones Ethernet; no debe deducirse una velocidad universal a partir de una sola etiqueta de cable. Compara canal completo, distancia, entorno y equipos.'],
      ['Chaqueta y ambiente','La cubierta debe elegirse por el entorno de instalación y los requisitos locales de seguridad. Interior, exterior, exposición solar, humedad, canalización y exigencias frente al fuego pueden requerir construcciones distintas. Nunca infieras que cualquier cubierta sirve para todo el recorrido.'],
      ['Antes de comprar','Comprueba categoría, calibre, conductor sólido o multifilar, blindaje, diámetro, cubierta, compatibilidad de conectores y documentación del fabricante. En un enlace mezclado, el componente de menor prestación puede limitar el resultado.']]},
    {title:'U/UTP, F/UTP y S/FTP', model:'shield', lead:'Compara la ubicación de las pantallas: alrededor del cable, de cada par o en ambas posiciones.', standard:'TIA-568', sections:[
      ['Cómo leer las siglas','La parte anterior a la barra indica el blindaje general y la posterior indica el blindaje de cada par. U significa sin pantalla, F una lámina metálica y S una malla. Por eso U/UTP no lleva pantalla, F/UTP lleva lámina global y S/FTP combina malla global con láminas por par.'],
      ['Otros ejemplos útiles','U/FTP protege cada par con lámina sin pantalla global. S/UTP tiene malla global y pares sin pantalla individual. SF/UTP suma malla y lámina globales. La nomenclatura describe construcción; no declara por sí sola velocidad, categoría ni inmunidad total.'],
      ['Blindaje como sistema','La pantalla debe mantener continuidad mediante componentes compatibles y una unión equipotencial correctamente diseñada. Un cable blindado conectado a tomas no blindadas no equivale a un canal blindado completo. La selección responde al ambiente electromagnético, al equipo y al diseño del edificio.']]}
  ]},
  {title:'Componentes del sistema', modules:[
    {title:'Keystone, faceplate y toma', model:'keystone', standard:'TIA-568', sections:[
      ['La salida del puesto','El jack keystone es la terminación hembra del cable fijo. Se instala en una placa frontal o faceplate y deja un puerto accesible para el cordón del usuario. La placa no determina por sí sola la categoría: importan el jack, el cable, la terminación y el canal.'],
      ['Terminación IDC','En la parte posterior, los contactos IDC reciben cada conductor en una ranura. Sigue el código A o B impreso por el fabricante, conserva el trenzado lo más cerca posible del contacto y evita pelar más chaqueta de la necesaria. No copies la posición de colores de otro modelo de jack: las ranuras pueden estar dispuestas de otra manera.'],
      ['Identificación','La placa y el puerto deben tener un identificador que corresponda al panel y al registro del enlace. Eso permite localizar fallas sin seguir físicamente todo el cable.']]},
    {title:'Patch panel y rack', model:'rack', standard:'TIA-568 · TIA-606 · TIA-607', sections:[
      ['El extremo de distribución','El cable horizontal fijo termina en el patch panel. En su frente se conectan patch cords hacia el switch; detrás se terminan los cables permanentes. El panel facilita reconfigurar servicios sin rehacer el cable instalado.'],
      ['Orden en el rack','Organizadores, bandejas y reserva razonable permiten mantener radios de curvatura y acceder a los puertos. Separa la función de cada equipo: un patch panel pasivo organiza terminaciones; el switch es activo y conmuta tráfico. La ubicación del rack y el acceso forman parte del diseño de espacios.'],
      ['Partes metálicas','Cuando el diseño lo requiera, rack, bandejas y componentes metálicos se integran al sistema de unión equipotencial de telecomunicaciones. El detalle debe seguir el proyecto eléctrico y las normas locales.']]},
    {title:'Patch cord y cordón de usuario', model:'cords', standard:'TIA-568', sections:[
      ['Dos extremos, funciones distintas','El patch cord une panel y equipo dentro del rack. El cordón de usuario une la toma de pared con el dispositivo. Ambos forman parte del canal, pero no del enlace permanente que se certifica entre panel y toma.'],
      ['Distancias máximas del cableado horizontal','En un canal convencional de cobre de pares trenzados, el enlace permanente entre el patch panel y la toma de pared puede medir hasta 90 m. Los cordones del rack y del puesto de trabajo suman hasta 10 m en conjunto. El canal completo puede medir hasta 100 m.','Por ejemplo, un cordón de 3 m entre el switch y el panel, un tramo fijo de 90 m y un cordón de 7 m entre la toma y el computador suman 100 m. Mide el recorrido real del cable por la canalización. Algunas aplicaciones y tipos de cordón tienen límites más cortos.'],
      ['Selección','Escoge cordones de categoría y blindaje compatibles, longitud adecuada y conectores apropiados. Un cordón deteriorado puede degradar un enlace fijo que había pasado sus pruebas. Evita enrollarlo con curvas cerradas o someterlo a tensión.'],
      ['No todo cable corto es igual','Un cordón de fábrica suele usar conductor flexible y conectores preparados para él. Un cable fijo sólido con un plug cualquiera no sustituye automáticamente un cordón diseñado y probado.']]}
  ]},
  {title:'Terminación y conexiones', modules:[
    {title:'8P8C y esquemas T568A/B', model:'pins', standard:'TIA-568', sections:[
      ['Conector y nombre','El plug modular Ethernet de ocho posiciones y ocho contactos se denomina 8P8C. A menudo se le llama RJ45 en conversación, aunque el término no describe con precisión todo el sistema de cableado. El modelo muestra los contactos vistos desde el frente: verifica siempre la orientación antes de crimpar.'],
      ['A y B','T568A y T568B ordenan los pares de forma distinta en los pines. Los pares azul y marrón conservan su ubicación; verde y naranja intercambian posiciones. Elige un esquema para la instalación y úsalo de manera coherente en ambos extremos cuando buscas un cable directo.'],
      ['Secuencia de trabajo','Prepara el cable, conserva el trenzado hasta el punto de terminación, sigue el marcado del fabricante, asegura la chaqueta y comprueba el mapa de hilos. La inspección visual no reemplaza la prueba.']]},
    {title:'Canal y enlace permanente', model:'channel', standard:'TIA-568', sections:[
      ['Límites de cada medición','El enlace permanente considera el cableado fijo entre las terminaciones del panel y la toma. El canal agrega los cordones de ambos lados. Esta distinción evita atribuir a la instalación fija un problema causado por un patch cord.'],
      ['Recorrido lógico','Switch → patch cord → patch panel → cable horizontal → keystone/faceplate → cordón de usuario → equipo. Selecciona en el modelo cada tramo y observa cuáles pertenecen al enlace permanente.'],
      ['Diagnóstico por sustitución','Si un canal falla, prueba primero cordones y puertos accesibles. Si el enlace permanente falla, revisa terminaciones, pares, recorrido y daño físico antes de reemplazar todo el cable.']]},
    {title:'Conexiones compatibles', model:'compatibility', standard:'TIA-568', sections:[
      ['Sistema completo','Cable, plug o jack, patch panel y cordones deben ser compatibles en categoría, construcción y blindaje. Un plug para conductor sólido puede no funcionar correctamente con uno multifilar, y viceversa. También importa el diámetro del conductor y de la cubierta.'],
      ['Pantalla continua','En instalaciones blindadas, usa terminaciones metálicas previstas para transferir la pantalla hacia los componentes adecuados. Mantener blindaje no consiste en dejar lámina expuesta o unirla improvisadamente a cualquier tornillo.'],
      ['Comprobación final','Registra esquema A/B, identificación de puertos y resultado del probador. Deja el enlace listo para mantenimiento futuro, no solo para que funcione el día de instalación.']]}
  ]},
  {title:'Recorridos e instalación', modules:[
    {title:'Cableado horizontal', model:'horizontal', standard:'TIA-568 · TIA-569',
      lead:'Diseña el recorrido entre el rack de una planta y sus tomas de red. Aprende a medirlo, asignar puertos y comprobar que se pueda instalar y mantener.', sections:[
      ['Del armario al área de trabajo','El cableado horizontal sale del espacio de telecomunicaciones y llega a las tomas de una planta. Incluye el cable fijo y sus terminaciones. Las canalizaciones y espacios que lo alojan se planifican con TIA-569; la estructura y prestaciones del cableado se estudian con TIA-568.'],
      ['Longitud y reservas','Como referencia común de diseño, el enlace permanente de cobre horizontal llega hasta 90 m y el canal completo hasta 100 m, bajo las condiciones de la serie TIA-568. Los cordones consumen parte del presupuesto del canal: mide el recorrido real, no la distancia en línea recta.'],
      ['Una toma, un enlace','El cableado horizontal suele seguir una topología en estrella. Cada toma tiene su cable hacia el distribuidor de la planta. Si un puesto necesita conexión para el computador y otra conexión independiente, dibuja dos enlaces y reserva dos posiciones en el panel. El puerto del switch se asigna al habilitar el servicio.','En una sala con doce mesas y dos tomas por mesa necesitas 24 enlaces permanentes. Añade al inventario las tomas para puntos de acceso, impresoras u otros equipos antes de dimensionar el panel.'],
      ['Medir el recorrido construido','Marca sobre el plano el trayecto por bandeja, curvas, subidas y bajadas. Suma las reservas de cable que quedarán en la instalación. Si el recorrido por bandeja es de 67 m, las bajadas suman 6 m y quedan 3 m de reserva, el enlace fijo mide 76 m. Con cordones de 3 m y 5 m, el canal suma 84 m.','Si una toma exige 93 m de cable fijo, comprueba si existe un recorrido más corto o si conviene ubicar otro distribuidor más cerca. Acortar los cordones reduce la longitud del canal, pero el tramo permanente seguiría fuera de su límite habitual.'],
      ['Instalación y verificación','Usa guías de tiro y conserva el radio de curvatura indicado para el cable. Identifica cada extremo antes de cerrar la canalización. Al llegar al rack, deja reserva accesible y organiza las llegadas para poder intervenir un puerto sin tensar los vecinos.','Después de terminar panel y toma, verifica el mapa de hilos y certifica el enlace permanente con el límite indicado para el proyecto. Archiva el resultado con el mismo identificador que figura en la toma.'],
      ['Ejercicio','Una ruta mide 74 m por bandeja, más 5 m de bajadas y 4 m de reserva. Con cordones de 4 m y 5 m, calcula los dos totales. El enlace permanente mide 83 m y el canal 92 m. Ambos quedan dentro de los límites habituales de 90 m y 100 m.']]},
    {title:'Backbone o cableado vertical', model:'vertical', standard:'TIA-568 · TIA-569',
      lead:'Conecta los distribuidores de varias plantas y decide qué medio, capacidad y ruta necesita el enlace que concentra su tráfico.', sections:[
      ['Entre espacios','El backbone conecta espacios de telecomunicaciones, salas de equipos y puntos de entrada entre plantas o edificios. Se llama vertical por su recorrido típico, pero su función es interconectar distribuidores; no depende exclusivamente de ir hacia arriba.'],
      ['Medio y capacidad','Su diseño considera distancia, capacidad futura, rutas, redundancia y medios adecuados. Puede emplear fibra óptica o cobre según la aplicación y el proyecto. No reutilices automáticamente los límites del horizontal para cualquier backbone.'],
      ['Cómo se conecta con el horizontal','Dibuja primero la sala principal y los armarios de planta. Los enlaces desde cada armario hacia las tomas son horizontales. El enlace desde el switch de planta hacia el equipo de distribución concentra ese tráfico y forma parte del backbone. Marca las terminaciones y el equipo en cada extremo.'],
      ['Elegir fibra o cobre','Para fibra, elige la clase de fibra y los transceptores como conjunto. Comprueba que ambos extremos usen tecnología compatible, que la distancia esté dentro del alcance y que la pérdida estimada incluya conectores y empalmes. Para cobre, comprueba el alcance de la aplicación Ethernet elegida y las condiciones eléctricas y ambientales del recorrido.','Una troncal con cuatro plantas puede llevar un enlace desde cada planta hasta la sala principal. Si el diseño utiliza ópticas dúplex, cuenta dos fibras activas por enlace y reserva fibras libres según el crecimiento previsto. Registra también qué fibras están ocupadas y en qué bandeja terminan.'],
      ['Capacidad y rutas independientes','El número de tomas de un piso permite estimar la demanda, pero la capacidad del uplink se decide por los usos simultáneos. Identifica cargas como cámaras, puntos de acceso, copias de seguridad y tráfico entre plantas. Compra interfaces y cable compatibles con la capacidad prevista.','Si necesitas tolerar el corte de una canalización, revisa el recorrido completo de los enlaces redundantes. Dos cables por el mismo ducto comparten el riesgo de que una sola intervención los dañe. Documenta los puntos donde las rutas se acercan o comparten infraestructura.'],
      ['Ejercicio','El armario de una planta pierde comunicación con la sala principal y los computadores de ese piso quedan aislados. Comprueba primero los indicadores y el estado del uplink en ambos switches. Si el enlace está caído, revisa puertos, ópticas o cordones, y después el tramo fijo. Si hay enlace físico, continúa con la configuración de red.']]},
    {title:'Canalizaciones y espacios', model:'pathways', standard:'TIA-569',
      lead:'Diseña por dónde pasan los cables y dónde se alojan los equipos para que la instalación se pueda ampliar, inspeccionar y reparar.', sections:[
      ['Qué cubre TIA-569','Trata recorridos y espacios físicos que soportan la infraestructura: canalizaciones, bandejas, salas de equipos, espacios de telecomunicaciones y entradas. El cable no se instala aisladamente del edificio.'],
      ['Decisiones de proyecto','Considera cantidad de cables, rutas disponibles, acceso para mantenimiento, ocupación futura, ambiente y coordinación con otras instalaciones. Las distancias respecto de energía y otras condiciones concretas se verifican en la edición aplicable, el proyecto y las reglas locales.'],
      ['Elegir bandeja, ducto o canaleta','La bandeja resulta práctica cuando varios enlaces comparten un recorrido accesible. Un ducto protege el cable y puede requerir puntos de tiro e inspección. Una canaleta permite distribuir las salidas cerca de los puestos. Es posible combinar los tres en una sola ruta, por ejemplo, bandeja en el pasillo, ducto de bajada y canaleta en el área de trabajo.'],
      ['Dimensionar la ruta','Cuenta los cables de cada tramo y revisa sus diámetros exteriores. El troncal de una bandeja puede llevar más cables que las derivaciones, por lo que cada tramo se dimensiona por separado. Comprueba la ocupación permitida, el radio de los accesorios, la capacidad de los soportes y el espacio reservado para futuras ampliaciones.','En un corredor con tres derivaciones de ocho cables, estima 24 cables antes de la primera salida, 16 después y 8 en el último tramo. Repite el cálculo con la reserva prevista y verifica el tamaño de la canalización según el proyecto.'],
      ['Coordinar con el edificio','Revisa el camino junto con las instalaciones de energía, climatización y protección contra incendios. Define los cruces y el tratamiento de las penetraciones antes de abrir muros o losas. El armario necesita acceso para mantenimiento, gestión de cables, alimentación e infraestructura de telecomunicaciones según el proyecto.'],
      ['Ejercicio','El recorrido más corto pasa por un cielo cerrado sin registros y necesita una curva que el cable no tolera. Dibuja una alternativa accesible, calcula los metros adicionales y comprueba si sigue dentro del límite del enlace. Actualiza el plano con las cajas o registros que realmente podrán usarse.']]}
  ]},
  {title:'Administración y tierra', modules:[
    {title:'Etiquetas y registros', model:'labels', standard:'TIA-606',
      lead:'Usa un identificador para seguir cada enlace desde la toma hasta el panel, el plano y el informe de prueba.', sections:[
      ['Identificar sin adivinar','TIA-606 se ocupa de identificadores, registros y documentación. Un enlace debe poder relacionarse con su puerto de panel, toma, recorrido y resultado de prueba. Una etiqueta útil permite encontrar el extremo remoto sin abrir cada caja.'],
      ['Registro mínimo','Guarda identificador único, origen, destino, ubicación, tipo de cable, terminaciones, fecha y prueba. Si cambias un patch cord o reasignas un servicio, actualiza el registro. La etiqueta física y el documento deben decir lo mismo.'],
      ['Cómo construir un identificador','En el esquema, P01 representa el mismo enlace en la toma, en el registro del cable y en el panel. En un edificio con varios armarios, P01 puede repetirse. Un código de ejemplo como P02-R01-PP01-07 distingue planta 2, rack 1, panel 1 y puerto 7. Asegúrate de que el código sea único dentro del alcance del proyecto y de que pueda leerse con los cables conectados.'],
      ['Separa infraestructura y servicio','El enlace permanente conserva su identificación aunque el patch cord se mueva a otro puerto del switch. Guarda por separado el código del enlace, el puerto activo y el servicio asignado. Si un computador se traslada, actualiza el registro de servicio y conserva el historial del enlace físico.','Para entregar 24 enlaces, reúne 24 identificadores únicos, su relación con las tomas en el plano y un informe de prueba por enlace. Compara el inventario con la instalación antes de entregar.'],
      ['Ejercicio','La toma indica P02-R01-PP01-07, pero el informe tiene P02-R01-PP01-17. Busca ambos puertos en el registro, comprueba el recorrido con un identificador remoto y corrige el dato o la etiqueta según corresponda. Si no puedes asociar la prueba con certeza, repite la medición bajo el código correcto.']]},
    {title:'Unión equipotencial y puesta a tierra', model:'ground', standard:'TIA-607',
      lead:'Sigue la conexión prevista entre las partes metálicas del rack, la barra de telecomunicaciones y el sistema de tierra del edificio.', sections:[
      ['Dos ideas relacionadas','La unión equipotencial conecta partes metálicas para reducir diferencias de potencial. La puesta a tierra integra ese sistema a la infraestructura eléctrica prevista. TIA-607 aborda estas conexiones para telecomunicaciones; su diseño debe coordinarse con normas eléctricas locales.'],
      ['GB, PBB, SBB y RBB: las barras','GB puede aparecer en un plano como abreviatura genérica de Grounding Busbar, o barra de tierra. Revisa la leyenda para saber a qué barra se refiere. En telecomunicaciones, PBB (Primary Bonding Busbar) identifica la barra primaria. SBB (Secondary Bonding Busbar) identifica la barra secundaria que sirve al espacio de telecomunicaciones, por ejemplo, al cuarto de una planta.','En planos antiguos puedes encontrar TMGB para la barra primaria y TGB para la secundaria. La RBB (Rack Bonding Busbar) es la barra de unión del propio rack, cuando el diseño la contempla. Sirve como punto común para las conexiones de los equipos del rack.'],
      ['TBB, TBC y TEBC: los conductores','El TBB (Telecommunications Bonding Backbone) es el conductor troncal de unión equipotencial. En un edificio con varias salas, enlaza la PBB con las SBB según el trazado del proyecto. Se puede recorrer entre plantas junto a otras instalaciones, pero su función es unir las barras.','El TBC (Telecommunications Bonding Conductor) integra la barra primaria con el sistema de tierra de la instalación eléctrica del edificio. El TEBC (Telecommunications Equipment Bonding Conductor) conecta los racks o sus barras con la red de unión del cuarto. Cuando hay varios TBB, el proyecto puede contemplar un BBC (Backbone Bonding Conductor) para interconectarlos.'],
      ['Qué piezas revisar','Rack, bandejas, paneles metálicos y sistemas blindados pueden requerir conexiones específicas. No supongas que el blindaje queda correctamente conectado por tocar una carcasa. La continuidad y la ruta de unión se diseñan y verifican.'],
      ['Leer el esquema de un rack','Empieza por el rack y sigue el conductor hasta la barra designada para telecomunicaciones. Desde allí, el proyecto define cómo se integra la barra al sistema de tierra del edificio. Verás también si el panel, las bandejas o las puertas requieren conexiones propias. Una unión visualmente continua puede estar interrumpida por pintura, bisagras o uniones mecánicas no previstas para conducir.'],
      ['Cómo se relaciona con el blindaje','El blindaje ayuda a controlar interferencias cuando el canal utiliza componentes compatibles y conserva continuidad a través de conectores y paneles. La unión equipotencial se diseña para las partes conductoras de la infraestructura. Si cambias un panel blindado por otro modelo, revisa sus puntos de unión y cómo termina el blindaje de los cables.'],
      ['Qué revisar al recibir el trabajo','Compara el plano con los puntos de unión previstos, comprueba que sean accesibles e identifica en el registro el rack y la barra que le corresponde. El personal competente verifica las conexiones y realiza las mediciones que indique el proyecto eléctrico. Solicita esos resultados como parte de la entrega.'],
      ['Ejercicio','Un plano muestra una PBB en la sala principal, una SBB en el segundo piso y una barra en el rack de ese piso. Identifica los elementos del recorrido. El TBB une la PBB con la SBB. El TEBC conecta la barra del rack con la red de unión del cuarto. El TBC enlaza la barra primaria con la tierra del edificio. Si en el plano la barra del segundo piso solo dice GB, consulta su leyenda para confirmar que cumple la función de SBB.']]},
    {title:'Del diseño a la entrega', model:'handover', standard:'TIA-568 · TIA-569 · TIA-606 · TIA-607',
      lead:'Organiza una instalación de principio a fin con cantidades verificables, planos actualizados y resultados de prueba que se puedan rastrear.', sections:[
      ['Planificar','Define puestos, puertos, espacios, canalizaciones, cable, categoría, posibles necesidades de PoE y crecimiento. Coordina alimentación, tierra y accesibilidad antes de instalar.'],
      ['Construir','Tira cables sin exceder límites, termina de acuerdo con el producto, ordena rack y tomas, etiqueta ambos extremos y registra cualquier cambio en el recorrido.'],
      ['Armar el inventario','Para un piso con 12 puestos de dos tomas, dos puntos de acceso y dos impresoras, cuenta 28 enlaces fijos. Si se acuerda una reserva de cuatro, considera 32 posiciones en el panel. Revisa por separado cuántos puertos activos y cuánta potencia PoE se necesitan para los equipos que funcionarán al entregar.'],
      ['Registrar los cambios de obra','Si una canalización queda bloqueada, anota los enlaces afectados y mide la ruta alternativa antes de instalarla. Actualiza los planos conforme a obra con la ubicación final, no con el recorrido previsto inicialmente. El cambio puede afectar los metros de cable, la ocupación de la bandeja y el acceso cuando haya que reparar.'],
      ['Entregar con criterios verificables','Comprueba cada enlace con el instrumento y el límite acordados. Relaciona el resultado con el código de panel y toma. Prepara un inventario de errores y pendientes, corrige cada falla, guarda el resultado final y entrega los planos, registros, configuración de puertos si corresponde y documentación de los equipos.'],
      ['Ejercicio','El proyecto contempla 28 enlaces y hay 27 informes aprobados. Compara los identificadores del panel con los informes para ubicar el enlace que falta. Si aún no lo has probado, déjalo marcado como pendiente y certifícalo antes de contabilizarlo entre los entregados.']]}
  ]},
  {title:'Ethernet y comprobación', modules:[
    {title:'Ethernet y PoE', model:'ethernet', standard:'IEEE 802.3',
      lead:'Comprueba qué velocidad permite el enlace y cuánta potencia puede entregar el switch a los equipos que se alimentan por el cable de red.', sections:[
      ['Infraestructura y aplicación','IEEE 802.3 define tecnologías Ethernet, incluidas variantes de transmisión sobre cobre y alimentación por Ethernet. TIA-568 describe el cableado estructurado que puede soportarlas. Distingue la prestación del canal de la capacidad de los equipos conectados.'],
      ['PoE','La energía viaja por los conductores del enlace junto con los datos. Hay que considerar equipo que entrega energía, equipo alimentado, cable, conexiones y acumulación térmica en haces. No basta con que el cable «funcione con datos» para asumir cualquier nivel de potencia.'],
      ['Velocidad y estado del puerto','Revisa las velocidades que admiten ambas interfaces y la velocidad que quedó negociada. Si un computador esperaba 1 Gb/s y enlaza a 100 Mb/s, comprueba la capacidad y configuración de ambos puertos, los cordones y el mapa de hilos. 100BASE-TX utiliza dos pares y 1000BASE-T utiliza cuatro, así que un enlace que funciona a 100 Mb/s todavía puede tener una falla en un par.'],
      ['De dónde sale la potencia','El PSE es el equipo que entrega energía, como un switch PoE o un inyector compatible. El PD es el equipo alimentado, como una cámara o un punto de acceso. El PSE detecta un equipo compatible y asigna potencia conforme al mecanismo previsto. Verifica el estándar y la clase del equipo, además de la caída de potencia a lo largo del canal.'],
      ['Potencia por puerto y presupuesto total','Compara la potencia que requiere cada dispositivo con la que puede entregar su puerto. Después suma la potencia reservada por el equipo alimentador. Si cuatro puntos de acceso reservan 20 W cada uno y seis cámaras reservan 12 W cada una, la asignación total es 152 W. Un switch con 150 W disponibles queda 2 W por debajo del ejemplo.','Considera también el arranque conjunto, la longitud del canal y la temperatura de los haces. Anota qué dispositivos deben mantenerse activos y cuánto margen pide el proyecto.'],
      ['Ejercicio','Un punto de acceso funciona con alimentación externa y se reinicia al activar todas sus radios cuando usa PoE. Revisa los eventos y la potencia asignada al puerto, la clase que pide el equipo y el presupuesto del switch. Si la potencia está dentro de lo previsto, prueba con un cordón compatible y revisa el canal.']]},
    {title:'Mapa de hilos y fallas', model:'tester', standard:'TIA-568',
      lead:'Interpreta el mapa pin por pin y usa el resultado para decidir dónde buscar una falla antes de rehacer una terminación.', sections:[
      ['Primera comprobación','Un probador de mapa de hilos detecta circuitos abiertos, cortos, inversiones y conexiones cruzadas. Selecciona una falla en el modelo para comparar la conexión esperada con la observada.'],
      ['Par dividido','Puede ocurrir que todos los pines coincidan extremo a extremo, pero los conductores no conserven sus pares físicos. La continuidad simple no detecta necesariamente este problema; la geometría afecta la diafonía.'],
      ['Cómo leer cada falla','En un enlace directo, el pin 1 local debe llegar al pin 1 remoto y así sucesivamente. Un abierto indica falta de continuidad. En un corto, dos conductores hacen contacto. Si los pines 1 y 2 llegan intercambiados, el par está invertido. Si el par 1–2 llega al par 3–6 y viceversa, los pares están cruzados. Revisa si esa disposición era parte del diseño antes de corregirla.'],
      ['Dónde empezar a buscar','Desconecta el enlace de los equipos antes de usar un probador de cable y coloca el remoto en la toma que corresponde. Si la falla aparece con los cordones y desaparece al comprobar el enlace fijo, revisa los cordones por separado. En el enlace fijo, inspecciona primero el asiento de los conductores y el orden A/B en ambos extremos.','Si un abierto vuelve después de rehacer ambas terminaciones, consulta la distancia aproximada a la falla, si el instrumento la informa. Compárala con los tramos del plano para priorizar curvas, registros o zonas donde se hizo obra.'],
      ['Ejercicio','El mapa muestra 1→1 hasta 8→8, pero el instrumento informa un par dividido. Comprueba si se usó un conductor de otro par físico para completar alguno de los pares de pines, por ejemplo 3–6. Conserva cada pareja de colores del mismo trenzado, vuelve a terminar el extremo que corresponda y repite la prueba.']]},
    {title:'Certificación e interpretación', model:'certify', standard:'TIA-568',
      lead:'Lee un informe de certificación, identifica qué parámetro falló y guarda el resultado bajo el código del enlace que se probó.', sections:[
      ['Qué cambia frente a continuidad','La certificación comprueba parámetros eléctricos del enlace respecto de un límite definido para su categoría y configuración. Puede incluir longitud, pérdida de inserción, diafonía y pérdida de retorno, entre otras mediciones. Un probador básico de hilos no sustituye esta evaluación.'],
      ['Leer el resultado','Confirma si se probó enlace permanente o canal, categoría y límite elegido, adaptadores usados y margen de cada parámetro. Un «PASS» con el límite equivocado no demuestra cumplimiento del proyecto.'],
      ['Qué mide cada parámetro','La pérdida de inserción indica cuánto se atenúa la señal al atravesar el enlace. NEXT mide cuánto se acopla la señal de un par a otro, observado desde el mismo extremo donde se transmite. La pérdida de retorno se relaciona con la energía reflejada por cambios de impedancia, por ejemplo debido a una terminación deficiente o al daño del cable.','El equipo compara cada resultado con el límite correspondiente a su frecuencia. Revisa el margen y el par implicado, junto con el extremo de la medición cuando el informe lo muestre. Un parámetro cerca del límite ayuda a orientar la inspección, incluso si el resultado global aprueba.'],
      ['Preparar la medición','Identifica la toma y el puerto del panel. Selecciona la categoría, el tipo de prueba y los adaptadores correspondientes. Para una obra nueva que entrega el tramo fijo, normalmente se certifica como enlace permanente. Si necesitas evaluar los cordones instalados junto con ese tramo, utiliza la configuración de canal.'],
      ['Investigar un resultado fallido','Supón que el mapa de hilos y la longitud pasan, pero NEXT falla. Revisa cuánto se destrenzaron los pares y cómo quedaron asentados en el jack y en el panel. Si falla pérdida de retorno, inspecciona también curvas, daños y compatibilidad de componentes. Repite la prueba con el mismo límite después de la corrección y anota qué cambiaste.'],
      ['Ejercicio','Hay dos informes para una misma toma. Uno dice PASS con límite de canal y otro dice FAIL con límite de enlace permanente. Si el contrato pide certificar el enlace permanente, revisa los adaptadores y el límite del segundo informe, corrige la causa si la prueba es válida y conserva la evidencia de la nueva medición.']]}
  ]}
];

const $ = (s, root=document) => root.querySelector(s);
const cabSources = {'TIA-568':'https://tiaonline.org/standard/tia-568/','TIA-569':'https://tiaonline.org/standard/tia-569/','TIA-606':'https://tiaonline.org/standard/tia-606/','TIA-607':'https://tiaonline.org/standard/tia-607/','IEEE 802.3':'https://www.ieee802.org/3/'};
function standardLinks(value){return value.split(' · ').map(name=>`<a href="${cabSources[name]}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join(' · ')}
const wireColors = ['#f5f5ee','#ef922a','#f5f5ee','#2da759','#f5f5ee','#3479bd','#f5f5ee','#87624a'];
const wireNames = ['B/N','N','B/V','V','B/A','A','B/M','M'];
function cableSvg(type='U/UTP') {
  const globalFoil = ['F/UTP','SF/UTP'].includes(type), globalBraid=['S/FTP','S/UTP','SF/UTP'].includes(type), pairFoil=['S/FTP','U/FTP'].includes(type);
  const pairs=[[92,94,'#ef922a'],[188,94,'#2da759'],[92,187,'#3479bd'],[188,187,'#87624a']];
  const pairAngles={'U/UTP':[0,0,0,0],'F/UTP':[5,-6,-4,6],'S/FTP':[-5,4,6,-4],'U/FTP':[6,-5,4,-6],'S/UTP':[-4,6,5,-5],'SF/UTP':[4,-4,-6,5]};
  return `<svg class="cable-model" viewBox="0 0 280 280" role="img" aria-label="Corte esquemático del cable ${type}"><defs><radialGradient id="coat"><stop offset="70%" stop-color="#263b4a"/><stop offset="90%" stop-color="#11202b"/><stop offset="100%" stop-color="#69a3b4"/></radialGradient><pattern id="braid" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" stroke="#a9c4c8" stroke-width=".8" opacity=".65"/></pattern></defs><circle cx="140" cy="140" r="132" fill="url(#coat)" stroke="#74b8ca" stroke-width="2"/><circle cx="140" cy="140" r="111" fill="#0b1822" stroke="#607987" stroke-width="2"/>${globalBraid?'<circle cx="140" cy="140" r="108" fill="none" stroke="url(#braid)" stroke-width="15"/>':''}${globalFoil?'<circle cx="140" cy="140" r="100" fill="none" stroke="#b8bec7" stroke-width="9"/>':''}<path d="M140 47V233M47 140H233" stroke="#607d86" stroke-width="18" stroke-linecap="round"/><path d="M140 47V233M47 140H233" stroke="#b5cbd0" stroke-width="7" stroke-linecap="round"/>${pairs.map(([x,y,c],i)=>{const angle=pairAngles[type][i];return `<g>${pairFoil?`<circle cx="${x+10}" cy="${y+7}" r="43" fill="#9ca5ad" fill-opacity=".24" stroke="#d4e1e6" stroke-width="5"/>`:''}<g transform="rotate(${angle} ${x+10} ${y+7})"><circle cx="${x-5}" cy="${y-5}" r="19" fill="${c}" stroke="#dae7e8" stroke-width="2"/><circle cx="${x+24}" cy="${y+19}" r="19" fill="#e4e7e4" stroke="${c}" stroke-width="4"/><circle cx="${x-5}" cy="${y-5}" r="8" fill="#bf8457"/><circle cx="${x+24}" cy="${y+19}" r="8" fill="#bf8457"/></g></g>`}).join('')}</svg>`;
}
function cabUseIcon(kind){
  const paths={
    phone:'<path d="M8 5.5c0 7.3 5.2 12.5 12.5 12.5l1.6-3.1-3.7-2-1.7 1.8a10.2 10.2 0 0 1-4.4-4.4l1.8-1.7-2-3.7L8 5.5Z"/><path d="M17.5 5.5a5 5 0 0 1 5 5"/>',
    legacy:'<rect x="4.5" y="5" width="23" height="17" rx="1.5"/><path d="M10 27h12M16 22v5M9 10h6l-3 3 3 3M18 16h5"/>',
    home:'<path d="m3.5 14 12.5-10 12.5 10V28H3.5V14Z"/><path d="M11 28v-9h10v9M9 14h2M21 14h2"/>',
    office:'<rect x="7" y="3.5" width="18" height="25" rx="1.5"/><path d="M12 8h3m4 0h2m-9 5h3m4 0h2m-9 5h3m4 0h2m-8 10v-5h6v5"/>',
    server:'<rect x="5" y="3.5" width="22" height="25" rx="2"/><path d="M5 11.5h22M5 20h22M10 7.5h1m-1 8h1m-1 8.5h1M16 7.5h6M16 16h6M16 24h6"/>'
  };
  return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]}</svg>`;
}
function rackRailsSvg(){
  const holes = Array.from({length:6}, (_, unit) =>
    [50, 72, 94].map(offset => offset + (unit-1) * 62)
  ).flat().filter(y => y >= 22 && y <= 328);
  return [77, 683].map(x => `<g transform="translate(${x} 0)">
    <rect x="-14" y="15" width="28" height="320" rx="1.5" fill="#202f36" stroke="#597079"/>
    <path d="M-13 16h5v318h-5z" fill="#536970"/>
    <path d="M10 16h3v318h-3z" fill="#122127"/>
    ${holes.map(y => `<g transform="translate(0 ${y})">
      <rect x="-4.5" y="-4.5" width="9" height="9" rx=".55" fill="#080e12" stroke="#819298" stroke-width=".65"/>
      <path d="M-3.8 3.8h7.6" stroke="#4b656e" stroke-width=".8"/>
    </g>`).join('')}
  </g>`).join('');
}

function rackMountsSvg(top, bottom, screws, innerEdges){
  return [77, 683].map((x, side) => {
    const left = Math.min(x-11, innerEdges[side]);
    const right = Math.max(x+11, innerEdges[side]);
    return `<g>
      <rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}" rx="2" fill="url(#rack-ear)" stroke="#647780" stroke-width=".8"/>
      <path d="M${left+2} ${top+2}h${right-left-4}" stroke="#91a4aa" opacity=".55"/>
      ${screws.map(y => `<g transform="translate(${x} ${y})">
        <rect x="-6.2" y="-3.9" width="12.4" height="7.8" rx="3.9" fill="#0c151b"/>
        <circle r="3.5" fill="#aebac0" stroke="#384953" stroke-width=".7"/>
        <path d="M-1.65 0h3.3M0-1.65v3.3" stroke="#25343a" stroke-width=".9" stroke-linecap="round"/>
      </g>`).join('')}
    </g>`;
  }).join('');
}

function linkMadePanelSvg(){
  const banks = Array.from({length:4}, (_, bank) => {
    const x = 106 + bank * 142;
    return `<g transform="translate(${x} 0)">
      <rect y="78" width="135" height="31" rx="1.5" fill="#25292a" stroke="#3c4243" stroke-width=".7"/>
      <path d="M2 80h131" stroke="#494e50" stroke-width=".7"/>
      ${Array.from({length:6}, (_, column) => {
        const portX = 2 + column * 22;
        const port = bank * 6 + column + 1;
        return `<g transform="translate(${portX} 0)">
          <rect y="68" width="20" height="7" fill="#cdd0cd" stroke="#f1f3ef" stroke-width=".45"/>
          <path d="M2 86h16v11h-3v4H5v-4H2z" fill="#050809" stroke="#151b1d" stroke-width="1.1"/>
          <path d="M4 88h12m-10 1v3m2-3v3m2-3v3m2-3v3m2-3v3" stroke="#62665a" stroke-width=".55" opacity=".65"/>
          <path d="M5 103h10" stroke="#474d4d" stroke-width=".65"/>
          <text x="10" y="116" text-anchor="middle" fill="#e4e7e4" font-size="6">${port}</text>
        </g>`;
      }).join('')}
    </g>`;
  }).join('');
  return `<g class="cab-rack-panel" font-family="Arial, sans-serif">
    <path d="M68 66 76 62H686l6 4z" fill="#666f71"/>
    <rect x="66" y="66" width="628" height="54" rx="3.5" fill="url(#panel-metal)" stroke="#515c60" stroke-width=".8"/>
    <path d="M69 118h622M103 68v49m575-49v49" stroke="#343c3f" stroke-width=".7"/>
    ${banks}
    ${[77,683].map(x => `<g transform="translate(${x} 0)">
      ${[72,112].map(y => `<g transform="translate(0 ${y})">
        <rect x="-5.7" y="-2.8" width="11.4" height="5.6" rx="2.8" fill="#080d10" stroke="#4e585a" stroke-width=".6"/>
        <circle r="2.55" fill="#a8b4b9" stroke="#36454b" stroke-width=".55"/>
        <path d="M-1.15 0h2.3M0-1.15v2.3" stroke="#26333a" stroke-width=".7"/>
      </g>`).join('')}
    </g>`).join('')}
    <g transform="translate(69 82)">
      <rect width="27" height="18" rx="1" fill="#c96c2b"/>
      <text x="13.5" y="8" text-anchor="middle" font-size="7.4" font-weight="900" fill="#16100c">LINK</text>
      <text x="13.5" y="15" text-anchor="middle" font-size="6.8" font-weight="900" fill="#16100c">» MADE</text>
    </g>
  </g>`;
}

function catalyst2960PlusSvg(){
  function jack(x, y, uplink = false){
    const rim = uplink ? '#e0d295' : '#cad0ca';
    return `<g transform="translate(${x} ${y})">
      <rect width="18" height="15" rx=".65" fill="${rim}" stroke="#687675" stroke-width=".45"/>
      <path d="M1.6 1.7h14.8v9h-2.7v2H4.3v-2H1.6z" fill="#080f11"/>
      <path d="M2.5 2.4h13v1.2h-13z" fill="#536060"/>
      ${Array.from({length:8},(_,pin)=>`<path d="M${4+pin*1.42} 4v3.5" stroke="#d9b971" stroke-width=".62"/>`).join('')}
      <path d="M2 10.7h2.3v2h9.4v-2H16" fill="none" stroke="#7d8989" stroke-width=".55"/>
    </g>`;
  }
  const blocks = [333, 456].map((x, bank)=>`<g>
    <rect x="${x-2}" y="245" width="117" height="31" rx="1" fill="#aeb8b2"/>
    <path d="M${x-2} 260.5h117" stroke="#f0f1e7" stroke-width=".7"/>
    ${Array.from({length:6},(_,column)=>{
      const portX = x + column * 19;
      const number = bank * 12 + column * 2 + 1;
      return `<g>
        <rect x="${portX}" y="234" width="18" height="6" rx=".5" fill="#e3d698"/>
        <text x="${portX+9}" y="238.6" text-anchor="middle" fill="#303429" font-size="4.5">${number} · ${number+1}</text>
        ${jack(portX,245)}${jack(portX,261)}
        <path d="M${portX+4} 278v3m9-3v3" stroke="#c9b56d" stroke-width=".85"/>
      </g>`;
    }).join('')}
  </g>`).join('');
  return `<g class="cab-rack-switch" font-family="Arial, sans-serif">
    <defs>
      <linearGradient id="cab-switch-top" x2="0" y2="1"><stop stop-color="#67767a"/><stop offset="1" stop-color="#3b4b50"/></linearGradient>
      <linearGradient id="cab-switch-face" x2="0" y2="1"><stop stop-color="#495253"/><stop offset=".85" stop-color="#343e40"/><stop offset="1" stop-color="#273539"/></linearGradient>
    </defs>
    <path d="M93 231 114 215H661L640 231Z" fill="url(#cab-switch-top)" stroke="#778588" stroke-width=".8"/>
    <path d="M640 231 661 215v59l-21 16Z" fill="#283438" stroke="#5f7074" stroke-width=".8"/>
    <path d="M645 237l11-8m-11 13 11-8m-11 13 11-8m-11 13 11-8m-11 13 11-8m-11 13 11-8" stroke="#131c20" stroke-width="1.25"/>
    <rect x="93" y="231" width="547" height="59" rx="2.5" fill="url(#cab-switch-face)" stroke="#5c8995" stroke-width="1.6"/>
    <path d="M95 288h543" stroke="#15262d"/>
    <rect x="97" y="234" width="26" height="52" rx="2" fill="#1b292d" stroke="#6e8486" stroke-width=".65"/>
    <path d="M102 242v3m2-5v6m2-7v7m2-6v6m2-4v3" stroke="#afc5c5" stroke-width=".65"/>
    <text x="111" y="249" text-anchor="middle" fill="#d5e5e2" font-size="4.7" font-weight="700">CISCO</text>
    ${['SYST','RPS','STAT','DUPLX','SPEED','PoE'].map((label,i)=>`<g transform="translate(101 ${253+i*4.4})"><rect width="4" height="1.6" rx=".5" fill="${i===0?'#9de598':'#71807b'}"/><text x="6" y="1.9" fill="#bccbc7" font-size="3.15">${label}</text></g>`).join('')}
    <rect x="108" y="280.5" width="10" height="3" rx=".6" fill="#45575a" stroke="#70898e" stroke-width=".5"/>
    ${blocks}
    ${[581,609].map((x,i)=>`<g>
      <title>Uplink ${i+1}: ranura SFP y puerto RJ45 de uso alternativo</title>
      <text x="${x+9}" y="249" text-anchor="middle" fill="#e0d9ac" font-size="5">${i+1}</text>
      <rect x="${x}" y="251" width="18" height="9" rx=".7" fill="#aebcb9" stroke="#617476" stroke-width=".6"/>
      <rect x="${x+1.5}" y="252.3" width="15" height="6" fill="#0a1318"/>
      <path d="M${x+2.5} 253.6h13m-13 3.7h13" stroke="#56676a" stroke-width=".55"/>
      ${jack(x,263,true)}
    </g>`).join('')}
    <path d="M567 232h70v11h-60Z" fill="#21596b"/>
    <text x="634" y="239.8" text-anchor="end" fill="#edf5ef" font-size="5.8" font-weight="700">Catalyst 2960-Plus</text>
  </g>`;
}

function continuityGameHtml(){
  const indicators = (side, lensX, textX, firstY) =>
    ['1','2','3','4','5','6','7','8','G'].map((label,index) => {
      const y = firstY + index * 28;
      return `<g>
        <text x="${textX}" y="${y+5}" text-anchor="middle">${label}</text>
        <rect class="ct-led" data-ct-led="${side}-${label}" x="${lensX}" y="${y-4}" width="19" height="8" rx="3.6"/>
        <path d="M${lensX+3} ${y-2}h13" stroke="#b3e4a6" stroke-opacity=".24" stroke-width="1"/>
      </g>`;
    }).join('');
  const plug = (side,x,y) => `<g transform="translate(${x} ${y})" clip-path="url(#ct-port-lip)">
    <g class="ct-plug" data-ct-plug="${side}">
      <path d="M-7-32h14l3 9v8h-20v-8z" fill="#427fa1" stroke="#244d67" stroke-width="1.2"/>
      <path d="M-8-23H8m-9 4h18" stroke="#87b9d0" stroke-opacity=".65" stroke-width="1.2"/>
      <path d="M-16-16h32l2 5v24l-3 3h-30l-3-3v-24z" fill="url(#ct-plug)" stroke="#e3eeea" stroke-width="1.1"/>
      <path d="M-13-9h26v19h-26z" fill="#53656a" fill-opacity=".7"/>
      ${['#f8e4cc','#e58d48','#edf0cc','#6a9ac0','#dbe7ef','#73a779','#e5dbca','#8b6851'].map((color,i) => {
        const channel = -10.5 + i * 3;
        return `<path d="M${channel} -8v15" stroke="${color}" stroke-width="1.55"/><rect x="${channel-.85}" y="7" width="1.7" height="7.5" rx=".35" fill="#d5a648" stroke="#f8da87" stroke-width=".36"/>`;
      }).join('')}
      <path d="M-15-12v26m30-26v26M-14-13h28" fill="none" stroke="#f1faf6" stroke-opacity=".78"/>
      <path d="M1-16h7l9 25-4 2L5-9H1z" fill="#e9f4eb" fill-opacity=".58" stroke="#edf6f0" stroke-width=".65"/>
    </g>
  </g>`;
  const cable = (side, path) => `<g class="ct-cord" data-ct-cord="${side}">
    <path d="${path}" fill="none" stroke="#172934" stroke-width="13"/>
    <path d="${path}" fill="none" stroke="url(#ct-cable)" stroke-width="10"/>
    <path d="${path}" fill="none" stroke="#80c7e4" stroke-opacity=".37" stroke-width="2"/>
  </g>`;
  return `<section class="ct-game" data-ct-game aria-labelledby="ct-title">
    <h2 id="ct-title">Prueba el patch cord</h2>
    <p>Conecta ambos extremos del patch cord. Mueve el interruptor a ON o S-ON, observa el barrido y decide si el cable pasa la prueba.</p>
    <div class="ct-stage">
      <svg viewBox="0 0 640 815" role="group" aria-label="Tester NSHL468 con unidades MASTER y REMOTE">
        <defs>
          <linearGradient id="ct-shell" x2=".22" y2="1">
            <stop stop-color="#e9e6de"/><stop offset=".47" stop-color="#dcd9d1"/><stop offset="1" stop-color="#c0bab0"/>
          </linearGradient>
          <linearGradient id="ct-remote" x2="1" y2=".1">
            <stop stop-color="#c8c4bb"/><stop offset=".15" stop-color="#e5e1d9"/><stop offset=".79" stop-color="#d8d3ca"/><stop offset="1" stop-color="#b5aea4"/>
          </linearGradient>
          <linearGradient id="ct-side" x2="1" y2=".1">
            <stop stop-color="#948e84"/><stop offset=".46" stop-color="#c5bfb5"/><stop offset="1" stop-color="#aaa399"/>
          </linearGradient>
          <linearGradient id="ct-face" x2=".78" y2="1">
            <stop stop-color="#00773c"/><stop offset=".34" stop-color="#078449"/><stop offset=".73" stop-color="#006932"/><stop offset="1" stop-color="#00793c"/>
          </linearGradient>
          <linearGradient id="ct-slider" x2="1" y2="0">
            <stop stop-color="#b8b1a7"/><stop offset=".25" stop-color="#f4eee4"/><stop offset=".68" stop-color="#e7dfd4"/><stop offset="1" stop-color="#aaa195"/>
          </linearGradient>
          <linearGradient id="ct-plug" x2="1" y2=".2">
            <stop stop-color="#839ba1"/><stop offset=".5" stop-color="#d5e1d9"/><stop offset="1" stop-color="#637f88"/>
          </linearGradient>
          <radialGradient id="ct-shadow"><stop stop-color="#0a100d" stop-opacity=".78"/><stop offset="1" stop-color="#0a100d" stop-opacity="0"/></radialGradient>
          <linearGradient id="ct-cable" gradientUnits="userSpaceOnUse" x1="0" y1="19" x2="0" y2="114">
            <stop stop-color="#234e72"/><stop offset=".45" stop-color="#69afd3"/><stop offset="1" stop-color="#2b6d97"/>
          </linearGradient>
          <clipPath id="ct-port-lip"><rect x="-31" y="-115" width="62" height="116"/></clipPath>
        </defs>
        <ellipse cx="325" cy="756" rx="308" ry="41" fill="url(#ct-shadow)"/>
        ${cable('master','M302 23C248 23 193 22 193 62')}
        ${cable('remote','M302 23C356 23 442 16 442 49')}
        <path d="M61 153Q63 140 91 136L295 125Q349 122 384 137L397 718Q390 751 323 760L105 752Q55 748 54 723Z" fill="url(#ct-shell)" stroke="#b1a99e" stroke-width="1.3"/>
        <path d="M63 150Q68 143 91 139L296 128Q351 125 379 137" fill="none" stroke="#fff9ee" stroke-opacity=".63" stroke-width="3"/>
        <path d="M370 132Q384 130 395 140L405 726 380 745 374 712Z" fill="url(#ct-side)"/>
        <path d="M58 725Q112 741 230 745Q334 749 381 727" fill="none" stroke="#a7a197" stroke-opacity=".58" stroke-width="2.5"/>
        <path d="M93 196Q93 180 108 178Q208 163 319 173Q338 174 339 189L333 601Q332 620 315 624Q232 639 169 632Q146 628 152 606L178 506Q187 469 163 454Q142 438 106 446Q97 449 97 436Z" fill="url(#ct-face)" stroke="#4b9f66" stroke-width="1.25"/>
        <path d="M101 195Q98 184 112 181Q224 168 320 176" stroke="#8bbb84" stroke-opacity=".55" stroke-width="2" fill="none"/>
        <path d="M386 139Q407 115 462 115Q528 111 566 135L586 726Q573 756 523 764Q441 772 390 744L380 728Z" fill="url(#ct-remote)" stroke="#aea99e" stroke-width="1.1"/>
        <path d="M545 124Q577 121 608 138L610 290Q605 299 609 312L610 376Q606 382 609 395L605 735Q592 749 566 746L557 712Z" fill="url(#ct-side)" stroke="#aaa298"/>
        <path d="M566 136Q574 132 581 140L582 723Q582 737 574 741L564 727Z" fill="#eee9df" opacity=".67"/>
        <path d="M386 143Q410 119 464 118Q505 116 536 124" fill="none" stroke="#f6efe4" stroke-opacity=".63" stroke-width="3"/>
        <path d="M398 735Q488 766 561 738" fill="none" stroke="#ada69d" stroke-opacity=".64" stroke-width="2"/>
        <path d="M407 174Q454 141 512 163Q520 166 520 172L517 600Q514 606 506 609Q451 631 404 604Q400 602 400 591Z" fill="url(#ct-face)" stroke="#4c9f66" stroke-width="1.3"/>
        <path d="M171 132h44l-3 10h-38zM420 119h44l-3 10h-38z" fill="#a9a69d" stroke="#eee8de" stroke-width="1.2"/>
        <path d="M175 133h36l-2 7h-32zM424 120h36l-2 7h-32z" fill="#303632"/>
        ${plug('master',193,140)}${plug('remote',442,127)}
        <g class="ct-print" fill="#c3e7c7" font-family="Arial, sans-serif">
          <text x="108" y="239" font-size="18">CABLE</text>
          <text x="107" y="265" font-size="18">TESTER</text>
          <text x="209" y="233" font-size="17">RJ45 + RJ11</text>
          <text x="409" y="216" font-size="16">RJ11+ RJ45</text>
          <g font-size="16">${indicators('master',250,235,264)}${indicators('remote',443,473,264)}</g>
          <path d="M278 262h5v142h-5M435 262h-5v142h5" fill="none" stroke="#b8e2bf" stroke-width="1.7" stroke-linecap="round"/>
          <text x="202" y="537" font-size="21" letter-spacing=".4">MASTER</text>
          <text x="203" y="561" font-size="17">NSHL468</text>
          <text x="175" y="600" font-size="15">CPJ20 12T 0318</text>
          <text x="414" y="527" font-size="19" letter-spacing=".6">REMOTE</text>
          <text x="414" y="552" font-size="17">NSHL468</text>
        </g>
        <g transform="translate(129 321)">
          ${Array.from({length:8},(_,i)=>`<rect class="ct-power-mark" x="-1.3" y="-15" width="2.6" height="5" rx="1.1" transform="rotate(${i*45})"/>`).join('')}
          <circle r="4.5" fill="#135733"/>
        </g>
        <rect x="104" y="468" width="56" height="20" rx="3" fill="#9c978f"/>
        <path d="M106 488H159" stroke="#ede7dc" stroke-width="2"/>
        <rect class="ct-knob" x="106" y="467" width="19" height="22" rx="2.5" fill="url(#ct-slider)" stroke="#b4ada1" stroke-width="1"/>
        <g fill="#474941" font-family="Arial, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle">
          <text x="115.5" y="503">OFF</text>
          <text x="132.5" y="503">ON</text>
          <text x="148.5" y="503">S-ON</text>
        </g>
        <rect data-ct-slider x="95" y="448" width="76" height="61" rx="4" fill="transparent"
          tabindex="0" role="slider" aria-label="Interruptor del tester"
          aria-describedby="ct-switch-tip" aria-valuemin="0" aria-valuemax="2" aria-valuenow="0" aria-valuetext="OFF, apagado"/>
        <g class="ct-switch-tip" id="ct-switch-tip" role="tooltip" font-family="Arial, sans-serif">
          <path d="M185 443H475Q486 443 486 454V500Q486 511 475 511H185Q175 511 175 501V483L165 476L175 469V453Q175 443 185 443Z" fill="#11252c" stroke="#79b99a" stroke-width="1.5"/>
          <text x="190" y="468" fill="#f1fff8" font-size="18" font-weight="700">Desliza para cambiar de modo</text>
          <text x="190" y="493" fill="#c7e6d7" font-size="16">OFF apaga · ON rápido · S-ON lento</text>
        </g>
        <ellipse cx="276" cy="684" rx="34" ry="18" fill="#131815" stroke="#85837a" stroke-width="1.1" transform="rotate(-8 276 684)"/>
        <path d="M272 674a9 9 0 0 0 0 18m16-18a9 9 0 0 0 0 18m-8-9h7" stroke="#e5e6dc" stroke-width="2.7" fill="none" transform="rotate(-8 276 684)"/>
      </svg>
    </div>
    <div class="ct-controls" role="group" aria-label="Conexión y encendido">
      <button type="button" data-ct-connect="master" aria-pressed="false">Conectar MASTER</button>
      <button type="button" data-ct-connect="remote" aria-pressed="false">Conectar REMOTE</button>
    </div>
    <p class="ct-hint">El patch cord es UTP. En el tester, G corresponde al blindaje y queda apagado.</p>
    <div class="ct-controls ct-answer" role="group" aria-label="Diagnóstico del cable">
      <button type="button" data-ct-answer="good" disabled>Cable bueno</button>
      <button type="button" data-ct-answer="bad" disabled>Cable malo</button>
      <button type="button" data-ct-next hidden>Nuevo cable</button>
    </div>
    <p class="ct-status" data-ct-status role="status">Conecta los dos extremos para empezar.</p>
  </section>`;
}

function modelHtml(kind){
  if(kind==='anatomy') return `<div class="cab-model-controls cab-pair-controls" role="group" aria-label="Color del par">${[["Naranja","#ef922a"],["Azul","#3479bd"],["Verde","#2da759"],["Café","#87624a"]].map(([name,color],i)=>`<button type="button" data-pair-color="${color}" data-pair-name="${name}" class="${i===0?'active':''}" aria-pressed="${i===0}"><span class="cab-pair-swatch" style="--pair-swatch:${color}"></span>${name}</button>`).join('')}</div><div class="cab-anatomy" id="cab-pair-model" style="--pair-color:#ef922a"><div class="cab-pair-viewport"><svg viewBox="0 0 680 250" role="img" aria-label="Dos conductores aislados entrelazados forman un par trenzado"><path d="M20 66H660M20 186H660" stroke="#638796" stroke-width="5"/><path d="M20 66C100 66 100 186 180 186S260 66 340 66 420 186 500 186 580 66 660 66" fill="none" stroke="var(--pair-color)" stroke-width="27"/><path d="M20 186C100 186 100 66 180 66S260 186 340 186 420 66 500 66 580 186 660 186" fill="none" stroke="#dce7e6" stroke-width="27"/><path d="M20 66C100 66 100 186 180 186S260 66 340 66 420 186 500 186 580 66 660 66" fill="none" stroke="#ae6d37" stroke-width="5"/><path d="M20 186C100 186 100 66 180 66S260 186 340 186 420 66 500 66 580 186 660 186" fill="none" stroke="#ae6d37" stroke-width="5"/></svg></div><div><strong>Par <span id="cab-pair-name">naranja</span> trenzado</strong><p>Cada línea representa un conductor de cobre con aislamiento. Cuatro pares como este quedan protegidos por la chaqueta del cable.</p><p>El giro de los conductores ayuda a conservar el equilibrio de la señal y a limitar interferencias.</p></div></div>`;
  if(kind==='shield') return `<div class="cab-model-controls" role="group" aria-label="Construcción del cable">${['U/UTP','F/UTP','S/FTP','U/FTP','S/UTP','SF/UTP'].map((v,i)=>`<button type="button" data-cable="${v}" class="${i===0?'active':''}">${v}</button>`).join('')}</div><div class="cab-model-flex"><div id="cab-cable-art">${cableSvg()}</div><div class="cab-model-detail" id="cab-cable-detail"><strong>U/UTP</strong><p>Cuatro pares sin pantalla general ni individual. Modelo Cat 6 con separador interno en cruz. Observa la chaqueta, los pares y las pantallas.</p><ul><li>U: sin blindaje general</li><li>UTP: pares sin blindaje individual</li></ul></div></div><p class="cab-model-caption">Modelo basado en una construcción Cat 6 con separador en cruz. El separador puede variar entre fabricantes y no aparece en todos los cables Cat 6.</p>`;
  if(kind==='categories') return `<p class="cab-list-intro">La frecuencia es el rango hasta el que se especifica o prueba el cableado; no es la velocidad de Internet. La distancia indicada corresponde a un canal completo para el uso señalado, no a cualquier combinación de equipos.</p><div class="cab-cat-table" role="table" aria-label="Categorías históricas y actuales de cable de pares trenzados"><div class="cab-cat-head" role="row"><span>Categoría</span><span>Frecuencia</span><span>Velocidad</span><span>Uso típico</span><span>Alcance del canal</span></div>${[
    ['phone','Cat 1','Sin frecuencia normalizada para Ethernet','Sin velocidad Ethernet definida','Telefonía analógica histórica. Sin fecha formal de obsolescencia: Cat 1 es una denominación informal.','Sin límite Ethernet definido'],
    ['phone','Cat 2','Sin frecuencia Ethernet normalizada','Hasta 4 Mb/s en sistemas históricos','Token Ring y datos antiguos. Sin fecha formal de obsolescencia: Cat 2 es una denominación informal.','Depende de la aplicación antigua'],
    ['phone','Cat 3','16 MHz','10 Mb/s','10BASE-T y telefonía. Para redes nuevas quedó desplazada por categorías posteriores desde mediados de los años 1990.','100 m para 10BASE-T'],
    ['legacy','Cat 4','20 MHz','16 Mb/s','Token Ring. Quedó superada para instalaciones nuevas hacia 1995, con la llegada de Cat 5.','100 m para esa aplicación'],
    ['office','Cat 5','100 MHz','100 Mb/s; algunos enlaces admiten más tras comprobarlos','100BASE-TX e instalaciones antiguas. Cat 5e la sustituyó como referencia para instalaciones nuevas desde 2000.','100 m para 100BASE-TX'],
    ['home','Cat 5e','100 MHz','1 Gb/s','1000BASE-T y cableado existente','100 m para 1000BASE-T'],
    ['home','Cat 6','250 MHz','1 Gb/s; 10 Gb/s en recorridos más cortos según el enlace','Redes de acceso y puestos de trabajo','100 m para 1 Gb/s; para 10 Gb/s, habitualmente hasta 55 m sin blindaje'],
    ['office','Cat 6A','500 MHz','10 Gb/s','10GBASE-T en cableado horizontal','100 m para 10GBASE-T'],
    ['office','Cat 7','600 MHz','10 Gb/s','Clase F de ISO/IEC; no es categoría TIA','100 m para 10GBASE-T con componentes compatibles'],
    ['office','Cat 7A','1000 MHz','10 Gb/s','Clase FA de ISO/IEC; aplicaciones de mayor frecuencia','100 m para 10GBASE-T con componentes compatibles'],
    ['server','Cat 8','2000 MHz','25 o 40 Gb/s','Enlaces cortos en centros de datos','30 m para 25GBASE-T o 40GBASE-T']
  ].map(([icon,name,frequency,speed,use,length])=>`<div class="cab-cat-item" role="row"><strong><span class="cab-cat-icon cab-cat-icon--${icon}" aria-hidden="true">${cabUseIcon(icon)}</span>${name}</strong><span data-label="Frecuencia">${frequency}</span><span data-label="Velocidad">${speed}</span><span data-label="Uso típico">${use}</span><span data-label="Alcance del canal">${length}</span></div>`).join('')}</div><p class="cab-model-caption">Cat 1 y 2 son denominaciones históricas informales. Cat 7 y 7A corresponden a clases ISO/IEC. La velocidad real requiere un enlace instalado y equipos compatibles; en Cat 6, 10 Gb/s depende especialmente de las condiciones del canal.</p>`;
  if(kind==='keystone') return `<div class="cab-component-scene cab-keystone-scene"><svg viewBox="0 0 560 330" role="img" aria-label="Vista frontal de faceplate con toma keystone 8P8C; contactos arriba y pestaña abajo"><defs><linearGradient id="fp-body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".55" stop-color="#e6eceb"/><stop offset="1" stop-color="#aebfc0"/></linearGradient><linearGradient id="fp-bevel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f8faf7"/><stop offset="1" stop-color="#9faeb0"/></linearGradient></defs><rect x="62" y="32" width="436" height="266" rx="26" fill="#6e8589" opacity=".24"/><rect x="58" y="24" width="436" height="266" rx="24" fill="url(#fp-body)" stroke="#d3dedd" stroke-width="3"/><path d="M76 47Q79 39 92 39H461Q477 39 481 54" fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="5"/><rect x="175" y="62" width="202" height="195" rx="16" fill="url(#fp-bevel)" stroke="#84999b" stroke-width="5"/><rect x="188" y="75" width="176" height="169" rx="10" fill="#e1e9e7" stroke="#a7b8b8" stroke-width="2"/><path d="M207 91H345V199H324V220H228V199H207Z" fill="#081218" stroke="#42565c" stroke-width="4"/><path d="M216 100H336" stroke="#647a7b" stroke-width="3"/>${Array.from({length:8},(_,i)=>`<rect x="${218+i*15}" y="103" width="8" height="25" rx="1" fill="#cda762" stroke="#f1d393" stroke-width="1"/>`).join('')}<path d="M214 192H232V213H320V192H338" fill="none" stroke="#18252a" stroke-width="4"/></svg></div><p class="cab-model-caption">Vista frontal didáctica de la toma 8P8C: contactos en la parte superior y espacio para la pestaña del plug abajo.</p>`;
  if(kind==='rack') return `<div class="cab-component-scene cab-rack-scene"><svg viewBox="0 0 760 350" role="img" aria-label="Patch panel LinkMade y Cisco Catalyst 2960-Plus 24PC-L con 24 puertos de acceso y dos uplinks RJ45/SFP"><defs><linearGradient id="panel-metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#283136"/><stop offset=".55" stop-color="#0b1013"/><stop offset="1" stop-color="#222e33"/></linearGradient><linearGradient id="rack-ear" x2="0" y2="1"><stop stop-color="#4c6068"/><stop offset="1" stop-color="#24353d"/></linearGradient></defs>${rackRailsSvg()}${linkMadePanelSvg()}<path d="M118 159H643" stroke="#435d64" stroke-width="8"/>${catalyst2960PlusSvg()}${rackMountsSvg(230,289,[236,280],[93,640])}<path d="M228 95C228 159 342 188 342 251M260 95C260 161 361 184 361 251" fill="none" stroke="#45cbd6" stroke-width="5"/><path d="M304 95C304 153 408 184 418 251" fill="none" stroke="#e7a84e" stroke-width="5"/>${[[342,'#45cbd6'],[361,'#45cbd6'],[418,'#e7a84e']].map(([x,color])=>`<g transform="translate(${x} 250)"><rect x="-4.5" y="-1" width="9" height="6" rx=".7" fill="${color}" fill-opacity=".38" stroke="#b6c6c5" stroke-width=".5"/><path d="M-3-3h6m-6 1.3h6" stroke="${color}" stroke-width="1.1"/></g>`).join('')}</svg></div><p class="cab-model-caption">Modelo didáctico inspirado en un patch panel LinkMade de 24 puertos y un Cisco Catalyst 2960-Plus 24PC-L. Cada uno de sus dos uplinks puede usar el puerto RJ45 o la ranura SFP.</p>`;
  if(kind==='pins') return `<div class="cab-model-controls"><button type="button" data-pin="A" class="active">T568A</button><button type="button" data-pin="B">T568B</button></div><div id="cab-pin-art"></div><p class="cab-model-caption">Vista frontal esquemática del plug 8P8C. Confirma la orientación física antes de terminar.</p>`;
  if(kind==='tester') return `${continuityGameHtml()}<details class="ct-fault-guide"><summary>Explorar otros tipos de falla</summary><div class="cab-model-controls">${['Correcto','Abierto','Invertido','Cruzado','Par dividido'].map((v,i)=>`<button type="button" data-fault="${v}" class="${i===0?'active':''}">${v}</button>`).join('')}</div><div id="cab-tester-art"></div></details>`;
  const diagrams={
    keystone:[['Cable fijo','8 conductores'],['Keystone','Contactos IDC'],['Faceplate','Puerto de usuario']],rack:[['Cable horizontal','Tramo fijo'],['Patch panel','Puerto identificado'],['Patch cord','Conexión flexible'],['Switch','Equipo activo']],cords:[['Switch','Rack'],['Patch cord','Ejemplo: 3 m'],['Panel + cable + toma','Hasta 90 m de enlace permanente'],['Cordón de usuario','Ejemplo: 7 m'],['Computador','Puesto de trabajo']],channel:[['Switch','Fuera del enlace'],['Patch cord','Canal'],['Panel','Inicio enlace fijo'],['Cable horizontal','Enlace fijo'],['Toma','Fin enlace fijo'],['Cordón','Canal'],['Equipo','Fuera del enlace']],horizontal:[['Rack','Sala de telecom.'],['Panel','Terminación'],['Cable horizontal','Hasta 90 m fijo'],['Toma','Área de trabajo'],['Equipo','Canal hasta 100 m']],vertical:[['Sala de equipos','Planta 1'],['Backbone','Interconexión'],['Armario','Planta 2'],['Distribución','Horizontal']],pathways:[['Rack','Espacio técnico'],['Bandeja','Ruta accesible'],['Ducto','Protección'],['Faceplate','Puesto']],labels:[['Panel · P01','Origen'],['Cable · P01','Registro'],['Toma · P01','Destino']],ground:[['Rack · RBB','TEBC hacia la barra del cuarto'],['SBB','TBB hacia la barra primaria'],['PBB','TBC hacia la tierra del edificio'],['Sistema de tierra','Infraestructura eléctrica del edificio']],handover:[['Diseño','Plano y capacidad'],['Instalación','Terminaciones'],['Etiquetas','TIA-606'],['Prueba','Informe']],ethernet:[['Switch PoE','IEEE 802.3'],['Canal','Cobre y conexiones'],['Punto de acceso','Equipo alimentado']],certify:[['Identificador','Puerto y toma'],['Límite de prueba','Categoría y enlace'],['Mediciones','Parámetros'],['Informe','Resultado y margen']],compatibility:[['Cable','Categoría y diámetro'],['Jack','Construcción compatible'],['Cordón','Categoría y pantalla']]};
  return `<div class="cab-flow">${(diagrams[kind]||[]).map(([name,sub],i)=>`<div class="cab-flow-node"><span class="cab-flow-num">${String(i+1).padStart(2,'0')}</span><strong>${name}</strong><small>${sub}</small></div>`).join('<span class="cab-flow-link" aria-hidden="true"></span>')}</div><p class="cab-model-caption">Esquema didáctico. Los componentes y recorridos reales dependen del diseño de la instalación.</p>`;
}
const descriptions={'U/UTP':['Sin pantalla general ni por par.','U: sin blindaje general','UTP: pares sin blindaje individual'],'F/UTP':['Una lámina rodea el conjunto de pares.','F: lámina global','UTP: pares sin pantalla individual'],'S/FTP':['Malla global y lámina en cada par.','S: malla global','FTP: lámina por par'],'U/FTP':['Cada par lleva lámina, sin pantalla global.','U: sin blindaje global','FTP: lámina por par'],'S/UTP':['Malla global, pares sin lámina individual.','S: malla global','UTP: pares sin pantalla individual'],'SF/UTP':['Malla y lámina globales, pares sin pantalla individual.','SF: malla y lámina global','UTP: pares sin pantalla individual']};
function pins(mode){const seq=mode==='A'?['B/V','V','B/N','A','B/A','N','B/M','M']:['B/N','N','B/V','A','B/A','V','B/M','M'];return `<div class="cab-pins">${seq.map((n,i)=>`<div><b>${i+1}</b><span style="--wire:${wireColors[wireNames.indexOf(n)]}"></span><small>${n}</small></div>`).join('')}</div><p class="cab-model-caption">B = blanco con franja de color; N naranja, V verde, A azul, M marrón.</p>`}
function fault(name){const notes={Correcto:'Los pines 1 a 8 llegan al mismo número en el otro extremo.',Abierto:'Un conductor no llega al extremo remoto.',Invertido:'Dos conductores del mismo par intercambian posición.',Cruzado:'Los pares de transmisión se intercambian entre extremos.', 'Par dividido':'El número de pin coincide, pero dos conductores pertenecen a pares físicos distintos.'};return `<div class="cab-test-report"><span>PROBADOR · MAPA DE HILOS</span><strong>${name}</strong><p>${notes[name]}</p><div>${[1,2,3,4,5,6,7,8].map(n=>`<i class="${name==='Abierto'&&n===3?'broken':''}">${n}</i>`).join('')}</div></div>`}
document.addEventListener('click',e=>{const pair=e.target.closest('[data-pair-color]');if(pair){document.querySelectorAll('[data-pair-color]').forEach(b=>{const selected=b===pair;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});const model=$('#cab-pair-model'),art=model.querySelector('svg');art.classList.remove('cab-pair-slide');void art.getBoundingClientRect();art.classList.add('cab-pair-slide');setTimeout(()=>{model.style.setProperty('--pair-color',pair.dataset.pairColor);$('#cab-pair-name').textContent=pair.dataset.pairName.toLowerCase();},150);}const cb=e.target.closest('[data-cable]');if(cb){document.querySelectorAll('[data-cable]').forEach(b=>b.classList.toggle('active',b===cb));const v=cb.dataset.cable,d=descriptions[v];$('#cab-cable-art').innerHTML=cableSvg(v);$('#cab-cable-detail').innerHTML=`<strong>${v}</strong><p>${d[0]}</p><ul><li>${d[1]}</li><li>${d[2]}</li></ul>`;}const pb=e.target.closest('[data-pin]');if(pb){document.querySelectorAll('[data-pin]').forEach(b=>b.classList.toggle('active',b===pb));$('#cab-pin-art').innerHTML=pins(pb.dataset.pin);}const fb=e.target.closest('[data-fault]');if(fb){document.querySelectorAll('[data-fault]').forEach(b=>b.classList.toggle('active',b===fb));$('#cab-tester-art').innerHTML=fault(fb.dataset.fault);}});

