import { projects, PROJECT_STATUS, statusLabels } from "./projects-data.js";

const SESSION_KEY = "dgnv-projects-admin";
const ADMIN_USER = "admin";
const PASSWORD_HASH = "afeb5f32520a0895c885a4b715bdb6f0bcfa8655bf5106818a149c5d551cb4e8";

const login = document.querySelector("[data-admin-login]");
const form = document.querySelector("[data-admin-form]");
const error = document.querySelector("[data-admin-error]");
const dashboard = document.querySelector("[data-admin-dashboard]");
const projectList = document.querySelector("[data-admin-projects]");

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function createAdminProject(project) {
  const article = document.createElement("article");
  article.className = "admin-project";

  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = project.number;

  const copy = document.createElement("span");
  copy.className = "admin-project-copy";
  const title = document.createElement("strong");
  title.textContent = project.title;
  const description = document.createElement("small");
  description.textContent = project.description;
  copy.append(title, description);

  const meta = document.createElement("span");
  meta.className = "admin-project-meta";
  const status = document.createElement("span");
  status.className = `project-status is-${project.status}`;
  status.textContent = statusLabels[project.status];
  const open = document.createElement("a");
  open.className = "admin-open-project";
  open.href = `../${project.href}`;
  open.textContent = "Abrir proyecto";
  meta.append(status, open);

  article.append(number, copy, meta);
  return article;
}

function count(status) {
  return projects.filter(project => project.status === status).length;
}

function showDashboard() {
  login.hidden = true;
  dashboard.hidden = false;
  projectList.replaceChildren(...projects.map(createAdminProject));
  document.querySelector("[data-count-public]").textContent = count(PROJECT_STATUS.PUBLIC);
  document.querySelector("[data-count-private]").textContent = count(PROJECT_STATUS.PRIVATE);
}

if (sessionStorage.getItem(SESSION_KEY) === "active") showDashboard();

form?.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(form);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const valid = username === ADMIN_USER && await sha256(password) === PASSWORD_HASH;

  if (!valid) {
    error.hidden = false;
    form.querySelector("input[name='password']").value = "";
    form.querySelector("input[name='password']").focus();
    return;
  }

  sessionStorage.setItem(SESSION_KEY, "active");
  error.hidden = true;
  showDashboard();
});

document.querySelector("[data-admin-logout]")?.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});
