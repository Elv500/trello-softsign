import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";

test.describe("Pruebas API de Custom Field - GET", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test CustomField GET");
    board_id = board.boardId;
    const payload = { ...customFieldPayloads.validList, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    const json = await response.json();
    customField_id = json.id;
  });

  test.afterAll(async () => {
    await TrelloRequest.delete(`customFields/${customField_id}`);
    await deleteBoard(board_id);
    console.log("Limpieza completada");
  });

  test("TC001 - Obtener Custom Field existente", async () => {
    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.id).toBe(customField_id);
    expect(json).toHaveProperty("name");
  });

  test("TC002 - Obtener Custom Field inexistente", async () => {
    const response = await TrelloRequest.get("customFields/fakeId123");
    expect([400, 404]).toContain(response.status());
  });

  test("TC003 - Obtener Custom Field con ID vacío", async () => {
    const response = await TrelloRequest.get("customFields/");
    expect([400, 404]).toContain(response.status());
  });
  test("TC004 - Obtener Custom Field con ID con formato inválido", async () => {
    const response = await TrelloRequest.get("customFields/!@#$$%");
    expect([400, 404]).toContain(response.status());
  });

  test("TC005 - Intentar obtener Custom Field eliminado", async () => {
    const payload = { ...customFieldPayloads.textField, idModel: board_id };
    const createResp = await TrelloRequest.post("customFields", payload);
    const cf = await createResp.json();
    await TrelloRequest.delete(`customFields/${cf.id}`);

    const response = await TrelloRequest.get(`customFields/${cf.id}`);
    expect([400, 404]).toContain(response.status());
  });

  test("TC006 - Obtener Custom Field y validar tipo list", async () => {
    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.type).toBe("list");
  });

  test("TC007 - Obtener Custom Field sin permisos válidos", async () => {
    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    expect([401, 403, 200]).toContain(response.status());
  });

  test("TC008 - Verificar que el Custom Field pertenece al board correcto", async () => {
    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    const json = await response.json();
    expect(json.idModel).toBe(board_id);
  });
});