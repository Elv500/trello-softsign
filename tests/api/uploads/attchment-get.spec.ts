import { loadRandomImageFromJson } from '../../../utils/api/image-loader';
import { test, expect } from '@playwright/test';
import { readState } from '../../../utils/api/state-manager';
import { createCard } from '../../../utils/api/card-helper';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { TrelloRequest } from '../../../utils/api/trello-request';

// TC: Obtener un attachment específico de una card
test('[api] Get attachment by id from card', async () => {
  const { todoListId } = readState();
  const { url, name } = loadRandomImageFromJson();
  const cardData = await createCard(`Card for GET attachment: ${name}`, todoListId);
  const cardId = cardData.id;
  const attachData = await attachUrlToCard(cardId, url, `Attachment for GET: ${name}`);
  const attachmentId = attachData.id;
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