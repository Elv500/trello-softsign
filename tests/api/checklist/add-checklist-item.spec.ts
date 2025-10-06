import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { createCardUtils } from "../../../utils/api/card-helper";
import { AssertionChecklist } from "../../../assertions/assertion-checklist";

test.describe("Pruebas API de Checklist Items", () => {
  let board_id: string;
  let card_id: string;
  let checklist_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist Items");
    board_id = board.boardId;
    card_id = board.cardId;
    const payload = { name: "Checklist Inicial", idCard: card_id };
    const response = await TrelloRequest.post("checklists", payload);
    const data = await response.json();
    checklist_id = data.id;
  });

  test.afterAll(async () => {
    if (checklist_id) await TrelloRequest.delete(`checklists/${checklist_id}`);
    await deleteBoard(board_id);
  });

  test("TC001 - Agregar item con nombre válido", async () => {
    const payload = { name: "Item Válido" };
    AssertionChecklist.assert_add_item_input_schema(payload);
    const response = await TrelloRequest.post(`checklists/${checklist_id}/checkItems`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_add_item_output_schema(data);
  });

  test("TC002 - Agregar item con checklist_id inválido", async () => {
    const payload = { name: "Item con checklist_id inválido" };
    AssertionChecklist.assert_add_item_input_schema(payload);
    const response = await TrelloRequest.post(`checklists/invalid-id/checkItems`, payload);
    expect([400, 404]).toContain(response.status());
  });

  test("TC003 - Agregar item sin nombre", async () => {
    const payload = {};
    const response = await TrelloRequest.post(`checklists/${checklist_id}/checkItems`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC004 - Agregar item con tipo de dato incorrecto", async () => {
    const payload = { name: 12345 };
    const response = await TrelloRequest.post(`checklists/${checklist_id}/checkItems`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC005 - Agregar item a checklist eliminado", async () => {
    const tempChecklistResp = await TrelloRequest.post("checklists", { name: "Temp", idCard: card_id });
    const tempChecklistData = await tempChecklistResp.json();
    const tempId = tempChecklistData.id;
    await TrelloRequest.delete(`checklists/${tempId}`);
    const payload = { name: "Item en checklist eliminado" };
    AssertionChecklist.assert_add_item_input_schema(payload);
    const response = await TrelloRequest.post(`checklists/${tempId}/checkItems`, payload);
    expect([404]).toContain(response.status());
  });

  test("TC006 - Agregar item con nombre extremadamente largo", async () => {
    const payload = { name: "X".repeat(5000) };
    AssertionChecklist.assert_add_item_input_schema(payload);
    const response = await TrelloRequest.post(`checklists/${checklist_id}/checkItems`, payload);
    expect([200, 400]).toContain(response.status());
    const data = await response.json();
    if (response.status() === 200) {
      AssertionChecklist.assert_add_item_output_schema(data);
    }
  });
});
