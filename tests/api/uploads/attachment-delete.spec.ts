import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { loadRandomImageFromJson } from '../../../utils/api/image-loader';
import { AssertionStatusCode } from '../../../assertions/assertions-status';
import * as allure from 'allure-js-commons';

let boardId: string;
let todoListId: string;
let cardId: string;

// TC: Eliminar un attachment específico de una card
test.describe('Attachment DELETE tests', () => {
  test.beforeAll(async () => {
    const state = await createBoardForSuite('Board for attachment DELETE suite');
    boardId = state.boardId;
    todoListId = state.todoListId;
    cardId = state.cardId;
  });

  test.afterEach(async () => {
      await allure.owner("Kevin Gutierrez");
      await allure.epic("EPIC: Gestión de Cards");
      await allure.feature("Feature: Upload");
      await allure.story("HU: Eliminar adjuntos");
    });

  test.afterAll(async () => {
    if (boardId) await deleteBoard(boardId);
  });

  // TC: Eliminar un attachment específico de una card
  test('Delete attachment by id from card @attachment @smoke @positive', async () => {
    await allure.tags('attachment','smoke', 'positive');

    const { url, name } = loadRandomImageFromJson();
    const { status, body: attachData } = await attachUrlToCard(cardId, url, `Attachment for DELETE: ${name}`);
    AssertionStatusCode.assert_status_code_200(status);
    const attachmentId = attachData.id;
    const response = await TrelloRequest.delete(`cards/${cardId}/attachments/${attachmentId}`);
    AssertionStatusCode.assert_status_code_200(response);
    const getResp = await TrelloRequest.get(`cards/${cardId}/attachments/${attachmentId}`);
    expect([400, 404]).toContain(getResp.status());
  });

  // TC: Intentar eliminar un attachment inexistente
  test('Delete non-existent attachment @attachment @smoke @negative', async () => {
    await allure.tags('attachment', 'smoke', 'negative');

    const fakeId = '000000000000000000000000';
    const resp = await TrelloRequest.delete(`cards/${cardId}/attachments/${fakeId}`);
    expect([400, 404]).toContain(resp.status());
  });

  // TC: Eliminar el mismo attachment dos veces
  test('Delete same attachment twice - second should fail @attachment @smoke @negative', async () => {
    await allure.tags('attachment', 'smoke', 'negative');

    const { url, name } = loadRandomImageFromJson();
    const { status, body: attachData } = await attachUrlToCard(cardId, url, `Attachment for double delete: ${name}`);
    AssertionStatusCode.assert_status_code_200(status);
    const attachmentId = attachData.id;
    const first = await TrelloRequest.delete(`cards/${cardId}/attachments/${attachmentId}`);
    expect(first.status()).toBe(200);
    const second = await TrelloRequest.delete(`cards/${cardId}/attachments/${attachmentId}`);
    expect([400, 404]).toContain(second.status());
  });

  // TC: Attempt delete without authentication params
  test('Delete attachment without auth should be unauthorized or forbidden @attachment @smoke @negative', async () => {
    await allure.tags('attachment', 'smoke', 'negative');

    const { url, name } = loadRandomImageFromJson();
    const { status, body: attachData } = await attachUrlToCard(cardId, url, `Attachment for unauth delete: ${name}`);
    AssertionStatusCode.assert_status_code_200(status);
    const attachmentId = attachData.id;
    const api = await (await import('@playwright/test')).request.newContext({ baseURL: process.env.BASE_URL });
    const resp = await api.delete(`/cards/${cardId}/attachments/${attachmentId}`);
    expect([401, 403, 400, 404]).toContain(resp.status());
  });
});