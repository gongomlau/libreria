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
}
