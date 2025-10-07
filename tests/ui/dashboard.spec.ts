import { test, expect} from "@playwright/test";
import { DashboardPage } from "../../pages/dashboardPage";
import { TrelloDataGenerator } from "../../utils/ui/trelloDataGenerator";
import * as allure from 'allure-js-commons';

test.describe("Dashboard Management Test Suite - Board Lifecycle Operations", () => {
    let dashboardPage: DashboardPage;
    let createdBoards: string[] = [];

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.gotoDashboard();
    });

    test.afterEach(async ({ page }) => {
        if (createdBoards.length === 0) {
            // console.log('🚀 No boards to clean up - skipping cleanup');
            return; 
        }
        
        for (const boardName of createdBoards) {
            try {
                if (page.isClosed()) {
                    // console.log(`⚠️ Page is closed, cannot clean up board: ${boardName}`);
                    continue;
                }
                
                await page.reload(); 
                await dashboardPage.gotoDashboard();
                await page.waitForTimeout(3000);
                
                const isBoardVisible = await dashboardPage.isBoardVisible(boardName);
                
                if (isBoardVisible) {
                    // console.log(`🧹 Cleaning up visible board: ${boardName}`);
                    await dashboardPage.openDashboard(boardName);
                    await dashboardPage.deleteBoard();
                } else {
                    // console.log(`🧹 Cleaning up closed board: ${boardName}`);
                    await dashboardPage.deleteClosedBoard();
                }
            } catch (error) {
                // console.log(`❌ Could not delete board ${boardName}:`, error);
                if (page.isClosed()) {
                    // console.log(`⚠️ Page is closed, skipping fallback cleanup for: ${boardName}`);
                    continue;
                }
                
                try {
                    await dashboardPage.gotoDashboard();
                    await dashboardPage.deleteClosedBoard();
                    // console.log(`✅ Fallback cleanup succeeded for board: ${boardName}`);
                } catch (fallbackError) {
                    // console.log(`❌ Fallback cleanup also failed for ${boardName}:`, fallbackError);
                }
            }
        }

        createdBoards = [];
    });

    test('TC011 - Verify successful board creation from dashboard and visibility validation', async ({ page }) => {
        await allure.tags('smoke', 'regression', 'ui');
        const boardName = TrelloDataGenerator.generateBoardName();
        createdBoards.push(boardName);
        
        await dashboardPage.createNewBoard(boardName);
        await dashboardPage.backBoardToDashboard();
        await page.reload(); 
        await page.waitForTimeout(5000);
        await dashboardPage.validateVisibilityOfBoard(boardName, true);
        
    });

    test('TC012 - Verify board closure functionality and dashboard visibility update', async ({ page }) => {
       await allure.tags('regression', 'ui');
       const boardName = TrelloDataGenerator.generateBoardName();
        createdBoards.push(boardName);
        
        await dashboardPage.createNewBoard(boardName);
        await dashboardPage.closeBoard();
        await page.waitForTimeout(2000);
        await dashboardPage.backBoardToDashboard();
        await page.reload(); 
        await page.waitForTimeout(5000);
        await dashboardPage.validateVisibilityOfBoard(boardName, false);
    });

    test('TC013 - Verify complete board deletion process and removal from dashboard', async ({ page }) => {
        await allure.tags('regression', 'ui');
        const boardName = TrelloDataGenerator.generateBoardName();
        createdBoards.push(boardName);
        
        await dashboardPage.createNewBoard(boardName);
        await dashboardPage.deleteBoard();
        await page.waitForTimeout(5000);
        await dashboardPage.validateVisibilityOfBoard(boardName, false);
        
    
        const index = createdBoards.indexOf(boardName);
        if (index > -1) {
            createdBoards.splice(index, 1);
        }
    });
        

});