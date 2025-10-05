import { loadRandomImageFromJson } from '../../../utils/api/image-loader';
import { test, expect } from '@playwright/test';
import { readState } from '../../../utils/api/state-manager';
import { createCard } from '../../../utils/api/card-helper';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';
import { TrelloRequest } from '../../../utils/api/trello-request';


// TC: Eliminar un attachment específico de una card
// Tipo de prueba: smoke
test('[smoke] Delete attachment by id from card', async () => {
  const { todoListId } = readState();
  const { url, name } = loadRandomImageFromJson();
  // Crear card y adjuntar imagen
  const cardData = await createCard(`Card for DELETE attachment: ${name}`, todoListId);
  const cardId = cardData.id;
  const attachData = await attachUrlToCard(cardId, url, `Attachment for DELETE: ${name}`);
  const attachmentId = attachData.id;
  // Hacer DELETE del attachment
  const response = await TrelloRequest.delete(`cards/${cardId}/attachments/${attachmentId}`);
  expect(response.status()).toBe(200);
  // (Opcional) Intentar obtener el attachment y esperar 404
  const getResp = await TrelloRequest.get(`cards/${cardId}/attachments/${attachmentId}`);
  expect([400, 404]).toContain(getResp.status());
});
