import { InterfaceService } from "./services/interfaceService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const UI = new InterfaceService();
    await UI.loadInitialBooks();


  // Delegación de eventos para ver detalles
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".book-card");
    if (!card) return;

    const bookId = card.dataset.id;
    UI.showBookDetail(bookId);
  });
});
