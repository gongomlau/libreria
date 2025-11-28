
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
// Obtener portada (tamaño: S, M, L)
// Si no hay portada, puede devolverte una imagen por defecto
// ======================================================

export function getCover(coverId, size) {
    if (!coverId) {
        return "./img/default-cover.jpg"; // Ruta a una imagen por defecto
    }

    return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
    }

// ======================================================
// Obtener libros por categoría
// ======================================================

export async function fetchBooksBySubject(categoria, limite = 5, offset = 0) {
    const url = `${BASE_URL}/subjects/${categoria}.json?limit=${limite}&offset=${offset}`;

    const json = await fetchJson(url);

    return json.works;
}

// ======================================================
// Obtener información detallada de un libro según su ID (work ID)
// ======================================================

export async function fetchWork(workId) {
    const cleanId = workId.replace("/works/", "");
    const url = `${BASE_URL}/works/${cleanId}.json`;

    return await fetchJson(url);
}

// ======================================================
// Ediciones de un libro (work ID)
// ======================================================

export async function fetchWorkEditions(workId, limit = 200) {
    const cleanId = workId.replace("/works/", "");
    const url = `${BASE_URL}/works/${cleanId}/editions.json?limit=${limit}`;
    const data = await fetchJson(url);
    return data.entries;
}

// ======================================================
// Transformar Work a Book
// ======================================================

export function mapToBook(work, editions = []) {
    if (!work) return null;

    // 1. Elegir mejor edición (español → fallback a primera)
    const best = editions.find(ed => 
        ed.languages?.some(l => l.key === "/languages/spa")
    ) || editions[0];

    // 2. ID real del work
    const id = work.key.replace("/works/", "");

    // 3. Título
    const title = best?.title || work.title || "Título desconocido";

    // 4. Autor
    const author = best?.author.name || work?.author.name || "Autor desconocido";

    // 5. Descripción
    const description =
        (typeof best?.description === "string" ? best.description : best?.description?.value) ||
        (typeof work.description === "string" ? work.description : work?.description?.value) ||
        null;

    // 6. Portadas
    const coverId = best?.covers?.[0] || work.covers?.[0] || null;
    const coverSmall = coverId ? getCover(coverId, "M") : null;
    const coverLarge = coverId ? getCover(coverId, "L") : null;

    // 7. Idioma
    const language = best?.languages?.[0]?.key || null;

    // 8. Nº de páginas (si existe)
    const pageCount =
        best?.number_of_pages ||
        best?.pagination ||
        null;

    return new Book({
        id,
        title,
        author,
        subjects: work.subjects || [],
        coverSmall,
        coverLarge,
        language,
        description,
        pageCount
    });
}


