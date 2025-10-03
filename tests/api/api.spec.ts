import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../utils/api/trello-request';
import { readState } from '../../utils/api/state-manager';

let boardId: string;

test.describe('CRUD de Board en Trello', () => {
  test.beforeAll(() => {
    const state = readState();
    boardId = state.boardId;
  });

  test('Recuperar board', async () => {
    const response = await TrelloRequest.get(`boards/${boardId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
  });

  test('Crear board', async () => {
    const boardName = 'Nuevo Board desde API';
    const response = await TrelloRequest.post('boards', {
      name: boardName,
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    expect(data.name).toBe(boardName);
  });
});