import { test, expect } from "@playwright/test";
import { TrelloDataGenerator } from "../../utils/ui/trelloDataGenerator";
import { DashboardPage } from "../../pages/dashboardPage";
import { BoardPage } from "../../pages/boardPage";
import * as allure from 'allure-js-commons';

test.describe("Board Management Test Suite - Creation, Modification and Navigation", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
  });

  test.afterEach(async ({ page }) => {
    await dashboardPage.deleteBoard();
  });

  test('TC001 - Verify successful board creation with default lists and basic card functionality', async ({ page }) => {
   await allure.tags('smoke', 'regression', 'ui');
    test.setTimeout(60000);

    const boardName = TrelloDataGenerator.generateBoardName();
    const cardName = TrelloDataGenerator.generateCardName();
    
    await test.step("Create board", async () => {
      await dashboardPage.createNewBoard(boardName);
    });

    const boardPage = new BoardPage(page);

    await test.step('Create lists (To Do, In Progress, Done)', async () => {
      await boardPage.createList(cardName);
    });

    await test.step('Create basic card in To Do list', async () => {
      await boardPage.createCard(cardName);
    });

    await test.step('Validate card was created', async () => {
      await boardPage.validateCardIsVisible(cardName);
    });
  });

  test('TC002 - Verify creation of multiple cards across different board lists (To Do, In Progress, Done)', async ({ page }) => {
   await allure.tags('smoke', 'regression', 'ui');
    test.setTimeout(60000);

    const boardName = TrelloDataGenerator.generateBoardName();
    const cardName1 = TrelloDataGenerator.generateCardName();
    const cardName2 = TrelloDataGenerator.generateCardName();
    const cardName3 = TrelloDataGenerator.generateCardName();
    
    await test.step("Create board", async () => {
      await dashboardPage.createNewBoard(boardName);
    });

    const boardPage = new BoardPage(page);

    await test.step('Create lists', async () => {
      await boardPage.createList("temp");
    });

    await test.step('Create card in To Do', async () => {
      await boardPage.createCard(cardName1);
    });

    await test.step('Create card in In Progress', async () => {
      await boardPage.createCardInList(cardName2, "In Progress");
    });

    await test.step('Create card in Done', async () => {
      await boardPage.createCardInList(cardName3, "Done");
    });

    await test.step('Validate all cards were created', async () => {
      await boardPage.validateMultipleCards(cardName1, cardName2, cardName3);
    });

  });

   test('TC003 - Verify board name modification functionality and validation', async ({ page }) => {
   await allure.tags('smoke', 'regression', 'ui');
    test.setTimeout(60000);

    const boardName = TrelloDataGenerator.generateBoardName();
    const newBoardName = TrelloDataGenerator.generateBoardName();

    
    await test.step("Create board", async () => {
      await dashboardPage.createNewBoard(boardName);
    });

    const boardPage = new BoardPage(page);

    await test.step('Edit Board Name', async () => {
      await boardPage.editBoardName(newBoardName);
    });

    await test.step('Validate Board Name Change', async () => {
      await boardPage.validateBoardName(newBoardName);
    });
  });

  test('TC004 - Verify inbox menu accessibility and proper display from board interface', async ({ page }) => {
   await allure.tags('smoke', 'regression', 'ui');
    test.setTimeout(60000);

      const boardName = TrelloDataGenerator.generateBoardName();
      const newBoardName = TrelloDataGenerator.generateBoardName();

      
      await test.step("Create board", async () => {
        await dashboardPage.createNewBoard(boardName);
      });

      const boardPage = new BoardPage(page);

      await test.step('Open Inbox Menu', async () => {
        await boardPage.openInboxMenu();
      });

      await test.step('Validate Inbox Menu Display', async () => {
        await boardPage.validateOpenInboxMenu();
      });
    });

  test('TC005 - Verify planner menu accessibility and proper visualization from board interface', async ({ page }) => {
   await allure.tags('smoke', 'regression', 'ui');
    test.setTimeout(60000);

      const boardName = TrelloDataGenerator.generateBoardName();
      const newBoardName = TrelloDataGenerator.generateBoardName();

      
      await test.step("Create board", async () => {
        await dashboardPage.createNewBoard(boardName);
      });

      const boardPage = new BoardPage(page);

      await test.step('Open Planner Menu', async () => {
        await boardPage.openPlannerMenu();
      });

      await test.step('Validate Planner Menu Display', async () => {
        await boardPage.validateOpenPlannerMenu();
      });
    });

});
