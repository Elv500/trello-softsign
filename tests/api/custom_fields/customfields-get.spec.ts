import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";
import { AssertionStatusCode } from "../../../assertions/assertions-status";
import * as allure from 'allure-js-commons';

test.describe("Pruebas API de Custom Field - GET", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const state = await createBoardForSuite("Board API Test CustomField GET");
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
        await allure.story("HU: Obtener campo personalizado");
  });

  test.afterAll(async () => {
    await TrelloRequest.delete(`customFields/${customField_id}`);
    await deleteBoard(board_id);
  });

  test("TC001 - Obtener Custom Field existente @customField @api @positive", async () => {
    await allure.tags('customfield', 'positive');

    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.id).toBe(customField_id);
    expect(json).toHaveProperty("name");
  });

  test("TC002 - Obtener Custom Field inexistente @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const response = await TrelloRequest.get("customFields/fakeId123");
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC003 - Obtener Custom Field con ID vacío @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const response = await TrelloRequest.get("customFields/");
    AssertionStatusCode.assert_status_code_404(response);
  });

  test("TC004 - Obtener Custom Field con ID con formato inválido @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const response = await TrelloRequest.get("customFields/!@#$$%");
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC005 - Intentar obtener Custom Field eliminado @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { ...customFieldPayloads.textField, idModel: board_id };
    const createResp = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(createResp);
    const cf = await createResp.json();
    await TrelloRequest.delete(`customFields/${cf.id}`);
    const response = await TrelloRequest.get(`customFields/${cf.id}`);
    AssertionStatusCode.assert_status_code_404(response);
  });

  test("TC006 - Obtener Custom Field y validar tipo list @customField @positive", async () => {
    await allure.tags('customfield', 'positive');

    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.type).toBe("list");
  });

  test("TC007 - Obtener Custom Field sin permisos válidos @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC008 - Verificar que el Custom Field pertenece al board correcto @customField @positive", async () => {
    await allure.tags('customfield', 'positive');

    const response = await TrelloRequest.get(`customFields/${customField_id}`);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.idModel).toBe(board_id);
  });
});