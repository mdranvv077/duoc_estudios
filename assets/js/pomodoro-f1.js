(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const key = 'dgnv-pomodoro-f1-v1';
  const teams = { mercedes: 'MERCEDES', ferrari: 'FERRARI', redbull: 'RED BULL' };
  const helmetColors = {
    turquoise: ['Turquesa', '#43e2c8'], silver: ['Plateado', '#b7c9d3'], white: ['Blanco', '#edf3fa'],
    graphite: ['Grafito', '#687887'], purple: ['Violeta', '#ae8bfa'], blue: ['Azul', '#548fee'],
    red: ['Rojo', '#ef3340'], yellow: ['Amarillo', '#ffd546'], green: ['Verde', '#49bd81'],
    navy: ['Marino', '#354c8b'], orange: ['Naranjo', '#ff923e'],
  };
  const helmetPalettes = {
    mercedes: ['turquoise', 'silver', 'white', 'graphite', 'purple', 'blue'],
    ferrari: ['red', 'yellow', 'white', 'graphite', 'green', 'blue'],
    redbull: ['navy', 'red', 'yellow', 'white', 'orange', 'purple'],
  };
  const tires = { soft: { name: 'BLANDAS', code: 'S', minutes: 25 }, medium: { name: 'MEDIAS', code: 'M', minutes: 35 }, hard: { name: 'DURAS', code: 'H', minutes: 50 } };
  const preferenceCookie = 'dgnv_pomo_garage';
  const validDurations = values => ['focus', 'short', 'long'].every(m => Number.isInteger(values?.[m]) && values[m] >= 1 && values[m] <= ({ focus: 180, short: 60, long: 90 })[m]);
  const circuits = {
    neon: { name: 'NEÓN', path: 'M100 190H207C225 190 229 175 217 164L190 144C181 135 186 123 199 123L239 129C253 132 261 122 257 110C253 97 268 90 281 96L343 121C360 129 379 120 388 106L419 60C430 43 415 28 398 32L313 51C287 57 271 38 243 32L181 28C143 25 134 44 142 62L152 84C159 100 149 108 132 106L101 101C77 99 60 118 64 141L71 168C75 183 86 190 100 190Z' },
    delta: { name: 'DELTA', path: 'M100 190H347C373 190 390 179 402 158L443 91C453 75 443 59 427 61L356 78C344 81 332 77 327 65L322 45C320 28 301 24 290 37L263 74C256 84 245 86 236 77L216 55C206 44 190 45 182 56L162 85C154 98 141 102 125 97L106 90C87 82 68 94 66 112L58 150C54 173 76 190 100 190Z' },
    orbita: { name: 'ÓRBITA', path: 'M100 190H216C247 190 262 183 268 166C272 153 257 145 246 145H222C209 145 207 133 216 126C229 115 247 122 261 112L282 91C291 82 304 83 313 96L329 116C341 132 359 131 371 116L419 66C433 50 421 31 402 33L328 39C299 41 281 24 249 27L166 34C149 35 140 48 144 63L149 78C153 91 142 101 128 97L110 91C87 84 71 87 64 109C55 131 61 151 73 165L85 181C89 187 94 190 100 190Z' },
  };
  const labels = { focus: 'TANDA DE CONCENTRACIÓN', short: 'PARADA EN BOXES', long: 'DESCANSO LARGO' };
  let state = { circuit: 'neon', team: 'mercedes', tire: 'soft', mode: 'focus', durations: { focus: 25, short: 5, long: 15 }, remaining: 1500, total: 1500, end: null, completed: 0, minutes: 0, driver: 'PILOTO 01' };
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && circuits[saved.circuit] && labels[saved.mode] && ['focus', 'short', 'long'].every(m => Number.isFinite(saved.durations?.[m]) && saved.durations[m] >= 1 && saved.durations[m] <= 180) && Number.isFinite(saved.remaining) && saved.remaining >= 0 && Number.isFinite(saved.total) && saved.total > 0 && (saved.end === null || Number.isFinite(saved.end)) && Number.isInteger(saved.completed) && saved.completed >= 0 && Number.isFinite(saved.minutes) && saved.minutes >= 0) state = { ...state, ...saved, driver: typeof saved.driver === 'string' ? saved.driver.slice(0, 18) : state.driver };
  } catch { /* The timer also works when browser storage is unavailable. */ }
  state.team = 'mercedes';
  state.tire = 'soft';
  state.soundEnabled = false;
  state.helmets = { mercedes: 'turquoise', ferrari: 'red', redbull: 'navy' };
  try {
    const cookie = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(`${preferenceCookie}=`));
    const preferences = cookie ? JSON.parse(decodeURIComponent(cookie.slice(preferenceCookie.length + 1))) : null;
    if (preferences) {
      state.soundEnabled = preferences.soundEnabled === true;
      if (Object.hasOwn(teams, preferences.team)) state.team = preferences.team;
      if (Object.hasOwn(tires, preferences.tire)) state.tire = preferences.tire;
      for (const team of Object.keys(teams)) {
        if (helmetPalettes[team].includes(preferences.helmets?.[team])) state.helmets[team] = preferences.helmets[team];
      }
      if (!state.end && state.remaining === state.total && validDurations(preferences.durations)) {
        state.durations = preferences.durations;
        state.total = state.remaining = state.durations[state.mode] * 60;
      }
    }
  } catch { /* Ignore an expired or damaged preference cookie. */ }
  let starting = false, launchId = 0;
  let lastDisplay = '';
  const persist = () => { try { const { team, tire, helmets, ...session } = state; localStorage.setItem(key, JSON.stringify(session)); } catch {} };
  function persistPreferences() {
    const value = encodeURIComponent(JSON.stringify({ team: state.team, tire: state.tire, helmets: state.helmets, durations: state.durations, soundEnabled: state.soundEnabled }));
    const path = new URL('.', location.href).pathname;
    document.cookie = `${preferenceCookie}=${value}; Max-Age=15552000; Path=${path}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    persist();
  }
  function updateGarage() {
    document.body.dataset.team = state.team;
    document.body.dataset.tire = state.tire;
    const [helmetName, helmetColor] = helmetColors[state.helmets[state.team]];
    document.body.style.setProperty('--helmet-color', helmetColor);
    updateHelmetPalette();
    $('#team-name').textContent = teams[state.team];
    $('#tire-name').textContent = `${tires[state.tire].code} · ${tires[state.tire].name}`;
    $('#car-preview-title').textContent = `Monoplaza ${teams[state.team]} en vista lateral, piloto con casco ${helmetName.toLowerCase()} y neumáticos ${tires[state.tire].name.toLowerCase()}`;
    document.querySelectorAll('button[data-team]').forEach(button => button.setAttribute('aria-pressed', button.dataset.team === state.team));
    document.querySelectorAll('button[data-tire]').forEach(button => button.setAttribute('aria-pressed', button.dataset.tire === state.tire));
  }
  function updateHelmetPalette() {
    const palette = $('#helmet-colors');
    if (palette.dataset.team !== state.team) {
      const buttons = helmetPalettes[state.team].map(color => {
        const button = document.createElement('button');
        button.type = 'button'; button.dataset.helmet = color;
        const swatch = document.createElement('i');
        swatch.style.backgroundColor = helmetColors[color][1];
        swatch.setAttribute('aria-hidden', 'true');
        button.append(swatch, document.createTextNode(helmetColors[color][0]));
        return button;
      });
      palette.replaceChildren(...buttons); palette.dataset.team = state.team;
    }
    $('#helmet-palette-title').textContent = `CASCO · ${teams[state.team]}`;
    palette.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', button.dataset.helmet === state.helmets[state.team]));
  }
  const status = message => { $('#race-status').textContent = message; };
  let audioContext, audioVolume;
  function prepareAudio() {
    if (!state.soundEnabled) return;
    try {
      if (!audioContext) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        audioContext = new Audio(); audioVolume = audioContext.createGain();
        audioVolume.gain.value = .105; audioVolume.connect(audioContext.destination);
      }
      audioVolume.gain.value = .105;
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch { /* Audio availability never blocks the timer. */ }
  }
  function tone(frequency, duration = .1) {
    if (!state.soundEnabled || !audioContext || audioContext.state !== 'running') return;
    const now = audioContext.currentTime, oscillator = audioContext.createOscillator(), envelope = audioContext.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0, now); envelope.gain.linearRampToValueAtTime(1, now + .012);
    envelope.gain.exponentialRampToValueAtTime(.001, now + duration);
    oscillator.connect(envelope); envelope.connect(audioVolume);
    oscillator.start(now); oscillator.stop(now + duration + .01);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  function updateSoundButton() {
    $('#sound-toggle').setAttribute('aria-pressed', state.soundEnabled);
    $('#sound-toggle').textContent = state.soundEnabled ? '♪ Sonido: activado' : '♪ Sonido: desactivado';
  }
  $('#sound-toggle').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) prepareAudio();
    else if (audioVolume) audioVolume.gain.value = 0;
    updateSoundButton(); persistPreferences();
  });
  const clock = seconds => { const whole = Math.ceil(seconds); return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`; };
  const trackPath = $('#track-line'), trackCar = $('#track-car');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let trackLength = 0, carFrame = null;
  function positionCar() {
    if (!trackLength) return;
    // Use the exact deadline, independently of the rounded seconds on the clock.
    const remaining = state.end ? (state.end - Date.now()) / 1000 : state.remaining;
    const progress = Math.min(1, Math.max(0, 1 - remaining / state.total));
    const position = (progress * 4 % 1) * trackLength;
    const point = trackPath.getPointAtLength(position);
    const before = trackPath.getPointAtLength((position - .5 + trackLength) % trackLength);
    const after = trackPath.getPointAtLength((position + .5) % trackLength);
    trackCar.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI})`);
  }
  function animateCar() {
    carFrame = null;
    positionCar();
    if (state.end && Date.now() < state.end && !reducedMotion.matches) carFrame = requestAnimationFrame(animateCar);
  }
  function syncCar() {
    positionCar();
    if (state.end && !reducedMotion.matches) {
      if (carFrame === null) carFrame = requestAnimationFrame(animateCar);
    } else if (carFrame !== null) {
      cancelAnimationFrame(carFrame); carFrame = null;
    }
  }
  function clearLights() { $('.race-lights').classList.remove('go'); document.querySelectorAll('.race-lights i').forEach(light => light.classList.remove('on')); }
  function cancelLaunch() { launchId++; starting = false; clearLights(); }
  function render() {
    const remaining = state.end ? Math.max(0, Math.ceil((state.end - Date.now()) / 1000)) : state.remaining;
    const progress = Math.min(1, Math.max(0, 1 - remaining / state.total));
    const display = clock(remaining);
    if (display !== lastDisplay) { $('#timer').textContent = display; lastDisplay = display; }
    const title = state.end ? `${display} · Pomodoro F1 — DGNV Studios` : 'Pomodoro F1 — DGNV Studios';
    if (document.title !== title) document.title = title;
    $('#session-label').textContent = labels[state.mode];
    $('#sector').textContent = `SECTOR ${String(Math.min(3, Math.floor(progress * 3) + 1)).padStart(2, '0')} / 03`;
    $('#progress-fill').style.width = `${progress * 100}%`;
    $('.race-progress').setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    $('#progress-text').textContent = `${Math.round(progress * 100)}% COMPLETADO`;
    $('#completed').textContent = String(state.completed).padStart(2, '0');
    $('#minutes').replaceChildren(document.createTextNode(`${Math.round(state.minutes)} `), Object.assign(document.createElement('small'), { textContent: 'MIN' }));
    const stints = state.completed % 4;
    document.querySelectorAll('#stints i').forEach((item, i) => item.classList.toggle('done', i < stints));
    $('#stints').setAttribute('aria-label', `${stints} de 4 tandas del ciclo completadas`);
    document.querySelectorAll('[data-mode]').forEach(button => { const active = button.dataset.mode === state.mode; button.classList.toggle('active', active); button.setAttribute('aria-pressed', active); });
    $('#start').disabled = starting;
    $('#start').textContent = starting ? 'PREPARANDO SALIDA…' : state.end ? 'Ⅱ BANDERA ROJA · PAUSAR' : state.remaining < state.total ? '▶ REANUDAR TANDA' : state.mode === 'focus' ? '▶ TOMAR LA SALIDA' : '▶ INICIAR DESCANSO';
    syncCar();
  }
  function setMode(mode) {
    cancelLaunch(); state.mode = mode; state.end = null;
    state.total = state.durations[mode] * 60; state.remaining = state.total;
    persist(); render();
  }
  function finish() {
    const wasFocus = state.mode === 'focus';
    if (wasFocus) { state.completed++; state.minutes += state.total / 60; }
    const next = wasFocus ? (state.completed % 4 === 0 ? 'long' : 'short') : 'focus';
    setMode(next);
    status(wasFocus ? `¡Bandera a cuadros! Tanda completada. Tu ${next === 'long' ? 'descanso largo' : 'descanso corto'} está listo para comenzar.` : 'Descanso completado. Cuando quieras, vuelve a la pista.');
  }
  function begin() {
    state.end = Date.now() + state.remaining * 1000;
    persist(); status(state.mode === 'focus' ? 'En pista. Mantén la atención en tu tarea.' : 'En boxes. Descansa y recupera energía.'); render();
  }
  function launch() {
    prepareAudio();
    starting = true; const id = ++launchId; clearLights(); render(); status('Prepárate. La tanda comienza cuando se apaguen los semáforos.');
    document.querySelectorAll('.race-lights i').forEach((light, i) => setTimeout(() => { if (id === launchId) { light.classList.add('on'); tone(480); } }, i * 400));
    setTimeout(() => { if (id !== launchId) return; clearLights(); $('.race-lights').classList.add('go'); tone(760, .22); starting = false; begin(); setTimeout(() => { if (id === launchId) clearLights(); }, 700); }, 2400);
  }
  $('#start').addEventListener('click', () => {
    if (starting) return;
    if (state.end) { state.remaining = Math.max(0, (state.end - Date.now()) / 1000); state.end = null; if (!state.remaining) { finish(); return; } persist(); render(); status('Bandera roja. Tanda en pausa; reanúdala cuando estés listo.'); }
    else if (state.mode === 'focus' && state.remaining === state.total) launch();
    else begin();
  });
  $('#reset').addEventListener('click', () => { setMode(state.mode); status('Sesión reiniciada. Todo listo para empezar.'); });
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { setMode(button.dataset.mode); status(state.mode === 'focus' ? 'Prepara tu tarea y toma la salida.' : 'Pausa preparada. Iníciala cuando quieras.'); }));
  function updateCircuit() {
    const circuit = circuits[state.circuit];
    $('#circuit-name').textContent = `CIRCUITO ${circuit.name}`;
    document.querySelectorAll('[data-track-outline]').forEach(path => path.setAttribute('d', circuit.path));
    trackLength = trackPath.getTotalLength();
    drawKerbs();
    const start = $('#track-line').getPointAtLength(0);
    $('.finish-line').setAttribute('x', start.x - 3);
    $('.finish-line').setAttribute('y', start.y - 7);
    document.querySelectorAll('[data-circuit]').forEach(button => {
      const active = button.dataset.circuit === state.circuit;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', active);
      button.querySelector('svg').setAttribute('viewBox', '35 10 430 205');
      button.querySelector('path').setAttribute('d', circuits[button.dataset.circuit].path);
    });
    for (const mode of ['focus', 'short', 'long']) $('#settings').elements[mode].value = state.durations[mode];
  }
  function drawKerbs() {
    const path = $('#track-line'), length = path.getTotalLength();
    const fragment = document.createDocumentFragment();
    const at = distance => path.getPointAtLength((distance + length) % length);
    for (let distance = 0; distance < length; distance += 4) {
      const p = at(distance), before = at(distance - 5), after = at(distance + 5);
      const a = Math.atan2(p.y - before.y, p.x - before.x);
      const b = Math.atan2(after.y - p.y, after.x - p.x);
      const turn = Math.atan2(Math.sin(b - a), Math.cos(b - a));
      if (Math.abs(turn) < .065) continue;
      // Place alternating kerb tiles outside the curve, following its tangent.
      const side = turn > 0 ? -1 : 1;
      const normal = angle => [-Math.sin(angle) * 8.4 * side, Math.cos(angle) * 8.4 * side];
      const n = normal((a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) / 2));
      const end = at(distance + 3.8), ahead = at(distance + 8.8);
      const en = normal(Math.atan2(ahead.y - p.y, ahead.x - p.x));
      const tile = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tile.setAttribute('d', `M${p.x + n[0]} ${p.y + n[1]}L${end.x + en[0]} ${end.y + en[1]}`);
      tile.setAttribute('stroke', Math.round(distance / 4) % 2 ? '#d7e3e8' : '#df5865');
      fragment.append(tile);
    }
    $('#track-kerbs').replaceChildren(fragment);
  }
  document.querySelectorAll('[data-circuit]').forEach(button => button.addEventListener('click', () => { state.circuit = button.dataset.circuit; setMode('focus'); updateCircuit(); render(); status('Circuito seleccionado. Prepara tu siguiente tarea.'); }));
  document.querySelectorAll('button[data-team]').forEach(button => button.addEventListener('click', () => {
    state.team = button.dataset.team;
    updateGarage(); persistPreferences();
    status(`Monoplaza ${teams[state.team]} seleccionado. Personalización guardada en este navegador.`);
  }));
  document.querySelectorAll('button[data-tire]').forEach(button => button.addEventListener('click', () => {
    state.tire = button.dataset.tire;
    state.durations.focus = tires[state.tire].minutes;
    setMode('focus'); updateCircuit(); updateGarage(); persistPreferences();
    status(`Neumáticos ${tires[state.tire].name.toLowerCase()}: tanda preparada de ${state.durations.focus} minutos. Elección guardada.`);
  }));
  $('#settings').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    for (const mode of ['focus', 'short', 'long']) state.durations[mode] = Number(event.currentTarget.elements[mode].value);
    setMode(state.mode); persistPreferences(); status('Estrategia actualizada. Se ha reiniciado la sesión con los nuevos tiempos.');
  });
  $('#driver-name').value = state.driver;
  $('#helmet-trigger').addEventListener('click', () => {
    const picker = $('#helmet-picker');
    picker.hidden = !picker.hidden;
    $('#helmet-trigger').setAttribute('aria-expanded', !picker.hidden);
  });
  $('#helmet-colors').addEventListener('click', event => {
    const button = event.target.closest('button[data-helmet]');
    if (!button || !helmetPalettes[state.team].includes(button.dataset.helmet)) return;
    state.helmets[state.team] = button.dataset.helmet;
    updateGarage(); persistPreferences();
    status(`Casco ${helmetColors[button.dataset.helmet][0].toLowerCase()} aplicado al piloto y al auto ${teams[state.team]}. Color guardado.`);
  });
  $('#helmet-picker').addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      $('#helmet-picker').hidden = true;
      $('#helmet-trigger').setAttribute('aria-expanded', 'false');
      $('#helmet-trigger').focus();
    }
  });
  $('#driver-name').addEventListener('input', event => { state.driver = event.target.value; persist(); });
  $('#fullscreen').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.body.requestFullscreen) await document.body.requestFullscreen(); else status('Este navegador no ofrece pantalla completa. Puedes usar la vista adaptada.'); }
    catch { status('No se pudo activar la pantalla completa en este navegador.'); }
  });
  document.addEventListener('fullscreenchange', () => { $('#fullscreen').textContent = document.fullscreenElement ? '↙ Salir de pantalla completa' : '↗ Pantalla completa'; });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  function tick() { if (state.end && Date.now() >= state.end) finish(); else render(); }
  window.addEventListener('pomo:backup-export', event => {
    tick();
    event.detail.session = {
      ...state, durations: { ...state.durations }, helmets: { ...state.helmets },
      remaining: state.end ? Math.max(0, (state.end - Date.now()) / 1000) : state.remaining,
      end: null,
    };
  });
  window.addEventListener('pomo:backup-restore', event => {
    cancelLaunch();
    state = { ...event.detail.session, durations: { ...event.detail.session.durations }, helmets: { ...event.detail.session.helmets }, end: null };
    state.soundEnabled = state.soundEnabled === true;
    if (!state.soundEnabled && audioVolume) audioVolume.gain.value = 0;
    updateSoundButton();
    persistPreferences(); updateCircuit(); updateGarage();
    $('#driver-name').value = state.driver;
    lastDisplay = ''; render(); status('Respaldo cargado. El temporizador está en pausa.');
  });
  updateCircuit(); updateGarage(); updateSoundButton();
  if (state.end && Date.now() >= state.end) finish();
  else { render(); if (state.end) status('Tanda recuperada. El temporizador sigue en marcha.'); }
  setInterval(tick, 200);
})();
