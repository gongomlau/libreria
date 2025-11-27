
import { Book } from "../models/Book.js";

// ======================================================
//  URL base de la API de Open Library
// ======================================================

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";


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
// Utilidad para recoger la portada
// ======================================================

export function getCover(coverId, size) {
  if (!coverId) {
    return "./assets/default-cover.jpg"; // opcional
  }

  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

// ======================================================
// Transformar Work a Book
// ======================================================

export function mapToBook(data) {
    return new Book({
        id: data.key,
        title: data.title || "Título desconocido",
        author: data.authors?.[0]?.name || "Autor desconocido",
        subjects: data.subjects || [],
        coverSmall: data.covers
            ? getCover(data.covers[0], "S")
            : "./img/default-cover.jpg",
        coverLarge: data.covers
            ? getCover(data.covers[0], "L")
            : "./img/default-cover.jpg",
    });
}

// ======================================================
// Obtener libros por categoría
// ======================================================

export async function fetchBooksBySubject(categoria, limite = 20, offset = 0) {
    const url = `${BASE_URL}/subjects/${categoria}.json?limit=${limite}&offset=${offset}`;

    const json = await fetchJson(url);

    return json.works.map(mapToBook);
}

// ======================================================
// Buscar libros por titulo
// ======================================================

export async function searchBooks(frase, limite = 20) {
    const url = `${BASE_URL}/search.json?title=${encodeURIComponent(frase)}&limit=${limite}`;

    const json = await fetchJson(url);

    return json.works.map(mapToBook);
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

