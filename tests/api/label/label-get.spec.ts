import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';
import { buildLabelPayload } from '../../../resources/payloads/label';
import { AssertionStatusCode } from '../../../assertions/assertions-status';
import * as allure from 'allure-js-commons';

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

    test.afterEach(async () => {
        await allure.owner("Elvis Alvarez");
        await allure.epic("EPIC: Gestión de Cards");
        await allure.feature("Feature: Label");
        await allure.story("HU: Obtener Label");
    });

    test.afterAll(async () => {
        await deleteBoard(boardId);
    });

    test('Obtener Label existente', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');
        
        const response = await TrelloRequest.get(`labels/${labelData.id}`);
        AssertionStatusCode.assert_status_code_200(response.status());
        expect(response.status()).toBe(200);
        const data = await response.json();
        AssertionLabel.assert_get_output_schema(data);
        expect(data.id).toBe(labelData.id);
        expect(data.idBoard).toBe(labelData.idBoard);
        expect(data.name).toBe(labelData.name);
        expect(data.color).toBe(labelData.color);
    });

    test('Obtener Label inexistente', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

        const response = await TrelloRequest.get('labels/invalid_id123');
        AssertionStatusCode.assert_status_code_400(response.status());
    });

    test('Obtener Label sin ID', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

        const response = await TrelloRequest.get('labels/');
        AssertionStatusCode.assert_status_code_404(response.status());
    });

    test('Obtener Labels de un Board', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

        const response = await TrelloRequest.get(`boards/${boardId}/labels`);
        AssertionStatusCode.assert_status_code_200(response.status());
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        AssertionLabel.assert_get_list_schema(data);
    });

    test('Obtener Labels de un Board inexistente', async () => {
        await allure.tags('smoke', 'regression', 'api', 'cards', 'date');

        const response = await TrelloRequest.get('boards/invalid_board_id/labels');
        AssertionStatusCode.assert_status_code_400(response.status());
    });
});