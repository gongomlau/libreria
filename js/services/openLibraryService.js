
import { BASE_URL,COVERS_URL,fetchJson } from "../config.js";



// ======================================================
// Obtener portada (tamaño: S, M, L)
// Si no hay portada, puede devolverte una imagen por defecto
// ======================================================

export function getCover(coverId, size) {
    if (!coverId || null) {
        return "../../img/default-cover.jpg"; // Ruta a una imagen por defecto
    }

    return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
    }

// ======================================================
// Obtener libros por categoría
// ======================================================

export async function fetchBooksBySubject(categoria, limite = 5, offset = 0) {
    const url = `${BASE_URL}/subjects/${categoria}.json?limit=${limite}&offset=${offset}`;

    const data = await fetchJson(url);

    return data.works;
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
// Autor de un libro (work ID)
// ======================================================

export async function fetchAuthor(authorKey) {
    const url = `${BASE_URL}${authorKey}.json`;
    const data = await fetchJson(url);
    return data.name;
}
