import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import * as fs from 'fs';
import path from 'path';
// ...

test('Adjuntar imagen a una card', async () => {
  const filePath = path.resolve(__dirname, '../assets/test-image.jpg');
  const fileBuffer = fs.readFileSync(filePath);

  // TODO: Asigna aquí el ID de la card a la que quieres adjuntar la imagen
  const cardId = 'TU_CARD_ID_AQUI';

  const formData = {
    file: {
      value: fileBuffer,
      options: {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      }
    },
    name: 'Adjunto Playwright'
  };

  const response = await TrelloRequest.postFormData(`cards/${cardId}/attachments`, formData);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('url');
  expect(data).toHaveProperty('name', 'Adjunto Playwright');
});