
import { loadRandomImageFromJson } from '../../../utils/api/image-loader';
import { test, expect } from '@playwright/test';
import { readState } from '../../../utils/api/state-manager';
import { createCard } from '../../../utils/api/card-helper';
import { attachUrlToCard } from '../../../utils/api/attachment-helper';

//TC: Adjuntar imagen aleatoria a una card
test ('Attach random image to a card', async () => {
  const { todoListId } = readState();
  const { url, name } = loadRandomImageFromJson();
  const cardData = await createCard(`Card for random image: ${name}`, todoListId);
  const cardId = cardData.id;
  const attachData = await attachUrlToCard(cardId, url, `Random Image Attachment: ${name}`);
  expect(attachData).toHaveProperty('url');
  expect(attachData).toHaveProperty('name', `Random Image Attachment: ${name}`);
});


// TC: Adjuntar varias imágenes diferentes a la misma card
test('Attach multiple different images to the same card', async () => {
  const { todoListId } = readState();
  const cardData = await createCard('Card for multiple attachments', todoListId);
  const cardId = cardData.id;
  for (let i = 0; i < 3; i++) {
    const { url, name } = loadRandomImageFromJson();
    const attachData = await attachUrlToCard(cardId, url, `Attachment ${i + 1}: ${name}`);
    expect(attachData).toHaveProperty('url');
    expect(attachData).toHaveProperty('name', `Attachment ${i + 1}: ${name}`);
  }
});

// TC: Adjuntar imágenes de diferentes extensiones
test('Attach images with different extensions', async () => {
  const { todoListId } = readState();
  // Puedes agregar más imágenes de diferentes extensiones en tu JSON
  const { url, name } = loadRandomImageFromJson();
  const cardData = await createCard(`Card for extension: ${name}`, todoListId);
  const cardId = cardData.id;
  const attachData = await attachUrlToCard(cardId, url, `Attachment extension: ${name}`);
  expect(attachData).toHaveProperty('url');
  expect(attachData).toHaveProperty('name', `Attachment extension: ${name}`);
});

// TC: Adjuntar imagen con nombre personalizado
test('Attach image with custom name', async () => {
  const { todoListId } = readState();
  const { url } = loadRandomImageFromJson();
  const cardData = await createCard('Card for custom name', todoListId);
  const cardId = cardData.id;
  const customName = 'My Custom Attachment Name';
  const attachData = await attachUrlToCard(cardId, url, customName);
  expect(attachData).toHaveProperty('url');
  expect(attachData).toHaveProperty('name', customName);
});

// TC: Adjuntar imágenes a diferentes cards
test('Attach images to different cards', async () => {
  const { todoListId } = readState();
  for (let i = 0; i < 2; i++) {
    const { url, name } = loadRandomImageFromJson();
    const cardData = await createCard(`Card ${i + 1} for attachment`, todoListId);
    const cardId = cardData.id;
    const attachData = await attachUrlToCard(cardId, url, `Attachment for card ${i + 1}: ${name}`);
    expect(attachData).toHaveProperty('url');
    expect(attachData).toHaveProperty('name', `Attachment for card ${i + 1}: ${name}`);
  }
});

// TC: Adjuntar imagen con URL inválida
test('Attach image with invalid URL', async () => {
  const { todoListId } = readState();
  const cardData = await createCard('Card for invalid URL', todoListId);
  const cardId = cardData.id;
  const invalidUrl = 'https://invalid-url.com/not-an-image.jpg';
  let error = null;
  try {
    await attachUrlToCard(cardId, invalidUrl, 'Invalid URL Attachment');
  } catch (e) {
    error = e;
  }
  expect(error).not.toBeNull();
});

// TC: Adjuntar imagen sin URL
test('Attach image with empty URL', async () => {
  const { todoListId } = readState();
  const cardData = await createCard('Card for empty URL', todoListId);
  const cardId = cardData.id;
  let error = null;
  try {
    await attachUrlToCard(cardId, '', 'Empty URL Attachment');
  } catch (e) {
    error = e;
  }
  expect(error).not.toBeNull();
});

// TC: Adjuntar imagen a una card inexistente
test('Attach image to non-existent card', async () => {
  const fakeCardId = '1234567890abcdef';
  const { url, name } = loadRandomImageFromJson();
  let error = null;
  try {
    await attachUrlToCard(fakeCardId, url, `Attachment to fake card: ${name}`);
  } catch (e) {
    error = e;
  }
  expect(error).not.toBeNull();
});

// TC: Adjuntar imagen con nombre vacío
test('Attach image with empty name', async () => {
  const { todoListId } = readState();
  const { url } = loadRandomImageFromJson();
  const cardData = await createCard('Card for empty name', todoListId);
  const cardId = cardData.id;
  let error = null;
  try {
    await attachUrlToCard(cardId, url, '');
  } catch (e) {
    error = e;
  }
  expect(error).not.toBeNull();
});

// TC: Adjuntar imagen con nombre muy largo
test('Attach image with very long name', async () => {
  const { todoListId } = readState();
  const { url } = loadRandomImageFromJson();
  const cardData = await createCard('Card for long name', todoListId);
  const cardId = cardData.id;
  const longName = 'A'.repeat(300);
  let error = null;
  try {
    await attachUrlToCard(cardId, url, longName);
  } catch (e) {
    error = e;
  }
  expect(error).not.toBeNull();
});

// TC: Adjuntar imagen muy grande
test('Attach very large image', async () => {
  const { todoListId } = readState();
  // Debes agregar una URL de imagen grande en tu JSON para este caso
  const largeImage = { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', name: 'Large Image' };
  const cardData = await createCard('Card for large image', todoListId);
  const cardId = cardData.id;
  const attachData = await attachUrlToCard(cardId, largeImage.url, `Attachment: ${largeImage.name}`);
  expect(attachData).toHaveProperty('url');
  expect(attachData).toHaveProperty('name', `Attachment: ${largeImage.name}`);
});

// TC: Adjuntar la misma imagen dos veces a la misma card
test('Attach the same image twice to the same card', async () => {
  const { todoListId } = readState();
  const { url, name } = loadRandomImageFromJson();
  const cardData = await createCard('Card for duplicate attachment', todoListId);
  const cardId = cardData.id;
  const attachData1 = await attachUrlToCard(cardId, url, `Duplicate 1: ${name}`);
  expect(attachData1).toHaveProperty('url');
  expect(attachData1).toHaveProperty('name', `Duplicate 1: ${name}`);
  const attachData2 = await attachUrlToCard(cardId, url, `Duplicate 2: ${name}`);
  expect(attachData2).toHaveProperty('url');
  expect(attachData2).toHaveProperty('name', `Duplicate 2: ${name}`);
});