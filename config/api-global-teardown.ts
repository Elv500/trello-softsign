import { request } from '@playwright/test';
import { authParams } from './auth/api/auth-params';
import fs from 'fs';
import path from 'path';

export async function apiGlobalTeardown() {
  console.log('>>>Ejecutando global-teardown - API<<<');

  const statePath = path.join(__dirname, 'trello-state.json');
  if (!fs.existsSync(statePath)) {
    //console.log('No se encontró trello-state.json, nada que limpiar.');
    return;
  }

  const { boardId } = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

  if (!boardId) {
    console.log('No boardId encontrado en state, nada que borrar.');
    return;
  }

  const api = await request.newContext({ baseURL: process.env.BASE_URL });
  const resp = await api.delete(`boards/${boardId}`, { params: authParams() });

  // if (resp.status() === 200) {
  //   console.log(`Board eliminado en teardown: ${boardId}`);
  // } else {
  //   console.log(`Error al eliminar board ${boardId}, status: ${resp.status()}`);
  // }

  console.log('>>>Global-teardown - API completado correctamente<<<');
  //fs.unlinkSync(statePath);
}

//export default apiGlobalTeardown;