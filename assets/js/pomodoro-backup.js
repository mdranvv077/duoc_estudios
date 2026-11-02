(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const dialog = $('#backup-dialog');
  if (!dialog) return;
  const message = text => { $('#backup-status').textContent = text; };
  const invalid = () => { throw new Error('El archivo no tiene un formato de respaldo válido. Tus datos actuales siguen intactos.'); };
  const text = (value, limit) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit;
  const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
  const oneOf = (value, options) => typeof value === 'string' && options.includes(value);
  function validate(data) {
    if (!data || data.format !== 'dgnv-pomodoro-f1' || data.version !== 1) invalid();
    const session = data.session, planner = data.planner;
    if (!session || !planner || !Array.isArray(planner.tasks) || !Array.isArray(planner.projects) || planner.tasks.length > 10000 || planner.projects.length > 1000) invalid();
    const projectIds = new Set(), taskIds = new Set();
    const projects = planner.projects.map(project => {
      if (!project || !text(project.id, 100) || !text(project.name, 60) || projectIds.has(project.id)) invalid();
      projectIds.add(project.id); return { id: project.id, name: project.name };
    });
    const tasks = planner.tasks.map(task => {
      if (!task || !text(task.id, 100) || !text(task.name, 180) || typeof task.done !== 'boolean' || taskIds.has(task.id) || (task.project !== null && !projectIds.has(task.project))) invalid();
      taskIds.add(task.id); return { id: task.id, name: task.name, done: task.done, project: task.project };
    });
    if (!oneOf(session.circuit, ['neon', 'delta', 'orbita']) || !oneOf(session.team, ['mercedes', 'ferrari', 'redbull']) || !oneOf(session.tire, ['soft', 'medium', 'hard']) || !oneOf(session.mode, ['focus', 'short', 'long']) || typeof session.driver !== 'string' || session.driver.length > 18 || !integer(session.completed, 0, 1000000000) || !Number.isFinite(session.minutes) || session.minutes < 0 || session.minutes > 1000000000) invalid();
    const durations = session.durations;
    if (!durations || !integer(durations.focus, 1, 180) || !integer(durations.short, 1, 60) || !integer(durations.long, 1, 90) || session.total !== durations[session.mode] * 60 || !integer(session.remaining, 0, session.total) || session.end !== null) invalid();
    const palettes = { mercedes: ['turquoise', 'silver', 'white', 'graphite', 'purple', 'blue'], ferrari: ['red', 'yellow', 'white', 'graphite', 'green', 'blue'], redbull: ['navy', 'red', 'yellow', 'white', 'orange', 'purple'] };
    if (!session.helmets || !Object.keys(palettes).every(team => oneOf(session.helmets[team], palettes[team]))) invalid();
    return {
      session: { circuit: session.circuit, team: session.team, tire: session.tire, mode: session.mode, driver: session.driver, completed: session.completed, minutes: session.minutes, remaining: session.remaining, total: session.total, end: null, durations: { focus: durations.focus, short: durations.short, long: durations.long }, helmets: { mercedes: session.helmets.mercedes, ferrari: session.helmets.ferrari, redbull: session.helmets.redbull } },
      planner: { tasks, projects },
    };
  }
  $('#backup-download').addEventListener('click', () => {
    try {
      const payload = {};
      window.dispatchEvent(new CustomEvent('pomo:backup-export', { detail: payload }));
      const backup = { format: 'dgnv-pomodoro-f1', version: 1, exportedAt: new Date().toISOString(), ...payload };
      validate(backup);
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      const date = new Date();
      const pad = n => String(n).padStart(2, '0');
      link.download = `pomodoro-f1-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}.json`;
      link.href = url; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      message('Respaldo preparado. Conserva el archivo para recuperar tus datos en este u otro navegador.');
    } catch { message('No se pudo preparar el respaldo. Vuelve a intentarlo.'); }
  });
  let pending = null, readId = 0, dragDepth = 0;
  const dropzone = $('#backup-dropzone');
  function clearSelection() {
    pending = null;
    $('#backup-confirm').disabled = true;
    $('#backup-preview').hidden = true;
    $('#backup-upload-error').textContent = '';
    $('#backup-upload-status').textContent = '';
    $('#backup-drop-label').textContent = 'Arrastra tu archivo aquí';
    dialog.classList.remove('has-file');
  }
  function clearDrag() {
    dragDepth = 0; dropzone.classList.remove('is-dragging');
  }
  $('#backup-upload').addEventListener('click', () => {
    readId++; clearSelection(); clearDrag();
    if (!dialog.open) dialog.showModal();
  });
  $('#backup-close').addEventListener('click', () => dialog.close());
  dropzone.addEventListener('click', () => $('#backup-file').click());
  async function readFiles(files) {
    if (!files?.length) return;
    const currentRead = ++readId;
    clearSelection(); clearDrag();
    const file = files[0];
    try {
      if (files.length !== 1) throw new Error('Carga un solo archivo de respaldo a la vez.');
      if (!file.name.toLowerCase().endsWith('.json')) throw new Error('Selecciona un archivo .json descargado desde este Pomodoro.');
      if (file.size > 5 * 1024 * 1024) throw new Error('El archivo supera el tamaño máximo de 5 MB.');
      $('#backup-upload-status').textContent = 'Leyendo y comprobando tu respaldo…';
      const source = await file.text();
      if (currentRead !== readId || !dialog.open) return;
      let data;
      try { data = JSON.parse(source.replace(/^\uFEFF/, '')); }
      catch { throw new Error('No se pudo leer el archivo. Selecciona un respaldo JSON descargado desde este Pomodoro.'); }
      pending = validate(data);
      $('#backup-file-name').textContent = file.name;
      const taskCount = pending.planner.tasks.length, projectCount = pending.planner.projects.length;
      $('#backup-summary').textContent = `${taskCount} ${taskCount === 1 ? 'tarea' : 'tareas'} · ${projectCount} ${projectCount === 1 ? 'proyecto' : 'proyectos'} · ${pending.session.completed} ${pending.session.completed === 1 ? 'tanda completada' : 'tandas completadas'}`;
      $('#backup-preview').hidden = false;
      $('#backup-confirm').disabled = false;
      $('#backup-drop-label').textContent = 'Archivo listo para cargar';
      $('#backup-upload-status').textContent = 'Respaldo válido. Revisa el resumen y confirma para cargarlo.';
      dialog.classList.add('has-file');
    } catch (error) {
      if (currentRead !== readId || !dialog.open) return;
      pending = null;
      $('#backup-upload-status').textContent = '';
      $('#backup-upload-error').textContent = error.message || 'No se pudo cargar el respaldo.';
    }
  }
  $('#backup-file').addEventListener('change', event => {
    const files = Array.from(event.target.files);
    event.target.value = '';
    readFiles(files);
  });
  dropzone.addEventListener('dragenter', event => {
    event.preventDefault(); dragDepth++; dropzone.classList.add('is-dragging');
  });
  dropzone.addEventListener('dragover', event => {
    event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  });
  dropzone.addEventListener('dragleave', event => {
    event.preventDefault(); dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) dropzone.classList.remove('is-dragging');
  });
  dropzone.addEventListener('drop', event => {
    event.preventDefault(); event.stopPropagation();
    readFiles(Array.from(event.dataTransfer?.files || [])); clearDrag();
  });
  // Avoid opening a dragged file as a new page if it misses the drop target.
  for (const type of ['dragover', 'drop']) document.addEventListener(type, event => {
    if (dialog.open && Array.from(event.dataTransfer?.types || []).includes('Files')) {
      event.preventDefault();
      if (type === 'drop') clearDrag();
    }
  });
  $('#backup-confirm').addEventListener('click', () => {
    if (!pending) return;
    window.dispatchEvent(new CustomEvent('pomo:backup-restore', { detail: pending }));
    dialog.close(); message('Respaldo cargado. Se recuperaron tus datos y el temporizador quedó en pausa.');
  });
  dialog.addEventListener('close', () => { readId++; clearSelection(); clearDrag(); });
})();
