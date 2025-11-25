// ======================================================
// 1. URL base de la API de Open Library
// ======================================================

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";

// ======================================================
// 2. Constante que relaciona edades con subjects
// ======================================================

const AGE_SUBJECTS = {
    "0-6": ["picture_books", "children_stories"],
    "6-8": ["children", "children_fiction"],
    "8-12": ["juvenile_fiction", "juvenile_literature"],
    "12-17": ["young_adult", "young_adult_fiction"],
};

// ======================================================
// 3. Construir la URL generica para la categoría pasada por parametro
// ======================================================

function buildUrlBySubject(subject, limit = 50) {
    return `${BASE_URL}/subjects/${subject}.json?limit=${limit}`;
}

// ======================================================
// 4. Función genérica que hace la petición a Open Library
// ======================================================

async function fetchBooksBySubject(subject, limit = 50) {
    const url = buildUrlBySubject(subject, limit);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Error al obtener datos de Open Library: ${response.status}`
        );
    }

    const data = await response.json();
    return data.works || [];
}

// ======================================================
// 5. Función principal: obtener libros según la edad
// ======================================================

export async function getBooksByAge(ageRange, limit = 50) {
    const subjects = AGE_SUBJECTS[ageRange];

    if (!subjects) {
        throw new Error(`No hay subjects definidos para la edad: ${ageRange}`);
    }

    // Hacemos fetch de todos los subjects asociados a esa edad
    const results = await Promise.all(
        subjects.map((subject) => fetchBooksBySubject(subject, limit))
    );

    // Unir todos los resultados en un solo array
    const books = results.flat();

    return books;
}

// ======================================================
// 6. Función opcional: obtener *todos* los libros de todas las edades
// ======================================================

export async function getAllYouthBooks(limit = 50) {
    const allAges = Object.keys(AGE_SUBJECTS);

    const results = await Promise.all(
        allAges.map((age) => getBooksByAge(age, limit))
    );

    return results.flat();
}
