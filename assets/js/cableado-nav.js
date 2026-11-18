document.addEventListener('click', event => {
  const toggle = event.target.closest('[data-sidebar-toggle]');
  if (toggle) {
    const sidebar = document.querySelector('[data-guide-sidebar]');
    const open = sidebar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  }
});
