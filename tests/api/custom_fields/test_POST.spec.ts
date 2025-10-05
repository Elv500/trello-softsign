import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";

test.describe("Pruebas API de Custom Field - POST", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test CustomField POST");
    board_id = board.boardId;
  });

  test.afterAll(async () => {
    if (customField_id) await TrelloRequest.delete(`customFields/${customField_id}`);
    await deleteBoard(board_id);
    console.log("Limpieza completada");
  });

  test("TC001 - Crear Custom Field tipo 'list' con opciones válidas", async () => {
    const payload = { ...customFieldPayloads.validList, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect(response.status()).toBe(200);
    const json = await response.json();
    customField_id = json.id;
    expect(json).toHaveProperty("id");
    expect(json.name).toBe(payload.name);
    expect(json.type).toBe("list");
  });

  test("TC002 - Crear Custom Field con nombre muy largo", async () => {
    const payload = { ...customFieldPayloads.longName, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect([400, 422, 200]).toContain(response.status());
  });

  test("TC003 - Crear Custom Field con caracteres especiales", async () => {
    const payload = { ...customFieldPayloads.specialChars, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect(response.status()).toBe(200);
  });

  test("TC004 - Crear Custom Field con emoji", async () => {
    const payload = { ...customFieldPayloads.withEmoji, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect(response.status()).toBe(200);
  });

  test("TC005 - Crear Custom Field con tipo no soportado", async () => {
    const payload = { ...customFieldPayloads.invalidType, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC006 - Crear Custom Field sin campo 'type'", async () => {
    const payload = { ...customFieldPayloads.missingType, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC007 - Crear Custom Field sin 'idModel'", async () => {
    const payload = { ...customFieldPayloads.noModelId };
    const response = await TrelloRequest.post("customFields", payload);
    expect([400, 404, 422]).toContain(response.status());
  });

  test("TC008 - Crear Custom Field tipo 'text'", async () => {
    const payload = { ...customFieldPayloads.textField, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.type).toBe("text");
  });

  test("TC009 - Crear Custom Field tipo 'checkbox'", async () => {
    const payload = { ...customFieldPayloads.checkboxField, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.type).toBe("checkbox");
  });

  test("TC010 - Crear Custom Field tipo 'list' sin opciones", async () => {
    const payload = { ...customFieldPayloads.listWithoutOptions, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC011 - Crear Custom Field duplicado", async () => {
    const payload = { ...customFieldPayloads.duplicateName, idModel: board_id };
    await TrelloRequest.post("customFields", payload);
    const response = await TrelloRequest.post("customFields", payload);
    expect([200, 409]).toContain(response.status());
  });

  test("TC012 - Crear Custom Field oculto en card front", async () => {
    const payload = { ...customFieldPayloads.validList, idModel: board_id, display_cardFront: false };
    const response = await TrelloRequest.post("customFields", payload);
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.display?.cardFront).toBeFalsy();
  });

  test("TC013 - Validar estructura básica del Custom Field creado", async () => {
    const payload = { ...customFieldPayloads.validList, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    const json = await response.json();

    expect(json).toHaveProperty("id");
    expect(json).toHaveProperty("name");
    expect(json).toHaveProperty("type");
    expect(json).toHaveProperty("idModel");
  });
});