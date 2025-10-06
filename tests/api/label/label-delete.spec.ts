import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { LabelHelper } from '../../../utils/api/label-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';
import { buildLabelPayload } from '../../../resources/payloads/label';

test.describe('Tests de eliminación de Labels en Trello', () => {
  
    let boardId: string;
    let todoListId: string;
    let cardId: string;
    let labelData: any;

    test.beforeAll(async () => {
        const state = await createBoardForSuite('Board de Prueba API para Labels');
        boardId = state.boardId;
        todoListId = state.todoListId;
        cardId = state.cardId;
    });

    test.beforeEach(async () => {
        const label = await TrelloRequest.post('labels', buildLabelPayload({ idBoard: boardId }));
        const labelJson = await label.json();
        labelData = labelJson;
    });

    test.afterAll(async () => {
        await deleteBoard(boardId);
    });

    test('Eliminar una Label', async () => {
        const response = await TrelloRequest.delete(`labels/${labelData.id}`);
        expect(response.status()).toBe(200);
        AssertionLabel.assert_delete_output_schema(await response.json());
    });

    test('Eliminar una Label inexistente', async () => {
        const response = await TrelloRequest.delete(`labels/1234567890abcdef12345678`);
        expect(response.status()).toBe(404);
    });

    test('Eliminar una Label ya eliminada', async () => {
        const firstResponse = await TrelloRequest.delete(`labels/${labelData.id}`);
        expect(firstResponse.status()).toBe(200);
        AssertionLabel.assert_delete_output_schema(await firstResponse.json());
        const secondResponse = await TrelloRequest.delete(`labels/${labelData.id}`);
        expect(secondResponse.status()).toBe(404);
    });

    test('Eliminar una Label sin enviar ID', async () => {
        const response = await TrelloRequest.delete(`labels/`);
        expect(response.status()).toBe(404);
    });

    test('Eliminar una Label con ID inválido', async () => {
        const response = await TrelloRequest.delete(`labels/invalidId`);
        expect(response.status()).toBe(400);
    });
});