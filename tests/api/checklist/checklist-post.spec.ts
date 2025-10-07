import { test, expect } from "@playwright/test";
import { TrelloRequest } from "../../../utils/api/trello-request";
import { createBoardForSuite, deleteBoard } from "../../../utils/api/base-helper";
import { AssertionChecklist } from "../../../assertions/assertion-checklist";
import * as allure from 'allure-js-commons';

test.describe("Pruebas API de Checklist", () => {
  let board_id: string;
  let card_id: string;

  test.beforeAll(async () => {
    const board = await createBoardForSuite("Board API Test Checklist");
    board_id = board.boardId;
    card_id = board.cardId;
  });

  test.afterEach(async () => {
      await allure.owner("Jessica Trujillo");
      await allure.epic("EPIC: Gestión de Cards");
      await allure.feature("Feature: Checklist");
      await allure.story("HU: Crear checklist");
  });

  test.afterAll(async () => {
    await deleteBoard(board_id);
    console.log(" Board eliminado después de todos los tests");
  });

  test("TC001 - Crear checklist 'Checklist válido'", async () => {
    await allure.tags('smoke', 'regression', 'api', 'cards', 'date');
    
    const payload = { name: "Checklist Válido", idCard: card_id };
    AssertionChecklist.assert_post_input_schema(payload);
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_post_output_schema(data);
  });

  test("TC002 - Crear checklist con nombre vacío", async () => {
    await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

    test.fail(true, "BUG-001: La API permite crear checklist con nombre vacío");
    const payload = { name: "", idCard: card_id };
    AssertionChecklist.assert_post_input_schema(payload);
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    AssertionChecklist.assert_post_output_schema(data);
  });

  test("TC003 - Crear checklist con nombre muy largo", async () => {
    await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

    const payload = { name: "X".repeat(600), idCard: card_id };
    AssertionChecklist.assert_post_input_schema(payload);
    const response = await TrelloRequest.post("checklists", payload);
    expect([200]).toContain(response.status());
    const data = await response.json();
    AssertionChecklist.assert_post_output_schema(data);
  });

  test("TC004 - Crear checklist con caracteres especiales", async () => {
    await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

    const payload = { name: "!@#$%^&*()_+|~`", idCard: card_id };
    AssertionChecklist.assert_post_input_schema(payload);
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_post_output_schema(data);
  });

  test("TC005 - Crear checklist con espacio en blanco", async () => {
    await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

    test.fail(true, "BUG-005 La API permite crear checklist con espacio en blanco");
    const payload = { name: "    ", idCard: card_id };
    AssertionChecklist.assert_post_input_schema(payload);
    const response = await TrelloRequest.post("checklists", payload);
    expect([400, 422]).toContain(response.status());
    const data = await response.json();
    AssertionChecklist.assert_post_output_schema(data);
  });

  test("TC006 - Crear checklist con nombre numérico", async () => {
    await allure.tags('smoke', 'regression', 'api', 'cards', 'date');
    
    const payload = { name: "123456", idCard: card_id };
    AssertionChecklist.assert_post_input_schema(payload);
    const response = await TrelloRequest.post("checklists", payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    AssertionChecklist.assert_post_output_schema(data);
  });
});
