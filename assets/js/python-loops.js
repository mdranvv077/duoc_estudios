const loopModules = [
  ["index.html", "Repetir con while"],
  ["for-range.html", "Repetir con for y range()"],
];

function renderLoopNavigation() {
  const nav = document.querySelector(".lesson-nav");
  if (!nav) return;
  const current = new URL(location.href).pathname.split("/").pop();
  nav.innerHTML = loopModules.map(([file, label], index) => `<a class="${file === current ? "active" : ""}" href="${file}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("");
}

function addLoopOutputs() {
  const lesson = new URL(location.href).pathname.split("/").pop();
  const outputs = {
    "index.html": ["Intento 1<br>Intento 2<br>Intento 3"],
    "for-range.html": ["Ronda 1<br>Ronda 2<br>Ronda 3", "0<br>1<br>2", "0% completado<br>25% completado<br>50% completado<br>75% completado<br>100% completado"],
  };
  const blocks = document.querySelectorAll(".code-block");
  outputs[lesson]?.forEach((text, index) => {
    const block = blocks[index];
    if (!block || block.nextElementSibling?.classList.contains("code-output")) return;
    block.insertAdjacentHTML("afterend", `<div class="code-output" aria-label="Resultado del código"><span class="code-output-label">Python · resultado</span><code>${text}</code></div>`);
  });
}

async function loadLoopModule(url, addHistory = true) {
  const content = document.querySelector(".lesson-content");
  if (!content) return;
  try {
    const response = await fetch(url, { headers: { "X-Requested-With": "DGNV-Studios" } });
    if (!response.ok) throw new Error();
    const nextDocument = new DOMParser().parseFromString(await response.text(), "text/html");
    const nextContent = nextDocument.querySelector(".lesson-content");
    if (!nextContent) throw new Error();
    content.innerHTML = nextContent.innerHTML;
    document.title = nextDocument.title;
    if (addHistory) history.pushState({}, "", url);
    document.querySelector(".learning-shell")?.scrollTo({ top: 0, behavior: "smooth" });
    renderLoopNavigation();
    addLoopOutputs();
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
  const link = event.target.closest(".lesson-nav a, .lesson-actions a");
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (new URL("./", link.href).pathname !== new URL("./", location.href).pathname) return;
  event.preventDefault();
  loadLoopModule(link.href);
});

addEventListener("popstate", () => loadLoopModule(location.href, false));
renderLoopNavigation();
addLoopOutputs();
