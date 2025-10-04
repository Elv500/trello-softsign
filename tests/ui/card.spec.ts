import { test, expect } from "@playwright/test";
import { TrelloDataGenerator } from "../../utils/ui/trelloDataGenerator";
import { DashboardPage } from "../../pages/dashboardPage";
import { CardPage } from "../../pages/cardPage";

test.describe("Card Advanced Features Test Suite - Attachments, Dates, Checklists and Labels", () => {
  let dashboardPage: DashboardPage;
  let cardPage: CardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
    
    // Setup: Create board and basic card for testing card functionalities
    const boardName = TrelloDataGenerator.generateBoardName();
    await dashboardPage.createNewBoard(boardName);
    await page.waitForTimeout(3000);
    
    cardPage = new CardPage(page);
    await cardPage.createBasicListsAndCard();
  });

  test.afterEach(async ({ page }) => {
    await dashboardPage.deleteBoard();
  });

  // Array de tipos de archivo para testear
  const fileTypes = [
    { 
      type: 'Image', 
      method: 'addCardFilesImage',
      description: 'TC006 - Verify successful image file attachment upload to card with validation'
    },
    { 
      type: 'JSON', 
      method: 'addCardFilesJson',
      description: 'TC007 - Verify successful JSON file attachment upload to card with validation'
    }
  ];

  // Generar un test para cada tipo de archivo
  fileTypes.forEach(({ type, method, description }) => {
    test(description, async ({ page }) => {
      test.setTimeout(60000);

      const cardName = TrelloDataGenerator.generateCardName();
      
      await test.step('Create test card', async () => {
        await cardPage.createCard(cardName);
      });

      await test.step(`Add ${type} File`, async () => {
        await (cardPage as any)[method](cardName);
        await page.waitForTimeout(2000);
      });

      await test.step('Validate Uploaded File', async () => {
        await cardPage.validateUploadedFile();
      });
    });
  });

  test('TC008 - Verify due date assignment functionality with start date and reminder configuration', async ({ page }) => {
    test.setTimeout(60000);
    
    const cardName = TrelloDataGenerator.generateCardName();
    
    await test.step('Create test card', async () => {
      await cardPage.createCard(cardName);
    });

    await test.step('Add specific date to card', async () => {
      await cardPage.addCardDate(cardName);
    });

    await test.step('Validate Card Date', async () => {
      await cardPage.validateCardDate();
    });
  });

  test('TC009 - Verify checklist creation with multiple items and completion status functionality', async ({ page }) => {
    test.setTimeout(60000);
    
    const cardName = TrelloDataGenerator.generateCardName();
    
    await test.step('Create test card', async () => {
      await cardPage.createCard(cardName);
    });

    await test.step('Add checklist to card', async () => {
      await cardPage.addCardChecklist(cardName);
    });

    await test.step('Validate Card Checklist', async () => {
      await cardPage.validateCardChecklist();
    });
  });

  test('TC010 - Verify label assignment functionality and visual identification on cards', async ({ page }) => {
    test.setTimeout(60000);
    
    const cardName = TrelloDataGenerator.generateCardName();
    
    await test.step('Create test card', async () => {
      await cardPage.createCard(cardName);
    });

    await test.step('Add labels to card', async () => {
      await cardPage.addLabelsToCard(cardName);
    });

    await test.step('Validate Card Labels', async () => {
      await cardPage.validateCardLabels();
    });
  });
});