import { test, expect, Page, BrowserContext } from "@playwright/test";
import { ChecklistPage } from "./../../pages/CheckList";
import { validateConfig } from "../../config/auth/ui/config";
import { AuthHelper } from "../../config/auth/ui/auth";
import checklists from "./../../data/checklist.json";
import { createBoardForSuite, deleteBoard } from "../../utils/api/base-helper";
import { createCardUtils } from "../../utils/api/card-helper";

// Combina checklists de JSON con un checklist manual
const allChecklists = [
  ...Object.entries(checklists).map(([key, data]) => ({
    id: key,
    title: data.title,
    item: data.item,
    description: data.description,
  })),
];

test.describe("Checklist Tests - Trello UI (Single Session)", () => {
  let context: BrowserContext;
  let page: Page;
  let checklistPage: ChecklistPage;
  let url_card: string;
  let board_id: string;

  test.beforeAll(async ({ browser }) => {
    validateConfig();
    context = await browser.newContext({
      storageState: "auth-state.json",
    });

    const board = await createBoardForSuite("Board de Prueba UI");
    board_id = board.boardId;
    const card = await createCardUtils(
      "Tarjeta de Prueba UI",
      board.todoListId
    );
    url_card = card.url;
    page = await context.newPage();
    checklistPage = new ChecklistPage(page);
  });

  test.afterAll(async () => {
    if (page) await page.close();
    if (context) await context.close();
    await deleteBoard(board_id);
    console.log("✅ Session cerrada");
  });

  test("Ejecutar todos los checklists en un solo flujo", async () => {
    for (const checklistCase of allChecklists) {
      console.log(
        `\n🧩 Testing checklist-----------------: ${checklistCase.title}`
      );
      console.log(`📌 Card URL: ${url_card}`);

      await test.step("Ir a la tarjeta", async () => {
        await checklistPage.gotoCard(url_card);
      });

      await test.step("Crear checklist", async () => {
        await checklistPage.createChecklist(checklistCase.title);
      });

      await test.step("Agregar ítem", async () => {
        await checklistPage.addChecklistItem(checklistCase.item);
      });

      await test.step("Validar checklist visible", async () => {
        await checklistPage.validateChecklistExists(checklistCase.title);
      });

      await test.step("Marcar ítem como completado", async () => {
        await checklistPage.toggleChecklistItem(checklistCase.item);
      });

      await test.step("Validar ítem completado", async () => {
        await checklistPage.validateItemCompleted(checklistCase.item);
      });

      await test.step("Eliminar checklist", async () => {
        await checklistPage.deleteChecklist(checklistCase.title);
      });

      console.log(
        `✅ Checklist completado correctamente: ${checklistCase.title}`
      );
    }
  });
});
