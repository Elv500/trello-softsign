import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../utils/api/trello-request';
import { readState } from '../../utils/api/state-manager';
import { createBoardForSuite, deleteBoard } from '../../utils/api/base-helper';

let boardId: string;
let todoListId: string;
let cardId: string;

test.describe('CRUD de Board en Trello', () => {
  
  // Si desea crear y eliminar un board para esta suite
  test.beforeAll(async () => {
    const state = await createBoardForSuite('Board de Prueba API');
    boardId = state.boardId;
    todoListId = state.todoListId;
    cardId = state.cardId;
  });

  test.afterAll(async () => {
    await deleteBoard(boardId);
  });

  // Si se desea usar el board del setup global, descomentar este bloque
  // test.beforeAll(() => {
  //   const state = readState();
  //   boardId = state.boardId;
  //   todoListId = state.todoListId;
  // });

  
  // test('Recuperar board', async () => {
  //   const response = await TrelloRequest.get(`boards/${boardId}`);
  //   expect(response.status()).toBe(200);
  //   const data = await response.json();
  //   console.log(data);
  // });

  // test('Obtener listas del board', async () => {
  //   const response = await TrelloRequest.get(`boards/${boardId}/lists`);
  //   expect(response.status()).toBe(200);
  //   const data = await response.json();
    
  //   const todoList = data.find((list: any) => list.name === 'To Do');

  //   const idList = todoList.id;
  //   if(!todoList) {
  //     throw new Error('No se encontró la lista "To Do" en el board');
  //   }
  //   console.log(todoList);
  //   console.log(idList);

  // });

  // test('Crear board', async () => {
  //   const boardName = 'Nuevo Board desde API';
  //   const response = await TrelloRequest.post('boards', {
  //     name: boardName,
  //   });
  //   expect(response.status()).toBe(200);
  //   const data = await response.json();
  //   console.log(data);
  //   expect(data.name).toBe(boardName);
  // });

  test('Crear nuevo card en la lista To Do', async () => {
    const cardName = 'Nueva Card desde API';
    const response = await TrelloRequest.post('cards', {
      name: cardName,
      idList: todoListId,
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(todoListId);
    console.log(boardId);
    console.log(cardId);
    console.log(data);
    //expect(data.name).toBe(cardName);
    //expect(data.idList).toBe(todoListId);
  });
});