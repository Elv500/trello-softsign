import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";
import { AssertionStatusCode } from "../../../assertions/assertions-status";
import * as allure from 'allure-js-commons';

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

  test.afterEach(async () => {
      await allure.owner("Noelia Cantarran");
      await allure.epic("EPIC: Gestión de Cards");
      await allure.feature("Feature: Campo Personalizado");
      await allure.story("HU: Crear campo personalizado");
  });

  test.afterAll(async () => {
    await deleteBoard(board_id);
  });

  test("TC001 - Agregar opción válida al Custom Field tipo 'list' @customField @positive", async () => {
    await allure.tags('customfield', 'positive');

    const payload = { value: { text: "Correo" } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.value.text).toBe("Correo");
  });

  test("TC002 - Agregar opción sin 'value.text' @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { value: {} };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC003 - Agregar opción con tipo de dato incorrecto @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { value: { text: 12345 } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC004 - Agregar opción con nombre extremadamente largo @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { value: { text: "X".repeat(5000) } };
    const response = await TrelloRequest.post(`customFields/${customField_id}/options`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC005 - Intentar agregar opción a un Custom Field eliminado @customField @negative", async () => {
    await allure.tags('customfield', 'negative');
    
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