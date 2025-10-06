import { test } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { customFieldPayloads } from "../../../resources/payloads/customfield/customField-payload";
import { AssertionStatusCode } from "../../../assertions/assertions-status";

test.describe("Pruebas API de Custom Field - DELETE", () => {
  let board_id: string;
  let customField_id: string;

  test.beforeAll(async () => {  
    const state = await createBoardForSuite("Board API Test CustomField DELETE");
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

  test("TC001 - Eliminar Custom Field existente", async () => {
    const response = await TrelloRequest.delete(`customFields/${customField_id}`);
    AssertionStatusCode.assert_status_code_200(response);
  });

  test("TC002 - Intentar eliminar Custom Field inexistente", async () => {
    const response = await TrelloRequest.delete("customFields/fakeId123");
    AssertionStatusCode.assert_status_code_400(response);
  });

  test("TC003 - Intentar eliminar Custom Field sin especificar ID", async () => {
    const response = await TrelloRequest.delete("customFields/");
    AssertionStatusCode.assert_status_code_404(response);
  });

  test("TC004 - Intentar eliminar Custom Field con ID vacío", async () => {
    const response = await TrelloRequest.delete("customFields/ ");
    AssertionStatusCode.assert_status_code_404(response);
  });
});