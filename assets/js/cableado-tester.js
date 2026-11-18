(() => {
  const game = document.querySelector('[data-ct-game]');
  if (!game) return;

  const connectButtons = [...game.querySelectorAll('[data-ct-connect]')];
  const answerButtons = [...game.querySelectorAll('[data-ct-answer]')];
  const slider = game.querySelector('[data-ct-slider]');
  const next = game.querySelector('[data-ct-next]');
  const status = game.querySelector('[data-ct-status]');
  const lights = new Map([...game.querySelectorAll('[data-ct-led]')].map(
    light => [light.dataset.ctLed, light]
  ));
  const intervals = {fast: 280, slow: 700};
  const modes = ['off', 'fast', 'slow'];
  const modeLabels = {off: 'OFF, apagado', fast: 'ON, rápido', slow: 'S-ON, lento'};
  const connected = new Set();
  let openPin;
  let mode;
  let pin;
  let timer;
  let ready;
  let answered;

  function announce(message, result = '') {
    status.textContent = message;
    status.dataset.result = result;
  }

  function updatePlug(button, inserted) {
    const side = button.dataset.ctConnect;
    button.setAttribute('aria-pressed', String(inserted));
    button.textContent = `${inserted ? 'Desconectar' : 'Conectar'} ${side.toUpperCase()}`;
    game.querySelector(`[data-ct-plug="${side}"]`).classList.toggle('is-connected', inserted);
    game.querySelector(`[data-ct-cord="${side}"]`).classList.toggle('is-connected', inserted);
  }

  function updateMode(value) {
    mode = value;
    game.dataset.mode = value;
    slider.setAttribute('aria-valuenow', String(modes.indexOf(value)));
    slider.setAttribute('aria-valuetext', modeLabels[value]);
  }

  function stopSweep() {
    window.clearTimeout(timer);
    timer = undefined;
    lights.forEach(light => light.classList.remove('is-lit'));
  }

  function resetSweep() {
    pin = 1;
    ready = false;
    answerButtons.forEach(button => { button.disabled = true; });
  }

  function newCable() {
    stopSweep();
    openPin = Math.random() < 0.7 ? null : 1 + Math.floor(Math.random() * 8);
    answered = false;
    connected.clear();
    updateMode('off');
    resetSweep();
    connectButtons.forEach(button => {
      button.disabled = false;
      updatePlug(button, false);
    });
    next.hidden = true;
    announce('Conecta los dos extremos para empezar.');
  }

  function sweepPin() {
    const master = lights.get(`master-${pin}`);
    const remote = lights.get(`remote-${pin}`);
    const passed = pin !== openPin;
    master.classList.add('is-lit');
    remote.classList.toggle('is-lit', passed);

    timer = window.setTimeout(() => {
      master.classList.remove('is-lit');
      remote.classList.remove('is-lit');
      if (pin === 8 && !ready) {
        ready = true;
        answerButtons.forEach(button => { button.disabled = false; });
        announce('Primer barrido completo. Marca tu diagnóstico.');
      }
      pin = pin === 8 ? 1 : pin + 1;
      sweepPin();
    }, intervals[mode]);
  }

  function refreshSweep() {
    stopSweep();
    if (answered) return;
    if (connected.size < 2) {
      const message = connected.size ? 'Conecta el otro extremo del cable.' : 'Conecta los dos extremos para empezar.';
      announce(message);
      return;
    }
    if (mode === 'off') {
      if (!ready) {
        resetSweep();
        announce('Tester apagado. Mueve el interruptor a ON o S-ON.');
      }
      return;
    }
    if (!ready) announce(`Barrido ${mode === 'fast' ? 'rápido' : 'lento'} en curso…`);
    sweepPin();
  }

  connectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const side = button.dataset.ctConnect;
      const inserted = !connected.has(side);
      if (inserted) connected.add(side);
      else {
        connected.delete(side);
        resetSweep();
      }
      updatePlug(button, inserted);
      refreshSweep();
    });
  });

  function selectMode(value) {
    if (value === mode) return;
    updateMode(value);
    refreshSweep();
  }

  slider.addEventListener('keydown', event => {
    const index = modes.indexOf(mode);
    const target = {
      ArrowLeft: index - 1, ArrowDown: index - 1,
      ArrowRight: index + 1, ArrowUp: index + 1,
      Home: 0, End: modes.length - 1
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectMode(modes[Math.max(0, Math.min(modes.length - 1, target))]);
  });

  function slideSwitch(event) {
    const inverse = slider.getScreenCTM().inverse();
    const {x} = new DOMPoint(event.clientX, event.clientY).matrixTransform(inverse);
    selectMode(x < 123 ? 'off' : x < 141 ? 'fast' : 'slow');
  }
  slider.addEventListener('pointerdown', event => {
    slider.setPointerCapture(event.pointerId);
    slideSwitch(event);
  });
  slider.addEventListener('pointermove', event => {
    if (slider.hasPointerCapture(event.pointerId)) slideSwitch(event);
  });

  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!ready || answered) return;
      const good = openPin === null;
      const correct = (button.dataset.ctAnswer === 'good') === good;
      const explanation = good
        ? 'El cable está bueno. Los ocho pines se encendieron en ambas unidades.'
        : `El cable está malo. El pin ${openPin} no se encendió en el REMOTE por falta de continuidad.`;
      answered = true;
      stopSweep();
      connectButtons.forEach(option => { option.disabled = true; });
      answerButtons.forEach(option => { option.disabled = true; });
      next.hidden = false;
      announce(`${correct ? 'Correcto.' : 'Incorrecto.'} ${explanation}`, correct ? 'correct' : 'incorrect');
    });
  });

  next.addEventListener('click', () => {
    newCable();
    connectButtons[0].focus();
  });

  newCable();
})();
