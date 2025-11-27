import { InterfaceService } from "./services/interfaceService.js";

const ui = new InterfaceService();

ui.loadInitialBooks().then(() => {
  ui.renderBooks();
});