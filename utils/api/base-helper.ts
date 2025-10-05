import { request } from "@playwright/test";
import { authParams } from "../../config/auth/api/auth-params";

// Crear el board
export async function createBoardForSuite(name: string) {
  const api = await request.newContext({ baseURL: process.env.BASE_URL });

  const boardResp = await api.post("boards", {
    params: authParams(),
    data: { name },
  });
  const board = await boardResp.json();

  //Obtener la lista "To Do"
  const listsResp = await api.get(`boards/${board.id}/lists`, {
    params: authParams(),
  });
  const lists = await listsResp.json();
  const todoList = lists.find((l: any) => l.name === "To Do");

  //Crear un card en la lista "To Do"
  const cardRes = await api.post(`lists/${todoList.id}/cards`, {
    params: authParams(),
    data: { name: "Card Test" },
  });
  const card = await cardRes.json();

  //Guardando el id del board, de la lista "To Do" y del card creado
  return { boardId: board.id, todoListId: todoList.id, cardId: card.id };
}

//Eliminar board
export async function deleteBoard(boardId: string) {
  const api = await request.newContext({ baseURL: process.env.BASE_URL });
  await api.delete(`boards/${boardId}`, { params: authParams() });
}