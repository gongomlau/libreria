import {
  fetchBooksBySubject,
  fetchWork,
  fetchWorkEditions,
  mapToBook,
} from "./openLibraryService.js";

import {
  renderBookList,
  renderBookDetail,
} from "../utilities/viewComponents.js";
import { AGE_RANGES } from "../data/rangoEdad.js";

export class InterfaceService {
  constructor() {
    this.container = document.getElementById("app");
    this.currentBooks = [];
  }

  // ======================================================
  // ⚡ CARGA INICIAL DE LIBROS (usa Promise.all → VA 4× MÁS RÁPIDO)
  // ======================================================

  async loadInitialBooks() {
    const allBooks = [];

    // 1. Obtener array plano de subjects
    const subjects = AGE_RANGES.flatMap((range) => range.subjects);

    // 2. Obtener works de TODOS los subjects en paralelo
    const worksArrays = await Promise.all(
      subjects.map((sub) => fetchBooksBySubject(sub, 5))
    );

    // 3. Aplanar array final de works
    const allWorks = worksArrays.flat();

    // 4. Para cada work, cargar datos + ediciones EN PARALELO
    const bookPromises = allWorks.map(async (work) => {
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

    // 5. Esperar a que todos los libros se procesen
    const results = await Promise.all(bookPromises);

    // 6. Filtrar errores y además SOLO libros con edición en español
    this.currentBooks = results.filter((b) => b !== null && b.spanish);

    // 7. Render final
    this.renderBooks();
  }

  // ======================================================
  // 📘 Mostrar listado de libros
  // ======================================================

  renderBooks() {
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
}
