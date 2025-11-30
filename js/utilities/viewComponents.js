import { AGE_RANGES } from "../data/rangoEdad.js";
// ======================================================
// UTILIDAD: Generar etiquetas de rango de edad
// ======================================================

function renderAgeTags(book) {
  return book.ageRanges
    .map((id) => {
      const range = AGE_RANGES.find((r) => r.id === id);
      return `<span class="age-tag age-${id}">${range.label}</span>`;
    })
    .join("");
}


// ======================================================
// --- Componente tarjeta de libro ---
// ======================================================

export function bookCardComponent(book) {
  return `
        <div class="book-card" data-id="${book.id}">
            <img src="${book.coverSmall}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <div class="age-tags">${renderAgeTags(book)}</div>
        </div>
    `;
}

// ======================================================
// --- Lista de libros ---
// ======================================================

export function renderBookList(app, books) {
  const div = document.getElementById(app);
  if (!div) {
    console.error(`No se encontró el contenedor con id="${app}"`);
    return;
  }
  div.innerHTML = books.map(bookCardComponent).join("");
}

// ======================================================
// --- Detalle de libro ---
// ======================================================

export function renderBookDetail(app, book) {
  const div = document.getElementById(app);
  if (!div) {
    console.error(`No se encontró el contenedor con id="${app}"`);
    return;
  }

  div.innerHTML = `
        <div class="book-detail">
            <img src="${book.coverLarge}" alt="Cover of ${book.title}">
            <h2>${book.title}</h2>
            <h4>${book.author}</h4>
            <p> Páginas: ${book.pages}</p>
            <p>${book.description || "No hay descripción disponible."}</p>

            <h5>Edad recomendada</h5>
            <div class="age-tags">${renderAgeTags(book)}</div>
        </div>
    `;
}

// ======================================================
// --- Menu de edades ---
// ======================================================

export function renderAgeFilterMenu(containerId) {
  const nav = document.getElementById(containerId);
  nav.innerHTML = AGE_RANGES.map(
      (r) => `
        <span class="age-tag age-${r.id}" data-age="${r.id}">
            ${r.label}
        </span>
    `
    )
    .join("");
}

// ======================================================
//   ESTADÍSTICAS TEXTO
//   ======================================================
export function renderStats(containerId, books, stats) {
  const div = document.getElementById(containerId);
  const total = books.length;

  div.innerHTML = `
        <p><strong>Total de libros mostrados:</strong> ${total}</p>
            `;
}

// ======================================================
//   GRÁFICO (CHART.JS)
//   ====================================================== 
let chartInstance = null;

export function renderChart(canvasId, stats) {
  const ctx = document.getElementById(canvasId);

  if (chartInstance) chartInstance.destroy();
  
  // Colores según criterios (según tus clases CSS)
  const colorMap = {
    "0-6": "#ffffff",
    "6-8": "#4CAF50",
    "8-12": "#2196F3",
    "12-17": "#FF9800",
  };

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: stats.map((s) => s.label),
      datasets: [
        {
          label: "Libros por rango de edad",
          data: stats.map((s) => s.count),
          backgroundColor: stats.map((s) => colorMap[s.id]),
          borderColor: stats.map((s) => colorMap[s.id]),
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        legend: {
          labels: {
            color: "#fff", // texto de leyenda en blanco
          },
        },
      },
    },
  });
}
