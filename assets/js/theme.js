(() => {
  'use strict';
  const root = document.documentElement;
  const source = document.currentScript.src;
  const cookiePath = new URL('../../', source).pathname;
  const cookieName = 'dgnv_site_theme';
  const noticeCookieName = 'dgnv_theme_notice_hidden';
  const modes = ['dark', 'light', 'device'];
  const media = matchMedia('(prefers-color-scheme: light)');
  const deviceTheme = () => media.matches ? 'light' : 'dark';
  const read = () => {
    try { const value = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${cookieName}=`))?.split('=')[1]; return modes.includes(value) ? value : 'dark'; }
    catch { return 'dark'; }
  };
  let mode = read(), transitionTimer, promptTimer, picker, suggestion;
  const labels = { dark: 'Oscuro', light: 'Claro', device: 'Dispositivo' };
  function apply(animate = false) {
    const theme = mode === 'device' ? deviceTheme() : mode;
    if (animate && root.dataset.theme !== theme) {
      root.classList.add('theme-changing');
      clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => root.classList.remove('theme-changing'), 320);
    }
    root.dataset.theme = theme; root.dataset.themeMode = mode;
    if (suggestion?.open && theme === deviceTheme()) close(suggestion);
    document.querySelectorAll('input[name="site-theme"]').forEach(input => { input.checked = input.value === mode; });
    document.querySelectorAll('[data-open-theme]').forEach(button => button.setAttribute('aria-label', `Cambiar tema. Preferencia actual: ${labels[mode]}`));
  }
  function save() { try { document.cookie = `${cookieName}=${mode}; Max-Age=31536000; Path=${cookiePath}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch {} }
  const mismatch = () => `${root.dataset.theme}-${deviceTheme()}`;
  const dismissed = new Set();
  function rememberMismatch() {
    dismissed.add(mismatch());
    try {
      sessionStorage.setItem('dgnv-theme-prompt', mismatch());
      document.cookie = `${noticeCookieName}=1; Max-Age=31536000; Path=${cookiePath}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {}
  }
  function alreadyAsked() {
    if (dismissed.has(mismatch())) return true;
    try { return document.cookie.split(';').some(c => c.trim() === `${noticeCookieName}=1`) || sessionStorage.getItem('dgnv-theme-prompt') === mismatch(); }
    catch { return false; }
  }
  let channel;
  try { channel = new BroadcastChannel('dgnv-site-theme'); channel.onmessage = () => { mode = read(); apply(true); }; } catch {}
  function select(value) {
    mode = value; save(); apply(true); rememberMismatch();
    channel?.postMessage('changed');
  }
  apply();
  function close(dialog) {
    if (!dialog?.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    setTimeout(() => { dialog.close(); dialog.classList.remove('is-closing'); }, 180);
  }
  function makeDialog(markup) {
    const dialog = document.createElement('dialog'); dialog.className = 'site-theme-dialog'; dialog.innerHTML = markup;
    document.body.append(dialog);
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) { if (dialog === suggestion) rememberMismatch(); close(dialog); } } });
    dialog.addEventListener('cancel', event => { event.preventDefault(); if (dialog === suggestion) rememberMismatch(); close(dialog); });
    return dialog;
  }
  function schedulePrompt() {
    clearTimeout(promptTimer);
    if (!suggestion || root.dataset.theme === deviceTheme() || alreadyAsked()) return;
    promptTimer = setTimeout(() => {
      if (root.dataset.theme === deviceTheme() || alreadyAsked() || suggestion.open) return;
      const names = { dark: 'oscuro', light: 'claro' };
      suggestion.querySelector('[data-theme-mismatch]').textContent = `Tu dispositivo está en ${names[deviceTheme()]} y la web en ${names[root.dataset.theme]}. Si prefieres, puedes elegir otra apariencia.`;
      const focused = document.activeElement;
      suggestion.show();
      focused?.focus?.({ preventScroll: true });
    }, 30000);
  }
  function init() {
    {
      picker = makeDialog(`<div class="site-theme-top"><p>APARIENCIA</p><button type="button" class="site-theme-close" aria-label="Cerrar selector de tema">×</button></div><h2 id="site-theme-title">Elige tu tema</h2><p>Se aplicará en todas las páginas de DGNV Studios.</p><fieldset class="site-theme-options"><legend>Tema de la página</legend><label><input type="radio" name="site-theme" value="dark"><span class="theme-preview preview-dark" aria-hidden="true">☾</span><span><strong>Oscuro</strong><small>El diseño original.</small></span></label><label><input type="radio" name="site-theme" value="light"><span class="theme-preview preview-light" aria-hidden="true">☀</span><span><strong>Claro</strong><small>Fondos claros y contraste suave.</small></span></label><label><input type="radio" name="site-theme" value="device"><span class="theme-preview preview-device" aria-hidden="true">◐</span><span><strong>Dispositivo</strong><small>Sigue el tema del dispositivo o navegador.</small></span></label></fieldset><p class="site-theme-note">Tu preferencia se recuerda en este navegador.</p><p class="site-theme-status" role="status"></p>`);
      picker.setAttribute('aria-labelledby', 'site-theme-title');
      picker.querySelector('.site-theme-close').addEventListener('click', () => close(picker));
      picker.addEventListener('change', event => { if (event.target.name === 'site-theme') { select(event.target.value); picker.querySelector('.site-theme-status').textContent = `Tema ${labels[mode].toLowerCase()} guardado.`; } });
      document.querySelectorAll('[data-open-theme]').forEach(button => button.addEventListener('click', () => { apply(); if (!picker.open) picker.showModal(); }));
    }
    suggestion = makeDialog(`<div class="site-theme-top"><p>APARIENCIA</p><button type="button" class="site-theme-close" aria-label="Mantener tema y cerrar">×</button></div><h2 id="site-theme-suggestion-title">Tu tema, a tu gusto</h2><p data-theme-mismatch></p><div class="site-theme-actions"><button type="button" class="theme-keep">Mantener tema actual</button><button type="button" class="theme-change">Cambiar tema</button></div>`);
    suggestion.classList.add('site-theme-suggestion');
    suggestion.setAttribute('aria-labelledby', 'site-theme-suggestion-title');
    suggestion.querySelector('.theme-change').addEventListener('click', () => {
      dismissed.add(mismatch());
      close(suggestion); apply();
      if (!picker.open) picker.showModal();
    });
    for (const button of suggestion.querySelectorAll('.theme-keep,.site-theme-close')) button.addEventListener('click', () => { rememberMismatch(); save(); close(suggestion); });
    apply(); schedulePrompt();
  }
  media.addEventListener('change', () => { if (mode === 'device') apply(true); schedulePrompt(); });
  window.addEventListener('focus', () => { mode = read(); apply(true); schedulePrompt(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
