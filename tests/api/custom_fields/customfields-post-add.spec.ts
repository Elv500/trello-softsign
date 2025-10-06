import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { customFieldPayloads } from "../../../resources/payloads/customfield/customField-payload";
import { AssertionStatusCode } from "../../../assertions/assertions-status";

test.describe("Pruebas API de Custom Field - POST", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {
    const state = await createBoardForSuite("Board API Test CustomField POST");
    board_id = state.boardId;
  });

  test.afterAll(async () => {
    if (customField_id) await TrelloRequest.delete(`customFields/${customField_id}`);
    await deleteBoard(board_id);
  });

  test("TC001 - Crear Custom Field tipo 'list' con opciones válidas", async () => {
    const payload = { ...customFieldPayloads.validList, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    customField_id = json.id;
    expect(json.id).toBeDefined();
    expect(json.name).toBe(payload.name);
    expect(json.type).toBe("list");
  });

  test("TC002 - Crear Custom Field con nombre muy largo", async () => {
    const payload = { ...customFieldPayloads.longName, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC003 - Crear Custom Field con caracteres especiales", async () => {
    const payload = { ...customFieldPayloads.specialChars, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC004 - Crear Custom Field con emoji", async () => {
    const payload = { ...customFieldPayloads.withEmoji, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC005 - Crear Custom Field con tipo no soportado", async () => {
    const payload = { ...customFieldPayloads.invalidType, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC006 - Crear Custom Field sin campo 'type'", async () => {
    const payload = { ...customFieldPayloads.missingType, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC007 - Crear Custom Field sin 'idModel'", async () => {
    const payload = { ...customFieldPayloads.noModelId };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC008 - Crear Custom Field tipo 'text'", async () => {
    const payload = { ...customFieldPayloads.textField, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.type).toBe("text");
  });

  test("TC009 - Crear Custom Field tipo 'checkbox'", async () => {
    const payload = { ...customFieldPayloads.checkboxField, idModel: board_id };
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_200(response);
    const json = await response.json();
    expect(json.type).toBe("checkbox");
  });

  test("TC010 - Crear Custom Field duplicado", async () => {
    const payload = { ...customFieldPayloads.duplicateName, idModel: board_id };
    await TrelloRequest.post("customFields", payload);
    const response = await TrelloRequest.post("customFields", payload);
    AssertionStatusCode.assert_status_code_409(response);
  });
});