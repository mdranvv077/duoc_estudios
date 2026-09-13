const loopModules = [["index.html", "Repetir con while"]];

function renderLoopNavigation() {
  const nav = document.querySelector(".lesson-nav");
  if (!nav) return;
  nav.innerHTML = loopModules.map(([file, label], index) => `<a class="${file === new URL(location.href).pathname.split("/").pop() ? "active" : ""}" href="${file}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("");
}

function addLoopOutputs() {
  const blocks = document.querySelectorAll(".code-block");
  const outputs = ["Intento 1<br>Intento 2<br>Intento 3"];
  outputs.forEach((text, index) => {
    const block = blocks[index];
    if (!block || block.nextElementSibling?.classList.contains("code-output")) return;
    block.insertAdjacentHTML("afterend", `<div class="code-output" aria-label="Resultado del código"><span class="code-output-label">Python · resultado</span><code>${text}</code></div>`);
  });
}

document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-sidebar-toggle]");
  if (!toggle) return;
  const sidebar = document.querySelector("[data-guide-sidebar]");
  const open = sidebar?.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

renderLoopNavigation();
addLoopOutputs();
