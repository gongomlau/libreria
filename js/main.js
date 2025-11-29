import { InterfaceService } from "./services/interfaceService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ui = new InterfaceService();

  await ui.loadInitialBooks(); // Carga inicial

  // Delegación de eventos para ver detalles
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".book-card");
    if (!card) return;

    const bookId = card.dataset.id;
    ui.showBookDetail(bookId);
  });
});
