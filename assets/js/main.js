document.getElementById("year").textContent = new Date().getFullYear();

const guideMenu = document.getElementById("guide-menu");
const openGuides = document.querySelector("[data-open-guides]");
const closeGuides = document.querySelector("[data-close-guides]");

if (guideMenu && openGuides && closeGuides) {
  openGuides.addEventListener("click", () => guideMenu.showModal());
  closeGuides.addEventListener("click", () => guideMenu.close());
  guideMenu.addEventListener("click", (event) => {
    if (event.target === guideMenu) guideMenu.close();
  });
}

const vlsmAnnouncement = document.getElementById("vlsm-announcement");
const closeVlsmButton = document.querySelector("[data-close-vlsm]");

// Cambiar data-announcement-enabled a "true" en el aviso para reactivarlo.
if (vlsmAnnouncement && closeVlsmButton && vlsmAnnouncement.dataset.announcementEnabled !== "false") {
  const announcementCookie = "dgnv_fiber_category5_seen";
  const announcementLifetime = 5 * 24 * 60 * 60; // Cinco días corridos (120 horas).
  const announcementCookiePath = new URL(".", location.href).pathname;
  let announcementUnlocked = false;
  const announcementLinks = [...vlsmAnnouncement.querySelectorAll('a[href]')];
  const guardAnnouncementLink = event => {
    if (!announcementUnlocked && event.target.closest('a[href]')) event.preventDefault();
  };
  vlsmAnnouncement.addEventListener('click', guardAnnouncementLink);
  vlsmAnnouncement.addEventListener('auxclick', guardAnnouncementLink);
  const announcementWasSeen = () => document.cookie.split(";").some(cookie => {
    const [name, value] = cookie.trim().split("=");
    return name === announcementCookie && Number(value) > Date.now();
  });
  const rememberAnnouncement = () => {
    const expires = new Date(Date.now() + announcementLifetime * 1000);
    document.cookie = `${announcementCookie}=${expires.getTime()}; Max-Age=${announcementLifetime}; Expires=${expires.toUTCString()}; Path=${announcementCookiePath}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  };

  const dismissVlsmAnnouncement = () => {
    if (!announcementUnlocked || !vlsmAnnouncement.open || vlsmAnnouncement.classList.contains("is-closing")) return;

    vlsmAnnouncement.classList.add("is-closing");
    const finishClosing = () => {
      window.clearTimeout(closeFallback);
      vlsmAnnouncement.classList.remove("is-closing");
      vlsmAnnouncement.close();
      vlsmAnnouncement.removeEventListener("animationend", closeAfterAnimation);
    };
    const closeAfterAnimation = event => {
      if (event.target === vlsmAnnouncement && event.animationName === "vlsm-announcement-out") finishClosing();
    };
    const closeFallback = window.setTimeout(finishClosing, 500);
    vlsmAnnouncement.addEventListener("animationend", closeAfterAnimation);
  };

  closeVlsmButton.addEventListener("click", dismissVlsmAnnouncement);
  vlsmAnnouncement.addEventListener("click", (event) => {
    if (event.target === vlsmAnnouncement) dismissVlsmAnnouncement();
  });
  vlsmAnnouncement.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismissVlsmAnnouncement();
  });

  const showVlsmAnnouncement = () => {
    // Comprobar también aquí por si otra pestaña ya mostró el aviso.
    if (announcementWasSeen()) return;
    if (afkScreen?.classList.contains("is-visible") || document.querySelector('dialog[open]:not(#vlsm-announcement)')) {
      window.setTimeout(showVlsmAnnouncement, 1000);
      return;
    }
    if (vlsmAnnouncement.open) return;
    announcementUnlocked = false;
    closeVlsmButton.disabled = true;
    closeVlsmButton.classList.add('announcement-countdown');
    closeVlsmButton.classList.remove('is-ready');
    closeVlsmButton.innerHTML = '<span class="announcement-countdown-digit" aria-hidden="true">3</span><span class="announcement-close-symbol" aria-hidden="true">×</span>';
    const digit = closeVlsmButton.querySelector('.announcement-countdown-digit');
    closeVlsmButton.setAttribute('aria-label', 'Cierre disponible en 3 segundos');
    announcementLinks.forEach(link => {
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
    });
    vlsmAnnouncement.showModal();
    [2, 1, 0].forEach((number, index) => window.setTimeout(() => {
      if (!vlsmAnnouncement.open) return;
      digit.textContent = String(number);
      closeVlsmButton.setAttribute('aria-label', `Cierre disponible en ${number} segundos`);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        digit.animate([{ opacity: .25, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, easing: 'ease-out' });
      }
    }, (index + 1) * 1000));
    window.setTimeout(() => {
      if (!vlsmAnnouncement.open) return;
      announcementUnlocked = true;
      closeVlsmButton.disabled = false;
      closeVlsmButton.classList.add('is-ready');
      closeVlsmButton.setAttribute('aria-label', 'Cerrar anuncio de Fibra óptica');
      announcementLinks.forEach(link => {
        link.removeAttribute('aria-disabled');
        link.removeAttribute('tabindex');
      });
      rememberAnnouncement();
    }, 3250);
  };

  if (!announcementWasSeen()) window.setTimeout(showVlsmAnnouncement, 10000);
}

const discordInvite = document.querySelector("[data-discord-invite]");

if (discordInvite) {
  window.setTimeout(() => {
    discordInvite.classList.add("is-icon-visible");
    discordInvite.setAttribute("aria-hidden", "false");
  }, 4000);

  window.setTimeout(() => discordInvite.classList.add("is-message-visible"), 8000);

  window.setTimeout(() => {
    discordInvite.classList.remove("is-icon-visible", "is-message-visible");
    discordInvite.setAttribute("aria-hidden", "true");
  }, 20000);
}

const afkScreen = document.getElementById("afk-screen");

if (afkScreen) {
  const idleDelay = 60000;
  const afkTrigger = document.getElementById("year");
  let idleTimer;
  let hideTimer;
  let showFrame;
  let ignoreActivityUntil = 0;

  const showAfkScreen = () => {
    if (document.querySelector('dialog[open]')) {
      idleTimer = window.setTimeout(showAfkScreen, 1000);
      return;
    }

    window.clearTimeout(hideTimer);
    window.cancelAnimationFrame(showFrame);
    afkScreen.hidden = false;
    showFrame = window.requestAnimationFrame(() => afkScreen.classList.add("is-visible"));
    afkScreen.setAttribute("aria-hidden", "false");
  };

  const hideAfkScreen = () => {
    window.clearTimeout(hideTimer);
    window.cancelAnimationFrame(showFrame);
    if (!afkScreen.classList.contains("is-visible")) return;
    afkScreen.classList.remove("is-visible");
    afkScreen.setAttribute("aria-hidden", "true");
    hideTimer = window.setTimeout(() => { afkScreen.hidden = true; }, 700);
  };

  const resetIdleTimer = () => {
    if (Date.now() < ignoreActivityUntil) return;
    window.clearTimeout(idleTimer);
    hideAfkScreen();
    idleTimer = window.setTimeout(showAfkScreen, idleDelay);
  };

  ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, resetIdleTimer, { passive: true });
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) resetIdleTimer(); });
  afkTrigger?.addEventListener("click", () => {
    window.clearTimeout(idleTimer);
    ignoreActivityUntil = Date.now() + 900;
    showAfkScreen();
  });
  resetIdleTimer();
}
