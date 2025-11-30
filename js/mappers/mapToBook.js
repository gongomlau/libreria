import { getCover } from "../services/openLibraryService.js";
import { Book } from "../models/Book.js";
import { AGE_RANGES } from "../data/rangoEdad.js";

// ----------------------------------------------------------
// Elegir la mejor edición (preferencia español)
// ----------------------------------------------------------
export function getBestEdition(editions) {
  if (!editions.length) return null;

  const spanish = editions.find((e) =>
    e.languages?.some((l) => l.key === "/languages/spa")
  );

  return spanish || editions[0];
}


// ----------------------------------------------------------
// Convertir Work + Edition → Book
// ----------------------------------------------------------

export function mapToBook(work, bestEdition, authorName, subjectUsed) {

    const workSubjects = work.subjects || [];

    // 1. Edades derivadas del subject usado en la búsqueda
    const agesFromSearch = AGE_RANGES.filter((r) =>
      r.subjects.includes(subjectUsed)
    ).map((r) => r.id);

    // 2. Edades derivadas de los subjects reales del work
    const agesFromWork = AGE_RANGES.filter((r) =>
      r.subjects.some((s) => workSubjects.includes(s))
    ).map((r) => r.id);

    // 3. Unificación sin duplicados
    const ageRanges = [...new Set([...agesFromSearch, ...agesFromWork])];

    const coverId = bestEdition?.covers?.[0] || work.covers?.[0] || null;
    const ranges = AGE_RANGES.filter((r) => r.subjects.includes(subjectUsed));
    const recommendedAges = ranges.map((r) => r.id);
    
    return new Book({
      id: work.key.replace("/works/", ""),
      title: bestEdition?.title || work.title || "Título desconocido",
      author: authorName,
      subjects: work.subjects || bestEdition?.subjects || [],
      coverSmall: getCover(coverId, "M"),
      coverLarge: getCover(coverId, "L"),
      description:
        bestEdition?.description?.value ||
        bestEdition?.description ||
        work.description?.value ||
        work.description ||
        null,
      language: bestEdition?.languages?.[0]?.key || null,
      pages: bestEdition?.number_of_pages || null,
      ageRanges,
    });
    
}
