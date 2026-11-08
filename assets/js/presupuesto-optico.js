(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const CLASSES = Object.freeze({ "B+": { system: "GPON", min: 13, max: 28 }, "C+": { system: "GPON", min: 17, max: 32 }, N1: { system: "XGS-PON", min: 14, max: 29 }, N2: { system: "XGS-PON", min: 16, max: 31 }, E1: { system: "XGS-PON", min: 18, max: 33 }, E2: { system: "XGS-PON", min: 20, max: 35 } });
  const SPLITTER_DB = Object.freeze({ 2: 4, 4: 7.6, 8: 10.7, 16: 14.2, 32: 17.8, 64: 21.8, 128: 25 });
  const TYPES = Object.freeze({ olt: "OLT", odf: "ODF", node: "Nodo con splitter", nap: "NAP", splitter: "Splitter", mufa: "Mufa", splice: "Empalme", roseta: "Roseta", ont: "ONT", point: "Punto de fibra" });
  const DEFAULTS = Object.freeze({ olt: [0, 0, null], odf: [1, 0, null], node: [0, 2, 8], nap: [1, 0, null], splitter: [0, 0, 8], mufa: [0, 2, null], splice: [0, 1, null], roseta: [1, 0, null], ont: [1, 0, null], point: [0, 0, null] });
  const ICONS = {
    olt: '<rect x="5" y="10" width="30" height="21" rx="2"/><path d="M10 17h20M10 22h8m4 0h8M10 27h20"/>',
    odf: '<rect x="7" y="7" width="26" height="26"/><path d="M7 15h26M14 20v7m6-7v7m6-7v7"/>',
    node: '<rect x="5" y="8" width="30" height="24" rx="4"/><path d="M9 20h10m0 0 10-8m-10 8h10m-10 0 10 8"/>',
    nap: '<rect x="7" y="7" width="26" height="26" rx="3"/><path d="M7 17h26M13 23h14M20 17v6"/>',
    splitter: '<path d="M5 20h11m0 0 19-12m-19 12 19-4m-19 4 19 4m-19-4 19 12"/>',
    mufa: '<rect x="8" y="12" width="24" height="16" rx="8"/><path d="M2 20h6m24 0h6M15 13v14m10-14v14"/>',
    splice: '<path d="M3 20h11m12 0h11M14 16l12 8m-12 0 12-8"/>',
    roseta: '<rect x="9" y="9" width="22" height="22" rx="3"/><circle cx="20" cy="20" r="5"/>',
    ont: '<rect x="5" y="11" width="30" height="18" rx="3"/><path d="M10 17h20M11 23h7m5 0h6"/>',
    point: '<path d="M4 20h32"/><circle cx="20" cy="20" r="6"/>'
  };
  const fmt = (n, digits = 2) => new Intl.NumberFormat("es-CL", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const uid = () => "e" + Math.random().toString(36).slice(2, 11);
  const fromMeters = meters => plan.unit === "km" ? meters / 1000 : plan.unit === "ft" ? meters / .3048 : meters;
  const toMeters = value => value * (plan.unit === "km" ? 1000 : plan.unit === "ft" ? .3048 : 1);
  const distance = meters => `${fmt(fromMeters(meters), plan.unit === "km" ? 3 : 1)} ${plan.unit}`;
  let plan = null;
  let selected = null;
  let picker = null;
  let layoutCache = null;
  let drag = null;
  let suppressNodeClick = false;

  function node(type) {
    const [connectors, splices, ratio] = DEFAULTS[type];
    return { id: uid(), type, label: TYPES[type], connectors, splices, ratio, extraLoss: 0, layout: {} };
  }
  function edge(from, to, lengthM) { return { id: uid(), from, to, lengthM, dbPerKm: plan.fiberLoss }; }
  function incoming(id) { return plan.edges.find(e => e.to === id); }
  function children(id) { return plan.edges.filter(e => e.from === id).map(e => e.to); }
  function byId(id) { return plan.nodes.find(n => n.id === id); }
  function descendants(id, found = new Set()) {
    for (const child of children(id)) if (!found.has(child)) { found.add(child); descendants(child, found); }
    return found;
  }
  function pathTo(id) {
    const nodes = [], edges = [], seen = new Set();
    let current = byId(id);
    while (current && !seen.has(current.id)) {
      seen.add(current.id); nodes.unshift(current);
      const link = incoming(current.id);
      if (!link || !byId(link.from)) break;
      edges.unshift(link); current = byId(link.from);
    }
    return nodes[0]?.type === "olt" ? { nodes, edges, lengthM: edges.reduce((sum, e) => sum + e.lengthM, 0) } : null;
  }
  function location(id) { return pathTo(id)?.lengthM ?? null; }
  function notify(message, kind = "success") { const box = $("planner-message"); box.textContent = message; box.dataset.kind = kind; }
  function showPlanner() {
    $("setup").hidden = true; $("planner").hidden = false;
    render(); $("planner").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function newPlan(opticalClass, unit) {
    plan = { format: "dgnv-optical-budget", version: 2, opticalClass, unit, fiberLoss: .35, connectorLoss: .5, spliceLoss: .1, reserve: 2, nodes: [node("olt")], edges: [] };
    selected = null;
    closePicker();
    $("return-design").hidden = true;
    showPlanner(); notify("Lienzo listo. Agrega un elemento y conéctalo desde la OLT.");
  }
  function icon(type) { return `<svg viewBox="0 0 40 40" aria-hidden="true">${ICONS[type]}</svg>`; }

  function layout(width) {
    const placed = new Map(), roots = plan.nodes.filter(n => !incoming(n.id));
    const depths = new Map(); let maxDepth = 0;
    function depth(id, value) { depths.set(id, value); maxDepth = Math.max(maxDepth, value); children(id).forEach(child => depth(child, value + 1)); }
    roots.forEach(root => depth(root.id, 0));
    const vertical = width < 720 || maxDepth > 5;
    if (vertical) {
      let row = 0;
      function walk(id) {
        const d = depths.get(id) || 0;
        const x = 18 + Math.min(d, 4) * (width < 500 ? 22 : 36);
        const w = Math.min(318, width - x - 18);
        placed.set(id, { x, y: 32 + row++ * 156, w, h: 98 });
        children(id).forEach(walk);
      }
      roots.forEach(root => walk(root.id));
      const height = Math.max(280, row * 156 + 24);
      for (const item of plan.nodes) {
        const p = placed.get(item.id), manual = item.layout?.mobile;
        if (p && manual) { p.x = manual.x * (width - p.w); p.y = manual.y * (height - p.h); }
      }
      return { placed, vertical, height, width, mode: "mobile" };
    }
    let row = 0;
    function yFor(id) {
      const kids = children(id);
      const cy = kids.length ? (kids.map(yFor).reduce((sum, v) => sum + v, 0) / kids.length) : 70 + row++ * 176;
      const d = depths.get(id) || 0;
      const w = Math.min(150, (width - 60) / (maxDepth + 1) * .64);
      const x = maxDepth ? 28 + d * (width - 56 - w) / maxDepth : (width - w) / 2;
      placed.set(id, { x, y: cy, w, h: 112 });
      return cy;
    }
    roots.forEach(root => yFor(root.id));
    const height = Math.max(310, row * 176 + 48);
    for (const item of plan.nodes) {
      const p = placed.get(item.id), manual = item.layout?.desktop;
      if (p && manual) { p.x = manual.x * (width - p.w); p.y = manual.y * (height - p.h); }
    }
    return { placed, vertical, height, width, mode: "desktop" };
  }

  function renderDiagram() {
    const canvas = $("canvas"), width = layout(canvas.clientWidth).width;
    const geometry = layout(width);
    layoutCache = geometry;
    const { placed, vertical, height } = geometry;
    canvas.style.height = `${height}px`;
    const svg = $("cables"); svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = plan.edges.map(link => {
      const a = placed.get(link.from), b = placed.get(link.to);
      if (!a || !b) return "";
      const x1 = vertical ? a.x + 28 : a.x + a.w, y1 = vertical ? a.y + a.h : a.y + a.h / 2;
      const x2 = vertical ? b.x + 28 : b.x, y2 = vertical ? b.y : b.y + b.h / 2;
      const curve = vertical ? `M${x1} ${y1} C${x1} ${y1 + 30},${x2} ${y2 - 30},${x2} ${y2}` : `M${x1} ${y1} C${(x1 + x2) / 2} ${y1},${(x1 + x2) / 2} ${y2},${x2} ${y2}`;
      return `<path class="ob-cable ${selected?.kind === "edge" && selected.id === link.id ? "is-selected" : ""}" d="${curve}" data-edge-id="${link.id}"/>`;
    }).join("");
    const cards = plan.nodes.map(item => {
      const p = placed.get(item.id); if (!p) return "";
      const loc = location(item.id);
      return `<div class="ob-node-wrap" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px"><button type="button" class="ob-node ${selected?.kind === "node" && selected.id === item.id ? "is-selected" : ""}" data-node-id="${item.id}" aria-label="${escape(item.label)}, seleccionar"><span class="ob-node-icon">${icon(item.type)}</span><span class="ob-node-info"><strong>${escape(item.label)}</strong><small>${item.ratio ? `1 × ${item.ratio} · ${fmt(SPLITTER_DB[item.ratio], 1)} dB` : loc === null ? "Sin ruta a OLT" : distance(loc)}</small></span></button><button type="button" class="ob-node-add" data-add-from-id="${item.id}" aria-label="Agregar elemento conectado a ${escape(item.label)}" title="Agregar desde aquí">+</button><button type="button" class="ob-node-remove" data-remove-id="${item.id}" aria-label="Quitar ${escape(item.label)}" title="Quitar elemento">×</button></div>`;
    }).join("");
    const labels = plan.edges.map(link => {
      const a = placed.get(link.from), b = placed.get(link.to); if (!a || !b) return "";
      const x = vertical ? Math.min(width - 108, Math.max(18, b.x + b.w - 103)) : (a.x + a.w + b.x) / 2 - 50;
      const y = vertical ? b.y - 30 : (a.y + a.h / 2 + b.y + b.h / 2) / 2 - 27;
      return `<button type="button" class="ob-cable-label ${selected?.kind === "edge" && selected.id === link.id ? "is-selected" : ""}" style="left:${x}px;top:${y}px" data-edge-id="${link.id}" aria-label="Editar cable de ${escape(byId(link.from)?.label || "origen")} a ${escape(byId(link.to)?.label || "destino")}"><strong>${distance(link.lengthM)}</strong><small>${fmt(link.lengthM / 1000 * link.dbPerKm)} dB</small></button><button type="button" class="ob-cable-add" style="left:${x + 94}px;top:${y + 10}px" data-add-on-edge="${link.id}" aria-label="Insertar elemento en este cable" title="Insertar en el cable">+</button>`;
    }).join("");
    $("diagram-items").innerHTML = cards + labels + (plan.nodes.length ? "" : '<div class="ob-empty">Lienzo vacío. Pulsa + para agregar un elemento.</div>');
    canvas.classList.toggle("is-empty", !plan.nodes.length);
  }

  function optionList(selectedId, excludeId = null) {
    const blocked = excludeId ? descendants(excludeId) : new Set();
    return `<option value="">Sin conexión</option>` + plan.nodes.filter(n => n.id !== excludeId && !blocked.has(n.id)).map(n => `<option value="${n.id}" ${n.id === selectedId ? "selected" : ""}>${escape(n.label)}${location(n.id) !== null ? ` · ${distance(location(n.id))}` : ""}</option>`).join("");
  }
  function ratioSelect(value) { return `<select data-node-field="ratio"><option value="none">Sin splitter</option>${Object.keys(SPLITTER_DB).map(n => `<option value="${n}" ${Number(value) === Number(n) ? "selected" : ""}>1 × ${n} · ${fmt(SPLITTER_DB[n], 1)} dB</option>`).join("")}</select>`; }
  function renderInspector() {
    const box = $("inspector-content");
    $("inspector-panel").hidden = !selected;
    if (!selected) { $("inspector-title").textContent = "Selecciona un elemento"; box.innerHTML = ""; return; }
    if (selected.kind === "edge") {
      const link = plan.edges.find(e => e.id === selected.id); if (!link) { selected = null; renderInspector(); return; }
      $("inspector-title").textContent = `Cable · ${byId(link.from)?.label} → ${byId(link.to)?.label}`;
      const start = location(link.from);
      box.innerHTML = `<div class="ob-field-grid"><label>Longitud del cable <span>${plan.unit}</span><input data-edge-field="lengthM" type="number" min="0.001" step="any" value="${fromMeters(link.lengthM)}" /></label><label>Atenuación <span>dB/km</span><input data-edge-field="dbPerKm" type="number" min="0" max="10" step="0.001" value="${link.dbPerKm}" /></label></div><p class="ob-inspector-note">${distance(link.lengthM)} × ${fmt(link.dbPerKm, 3)} dB/km = <strong>${fmt(link.lengthM / 1000 * link.dbPerKm)} dB</strong>. La longitud modifica también la posición acumulada de los elementos siguientes.</p><div class="ob-insert-area"><strong>Insertar en este cable</strong><div class="ob-field-grid"><label>Elemento<select id="insert-type">${Object.entries(TYPES).map(([type, name]) => `<option value="${type}" ${type === "mufa" ? "selected" : ""}>${name}</option>`).join("")}</select></label><label>${start === null ? "Distancia desde el origen" : "Posición desde la OLT"}<span>${plan.unit}</span><input id="insert-position" type="number" min="0.001" step="any" value="${fromMeters((start ?? 0) + link.lengthM / 2)}" /></label></div><div class="ob-insert-actions"><button type="button" class="ob-primary" id="insert-on-edge">+ Insertar elemento</button><button type="button" class="ob-secondary" id="divide-edge">+ Dividir tramo</button></div></div><button type="button" class="ob-secondary ob-danger" id="delete-edge">Quitar cable</button>`;
      return;
    }
    const item = byId(selected.id); if (!item) { selected = null; renderInspector(); return; }
    const link = incoming(item.id), loc = location(item.id);
    $("inspector-title").textContent = item.label;
    box.innerHTML = `<div class="ob-field-grid"><label class="is-wide">Nombre<input data-node-field="label" type="text" maxlength="48" value="${escape(item.label)}" /></label><label>Tipo<select data-node-field="type">${Object.entries(TYPES).map(([type, name]) => `<option value="${type}" ${item.type === type ? "selected" : ""}>${name}</option>`).join("")}</select></label><label>Conectar desde<select data-node-field="parent">${optionList(link?.from || "", item.id)}</select></label>${link && loc !== null ? `<label class="is-wide">Posición desde la OLT <span>${plan.unit}</span><input data-node-field="position" type="number" min="0.001" step="any" value="${fromMeters(loc)}" /></label>` : ""}<label>Pares de conectores <span>cantidad</span><input data-node-field="connectors" type="number" min="0" max="100" step="1" value="${item.connectors}" /></label><label>Empalmes <span>cantidad</span><input data-node-field="splices" type="number" min="0" max="100" step="1" value="${item.splices}" /></label><label class="is-wide">Pérdida adicional <span>dB</span><input data-node-field="extraLoss" type="number" min="0" max="100" step="0.01" value="${item.extraLoss}" /></label>${["node", "nap", "splitter"].includes(item.type) ? `<label class="is-wide">División óptica${ratioSelect(item.ratio)}</label>` : ""}</div><p class="ob-inspector-note">La carcasa de una NAP o mufa no añade dB por sí sola: cuenta los empalmes, conexiones y splitters que atraviesa este camino.</p><button type="button" class="ob-secondary ob-danger" id="delete-node">Quitar elemento</button>`;
  }

  function calculate(ont) {
    const path = pathTo(ont.id); if (!path) return null;
    const rows = []; let fiber = 0, components = 0;
    for (const link of path.edges) {
      const loss = link.lengthM / 1000 * link.dbPerKm; fiber += loss;
      rows.push([`Cable · ${byId(link.from).label} → ${byId(link.to).label}`, `${distance(link.lengthM)} × ${fmt(link.dbPerKm, 3)} dB/km`, loss]);
    }
    for (const item of path.nodes) {
      if (item.connectors) { const loss = item.connectors * plan.connectorLoss; components += loss; rows.push([`${item.label} · conectores`, `${item.connectors} × ${fmt(plan.connectorLoss)} dB`, loss]); }
      if (item.splices) { const loss = item.splices * plan.spliceLoss; components += loss; rows.push([`${item.label} · empalmes`, `${item.splices} × ${fmt(plan.spliceLoss)} dB`, loss]); }
      if (item.ratio) { const loss = SPLITTER_DB[item.ratio]; components += loss; rows.push([`${item.label} · 1 × ${item.ratio}`, "Pérdida máxima de la tabla", loss]); }
      if (item.extraLoss) { components += item.extraLoss; rows.push([`${item.label} · adicional`, "Valor indicado", item.extraLoss]); }
    }
    const physical = fiber + components, max = CLASSES[plan.opticalClass].max, min = CLASSES[plan.opticalClass].min;
    return { path, rows, fiber, components, physical, remaining: max - physical - plan.reserve, below: physical < min };
  }
  function renderResults() {
    const terminals = plan.nodes.filter(n => n.type === "ont"), connected = terminals.map(ont => ({ ont, result: calculate(ont) }));
    const done = connected.filter(item => item.result), loose = connected.length - done.length;
    if (!done.length) {
      const cableCount = plan.edges.length;
      $("results-content").innerHTML = `<div class="ob-result-empty"><strong>Aún no hay un camino OLT → ONT</strong><p>Agrega una ONT y conéctala para ver el presupuesto de esa rama. ${cableCount ? `Los ${cableCount} cable${cableCount === 1 ? "" : "s"} del lienzo ya muestran su longitud y pérdida individual.` : "El lienzo todavía no tiene cables."}</p></div>`;
      return;
    }
    $("results-content").innerHTML = done.map(({ ont, result }) => {
      const status = result.remaining < 0 ? "Supera el máximo" : result.below ? "Revisar pérdida mínima" : "Dentro del intervalo";
      const tone = result.remaining < 0 ? "bad" : result.below ? "warn" : "good";
      return `<article class="ob-result-card"><div class="ob-result-top"><div><small>CAMINO HASTA</small><h4>${escape(ont.label)}</h4></div><span class="ob-verdict is-${tone}">${status}</span></div><div class="ob-result-metrics"><div><small>Fibra</small><strong>${fmt(result.fiber)} dB</strong></div><div><small>Componentes</small><strong>${fmt(result.components)} dB</strong></div><div><small>Pérdida total</small><strong>${fmt(result.physical)} dB</strong></div><div><small>Margen restante</small><strong>${result.remaining >= 0 ? "+" : ""}${fmt(result.remaining)} dB</strong></div></div><p>${distance(result.path.lengthM)} de fibra · ${fmt(result.physical)} dB de pérdida + ${fmt(plan.reserve)} dB de reserva frente a ${CLASSES[plan.opticalClass].max} dB máximos.${result.below ? ` La pérdida física queda bajo el mínimo de ${CLASSES[plan.opticalClass].min} dB de esta clase; revisa el nivel de recepción y las fichas técnicas.` : ""}</p><details><summary>Ver cálculo de este camino</summary><div class="ob-table-wrap"><table><thead><tr><th>Elemento</th><th>Cálculo</th><th>Pérdida</th></tr></thead><tbody>${result.rows.map(([name, formula, loss]) => `<tr><td>${escape(name)}</td><td>${escape(formula)}</td><td>${fmt(loss)} dB</td></tr>`).join("")}</tbody></table></div></details></article>`;
    }).join("") + (loose ? `<p class="ob-loose">${loose} ONT sin camino conectado desde una OLT.</p>` : "");
  }

  function renderHeader() {
    $("class-readout").textContent = `${CLASSES[plan.opticalClass].system} ${plan.opticalClass}`;
    $("class-range").textContent = `${CLASSES[plan.opticalClass].min}–${CLASSES[plan.opticalClass].max} dB`;
    $("fiber-readout").textContent = `${fmt(plan.fiberLoss, 3)} dB/km`;
    $("unit-readout").textContent = plan.unit;
    $("setting-class").value = plan.opticalClass; $("setting-unit").value = plan.unit;
    $("setting-fiber").value = plan.fiberLoss; $("setting-connectors").value = plan.connectorLoss;
    $("setting-splices").value = plan.spliceLoss; $("setting-reserve").value = plan.reserve;
  }
  function render() { renderHeader(); renderDiagram(); renderInspector(); renderResults(); }

  function addFromPicker(type) {
    if (plan.nodes.length >= 100) throw new Error("El lienzo admite hasta 100 elementos.");
    if (!Object.hasOwn(TYPES, type) || !picker) throw new Error("Elige un elemento válido.");
    const context = picker;
    closePicker();
    if (context.mode === "edge") {
      const link = plan.edges.find(e => e.id === context.id);
      if (!link) throw new Error("Este cable ya no existe.");
      selected = { kind: "edge", id: link.id };
      insertInEdge(type, fromMeters((location(link.from) ?? 0) + link.lengthM / 2));
      return;
    }
    const item = node(type);
    let link = null;
    if (context.mode === "child") link = edge(context.id, item.id, 1000);
    plan.nodes.push(item); if (link) plan.edges.push(link);
    selected = { kind: "node", id: item.id };
    render(); notify(`${item.label} agregado${link ? ` con un cable inicial de ${distance(link.lengthM)}` : " sin conexión"}. Ajusta sus datos en el panel de edición.`);
  }
  function closePicker() { picker = null; $("add-popover").hidden = true; }
  function openPicker(mode, id, anchor) {
    if (mode === "child" && !byId(id)) return;
    if (mode === "edge" && !plan.edges.some(e => e.id === id)) return;
    picker = { mode, id };
    $("add-popover-title").textContent = mode === "root" ? "Elemento libre" : mode === "edge" ? "Insertar en este cable" : `Conectar desde ${byId(id).label}`;
    $("add-choices").innerHTML = Object.entries(TYPES).map(([type, name]) => `<button type="button" data-pick-type="${type}"><span>${icon(type)}</span><strong>${name}</strong></button>`).join("");
    const panel = $("add-popover"), canvas = $("canvas"), bounds = canvas.getBoundingClientRect();
    panel.hidden = false;
    const x = (anchor.clientX ?? anchor.right) - bounds.left + 12, y = (anchor.clientY ?? anchor.bottom) - bounds.top + 12;
    panel.style.left = `${Math.max(10, Math.min(bounds.width - panel.offsetWidth - 10, x))}px`;
    panel.style.top = `${Math.max(10, Math.min(bounds.height - panel.offsetHeight - 10, y))}px`;
    panel.querySelector("[data-pick-type]")?.focus({ preventScroll: true });
  }
  function moveNode(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.clientX, dy = event.clientY - drag.clientY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if(!drag.moved){
      freezePositions();
      const initial=worldPoint({clientX:drag.clientX,clientY:drag.clientY});
      drag.offsetX=initial.x-drag.x;drag.offsetY=initial.y-drag.y;
    }
    drag.moved = true; event.preventDefault?.();
    const item = byId(drag.id); if (!item) return;
    const pointer=worldPoint(event),x=pointer.x-drag.offsetX,y=pointer.y-drag.offsetY;
    item.position={x,y};
    extendWorld(x,y,drag.w,drag.h);
    dragPointer={clientX:event.clientX,clientY:event.clientY,pointerId:event.pointerId};
    renderDiagram();
    if(!dragFrame)dragFrame=requestAnimationFrame(autoPanNode);
  }
  function finishMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.moved) {
      suppressNodeClick = true;
      setTimeout(() => { suppressNodeClick = false; }, 0);
      notify("Posición visual actualizada y guardada en el diseño.");
    }
    drag = null;dragPointer=null;cancelAnimationFrame(dragFrame);dragFrame=0;
    remember();
  }
  function deleteNode(id) {
    const item = byId(id); if (!item) return;
    plan.nodes = plan.nodes.filter(n => n.id !== id);
    plan.edges.forEach(e => { if(e.from === id)e.from=null; if(e.to === id)e.to=null; });
    selected = null; render(); notify(`${item.label} quitado; se conservaron los cables que siguen conectados a otro elemento.`);
  }
  function changeNode(field, raw) {
    const item = byId(selected.id); if (!item) return;
    if (field === "label") { const value = raw.trim(); if (!value) throw new Error("El nombre no puede quedar vacío."); item.label = value.slice(0, 48); }
    else if (field === "type") { if (!Object.hasOwn(TYPES, raw)) throw new Error("Tipo no válido."); item.type = raw; item.label = TYPES[raw]; [item.connectors, item.splices, item.ratio] = DEFAULTS[raw]; item.extraLoss = 0; }
    else if (field === "parent") {
      if (raw === item.id || descendants(item.id).has(raw) || (raw && !byId(raw))) throw new Error("Esa conexión formaría un ciclo o no existe.");
      const old = incoming(item.id); if (old) plan.edges = plan.edges.filter(e => e.id !== old.id);
      if (raw) plan.edges.push(edge(raw, item.id, old?.lengthM || 1000));
    } else if (field === "ratio") { if (raw !== "none" && !Object.hasOwn(SPLITTER_DB, raw)) throw new Error("División no válida."); item.ratio = raw === "none" ? null : Number(raw); }
    else if (field === "position") {
      const link = incoming(item.id), origin = link ? location(link.from) : null, target = toMeters(Number(raw));
      if (!link || origin === null || !Number.isFinite(target) || target <= origin || target - origin > 500000) throw new Error("La posición debe quedar después del origen del cable.");
      link.lengthM = target - origin;
    } else {
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0 || value > 100 || (["connectors", "splices"].includes(field) && !Number.isInteger(value))) throw new Error("Revisa ese valor.");
      item[field] = value;
    }
    render(); notify("Elemento actualizado; se recalcularon los caminos.");
  }
  function changeEdge(field, raw) {
    const link = plan.edges.find(e => e.id === selected.id); if (!link) return;
    const value = Number(raw), converted = field === "lengthM" ? toMeters(value) : value;
    if (!Number.isFinite(converted) || converted < (field === "lengthM" ? .001 : 0) || converted > (field === "lengthM" ? 500000 : 10)) throw new Error("Revisa la longitud o la atenuación del cable.");
    link[field] = converted; render(); notify("Cable actualizado; se recalcularon los caminos.");
  }
  function insertInEdge(type, input) {
    const link = plan.edges.find(e => e.id === selected?.id); if (!link) return;
    if (plan.nodes.length >= 100) throw new Error("El lienzo admite hasta 100 elementos.");
    const start = location(link.from), offset = toMeters(Number(input)) - (start ?? 0);
    if (!Number.isFinite(offset) || offset <= 0 || offset >= link.lengthM) throw new Error("La posición debe estar dentro de este cable.");
    const item = node(type);
    plan.nodes.push(item);
    plan.edges = plan.edges.filter(e => e.id !== link.id);
    plan.edges.push({ ...edge(link.from, item.id, offset), dbPerKm: link.dbPerKm }, { ...edge(item.id, link.to, link.lengthM - offset), dbPerKm: link.dbPerKm });
    selected = { kind: "node", id: item.id };
    render(); notify(`${item.label} insertado en el cable; la longitud total se conserva.`);
  }

  function validateImport(raw) {
    if (raw?.format !== "dgnv-optical-budget") throw new Error("Este archivo no es un diseño compatible.");
    if (raw.version === 1) {
      const nodes = [...raw.nodes].sort((a, b) => a.positionM - b.positionM);
      const edges = nodes.slice(1).map((item, i) => ({ id: uid(), from: nodes[i].id, to: item.id, lengthM: item.positionM - nodes[i].positionM, dbPerKm: raw.segments?.[`${nodes[i].id}:${item.id}`] ?? raw.params.fiberLoss }));
      raw = { format: raw.format, version: 2, opticalClass: "B+", unit: "km", fiberLoss: raw.params.fiberLoss, connectorLoss: raw.params.connectorLoss, spliceLoss: raw.params.spliceLoss, reserve: raw.params.margin, nodes: nodes.map(({ positionM, ...item }) => item), edges };
    }
    if (raw.version !== 2 || !Object.hasOwn(CLASSES, raw.opticalClass) || !["km", "m", "ft"].includes(raw.unit) || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges) || raw.nodes.length > 100 || raw.edges.length > 100) throw new Error("La estructura del diseño no es válida.");
    for (const [key, max] of [["fiberLoss", 10], ["connectorLoss", 10], ["spliceLoss", 10], ["reserve", 20]]) if (!Number.isFinite(raw[key]) || raw[key] < 0 || raw[key] > max) throw new Error("Hay valores de pérdida no válidos.");
    const ids = new Set(), inbound = new Set();
    for (const n of raw.nodes) {
      if (!n || typeof n.id !== "string" || !/^[a-zA-Z0-9_-]{1,32}$/.test(n.id) || ids.has(n.id) || !Object.hasOwn(TYPES, n.type) || typeof n.label !== "string" || !n.label.trim() || n.label.length > 48 || !Number.isInteger(n.connectors) || n.connectors < 0 || n.connectors > 100 || !Number.isInteger(n.splices) || n.splices < 0 || n.splices > 100 || !Number.isFinite(n.extraLoss) || n.extraLoss < 0 || n.extraLoss > 100 || (n.ratio !== null && !Object.hasOwn(SPLITTER_DB, n.ratio))) throw new Error("Hay un elemento no válido.");
      if (n.layout !== undefined && (typeof n.layout !== "object" || n.layout === null || ["desktop", "mobile"].some(mode => n.layout[mode] !== undefined && (!Number.isFinite(n.layout[mode]?.x) || !Number.isFinite(n.layout[mode]?.y) || n.layout[mode].x < 0 || n.layout[mode].x > 1 || n.layout[mode].y < 0 || n.layout[mode].y > 1)))) throw new Error("Hay posiciones visuales no válidas en el archivo.");
      ids.add(n.id);
    }
    for (const e of raw.edges) {
      if (!e || typeof e.id !== "string" || !/^[a-zA-Z0-9_-]{1,32}$/.test(e.id) || ids.has(e.id) || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to || inbound.has(e.to) || !Number.isFinite(e.lengthM) || e.lengthM <= 0 || e.lengthM > 500000 || !Number.isFinite(e.dbPerKm) || e.dbPerKm < 0 || e.dbPerKm > 10) throw new Error("Hay un cable no válido.");
      ids.add(e.id); inbound.add(e.to);
    }
    const incomingMap = new Map(raw.edges.map(e => [e.to, e.from]));
    for (const n of raw.nodes) { const seen = new Set(); let current = n.id; while (incomingMap.has(current)) { if (seen.has(current)) throw new Error("El diseño contiene un ciclo."); seen.add(current); current = incomingMap.get(current); } }
    return { format: raw.format, version: 2, opticalClass: raw.opticalClass, unit: raw.unit, fiberLoss: raw.fiberLoss, connectorLoss: raw.connectorLoss, spliceLoss: raw.spliceLoss, reserve: raw.reserve, nodes: raw.nodes.map(n => ({ ...n, layout: { ...(n.layout?.desktop ? { desktop: { ...n.layout.desktop } } : {}), ...(n.layout?.mobile ? { mobile: { ...n.layout.mobile } } : {}) } })), edges: raw.edges.map(e => ({ ...e })) };
  }
  async function importFile(input) {
    const file = input.files?.[0]; input.value = ""; if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error("El archivo supera 1 MB.");
      plan = validateImport(JSON.parse(await file.text())); selected = null; closePicker(); $("return-design").hidden = true; showPlanner(); notify("Diseño cargado con sus posiciones, conexiones y valores de cálculo.");
    } catch (error) {
      const box = $("planner").hidden ? $("setup-message") : $("planner-message");
      box.hidden = false; box.textContent = error instanceof SyntaxError ? "No se pudo leer el archivo JSON." : error.message; box.dataset.kind = "error";
    }
  }
  function exportFile() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ ...plan, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "presupuesto-optico-dgnv.json"; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); notify("Diseño descargado para continuar después.");
  }

  // Optical editor: stored component losses, detachable endpoints and viewport tools.
  let zoom = 1, pan = {x: 0, y: 0}, snapshots = [], historyIndex = -1, restoring = false, clipboard = null;
  const allowedTypes = () => Object.entries(TYPES).filter(([t]) => !['splice','point'].includes(t));
  const lossForWave = nm => nm < 1300 ? .4 : nm < 1400 ? .35 : nm < 1530 ? .25 : .22;
  function normalize() {
    if (!plan) return;
    const gpon = CLASSES[plan.opticalClass].system === 'GPON';
    plan.lambdaUp ??= gpon ? 1310 : 1270; plan.lambdaDown ??= gpon ? 1490 : 1577;
    plan.alphaUp ??= lossForWave(plan.lambdaUp); plan.alphaDown ??= lossForWave(plan.lambdaDown);
    for (const n of plan.nodes) {
      if (n.type === 'splice') { n.type = 'mufa'; n.label = 'Mufa'; }
      if (n.type === 'point') { n.type = 'roseta'; n.label = 'Roseta'; }
      n.spliceLoss ??= n.splices * plan.spliceLoss;
      n.connectionLoss ??= n.connectors * plan.connectorLoss;
      n.splitters ??= []; n.txDbm ??= n.type === 'olt' ? 3 : 2;
    }
    for (const e of plan.edges) {
      e.ends ??= [{type:'SC/APC',loss:0},{type:'SC/APC',loss:0}];
      e.ends.forEach((c,i)=>{c.joint??='connector';c.side??='auto';if(['mufa','node'].includes(byId(e[i===0?'from':'to'])?.type)){c.joint='splice';c.loss=0;}});
      e.alphaUp ??= plan.alphaUp; e.alphaDown ??= plan.alphaDown; e.dbPerKm=e.alphaDown;
    }
  }
  function remember() {
    if (!plan || restoring) return;
    const s = JSON.stringify(plan);
    if (snapshots[historyIndex] === s) return;
    snapshots = snapshots.slice(0, historyIndex + 1); snapshots.push(s);
    if (snapshots.length > 80) snapshots.shift(); historyIndex = snapshots.length - 1;
  }
  const originalShowPlanner=showPlanner; showPlanner=function(){if(plan.view){zoom=plan.view.zoom??1;pan=plan.view.pan??{x:0,y:0};}originalShowPlanner();};
  const baseNode = node;
  node = type => { const n = baseNode(type); n.connectors=0; n.splices=0; n.spliceLoss=['mufa','roseta','odf','nap','node'].includes(type)?plan?.spliceLoss??.1:0; n.connectionLoss=0; n.splitters=[]; n.txDbm=type==='olt'?3:2; return n; };
  const baseEdge = edge;
  edge = (a,b,l) => ({...baseEdge(a,b,l),alphaUp:plan.alphaUp??.35,alphaDown:plan.alphaDown??.25,ends:[{type:'SC/APC',loss:plan.connectorLoss},{type:'SC/APC',loss:plan.connectorLoss}]});
  children = id => plan.edges.filter(e=>e.from===id && byId(e.to)).map(e=>e.to);
  incoming = id => plan.edges.find(e=>e.to===id && byId(e.from));
  layout = function(width) {
    const placed=new Map(), roots=plan.nodes.filter(n=>!incoming(n.id)); let row=0,maxDepth=0;
    function walk(id,d){const kids=children(id);maxDepth=Math.max(maxDepth,d);const ys=kids.map(k=>walk(k,d+1));const y=ys.length?ys.reduce((a,b)=>a+b,0)/ys.length:90+row++*190;placed.set(id,{x:65+d*310,y,w:150,h:112});return y;}
    roots.forEach(n=>walk(n.id,0));
    let worldWidth=Math.max(plan.worldWidth??0,1100,130+(maxDepth+1)*310),height=Math.max(plan.worldHeight??0,430,row*190+150);
    for(const n of plan.nodes){const p=placed.get(n.id),m=n.layout?.desktop;if(p&&n.position){p.x=n.position.x;p.y=n.position.y;}else if(p&&m){p.x=m.x*(worldWidth-p.w);p.y=m.y*(height-p.h);n.position={x:p.x,y:p.y};}if(p){worldWidth=Math.max(worldWidth,p.x+p.w+100);height=Math.max(height,p.y+p.h+100);}}
    for(const e of plan.edges)for(const key of ['looseFrom','looseTo'])if(e[key]){worldWidth=Math.max(worldWidth,e[key].x+100);height=Math.max(height,e[key].y+100);}
    plan.worldWidth=worldWidth;plan.worldHeight=height;
    return {placed,vertical:false,height,width:worldWidth,mode:'desktop'};
  };
  function freezePositions(){for(const n of plan.nodes){const p=layoutCache?.placed.get(n.id);if(p)n.position={x:p.x,y:p.y};}}
  function extendWorld(x,y,w=0,h=0){
    const sx=Math.max(0,100-x),sy=Math.max(0,100-y);
    if(sx||sy){
      for(const n of plan.nodes)if(n.position){n.position.x+=sx;n.position.y+=sy;}
      for(const e of plan.edges)for(const key of ['looseFrom','looseTo'])if(e[key]){e[key].x+=sx;e[key].y+=sy;}
      pan.x-=sx*zoom;pan.y-=sy*zoom;
    }
    plan.worldWidth=Math.max((plan.worldWidth??1100)+sx,x+sx+w+100);
    plan.worldHeight=Math.max((plan.worldHeight??430)+sy,y+sy+h+100);
    plan.view={zoom,pan:{...pan},manual:true};
  }
  let dragPointer=null,dragFrame=0;
  function autoPanNode(){
    dragFrame=0;if(!drag?.moved||!dragPointer)return;
    const r=$('canvas').getBoundingClientRect(),p=dragPointer;
    const speed=(value,min,max)=>value<min+34?-Math.min(10,(min+34-value)*.22):value>max-34?Math.min(10,(value-max+34)*.22):0;
    const vx=speed(p.clientX,r.left,r.right),vy=speed(p.clientY,r.top,r.bottom);
    if(vx||vy){pan.x-=vx;pan.y-=vy;moveNode(p);}
  }
  const supportsConnector=n=>n&&['olt','odf','nap','splitter','roseta','ont'].includes(n.type);
  const compatibleEnd=(c,n)=>c.joint==='splice'?['mufa','node','odf','nap','roseta','splitter'].includes(n?.type):supportsConnector(n);
  function endpointPosition(p,side,index){if(side==='top')return{x:p.x+p.w/2,y:p.y};if(side==='bottom')return{x:p.x+p.w/2,y:p.y+p.h};if(side==='left'||side==='auto'&&index===1)return{x:p.x,y:p.y+p.h/2};return{x:p.x+p.w,y:p.y+p.h/2};}
  const baseDiagram=renderDiagram;
  renderDiagram=function(){
    if(!plan)return; normalize();
    const canvas=$('canvas'), g=layout(canvas.clientWidth);
    baseDiagram();
    $('cables').setAttribute('viewBox',`0 0 ${g.width} ${g.height}`);
    const world=$('optical-world');world.style.width=g.width+'px';world.style.height=g.height+'px';
    $('cables').style.width=g.width+'px';$('cables').style.height=g.height+'px';
    $('diagram-items').style.width=g.width+'px';$('diagram-items').style.height=g.height+'px';
    canvas.style.height=(document.fullscreenElement?Math.max(450,innerHeight-155):560)+'px';
    if(!plan.view || !plan.view.manual){zoom=Math.min(1,canvas.clientWidth/g.width,canvas.clientHeight/g.height);pan={x:0,y:0};plan.view={zoom,pan};}
    world.style.transform=`translate(${pan.x}px,${pan.y}px) scale(${zoom})`;
    const extra=[]; $('cables').innerHTML='';
    for(const e of plan.edges){
      const a=g.placed.get(e.from),b=g.placed.get(e.to);
      const start=a?endpointPosition(a,e.ends[0].side,0):e.looseFrom??{x:(b?.x??200)-150,y:(b?.y??100)+56};
      const end=b?endpointPosition(b,e.ends[1].side,1):e.looseTo??{x:start.x+170,y:start.y};
      const vectors={left:{x:-1,y:0},right:{x:1,y:0},top:{x:0,y:-1},bottom:{x:0,y:1}};
      const v1=vectors[e.ends[0].side]??vectors.right,v2=vectors[e.ends[1].side]??vectors.left;
      const c1={x:start.x+v1.x*80,y:start.y+v1.y*80},c2={x:end.x+v2.x*80,y:end.y+v2.y*80};
      const mx=(start.x+3*c1.x+3*c2.x+end.x)/8,my=(start.y+3*c1.y+3*c2.y+end.y)/8;
      $('cables').insertAdjacentHTML('beforeend',`<path class="ob-cable" data-edge-id="${e.id}" d="M${start.x} ${start.y} C${c1.x} ${c1.y},${c2.x} ${c2.y},${end.x} ${end.y}"/>`);
      let label=document.querySelector(`.ob-cable-label[data-edge-id="${e.id}"]`);
      if(!label){extra.push(`<button class="ob-cable-label" style="left:${mx-50}px;top:${my-48}px" data-edge-id="${e.id}">${distance(e.lengthM)}</button>`);}else{label.style.left=(mx-50)+'px';label.style.top=(my-48)+'px';}
      const add=document.querySelector(`[data-add-on-edge="${e.id}"]`);if(add){add.style.left=(mx+44)+'px';add.style.top=(my-38)+'px';}
      [start,end].forEach((p,i)=>extra.push(`<button class="ob-endpoint ${e.ends[i].joint==='splice'?'is-splice':''}" style="left:${p.x-11}px;top:${p.y-9}px" data-end-edge="${e.id}" data-end-index="${i}" title="Arrastrar para desconectar o conectar" aria-label="${e.ends[i].joint==='splice'?'Unión por fusión':'Conector'} ${i+1}">${e.ends[i].joint==='splice'?'●':'▰'}</button>`));
    }
    $('diagram-items').insertAdjacentHTML('beforeend',extra.join(''));
    const emptyMessage=canvas.querySelector(':scope > .ob-empty');
    if(!plan.nodes.length){$('diagram-items').querySelector('.ob-empty')?.remove();if(!emptyMessage){const message=document.createElement('p');message.className='ob-empty';message.textContent='Lienzo vacío. Pulsa + para agregar un elemento.';canvas.append(message);}}else emptyMessage?.remove();
    $('zoom-readout').textContent=Math.round(zoom*100)+'%';if(selected)anchorEditor();
  };
  function anchorEditor(){
    const panel=$('inspector-panel');if(panel.hidden)return;
    const selector=selected?.kind==='node'?`[data-node-id="${selected.id}"]`:selected?.kind==='connector'?`[data-end-edge="${selected.id}"][data-end-index="${selected.index}"]`:`.ob-cable-label[data-edge-id="${selected?.id}"]`;
    const r=document.querySelector(selector)?.getBoundingClientRect();if(!r)return;
    const bounds=shell.getBoundingClientRect(),w=Math.min(340,shell.clientWidth-24);
    panel.style.width=w+'px';panel.style.maxHeight=Math.min(640,Math.max(260,$('canvas').clientHeight-24))+'px';
    const h=panel.offsetHeight,right=r.right-bounds.left+14,left=r.left-bounds.left-w-14;
    panel.style.left=Math.max(12,Math.min(shell.clientWidth-w-12,right+w<=shell.clientWidth-12?right:left))+'px';
    panel.style.top=Math.max(12,Math.min(shell.clientHeight-h-12,r.top-bounds.top))+'px';
    panel.style.right='auto';panel.style.bottom='auto';
  }
  const num=(key,title,value,unit='dB')=>`<label>${title}<span>${unit}</span><input data-opt-field="${key}" type="number" step="any" value="${value}" /></label>`;
  const splitOptions=v=>Object.keys(SPLITTER_DB).map(n=>`<option value="${n}" ${+v===+n?'selected':''}>1:${n} · ${SPLITTER_DB[n]} dB</option>`).join('');
  renderInspector=function(){
    const panel=$('inspector-panel');panel.hidden=!selected;if(!selected)return;normalize();let html='';
    if(selected.kind==='node'){
      const n=byId(selected.id);if(!n){selected=null;panel.hidden=true;return;}
      $('inspector-title').textContent=n.label;
      html=`<label>Nombre<input type="text" data-opt-field="label" value="${escape(n.label)}" maxlength="48" /></label>`;
      if(['mufa','roseta','odf','nap','node'].includes(n.type))html+=num('spliceLoss','Pérdida de empalmes de este elemento',n.spliceLoss);
      html+=num('connectionLoss','Otras conexiones internas',n.connectionLoss)+num('extraLoss','Pérdida adicional',n.extraLoss);
      if(n.type==='olt')html+=num('txDbm','Potencia TX downstream',n.txDbm,'dBm');
      if(n.type==='ont')html+=num('txDbm','Potencia TX upstream',n.txDbm,'dBm');
      if(['nap','node','splitter'].includes(n.type))html+=`<label>Splitter<select data-opt-field="ratio"><option value="0">Sin splitter</option>${splitOptions(n.ratio)}</select></label>`;
      if(n.type==='odf')html+=`<div><strong>Splitters dentro del ODF</strong>${n.splitters.map(s=>`<div class="ob-split-row"><select data-split-id="${s.id}">${splitOptions(s.ratio)}</select><button data-remove-split="${s.id}">×</button></div>`).join('')}<button class="ob-secondary" id="add-internal-split">+ Agregar splitter</button><p>En cada cable saliente elige cuál de estos splitters atraviesa esa rama.</p></div>`;
      html+='<p>Arrastra la tarjeta para mover el dibujo. Las distancias se editan en los cables.</p>';
    }else{
      const e=plan.edges.find(e=>e.id===selected.id);if(!e)return;
      if(selected.kind==='connector'){
        const i=selected.index,c=e.ends[i];$('inspector-title').textContent=`${c.joint==='splice'?'Unión por fusión':'Conector'} · extremo ${i+1}`;
        html=`<label>Tipo de unión<select data-opt-field="connectorType"><option value="SC/APC" ${c.joint!=='splice'&&c.type==='SC/APC'?'selected':''}>SC/APC</option><option value="SC/UPC" ${c.joint!=='splice'&&c.type==='SC/UPC'?'selected':''}>SC/UPC</option><option value="fusion" ${c.joint==='splice'?'selected':''}>Empalme por fusión</option></select></label>${c.joint==='splice'?'<p>La pérdida de fusión se configura en el elemento al que está unida; no se suma de nuevo en este extremo.</p>':num('connectorLoss','Pérdida de este conector',c.loss)}<label>Conectado a<select data-opt-field="endpoint"><option value="">Desconectado</option>${plan.nodes.filter(n=>compatibleEnd(c,n)).map(n=>`<option value="${n.id}" ${e[i===0?'from':'to']===n.id?'selected':''}>${escape(n.label)}</option>`).join('')}</select></label><label>Cara de conexión<select data-opt-field="endpointSide">${[['auto','Automática'],['left','Izquierda'],['right','Derecha'],['top','Superior'],['bottom','Inferior']].map(([v,t])=>`<option value="${v}" ${c.side===v?'selected':''}>${t}</option>`).join('')}</select></label><p>Arrastra el extremo para dejarlo suelto o soltarlo sobre una cara de un equipo compatible. El cable conserva sus datos.</p>`;
      }else{
        $('inspector-title').textContent='Tramo de fibra';html=num('lengthM','Longitud',fromMeters(e.lengthM),plan.unit)+num('alphaUp','Atenuación upstream',e.alphaUp,'dB/km')+num('alphaDown','Atenuación downstream',e.alphaDown,'dB/km');
        const odf=byId(e.from);if(odf?.type==='odf')html+=`<label>Splitter de salida del ODF<select data-opt-field="splitterId"><option value="">Sin splitter</option>${odf.splitters.map(s=>`<option value="${s.id}" ${e.splitterId===s.id?'selected':''}>1:${s.ratio} · ${s.id.slice(-4)}</option>`).join('')}</select></label>`;
      }
    }
    $('inspector-content').innerHTML=`<div class="ob-field-grid">${html}</div>`;anchorEditor();
  };
  calculate=function(ont){const path=pathTo(ont.id);if(!path||path.edges.some(e=>!e.from||!e.to))return null;let fiber=0,upFiber=0,components=0;const rows=[];
    for(const e of path.edges){const down=e.lengthM/1000*e.alphaDown;fiber+=down;upFiber+=e.lengthM/1000*e.alphaUp;const cl=e.ends.reduce((a,c)=>a+c.loss,0);components+=cl;rows.push(['Fibra y conectores',distance(e.lengthM),down+cl]);const s=byId(e.from)?.splitters?.find(s=>s.id===e.splitterId);if(s){components+=SPLITTER_DB[s.ratio];rows.push(['Splitter ODF',`1:${s.ratio}`,SPLITTER_DB[s.ratio]]);}}
    for(const n of path.nodes){const l=n.spliceLoss+n.connectionLoss+n.extraLoss+(n.ratio?SPLITTER_DB[n.ratio]:0);components+=l;rows.push([n.label,'Pérdidas individuales',l]);}
    const physical=fiber+components;return {path,rows,fiber,components,physical,remaining:CLASSES[plan.opticalClass].max-physical-plan.reserve,below:physical<CLASSES[plan.opticalClass].min,rxDown:path.nodes[0].txDbm-physical,rxUp:ont.txDbm-upFiber-components};};
  const baseResults=renderResults;
  renderResults=function(){normalize();baseResults();const results=plan.nodes.filter(n=>n.type==='ont').map(n=>calculate(n)).filter(Boolean);document.querySelectorAll('.ob-result-card').forEach((card,i)=>{const r=results[i];if(r)card.querySelector('.ob-result-metrics').insertAdjacentHTML('beforeend',`<div><small>RX en ONT · downstream</small><strong>${fmt(r.rxDown)} dBm</strong></div><div><small>RX en OLT · upstream</small><strong>${fmt(r.rxUp)} dBm</strong></div>`);});};
  const baseRender=render;
  function removeUnattachedCables(){
    const removed=plan.edges.filter(e=>!byId(e.from)&&!byId(e.to));
    if(!removed.length)return;
    const ids=new Set(removed.map(e=>e.id));
    plan.edges=plan.edges.filter(e=>!ids.has(e.id));
    if(selected&&selected.kind!=='node'&&ids.has(selected.id))selected=null;
    notify('Cable eliminado: sus dos extremos quedaron desconectados.');
  }
  render=function(){removeUnattachedCables();normalize();baseRender();remember();};
  const baseImport=validateImport;
  validateImport=function(raw){
    for(const n of raw.nodes??[]){if(n.position&&(!Number.isFinite(n.position.x)||!Number.isFinite(n.position.y)||n.position.x<0||n.position.y<0))throw Error('Posicion de elemento invalida');for(const k of ['spliceLoss','connectionLoss','txDbm'])if(n[k]!==undefined&&(!Number.isFinite(n[k])||n[k]<(k==='txDbm'?-30:0)||n[k]>100))throw Error('Perdida o potencia individual invalida');if(n.splitters!==undefined&&(!Array.isArray(n.splitters)||n.splitters.length>128||n.splitters.some(x=>typeof x.id!=='string'||!/^[a-zA-Z0-9_-]{1,32}$/.test(x.id)||!Object.hasOwn(SPLITTER_DB,x.ratio))))throw Error('Lista de splitters invalida');}
    for(const e of raw.edges??[]){for(const k of ['looseFrom','looseTo'])if(e[k]&&(!Number.isFinite(e[k].x)||!Number.isFinite(e[k].y)))throw Error('Posicion de extremo invalida');if(e.ends!==undefined&&(!Array.isArray(e.ends)||e.ends.length!==2||e.ends.some(c=>(c.side!==undefined&&!['auto','left','right','top','bottom'].includes(c.side))||(c.joint!==undefined&&!['connector','splice'].includes(c.joint))||!['SC/APC','SC/UPC'].includes(c.type)||!Number.isFinite(c.loss)||c.loss<0||c.loss>100)))throw Error('Conector invalido');for(const k of ['alphaUp','alphaDown'])if(e[k]!==undefined&&(!Number.isFinite(e[k])||e[k]<0||e[k]>10))throw Error('Atenuacion invalida');}
    if(raw.view&&(!Number.isFinite(raw.view.zoom)||raw.view.zoom<.001||raw.view.zoom>3||!Number.isFinite(raw.view.pan?.x)||!Number.isFinite(raw.view.pan?.y)))throw Error('Vista invalida');
const loose=[];if(raw.version===2){for(const e of raw.edges??[])if(!e.from||!e.to)loose.push(e);raw={...raw,edges:raw.edges.filter(e=>e.from&&e.to)};}const p=baseImport(raw);for(const e of loose){if(!Number.isFinite(e.lengthM)||e.lengthM<=0||!Array.isArray(e.ends)||e.ends.length!==2)throw Error('Cable desconectado inválido');p.edges.push(e);}for(const k of ['lambdaUp','lambdaDown','alphaUp','alphaDown'])if(raw[k]!==undefined){if(!Number.isFinite(raw[k])||raw[k]<0)throw Error('Parámetro óptico inválido');p[k]=raw[k];}p.view=raw.view;if(Number.isFinite(raw.worldWidth))p.worldWidth=raw.worldWidth;if(Number.isFinite(raw.worldHeight))p.worldHeight=raw.worldHeight;return p;};
  function viewport(){if(!plan)return;$('optical-world').style.transform=`translate(${pan.x}px,${pan.y}px) scale(${zoom})`;plan.view={zoom,pan:{...pan},manual:true};$('zoom-readout').textContent=Math.round(zoom*100)+'%';if(selected)anchorEditor();}
  const shell=document.querySelector('.ob-diagram-shell'),canvas=$('canvas');
  const world=document.createElement('div');world.id='optical-world';world.append($('cables'),$('diagram-items'));canvas.prepend(world);
  const toolButton=(action,label,path,iconOnly=false)=>`<button type="button" data-tool="${action}" title="${label}" aria-label="${label}" ${iconOnly?'class="ob-tool-icon"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>${iconOnly?'':label}</button>`;
  const tools=document.createElement('div');tools.className='ob-map-tools';tools.setAttribute('aria-label','Controles del mapa');
  tools.innerHTML=`<div class="ob-tool-group" role="group" aria-label="Historial">${toolButton('undo','Deshacer','<path d="M9 5 4 10l5 5M4 10h10a6 6 0 0 1 0 12"/>')}${toolButton('redo','Rehacer','<path d="m15 5 5 5-5 5m5-5H10a6 6 0 0 0 0 12"/>')}</div><div class="ob-tool-group ob-tool-zoom" role="group" aria-label="Escala del mapa">${toolButton('out','Alejar','<path d="M5 12h14"/>',true)}<output id="zoom-readout" aria-label="Zoom actual">100%</output>${toolButton('in','Acercar','<path d="M5 12h14M12 5v14"/>',true)}${toolButton('fit','Ajustar','<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>')}</div><div class="ob-tool-group" role="group" aria-label="Portapapeles">${toolButton('copy','Copiar','<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>')}${toolButton('paste','Pegar','<path d="M9 5H5v16h14V5h-4"/><rect x="9" y="3" width="6" height="5" rx="1"/>')}</div><div class="ob-tool-group ob-tool-screen">${toolButton('full','Pantalla completa','<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>')}</div>`;
  shell.prepend(tools);
  shell.append($('inspector-panel'));
  tools.addEventListener('click',async e=>{const t=e.target.closest('button[data-tool]')?.dataset.tool;if(!t||!plan)return;
    if(t==='undo'||t==='redo'){const next=historyIndex+(t==='undo'?-1:1);if(next<0||next>=snapshots.length)return;historyIndex=next;restoring=true;plan=JSON.parse(snapshots[next]);selected=null;render();restoring=false;}
    if(t==='in'||t==='out'){zoom=Math.max(.15,Math.min(3,zoom*(t==='in'?1.15:1/1.15)));viewport();}
    if(t==='fit'){zoom=Math.min(1,canvas.clientWidth/layoutCache.width,canvas.clientHeight/layoutCache.height);pan={x:0,y:0};viewport();}
    if(t==='copy'&&selected){const e=plan.edges.find(e=>e.id===selected.id);const data=selected.kind==='node'?byId(selected.id):selected.kind==='connector'?e?.ends[selected.index]:e;if(data)clipboard={kind:selected.kind,data:JSON.parse(JSON.stringify(data))};}
    if(t==='paste'&&clipboard){const n=JSON.parse(JSON.stringify(clipboard.data));if(clipboard.kind==='node'){n.id=uid();n.label+=' copia';n.layout={};if(n.position)n.position={x:n.position.x+45,y:n.position.y+45};plan.nodes.push(n);selected={kind:'node',id:n.id};}else if(clipboard.kind==='edge'){if(selected?.kind!=='node'){notify('Selecciona un elemento para pegar el cable conectado a él.');return;}n.id=uid();n.from=selected.id;n.to=null;n.splitterId='';n.looseFrom={x:150,y:300};n.looseTo={x:400,y:300};plan.edges.push(n);selected={kind:'edge',id:n.id};}else if(selected?.kind==='connector'){plan.edges.find(e=>e.id===selected.id).ends[selected.index]=n;}render();}
    if(t==='full'){if(document.fullscreenElement)await document.exitFullscreen();else await shell.requestFullscreen();}
  });
  canvas.addEventListener('wheel',e=>{
    if(!plan||$('planner').hidden||!e.ctrlKey||e.altKey||e.metaKey||e.target.closest('#inspector-panel,#add-popover'))return;
    e.preventDefault();
    const bounds=canvas.getBoundingClientRect(),x=e.clientX-bounds.left,y=e.clientY-bounds.top;
    const z=Math.max(.15,Math.min(3,zoom*Math.exp(-e.deltaY*.0015)));
    pan={x:x-(x-pan.x)*z/zoom,y:y-(y-pan.y)*z/zoom};zoom=z;viewport();
  },{passive:false});
  let panning=null;
  canvas.addEventListener('pointerdown',e=>{if(e.button!==1||!plan)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';panning={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};});
  canvas.addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault();});
  function stopPanning(){if(!panning)return;panning=null;canvas.style.cursor='';remember();}
  window.addEventListener('pointermove',e=>{if(panning){if(!(e.buttons&4)){stopPanning();return;}pan={x:panning.px+e.clientX-panning.x,y:panning.py+e.clientY-panning.y};viewport();}});
  window.addEventListener('pointerup',stopPanning);
  window.addEventListener('pointercancel',stopPanning);
  window.addEventListener('blur',stopPanning);
  let endpointDrag=null;
  $('diagram-items').addEventListener('pointerdown',e=>{
    const b=e.target.closest('[data-end-edge]');if(!b||e.button!==0)return;
    endpointDrag={id:b.dataset.endEdge,index:+b.dataset.endIndex,pointerId:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
  });
  function worldPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left-pan.x)/zoom,y:(e.clientY-r.top-pan.y)/zoom};}
  window.addEventListener('pointermove',e=>{
    const d=endpointDrag;if(!d||e.pointerId!==d.pointerId)return;
    if(!d.moved&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<5)return;
    e.preventDefault();const link=plan.edges.find(l=>l.id===d.id);if(!link)return;
    if(!d.moved)freezePositions();
    d.moved=true;link[d.index===0?'from':'to']=null;
    const loose=worldPoint(e);link[d.index===0?'looseFrom':'looseTo']=loose;extendWorld(loose.x,loose.y);selected=null;renderInspector();renderDiagram();
    document.querySelectorAll('.ob-node').forEach(b=>b.classList.toggle('is-compatible',compatibleEnd(link.ends[d.index],byId(b.dataset.nodeId))));
  },{passive:false});
  window.addEventListener('pointerup',e=>{
    const d=endpointDrag;if(!d||e.pointerId!==d.pointerId)return;endpointDrag=null;if(!d.moved)return;
    suppressNodeClick=true;setTimeout(()=>{suppressNodeClick=false;},0);
    const link=plan.edges.find(l=>l.id===d.id);if(!link)return;
    const p=worldPoint(e),target=[...layoutCache.placed].find(([,r])=>p.x>=r.x-15&&p.x<=r.x+r.w+15&&p.y>=r.y-15&&p.y<=r.y+r.h+15);
    let message='Extremo suelto. Puedes volver a arrastrarlo a un equipo compatible.';
    if(target){const [id,r]=target;if(compatibleEnd(link.ends[d.index],byId(id))){
      const key=d.index===0?'from':'to';link[key]=id;
      const invalid=link.from===link.to||(link.to&&plan.edges.some(l=>l.id!==link.id&&l.to===link.to))||(link.to&&descendants(link.to).has(link.from));
      if(invalid){link[key]=null;message='Conexión no válida: entrada ocupada o bucle.';}
      else{const sides=[['left',Math.abs(p.x-r.x)],['right',Math.abs(p.x-r.x-r.w)],['top',Math.abs(p.y-r.y)],['bottom',Math.abs(p.y-r.y-r.h)]];sides.sort((a,b)=>a[1]-b[1]);link.ends[d.index].side=sides[0][0];message='Extremo conectado a '+byId(id).label+'.';}
    }else message='Este equipo no admite este tipo de extremo; queda suelto.';}
    render();notify(plan.edges.some(e=>e.id===link.id)?message:'Cable eliminado: sus dos extremos quedaron desconectados.');
  });
  window.addEventListener('pointercancel',()=>{const moved=endpointDrag?.moved;endpointDrag=null;if(moved)render();});
  document.addEventListener('fullscreenchange',()=>{renderDiagram();anchorEditor();});
  document.addEventListener('pointerdown',e=>{if(!selected||e.target.closest('#inspector-panel,.ob-node,.ob-cable-label,.ob-endpoint,.ob-add-choices,.ob-node-add,.ob-cable-add,.ob-map-tools'))return;selected=null;renderInspector();});
  $('diagram-items').addEventListener('click',e=>{if(suppressNodeClick)return;const b=e.target.closest('[data-end-edge]');if(b){selected={kind:'connector',id:b.dataset.endEdge,index:+b.dataset.endIndex};renderInspector();}});
  $('inspector-content').addEventListener('change',e=>{
    const f=e.target.dataset.optField,sid=e.target.dataset.splitId;if(!f&&!sid)return;try{
      const n=selected.kind==='node'?byId(selected.id):null,link=plan.edges.find(x=>x.id===selected.id),v=e.target.value;
      if(sid){n.splitters.find(s=>s.id===sid).ratio=+v;}
      else if(f==='label')n.label=v.slice(0,48);
      else if(f==='connectorType'){
        if(!['SC/APC','SC/UPC','fusion'].includes(v))throw Error('Tipo de union no valido');
        const c=link.ends[selected.index],key=selected.index===0?'from':'to',attached=byId(link[key]);
        if(v==='fusion'){if(c.joint!=='splice')c.savedConnectorLoss=c.loss;c.joint='splice';c.loss=0;}
        else{if(c.joint==='splice')c.loss=c.savedConnectorLoss??plan.connectorLoss;c.joint='connector';c.type=v;}
        if(attached&&!compatibleEnd(c,attached)){
          const p=layoutCache.placed.get(attached.id);if(p)link[selected.index===0?'looseFrom':'looseTo']=endpointPosition(p,c.side,selected.index);
          link[key]=null;notify('El extremo queda suelto porque el nuevo tipo de unión no es compatible con ese equipo.');
        }
      }
      else if(f==='endpointSide')link.ends[selected.index].side=v;
      else if(f==='endpoint'){
        if(v&&!compatibleEnd(link.ends[selected.index],byId(v)))throw Error('Elemento incompatible con este extremo');
        const k=selected.index===0?'from':'to',old=link[k];link[k]=v||null;
        if(v&&(link.from===link.to||plan.edges.some(x=>x.id!==link.id&&x.to===link.to&&link.to)||descendants(link.to).has(link.from))){link[k]=old;throw Error('Esta conexión forma un ciclo o la entrada ya está ocupada');}
      }else if(f==='splitterId')link.splitterId=v;
      else{const value=+v;if(!Number.isFinite(value)||value< (f==='txDbm'?-30:0)||value>500000)throw Error('Valor no válido');if(f==='connectorLoss')link.ends[selected.index].loss=value;else if(n)n[f]=f==='ratio'?(value||null):value;else {link[f]=f==='lengthM'?toMeters(value):value;if(f==='alphaUp'||f==='alphaDown')link[f+'Manual']=true;}}
      render();
    }catch(err){notify(err.message,'error');renderInspector();}
  });
  $('inspector-content').addEventListener('click',e=>{const n=byId(selected?.id);if(e.target.id==='add-internal-split'&&n){n.splitters.push({id:uid(),ratio:8});render();}if(e.target.dataset.removeSplit&&n){const id=e.target.dataset.removeSplit;n.splitters=n.splitters.filter(s=>s.id!==id);plan.edges.forEach(l=>{if(l.splitterId===id)l.splitterId='';});render();}});
  const extraSettings=document.createElement('div');extraSettings.className='ob-settings-grid';extraSettings.innerHTML=[['lambdaUp','λ · Upstream','nm'],['lambdaDown','λ · Downstream','nm'],['alphaUp','Fibra upstream','dB/km'],['alphaDown','Fibra downstream','dB/km']].map(([k,l,u])=>`<label>${l}<span>${u}</span><input type="number" data-global-opt="${k}" step="any" /></label>`).join('');document.querySelector('.ob-settings').append(extraSettings);
  extraSettings.addEventListener('change',e=>{const k=e.target.dataset.globalOpt,v=+e.target.value;if(!k||!Number.isFinite(v)||v<=0)return;plan[k]=v;if(k==='lambdaUp')plan.alphaUp=lossForWave(v);if(k==='lambdaDown')plan.alphaDown=lossForWave(v);for(const e of plan.edges){if(!e.alphaUpManual)e.alphaUp=plan.alphaUp;if(!e.alphaDownManual)e.alphaDown=plan.alphaDown;}render();});
  $('setting-fiber').closest('label').hidden=true;const baseHeader=renderHeader;renderHeader=function(){baseHeader();$('fiber-readout').textContent=fmt(plan.alphaUp,3)+' / '+fmt(plan.alphaDown,3)+' dB/km';document.querySelectorAll('[data-global-opt]').forEach(i=>i.value=plan[i.dataset.globalOpt]);};
  const basePicker=openPicker;openPicker=function(mode,id,anchor){basePicker(mode,id,anchor);$('add-choices').querySelectorAll('[data-pick-type="splice"],[data-pick-type="point"]').forEach(b=>b.remove());};

  $("setup-form").addEventListener("submit", event => { event.preventDefault(); const data = new FormData(event.currentTarget); newPlan(String(data.get("opticalClass")), String(data.get("unit"))); });
  $("canvas-add").addEventListener("click", event => openPicker("root", null, event.currentTarget.getBoundingClientRect()));
  $("close-popover").addEventListener("click", closePicker);
  $("add-choices").addEventListener("click", event => { const choice = event.target.closest("[data-pick-type]"); if (!choice) return; try { addFromPicker(choice.dataset.pickType); } catch (error) { notify(error.message, "error"); } });
  $("close-inspector").addEventListener("click", () => { selected = null; renderDiagram(); renderInspector(); });
  $("new-design").addEventListener("click", () => { $("planner").hidden = true; $("setup").hidden = false; $("return-design").hidden = false; $("setup").scrollIntoView({ behavior: "smooth" }); });
  $("return-design").addEventListener("click", showPlanner);
  $("export-design").addEventListener("click", exportFile);
  $("import-setup").addEventListener("change", event => importFile(event.target));
  $("import-planner").addEventListener("change", event => importFile(event.target));
  $("diagram-items").addEventListener("click", event => {
    if (suppressNodeClick) return;
    const remove = event.target.closest("[data-remove-id]"); if (remove) { deleteNode(remove.dataset.removeId); return; }
    const addFrom = event.target.closest("[data-add-from-id]"); if (addFrom) { openPicker("child", addFrom.dataset.addFromId, addFrom.getBoundingClientRect()); return; }
    const addOn = event.target.closest("[data-add-on-edge]"); if (addOn) { openPicker("edge", addOn.dataset.addOnEdge, addOn.getBoundingClientRect()); return; }
    const item = event.target.closest("[data-node-id]"), cable = event.target.closest("[data-edge-id]");
    if (item) selected = { kind: "node", id: item.dataset.nodeId };
    else if (cable) selected = { kind: "edge", id: cable.dataset.edgeId };
    else return;
    render();
  });
  $("diagram-items").addEventListener("pointerdown", event => {
    const target = event.target.closest(".ob-node[data-node-id]");
    if (!target || event.button !== 0 || !layoutCache) return;
    const p = layoutCache.placed.get(target.dataset.nodeId); if (!p) return;
    drag = { id: target.dataset.nodeId, pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, x: p.x, y: p.y, w: p.w, h: p.h, width: layoutCache.width, height: layoutCache.height, mode: layoutCache.mode, moved: false };
  });
  window.addEventListener("pointermove", moveNode, { passive: false });
  window.addEventListener("pointerup", finishMove);
  window.addEventListener("pointercancel", finishMove);
  window.addEventListener("blur", () => { if(drag)finishMove({pointerId:drag.pointerId}); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") { if (picker) closePicker(); else if (selected) { selected = null; renderDiagram(); renderInspector(); } } });
  $("cables").addEventListener("click", event => { const link = event.target.closest("[data-edge-id]"); if (link) { selected = { kind: "edge", id: link.dataset.edgeId }; render(); } });
  $("inspector-content").addEventListener("change", event => {
    const nodeField = event.target.dataset.nodeField, edgeField = event.target.dataset.edgeField;
    try { if (nodeField) changeNode(nodeField, event.target.value); else if (edgeField) changeEdge(edgeField, event.target.value); }
    catch (error) { notify(error.message, "error"); renderInspector(); }
  });
  $("inspector-content").addEventListener("click", event => {
    if (event.target.id === "delete-node" && selected?.kind === "node") deleteNode(selected.id);
    if (event.target.id === "delete-edge" && selected?.kind === "edge") { plan.edges = plan.edges.filter(e => e.id !== selected.id); selected = null; render(); notify("Cable quitado; los equipos permanecen en el lienzo."); }
    if (["insert-on-edge", "divide-edge"].includes(event.target.id) && selected?.kind === "edge") {
      try { insertInEdge(event.target.id === "divide-edge" ? "point" : $("insert-type").value, $("insert-position").value); }
      catch (error) { notify(error.message, "error"); }
    }
  });
  const settings = { "setting-class": ["opticalClass"], "setting-unit": ["unit"], "setting-fiber": ["fiberLoss", 10], "setting-connectors": ["connectorLoss", 10], "setting-splices": ["spliceLoss", 10], "setting-reserve": ["reserve", 20] };
  for (const [inputId, [field, max]] of Object.entries(settings)) $(inputId).addEventListener("change", event => {
    const value = max ? Number(event.target.value) : event.target.value;
    if (max && (!Number.isFinite(value) || value < 0 || value > max)) { notify("Revisa ese valor.", "error"); renderHeader(); return; }
    plan[field] = value;
    if(field==='opticalClass'){const g=CLASSES[value].system==='GPON';plan.lambdaUp=g?1310:1270;plan.lambdaDown=g?1490:1577;plan.alphaUp=lossForWave(plan.lambdaUp);plan.alphaDown=lossForWave(plan.lambdaDown);for(const e of plan.edges){if(!e.alphaUpManual)e.alphaUp=plan.alphaUp;if(!e.alphaDownManual)e.alphaDown=plan.alphaDown;}}
    render(); notify("Valores de cálculo actualizados.");
  });
  new ResizeObserver(() => { if (plan && !$("planner").hidden) renderDiagram(); }).observe($("canvas"));
})();
