import { InterfaceService } from "./services/interfaceService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const UI = new InterfaceService();
    await UI.loadInitialBooks();


  // Delegación de eventos para ver detalles
  document.addEventListener("click", (e) => {
    // 1) Si clicas en un filtro de edad (header o tags)
    const tag = e.target.closest(".age-tag");
    if (tag && tag.dataset.age) {
      const ageId = tag.dataset.age;
      UI.filterByAge(ageId);
      return;
    }

    // 2) Si clicas en una tarjeta -> ver detalle
    const card = e.target.closest(".book-card");
    if (card) {
      const bookId = card.dataset.id;
      UI.showBookDetail(bookId);
      return;
    }

    // 3) Botón volver a inicio
    if (e.target.id === "btn-home") {
      UI.showHome();
      return;
    }
  });

});
