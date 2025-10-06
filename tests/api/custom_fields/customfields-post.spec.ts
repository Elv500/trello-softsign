import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { customFieldPayloads } from "../../../resources/payloads/customfield/customField-payload";
import { AssertionStatusCode } from "../../../assertions/assertions-status";

test.describe("Pruebas API de Custom Field - POST Options", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const state = await createBoardForSuite("Board API Test CustomField Options");
    board_id = state.boardId;
    const payload = { ...customFieldPayloads.validList, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    customField_id = json.id;
  });

  test.afterAll(async () => {
    await deleteBoard(board_id);
  });

  test("TC001 - Agregar opción válida al Custom Field tipo 'list'", async () => {
    const payload = { value: { text: "Correo" } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.value.text).toBe("Correo");
  });

  test("TC002 - Agregar opción sin 'value.text'", async () => {
    const payload = { value: {} };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC003 - Agregar opción con tipo de dato incorrecto", async () => {
    const payload = { value: { text: 12345 } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC004 - Agregar opción con nombre extremadamente largo", async () => {
    const payload = { value: { text: "X".repeat(5000) } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC005 - Intentar agregar opción a un Custom Field eliminado", async () => {
    const tempResp = await TrelloRequest.post("customFields", {
      idModel: board_id,
      name: "Campo temporal",
      type: "list"
    });
    AssertionStatusCode.assert_status_code_400(tempResp);
    const tempData = await tempResp.json();
    const tempId = tempData.id;

    await TrelloRequest.delete(`customFields/${tempId}`);

    const payload = { value: { text: "Correo" } };
    const response = await TrelloRequest.post(`customFields/${tempId}/options`, payload);
    AssertionStatusCode.assert_status_code_400(response);
  });
});