import { TrelloRequest } from './trello-request';

export async function attachUrlToCard(cardId: string, url: string, name: string) {
  const formData = { url, name };
  const response = await TrelloRequest.postFormData(`cards/${cardId}/attachments`, formData);
  if (response.status() !== 200) throw new Error('No se pudo adjuntar la imagen');
  return await response.json();
}
