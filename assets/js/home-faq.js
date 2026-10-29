(() => {
  const items = [...document.querySelectorAll('.home-faq details')];
  const states = new Map();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // Native exclusive groups close immediately; coordinate the closing animation here.
  items.forEach(item => item.removeAttribute('name'));

  function toggle(item, expanded) {
    const previous = states.get(item);
    const start = item.getBoundingClientRect().height;
    previous?.animation?.cancel();
    const state = { expanded, animation: null };
    states.set(item, state);
    item.style.height = '';
    item.style.overflow = 'hidden';
    item.open = true;
    const summary = item.querySelector('summary');
    const border = parseFloat(getComputedStyle(item).borderTopWidth) + parseFloat(getComputedStyle(item).borderBottomWidth);
    const end = expanded ? item.getBoundingClientRect().height : summary.getBoundingClientRect().height + border;
    const finish = () => {
      if (states.get(item) !== state) return;
      item.open = expanded;
      item.style.height = '';
      item.style.overflow = '';
      state.animation = null;
    };
    if (reducedMotion.matches) { finish(); return; }
    state.animation = item.animate(
      [{ height: `${start}px` }, { height: `${end}px` }],
      { duration: 320, easing: 'cubic-bezier(.22,.68,0,1)' }
    );
    state.animation.onfinish = finish;
  }

  items.forEach(item => {
    item.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      const expanded = !(states.get(item)?.expanded ?? item.open);
      if (expanded) items.forEach(other => {
        if (other !== item && (states.get(other)?.expanded ?? other.open)) toggle(other, false);
      });
      toggle(item, expanded);
    });
  });
})();
