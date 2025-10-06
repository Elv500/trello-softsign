import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { AssertionChecklist } from "../../../assertions/assertion-checklist";

test.describe("Pruebas API de Checklist - PUT", () => {
  let board_id: string;
  let card_id: string;
  let checklist_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist PUT");
    board_id = board.boardId;
    card_id = board.cardId;
    const payload = { name: "Checklist Inicial", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    checklist_id = data.id;
  });

  test.afterAll(async () => {
    if (checklist_id) await TrelloRequest.delete(`checklists/${checklist_id}`);
    await deleteBoard(board_id);
    console.log("Board eliminado después de todos los tests PUT");
  });

  test("TC001 - Actualizar checklist con nombre válido", async () => {
    const payload = { name: "Checklist Actualizado" };
    AssertionChecklist.assert_put_input_schema(payload);
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_put_output_schema(data);
  });

  test("TC002 - Actualizar checklist con nombre vacío", async () => {
    test.fail(true, 'BUG-001: La API permite actualizar checklist con nombre vacío');
    const payload = { name: "" };
    AssertionChecklist.assert_put_input_schema(payload);;
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    AssertionChecklist.assert_put_output_schema(data);
  });

  test("TC003 - Actualizar checklist con nombre muy largo", async () => {
    const payload = { name: "X".repeat(600) };
    AssertionChecklist.assert_put_input_schema(payload);;
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([200, 400]).toContain(response.status());
    const data = await response.json();
    AssertionChecklist.assert_put_output_schema(data);
  });

  test("TC004 - Actualizar checklist con caracteres especiales", async () => {
    const payload = { name: "!@#$%^&*()_+|~`" };
    AssertionChecklist.assert_put_input_schema(payload);;
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_put_output_schema(data);
  });

  test("TC005 - Actualizar checklist con espacio en blanco", async () => {
    test.fail(true, 'BUG-005: La API permite actualizar checklist con solo espacios');
    const payload = { name: "   " };
    AssertionChecklist.assert_put_input_schema(payload);;
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    AssertionChecklist.assert_put_output_schema(data);
  });

  test("TC006 - Actualizar checklist con nombre numérico", async () => {
    const payload = { name: "987654" };
    AssertionChecklist.assert_put_input_schema(payload);;
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_put_output_schema(data);
  });
  test("TC007 - Crear checklist sin idCard (fallido)", async () => {
    const payload = { name: "Checklist sin Card" };
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
  });

});
