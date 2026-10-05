export const PROJECT_STATUS = Object.freeze({
  PUBLIC: "public",
  PRIVATE: "private",
});

export const projects = Object.freeze([
  {
    id: "esp32-s3-lab",
    number: "01",
    title: "ESP32-S3 · Linux, Python y panel web",
    description: "Pruebas con Linux y MicroPython, monitoreo del sistema y futuras integraciones con sensores.",
    status: PROJECT_STATUS.PUBLIC,
    href: "esp32-s3/index.html",
  },
  {
    id: "blank-project",
    number: "02",
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
