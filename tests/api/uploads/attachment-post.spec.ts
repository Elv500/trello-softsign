import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { readState } from '../../../utils/api/state-manager';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { randomAttachmentByUrl } from '../../../resources/payloads/attachment/attachment';
import { buildAttachmentInput } from '../../../utils/api/attachment-payload';
import { AssertionAttachment } from '../../../assertions/attachment-assertions/assertion-attachment';

let cardId: string;

test.describe('Attachment POST tests', () => {
  test.beforeAll(async () => {
    const { todoListId } = readState();
    const createCardResp = await TrelloRequest.post('cards', {
      name: 'Card for attachment POST',
      idList: todoListId,
    });
    expect(createCardResp.status()).toBe(200);
    const cardData = await createCardResp.json();
    cardId = cardData.id;
  });

  // TC: Adjuntar imagen aleatoria a la card creada en el setup
  test('Attach random image to the setup card', async () => {
    const { url, name, setCover } = randomAttachmentByUrl();
    const inputPayload = buildAttachmentInput(cardId, { url, name, setCover }, { validate: true });
    const attachData = await attachUrlToCard(cardId, url, name);
    expect(attachData).toHaveProperty('url');
    expect(attachData).toHaveProperty('name', name);
  });
});