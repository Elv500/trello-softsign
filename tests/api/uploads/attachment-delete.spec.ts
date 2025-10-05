import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { readState } from '../../../utils/api/state-manager';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { loadRandomImageFromJson } from '../../../utils/api/image-loader';
import { AssertionStatusCode } from '../../../assertions/assertions-status';

let cardId: string;

// TC: Eliminar un attachment específico de una card
test.describe('Attachment DELETE tests', () => {
  test.beforeAll(async () => {
    const { todoListId } = readState();
    const createCardResp = await TrelloRequest.post('cards', {
      name: 'Card for attachment DELETE',
      idList: todoListId,
    });
    expect(createCardResp.status()).toBe(200);
    const cardData = await createCardResp.json();
    cardId = cardData.id;
  });

  // TC: Eliminar un attachment específico de una card
  test('Delete attachment by id from card', async () => {
  const { url, name } = loadRandomImageFromJson();
  const { status, body: attachData } = await attachUrlToCard(cardId, url, `Attachment for DELETE: ${name}`);
  AssertionStatusCode.assert_status_code_200(status);
  const attachmentId = attachData.id;
  const response = await TrelloRequest.delete(`cards/${cardId}/attachments/${attachmentId}`);
  expect(response.status()).toBe(200);
  const getResp = await TrelloRequest.get(`cards/${cardId}/attachments/${attachmentId}`);
  expect([400, 404]).toContain(getResp.status());
  });
});
