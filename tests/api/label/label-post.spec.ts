import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';
import { buildLabelPayload } from '../../../resources/payloads/label';
import { AssertionStatusCode } from '../../../assertions/assertions-status';

test.describe('Tests de creación de Labels en Trello', () => {
  
    let boardId: string;
    let todoListId: string;
    let cardId: string;

    test.beforeAll(async () => {
        const state = await createBoardForSuite('Board de Prueba API para Labels');
        boardId = state.boardId;
        todoListId = state.todoListId;
        cardId = state.cardId;
    });

    test.afterAll(async () => {
        await deleteBoard(boardId);
    });

    test('Crear Label completo', async () => {
        const payload = buildLabelPayload({ idBoard: boardId });
        AssertionLabel.assert_post_input_schema(payload);
        const response = await TrelloRequest.post('labels', payload);
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_post_output_schema(data);
        expect(data.idBoard).toBe(payload.idBoard);
        expect(data.name).toBe(payload.name);
        expect(data.color).toBe(payload.color);
        expect(data.uses).toBe(0);
    });

    test('Crear Label sin nombre', async () => {
        const payload = buildLabelPayload({ idBoard: boardId, name: '' });
        AssertionLabel.assert_post_input_schema(payload);
        const response = await TrelloRequest.post('labels', payload);
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_post_output_schema(data);
        expect(data.idBoard).toBe(payload.idBoard);
        expect(data.name).toBe('');
        expect(data.color).toBe(payload.color);
        expect(data.uses).toBe(0);
    });

    test('Crear Label sin color', async () => {
        const payload = buildLabelPayload({ idBoard: boardId, color: null });
        AssertionLabel.assert_post_input_schema(payload);
        const response = await TrelloRequest.post('labels', payload);
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_post_output_schema(data);
        expect(data.idBoard).toBe(payload.idBoard);
        expect(data.name).toBe(payload.name);
        expect(data.color).toBe(null);
        expect(data.uses).toBe(0);
    });

    test('Crear Label con color inválido', async () => {
        const payload = buildLabelPayload({ idBoard: boardId, color: 'invalid-color' });
        AssertionLabel.assert_post_input_schema(payload);
        const response = await TrelloRequest.post('labels', payload);
        AssertionStatusCode.assert_status_code_400(response.status());
        const data = await response.json();
        expect(data.message).toBe('invalid value for color');
    });

    test('Crear Label sin idBoard', async () => {
        const payload = buildLabelPayload({ idBoard: '' });
        AssertionLabel.assert_post_input_schema(payload);
        const response = await TrelloRequest.post('labels', payload);
        AssertionStatusCode.assert_status_code_400(response.status());
        const data = await response.json();
        expect(data.message).toBe('Invalid id');
    });

    test('Crear Label con idBoard inválido', async () => {
        const payload = buildLabelPayload({ idBoard: 'invalid-id' });
        AssertionLabel.assert_post_input_schema(payload);
        const response = await TrelloRequest.post('labels', payload);
        AssertionStatusCode.assert_status_code_400(response.status());
        const data = await response.json();
        expect(data.message).toBe('Invalid id');
    });

    test('Crear Label sin payload', async () => {
        const response = await TrelloRequest.post('labels', {});
        AssertionStatusCode.assert_status_code_400(response.status());
    });
});