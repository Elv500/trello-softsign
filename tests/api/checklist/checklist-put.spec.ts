import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { createCardUtils } from "../../../utils/api/card-helper";

test.describe("Pruebas API de Checklist - PUT", () => {
  let board_id: string;
  let card_id: string;
  let checklist_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist PUT");
    board_id = board.boardId;

    const card = await createCardUtils("Card API Checklist PUT Tests", board.todoListId);
    card_id = card.cardId;

    // Crear checklist inicial para hacer PUT
    const payload = { name: "Checklist Inicial", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    const data = await response.json();
    checklist_id = data.id;
  });

  test.afterAll(async () => {
    if (checklist_id) await TrelloRequest.delete(`checklists/${checklist_id}`);
    await deleteBoard(board_id);
    console.log("✅ Board eliminado después de todos los tests PUT");
  });

  test("TC001 - Actualizar checklist con nombre válido", async () => {
    const payload = { name: "Checklist Actualizado" };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
  });

  test("TC002 - Actualizar checklist con nombre vacío", async () => {
    test.fail(true, 'BUG-001: La API permite actualizar checklist con nombre vacío');
    const payload = { name: "" };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC003 - Actualizar checklist con nombre muy largo", async () => {
    const payload = { name: "X".repeat(600) };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([200, 400]).toContain(response.status());
  });

  test("TC004 - Actualizar checklist con caracteres especiales", async () => {
    const payload = { name: "!@#$%^&*()_+|~`" };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
  });

  test("TC005 - Actualizar checklist con espacio en blanco", async () => {
    test.fail(true, 'BUG-005: La API permite actualizar checklist con solo espacios');
    const payload = { name: "   " };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC006 - Actualizar checklist con emoji", async () => {
    const payload = { name: "Checklist 😀 Actualizado" };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
  });

  test("TC007 - Actualizar checklist con nombre numérico", async () => {
    const payload = { name: "987654" };
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
  });
});
