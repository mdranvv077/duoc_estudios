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

if (sidebarToggle && guideSidebar) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = guideSidebar.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
