import { request } from "@playwright/test";
import { authParams } from "../../config/auth/api/auth-params";

export async function createCardUtils(name: string,  idList: string) {
  const api = await request.newContext({ baseURL: process.env.BASE_URL });

  const cardResp = await api.post("cards", {
    params: authParams(),
    data: { name, idList },
  });
  const card = await cardResp.json();

  return { cardId: card.id, cardUrl: card.url };
}