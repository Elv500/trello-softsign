import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";

test.describe("Pruebas API de Custom Field - DELETE", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test CustomField DELETE");
    board_id = board.boardId;

    const payload = { ...customFieldPayloads.validList, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    const json = await response.json();
    customField_id = json.id;
  });

  test.afterAll(async () => {
    await deleteBoard(board_id);
    console.log("Limpieza completada");
  });

  test("TC001 - Eliminar Custom Field existente", async () => {
    const response = await TrelloRequest.delete(`customFields/${customField_id}`);
    expect(response.status()).toBe(200);
  });

  test("TC002 - Intentar eliminar Custom Field inexistente", async () => {
    const response = await TrelloRequest.delete("customFields/fakeId123");
    expect([400, 404]).toContain(response.status());
  });
   
  test("TC003 - Intentar eliminar Custom Field sin especificar ID", async () => {
    const response = await TrelloRequest.delete("customFields/");
    expect([400, 404]).toContain(response.status());
  });

  test("TC004 - Intentar eliminar Custom Field con ID vacío", async () => {
    const response = await TrelloRequest.delete("customFields/ ");
    expect([400, 404]).toContain(response.status());
  });
});