// ======================================================
// --- Componente tarjeta de libro ---
// ======================================================

export function bookCardComponent(book) {
  return `
        <div class="book-card" data-id="${book.id}">
            <img src="${book.coverSmall}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
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
  div.innerHTML = `
        <div class="book-detail">
            <img src="${book.coverLarge}">
            <h2>${book.title}</h2>
            <h4>${book.author}</h4>
            <p>${book.description || "No hay descripción disponible."}</p>
        </div>
    `;
}
