import { connectorDrawing } from "./fiber-connector-model.js?v=20261028-st-detail";
const families = {
  sc: { title: "SC/APC · inserción y extracción", size: "FÉRULA · 2,5 mm", lock: "La carcasa push-pull asegura la conexión. Para retirarla, actúa sobre el cuerpo previsto para ello, no tires del cable.", ferrule: "El cilindro cerámico de 2,5 mm centra la fibra. Su cara frontal lleva el pulido; no se toca.", body: "Carcasa rectangular SC, representada aquí en verde para identificar la terminación APC. La familia SC también existe con otros pulidos." },
  lc: { title: "LC · pestaña de retención", size: "FÉRULA · 1,25 mm", lock: "La pestaña superior se libera antes de extraer el conector. LC es habitual en transceptores y paneles densos.", ferrule: "Férula cerámica de 1,25 mm: la mitad del diámetro habitual en SC. El dibujo está ampliado para reconocer sus piezas.", body: "Cuerpo compacto LC. Un clip puede unir dos conectores para formar un conjunto dúplex." },
  st: { title: "ST · cierre de bayoneta", size: "FÉRULA · 2,5 mm", lock: "El collar se acopla con una bayoneta de giro corto. No es una rosca de vueltas continuas como FC.", ferrule: "Férula cilíndrica de 2,5 mm. El metal exterior no sustituye la función de alineación de la férula.", body: "Cuerpo circular y collar metálico. Se encuentra en instalaciones existentes y entornos de laboratorio." },
  fc: { title: "FC · collar roscado", size: "FÉRULA · 2,5 mm", lock: "El collar roscado asegura la conexión. Primero se alinea la llave del conector y luego se enrosca el collar, sin retorcer el cable.", ferrule: "Férula de 2,5 mm. Aunque tenga el mismo diámetro que SC o ST, el mecanismo exterior es diferente.", body: "Carcasa redonda con collar de agarre moleteado y acoplamiento roscado. No se conecta directamente a una toma ST." },
  mpo: { title: "MPO · varias fibras en una interfaz", size: "FÉRULA · RECTANGULAR MULTIFIBRA", lock: "La llave y la carcasa guían la inserción. También hay que verificar pines, polaridad y cantidad de fibras: no basta con que entre.", ferrule: "La cara rectangular agrupa varias fibras. Esta vista representa una fila de 12 y dos pines metálicos de alineación (variante macho). La variante hembra tiene orificios que reciben esos pines.", body: "Cuerpo rectangular multifibra. MTP es una implementación comercial de la familia MPO, no el nombre de cualquier conector múltiple." },
};
const commonParts = {
  boot: ["Bota y alivio de tensión", "La pieza flexible acompaña la salida del cable y limita esfuerzos cerca del conector. No evita el daño si se dobla o tira en exceso."],
  body: ["Cuerpo del conector", ""], lock: ["Sistema de cierre", ""], ferrule: ["Férula y cara de extremo", ""],
};
function setDetail(lab, title, text) {
  lab.querySelector("[data-fc-detail]").innerHTML = "<strong>" + title + "</strong><p>" + text + "</p>";
}
function selectPart(lab, key) {
  lab.dataset.part = key;
  lab.querySelectorAll("[data-model-part]").forEach(el => el.classList.toggle("is-selected", el.dataset.modelPart === key));
  lab.querySelectorAll("[data-fc-part]").forEach(el => el.setAttribute("aria-pressed", String(el.dataset.fcPart === key)));
  if (lab.dataset.fcViewer === "connector") {
    const f = families[lab.dataset.family];
    setDetail(lab, commonParts[key][0], key === "boot" ? commonParts.boot[1] : f[key]);
  } else {
    setDetail(lab, layers[key][0], layers[key][1]);
  }
}
const polishInfo = {
  flat: ["Flat · pulido plano", "Cara plana, perpendicular al eje. Es un acabado histórico, menos común en las conexiones actuales que PC, UPC y APC; se incluye para comparar la evolución de las terminaciones."],
  pc: ["PC · Physical Contact", "Cara convexa para lograr contacto físico entre fibras. No es un corte plano ni una cámara de aire intencional. La representación amplía la curvatura para poder verla."],
  upc: ["UPC · Ultra Physical Contact", "Mantiene una geometría de contacto sin ángulo intencional; mejora el acabado frente al PC convencional. Aquí se exagera ligeramente la curvatura del UPC para visualizar el contacto: no significa que UPC tenga necesariamente más curvatura que PC. En monomodo, UPC suele identificarse en azul."],
  apc: ["APC · Angled Physical Contact", "Combina contacto físico con una cara inclinada, habitualmente 8° respecto a la perpendicular al eje. La reflexión se desvía de la trayectoria de retorno al núcleo. En monomodo suele identificarse en verde."],
};
function drawPolish(lab, type) {
  lab.dataset.polish = type;
  const angled = type === "apc";
  const face = type === "flat" ? "L492 180" : angled ? "L503.24 180" : type === "upc" ? "Q534 140 492 180" : "Q510 140 492 180";
  lab.querySelector("[data-fc-scene]").innerHTML = '<svg viewBox="0 0 760 290" role="img" aria-label="Perfil ampliado de una férula ' + type.toUpperCase() + '"><text x="35" y="38" class="fc-svg-title">' + polishInfo[type][0] + '</text><rect x="85" y="94" width="78" height="92" rx="9" fill="' + (angled ? "#27814d" : "#246ca1") + '" stroke="#9cbbca"/><path d="M163 100H492' + face + 'H163Z" fill="#c6d5d2" stroke="#799290" stroke-width="2"/><path d="M165 112h309" stroke="#fff" opacity=".4"/><path d="M180 140h' + (type === "flat" ? "312" : angled ? "317.6" : type === "upc" ? "333" : "321") + '" stroke="#2eeaff" stroke-width="4"/><path d="M492 80v120" stroke="#a3b4be" stroke-dasharray="4 5" opacity=".65"/><path d="' + (angled ? "M497.6 140 322 190" : (type === "flat" ? "M492 140H310" : type === "upc" ? "M513 140H310" : "M501 140H310")) + '" stroke="#ff2e7b" stroke-width="2.5" fill="none"/><path d="' + (angled ? "m332 183-10 7 12 1" : "m320 135-10 5 10 5") + '" fill="none" stroke="#ff2e7b" stroke-width="2"/><text x="535" y="117" class="fc-svg-accent">' + (angled ? "8°" : "SIn ángulo".toUpperCase()) + '</text><text x="535" y="143">' + (type === "flat" ? "Cara plana" : angled ? "Cara inclinada" : "Cara convexa") + '</text><text x="35" y="246">CIAN · LUZ INCIDENTE</text><text x="350" y="246">MAGENTA · REFLEXIÓN ORIENTATIVA</text></svg>';
  lab.querySelectorAll("[data-fc-polish]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.fcPolish === type)));
  setDetail(lab, ...polishInfo[type]);
}
const layers = {
  jacket: ["Chaqueta exterior", "Es la cubierta del cable, elegida para el entorno. No guía la luz. Su material, su clasificación y el color son datos distintos."],
  strength: ["Hilaturas de aramida", "Aportan resistencia a la tracción en este ejemplo de cable simplex. No son fibras ópticas ni llevan señal."],
  buffer: ["Buffer ajustado", "Protección adicional, a menudo de 900 µm sobre la fibra recubierta. Facilita manipular y terminar la fibra."],
  coating: ["Recubrimiento primario", "Capa polimérica que protege el vidrio. Una fibra recubierta suele rondar los 250 µm; no es lo mismo que el revestimiento óptico."],
  cladding: ["Revestimiento óptico · cladding", "Vidrio que rodea el núcleo, con un índice de refracción menor. En muchas fibras de telecomunicaciones mide 125 µm de diámetro."],
  core: ["Núcleo · core", "Zona central donde se guía la señal. Como referencia, el núcleo monomodo suele rondar 8–10 µm; los multimodo habituales son de 50 o 62,5 µm."],
};
const materials = {
  pvc: ["PVC · policloruro de vinilo", "Se usa en cubiertas de interior con formulaciones adecuadas para su aplicación. La palabra PVC por sí sola no demuestra una clasificación riser o plenum."],
  lszh: ["LSZH · bajo humo y sin halógenos", "Describe características del compuesto de cubierta. No significa que sea incombustible, apto para exterior o automáticamente plenum: revisa los ensayos y la clasificación del cable."],
  pe: ["PE · polietileno", "Es habitual en cubiertas de exterior, frecuentemente negras y estabilizadas frente a radiación UV. La aptitud para humedad, sol, canalización o enterramiento se confirma en su ficha."],
};
function drawCable(lab) {
  const shapes = [
    ['jacket', '<path d="M80 107h205a26 38 0 0 1 0 76H80Z" fill="#9e7f21" stroke="#e9cb61"/><ellipse cx="80" cy="145" rx="24" ry="38" fill="#cfb346" stroke="#f6da7a"/><path d="M85 114h193" stroke="#fff3ad" opacity=".45" stroke-width="4"/><ellipse cx="285" cy="145" rx="26" ry="38" fill="#262f34" stroke="#d8b64d"/>'],
    ['strength', Array.from({length:11},(_,i)=>'<path d="M289 ' + (118+i*5) + 'Q334 ' + (114+i*5.5) + ' 387 ' + (130+i*3) + '" fill="none" stroke="' + (i%2 ? '#cba343' : '#f6d781') + '" stroke-width="2"/>').join("")],
    ['buffer','<path d="M310 130h145a10 15 0 0 1 0 30H310Z" fill="#3b7eb1" stroke="#8cbbd4"/><ellipse cx="455" cy="145" rx="10" ry="15" fill="#154461" stroke="#85b4ce"/>'],
    ['coating','<path d="M455 137h58a6 8 0 0 1 0 16h-58Z" fill="#bd8a57" stroke="#e2b57b"/><ellipse cx="513" cy="145" rx="6" ry="8" fill="#dbaf7d"/>'],
    ['cladding','<path d="M513 140h64a4 5 0 0 1 0 10h-64Z" fill="#a7e0e7" stroke="#cdf3f7"/><ellipse cx="577" cy="145" rx="4" ry="5" fill="#e3f8fa"/>'],
    ['core','<path d="M577 145h69" stroke="#ff9d2e" stroke-width="3"/><circle cx="646" cy="145" r="2" fill="#ffd396"/>'],
  ];
  lab.querySelector("[data-fc-scene]").innerHTML = '<svg viewBox="0 0 760 290" role="img" aria-label="Cable simplex abierto por capas, desde la chaqueta exterior hasta el núcleo de vidrio"><text x="35" y="38" class="fc-svg-title">Cable simplex · corte escalonado</text>' + shapes.map(([key, shape]) => '<g class="fc-part" data-model-part="' + key + '">' + shape + '</g>').join("") + '<text x="35" y="250">CHAQUETA → PROTECCIONES → VIDRIO</text><text x="455" y="250">CAPAS AMPLIADAS · SIN ESCALA</text></svg>';
  selectPart(lab, "jacket");
}
function chooseMaterial(lab, key) {
  lab.querySelectorAll("[data-fc-material]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.fcMaterial === key)));
  const panel = lab.querySelector("[data-fc-material-detail]");
  panel.innerHTML = "<strong>" + materials[key][0] + "</strong><p>" + materials[key][1] + "</p>";
}
export function initFiberComponents() {
  document.querySelectorAll("[data-fc-viewer]").forEach(lab => {
    if (lab.dataset.fcReady) return;
    lab.dataset.fcReady = "true";
    if (lab.dataset.fcViewer === "connector") {
      lab.dataset.family = "sc";
      lab.querySelector("[data-fc-scene]").innerHTML = connectorDrawing("sc");
      selectPart(lab, "body");
    } else if (lab.dataset.fcViewer === "polish") drawPolish(lab, "upc");
    else if (lab.dataset.fcViewer === "cable") { drawCable(lab); chooseMaterial(lab, "lszh"); }
    else lab.querySelector("[data-fc-scene]").innerHTML = connectorDrawing("sc");
  });
}
document.addEventListener("click", event => {
  const target = event.target.closest("[data-fc-family], [data-fc-part], [data-model-part], [data-fc-polish], [data-fc-material]");
  const lab = target?.closest("[data-fc-viewer]");
  if (!lab || lab.dataset.fcViewer === "practice") return;
  if (target.dataset.fcFamily) {
    lab.dataset.family = target.dataset.fcFamily;
    lab.querySelectorAll("[data-fc-family]").forEach(b => b.setAttribute("aria-pressed", String(b === target)));
    lab.querySelector("[data-fc-scene]").innerHTML = connectorDrawing(lab.dataset.family);
    selectPart(lab, lab.dataset.part || "body");
  } else if (target.dataset.fcPart || target.dataset.modelPart) selectPart(lab, target.dataset.fcPart || target.dataset.modelPart);
  else if (target.dataset.fcPolish) drawPolish(lab, target.dataset.fcPolish);
  else if (target.dataset.fcMaterial) chooseMaterial(lab, target.dataset.fcMaterial);
});
document.addEventListener("submit", event => {
  const form = event.target.closest("[data-fc-quiz]");
  if (!form) return;
  event.preventDefault();
  const values = new FormData(form);
  const answers = [
    ["connector", "sc-apc", "Conector: una toma SC/APC necesita una terminación SC/APC en ese punto. SC/UPC cambia el pulido; LC/APC cambia la familia."],
    ["patch", "hybrid", "Patch cord: puede llevar SC/APC en un extremo y LC/UPC en el otro si cada extremo coincide con su propia toma. No hay contacto físico APC–UPC entre las puntas de ese cable."],
    ["jacket", "spec", "Chaqueta: hay que comprobar ficha, marcado y aptitud para el recorrido. LSZH y el color no garantizan por sí solos uso exterior o clasificación plenum."],
  ];
  const wrong = answers.filter(([name, answer]) => values.get(name) !== answer);
  const result = form.querySelector("[data-fc-result]");
  result.hidden = false;
  result.dataset.success = String(wrong.length === 0);
  result.innerHTML = wrong.length ? '<h3>Revisa ' + wrong.length + (wrong.length === 1 ? " elección" : " elecciones") + '</h3><ul>' + wrong.map(([, , text]) => '<li>' + text + '</li>').join("") + '</ul>' : '<h3>Bien hecho · identificación completada</h3><p>Separaste la familia del conector, el pulido de cada unión y la aptitud de la chaqueta. Ese es el orden para elegir el componente.</p>';
});
