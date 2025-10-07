import { test, expect } from "@playwright/test";
import { TrelloDataGenerator } from "../../utils/ui/trelloDataGenerator";
import { DashboardPage } from "../../pages/dashboardPage";
import { BoardPage } from "../../pages/boardPage";
import { CardPage } from "../../pages/cardPage";
import * as allure from 'allure-js-commons';

test.describe("End-to-End Integration Test Suite - Complete Trello Workflow Validation", () => {
  let dashboardPage: DashboardPage;
  let boardPage: BoardPage;
  let cardPage: CardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
  });

  test.afterEach(async ({ page }) => {
    await dashboardPage.deleteBoard();
  });

  test('TC050 - Verify complete end-to-end workflow: board creation, lists setup, card management with attachments, dates, checklists and workflow transitions', 
    { tag: ['@E2E'] }, 
    async ({ page }) => {
    test.setTimeout(180000); 
    await allure.tags('regression', 'ui', 'e2e');
    
    const boardName = TrelloDataGenerator.generateBoardName();
    const cardName = TrelloDataGenerator.generateCardName();
    
    await test.step('Create board', async () => {
      await dashboardPage.createNewBoard(boardName);

      console.log(`Board created: ${boardName}`);
    });

    await test.step('Setup pages and create lists', async () => {
      boardPage = new BoardPage(page);
      cardPage = new CardPage(page);
      
      await boardPage.createList("setup"); 
      console.log(`Lists created (To Do, In Progress, Done)`);
    });

    await test.step('Create initial card', async () => {
      await boardPage.createCard(cardName);
      await boardPage.validateCardIsVisible(cardName);
      console.log(`Card created: ${cardName}`);
    });

    await test.step('Add date to card', async () => {
      await cardPage.addCardDate(cardName);
      await cardPage.closeCardDetails();
      console.log(`Date added to card`);
    });

    await test.step('Add checklist to card', async () => {
      await cardPage.addCardChecklist(cardName);
      await cardPage.closeCardDetails();
      console.log(`Checklist added to card`);
    });

    await test.step('Add file to card', async () => {
      await cardPage.addCardFilesImage(cardName);
      console.log(`File uploaded to card`);
    });

    await test.step('Validate complete card setup', async () => {
      await cardPage.validateCompleteCard();
      console.log(`Complete E2E workflow validation successful!`);
    });

    await test.step('Verify card features are maintained', async () => {
      await cardPage.verifyCardFeaturesAfterWorkflow(cardName);
      console.log(`Card features validated before workflow transitions`);
    });

    await test.step('Move card to In Progress', async () => {
      await boardPage.moveCardToDoing(cardName);
      console.log(`Card moved to In Progress: ${cardName}`);
    });

    await test.step('Move card to Done', async () => {
      await boardPage.moveCardToDone(cardName);
      console.log(`Card moved to Done: ${cardName}`);
    });

    await test.step('Archive card', async () => {
      await boardPage.archiveCard(cardName);
      console.log(`Card archived: ${cardName}`);
    });

    await test.step('Validate card is not visible', async () => {
      await boardPage.validateCardInNotVisible(cardName);
      console.log(`Card is not visible: ${cardName}`);
    });
  });
});