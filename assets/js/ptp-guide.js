(() => {
  const categories = [
  {
    "key": "preparacion",
    "label": "Inicio y recursos",
    "modules": [
      [
        "index.html",
        "Herramientas y descargas"
      ],
      [
        "recorrido.html",
        "Cómo trabajaremos"
      ]
    ]
  },
  {
    "key": "fundamentos",
    "label": "Fundamentos de PtP",
    "modules": [
      [
        "index.html",
        "Qué es un enlace PtP"
      ],
      [
        "fresnel.html",
        "Visibilidad y zona de Fresnel"
      ]
    ]
  },
  {
    "key": "parametros",
    "label": "Parámetros del enlace",
    "modules": [
      [
        "index.html",
        "Coordenadas y alturas"
      ],
      [
        "radio.html",
        "Frecuencia, potencia y antenas"
      ],
      [
        "presupuesto.html",
        "Señal, ruido y margen"
      ]
    ]
  },
  {
    "key": "taller",
    "label": "Taller con las tres herramientas",
    "modules": [
      [
        "index.html",
        "Preparar el caso de estudio"
      ],
      [
        "ubiquiti.html",
        "Seleccionar equipos Ubiquiti"
      ],
      [
        "google-earth.html",
        "Trazar en Google Earth Pro"
      ],
      [
        "radio-mobile.html",
        "Evaluar con Radio Mobile"
      ],
      [
        "google-earth-final.html",
        "Visualizar el resultado en Earth Pro"
      ],
      [
        "comparacion.html",
        "Integrar y justificar el diseño"
      ]
    ]
  },
  {
    "key": "radio-mobile",
    "label": "Radio Mobile paso a paso",
    "modules": [["index.html","Importar desde Google Earth Pro"],["terreno.html","Corregir la elevación del terreno"],["parameters.html","Parámetros · configuración del caso"],["topology.html","Topología · estrella Master/Slave"],["sistema.html","Systems · perfiles de equipo"],["membership.html","Membership · unidades y roles"]]
  },
  {
    "key": "resultados",
    "label": "Resultados y guardado",
    "modules": [["index.html","Radio Link y exportación"],["guardar.html","Guardar y retomar el proyecto"]]
  }
];
  const chapters = [
    { number: "01", label: "Teoría y fundamentos", keys: ["preparacion", "fundamentos", "parametros"] },
    { number: "02", label: "Práctica y factibilidad", keys: ["taller", "radio-mobile", "resultados"] },
  ];
  const root = new URL("../../guias/enlaces-ptp/", document.currentScript.src);
  const relativePath = location.pathname.slice(root.pathname.length);
  const category = categories.find(item => relativePath.startsWith(item.key + "/"));
  const sidebar = document.querySelector("[data-guide-sidebar]");
  if (sidebar && category) {
    const chapter = chapters.find(item => item.keys.includes(category.key));
    const categoryNavigation = sidebar.querySelector(".sidebar-categories");
    categoryNavigation.setAttribute("aria-label", "Capítulos y categorías de Enlaces PtP");
    categoryNavigation.innerHTML = chapters.map(item =>
      '<span class="sidebar-episode-label">Capítulo ' + item.number + ' · ' + item.label + '</span>' +
      item.keys.map((key, index) => {
        const entry = categories.find(candidate => candidate.key === key);
        return '<a class="sidebar-category ' + (entry === category ? 'active' : '') + '" href="' + new URL(entry.key + "/index.html", root).href + '"><span>' + String(index + 1).padStart(2, "0") + '</span><b>' + entry.label + '</b><i aria-hidden="true">↗</i></a>';
      }).join("")
    ).join("");
    sidebar.querySelector(".sidebar-brand small").textContent = "Enlaces PtP · Capítulo " + chapter.number;
    const file = location.pathname.split("/").pop() || "index.html";
    sidebar.querySelector(".lesson-nav").innerHTML = category.modules.map(([name, label], index) =>
      '<a class="' + (name === file ? 'active' : '') + '" href="' + name + '"><span>' + String(index + 1).padStart(2, "0") + '</span>' + label + '</a>'
    ).join("");
    document.querySelector("[data-sidebar-toggle]")?.addEventListener("click", event => {
      const open = sidebar.classList.toggle("is-open");
      event.currentTarget.setAttribute("aria-expanded", String(open));
    });
  }

  async function prepareDownloads() {
    const container = document.querySelector("[data-ptp-resources]");
    if (!container) return;
    const status = document.querySelector("[data-ptp-download-status]");
    try {
      const catalogUrl = new URL("archivos/catalogo.json", root);
      const response = await fetch(catalogUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("catalog");
      const catalog = await response.json();
      const downloadBase = new URL(catalog.downloadBase);
      if (downloadBase.protocol !== "https:" || downloadBase.hostname !== "raw.githubusercontent.com") throw new Error("source");
      await Promise.all(catalog.tools.map(async tool => {
        const card = [...container.querySelectorAll("[data-ptp-tool]")].find(item => item.dataset.ptpTool === tool.id);
        if (!card || !tool.file) return;
        // Only files inside the tool's dedicated directory may become download links.
        if (typeof tool.file !== "string" || !tool.file.startsWith(tool.id + "/") ||
            tool.file.includes("\\") || tool.file.split("/").some(part => !part || part === "." || part === "..")) return;
        const safePath = tool.file.split("/").map(encodeURIComponent).join("/");
        const localUrl = new URL(safePath, catalogUrl);
        const available = await fetch(localUrl, { method: "HEAD", cache: "no-cache" });
        if (!available.ok) {
          card.querySelector("[data-ptp-meta]").textContent = "El archivo registrado aún no está disponible. Puedes usar el sitio oficial.";
          return;
        }
        const link = card.querySelector("[data-ptp-download]");
        link.href = new URL(safePath, downloadBase).href;
        link.setAttribute("download", tool.file.split("/").pop());
        link.setAttribute("aria-label", "Descargar " + card.querySelector("h3").textContent + " desde GitHub");
        link.hidden = false;
        card.querySelector("[data-ptp-pending]").hidden = true;
        card.querySelector("[data-ptp-meta]").textContent = [
          tool.version ? "Versión: " + tool.version : "Versión no indicada",
          tool.size || "",
          tool.date ? "Archivo incorporado: " + tool.date : "",
        ].filter(Boolean).join(" · ");
      }));
    } catch {
      status.textContent = "No se pudo comprobar el catálogo de descargas. Puedes utilizar los enlaces oficiales disponibles debajo de cada herramienta.";
    }
  }
  prepareDownloads();
})();
