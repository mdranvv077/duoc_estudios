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
