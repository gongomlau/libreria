
import { Book } from "../models/Book.js";

// ======================================================
//  URL base de la API de Open Library
// ======================================================

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";


// ======================================================
// Obtener libros por categoría
// ======================================================

export async function fetchBooksBySubject(categoria, limite = 50, offset = 0) {
    const url = `${BASE_URL}/subjects/${categoria}.json?limit=${limite}&offset=${offset}`;

    const json = await fetchJson(url);

    return json.works.map((work) => mapToBook(work));
}

// ======================================================
// Buscar libros por titulo
// ======================================================

export async function searchBooks(frase, limite = 50) {
    const url = `${BASE_URL}/search.json?title=${encodeURIComponent(frase)}&limit=${limite}`;

    const json = await fetchJson(url);

    return json.works.map((work) => mapToBook(work));
}

// ======================================================
// Obtener información detallada de un libro según su ID (work ID)
// ======================================================

export async function fetchBookById(workId) {
    const url = `${BASE_URL}${workId}.json`;

    const data = await fetchJson(url);

    return mapToBook(data);
}

// ======================================================
// Obtener información del autor
// ======================================================

export async function fetchAuthor(authorId) {
    const url = `${BASE_URL}${authorId}.json`;

    return await fetchJson(url);
}
// ======================================================
// Obtener portada (tamaño: S, M, L)
// Si no hay portada, puede devolverte una imagen por defecto
// ======================================================

export function getCoverImage(coverId, size) {
    if (!coverId) {
    return "./assets/default-cover.jpg"; // opcional
    }

    return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

// ======================================================
// Función fetch genérica
// ======================================================

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener datos desde: ${url}`);
    }
    return await response.json();
}

// ======================================================
// Función mapeo de datos a Book
// ======================================================

export function mapToBook(data) {
    return new Book(
        data.key,
        data.title,
        data.authors?.[0]?.name || "Autor desconocido",
        data.covers?.length
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : "./img/no-cover.png",
        data.subjects || []
    );
}