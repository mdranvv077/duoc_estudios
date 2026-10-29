(() => {
  const dialog = document.getElementById('discord-confirm');
  if (!dialog) return;
  const accept = dialog.querySelector('[data-discord-accept]');
  let closingTimer;

  const close = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    const finish = () => {
      clearTimeout(closingTimer);
      dialog.close();
      dialog.classList.remove('is-closing');
      dialog.removeEventListener('animationend', onEnd);
    };
    const onEnd = event => {
      if (event.target === dialog && event.animationName === 'vlsm-announcement-out') finish();
    };
    dialog.addEventListener('animationend', onEnd);
    closingTimer = setTimeout(finish, 500);
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || dialog.contains(link)) return;
    const url = new URL(link.href);
    if (url.hostname !== 'discord.gg') return;
    event.preventDefault();
    accept.href = url.href;
    if (!dialog.open) dialog.showModal();
  });
  dialog.querySelectorAll('[data-discord-cancel]').forEach(button => button.addEventListener('click', close));
  accept.addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
})();
