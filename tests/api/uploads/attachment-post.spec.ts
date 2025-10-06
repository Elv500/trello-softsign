import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { randomAttachmentByUrl } from '../../../resources/payloads/attachment/attachment';
import { buildAttachmentInput } from '../../../resources/payloads/attachment/attachment';
import { AssertionAttachment } from '../../../assertions/attachment-assertions/assertion-attachment';
import { AssertionStatusCode } from '../../../assertions/assertions-status';

let boardId: string;
let todoListId: string;
let cardId: string;

test.describe('Attachment POST tests', () => {
  test.beforeAll(async () => {
    const state = await createBoardForSuite('Board for attachment POST suite');
    boardId = state.boardId;
    todoListId = state.todoListId;
    cardId = state.cardId;
  });

  test.afterAll(async () => {
    await deleteBoard(boardId);
  });

  // TC: Adjuntar imagen aleatoria a la card creada en el setup
  test('Attach random image to the setup card', async () => {
    const { url, name, setCover } = randomAttachmentByUrl();
    const inputPayload = buildAttachmentInput(cardId, { url, name, setCover }, { validate: true });
    AssertionAttachment.assert_post_input_schema(inputPayload);
    const { status, body: attachData } = await attachUrlToCard(cardId, url, name);
    AssertionStatusCode.assert_status_code_200(status);
    AssertionAttachment.assert_post_output_schema(attachData);
    expect(attachData).toHaveProperty('id');
    const returnedUrl = attachData.url as string;
    const originalUrlField = attachData.originalUrl as string | undefined;
    const isSame = returnedUrl === url || originalUrlField === url;
    const isTrelloProxy = typeof returnedUrl === 'string' && returnedUrl.includes('trello.com/1/cards/');
    expect(isSame || isTrelloProxy).toBeTruthy();
    expect(attachData.name).toBe(name);
  });

  // TC: Adjuntar varias imágenes diferentes a la misma card
  test('Attach multiple different images to same card', async () => {
    const attachments = [] as Array<any>;
    for (let i = 0; i < 3; i++) {
      const { url, name } = randomAttachmentByUrl();
      const inputPayload = buildAttachmentInput(cardId, { url, name }, { validate: true });
      AssertionAttachment.assert_post_input_schema(inputPayload);
      const { status, body } = await attachUrlToCard(cardId, url, name);
      AssertionStatusCode.assert_status_code_200(status);
      AssertionAttachment.assert_post_output_schema(body);
      attachments.push(body);
    }
    expect(attachments.length).toBe(3);
  });

  // TC: Adjuntar imágenes de diferentes extensiones
  test('Attach images with different extensions', async () => {
    const urls = [
      'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
      'https://upload.wikimedia.org/wikipedia/commons/3/3f/JPEG_example_flower.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif',
    ];
    for (const u of urls) {
      const name = `Ext test ${u.split('/').pop()}`;
      const inputPayload = buildAttachmentInput(cardId, { url: u, name }, { validate: true });
      AssertionAttachment.assert_post_input_schema(inputPayload);
      const { status, body } = await attachUrlToCard(cardId, u, name);
      AssertionStatusCode.assert_status_code_200(status);
      AssertionAttachment.assert_post_output_schema(body);
    }
  });

  // TC: Adjuntar imagen con URL inválida (validación de input)
  test('Attach with invalid URL should fail schema validation', async () => {
    const badUrl = 'nota-url-invalida';
    const name = 'Invalid URL Test';
    const inputPayload = buildAttachmentInput(cardId, { url: badUrl, name }, { validate: false });
    let threw = false;
    try {
      AssertionAttachment.assert_post_input_schema(inputPayload);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  // TC: Adjuntar imagen a una card inexistente
  test('Attach image to non-existent card should return 404', async () => {
    const { url, name } = randomAttachmentByUrl();
    const fakeCardId = '000000000000000000000000';
    const inputPayload = buildAttachmentInput(fakeCardId, { url, name }, { validate: true });
    AssertionAttachment.assert_post_input_schema(inputPayload);
    const { status } = await attachUrlToCard(fakeCardId, url, name);
    AssertionStatusCode.assert_status_code_404(status);
  });

  // TC: Adjuntar imagen con nombre vacío
  test('Attach image with empty name', async () => {
    const { url } = randomAttachmentByUrl();
    const name = '';
    const inputPayload = buildAttachmentInput(cardId, { url, name }, { validate: true });
    AssertionAttachment.assert_post_input_schema(inputPayload);
    const { status, body } = await attachUrlToCard(cardId, url, name);
    AssertionStatusCode.assert_status_code_200(status);
    AssertionAttachment.assert_post_output_schema(body);
  });

  
});