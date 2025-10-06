import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/board-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";

test.describe("Pruebas API de Custom Field - PUT", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test CustomField PUT");
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

  test("TC001 - Actualizar nombre de Custom Field existente", async () => {
    const payload = { name: "Updated Priority" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.name).toBe("Updated Priority");
  });

  test("TC002 - Actualizar Custom Field con nombre largo", async () => {
    const payload = { name: "X".repeat(600) };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect([200, 400]).toContain(response.status());
  });

  test("TC003 - Actualizar Custom Field con caracteres especiales", async () => {
    const payload = { name: "!@#$%^&*()_+|~`" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect(response.status()).toBe(200);
  });
  test("TC004 - Actualizar Custom Field con nombre vacío", async () => {
    const payload = { name: "" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect([400, 422]).toContain(response.status());
  });

  test("TC005 - Actualizar Custom Field con nombre numérico", async () => {
    const payload = { name: "123456" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect(response.status()).toBe(200);
  });

  test("TC006 - Actualizar Custom Field con emoji en el nombre", async () => {
    const payload = { name: "Urgente 🔥" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect(response.status()).toBe(200);
  });

  test("TC007 - Intentar actualizar Custom Field inexistente", async () => {
    const payload = { name: "No existe" };
    const response = await TrelloRequest.put("customFields/fakeId123", payload);
    expect([400, 404]).toContain(response.status());
  });

  test("TC008 - Intentar actualizar Custom Field con ID vacío", async () => {
    const payload = { name: "Campo Invalido" };
    const response = await TrelloRequest.put("customFields/", payload);
    expect([400, 404]).toContain(response.status());
  });

  test("TC009 - Actualizar tipo de Custom Field (de list a text)", async () => {
    const payload = { type: "text" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    expect([400, 422, 200]).toContain(response.status());
  });

});