const pythonModules = [
  ["index.html", "Antes de escribir Python"],
  ["variables-tipos.html", "Variables y tipos de datos"],
  ["operaciones-texto.html", "Operaciones, texto y salida"],
  ["entrada-practica.html", "Entrada de datos y práctica"],
];

function renderPythonNavigation() {
  const nav = document.querySelector(".lesson-nav");
  if (!nav) return;
  const current = new URL(window.location.href).pathname.split("/").pop();
  nav.innerHTML = pythonModules.map(([file, label], index) => `<a class="${file === current ? "active" : ""}" href="${file}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("");
}

function addPythonExplanations() {
  const lesson = new URL(window.location.href).pathname.split("/").pop();
  const lead = document.querySelector(".lesson-lead");
  const actions = document.querySelector(".lesson-actions");
  if (!lead || lead.dataset.explained === "true") return;
  lead.dataset.explained = "true";
  const details = {
    "index.html": {
      before: `<section class="python-explanation"><h2>Antes del primer ejemplo</h2><p>Un programa es una lista de instrucciones que Python ejecuta en orden. No intenta adivinar qué quieres hacer: lee la primera línea, termina esa tarea y recién entonces continúa con la siguiente.</p><p>Por eso, al enfrentarte a un bloque nuevo, hazte tres preguntas: <strong>¿qué valor aparece aquí?</strong>, <strong>¿dónde se guarda?</strong> y <strong>¿qué se muestra o cambia después?</strong>. Leer código de esa forma es más útil que memorizar palabras sueltas.</p><h2>Las piezas básicas de Python</h2><p>Una <strong>instrucción</strong> es una orden concreta para Python: guardar un dato, hacer un cálculo, mostrar un mensaje o decidir qué camino seguir. Normalmente, cada línea contiene una instrucción; por eso el orden importa.</p><p>Una <strong>variable</strong> funciona como una caja con etiqueta. Le das un nombre, guardas un valor dentro y después puedes consultar o reutilizar ese valor. Por ejemplo, si una caja llamada <code>edad</code> guarda <code>18</code>, el programa puede usar <code>edad</code> para comparar, calcular o mostrar ese número sin tener que escribirlo de nuevo.</p><p>Una <strong>función</strong> es una acción que tiene nombre. <code>print()</code>, por ejemplo, significa “muestra esto en pantalla”. Los paréntesis indican que estás usando esa acción. Más adelante, <code>def</code> te permitirá crear funciones propias: instrucciones agrupadas bajo un nombre para reutilizarlas.</p><p>Una <strong>condición</strong> es una pregunta que solo tiene dos respuestas: se cumple o no se cumple. Como dice su nombre, hace que tenga que pasar cierta cosa para que ocurra otra. <code>if</code> se lee como “si esto es verdadero, ejecuta el bloque de abajo”; <code>elif</code> ofrece otra pregunta si la anterior no se cumplió; y <code>else</code> cubre el caso restante.</p><div class="lesson-note"><strong>Idea clave:</strong> cuando veas <code>if edad &gt;= 18:</code>, léelo como: “si el valor guardado en edad es mayor o igual a 18, realiza las instrucciones que están indentadas debajo”. La sangría marca exactamente cuáles son esas instrucciones.</div></section>`,
      after: `<section class="python-explanation"><h2>Qué hace <code>print()</code></h2><p><code>print()</code> no guarda ni modifica datos: solo muestra un resultado en la consola. Dentro de sus paréntesis puedes colocar texto, números, una variable o una mezcla usando un f-string.</p><div class="lesson-note"><strong>Orden importante:</strong> primero debe existir una variable; después puedes usarla en un <code>print()</code>. Si intentas mostrar un nombre que Python no conoce, aparecerá un error.</div></section>`,
    },
    "variables-tipos.html": {
      before: `<section class="python-explanation"><h2>Por qué usamos variables</h2><p>Un programa casi nunca trabaja con un solo valor fijo. Puede recibir una edad, calcular un promedio o guardar si una conexión está activa. Una variable permite ponerle un nombre entendible a cada dato y reutilizarlo sin escribirlo otra vez.</p><p>La caja es una ayuda para empezar: el nombre queda asociado a un valor. Si asignas otro valor al mismo nombre, Python deja de usar el anterior y conserva el nuevo. Así una variable puede representar un estado que cambia mientras avanza el programa.</p></section>`,
      after: `<section class="python-explanation"><h2>El tipo cambia lo que puedes hacer</h2><p>Un <code>int</code> y un <code>float</code> sirven para cálculos; un <code>str</code> representa texto; un <code>bool</code> representa una respuesta lógica. Antes de operar, pregúntate si el valor es un número, texto o una respuesta de verdadero/falso.</p><div class="lesson-note"><strong>Importante:</strong> <code>"18"</code> es texto y <code>18</code> es un número. Se ven parecidos, pero Python no los trata igual.</div></section>`,
    },
    "operaciones-texto.html": {
      before: `<section class="python-explanation"><h2>Primero piensa el resultado</h2><p>Una operación toma valores y produce otro valor. Por ejemplo, una multiplicación puede transformar cantidad y precio en un total. Guardar ese resultado en una variable hace que el programa sea más claro y que puedas usarlo después en otro cálculo o mensaje.</p><p>Lee <code>puntos += 5</code> como una instrucción, no como una igualdad de matemáticas: toma lo que está guardado en <code>puntos</code>, suma cinco y guarda el resultado en la misma variable.</p></section>`,
      after: `<section class="python-explanation"><h2>Texto que se adapta al resultado</h2><p>Un f-string comienza con la letra <code>f</code> y usa llaves para insertar valores. Es útil porque el texto permanece legible mientras los datos cambian según cada ejecución.</p><div class="lesson-note"><strong>Comprueba siempre:</strong> calcula primero, guarda el resultado y luego muéstralo. Separar esos pasos ayuda a detectar errores.</div></section>`,
    },
    "entrada-practica.html": {
      before: `<section class="python-explanation"><h2>Un programa puede preguntar</h2><p><code>input()</code> detiene el programa y espera una respuesta escrita por la persona. Ese dato entra como texto, incluso si se ven números en pantalla. Por eso, cuando quieres sumar, dividir o comparar una edad, debes convertir ese texto con <code>int()</code> o <code>float()</code>.</p><p>Conviene pensar el flujo antes de programar: pedir un dato, convertirlo si hace falta, calcular y finalmente mostrar una conclusión. Ese mismo orden aparece en programas mucho más grandes.</p></section>`,
      after: `<section class="python-explanation"><h2>Antes de calcular</h2><p>Una conversión funciona solo si la persona escribió un valor compatible. Más adelante, con condiciones y <code>exit()</code>, podrás validar una respuesta incorrecta y detener una interacción de manera controlada.</p><div class="lesson-note"><strong>Para esta práctica:</strong> escribe primero qué datos necesitas, qué cálculo harás con ellos y cuál será el mensaje final. Recién después traduce esos pasos a Python.</div></section>`,
    },
  };
  const content = details[lesson];
  if (!content) return;
  lead.insertAdjacentHTML("afterend", content.before);
  actions?.insertAdjacentHTML("beforebegin", content.after);
}

function addPythonOutputs() {
  const lesson = new URL(window.location.href).pathname.split("/").pop();
  const outputs = {
    "index.html": [
      { block: 0, text: "Hola, Caroline" },
      { block: 1, text: "Puedes ingresar" },
    ],
    "variables-tipos.html": [
      { block: 0, text: "El próximo año tendrás 19" },
    ],
    "operaciones-texto.html": [
      { block: 1, text: "4" },
    ],
    "entrada-practica.html": [
      { block: 0, text: "Caroline, el próximo año tendrás 19." },
    ],
  };

  const blocks = document.querySelectorAll(".code-block");
  outputs[lesson]?.forEach(({ block: index, text }) => {
    const block = blocks[index];
    if (!block || block.nextElementSibling?.classList.contains("code-output")) return;
    block.insertAdjacentHTML("afterend", `<div class="code-output" aria-label="Resultado del código"><span class="code-output-label">Python · resultado</span><code>${text}</code></div>`);
  });
}

async function loadPythonModule(url, addHistory = true) {
  const content = document.querySelector(".lesson-content");
  if (!content) return;
  try {
    const response = await fetch(url, { headers: { "X-Requested-With": "DGNV-Studios" } });
    if (!response.ok) throw new Error();
    const documentNext = new DOMParser().parseFromString(await response.text(), "text/html");
    const nextContent = documentNext.querySelector(".lesson-content");
    if (!nextContent) throw new Error();
    content.innerHTML = nextContent.innerHTML;
    document.title = documentNext.title;
    if (addHistory) history.pushState({}, "", url);
    document.querySelector(".learning-shell")?.scrollTo({ top: 0, behavior: "smooth" });
    renderPythonNavigation();
    addPythonExplanations();
    addPythonOutputs();
  } catch { window.location.href = url; }
}

document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-sidebar-toggle]");
  if (toggle) { const sidebar = document.querySelector("[data-guide-sidebar]"); const open = sidebar?.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(open)); return; }
  const link = event.target.closest(".lesson-nav a, .lesson-actions a");
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (new URL("./", link.href).pathname !== new URL("./", window.location.href).pathname) return;
  event.preventDefault(); loadPythonModule(link.href);
});
window.addEventListener("popstate", () => loadPythonModule(window.location.href, false));
renderPythonNavigation();
addPythonExplanations();
addPythonOutputs();
