import { Book } from "../models/book.js";
import { COVERS_URL, BASE_URL } from "../config.js";
import {
  fetchBooksBySubject,
  fetchWork,
  fetchWorkEditions,
  fetchAuthor,
  getCover,
} from "./openLibraryService.js";

// ======================================================
// Transformar Work a Book
// ======================================================

async function mapToBook(work) {
    if (!work) return null;
    // ID del work
    const workId = work.key.split("/").pop();

    // Cargar ediciones y autor en paralelo
    const editionsPromise = fetchWorkEditions(workId);
    const authorPromise = work.authors?.length
      ? fetchAuthor(work.authors[0].key)
      : Promise.resolve("Desconocido");
    const workPromise = fetchWork(workId);

    const [editions, authorName, workData] = await Promise.all([
      editionsPromise,
      authorPromise,
      workPromise,
    ]);
    // Filtrar ediciones en español  
    const spanishEdition = editions.find(ed =>
      ed.languages?.some(lang => lang.key === "/languages/spa")
    );
    if (!spanishEdition) return null;
    
    const coverId = spanishEdition.covers?.[0];
    
    return new Book({
      id: workId,
      title: spanishEdition.title,
      author: authorName,
      subjects: work.subject ? work.subject.slice(0, 5) : [],
      language: "Spanish",
      coverSmall: coverId ? getCover(coverId, "M") : null,
      coverLarge: coverId ? getCover(coverId, "L") : null,

      description: workData.description?.value || workData.description || null,
      pageCount: spanishEdition.pageCount,
    });
}


export async function getBooks(subject) {
  const works = await fetchBooksBySubject(subject);
  const books = await Promise.all(works.map(mapToBook));
  return books.filter(b => b !== null);
}
/*
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

  // ======================================================
  // ⚡ CARGA INICIAL DE LIBROS (usa Promise.all → VA 4× MÁS RÁPIDO)
  // ======================================================

  async loadInitialBooks() {
    try {
      // 1. Definir único subject
      const subject = "children";

      // 2. Obtener works del subject
      const works = await fetchBooksBySubject(subject, 10, 0);

      // 3. Para cada work, cargar datos + ediciones EN PARALELO
      const bookPromises = works.map(async (work) => {
        try {
          const workId = work.key.replace("/works/", "");

          const [workData, editionsData] = await Promise.all([
            fetchWork(workId),
            fetchWorkEditions(workId),
          ]);

          return mapToBook(workData, editionsData);
        } catch (err) {
          console.warn("Error procesando work:", work.key, err);
          return null;
        }
      });

      // 4. Esperar a que todos los libros se procesen
      const results = await Promise.all(bookPromises);
      

      // 5. Filtrar errores y además SOLO libros con edición en español
      this.currentBooks = results.filter(
        (b) => b !== null && b.language === "/languages/spa"
      );

      console.log("Libros cargados:", this.currentBooks);
      // 6. Render final
      this.renderBooks();

    } catch (error) {
      console.error("Error en loadInitialBooks:", error);
    }
  }

  // ======================================================
  // 📘 Mostrar listado de libros
  // ======================================================

  async renderBooks() {
    renderBookList("app", this.currentBooks);
  }

  // ======================================================
  // 📖 Mostrar detalle de un libro
  // ======================================================

  async showBookDetail(workKey) {
    const book = this.currentBooks.find((b) => b.key === workKey);
    if (!book) return;

    renderBookDetail("app", book);
  }
}*/
