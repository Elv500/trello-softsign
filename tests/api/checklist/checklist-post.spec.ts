import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { createCardUtils } from "../../../utils/api/card-helper";

test.describe("Pruebas API de Checklist", () => {
  let board_id: string;
  let card_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist");
    board_id = board.boardId;

    const card = await createCardUtils("Card API Checklist Tests", board.todoListId);
    card_id = card.cardId;
  });

  test.afterAll(async () => {
    await deleteBoard(board_id);
    console.log("✅ Board eliminado después de todos los tests");
  });

  test("TC001 - Crear checklist 'Checklist válido'", async () => {
    const payload = { name: "Checklist Válido", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
  });

  test("TC002 - Crear checklist con nombre vacío", async () => {
    test.fail(true, 'BUG-001: La API permite crear checklist con nombre vacío');

    const payload = { name: "", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC003 - Crear checklist con nombre muy largo", async () => {
    const payload = { name: "X".repeat(600), idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect([ 200]).toContain(response.status());
  });

  test("TC004 - Crear checklist con caracteres especiales", async () => {
    const payload = { name: "!@#$%^&*()_+|~`", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
  });

  test("TC005 - Crear checklist con espacio en blanco", async () => {
    test.fail(true, 'BUG-005 La API permite crear checklist con espacio en blanco')

    const payload = { name: "    ", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC006 - Crear checklist con emoji", async () => {
    const payload = { name: "Checklist 😀", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
  });

  test("TC007 - Crear checklist con nombre numérico", async () => {
    const payload = { name: "123456", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
  });
});
