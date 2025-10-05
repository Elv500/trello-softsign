import { TrelloRequest } from './trello-request';

export async function createCard(name: string, idList: string) {
  const response = await TrelloRequest.post('cards', { name, idList });
  if (response.status() !== 200) throw new Error('No se pudo crear la card');
  return await response.json();
}
