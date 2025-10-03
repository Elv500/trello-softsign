import { request, FullConfig } from '@playwright/test';
import { authParams } from './auth/api/auth-params';
import fs from 'fs';
import path from 'path';

export async function apiGlobalSetup(config: FullConfig) {
  console.log('Iniciando global-setup');

  const api = await request.newContext({
    baseURL: process.env.BASE_URL,
  });

  const check = await api.get('emoji', { params: authParams() });
  if (check.status() !== 200) {
    throw new Error(`No se pudo autenticar en Trello API. Status: ${check.status()}`);
  }
  console.log('Credenciales válidas para Trello');

  const createBoard = await api.post('boards', {
    params: authParams(),
    data: { name: 'Board global setup' },
  });
  if (createBoard.status() !== 200) {
    throw new Error(`No se pudo crear board en global-setup. Status: ${createBoard.status()}`);
  }

  const board = await createBoard.json();
  console.log(`Board creado en global-setup: ${board.id}`);

  const statePath = path.join(__dirname, 'trello-state.json');
  fs.writeFileSync(statePath, JSON.stringify({ boardId: board.id }, null, 2));
}

//export default apiGlobalSetup;