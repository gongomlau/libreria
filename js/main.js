import { fetchBooksBySubject } from "./services/openLibraryService.js";
import { AGE_RANGES } from "./data/rangoEdad.js";

// ================================
// Elementos del DOM
// ================================
const booksContainer = document.getElementById("books-container");

// ================================
// Función para formatear libros
// ================================
function renderBooks(books) {
    booksContainer.innerHTML = ""; // limpiar

    books.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <img src="${book.cover}" class="book-cover" alt="Portada">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
        `;

        booksContainer.appendChild(card);
    });
}

// ================================
// 3. Cargar libros por defecto (todas las edades)
// ================================

export async function loadDefaultBooks() {
    try {
        // 1. Obtener un array plano con todos los subjects
        const allSubjects = AGE_RANGES.flatMap((range) => range.subjects);

        // 2. Crear un array de promesas para cada subject
        const subjectPromises = allSubjects.map(
            (subject) => fetchBooksBySubject(subject, 20)
        );

        // 3. Esperar a que todas las llamadas terminen
        const results = await Promise.all(subjectPromises);

        // 4. Unir todos los arrays en uno solo
        const allBooks = results.flat();

        // 5. Pintar los libros
        renderBooks(allBooks);
    } catch (error) {
        console.error("Error cargando los libros iniciales:", error);
    }
}

// ================================
// 4. Inicialización
// ================================
document.addEventListener("DOMContentLoaded", () => {
    loadDefaultBooks();
});