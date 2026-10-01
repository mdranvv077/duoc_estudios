const fiberGuideData = {
  start: {
    folder: "antes-de-empezar",
    label: "Antes de empezar",
    modules: [
      ["index.html", "Cómo usar esta modalidad"],
      ["enlace-optico.html", "El enlace óptico"],
      ["seguridad-limpieza.html", "Seguridad y limpieza"],
      ["espectro-electromagnetico.html", "Explorar el espectro"],
    ],
  },
  fiber: {
    folder: "fibras-cables",
    label: "Fibras y cables",
    modules: [
      ["index.html", "Anatomía de la fibra"],
      ["monomodo-multimodo.html", "Monomodo y multimodo"],
      ["cables-manejo.html", "Cables y manejo"],
    ],
  },
  connections: {
    folder: "conectores-empalmes",
    label: "Conectores y empalmes",
    modules: [
      ["index.html", "Componentes del enlace"],
      ["conectores.html", "Conectores y pulidos"],
      ["empalmes-limpieza.html", "Empalmes e inspección"],
    ],
  },
  testing: {
    folder: "pruebas",
    label: "Potencia y pruebas",
    modules: [
      ["index.html", "Pérdida, dB y dBm"],
      ["presupuesto.html", "Presupuesto de pérdida"],
      ["herramientas.html", "Herramientas de comprobación"],
    ],
  },
  foa: {
    folder: "foa",
    label: "FOA · Libro de consulta",
    modules: [
      ["index.html", "Índice del libro"],
      ["introduccion.html", "Introducción"],
      ["terminologia.html", "Terminología"],
      ["comunicaciones.html", "Comunicaciones"],
      ["fibra-optica.html", "La fibra"],
      ["cables.html", "Cables"],
      ["conectores-empalmes.html", "Conectores y empalmes"],
      ["sistemas-transmision.html", "Transmisión"],
      ["diseno-redes.html", "Diseño de redes"],
      ["instalacion.html", "Instalación"],
      ["pruebas.html", "Pruebas"],
    ],
  },
};

function currentFiberCategory(url = location.href) {
  const path = new URL(url, location.href).pathname;
  if (path.includes("/fibra-optica/foa/")) return "foa";
  if (path.endsWith("/fibra-optica/modulo-en-blanco.html")) return "standalone";
  if (path.includes("/fibras-cables/")) return "fiber";
  if (path.includes("/conectores-empalmes/")) return "connections";
  if (path.includes("/pruebas/")) return "testing";
  return "start";
}

function renderFiberNavigation() {
  const sidebar = document.querySelector("[data-guide-sidebar]");
  const nav = document.querySelector(".lesson-nav");
  if (!sidebar || !nav) return;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const category = currentFiberCategory();
  const data = fiberGuideData[category];
  const standalone = category === "standalone";
  const current = new URL(location.href).pathname.split("/").pop();
  const categories = sidebar.querySelector(".sidebar-categories");
  if (categories) {
    const href = (key) => standalone ? `${fiberGuideData[key].folder}/index.html` : category === key ? "index.html" : `../${fiberGuideData[key].folder}/index.html`;
    categories.innerHTML = `
      <span class="sidebar-episode-label">Episodio 01</span>
      <a class="sidebar-category ${category === "start" ? "active" : ""}" data-fiber-category="start" href="${href("start")}"><span>01</span><b>Antes de empezar</b><i>↗</i></a>
      <a class="sidebar-category ${category === "fiber" ? "active" : ""}" data-fiber-category="fiber" href="${href("fiber")}"><span>02</span><b>Fibras y cables</b><i>↗</i></a>
      <a class="sidebar-category ${category === "connections" ? "active" : ""}" data-fiber-category="connections" href="${href("connections")}"><span>03</span><b>Conectores</b><i>↗</i></a>
      <a class="sidebar-category ${category === "testing" ? "active" : ""}" data-fiber-category="testing" href="${href("testing")}"><span>04</span><b>Potencia y pruebas</b><i>↗</i></a>`;
  }
  nav.hidden = standalone;
  nav.innerHTML = data ? data.modules.map(([file, label], index) => `<a class="${file === current ? "active" : ""}" href="${file}"><span>${category === "foa" ? index === 0 ? "•" : String(index).padStart(2, "0") : String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("") : "";
  let standaloneLink = sidebar.querySelector(".sidebar-standalone");
  if (!standaloneLink) {
    standaloneLink = document.createElement("a");
    standaloneLink.className = "sidebar-category sidebar-standalone";
    standaloneLink.innerHTML = `<span>+</span><b>FOA · El libro</b><i>↗</i>`;
    sidebar.append(standaloneLink);
  }
  standaloneLink.href = standalone ? "foa/index.html" : category === "foa" ? "index.html" : "../foa/index.html";
  standaloneLink.dataset.fiberCategory = "foa";
  standaloneLink.classList.toggle("active", category === "foa");
  if (category === "foa") {
    import(new URL("assets/foa.js?v=20260930-book", location.href).href)
      .then(reader => reader.initFoaReader()).catch(console.error);
  }
}

async function prepareFiberStyles(nextDocument, url) {
  const links = [...nextDocument.querySelectorAll('link[rel="stylesheet"]')];
  await Promise.all(links.filter(link => link.getAttribute("href").includes("foa.css")).map(link => {
    const href = new URL(link.getAttribute("href"), url).href;
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(current => current.href === href)) return;
    return new Promise((resolve, reject) => {
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = href;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }));
}

async function fetchFiberDocument(url) {
  const response = await fetch(url, { headers: { "X-Requested-With": "DGNV-Studios" } });
  if (!response.ok) throw new Error();
  return new DOMParser().parseFromString(await response.text(), "text/html");
}

async function loadFiberModule(url, addHistory = true) {
  const content = document.querySelector(".lesson-content");
  if (!content) return;
  try {
    const nextDocument = await fetchFiberDocument(url);
    await prepareFiberStyles(nextDocument, url);
    const nextContent = nextDocument.querySelector(".lesson-content");
    if (!nextContent) throw new Error();
    content.innerHTML = nextContent.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    document.querySelector(".learning-shell")?.scrollTo({ top: 0 });
    renderFiberNavigation();
  } catch { location.href = url; }
}

async function loadFiberCategory(url, addHistory = true) {
  const shell = document.querySelector(".learning-shell");
  if (!shell) return;
  try {
    const nextDocument = await fetchFiberDocument(url);
    await prepareFiberStyles(nextDocument, url);
    const nextShell = nextDocument.querySelector(".learning-shell");
    if (!nextShell) throw new Error();
    shell.innerHTML = nextShell.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    shell.scrollTo({ top: 0 });
    renderFiberNavigation();
  } catch { location.href = url; }
}

document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-sidebar-toggle]");
  if (toggle) {
    const sidebar = document.querySelector("[data-guide-sidebar]");
    const open = sidebar?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    return;
  }
  const categoryLink = event.target.closest("a.sidebar-category");
  if (categoryLink && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    loadFiberCategory(categoryLink.href);
    return;
  }
  const link = event.target.closest(".lesson-nav a, .lesson-actions a, a.spectrum-cta, a[data-foa-page]");
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (new URL("./", link.href).pathname !== new URL("./", location.href).pathname) return;
  event.preventDefault();
  loadFiberModule(link.href);
});

addEventListener("popstate", () => {
  const category = currentFiberCategory();
  const active = document.querySelector(".sidebar-category.active")?.dataset.fiberCategory;
  if (active !== category) loadFiberCategory(location.href, false);
  else loadFiberModule(location.href, false);
});

renderFiberNavigation();

// Delegation keeps the practice working after the guide swaps modules in place.
const vflConnectionTimers = new WeakMap();
const vflAttempts = new WeakMap();
function vflAttempt(lab) {
  if (!vflAttempts.has(lab)) vflAttempts.set(lab, { connected: false, blink: false, steady: false });
  return vflAttempts.get(lab);
}
function hideVflResult(lab) {
  lab.querySelector("[data-vfl-result]").hidden = true;
}
function describeVfl(lab) {
  const mode = lab.dataset.mode;
  const connected = lab.dataset.connected === "true";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const status = lab.querySelector("[data-vfl-status]");
  if (lab.classList.contains("is-connecting")) {
    status.textContent = "Acercando el inyector al adaptador. Mantén el interruptor apagado mientras lo conectas.";
  } else if (lab.classList.contains("is-disconnecting")) {
    status.textContent = mode === "0"
      ? "Separando el inyector del adaptador."
      : "Separando el inyector: la luz retrocede por el patch cord y se apaga al abrir la conexión.";
  } else if (mode === "0") {
    status.textContent = connected
      ? "Conectado y apagado. Cuando termines las pruebas, pulsa «Comprobar»."
      : "Apagado y sin conectar. Puedes mover el interruptor; las pruebas solo cuentan con el patch cord conectado correctamente.";
  } else {
    status.textContent = connected
      ? (mode === "1" ? "Intermitente: la luz de salida se enciende y se apaga." : "Fijo (CW): la luz de salida permanece encendida.")
      : "El inyector emite luz hacia el conector, pero el patch cord está desconectado. No hay salida por el otro extremo y esto no cuenta como prueba.";
    if (mode === "1" && reduced) status.textContent += " Movimiento reducido: el parpadeo se representa como luz fija.";
  }
}
function resetVfl(lab) {
  clearTimeout(vflConnectionTimers.get(lab));
  lab.classList.remove("is-connecting", "is-disconnecting");
  lab.dataset.connected = "false";
  lab.dataset.mode = "0";
  vflAttempts.delete(lab);
  lab.querySelectorAll("[data-vfl-mode]").forEach(slider => {
    slider.value = "0";
    slider.setAttribute("aria-valuetext", "Apagado");
  });
  lab.querySelector("[data-vfl-mode-label]").textContent = "Apagado";
  const connect = lab.querySelector("[data-vfl-connect]");
  connect.disabled = false;
  connect.textContent = "Conectar patch cord";
  hideVflResult(lab);
  describeVfl(lab);
}
function checkVfl(lab) {
  const attempt = vflAttempt(lab);
  const missing = [];
  if (lab.classList.contains("is-connecting") || lab.classList.contains("is-disconnecting")) {
    missing.push("Espera a que termine la maniobra.");
  } else if (lab.dataset.connected !== "true") {
    missing.push("Conecta el patch cord con el inyector apagado.");
  } else if (!attempt.connected) {
    missing.push("Lo conectaste con la luz encendida. Apaga el inyector, desconecta y vuelve a conectar antes de repetir las pruebas.");
  }
  if (!attempt.blink) missing.push("Falta probar el modo intermitente con el patch cord conectado correctamente.");
  if (!attempt.steady) missing.push("Falta probar el modo fijo con el patch cord conectado correctamente.");
  if (lab.dataset.mode !== "0") missing.push("El inyector sigue encendido: apágalo para terminar.");
  const result = lab.querySelector("[data-vfl-result]");
  result.dataset.outcome = missing.length ? "incomplete" : "success";
  lab.querySelector("[data-vfl-result-title]").textContent = missing.length
    ? "Aún no está completo" : "¡Bien hecho! Práctica finalizada";
  lab.querySelector("[data-vfl-result-copy]").textContent = missing.length
    ? missing.join(" ")
    : "Conectaste el patch cord con el inyector apagado, probaste la luz intermitente y la fija y lo apagaste al terminar.";
  result.hidden = false;
}
document.addEventListener("click", event => {
  const button = event.target.closest("[data-vfl-connect], [data-vfl-reset], [data-vfl-check]");
  if (!button) return;
  const lab = button.closest("[data-vfl-lab]");
  if (button.hasAttribute("data-vfl-check")) { checkVfl(lab); return; }
  if (button.hasAttribute("data-vfl-reset")) { resetVfl(lab); return; }
  hideVflResult(lab);
  if (lab.dataset.connected === "true") {
    lab.classList.add("is-disconnecting");
    button.disabled = true;
    button.textContent = "Desconectando…";
    describeVfl(lab);
    vflConnectionTimers.set(lab, setTimeout(() => {
      if (!lab.isConnected) return;
      lab.dataset.connected = "false";
      lab.classList.remove("is-disconnecting");
      vflAttempts.delete(lab);
      button.disabled = false;
      button.textContent = "Conectar patch cord";
      describeVfl(lab);
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1050));
    return;
  }
  if (lab.classList.contains("is-connecting")) return;
  const attempt = vflAttempt(lab);
  attempt.connectingSafely = lab.dataset.mode === "0";
  lab.classList.add("is-connecting");
  button.disabled = true;
  button.textContent = "Conectando…";
  describeVfl(lab);
  vflConnectionTimers.set(lab, setTimeout(() => {
    if (!lab.isConnected) return;
    lab.dataset.connected = "true";
    lab.classList.remove("is-connecting");
    attempt.connected = attempt.connectingSafely && lab.dataset.mode === "0";
    button.disabled = false;
    button.textContent = "Desconectar";
    hideVflResult(lab);
    describeVfl(lab);
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1050));
});
document.addEventListener("input", event => {
  if (!event.target.matches("[data-vfl-mode]")) return;
  const lab = event.target.closest("[data-vfl-lab]");
  const mode = event.target.value;
  lab.dataset.mode = mode;
  const labels = ["Apagado", "Intermitente", "Fijo · CW"];
  lab.querySelectorAll("[data-vfl-mode]").forEach(control => {
    control.value = mode;
    control.setAttribute("aria-valuetext", labels[Number(mode)]);
  });
  lab.querySelector("[data-vfl-mode-label]").textContent = labels[Number(mode)];
  const attempt = vflAttempt(lab);
  if (lab.classList.contains("is-connecting") && mode !== "0") attempt.connectingSafely = false;
  if (lab.dataset.connected === "true" && attempt.connected) {
    if (mode === "1") attempt.blink = true;
    if (mode === "2") attempt.steady = true;
  }
  hideVflResult(lab);
  describeVfl(lab);
});
