const guideData = {
  initial: {
    folder: "configuracion-inicial",
    label: "Config. inicial",
    sections: [
      ["index.html", "Antes de configurar"],
      ["conexion-cli.html", "Conocer la CLI"],
      ["configuracion-base.html", "Configuración básica"],
      ["seguridad.html", "Seguridad del dispositivo"],
      ["acceso-ssh.html", "Acceso remoto por SSH"],
      ["interfaces-ipv4.html", "IP en interfaces"],
      ["verificacion.html", "Verificación y guardado"],
    ],
  },
  vlans: {
    folder: "vlans",
    label: "VLANs",
    sections: [
      ["index.html", "Antes de configurar VLANs"],
      ["crear-vlans.html", "Crear y nombrar VLANs"],
      ["puertos-access.html", "Puertos de acceso"],
      ["verificacion.html", "Verificación y guardado"],
    ],
  },
  trunking: {
    folder: "trunking",
    label: "Trunking",
    sections: [
      ["index.html", "Antes de configurar trunks"],
      ["trunk-estatico.html", "Trunk estático"],
      ["vlan-nativa.html", "VLAN nativa"],
      ["verificacion.html", "VLANs permitidas y verificación"],
    ],
  },
  routing: {
    folder: "routing",
    label: "Routing",
    sections: [
      ["index.html", "Antes de configurar routing"],
      ["inter-vlan.html", "Routing inter-VLAN"],
      ["rutas-estaticas.html", "Rutas estáticas"],
      ["dhcp-vlan.html", "DHCP por VLAN"],
      ["ripv2.html", "RIPv2 básico"],
      ["ospf.html", "OSPF básico"],
      ["verificacion.html", "Verificación y diagnóstico"],
    ],
  },
};

function currentGuideKey(url = window.location.href) {
  const path = new URL(url, window.location.href).pathname;
  if (path.includes("/trunking/")) return "trunking";
  if (path.includes("/routing/")) return "routing";
  if (path.includes("/vlans/")) return "vlans";
  return "initial";
}

function renderGuideNavigation() {
  const guideSidebar = document.querySelector("[data-guide-sidebar]");
  if (!guideSidebar) return;

  const eyebrow = document.querySelector(".lesson-content .eyebrow");
  if (eyebrow) eyebrow.innerHTML = eyebrow.innerHTML.replace("Lección", "Módulo");

  guideSidebar.querySelector(".sidebar-categories")?.remove();
  const guideKey = currentGuideKey();
  const categories = document.createElement("nav");
  categories.className = "sidebar-categories";
  categories.setAttribute("aria-label", "Categorías de Packet Tracer");
  const categoryHref = (key) => guideKey === key ? "index.html" : `../${guideData[key].folder}/index.html`;
  categories.innerHTML = `
    <a class="sidebar-category ${guideKey === "initial" ? "active" : ""}" data-guide="initial" href="${categoryHref("initial")}"><span>01</span><b>Config. inicial</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "vlans" ? "active" : ""}" data-guide="vlans" href="${categoryHref("vlans")}"><span>02</span><b>VLANs</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "trunking" ? "active" : ""}" data-guide="trunking" href="${categoryHref("trunking")}"><span>03</span><b>Trunking</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "routing" ? "active" : ""}" data-guide="routing" href="${categoryHref("routing")}"><span>04</span><b>Routing</b><i aria-hidden="true">↗</i></a>`;
  guideSidebar.querySelector(".sidebar-brand")?.insertAdjacentElement("afterend", categories);

  const lessonNav = guideSidebar.querySelector(".lesson-nav");
  const sections = guideData[guideKey].sections;
  const currentLesson = new URL(window.location.href).pathname.split("/").pop();
  if (lessonNav) {
    lessonNav.innerHTML = sections.map(([fileName, label], index) =>
      `<a class="${fileName === currentLesson ? "active" : ""}" href="${fileName}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`
    ).join("");
  }

  const isIntroModule = currentLesson === "index.html";
  const lessonLead = document.querySelector(".lesson-content .lesson-lead");
  if (isIntroModule && lessonLead && !document.querySelector(".equipment-note")) {
    lessonLead.insertAdjacentHTML("afterend", '<div class="lesson-note equipment-note"><strong>Equipos recomendados:</strong> utiliza un router Cisco 2911 y un switch Cisco 2960 (capa 2). Son modelos disponibles en Packet Tracer y compatibles con los ejercicios de esta guía.</div>');
  }
}

async function fetchGuideDocument(url) {
  const response = await fetch(url, { headers: { "X-Requested-With": "DGNV-Studios" } });
  if (!response.ok) throw new Error("No se pudo cargar la guía.");
  return new DOMParser().parseFromString(await response.text(), "text/html");
}

async function loadLesson(url, addHistory = true) {
  const lessonContent = document.querySelector(".lesson-content");
  if (!lessonContent) return;

  try {
    const nextDocument = await fetchGuideDocument(url);
    const nextContent = nextDocument.querySelector(".lesson-content");
    if (!nextContent) throw new Error("La lección no tiene contenido compatible.");

    lessonContent.innerHTML = nextContent.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    document.querySelector(".learning-shell")?.scrollTo({ top: 0, behavior: "smooth" });
    renderGuideNavigation();
  } catch (error) {
    window.location.href = url;
  }
}

async function loadGuide(url, addHistory = true) {
  const learningShell = document.querySelector(".learning-shell");
  const lessonContent = document.querySelector(".lesson-content");
  if (!learningShell || !lessonContent) return;

  try {
    const nextDocument = await fetchGuideDocument(url);
    const nextShell = nextDocument.querySelector(".learning-shell");
    if (!nextShell) throw new Error("La categoría no tiene contenido compatible.");

    learningShell.innerHTML = nextShell.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    learningShell.scrollTo({ top: 0, behavior: "smooth" });
    renderGuideNavigation();
  } catch (error) {
    window.location.href = url;
  }
}

document.addEventListener("click", (event) => {
  const sidebarToggle = event.target.closest("[data-sidebar-toggle]");
  if (sidebarToggle) {
    const guideSidebar = document.querySelector("[data-guide-sidebar]");
    if (!guideSidebar) return;
    const isOpen = guideSidebar.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    return;
  }

  const categoryLink = event.target.closest("a.sidebar-category, a.topic-link");
  if (categoryLink && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    loadGuide(categoryLink.href);
    return;
  }

  const lessonLink = event.target.closest(".lesson-nav a, .lesson-actions a");
  if (!lessonLink || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const currentFolder = new URL("./", window.location.href).pathname;
  const targetFolder = new URL("./", lessonLink.href).pathname;
  if (currentFolder !== targetFolder) return;
  event.preventDefault();
  loadLesson(lessonLink.href);
});

window.addEventListener("popstate", () => {
  const guideKey = currentGuideKey();
  const activeCategory = document.querySelector(".sidebar-category.active");
  if (activeCategory?.dataset.guide !== guideKey) {
    loadGuide(window.location.href, false);
  } else {
    loadLesson(window.location.href, false);
  }
});

renderGuideNavigation();
