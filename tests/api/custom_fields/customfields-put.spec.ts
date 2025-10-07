import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { customFieldPayloads } from "../../../resources/payloads/customField-payload";
import { AssertionStatusCode } from "../../../assertions/assertions-status";
import * as allure from 'allure-js-commons';

test.describe("Pruebas API de Custom Field - PUT", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const state = await createBoardForSuite("Board API Test CustomField PUT");
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
          await allure.story("HU: Actualizar campo personalizado");
  });

  test.afterAll(async () => {
    await TrelloRequest.delete(`customFields/${customField_id}`);
    await deleteBoard(board_id);
  });

  test("TC001 - Actualizar nombre de Custom Field existente @customField @positive", async () => {
    await allure.tags('customfield', 'positive');

    const payload = { name: "Updated Priority" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.name).toBe("Updated Priority");
  });

  test("TC002 - Actualizar Custom Field con nombre largo @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { name: "X".repeat(600) };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC003 - Actualizar Custom Field con caracteres especiales @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { name: "!@#$%^&*()_+|~`" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC004 - Actualizar Custom Field con nombre vacío @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { name: "" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC005 - Actualizar Custom Field con nombre numérico @customField @negative", async () => {
    await allure.tags('customfield', 'negative');
    
    const payload = { name: "123456" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC006 - Actualizar Custom Field con emoji en el nombre @customField @positive", async () => {
    await allure.tags('customfield', 'positive');

    const payload = { name: "Urgente 🔥" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC007 - Intentar actualizar Custom Field inexistente @customField @negative", async () => {
    await allure.tags('customfield', 'negative');
    
    const payload = { name: "No existe" };
    const response = await TrelloRequest.put("customFields/fakeId123", payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC008 - Intentar actualizar Custom Field con ID vacío @customField @negative", async () => {
    await allure.tags('customfield', 'negative');

    const payload = { name: "Campo Invalido" };
    const response = await TrelloRequest.put("customFields/", payload);
    AssertionStatusCode.assert_status_code_404(response);
  });

  test("TC009 - Actualizar tipo de Custom Field (de list a text) @customField @positive", async () => {
    await allure.tags('customfield', 'positive');
    
    const payload = { type: "text" };
    const response = await TrelloRequest.put(`customFields/${customField_id}`, payload);
    AssertionStatusCode.assert_status_code_200(response);
  });
});