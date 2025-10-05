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

test.describe("Pruebas API de Checklist", () => {
  let board_id: string;
  let card_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist");
    board_id = board.boardId;
    const card = await createCardUtils("Card API Checklist Tests", board.todoListId);
    card_id = card.id;
  });

  test.afterAll(async () => {
    await deleteBoard(board_id);
    console.log("✅ Board eliminado después de todos los tests");
  });

  test("TC001 - Crear checklist 'Checklist válido'", async () => {
    const payload = { name: "Checklist Válido", idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC002 - Crear checklist con nombre vacío", async () => {
    test.fail(true, "BUG-001: La API permite crear checklist con nombre vacío");
    const payload = { name: "", idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC003 - Crear checklist con nombre muy largo", async () => {
    const payload = { name: "X".repeat(600), idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect([200]).toContain(response.status());
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC004 - Crear checklist con caracteres especiales", async () => {
    const payload = { name: "!@#$%^&*()_+|~`", idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC005 - Crear checklist con espacio en blanco", async () => {
    test.fail(true, "BUG-005 La API permite crear checklist con espacio en blanco");
    const payload = { name: "    ", idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });

  test("TC006 - Crear checklist con nombre numérico", async () => {
    const payload = { name: "123456", idCard: card_id };
    validateSchema(input_create_checklist, payload, "Input");
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateSchema(output_create_checklist, data, "Output");
  });
});
