import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";

test.describe("Pruebas API de Custom Field - POST Options", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test CustomField Options");
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

  test("TC001 - Agregar opción válida al Custom Field tipo 'list'", async () => {
    const payload = { value: { text: "Correo" } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.value.text).toBe("Correo");
  });

  test("TC002 - Intentar agregar opción duplicada", async () => {
    const payload = { value: { text: "Correo" } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    expect([400, 409, 422]).toContain(response.status());
  });

  test("TC003 - Agregar opción sin 'value.text'", async () => {
    const payload = { value: {} };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC004 - Agregar opción con texto vacío", async () => {
    const payload = { value: { text: "" } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC005 - Agregar opción con tipo de dato incorrecto", async () => {
    const payload = { value: { text: 12345 } }; // debería ser string
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC006 - Agregar opción con nombre extremadamente largo", async () => {
    const payload = { value: { text: "X".repeat(5000) } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    expect([200, 422]).toContain(response.status());
  });

  test("TC007 - Intentar agregar opción a un Custom Field eliminado", async () => {
    const tempResp = await TrelloRequest.post("customFields", {
      idModel: board_id,
      name: "Campo temporal",
      type: "list"
    });
    const tempData = await tempResp.json();
    const tempId = tempData.id;
    await TrelloRequest.delete(`customFields/${tempId}`);
    const payload = { value: { text: "Correo" } };
    const response = await TrelloRequest.post(`customFields/${tempId}/options`, payload);
    expect([404]).toContain(response.status());
  });
});