import { test, expect } from '@playwright/test';
import { TrelloRequest } from '../../../utils/api/trello-request';
import { createBoardForSuite, deleteBoard } from '../../../utils/api/base-helper';
import { LabelHelper } from '../../../utils/api/label-helper';
import { AssertionLabel } from '../../../assertions/assertions-label';

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

    // Crear label con nombre y color validos
    test('Crear Label', async () => {
        const labelName = 'Label Test';
        const labelColor = LabelHelper.getValidColor();

        const payload = {
            name: labelName,
            color: labelColor,
            idBoard: boardId
        }

        AssertionLabel.assert_post_input_schema(payload);

        const response = await TrelloRequest.post('labels', {
            name: labelName,
            color: labelColor,
            idBoard: boardId
        });
        expect(response.status()).toBe(200);
        const data = await response.json();

        AssertionLabel.assert_post_output_schema(data);

        expect(data.idBoard).toBe(boardId);
        expect(data.name).toBe(labelName);
        expect(data.color).toBe(labelColor);
        expect(data.uses).toBe(0);

        // Guardar el id del label creado
        // const state = readState();
        // state.labelId = data.id;
    });
});