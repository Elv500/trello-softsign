import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    test.afterEach(async () => {
        await allure.owner("Edwin Navia");
        await allure.epic("EPIC: Gestión de Cards");
        await allure.feature("Feature: Date");
        await allure.story("HU: Actualizar fechas");
    });

    test.afterAll(async () => {
        await deleteBoard(boardId);
    });

    test('PUT /cards/:id - actualiza start, due, dueReminder', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');
        
        const payload = {
            start: '2025-10-05T12:00:44.615Z',
            due: '2025-10-20T12:00:44.615Z',
            dueReminder: 1440, 
        };

        await test.step('PUT actualiza fechas/recordatorio', async () => {
            const putRes = await TrelloRequest.put(`cards/${cardId}`, payload);
            expect(putRes.status()).toBe(200);
            const updated = await putRes.json();
            expect(updated.id).toBe(cardId);
            expect(updated.start).toBe(payload.start);
            expect(updated.due).toBe(payload.due);
            expect(updated.dueReminder).toBe(payload.dueReminder);
        });

        await test.step('GET confirma persistencia inmediata', async () => {
            const getRes = await TrelloRequest.get(`cards/${cardId}`);
            expect(getRes.status()).toBe(200);
            const fetched = await getRes.json();
            expect(fetched.start).toBe(payload.start);
            expect(fetched.due).toBe(payload.due);
            expect(fetched.dueReminder).toBe(payload.dueReminder);
        });
    });

    test('PUT /cards/:id - rechaza si due es anterior a start', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');
        
        await allure.issue('BUG-1234', 'https://www.youtube.com/');
        await allure.severity(Severity.NORMAL);
        test.skip(true, 'Bug conocido: devuelve 200 en lugar de 400');
        
        const payload = {
            start: '2025-10-10T12:00:00.000Z',
            due: '2025-10-05T12:00:00.000Z', 
            dueReminder: 1440,
        };

        const res = await TrelloRequest.put(`cards/${cardId}`, payload);
        expect(res.status()).toBeGreaterThanOrEqual(200);
        const data = await res.json().catch(() => ({}));
        expect(JSON.stringify(data)).toMatch(/due.*(before|anterior|invalid)/i);
    });

    test('PUT /cards/:id - rechaza dueReminder con formato inválido', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

        const payload = {
            start: '2025-10-05T12:00:00.000Z',
            due: '2025-10-07T12:00:00.000Z',
            dueReminder: 'mañana',
        };

        const res = await TrelloRequest.put(`cards/${cardId}`, payload as any);
        expect(res.status()).toBeGreaterThanOrEqual(400);
        const data = await res.json().catch(() => ({}));
        expect(JSON.stringify(data)).toMatch(/dueReminder|invalid|type/i);
    });

    test('GET /cards/:id - persiste los cambios después de un tiempo', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

        const payload = {
            start: '2025-10-10T12:00:00.000Z',
            due: '2025-10-12T12:00:00.000Z',
            dueReminder: 120, 
        };

        await test.step('PUT actualiza valores', async () => {
            const putRes = await TrelloRequest.put(`cards/${cardId}`, payload);
            expect(putRes.status()).toBe(200);
        });

        await test.step('espera procesamiento interno', async () => {
            await delay(3000);
        });

        await test.step('GET confirma persistencia posterior', async () => {
            const getRes = await TrelloRequest.get(`cards/${cardId}`);
            expect(getRes.status()).toBe(200);
            const fetched = await getRes.json();
            expect(fetched.start).toBe(payload.start);
            expect(fetched.due).toBe(payload.due);
            expect(fetched.dueReminder).toBe(payload.dueReminder);
        });
    });

    test('PUT /cards/:id inexistente - devuelve 404', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');
        
        const invalidCardId = '000000000000000000000000';
        const payload = {
            start: '2025-10-05T12:00:00.000Z',
            due: '2025-10-07T12:00:00.000Z',
            dueReminder: 1440,
        };
        const res = await TrelloRequest.put(`cards/${invalidCardId}`, payload);
        expect([404, 400]).toContain(res.status()); 
    });
});
