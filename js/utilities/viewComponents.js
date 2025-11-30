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
