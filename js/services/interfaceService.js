import { Book } from "../models/book.js";
import { renderBookDetail, renderBookList } from "../utilities/viewComponents.js";
import { AGE_RANGES } from "../data/rangoEdad.js"
import { fetchBooksBySubject, fetchWorkEditions, getCover } from "./openLibraryService.js";

// ----------------------------------------------------------
// Elegir la mejor edición (preferencia español)
// ----------------------------------------------------------
function getBestEdition(editions) {
    if (!editions.length) return null;
    const spanish = editions.find(ed =>
        ed.languages?.some(l => l.key === "/languages/spa")
    );
    return spanish || editions[0];
}

// ----------------------------------------------------------
// Convertir Work + Edition → Book
// ----------------------------------------------------------
function mapToBook(work, edition) {
    const coverId = edition?.covers?.[0] || work.covers?.[0] || null;

    const subjects = work.subjects ?? [];

    const ageRanges = getAgeRangesFromSubjects(subjects);

    return new Book({
        id: work.key.replace("/works/", ""),
        title: edition?.title || work.title,
        author: work?.authors?.[0]?.name || "Autor desconocido",
        coverSmall: getCover(coverId, "M"),
        coverLarge: getCover(coverId, "L"),
        description:
            edition?.description?.value ||
            edition?.description ||
            work.description?.value ||
            null,
        language: edition?.languages?.[0]?.key?.replace("/languages/", ""),
        pages: edition?.number_of_pages || null,
        subjects: work.subjects ?? [],
        ageRanges,
    });
}

// ----------------------------------------------------------
// Rango de edad
// ----------------------------------------------------------

export function getAgeRangesFromSubjects(subjects) {
  const result = [];

  for (const range of AGE_RANGES) {
    if (range.subjects.some((s) => subjects.includes(s))) {
      result.push({
        id: range.id,
        label: range.label,
        color: range.color,
      });
    }
  }

  return result;
}
export class InterfaceService {
    constructor() {
        this.containerId = "app";
        this.currentBooks = [];
    }
  
    // ----------------------------------------------------------
    // CARGA INICIAL
    // ----------------------------------------------------------
    async loadInitialBooks() {
            const allSubjects = AGE_RANGES.flatMap(r => r.subjects);
            const allBooks = [];

            for (const subject of allSubjects) {
                const works = await fetchBooksBySubject(subject, 10);

                for (const work of works) {
                    const editions = await fetchWorkEditions(work.key);
                    const bestEdition = getBestEdition(editions);
                    const book = mapToBook(work, bestEdition);
                    allBooks.push(book);
                }
            }

            this.currentBooks = allBooks;
            renderBookList(this.containerId, allBooks);
    }

    showBookDetail(id) {
        const book = this.currentBooks.find(b => b.id === id);
        if (!book) return;
        renderBookDetail(this.containerId, book);
    }
}
