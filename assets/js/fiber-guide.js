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
};

function currentFiberCategory(url = location.href) {
  const path = new URL(url, location.href).pathname;
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
  const current = new URL(location.href).pathname.split("/").pop();
  const categories = sidebar.querySelector(".sidebar-categories");
  if (categories) {
    const href = (key) => category === key ? "index.html" : `../${fiberGuideData[key].folder}/index.html`;
    categories.innerHTML = `
      <span class="sidebar-episode-label">Episodio 01</span>
      <a class="sidebar-category ${category === "start" ? "active" : ""}" data-fiber-category="start" href="${href("start")}"><span>01</span><b>Antes de empezar</b><i>↗</i></a>
      <a class="sidebar-category ${category === "fiber" ? "active" : ""}" data-fiber-category="fiber" href="${href("fiber")}"><span>02</span><b>Fibras y cables</b><i>↗</i></a>
      <a class="sidebar-category ${category === "connections" ? "active" : ""}" data-fiber-category="connections" href="${href("connections")}"><span>03</span><b>Conectores</b><i>↗</i></a>
      <a class="sidebar-category ${category === "testing" ? "active" : ""}" data-fiber-category="testing" href="${href("testing")}"><span>04</span><b>Potencia y pruebas</b><i>↗</i></a>`;
  }
  nav.innerHTML = data.modules.map(([file, label], index) => `<a class="${file === current ? "active" : ""}" href="${file}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("");
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
  const link = event.target.closest(".lesson-nav a, .lesson-actions a, a.spectrum-cta");
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
