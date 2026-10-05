const guideData = {
  redundancy: {
    folder: "redundancia-capa-3",
    label: "Redundancia de capa 3",
    sections: [["index.html", "Redundancia de capa 3"]],
  },
  layer2security: {
    folder: "seguridad-capa-2",
    label: "Seguridad de capa 2",
    sections: [["index.html", "Seguridad de capa 2"]],
  },
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
  spanning: {
    folder: "spanning-tree",
    label: "Spanning Tree",
    sections: [
      ["index.html", "Fundamentos y tipos"],
      ["eleccion.html", "BPDU, BID y elección"],
      ["puertos-estados.html", "Puertos, estados y tiempos"],
      ["configuracion.html", "Configuración y verificación"],
    ],
  },
  etherchannel: {
    folder: "etherchannel",
    label: "EtherChannel",
    sections: [
      ["index.html", "Fundamentos de EtherChannel"],
      ["pagp.html", "PAgP y LACP"],
      ["agrupar-puertos.html", "Agrupar puertos físicos"],
      ["trunk-verificacion.html", "Trunk, verificación y guardado"],
    ],
  },
};

function currentGuideKey(url = window.location.href) {
  const path = new URL(url, window.location.href).pathname;
  if (path.endsWith("/packet-tracer/modulo-en-blanco.html")) return "standalone";
  if (path.includes("/redundancia-capa-3/")) return "redundancy";
  if (path.includes("/seguridad-capa-2/")) return "layer2security";
  if (path.includes("/etherchannel/")) return "etherchannel";
  if (path.includes("/spanning-tree/")) return "spanning";
  if (path.includes("/trunking/")) return "trunking";
  if (path.includes("/routing/")) return "routing";
  if (path.includes("/vlans/")) return "vlans";
  return "initial";
}

function renderGuideNavigation() {
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = favicon.href;
  const guideSidebar = document.querySelector("[data-guide-sidebar]");
  if (!guideSidebar) return;
  document.querySelectorAll("[data-copy-cli]").forEach((button) => { button.hidden = false; });

  const eyebrow = document.querySelector(".lesson-content .eyebrow");
  if (eyebrow) eyebrow.innerHTML = eyebrow.innerHTML.replace("Lección", "Módulo");

  guideSidebar.querySelector(".sidebar-categories")?.remove();
  const guideKey = currentGuideKey();
  const categories = document.createElement("nav");
  categories.className = "sidebar-categories";
  categories.setAttribute("aria-label", "Categorías de Packet Tracer");
  const standalone = guideKey === "standalone";
  const categoryHref = (key) => standalone ? `${guideData[key].folder}/index.html` : guideKey === key ? "index.html" : `../${guideData[key].folder}/index.html`;
  categories.innerHTML = `
    <a class="sidebar-category ${guideKey === "initial" ? "active" : ""}" data-guide="initial" href="${categoryHref("initial")}"><span>01</span><b>Config. inicial</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "vlans" ? "active" : ""}" data-guide="vlans" href="${categoryHref("vlans")}"><span>02</span><b>VLANs</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "trunking" ? "active" : ""}" data-guide="trunking" href="${categoryHref("trunking")}"><span>03</span><b>Trunking</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "routing" ? "active" : ""}" data-guide="routing" href="${categoryHref("routing")}"><span>04</span><b>Routing</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "spanning" ? "active" : ""}" data-guide="spanning" href="${categoryHref("spanning")}"><span>05</span><b>Spanning Tree</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "etherchannel" ? "active" : ""}" data-guide="etherchannel" href="${categoryHref("etherchannel")}"><span>06</span><b>EtherChannel</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "redundancy" ? "active" : ""}" data-guide="redundancy" href="${categoryHref("redundancy")}"><span>07</span><b>Redundancia de capa 3</b><i aria-hidden="true">↗</i></a>
    <a class="sidebar-category ${guideKey === "layer2security" ? "active" : ""}" data-guide="layer2security" href="${categoryHref("layer2security")}"><span>08</span><b>Seguridad de capa 2</b><i aria-hidden="true">↗</i></a>`;
  guideSidebar.querySelector(".sidebar-brand")?.insertAdjacentElement("afterend", categories);

  const lessonNav = guideSidebar.querySelector(".lesson-nav");
  const sections = guideData[guideKey]?.sections || [];
  const currentLesson = new URL(window.location.href).pathname.split("/").pop();
  if (lessonNav) {
    lessonNav.hidden = standalone;
    lessonNav.innerHTML = sections.map(([fileName, label], index) =>
      `<a class="${fileName === currentLesson ? "active" : ""}" href="${fileName}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`
    ).join("");
  }

  let extraLink = guideSidebar.querySelector(".sidebar-standalone");
  if (!extraLink) {
    extraLink = document.createElement("a");
    extraLink.className = "sidebar-category sidebar-standalone";
    extraLink.innerHTML = '<span>+</span><b>Referencia de comandos</b><i aria-hidden="true">↗</i>';
    guideSidebar.append(extraLink);
  }
  extraLink.href = standalone ? "modulo-en-blanco.html" : "../modulo-en-blanco.html";
  extraLink.dataset.guide = "standalone";
  extraLink.classList.toggle("active", standalone);

  const isIntroModule = currentLesson === "index.html";
  const lessonLead = document.querySelector(".lesson-content .lesson-lead");
  if (!standalone && !["redundancy", "layer2security"].includes(guideKey) && isIntroModule && lessonLead && !document.querySelector(".equipment-note")) {
    const equipmentCopy = guideKey === "spanning"
      ? '<strong>Equipos recomendados:</strong> utiliza tres switches Cisco 2960 (capa 2). No necesitas un router para observar el funcionamiento de Spanning Tree en esta práctica.'
      : guideKey === "etherchannel"
        ? '<strong>Equipos recomendados:</strong> utiliza cuatro switches Cisco 2960 (capa 2). La topología del taller forma un cuadrado con dos enlaces por cada lado y seis PC para probar las VLANs.'
        : '<strong>Equipos recomendados:</strong> utiliza un router Cisco 2911 y un switch Cisco 2960 (capa 2). Son modelos disponibles en Packet Tracer y compatibles con los ejercicios de esta guía.';
    lessonLead.insertAdjacentHTML("afterend", `<div class="lesson-note equipment-note">${equipmentCopy}</div>`);
  }
}

async function fetchGuideDocument(url) {
  const response = await fetch(url, { headers: { "X-Requested-With": "DGNV-Studios" } });
  if (!response.ok) throw new Error("No se pudo cargar la guía.");
  const page = new DOMParser().parseFromString(await response.text(), "text/html");
  page.querySelectorAll("img[src], image[href]").forEach((item) => {
    const attribute = item.tagName.toLowerCase() === "image" ? "href" : "src";
    item.setAttribute(attribute, new URL(item.getAttribute(attribute), response.url).href);
  });
  return page;
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

async function copyReferenceCommands(button) {
  const terminal = button.closest(".reference-terminal");
  const code = terminal?.querySelector("code");
  const status = terminal?.querySelector(".reference-copy-status");
  if (!code || !status) return;
  button.disabled = true;
  status.textContent = "";
  try {
    await navigator.clipboard.writeText(code.textContent.trim() + "\n");
    button.textContent = "Copiado";
    status.textContent = "Comandos copiados.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Selecciona y copia el texto, o usa Ctrl+C / ⌘C.";
  } finally {
    button.disabled = false;
    window.setTimeout(() => {
      if (!button.isConnected) return;
      button.textContent = "Copiar";
      status.textContent = "";
    }, 3500);
  }
}

function setLabTopologyView(button) {
  const figure = button.closest(".lab-topology");
  const svg = figure?.querySelector(".lab-topology-svg");
  if (!svg) return;
  const views = {
    general: "0 0 2180 1030",
    left: "0 100 675 930",
    center: "675 0 650 1030",
    right: "1295 0 885 1030",
  };
  const view = views[button.dataset.labView];
  if (!view) return;
  svg.setAttribute("viewBox", view);
  const dimensions = view.split(" ");
  const [left, top, width, height] = dimensions.map(Number);
  const clip = svg.querySelector("#lab-view-clip rect");
  if (clip) {
    ["x", "y", "width", "height"].forEach((attribute, index) => {
      clip.setAttribute(attribute, dimensions[index]);
    });
  }
  svg.querySelectorAll("text, .lab-map-note").forEach((label) => {
    const bounds = label.getBBox();
    const outside = bounds.x < left || bounds.y < top ||
      bounds.x + bounds.width > left + width || bounds.y + bounds.height > top + height;
    label.style.visibility = button.dataset.labView !== "general" && outside ? "hidden" : "";
  });
  svg.style.aspectRatio = `${dimensions[2]} / ${dimensions[3]}`;
  svg.dataset.labView = button.dataset.labView;
  figure.querySelectorAll("[data-lab-view]").forEach((item) => {
    item.setAttribute("aria-pressed", String(item === button));
  });
}

async function expandLabTopology(button) {
  const figure = button.closest(".lab-topology");
  const status = figure?.querySelector(".lab-topology-status");
  if (!figure || !status) return;
  try {
    if (document.fullscreenElement === figure) await document.exitFullscreen();
    else await figure.requestFullscreen();
    status.textContent = "";
  } catch {
    status.textContent = "Usa los botones de zona para ampliar los detalles en este navegador.";
  }
}

document.addEventListener("fullscreenchange", () => {
  document.querySelectorAll("[data-lab-fullscreen]").forEach((button) => {
    button.textContent = document.fullscreenElement === button.closest(".lab-topology") ? "Cerrar ampliación" : "Ampliar plano";
  });
});

document.addEventListener("click", (event) => {
  const topologyView = event.target.closest("[data-lab-view]");
  if (topologyView) {
    setLabTopologyView(topologyView);
    return;
  }
  const topologyFullscreen = event.target.closest("[data-lab-fullscreen]");
  if (topologyFullscreen) {
    expandLabTopology(topologyFullscreen);
    return;
  }
  const copyButton = event.target.closest("[data-copy-cli]");
  if (copyButton) {
    copyReferenceCommands(copyButton);
    return;
  }
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
