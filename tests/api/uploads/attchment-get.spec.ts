import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { readState } from '../../../utils/api/state-manager';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { loadRandomImageFromJson } from '../../../utils/api/image-loader';

let cardId: string;

test.describe('Attachment GET tests', () => {
  test.beforeAll(async () => {
    const { todoListId } = readState();
    const createCardResp = await TrelloRequest.post('cards', {
      name: 'Card for attachment GET',
      idList: todoListId,
    });
    expect(createCardResp.status()).toBe(200);
    const cardData = await createCardResp.json();
    cardId = cardData.id;
  });

  // TC: Obtener un attachment específico de una card
  test('Get attachment by id from card', async () => {
    const { url, name } = loadRandomImageFromJson();
    const attachData = await attachUrlToCard(cardId, url, `Attachment for GET: ${name}`);
    const attachmentId = attachData.id;
    // Hacer GET del attachment
    const response = await TrelloRequest.get(`cards/${cardId}/attachments/${attachmentId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', attachmentId);
    expect(data).toHaveProperty('name', `Attachment for GET: ${name}`);
    if (data.originalUrl) {
      expect(data.originalUrl).toBe(url);
    }
    expect(data.url).toContain('trello.com/1/cards/');
  });
});