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
      if (!link) break;
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
    const canvas = $("canvas"), width = Math.max(300, canvas.clientWidth);
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
    drag.moved = true; event.preventDefault();
    const item = byId(drag.id); if (!item) return;
    const x = Math.max(0, Math.min(drag.width - drag.w, drag.x + dx));
    const y = Math.max(0, Math.min(drag.height - drag.h, drag.y + dy));
    item.layout ||= {};
    item.layout[drag.mode] = { x: Number((x / Math.max(1, drag.width - drag.w)).toFixed(5)), y: Number((y / Math.max(1, drag.height - drag.h)).toFixed(5)) };
    renderDiagram();
  }
  function finishMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.moved) {
      suppressNodeClick = true;
      setTimeout(() => { suppressNodeClick = false; }, 0);
      notify("Posición visual actualizada y guardada en el diseño.");
    }
    drag = null;
  }
  function deleteNode(id) {
    const item = byId(id); if (!item) return;
    plan.nodes = plan.nodes.filter(n => n.id !== id);
    plan.edges = plan.edges.filter(e => e.from !== id && e.to !== id);
    selected = null; render(); notify(`${item.label} quitado. Sus ramas quedan disponibles para volver a conectarlas.`);
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
    render(); notify("Valores de cálculo actualizados.");
  });
  new ResizeObserver(() => { if (plan && !$("planner").hidden) renderDiagram(); }).observe($("canvas"));
})();
