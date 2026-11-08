(() => {
  'use strict';
  const root = document.querySelector('.race-planner');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const key = 'dgnv-pomodoro-planner-v1';
  let tasks = [], projects = [], view = 'pending', projectFilter = null;
  const validItem = item => item && typeof item.id === 'string' && typeof item.name === 'string' && item.name.trim();
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    projects = (Array.isArray(saved?.projects) ? saved.projects : []).filter(validItem).map(p => ({ id: p.id, name: p.name.slice(0, 60) }));
    tasks = (Array.isArray(saved?.tasks) ? saved.tasks : []).filter(validItem).map(t => ({ id: t.id, name: t.name.slice(0, 180), done: t.done === true, project: projects.some(p => p.id === t.project) ? t.project : null }));
  } catch {}
  const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const announce = message => { $('#planner-status').textContent = message; };
  function save() {
    try { localStorage.setItem(key, JSON.stringify({ tasks, projects })); }
    catch { $('#planner-storage').textContent = 'El navegador no permite guardar los cambios. Se conservarán mientras esta página siga abierta.'; }
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function removeButton(label, action) {
    const button = el('button', 'planner-delete', '×');
    button.type = 'button'; button.setAttribute('aria-label', label); button.title = label;
    button.addEventListener('click', action);
    return button;
  }
  function render() {
    const selection = $('#task-project').value;
    const options = [new Option('Sin proyecto', ''), ...projects.map(p => new Option(p.name, p.id))];
    $('#task-project').replaceChildren(...options);
    if (projects.some(p => p.id === selection)) $('#task-project').value = selection;
    const inProject = tasks.filter(t => !projectFilter || t.project === projectFilter);
    const pending = inProject.filter(t => !t.done).length;
    const done = inProject.length - pending;
    $('#task-pending').textContent = `Pendientes (${pending})`;
    $('#task-done').textContent = `Completadas (${done})`;
    root.querySelectorAll('[data-task-view]').forEach(button => button.setAttribute('aria-pressed', button.dataset.taskView === view));
    const project = projects.find(p => p.id === projectFilter);
    $('#task-project-filter').hidden = !project;
    $('#task-project-filter-name').textContent = project ? project.name : '';
    const visible = inProject.filter(t => view === 'done' ? t.done : !t.done);
    const taskNodes = visible.map(task => {
      const item = el('li', `planner-task${task.done ? ' is-done' : ''}`);
      const label = el('label');
      const checkbox = el('input'); checkbox.type = 'checkbox'; checkbox.checked = task.done;
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked; save(); render();
        $('#task-name').focus();
        announce(task.done ? 'Tarea completada.' : 'Tarea marcada como pendiente.');
      });
      const content = el('span', 'planner-task-copy'); content.append(el('span', 'planner-task-name', task.name));
      const linked = projects.find(p => p.id === task.project);
      if (linked) content.append(el('small', '', linked.name));
      label.append(checkbox, content);
      item.append(label, removeButton(`Eliminar tarea: ${task.name}`, () => {
        tasks = tasks.filter(t => t.id !== task.id); save(); render(); $('#task-name').focus(); announce('Tarea eliminada.');
      }));
      return item;
    });
    $('#task-list').replaceChildren(...taskNodes);
    $('#task-empty').hidden = visible.length > 0;
    $('#task-empty').textContent = view === 'done' ? 'No hay tareas completadas.' : project ? 'Este proyecto no tiene tareas pendientes.' : 'No hay tareas pendientes. Agrega una para organizar la sesión.';
    $('#project-count').textContent = String(projects.length).padStart(2, '0');
    const projectNodes = projects.map(project => {
      const related = tasks.filter(t => t.project === project.id);
      const complete = related.filter(t => t.done).length;
      const row = el('li', 'planner-project');
      const filter = el('button', 'planner-project-select'); filter.type = 'button';
      filter.setAttribute('aria-pressed', projectFilter === project.id);
      filter.setAttribute('aria-label', `Ver tareas de ${project.name}`);
      filter.append(el('span', 'planner-project-name', project.name), el('small', '', `${complete} de ${related.length} tareas completadas`));
      const bar = el('span', 'planner-project-bar');
      const fill = el('i'); fill.style.width = `${related.length ? complete / related.length * 100 : 0}%`; bar.append(fill); filter.append(bar);
      filter.addEventListener('click', () => { projectFilter = projectFilter === project.id ? null : project.id; render(); });
      row.append(filter, removeButton(`Eliminar proyecto ${project.name}; sus tareas se conservarán`, () => {
        projects = projects.filter(p => p.id !== project.id);
        tasks.forEach(t => { if (t.project === project.id) t.project = null; });
        if (projectFilter === project.id) projectFilter = null;
        save(); render(); $('#project-name').focus(); announce('Proyecto eliminado. Sus tareas se conservaron sin proyecto.');
      }));
      return row;
    });
    $('#project-list').replaceChildren(...projectNodes);
    $('#project-empty').hidden = projects.length > 0;
  }
  $('#task-form').addEventListener('submit', event => {
    event.preventDefault(); const name = $('#task-name').value.trim();
    if (!name) { $('#task-name').focus(); return; }
    const project = $('#task-project').value || null;
    tasks.push({ id: makeId(), name, done: false, project });
    view = 'pending'; projectFilter = project; $('#task-name').value = '';
    save(); render(); $('#task-name').focus(); announce('Tarea agregada.');
  });
  $('#project-form').addEventListener('submit', event => {
    event.preventDefault(); const name = $('#project-name').value.trim();
    if (!name) { $('#project-name').focus(); return; }
    const project = { id: makeId(), name }; projects.push(project); $('#project-name').value = '';
    save(); render(); $('#task-project').value = project.id; $('#task-name').focus(); announce('Proyecto creado. Ya puedes agregarle tareas.');
  });
  root.querySelectorAll('[data-task-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.taskView; render(); }));
  $('#clear-project-filter').addEventListener('click', () => { projectFilter = null; render(); });
  window.addEventListener('pomo:backup-export', event => {
    event.detail.planner = { tasks: tasks.map(task => ({ ...task })), projects: projects.map(project => ({ ...project })) };
  });
  window.addEventListener('pomo:backup-restore', event => {
    tasks = event.detail.planner.tasks.map(task => ({ ...task }));
    projects = event.detail.planner.projects.map(project => ({ ...project }));
    view = 'pending'; projectFilter = null;
    save(); render(); announce('Tareas y proyectos recuperados del respaldo.');
  });
  render();
})();
