const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
const guideSidebar = document.querySelector("[data-guide-sidebar]");

if (guideSidebar) {
  const categories = document.createElement("nav");
  categories.className = "sidebar-categories";
  categories.setAttribute("aria-label", "Categorías de Packet Tracer");
  categories.innerHTML = `
    <a class="sidebar-category active" href="index.html"><span>01</span><b>Config. inicial</b><i aria-hidden="true">↗</i></a>
    <span class="sidebar-category is-soon"><span>02</span><b>VLANs</b><em>Pronto</em></span>
    <span class="sidebar-category is-soon"><span>03</span><b>Trunking</b><em>Pronto</em></span>
    <span class="sidebar-category is-soon"><span>04</span><b>Routing</b><em>Pronto</em></span>`;
  guideSidebar.querySelector(".sidebar-brand")?.insertAdjacentElement("afterend", categories);
}

const lessonNav = document.querySelector(".lesson-nav");
const lessonSections = [
  ["index.html", "Antes de configurar"],
  ["conexion-cli.html", "Conocer la CLI"],
  ["configuracion-base.html", "Configuración básica"],
  ["seguridad.html", "Seguridad del dispositivo"],
  ["acceso-ssh.html", "Acceso remoto por SSH"],
  ["interfaces-ipv4.html", "IP en interfaces"],
  ["verificacion.html", "Verificación y guardado"],
];

if (lessonNav) {
  const currentLesson = new URL(window.location.href).pathname.split("/").pop();
  lessonNav.innerHTML = lessonSections.map(([fileName, label], index) =>
    `<a class="${fileName === currentLesson ? "active" : ""}" href="${fileName}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`
  ).join("");
}

if (sidebarToggle && guideSidebar) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = guideSidebar.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const lessonContent = document.querySelector(".lesson-content");

async function loadLesson(url, addHistory = true) {
  if (!lessonContent) return;

  lessonContent.classList.add("is-changing");

  try {
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    const response = await fetch(url, { headers: { "X-Requested-With": "DGNV-Studios" } });
    if (!response.ok) throw new Error("No se pudo cargar la lección.");

    const nextDocument = new DOMParser().parseFromString(await response.text(), "text/html");
    const nextContent = nextDocument.querySelector(".lesson-content");
    if (!nextContent) throw new Error("La lección no tiene contenido compatible.");

    lessonContent.innerHTML = nextContent.innerHTML;
    document.title = nextDocument.title;

    document.querySelectorAll(".lesson-nav a").forEach((link) => {
      link.classList.toggle("active", new URL(link.href).pathname === new URL(url, window.location.href).pathname);
    });

    if (addHistory) history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => lessonContent.classList.remove("is-changing"));
  } catch (error) {
    window.location.href = url;
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest(".lesson-nav a, .lesson-actions a");
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  loadLesson(link.href);
});

window.addEventListener("popstate", () => loadLesson(window.location.href, false));
