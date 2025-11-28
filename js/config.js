// ======================================================
//  URL base de la API de Open Library
// ======================================================

export const BASE_URL = "https://openlibrary.org";
export const COVERS_URL = "https://covers.openlibrary.org";



// ======================================================
// Función fetch genérica
// ======================================================

export async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener datos desde: ${url}`);
    }
    return await response.json();
}
