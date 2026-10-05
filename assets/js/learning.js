let renderedGuideUrl = window.location.href;
let referenceReturnButton = null;

const guideData = {
  redundancy: {
    folder: "redundancia-capa-3",
    label: "Redundancia de capa 3",
    sections: [
      ["index.html", "FHRP y la gateway virtual"],
      ["hsrp-basico.html", "HSRP sin VLAN"],
      ["hsrp-vlans.html", "HSRP con VLAN y subinterfaces"],
      ["verificacion.html", "Fallas y recuperación"],
    ],
  },
  layer2security: {
    folder: "seguridad-capa-2",
    label: "Seguridad de capa 2",
    sections: [
      ["index.html", "Introducción a la seguridad"],
      ["puertos.html", "Preparar y proteger los puertos"],
      ["port-security-dinamico.html", "Port Security dinámico"],
      ["mac-estatica.html", "MAC segura estática"],
      ["sticky.html", "Aprendizaje sticky"],
      ["infracciones.html", "Protect, restrict y shutdown"],
      ["verificacion.html", "Verificación y recuperación"],
    ],
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
  hideReferenceHelp();
  referenceReturnButton?.remove();
  referenceReturnButton = null;
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
    renderedGuideUrl = url;
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
    renderedGuideUrl = url;
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

const labViewTransitions = new WeakMap();
const labTopologyViews = {
  general: [0, 0, 2180, 1030],
  left: [0, 100, 675, 930],
  center: [675, 0, 710, 1030],
  right: [1295, 0, 885, 1030],
};

function setLabTopologyView(button) {
  const svg = button.closest(".lab-topology")?.querySelector(".lab-topology-svg");
  const target = labTopologyViews[button.dataset.labView];
  if (!svg || !target) return;
  const previous = labViewTransitions.get(svg);
  if (previous?.frame) cancelAnimationFrame(previous.frame);
  const transition = {};
  labViewTransitions.set(svg, transition);
  if ((svg.dataset.labView || "general") === button.dataset.labView ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyLabTopologyView(button);
    return;
  }
  const start = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const started = performance.now();
  svg.querySelectorAll("text, .lab-map-note").forEach((label) => { label.style.visibility = ""; });
  button.closest(".lab-topology").querySelectorAll("[data-lab-view]").forEach((item) => {
    item.setAttribute("aria-pressed", String(item === button));
  });
  const animate = (now) => {
    if (labViewTransitions.get(svg) !== transition || !svg.isConnected) return;
    const progress = Math.min(1, (now - started) / 700);
    const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    const dimensions = start.map((value, index) => value + (target[index] - value) * eased);
    updateLabTopologyViewport(svg, dimensions);
    if (progress < 1) transition.frame = requestAnimationFrame(animate);
    else applyLabTopologyView(button);
  };
  transition.frame = requestAnimationFrame(animate);
}

function updateLabTopologyViewport(svg, dimensions) {
  svg.setAttribute("viewBox", dimensions.join(" "));
  svg.style.aspectRatio = `${dimensions[2]} / ${dimensions[3]}`;
  const clip = svg.querySelector("#lab-view-clip rect");
  if (clip) {
    ["x", "y", "width", "height"].forEach((attribute, index) => {
      clip.setAttribute(attribute, dimensions[index]);
    });
  }
}

function applyLabTopologyView(button) {
  const figure = button.closest(".lab-topology");
  const svg = figure?.querySelector(".lab-topology-svg");
  if (!svg) return;
  const dimensions = labTopologyViews[button.dataset.labView];
  if (!dimensions) return;
  updateLabTopologyViewport(svg, dimensions);
  const [left, top, width, height] = dimensions;
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

let labExpansion = null;

function restoreLabTopology() {
  const state = labExpansion;
  if (!state) return;
  state.animation?.cancel();
  state.placeholder.replaceWith(state.figure);
  state.figure.classList.remove("is-expanded");
  state.figure.style.removeProperty("opacity");
  state.button.textContent = "Ampliar plano";
  state.button.setAttribute("aria-expanded", "false");
  state.overlay.remove();
  document.body.style.overflow = state.overflow;
  document.body.classList.remove("lab-expanded-page");
  labExpansion = null;
  state.button.focus({ preventScroll: true });
}

async function closeLabTopology() {
  const state = labExpansion;
  if (!state || state.closing) return;
  state.closing = true;
  state.animation?.cancel();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    state.overlay.classList.add("is-closing");
    state.animation = state.figure.animate([
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(.94)", opacity: 0 },
    ], { duration: 240, easing: "ease-in", fill: "forwards" });
    await state.animation.finished.catch(() => {});
  }
  if (labExpansion !== state) return;
  if (document.fullscreenElement === state.overlay) {
    try { await document.exitFullscreen(); } catch { /* Restore the page even if fullscreen has already ended. */ }
  }
  restoreLabTopology();
}

async function expandLabTopology(button) {
  if (labExpansion) { await closeLabTopology(); return; }
  const figure = button.closest(".lab-topology");
  const status = figure?.querySelector(".lab-topology-status");
  if (!figure || !status) return;
  const origin = figure.getBoundingClientRect();
  const placeholder = document.createElement("div");
  placeholder.style.height = `${origin.height}px`;
  placeholder.style.margin = getComputedStyle(figure).margin;
  const overlay = document.createElement("div");
  overlay.className = "lab-topology-overlay command-reference";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Topología ampliada");
  const backdrop = document.createElement("div");
  backdrop.className = "lab-topology-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.inert = true;
  const page = document.createElement("div");
  page.className = "lab-backdrop-page";
  page.style.width = `${innerWidth}px`;
  page.style.top = `${16 - scrollY}px`;
  for (const child of document.body.children) {
    if (child.tagName === "SCRIPT") continue;
    const copy = child.cloneNode(true);
    copy.removeAttribute("id");
    copy.querySelectorAll("[id], script").forEach((item) => {
      if (item.tagName === "SCRIPT") item.remove();
      else item.removeAttribute("id");
    });
    [copy, ...copy.querySelectorAll("*")].forEach((item) => {
      for (const attribute of [...item.attributes]) {
        if (attribute.name.startsWith("data-")) item.removeAttribute(attribute.name);
      }
    });
    page.append(copy);
  }
  backdrop.append(page);
  figure.replaceWith(placeholder);
  figure.classList.add("is-expanded");
  figure.style.opacity = "0";
  overlay.append(backdrop, figure);
  document.body.append(overlay);
  labExpansion = { figure, button, overlay, placeholder, overflow: document.body.style.overflow, animation: null, closing: false };
  document.body.style.overflow = "hidden";
  document.body.classList.add("lab-expanded-page");
  button.textContent = "Cerrar ampliación";
  button.setAttribute("aria-expanded", "true");
  status.textContent = "";
  // Request immediately from the click, before waiting, to preserve browser permission.
  try { await overlay.requestFullscreen({ navigationUI: "hide" }); }
  catch { status.textContent = "Este navegador no permite ocultar sus barras. El plano sigue ampliado; pulsa Esc para cerrar."; }
  if (labExpansion?.overlay !== overlay) return;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    labExpansion.animation = figure.animate([
      { opacity: 0 },
      { opacity: 1 },
    ], { duration: 650, delay: 250, easing: "ease-in-out", fill: "both" });
  } else figure.style.opacity = "1";
  button.focus({ preventScroll: true });
  overlay.addEventListener("click", (event) => { if (event.target === overlay || backdrop.contains(event.target)) closeLabTopology(); });
}

document.addEventListener("fullscreenchange", () => {
  if (labExpansion && !document.fullscreenElement) restoreLabTopology();
});

document.addEventListener("keydown", (event) => {
  if (!labExpansion) return;
  if (event.key === "Escape") { event.preventDefault(); closeLabTopology(); }
  if (event.key === "Tab") {
    const controls = [...labExpansion.figure.querySelectorAll("button, [tabindex='0']")];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});

function scrollToReferenceTarget(target) {
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  const shell = target.closest(".learning-shell");
  if (shell && /auto|scroll/.test(getComputedStyle(shell).overflowY)) {
    shell.scrollTo({ top: shell.scrollTop + target.getBoundingClientRect().top - shell.getBoundingClientRect().top - 25, behavior });
  } else {
    window.scrollTo({ top: scrollY + target.getBoundingClientRect().top - 25, behavior });
  }
}

const referenceHelpSelector = ".reference-index a[data-help], .reference-module-links a[data-help]";
let referenceHelp = null;
let referenceHelpLink = null;
let referenceHelpHideTimer = null;
let referenceHelpShowTimer = null;
let referenceHelpActiveGroup = null;
const referenceHelpGroupSelector = ".reference-index, .reference-module-links";

function scheduleReferenceHelp(link) {
  const group = link.closest(referenceHelpGroupSelector);
  const isReady = group && group === referenceHelpActiveGroup;
  hideReferenceHelp(true);
  if (isReady) {
    showReferenceHelp(link);
    return;
  }
  referenceHelpShowTimer = setTimeout(() => {
    referenceHelpShowTimer = null;
    if (link.isConnected && (link.matches(":hover") || link.matches(":focus-visible"))) showReferenceHelp(link);
  }, 1200);
}

function hideReferenceHelp(preserveGroup = false) {
  if (preserveGroup !== true) referenceHelpActiveGroup = null;
  clearTimeout(referenceHelpShowTimer);
  referenceHelpShowTimer = null;
  if (!referenceHelp) return;
  referenceHelpLink?.removeAttribute("aria-describedby");
  referenceHelpLink = null;
  referenceHelp.classList.remove("is-visible");
  clearTimeout(referenceHelpHideTimer);
  referenceHelpHideTimer = setTimeout(() => { referenceHelp.hidden = true; }, 180);
}

function showReferenceHelp(link) {
  if (!link?.dataset.help) return;
  referenceHelpActiveGroup = link.closest(referenceHelpGroupSelector);
  clearTimeout(referenceHelpHideTimer);
  referenceHelpLink?.removeAttribute("aria-describedby");
  if (!referenceHelp) {
    referenceHelp = document.createElement("div");
    referenceHelp.className = "reference-help";
    referenceHelp.id = "reference-link-help";
    referenceHelp.setAttribute("role", "tooltip");
    document.body.append(referenceHelp);
  }
  referenceHelpLink = link;
  referenceHelp.textContent = link.dataset.help;
  referenceHelp.hidden = false;
  link.setAttribute("aria-describedby", referenceHelp.id);
  const anchor = link.getBoundingClientRect();
  const tooltip = referenceHelp.getBoundingClientRect();
  const margin = 12;
  const left = Math.max(margin, Math.min(anchor.left + (anchor.width - tooltip.width) / 2, innerWidth - tooltip.width - margin));
  const above = anchor.top - tooltip.height - 9;
  const top = above >= margin ? above : Math.min(anchor.bottom + 9, innerHeight - tooltip.height - margin);
  referenceHelp.style.left = `${left}px`;
  referenceHelp.style.top = `${Math.max(margin, top)}px`;
  referenceHelp.getBoundingClientRect();
  referenceHelp.classList.add("is-visible");
}

document.addEventListener("pointerover", (event) => {
  const link = event.target.closest(referenceHelpSelector);
  if (link && !link.contains(event.relatedTarget)) scheduleReferenceHelp(link);
});
document.addEventListener("pointerout", (event) => {
  const group = event.target.closest(referenceHelpGroupSelector);
  if (group && !group.contains(event.relatedTarget)) referenceHelpActiveGroup = null;
  const link = event.target.closest(referenceHelpSelector);
  if (link && !link.contains(event.relatedTarget) && !link.matches(":focus-visible")) hideReferenceHelp(true);
});
document.addEventListener("focusin", (event) => {
  if (event.target.matches(referenceHelpSelector)) scheduleReferenceHelp(event.target);
});
document.addEventListener("focusout", (event) => {
  if (event.target.matches(referenceHelpSelector)) {
    const group = event.target.closest(referenceHelpGroupSelector);
    hideReferenceHelp(Boolean(group?.contains(event.relatedTarget)));
  }
});
document.addEventListener("scroll", hideReferenceHelp, true);
window.addEventListener("resize", hideReferenceHelp);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") hideReferenceHelp(); });

const referenceDisclosures = new WeakMap();

function finishReferenceDisclosure(details) {
  const state = referenceDisclosures.get(details);
  if (!state) return;
  referenceDisclosures.delete(details);
  state.animation?.cancel();
  details.open = state.expanded;
  details.classList.remove("is-unfolding");
}

function animateReferenceDisclosure(details, expanded) {
  const previous = referenceDisclosures.get(details);
  const startHeight = details.getBoundingClientRect().height;
  const nextOpen = expanded ?? !(previous ? previous.expanded : details.open);
  previous?.animation?.cancel();
  referenceDisclosures.delete(details);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    details.open = nextOpen;
    details.classList.remove("is-unfolding");
    return;
  }
  details.open = nextOpen;
  const endHeight = details.getBoundingClientRect().height;
  // Keep the content rendered until the closing animation finishes.
  details.open = true;
  details.classList.add("is-unfolding");
  const state = { expanded: nextOpen };
  referenceDisclosures.set(details, state);
  state.animation = details.animate([
    { height: `${startHeight}px` }, { height: `${endHeight}px` },
  ], { duration: 360, easing: "cubic-bezier(.2,.75,.2,1)", fill: "both" });
  state.animation.finished.then(() => {
    if (referenceDisclosures.get(details) === state) finishReferenceDisclosure(details);
  }).catch(() => {});
}

function showReferenceReturnButton() {
  if (referenceReturnButton) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "reference-return";
  button.setAttribute("aria-label", "Volver al selector de apartados");
  button.title = "Volver al selector de apartados";
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>';
  button.addEventListener("click", () => {
    const directory = document.querySelector(".reference-directory");
    if (!directory) return;
    if (!directory.open) animateReferenceDisclosure(directory, true);
    history.pushState({}, "", `#${directory.id}`);
    directory.querySelector("summary")?.focus({ preventScroll: true });
    scrollToReferenceTarget(directory);
    button.remove();
    referenceReturnButton = null;
  });
  document.body.append(button);
  referenceReturnButton = button;
}

document.addEventListener("click", (event) => {
  const summary = event.target.closest("summary");
  const disclosure = summary?.parentElement;
  if (disclosure?.matches("details.reference-note, details.reference-directory")) {
    event.preventDefault();
    animateReferenceDisclosure(disclosure);
    return;
  }
  const referenceLink = event.target.closest('.reference-index a[href^="#"]');
  if (referenceLink && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const target = document.getElementById(decodeURIComponent(referenceLink.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    finishReferenceDisclosure(referenceLink.closest("details"));
    history.pushState({}, "", referenceLink.hash);
    const heading = target.querySelector("h2");
    if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
    scrollToReferenceTarget(target);
    showReferenceReturnButton();
    return;
  }
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
  const destination = new URL(window.location.href);
  const rendered = new URL(renderedGuideUrl, window.location.href);
  // Fragment navigation belongs to this document; let the browser scroll without replacing it.
  if (destination.origin === rendered.origin && destination.pathname === rendered.pathname &&
      destination.search === rendered.search) {
    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (target) requestAnimationFrame(() => scrollToReferenceTarget(target));
    return;
  }
  const guideKey = currentGuideKey();
  const activeCategory = document.querySelector(".sidebar-category.active");
  if (activeCategory?.dataset.guide !== guideKey) {
    loadGuide(window.location.href, false);
  } else {
    loadLesson(window.location.href, false);
  }
});

renderGuideNavigation();
