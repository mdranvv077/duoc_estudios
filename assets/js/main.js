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

if (vlsmAnnouncement && closeVlsmButton) {
  const dismissVlsmAnnouncement = () => {
    if (!vlsmAnnouncement.open || vlsmAnnouncement.classList.contains("is-closing")) return;

    vlsmAnnouncement.classList.add("is-closing");
    vlsmAnnouncement.addEventListener("animationend", function closeAfterAnimation(event) {
      if (event.animationName !== "vlsm-announcement-out") return;
      vlsmAnnouncement.classList.remove("is-closing");
      vlsmAnnouncement.close();
      vlsmAnnouncement.removeEventListener("animationend", closeAfterAnimation);
    });
  };

  closeVlsmButton.addEventListener("click", dismissVlsmAnnouncement);
  vlsmAnnouncement.addEventListener("click", (event) => {
    if (event.target === vlsmAnnouncement) dismissVlsmAnnouncement();
  });
  vlsmAnnouncement.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismissVlsmAnnouncement();
  });

  window.setTimeout(() => {
    if (vlsmAnnouncement.open) return;
    vlsmAnnouncement.showModal();
    window.setTimeout(dismissVlsmAnnouncement, 10000);
  }, 10000);
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
