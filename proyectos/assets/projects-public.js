import { projects, PROJECT_STATUS } from "./projects-data.js";

const list = document.querySelector("[data-project-list]");
const empty = document.querySelector("[data-project-empty]");
const publicProjects = projects.filter(project => project.status === PROJECT_STATUS.PUBLIC);

function createProjectButton(project) {
  const link = document.createElement("a");
  link.className = "project-button";
  link.href = project.href;

  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = project.number;

  const name = document.createElement("span");
  name.className = "project-name";
  const title = document.createElement("strong");
  title.textContent = project.title;
  const description = document.createElement("small");
  description.textContent = project.description;
  name.append(title, description);

  const arrow = document.createElement("span");
  arrow.className = "project-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";

  link.append(number, name, arrow);
  return link;
}

if (list && empty) {
  list.replaceChildren(...publicProjects.map(createProjectButton));
  empty.hidden = publicProjects.length > 0;
}
