import { getBooks } from "./services/interfaceService.js";
import {
  renderBookList,
  renderBookDetail,
} from "./utilities/viewComponents.js";

async function main() {
  try {
    const books = await getBooks("juvenile");
    renderBookList("app", books);

    document.getElementById("app").addEventListener("click", (e) => {
      const card = e.target.closest(".book-card");
      if (card) {
        const bookId = card.dataset.id;
        const book = books.find((b) => b.id === bookId);
        renderBookDetail("app", book);
      }
    });
  } catch (err) {
    console.error("Error en main:", err);
  }
}

main();
