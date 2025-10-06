import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';
import { buildLabelPayload } from '../../../resources/payloads/label';
import { AssertionStatusCode } from '../../../assertions/assertions-status';

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
        AssertionStatusCode.assert_status_code_200(response.status());
        AssertionLabel.assert_delete_output_schema(await response.json());
    });

    test('Eliminar una Label inexistente', async () => {
        const response = await TrelloRequest.delete(`labels/1234567890abcdef12345678`);
        AssertionStatusCode.assert_status_code_404(response.status());
    });

    test('Eliminar una Label ya eliminada', async () => {
        const firstResponse = await TrelloRequest.delete(`labels/${labelData.id}`);
        AssertionStatusCode.assert_status_code_200(firstResponse.status());
        AssertionLabel.assert_delete_output_schema(await firstResponse.json());
        const secondResponse = await TrelloRequest.delete(`labels/${labelData.id}`);
        AssertionStatusCode.assert_status_code_404(secondResponse.status());
    });

    test('Eliminar una Label sin enviar ID', async () => {
        const response = await TrelloRequest.delete(`labels/`);
        AssertionStatusCode.assert_status_code_404(response.status());
    });

    test('Eliminar una Label con ID inválido', async () => {
        const response = await TrelloRequest.delete(`labels/invalidId`);
        AssertionStatusCode.assert_status_code_400(response.status());
    });
});