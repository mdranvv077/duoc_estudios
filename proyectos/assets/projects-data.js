export const PROJECT_STATUS = Object.freeze({
  PUBLIC: "public",
  PRIVATE: "private",
});

export const projects = Object.freeze([
  {
    id: "blank-project",
    number: "01",
    title: "Proyecto en blanco",
    description: "Espacio reservado para la primera idea compartida.",
    status: PROJECT_STATUS.PRIVATE,
    href: "proyecto-en-blanco/index.html",
  },
]);

export const statusLabels = Object.freeze({
  [PROJECT_STATUS.PUBLIC]: "Público",
  [PROJECT_STATUS.PRIVATE]: "No público",
});
