(() => {
  const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  document.querySelectorAll('.home-page .guide-section .guide-card').forEach(card => {
    let frame = 0;
    let x = 0;
    let y = 0;
    card.addEventListener('pointermove', event => {
      if (!enabled.matches) return;
      const bounds = card.getBoundingClientRect();
      x = event.clientX - bounds.left;
      y = event.clientY - bounds.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--card-glow-x', `${x}px`);
        card.style.setProperty('--card-glow-y', `${y}px`);
        frame = 0;
      });
    });
  });
})();
