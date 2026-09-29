const mathPreparationModules = [
  ["index.html", "Para qué sirven las funciones"],
  ["colab.html", "Google Colab y sus archivos"],
  ["librerias.html", "Librerías y buenas prácticas"],
  ["adaptar-codigo.html", "Adaptar códigos del formulario"],
  ["comprobar-resultados.html", "Ejecutar, comprobar e interpretar"],
];

function renderMathNavigation() {
  const nav = document.querySelector(".lesson-nav");
  if (!nav) return;
  const current = new URL(window.location.href).pathname.split("/").pop();
  nav.innerHTML = mathPreparationModules
    .map(
      ([file, label], index) =>
        `<a class="${file === current ? "active" : ""}" href="${file}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`,
    )
    .join("");
}

async function loadMathModule(url, addHistory = true) {
  const content = document.querySelector(".lesson-content");
  if (!content) return;

  try {
    const response = await fetch(url, {
      headers: { "X-Requested-With": "DGNV-Studios" },
    });
    if (!response.ok) throw new Error();
    const nextDocument = new DOMParser().parseFromString(
      await response.text(),
      "text/html",
    );
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

document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-sidebar-toggle]");
  if (toggle) {
    const sidebar = document.querySelector("[data-guide-sidebar]");
    const open = sidebar?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
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

window.addEventListener("popstate", () =>
  loadMathModule(window.location.href, false),
);

renderMathNavigation();
