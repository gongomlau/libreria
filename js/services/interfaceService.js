import { renderBookDetail, renderBookList, bookCardComponent,renderAgeFilterMenu,renderChart,renderStats } from "../utilities/viewComponents.js";
import { AGE_RANGES } from "../data/rangoEdad.js"
import { fetchBooksBySubject, fetchWorkEditions, fetchWork, fetchAuthor } from "./openLibraryService.js";
import { getBestEdition, mapToBook,  } from "../mappers/mapToBook.js";

export class InterfaceService {
  constructor() {
    this.currentBooks = [];

    // Render menú dinámico de edades
    renderAgeFilterMenu("age-filter-menu",);
  }

  // ----------------------------------------------------------
  // CARGA INICIAL
  // ----------------------------------------------------------
  async loadInitialBooks() {
    const subjects = AGE_RANGES.flatMap((r) => r.subjects);

    for (const subject of subjects) {
      const works = await fetchBooksBySubject(subject, 5);

      for (const w of works) {
        try {
          const workData = await fetchWork(w.key);
          const editions = await fetchWorkEditions(w.key, 10);
          const bestEdition = getBestEdition(editions);
          // autor
          const authorKey =
            bestEdition?.authors?.[0]?.key ||
            workData.authors?.[0]?.author?.key;
          const author = authorKey
            ? await fetchAuthor(authorKey)
            : "Autor desconocido";
          // mapear a book
          const book = mapToBook(workData, bestEdition, author, subject);

          // evitar duplicados
          if (!this.currentBooks.some((b) => b.id === book.id)) {
            this.currentBooks.push(book);
            renderBookList("app", this.currentBooks);
          }
        } catch (err) {
          console.warn("Error procesando work", w.key, err);
        }
      }
    }
    this.updateStatsView(this.currentBooks);
  }

  //-----------------------------------------------------------
  // AÑADIR UN LIBRO AL LISTADO
  //-----------------------------------------------------------
  appendBookToList(book) {
    const html = bookCardComponent(book);
    this.container.insertAdjacentHTML("beforeend", html);
  }

  //-----------------------------------------------------------
  // MOSTRAR DETALLE DE LIBRO
  //-----------------------------------------------------------
  showBookDetail(id) {
    const book = this.currentBooks.find((b) => b.id === id);
    if (!book) return;

    renderBookDetail("app", book);
  }
  //-----------------------------------------------------------
  // FLTRO POR EDAD
  //-----------------------------------------------------------
  filterByAge(ageId) {
    const filtered = this.currentBooks.filter((b) =>
      b.ageRanges.includes(ageId)
    );
    renderBookList("app", filtered);
  }
  //-----------------------------------------------------------
  // VOLVER A INICIO
  //-----------------------------------------------------------
  showHome() {
    renderBookList("app", this.currentBooks);
    this.updateStasView(this.currentBooks);
  }

  //======================================================
  //     ESTADÍSTICAS (TEXTO + GRÁFICO)
  //======================================================
  updateStatsView(bookList) {
    const stats = AGE_RANGES.map((r) => ({
      id: r.id,
      label: r.label,
      count: bookList.filter((b) => b.ageRanges.includes(r.id)).length,
    }));

    renderStats("stats", bookList, stats);

    renderChart("ageChart", stats);
  }
}
