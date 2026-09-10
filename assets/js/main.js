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
