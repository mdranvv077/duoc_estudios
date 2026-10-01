let installed = false;
let dialog;
let returnFocus;
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function closeFigure() { dialog?.close(); }
function openFigure(link) {
  const figure = link.closest('figure');
  const original = figure?.querySelector('img');
  if (!original) return;
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'foa-lightbox';
    dialog.setAttribute('aria-labelledby', 'foa-figure-title');
    dialog.innerHTML = `<div class="foa-lightbox-bar"><strong id="foa-figure-title"></strong><div class="foa-lightbox-tools"><button type="button" data-foa-zoom aria-pressed="false">Ampliar</button><button type="button" data-foa-close aria-label="Cerrar figura">✕</button></div></div><div class="foa-lightbox-view" tabindex="0" role="region" aria-label="Figura ampliada"><img alt="" /></div>`;
    document.body.append(dialog);
    dialog.querySelector('[data-foa-close]').addEventListener('click', closeFigure);
    dialog.addEventListener('click', event => { if (event.target === dialog) closeFigure(); });
    dialog.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); });
    dialog.querySelector('[data-foa-zoom]').addEventListener('click', event => {
      const view = dialog.querySelector('.foa-lightbox-view');
      const zoomed = view.classList.toggle('is-zoomed');
      event.target.setAttribute('aria-pressed', String(zoomed));
      event.target.textContent = zoomed ? 'Ajustar' : 'Ampliar';
    });
  }
  returnFocus = link;
  dialog.querySelector('#foa-figure-title').textContent = original.alt;
  const img = dialog.querySelector('img');
  img.src = original.src;
  img.alt = original.alt;
  // At least twice the reading width, or the original resolution when larger.
  img.style.setProperty('--foa-zoom-width', Math.max(original.naturalWidth, original.clientWidth * 2, 900) + 'px');
  dialog.querySelector('.foa-lightbox-view').classList.remove('is-zoomed');
  dialog.querySelector('[data-foa-zoom]').setAttribute('aria-pressed','false');
  dialog.querySelector('[data-foa-zoom]').textContent = 'Ampliar';
  dialog.showModal();
}

function scrollToSection(hash) {
  if (!hash) return;
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (target && target.closest('[data-foa-reader]')) target.scrollIntoView({block:'start',behavior:'instant'});
}

export function initFoaReader() {
  if (!installed) {
    installed = true;
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const image = event.target.closest('[data-foa-image]');
      if (image) { event.preventDefault(); openFigure(image); return; }
      const anchor = event.target.closest('[data-foa-anchor]');
      if (anchor) { event.preventDefault(); history.replaceState({},'',anchor.href); scrollToSection(new URL(anchor.href).hash); }
    });
    document.addEventListener('input', event => {
      if (event.target.id !== 'foa-search') return;
      const words = normalize(event.target.value).trim().split(/\s+/).filter(Boolean);
      const cards = [...document.querySelectorAll('[data-foa-search]')];
      cards.forEach(card => { card.hidden = !words.every(word => normalize(card.dataset.foaSearch).includes(word)); });
      const count = cards.filter(card=>!card.hidden).length;
      document.querySelector('[data-foa-search-count]').textContent = `${count} ${count === 1 ? 'capítulo disponible' : 'capítulos disponibles'}`;
      document.querySelector('[data-foa-empty]').hidden = count > 0;
    });
  }
  if (dialog?.open) closeFigure();
  requestAnimationFrame(()=>scrollToSection(location.hash));
}
