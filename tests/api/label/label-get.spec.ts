import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { LabelHelper } from '../../../utils/api/label-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';
import { buildLabelPayload } from '../../../resources/payloads/label';

test.describe('Tests de obtencion de Labels en Trello', () => {
  
    let boardId: string;
    let todoListId: string;
    let cardId: string;
    let labelData: any;

    test.beforeAll(async () => {
        const state = await createBoardForSuite('Board de Prueba API para Labels');
        boardId = state.boardId;
        todoListId = state.todoListId;
        cardId = state.cardId;

        const label = await TrelloRequest.post('labels', buildLabelPayload({ idBoard: boardId }));
        const labelJson = await label.json();
        labelData = labelJson;
    });

    test.afterAll(async () => {
        await deleteBoard(boardId);
    });

    test('Obtener Label existente', async () => {
        const response = await TrelloRequest.get(`labels/${labelData.id}`);
        expect(response.status()).toBe(200);
        const data = await response.json();
        AssertionLabel.assert_get_output_schema(data);
        expect(data.id).toBe(labelData.id);
        expect(data.idBoard).toBe(labelData.idBoard);
        expect(data.name).toBe(labelData.name);
        expect(data.color).toBe(labelData.color);
    });

    test('Obtener Label inexistente', async () => {
        const response = await TrelloRequest.get('labels/invalid_id123');
        expect(response.status()).toBe(400);
    });

    test('Obtener Label sin ID', async () => {
        const response = await TrelloRequest.get('labels/');
        expect(response.status()).toBe(404);
    });

    test('Obtener Labels de un Board', async () => {
        const response = await TrelloRequest.get(`boards/${boardId}/labels`);
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        AssertionLabel.assert_get_list_schema(data);
    });

    test('Obtener Labels de un Board inexistente', async () => {
        const response = await TrelloRequest.get('boards/invalid_board_id/labels');
        expect(response.status()).toBe(400);
    });
});