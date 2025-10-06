import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';
import { buildLabelPayload } from '../../../resources/payloads/label';
import { AssertionStatusCode } from '../../../assertions/assertions-status';

test.describe('Tests de actualización de Labels en Trello', () => {
  
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

    test('Modificar el nombre de una Label', async () => {
        const newName = 'Label Modificada';
        const response = await TrelloRequest.put(`labels/${labelData.id}`, { name: newName });
        AssertionLabel.assert_put_input_schema({ name: newName });
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_put_output_schema(data);
        expect(data.name).toBe(newName);
    });

    test('Modificar el color de una Label', async () => {
        const newColor = 'blue';
        const response = await TrelloRequest.put(`labels/${labelData.id}`, { color: newColor });
        AssertionLabel.assert_put_input_schema({ color: newColor });
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_put_output_schema(data);
        expect(data.color).toBe(newColor);
    });

    test('Modificar el nombre y color de una Label', async () => {
        const newName = 'Label Final';
        const newColor = 'green';
        const response = await TrelloRequest.put(`labels/${labelData.id}`, { name: newName, color: newColor });
        AssertionLabel.assert_put_input_schema({ name: newName, color: newColor });
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_put_output_schema(data);
        expect(data.name).toBe(newName);
        expect(data.color).toBe(newColor);
    });

    test('Modificar una Label con datos inválidos', async () => {
        const response = await TrelloRequest.put(`labels/${labelData.id}`, { color: 'invalidColor' });
        AssertionStatusCode.assert_status_code_400(response.status());
    });

    test('Modificar una Label que no existe', async () => {
        const response = await TrelloRequest.put(`labels/invalidId`, { name: 'No Existe' });
        AssertionStatusCode.assert_status_code_404(response.status());
    });
    
    test('Modificar una Label sin enviar datos', async () => {
        const response = await TrelloRequest.put(`labels/${labelData.id}`, {});
        AssertionLabel.assert_put_input_schema({});
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        AssertionLabel.assert_put_output_schema(data);
        expect(data.name).toBe(labelData.name);
        expect(data.color).toBe(labelData.color);
    });
    
});