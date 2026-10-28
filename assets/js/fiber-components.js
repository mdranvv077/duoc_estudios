const families = {
  sc: { title: "SC · inserción y extracción", size: "FÉRULA · 2,5 mm", lock: "La carcasa push-pull asegura la conexión. Para retirarla, actúa sobre el cuerpo previsto para ello, no tires del cable.", ferrule: "El cilindro cerámico de 2,5 mm centra la fibra. Su cara frontal lleva el pulido; no se toca.", body: "Carcasa rectangular SC. La forma identifica la familia, no el tipo de fibra ni el pulido." },
  lc: { title: "LC · pestaña de retención", size: "FÉRULA · 1,25 mm", lock: "La pestaña superior se libera antes de extraer el conector. LC es habitual en transceptores y paneles densos.", ferrule: "Férula cerámica de 1,25 mm: la mitad del diámetro habitual en SC. El dibujo está ampliado para reconocer sus piezas.", body: "Cuerpo compacto LC. Un clip puede unir dos conectores para formar un conjunto dúplex." },
  st: { title: "ST · cierre de bayoneta", size: "FÉRULA · 2,5 mm", lock: "El collar se acopla con una bayoneta de giro corto. No es una rosca de vueltas continuas como FC.", ferrule: "Férula cilíndrica de 2,5 mm. El metal exterior no sustituye la función de alineación de la férula.", body: "Cuerpo circular y collar metálico. Se encuentra en instalaciones existentes y entornos de laboratorio." },
  fc: { title: "FC · collar roscado", size: "FÉRULA · 2,5 mm", lock: "El collar roscado asegura la conexión. Primero se alinea la llave del conector y luego se enrosca el collar, sin retorcer el cable.", ferrule: "Férula de 2,5 mm. Aunque tenga el mismo diámetro que SC o ST, el mecanismo exterior es diferente.", body: "Carcasa redonda con collar de agarre moleteado y acoplamiento roscado. No se conecta directamente a una toma ST." },
  mpo: { title: "MPO · varias fibras en una interfaz", size: "FÉRULA · RECTANGULAR MULTIFIBRA", lock: "La llave y la carcasa guían la inserción. También hay que verificar pines, polaridad y cantidad de fibras: no basta con que entre.", ferrule: "La cara rectangular agrupa varias fibras. Esta vista representa una fila de 12; existen otras configuraciones.", body: "Cuerpo rectangular multifibra. MTP es una implementación comercial de la familia MPO, no el nombre de cualquier conector múltiple." },
};
const commonParts = {
  boot: ["Bota y alivio de tensión", "La pieza flexible acompaña la salida del cable y limita esfuerzos cerca del conector. No evita el daño si se dobla o tira en exceso."],
  body: ["Cuerpo del conector", ""], lock: ["Sistema de cierre", ""], ferrule: ["Férula y cara de extremo", ""],
};
let drawingNumber = 0;
function svgFrame(content, title, note = "") {
  return '<svg viewBox="0 0 760 290" role="img" aria-label="' + title + '"><defs>' +
    '<linearGradient id="fm-metal-' + drawingNumber + '" x2="0" y2="1"><stop stop-color="#edf3f4"/><stop offset=".25" stop-color="#84959f"/><stop offset=".5" stop-color="#c7d5da"/><stop offset=".8" stop-color="#52646f"/><stop offset="1" stop-color="#263640"/></linearGradient>' +
    '<linearGradient id="fm-color-' + drawingNumber + '" x2="0" y2="1"><stop stop-color="#74c8ff"/><stop offset=".25" stop-color="#247bb9"/><stop offset=".7" stop-color="#13517e"/><stop offset="1" stop-color="#092b49"/></linearGradient>' +
    '<linearGradient id="fm-boot-' + drawingNumber + '" x2="0" y2="1"><stop stop-color="#56626a"/><stop offset=".5" stop-color="#222e36"/><stop offset="1" stop-color="#0b1118"/></linearGradient>' +
    '<linearGradient id="fm-ceramic-' + drawingNumber + '" x2="0" y2="1"><stop stop-color="#fcfcf0"/><stop offset=".5" stop-color="#d9e0d6"/><stop offset="1" stop-color="#7d8a86"/></linearGradient></defs>' +
    '<text x="35" y="38" class="fc-svg-title">' + title + '</text>' + content +
    '<text x="35" y="260">' + note + '</text></svg>';
}
function connectorDrawing(type, apc = false) {
  drawingNumber++;
  const d = drawingNumber, f = families[type], metal = 'url(#fm-metal-' + d + ')', blue = apc ? "#26945c" : 'url(#fm-color-' + d + ')';
  const ferrule = (x, y, w, h) => '<g class="fc-part" data-model-part="ferrule"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#fm-ceramic-' + d + ')" stroke="#8c9e9b"/><ellipse cx="' + (x + w) + '" cy="' + (y + h / 2) + '" rx="4" ry="' + (h / 2) + '" fill="#e7ece1" stroke="#85958c"/><circle cx="' + (x + w) + '" cy="' + (y + h / 2) + '" r="1.5" fill="#536a70"/></g>';
  let body = "";
  if (type === "sc" || type === "lc") {
    const lc = type === "lc", top = lc ? 115 : 100, bottom = lc ? 166 : 180;
    body = '<g class="fc-part" data-model-part="body"><path d="M302 ' + top + 'l17-16h174l-17 16Z" fill="' + (apc ? "#64ca82" : "#50a1cd") + '" stroke="#82c2db"/><path d="M476 ' + top + 'l17-16v' + (bottom - top) + 'l-17 16Z" fill="#173e54" stroke="#547f90"/><rect x="302" y="' + top + '" width="174" height="' + (bottom - top) + '" rx="3" fill="' + blue + '" stroke="#6cacc3"/><path d="M319 ' + (top + 8) + 'h142M319 ' + (bottom - 8) + 'h142" stroke="#c3e5ed" opacity=".24"/><rect x="476" y="' + (top + 12) + '" width="41" height="' + (bottom - top - 24) + '" fill="' + blue + '" stroke="#6395a7"/></g>';
    body += '<g class="fc-part" data-model-part="lock">' + (lc ? '<path d="M330 111V86h39l69 23h38v8h-43l-68-18h-24v12Z" fill="#438eb6" stroke="#a6d6e8"/><path d="M347 86v12m9-12v12m9-12v14" stroke="#183c58"/>' : '<path d="M326 100v80m9-80v80m9-80v80" stroke="#092b45" stroke-width="4"/><rect x="405" y="92" width="34" height="8" rx="1" fill="#91c6dd"/>') + '</g>';
    body += ferrule(517, lc ? 132 : 127, lc ? 49 : 66, lc ? 14 : 24);
  } else if (type === "st" || type === "fc") {
    body = '<g class="fc-part" data-model-part="body"><rect x="299" y="112" width="96" height="57" rx="9" fill="' + metal + '" stroke="#8fabb4"/><path d="M317 113v54m14-54v54" stroke="#1c2e38" stroke-width="4"/></g>';
    body += '<g class="fc-part" data-model-part="lock"><path d="M385 96h99q14 0 14 14v60q0 14-14 14h-99Z" fill="' + metal + '" stroke="#adc0c9"/>' + Array.from({length: 14}, (_, i) => '<path d="M' + (390 + i * 7) + ' 102v76" stroke="#1c303d" stroke-width="2" opacity=".7"/>').join("") +
      (type === "st" ? '<path d="M470 102v21h23m-23 54v-21h23" fill="none" stroke="#0a1c28" stroke-width="5"/><rect x="504" y="121" width="13" height="9" fill="#b4c7ce"/>' : '<rect x="498" y="118" width="32" height="44" fill="' + metal + '"/>' + Array.from({length: 6}, (_, i) => '<path d="m' + (498 + i * 5) + ' 118-4 44" stroke="#2e4351" stroke-width="2"/>').join("") + '<rect x="520" y="111" width="7" height="9" fill="#c5d7db"/>') + '</g>';
    body += ferrule(type === "fc" ? 530 : 504, 128, type === "fc" ? 58 : 78, 23);
  } else {
    body = '<g class="fc-part" data-model-part="body"><path d="m298 108 18-16h197v74l-18 16H298Z" fill="#2d3f4d" stroke="#7894a3"/><rect x="298" y="108" width="197" height="74" rx="5" fill="url(#fm-boot-' + d + ')" stroke="#8198a5"/><path d="M314 118h165m-165 54h165" stroke="#8da5b3" opacity=".4"/></g><g class="fc-part" data-model-part="lock"><path d="M387 108v-13h48v13" fill="#738e98" stroke="#b6cad2"/><path d="M317 113v64m9-64v64m9-64v64" stroke="#101c27" stroke-width="4"/></g><g class="fc-part" data-model-part="ferrule"><rect x="495" y="116" width="45" height="58" rx="2" fill="#81969c" stroke="#bdcdd2"/><path d="m540 116 14-10v58l-14 10Z" fill="#3b535f" stroke="#8ca4b0"/>' + Array.from({length:12},(_,i)=>'<circle cx="' + (499+i*3.4) + '" cy="145" r="1.1" fill="#111f29"/>').join("") + '</g>';
  }
  const content = '<ellipse cx="338" cy="210" rx="258" ry="10" fill="#000" opacity=".3"/><path d="M35 143h147" stroke="#e6bf3c" stroke-width="14"/><path d="M35 140h147" stroke="#fff2a2" opacity=".4" stroke-width="3"/><g class="fc-part" data-model-part="boot"><path d="M170 131h42l73-23h17v74h-17l-73-26h-42Z" fill="url(#fm-boot-' + d + ')" stroke="#697780"/>' + Array.from({length:8},(_,i)=>'<path d="M' + (210+i*10) + ' ' + (126-i*2) + 'v' + (34+i*4) + '" stroke="#111b24" stroke-width="5"/><path d="M' + (212+i*10) + ' ' + (126-i*2) + 'v' + (34+i*4) + '" stroke="#74838a" opacity=".4"/>').join("") + '</g>' + body;
  return svgFrame(content, f.title, f.size + " · MODELO DIDÁCTICO · SIN ESCALA COMÚN ENTRE FAMILIAS");
}
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
  pc: ["PC · Physical Contact", "Cara convexa para lograr contacto físico entre fibras. No es un corte plano ni una cámara de aire intencional. La representación amplía la curvatura para poder verla."],
  upc: ["UPC · Ultra Physical Contact", "Mantiene una geometría de contacto sin ángulo intencional; mejora el acabado frente al PC convencional. Por eso PC y UPC se ven prácticamente iguales en este perfil. En monomodo, UPC suele identificarse en azul."],
  apc: ["APC · Angled Physical Contact", "Combina contacto físico con una cara inclinada, habitualmente 8° respecto a la perpendicular al eje. La reflexión se desvía de la trayectoria de retorno al núcleo. En monomodo suele identificarse en verde."],
};
function drawPolish(lab, type) {
  lab.dataset.polish = type;
  const angled = type === "apc";
  const face = angled ? "L503.24 180" : "Q510 140 492 180";
  lab.querySelector("[data-fc-scene]").innerHTML = '<svg viewBox="0 0 760 290" role="img" aria-label="Perfil ampliado de una férula ' + type.toUpperCase() + '"><text x="35" y="38" class="fc-svg-title">' + polishInfo[type][0] + '</text><rect x="85" y="94" width="78" height="92" rx="9" fill="' + (angled ? "#27814d" : "#246ca1") + '" stroke="#9cbbca"/><path d="M163 100H492' + face + 'H163Z" fill="#c6d5d2" stroke="#799290" stroke-width="2"/><path d="M165 112h309" stroke="#fff" opacity=".4"/><path d="M180 140h' + (angled ? "317.6" : "321") + '" stroke="#2eeaff" stroke-width="4"/><path d="M492 80v120" stroke="#a3b4be" stroke-dasharray="4 5" opacity=".65"/><path d="' + (angled ? "M497.6 140 322 190" : "M501 140H310") + '" stroke="#ff2e7b" stroke-width="2.5" fill="none"/><path d="' + (angled ? "m332 183-10 7 12 1" : "m320 135-10 5 10 5") + '" fill="none" stroke="#ff2e7b" stroke-width="2"/><text x="535" y="117" class="fc-svg-accent">' + (angled ? "8°" : "SIn ángulo".toUpperCase()) + '</text><text x="535" y="143">' + (angled ? "Cara inclinada" : "Cara convexa") + '</text><text x="35" y="246">CIAN · LUZ INCIDENTE</text><text x="350" y="246">MAGENTA · REFLEXIÓN ORIENTATIVA</text></svg>';
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
    else lab.querySelector("[data-fc-scene]").innerHTML = connectorDrawing("sc", true);
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
