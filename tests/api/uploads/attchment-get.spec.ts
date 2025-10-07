import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { randomAttachmentByUrl, buildAttachmentInput } from '../../../resources/payloads/attachment';
import { AssertionStatusCode } from '../../../assertions/assertions-status';
import { AssertionAttachment } from '../../../assertions/assertion-attachment';
import * as allure from 'allure-js-commons';

let boardId: string;
let todoListId: string;
let cardId: string;

test.describe('Attachment GET tests', () => {
  test.beforeAll(async () => {
    const state = await createBoardForSuite('Board for attachment GET suite');
    boardId = state.boardId;
    todoListId = state.todoListId;
    cardId = state.cardId;
  });

  test.afterEach(async () => {
    await allure.owner("Kevin Gutierrez");
    await allure.epic("EPIC: Gestión de Cards");
    await allure.feature("Feature: Upload");
    await allure.story("HU: Obtener adjuntos");
  });

  test.afterAll(async () => {
    if (boardId) await deleteBoard(boardId);
  });

  // TC: Obtener un attachment específico de una card
  test('Get attachment by id from card @attachment @smoke @positive', async () => {
    await allure.tags('attachment', 'smoke', 'positive');

    const { url, name } = randomAttachmentByUrl();
    const inputPayload = buildAttachmentInput(cardId, { url, name: `Attachment for GET: ${name}` }, { validate: true });
    AssertionAttachment.assert_post_input_schema(inputPayload);
    const { status, body: attachData } = await attachUrlToCard(cardId, url, `Attachment for GET: ${name}`);
    AssertionStatusCode.assert_status_code_200(status);
    AssertionAttachment.assert_post_output_schema(attachData);
    const attachmentId = attachData.id;
    const response = await TrelloRequest.get(`cards/${cardId}/attachments/${attachmentId}`);
    AssertionStatusCode.assert_status_code_200(response);
    const data = await response.json();
    expect(data).toHaveProperty('id', attachmentId);
    expect(data).toHaveProperty('name', `Attachment for GET: ${name}`);
    if (data.originalUrl) {
      expect(data.originalUrl).toBe(url);
    }
    expect(data.url).toContain('trello.com/1/cards/');
  });

  // TC: Obtener attachments de una card inexistente
  test('Get attachments for non-existent card should @attachment @smoke @negative', async () => {
    await allure.tags('attachment', 'smoke', 'negative');

    const fakeCardId = '000000000000000000000000';
    const response = await TrelloRequest.get(`cards/${fakeCardId}/attachments`);
    AssertionStatusCode.assert_status_code_404(response);
  });

  // TC: Obtener attachment inexistente en card válida -> 404
  test('Get non-existent attachment id should @attachment @smoke @negative', async () => {
    await allure.tags('attachment', 'smoke', 'negative');
    
    const fakeAttachmentId = '000000000000000000000000';
    const response = await TrelloRequest.get(`cards/${cardId}/attachments/${fakeAttachmentId}`);
    const status = response.status();
    if (![400, 404].includes(status)) {
      let bodyText = '';
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = '<no body>';
      }
      console.error(`Unexpected status when fetching non-existent attachment: ${status}\nBody: ${bodyText}`);
    }
    expect([400, 404]).toContain(status);
  });
});