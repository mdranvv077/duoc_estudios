(() => {
  const targets = [
    ['.home-page .site-header', 0],
    ['.home-page .hero > .eyebrow', .08],
    ['.home-page .hero > h1', .16],
    ['.home-page .hero-copy', .26],
    ['.home-page .hero-actions', .36],
    ['.home-page .terminal-preview', .48],
  ];
  // Una sola comprobación inicial: no se activan entradas al hacer scroll.
  const entries = targets.map(([selector, delay]) => {
    const element = document.querySelector(selector);
    const rect = element?.getBoundingClientRect();
    return { element, delay, visible: rect && rect.top < innerHeight && rect.bottom > 0 };
  });
  entries.forEach(({ element, delay, visible }) => {
    if (!element) return;
    if (visible) {
      element.style.setProperty('--entry-delay', `${delay}s`);
      element.classList.add('home-entry-visible');
    } else element.classList.add('home-entry-static');
  });
})();
