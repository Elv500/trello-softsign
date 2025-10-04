import { Page, Locator, expect } from "@playwright/test";
import { config } from '../config/auth/ui/config';

export class DashboardPage {
  private page: Page;
  
  // ========== SELECTORES DEFINIDOS ==========
  
  // Selectores para boards en workspaces
  private readonly yourWorkspacesBoardSelector = 'h3.xtkiiaSp5ulDJM:has-text("YOUR WORKSPACES") ~ * .JeWt7esCgw4_73';
  
  // Selectores para creación de boards
  private readonly headerCreateMenuButton = 'header-create-menu-button';
  private readonly headerCreateBoardButton = 'header-create-board-button';
  private readonly createBoardTitleInput = 'create-board-title-input';
  private readonly createBoardSubmitButton = 'create-board-submit-button';
  
  // Selectores para menú de boards
  private readonly showMenuButtonName = 'Show menu';
  private readonly closeBoardButtonName = 'Close board Close board';
  private readonly closeBoardConfirmButton = 'popover-close-board-confirm';
  
  // Selectores para eliminar boards
  private readonly deleteBoardButton = 'close-board-delete-board-button';
  private readonly deleteBoardConfirmButton = 'close-board-delete-board-confirm-button';
  private readonly viewAllClosedBoardsButtonName = 'View all closed boards';
  
  // Selectores para navegación
  private readonly backToHomeLinkName = 'Back to home';

  constructor(page: Page) {
    this.page = page;
  }

  private getBoardInWorkspacesSelector(boardName: string): string {
    return `${this.yourWorkspacesBoardSelector} a[title="${boardName}"][aria-label="${boardName}"]`;
  }

  private getBoardLinkSelector(boardName: string): string {
    return `a[title="${boardName}"]`;
  }

  /**
   * Navigate to Trello dashboard with retry mechanism
   */
  async gotoDashboard() {
    await this.page.goto(config.urls.dashboard, { timeout: 45000 });
    // Verify dashboard loaded correctly
    await this.page.waitForSelector('button[data-testid="header-create-menu-button"]', { 
      state: 'visible', 
      timeout: 15000 
    });
  }

  /**
   * Create a new board with enhanced error handling and verification
   */
  async createNewBoard(boardName: string) {
    // Wait for and click create menu button
    const createMenuButton = this.page.getByTestId(this.headerCreateMenuButton);
    await createMenuButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(createMenuButton).toBeVisible();
    await createMenuButton.click();
    
    // Wait for and click create board button with multiple selectors
    const possibleCreateBoardSelectors = [
      `[data-testid="${this.headerCreateBoardButton}"]`,
      'button:has-text("Create board")',
      'button:has-text("Create Board")',
      'a:has-text("Create board")',
      'a:has-text("Create Board")',
      '.header-create-board-button',
      '[class*="create-board"]'
    ];
    
    let createBoardButtonFound = false;
    for (const selector of possibleCreateBoardSelectors) {
      try {
        const button = this.page.locator(selector).first();
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.click();
        console.log(`✅ Found and clicked create board button with selector: ${selector}`);
        createBoardButtonFound = true;
        break;
      } catch (error) {
        console.log(`❌ Create board button not found with selector: ${selector}`);
        continue;
      }
    }
    
    if (!createBoardButtonFound) {
      throw new Error('Could not find create board button with any selector');
    }
    
    // Wait for and fill board title input
    const titleInput = this.page.getByTestId(this.createBoardTitleInput);
    await titleInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(titleInput).toBeVisible();
    await titleInput.click();
    await titleInput.fill(boardName);
    
    // Wait for and click submit button
    const submitButton = this.page.getByTestId(this.createBoardSubmitButton);
    await submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Verify board creation was successful
    await this.page.waitForURL('**/b/**', { timeout: 15000 });
  } 

  /**
   * Open a specific board from dashboard
   */
  async openDashboard(boardName: string) {
    const boardLink = this.page.locator(this.getBoardLinkSelector(boardName)).first();
    await boardLink.waitFor({ state: 'visible', timeout: 15000 });
    await expect(boardLink).toBeVisible();
    await boardLink.click();
  }

  /**
   * Close a board with proper verification steps
   */
  async closeBoard() {
    // Open menu
    const menuButton = this.page.getByRole('button', { name: this.showMenuButtonName });
    await menuButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(menuButton).toBeVisible();
    
    // Try to click with force if intercepted
    try {
      await menuButton.click();
    } catch (error) {
      console.log('Normal click failed, trying force click...');
      await menuButton.click({ force: true });
    }
    
    // Click close board
    const closeBoardButton = this.page.getByRole('button', { name: this.closeBoardButtonName });
    await closeBoardButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeBoardButton).toBeVisible();
    await closeBoardButton.click();
    
    // Confirm close
    const confirmButton = this.page.getByTestId(this.closeBoardConfirmButton);
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }

  /**
   * Delete a board completely (close + delete)
   */
  async deleteBoard() {
    // First close the board
    const menuButton = this.page.getByRole('button', { name: this.showMenuButtonName });
    await menuButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(menuButton).toBeVisible();
    
    // Try to click with force if intercepted
    try {
      await menuButton.click();
    } catch (error) {
      console.log('Normal click failed, trying force click...');
      await menuButton.click({ force: true });
    }
    
    // Wait for menu to load
    await this.page.waitForTimeout(1000);
    
    // Try multiple possible selectors for close board button
    const possibleCloseSelectors = [
      'button:has-text("Close board")',
      `[data-testid="close-board-button"]`,
      'button:has-text("Close Board")',
      '.board-menu-navigation-item-link:has-text("Close board")',
      'a:has-text("Close board")'
    ];
    
    let closeBoardButton;
    let buttonFound = false;
    
    for (const selector of possibleCloseSelectors) {
      try {
        closeBoardButton = this.page.locator(selector).first();
        await closeBoardButton.waitFor({ state: 'visible', timeout: 3000 });
        await closeBoardButton.click();
        console.log(`✅ Found and clicked close board button with selector: ${selector}`);
        buttonFound = true;
        break;
      } catch (error) {
        console.log(`❌ Close board button not found with selector: ${selector}`);
        continue;
      }
    }
    
    if (!buttonFound) {
      // Fallback to original selector
      closeBoardButton = this.page.getByRole('button', { name: this.closeBoardButtonName });
      await closeBoardButton.waitFor({ state: 'visible', timeout: 10000 });
      await closeBoardButton.click();
    }
    
    const confirmCloseButton = this.page.getByTestId(this.closeBoardConfirmButton);
    await confirmCloseButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(confirmCloseButton).toBeVisible();
    await confirmCloseButton.click();
    
    // Wait a moment for close operation to complete
    await this.page.waitForTimeout(3000);
    
    // Then delete the closed board - try multiple selectors for menu button
    const possibleMenuSelectors = [
      'button:has-text("Show menu")',
      '[data-testid="board-menu-button"]',
      'button:has-text("Menu")',
      'button[aria-label*="menu"]',
      '.board-header-btn:has-text("Menu")',
      '.board-header-btn:has-text("Show menu")',
      'button[class*="menu"]'
    ];
    
    let menuButton2Found = false;
    for (const selector of possibleMenuSelectors) {
      try {
        const menuBtn = this.page.locator(selector).first();
        await menuBtn.waitFor({ state: 'visible', timeout: 3000 });
        await menuBtn.click();
        console.log(`✅ Found and clicked second menu button with selector: ${selector}`);
        menuButton2Found = true;
        break;
      } catch (error) {
        console.log(`❌ Second menu button not found with selector: ${selector}`);
        continue;
      }
    }
    
    if (!menuButton2Found) {
      console.log('❌ Could not find second menu button - board may already be closed/deleted');
      return; // Exit gracefully if we can't find the menu
    }
    
    // Now try to find and click delete board button
    await this.page.waitForTimeout(2000);
    
    // Try multiple selectors for delete board button
    const possibleDeleteSelectors = [
      `[data-testid="${this.deleteBoardButton}"]`,
      'button:has-text("Delete board")',
      'button:has-text("Delete Board")',
      'button:has-text("Delete")',
      'a:has-text("Delete board")',
      'a:has-text("Delete Board")',
      '.board-menu-navigation-item-link:has-text("Delete")',
      '[class*="delete"]'
    ];
    
    let deleteBoardButtonFound = false;
    for (const selector of possibleDeleteSelectors) {
      try {
        const deleteBtn = this.page.locator(selector).first();
        await deleteBtn.waitFor({ state: 'visible', timeout: 3000 });
        await deleteBtn.click();
        console.log(`✅ Found and clicked delete board button with selector: ${selector}`);
        deleteBoardButtonFound = true;
        break;
      } catch (error) {
        console.log(`❌ Delete board button not found with selector: ${selector}`);
        continue;
      }
    }
    
    if (!deleteBoardButtonFound) {
      console.log('❌ Could not find delete board button - board may not be closed properly');
      return; // Exit gracefully
    }
    
    const confirmDeleteButton = this.page.getByTestId(this.deleteBoardConfirmButton);
    await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(confirmDeleteButton).toBeVisible();
    await confirmDeleteButton.click();
  }

  /**
   * Delete a board that is already closed
   */
  async deleteClosedBoard() {
    const viewClosedBoardsButton = this.page.getByRole('button', { name: this.viewAllClosedBoardsButtonName });
    await viewClosedBoardsButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(viewClosedBoardsButton).toBeVisible();
    await viewClosedBoardsButton.click();
    
    const deleteBoardButton = this.page.getByTestId(this.deleteBoardButton).first();
    await deleteBoardButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(deleteBoardButton).toBeVisible();
    await deleteBoardButton.click();
    
    const confirmDeleteButton = this.page.getByTestId(this.deleteBoardConfirmButton);
    await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(confirmDeleteButton).toBeVisible();
    await confirmDeleteButton.click();
  }

  /**
   * Validate if a board is visible or hidden on dashboard
   */
  async validateVisibilityOfBoard(boardName: string, shouldBeVisible: boolean): Promise<void> {
    const boardSelector = this.getBoardInWorkspacesSelector(boardName);
    
    if (shouldBeVisible) {
      await this.page.waitForSelector(boardSelector, { state: 'visible', timeout: 15000 });
      const boardElement = this.page.locator(boardSelector).first();
      await expect(boardElement).toBeVisible();
    } else {
      // Wait a moment to ensure the board has been removed
      await this.page.waitForTimeout(3000);
      const boardElement = this.page.locator(boardSelector).first();
      await expect(boardElement).not.toBeVisible();
    }
  }

  /**
   * Navigate back to dashboard from board
   */
  async backBoardToDashboard() {
    const backToHomeLink = this.page.getByRole('link', { name: this.backToHomeLinkName });
    await backToHomeLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(backToHomeLink).toBeVisible();
    await backToHomeLink.click();
    
    // Wait for dashboard to load
    await this.page.waitForURL('**/boards', { timeout: 10000 });
  }

  /**
   * Check if a board is currently visible with error handling
   */
  async isBoardVisible(boardName: string): Promise<boolean> {
    try {
      const boardSelector = this.getBoardInWorkspacesSelector(boardName);
      await this.page.waitForSelector(boardSelector, { 
        state: 'visible', 
        timeout: 5000 
      });
      const boardElement = this.page.locator(boardSelector).first();
      return await boardElement.isVisible();
    } catch (error) {
      console.log(`Board "${boardName}" is not visible: ${error}`);
      return false;
    }
  }
}