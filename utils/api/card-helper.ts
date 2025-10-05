import { request } from "@playwright/test";
import { authParams } from "../../config/auth/api/auth-params";

export async function createCardUtils(name: string, idList: string) {
  const api = await request.newContext({ baseURL: process.env.BASE_URL });

  const cardResp = await api.post("cards", {
    params: authParams(),
    data: { name, idList },
  });

  if (cardResp.status() !== 200) {
    const errorBody = await cardResp.text();
    throw new Error(`Error al crear la tarjeta. Status: ${cardResp.status()}, Body: ${errorBody}`);
  }

  const card = await cardResp.json();
  return card
}
