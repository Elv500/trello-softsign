// tests/api/cards/cards-update-dates.spec.ts
import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';

test.describe('Cards | Actualizar fechas y recordatorio', () => {
    let boardId: string;
    let todoListId: string;
    let cardId: string;

    test.beforeAll(async () => {
        const state = await createBoardForSuite('Board de Prueba API para Cards');
        boardId = state.boardId;
        todoListId = state.todoListId;
        cardId = state.cardId;
    });

    test.afterAll(async () => {
        await deleteBoard(boardId);
    });

    test('PUT /cards/:id - actualiza start, due, dueReminder y desc', async () => {
        const payload = {
            start: '2025-10-05T12:00:44.615Z',
            due: '2025-10-09T12:00:44.615Z', 
            dueReminder: 1440           
        };

        const putRes = await TrelloRequest.put(`cards/${cardId}`, payload);
        expect(putRes.status(), 'PUT debe responder 200').toBe(200);

        const updated = await putRes.json();

        expect(updated.id).toBe(cardId);

        expect(updated.start).toBe(payload.start);
        expect(updated.due).toBe(payload.due);

        expect(updated.dueReminder).toBe(payload.dueReminder);

        const getRes = await TrelloRequest.get(`cards/${cardId}`);
        expect(getRes.status(), 'GET debe responder 200').toBe(200);

        const fetched = await getRes.json();
        expect(fetched.start).toBe(payload.start);
        expect(fetched.due).toBe(payload.due);
        expect(fetched.dueReminder).toBe(payload.dueReminder);
    });
});
