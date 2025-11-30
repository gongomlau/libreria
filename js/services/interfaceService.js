import { renderBookDetail, renderBookList, bookCardComponent } from "../utilities/viewComponents.js";
import { AGE_RANGES } from "../data/rangoEdad.js"
import { fetchBooksBySubject, fetchWorkEditions, fetchWork, fetchAuthor } from "./openLibraryService.js";
import { getBestEdition, mapToBook,  } from "../mappers/mapToBook.js";

export class InterfaceService {
  constructor() {
    this.container = document.getElementById("app");
    this.currentBooks = [];
    this.renderAgeFilterMenu();
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
  async showBookDetail(id) {
    const book = this.currentBooks.find((b) => b.id === id);
    if (!book) return;

    renderBookDetail("app", book);
  }

  //-----------------------------------------------------------
  // MENU HEADER
  //-----------------------------------------------------------
  renderAgeFilterMenu() {
    const nav = document.getElementById("age-filter-menu");

    nav.innerHTML = AGE_RANGES.map(
      (r) =>
        `<span class="age-tag age-${r.id}" data-age="${r.id}">
              ${r.label}
          </span>`
    ).join("");
  }

  filterByAge(ageId) {
    const filtered = this.currentBooks.filter((b) =>
      b.ageRanges.includes(ageId)
    );
    renderBookList("app", filtered);
  }

  showHome() {
    renderBookList("app", this.currentBooks);
  }
}
