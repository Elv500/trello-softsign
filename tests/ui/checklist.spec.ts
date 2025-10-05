import { test, expect, Page, BrowserContext } from "@playwright/test";
import { ChecklistPage } from "./../../pages/CheckList";
import { validateConfig } from "../../config/auth/ui/config";
import { createBoardForSuite, deleteBoard } from "../../utils/api/board-helper";
import { createCardUtils } from "../../utils/api/card-helper";

test.describe("Checklist Tests - Trello UI (Independent Test Cases with Separate Cards)", () => {
  let context: BrowserContext;
  let page: Page;
  let checklistPage: ChecklistPage;
  let board_id: string;
  let  list_id: string;
  test.beforeAll(async ({ browser }) => {
    validateConfig();

    context = await browser.newContext({
      storageState: "auth-state.json",
    });
    const board = await createBoardForSuite('tests board checklist')
    board_id = board.boardId;
    list_id = board.todoListId
    page = await context.newPage();
    checklistPage = new ChecklistPage(page);
  });

  test.afterAll(async () => {
    if (page) await page.close();
    if (context) await context.close();
    await deleteBoard(board_id);
    console.log("✅ Session cerrada");
  });

  // ---------------------- TEST CASES ---------------------- //

  test('TC001 - Crear checklist "Checklist 1" en card nueva', async () => {
    const card = await createCardUtils('Card TC001',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 1';
    const item = 'TC001 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);
    await checklistPage.validateChecklistExists(checklistTitle);
  });

  test('TC002 - Marcar ítem de "Checklist 2" como completado en card nueva', async () => {
    const card = await createCardUtils('Card TC002',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 2';
    const item = 'TC002 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);

    await checklistPage.toggleChecklistItem(item);
    await checklistPage.validateItemCompleted(item);
  });

  test('TC003 - Eliminar checklist "Checklist 3" en card nueva', async () => {
    const card = await createCardUtils('Card TC003',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 3';
    const item = 'TC003 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);

    await checklistPage.deleteChecklist(checklistTitle);
  });

  test('TC004 - Crear checklist "Checklist 4" con item adicional', async () => {
    const card = await createCardUtils('Card TC004',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 4';
    const item = 'TC004 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);
    await checklistPage.validateChecklistExists(checklistTitle);
  });

  test('TC005 - Completar item de "Checklist 5"', async () => {
    const card = await createCardUtils('Card TC005',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 5';
    const item = 'TC005 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);

    await checklistPage.toggleChecklistItem(item);
    await checklistPage.validateItemCompleted(item);
  });

  test('TC006 - Crear checklist "Checklist 6"', async () => {
    const card = await createCardUtils('Card TC006',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 6';
    const item = 'TC006 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);
    await checklistPage.validateChecklistExists(checklistTitle);
  });

  test('TC007 - Completar item de "Checklist 7"', async () => {
    const card = await createCardUtils('Card TC007',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 7';
    const item = 'TC007 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);

    await checklistPage.toggleChecklistItem(item);
    await checklistPage.validateItemCompleted(item);
  });

  test('TC008 - Eliminar checklist "Checklist 8"', async () => {
    const card = await createCardUtils('Card TC008',  list_id);
    const url_card = card.url

    const checklistTitle = 'Checklist 8';
    const item = 'TC008 Item';

    await checklistPage.gotoCard(url_card);
    await checklistPage.createChecklist(checklistTitle);
    await checklistPage.addChecklistItem(item);

    await checklistPage.deleteChecklist(checklistTitle);
  });
});
