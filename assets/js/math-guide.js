const mathGuideData = {
  preparation: {
    folder: "preparacion",
    label: "Preparación",
    modules: [
      ["index.html", "Para qué sirven las funciones"],
      ["colab.html", "Google Colab y sus archivos"],
      ["librerias.html", "Librerías y buenas prácticas"],
      ["adaptar-codigo.html", "Adaptar códigos del formulario"],
      ["comprobar-resultados.html", "Ejecutar, comprobar e interpretar"],
    ],
  },
  fundamentals: {
    folder: "fundamentos-funciones",
    label: "Fundamentos",
    modules: [
      ["index.html", "Qué es una función"],
      ["notacion.html", "Cómo leer f(x)"],
      ["variables-unidades.html", "Variables y unidades"],
      ["dominio.html", "Dominio y contexto"],
      ["representaciones.html", "Representar una función"],
      ["evaluar-interpretar.html", "Evaluar e interpretar"],
    ],
  },
  linear: {
    folder: "funciones-lineales",
    label: "Funciones lineales",
    modules: [
      ["index.html", "Reconocer una función lineal"],
      ["forma-general.html", "La forma mx + n"],
      ["pendiente.html", "Pendiente y razón de cambio"],
      ["coeficiente-posicion.html", "Coeficiente de posición"],
      ["modelo-datos.html", "Construir un modelo"],
      ["evaluar-resolver.html", "Evaluar y buscar entradas"],
      ["graficar.html", "Graficar con Matplotlib"],
      ["comparar-modelos.html", "Comparar dos modelos"],
    ],
  },
  nonlinear: {
    folder: "funciones-no-lineales",
    label: "Funciones no lineales",
    modules: [
      ["index.html", "Reconocer modelos no lineales"],
      ["cuadraticas.html", "Funciones cuadráticas"],
      ["puntos-clave.html", "Puntos clave de una parábola"],
      ["intersecciones-intervalos.html", "Intersecciones e intervalos"],
      ["polinomios.html", "Funciones polinómicas"],
      ["exponenciales.html", "Funciones exponenciales"],
      ["raiz-cuadrada.html", "Funciones con raíz cuadrada"],
      ["por-tramos.html", "Funciones definidas por tramos"],
      ["analisis-completo.html", "Analizar un problema completo"],
    ],
  },
};

function currentMathCategory(url = window.location.href) {
  const path = new URL(url, window.location.href).pathname;
  if (path.includes("/funciones-no-lineales/")) return "nonlinear";
  if (path.includes("/funciones-lineales/")) return "linear";
  return path.includes("/fundamentos-funciones/")
    ? "fundamentals"
    : "preparation";
}

function renderMathNavigation() {
  const sidebar = document.querySelector("[data-guide-sidebar]");
  const nav = document.querySelector(".lesson-nav");
  if (!sidebar || !nav) return;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const category = currentMathCategory();
  const data = mathGuideData[category];
  const current = new URL(window.location.href).pathname.split("/").pop();

  const oldCategories = sidebar.querySelector(".sidebar-categories");
  if (oldCategories) {
    oldCategories.innerHTML = `
      <span class="sidebar-episode-label">Episodio 01</span>
      <a class="sidebar-category ${category === "preparation" ? "active" : ""}" data-math-category="preparation" href="${category === "preparation" ? "index.html" : "../preparacion/index.html"}"><span>01</span><b>Preparación</b><i>↗</i></a>
      <a class="sidebar-category ${category === "fundamentals" ? "active" : ""}" data-math-category="fundamentals" href="${category === "fundamentals" ? "index.html" : "../fundamentos-funciones/index.html"}"><span>02</span><b>Fundamentos</b><i>↗</i></a>
      <a class="sidebar-category ${category === "linear" ? "active" : ""}" data-math-category="linear" href="${category === "linear" ? "index.html" : "../funciones-lineales/index.html"}"><span>03</span><b>Funciones lineales</b><i>↗</i></a>
      <a class="sidebar-category ${category === "nonlinear" ? "active" : ""}" data-math-category="nonlinear" href="${category === "nonlinear" ? "index.html" : "../funciones-no-lineales/index.html"}"><span>04</span><b>No lineales</b><i>↗</i></a>
      <span class="sidebar-episode-label">Episodio 02</span>
      <span class="sidebar-category is-soon"><span>01</span><b>Próximo módulo</b><em>Bloqueado</em></span>`;
  }

  nav.innerHTML = data.modules
    .map(
      ([file, label], index) =>
        `<a class="${file === current ? "active" : ""}" href="${file}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`,
    )
    .join("");
}

async function fetchMathDocument(url) {
  const response = await fetch(url, {
    headers: { "X-Requested-With": "DGNV-Studios" },
  });
  if (!response.ok) throw new Error();
  return new DOMParser().parseFromString(await response.text(), "text/html");
}

async function loadMathModule(url, addHistory = true) {
  const content = document.querySelector(".lesson-content");
  if (!content) return;

  try {
    const nextDocument = await fetchMathDocument(url);
    const nextContent = nextDocument.querySelector(".lesson-content");
    if (!nextContent) throw new Error();

    content.innerHTML = nextContent.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    document.querySelector(".learning-shell")?.scrollTo({ top: 0 });
    renderMathNavigation();
  } catch {
    window.location.href = url;
  }
}

async function loadMathCategory(url, addHistory = true) {
  const shell = document.querySelector(".learning-shell");
  if (!shell) return;

  try {
    const nextDocument = await fetchMathDocument(url);
    const nextShell = nextDocument.querySelector(".learning-shell");
    if (!nextShell) throw new Error();
    shell.innerHTML = nextShell.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    shell.scrollTo({ top: 0 });
    renderMathNavigation();
  } catch {
    window.location.href = url;
  }
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
  if (
    categoryLink &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  ) {
    event.preventDefault();
    loadMathCategory(categoryLink.href);
    return;
  }

  const link = event.target.closest(".lesson-nav a, .lesson-actions a");
  if (
    !link ||
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  if (
    new URL("./", link.href).pathname !==
    new URL("./", window.location.href).pathname
  )
    return;

  event.preventDefault();
  loadMathModule(link.href);
});

window.addEventListener("popstate", () => {
  const activeCategory = document.querySelector(".sidebar-category.active");
  const category = currentMathCategory();
  if (activeCategory?.dataset.mathCategory !== category) {
    loadMathCategory(window.location.href, false);
  } else {
    loadMathModule(window.location.href, false);
  }
});

renderMathNavigation();
