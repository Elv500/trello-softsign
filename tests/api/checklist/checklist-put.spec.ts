import { test, expect } from "@playwright/test";
import Ajv from "ajv";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { createCardUtils } from "../../../utils/api/card-helper";
import { input_create_checklist } from "../../../resources/schemas/checklist/post_input";
import { output_create_checklist } from "../../../resources/schemas/checklist/post_output";

const ajv = new Ajv({ allErrors: true });

const validateSchema = (schema: object, data: any, label: string) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  expect(valid, `❌ ${label} no cumple con el schema:\n${JSON.stringify(validate.errors, null, 2)}`).toBeTruthy();
};

test.describe("Pruebas API de Checklist - PUT", () => {
  let board_id: string;
  let card_id: string;
  let checklist_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist PUT");
    board_id = board.boardId;
    const card = await createCardUtils("Card API Checklist PUT Tests", board.todoListId);
    card_id = card.id;

    const payload = { name: "Checklist Inicial", idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    checklist_id = data.id;
    validateSchema(output_create_checklist, data, "Output");
  });

  test.afterAll(async () => {
    if (checklist_id) await TrelloRequest.delete(`checklists/${checklist_id}`);
    await deleteBoard(board_id);
    console.log("✅ Board eliminado después de todos los tests PUT");
  });

  test("TC001 - Actualizar checklist con nombre válido", async () => {
    const payload = { name: "Checklist Actualizado" };
    validateSchema(input_create_checklist, { ...payload, idCard: card_id }, "Input");
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC002 - Actualizar checklist con nombre vacío", async () => {
    test.fail(true, 'BUG-001: La API permite actualizar checklist con nombre vacío');
    const payload = { name: "" };
    validateSchema(input_create_checklist, { ...payload, idCard: card_id }, "Input");
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC003 - Actualizar checklist con nombre muy largo", async () => {
    const payload = { name: "X".repeat(600) };
    validateSchema(input_create_checklist, { ...payload, idCard: card_id }, "Input");
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([200, 400]).toContain(response.status());
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC004 - Actualizar checklist con caracteres especiales", async () => {
    const payload = { name: "!@#$%^&*()_+|~`" };
    validateSchema(input_create_checklist, { ...payload, idCard: card_id }, "Input");
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC005 - Actualizar checklist con espacio en blanco", async () => {
    test.fail(true, 'BUG-005: La API permite actualizar checklist con solo espacios');
    const payload = { name: "   " };
    validateSchema(input_create_checklist, { ...payload, idCard: card_id }, "Input");
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC006 - Actualizar checklist con nombre numérico", async () => {
    const payload = { name: "987654" };
    validateSchema(input_create_checklist, { ...payload, idCard: card_id }, "Input");
    const response = await TrelloRequest.put(`checklists/${checklist_id}`, payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });
  test("TC007 - Crear checklist sin idCard (fallido)", async () => {
    const payload = { name: "Checklist sin Card" };
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
  });

});
