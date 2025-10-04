import { request, FullConfig } from '@playwright/test';
import { authParams } from './auth/api/auth-params';
import fs from 'fs';
import path from 'path';

export async function apiGlobalSetup(config: FullConfig) {
  console.log('Iniciando global-setup');

  const api = await request.newContext({
    baseURL: process.env.BASE_URL,
  });

  //Verificacion de credenciales
  const check = await api.get('emoji', { params: authParams() });
  if (check.status() !== 200) {
    throw new Error(`No se pudo autenticar en Trello API. Status: ${check.status()}`);
  }
  console.log('Credenciales válidas para Trello');

  //Crear un board para los tests
  const createBoard = await api.post('boards', {
    params: authParams(),
    data: { name: 'Board global setup' },
  });
  if (createBoard.status() !== 200) {
    throw new Error(`No se pudo crear board en global-setup. Status: ${createBoard.status()}`);
  }

  const board = await createBoard.json();
  console.log(`Board creado en global-setup: ${board.id}`);

  //Obtener el id de la lista "To Do" del board creado
  const getLists = await api.get(`boards/${board.id}/lists`, { params: authParams() });
  if (getLists.status() !== 200) {
    throw new Error(`No se pudieron obtener las listas del board en global-setup. Status: ${getLists.status()}`);
  }

  const lists = await getLists.json();
  const todoList = lists.find((list: any) => list.name === 'To Do');
  if (!todoList) {
    throw new Error('No se encontró la lista "To Do" en el board');
  }
  console.log(`ID de la lista "To Do": ${todoList.id}`);
  
  //Guardar el boardId y todoListId en un archivo JSON para usarlos en los tests
  const statePath = path.join(__dirname, 'trello-state.json');
  fs.writeFileSync(statePath, JSON.stringify({ boardId: board.id, todoListId: todoList.id}, null, 2));
}

//export default apiGlobalSetup;