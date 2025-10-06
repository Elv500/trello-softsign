import { TrelloRequest } from "./trello-request";
export async function createCardUtils(name: string, idList: string) {
  const payload = { name, idList };
  const response = await TrelloRequest.post("cards", payload);
  const data = await response.json();

  return {
    cardId: data.id,
    cardName: data.name,
    idList: data.idList,
  };
}