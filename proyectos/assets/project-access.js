import { projects, PROJECT_STATUS } from "./projects-data.js";

const projectId = document.body.dataset.projectId;
const project = projects.find(item => item.id === projectId);
const isAdmin = sessionStorage.getItem("dgnv-projects-admin") === "active";
const canOpen = project?.status === PROJECT_STATUS.PUBLIC || isAdmin;

if (canOpen) {
  document.body.hidden = false;
} else {
  location.replace("../index.html");
}
