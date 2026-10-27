(() => {
  const field = document.querySelector("[data-home-grid]");
  if (!field || typeof field.animate !== "function") return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const traces = new Set();
  const cell = 48;
  let timer;
  let resizeTimer;
  let width = 0;
  let height = 0;
  let limit = 0;

  const random = (min, max) => min + Math.random() * (max - min);
  const integer = (min, max) => Math.floor(random(min, max + 1));
  const allowed = () => !document.hidden && !reducedMotion.matches;

  function clearTraces() {
    clearTimeout(timer);
    for (const trace of traces) {
      trace.animation.cancel();
      trace.element.remove();
    }
    traces.clear();
  }

  function addTrace(inProgress = false) {
    if (!allowed() || traces.size >= limit || width < cell * 2 || height < cell * 2) return;
    const horizontal = Math.random() < .65;
    const reverse = Math.random() < .5;
    const maxLane = Math.max(1, Math.floor((horizontal ? height * .68 : width) / cell) - 1);
    let lane;
    // Avoid stacking glows on the same grid line.
    for (let attempt = 0; attempt < 8; attempt++) {
      lane = integer(1, maxLane);
      if (![...traces].some(trace => trace.horizontal === horizontal && trace.lane === lane)) break;
      if (attempt === 7) return;
    }
    const element = document.createElement("span");
    element.className = "home-grid-current__trace home-grid-current__trace--" + (horizontal ? "horizontal" : "vertical");
    element.style.setProperty("--trace-color", Math.random() < .8 ? "46, 234, 255" : "255, 46, 123");
    element.style.setProperty("--trace-angle", (horizontal ? reverse ? 270 : 90 : reverse ? 0 : 180) + "deg");
    element.style[horizontal ? "top" : "left"] = lane * cell + "px";
    field.append(element);

    const length = horizontal ? 240 : 180;
    const extent = horizontal ? width : height;
    const start = reverse ? extent + 20 : -length - 20;
    const end = reverse ? -length - 20 : extent + 20;
    const transform = value => horizontal ? "translate3d(" + value + "px,0,0)" : "translate3d(0," + value + "px,0)";
    const duration = (extent + length + 40) / random(42, 72) * 1000;
    const brightness = random(.23, .32);
    const animation = element.animate([
      { transform: transform(start), opacity: 0, offset: 0 },
      { transform: transform(start + (end - start) * .12), opacity: brightness, offset: .12 },
      { transform: transform(start + (end - start) * .8), opacity: brightness, offset: .8 },
      { transform: transform(end), opacity: 0, offset: 1 },
    ], { duration, easing: "linear", fill: "both" });
    const trace = { element, animation, horizontal, lane };
    traces.add(trace);
    if (inProgress) animation.currentTime = random(.16, .7) * duration;
    animation.finished.then(() => {
      animation.cancel();
      element.remove();
      traces.delete(trace);
    }).catch(() => { /* Expected on resize, page hiding or reduced motion. */ });
  }

  function schedule() {
    if (!allowed()) return;
    addTrace();
    timer = setTimeout(schedule, random(900, 1800));
  }

  function restart() {
    clearTimeout(resizeTimer);
    clearTraces();
    if (!allowed()) return;
    width = field.clientWidth;
    height = field.clientHeight;
    limit = width < 760 ? 4 : 8;
    for (let i = 0; i < limit; i++) addTrace(true);
    timer = setTimeout(schedule, random(500, 1000));
  }

  document.addEventListener("visibilitychange", restart);
  reducedMotion.addEventListener("change", restart);
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    clearTraces();
    resizeTimer = setTimeout(restart, 180);
  }, { passive: true });
  window.addEventListener("pagehide", clearTraces);
  window.addEventListener("pageshow", restart);
  restart();
})();
