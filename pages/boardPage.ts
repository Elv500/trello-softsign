import { Page, Locator, expect } from "@playwright/test";
export class BoardPage {
  private page: Page;
  
  // Selectores para listas
  private readonly listNameTextareaSelector = 'list-name-textarea';
  private readonly listComposerAddButtonSelector = 'list-composer-add-list-button';
  private readonly listComposerCancelButtonSelector = 'list-composer-cancel-button';
  private readonly enterListNameTextboxName = 'Enter list name…';
  
  private readonly listCardComposerTextareaSelector = 'list-card-composer-textarea';
  private readonly listCardComposerAddButtonSelector = 'list-card-composer-add-card-button';
  
  // Selectores para edición de board
  private readonly boardNameDisplaySelector = 'board-name-display';
  private readonly boardNameInputSelector = 'board-name-input';
  
  // Selectores para navegación
  private readonly panelNavInboxButtonSelector = 'panel-nav-inbox-button';
  private readonly panelNavPlannerButtonSelector = 'panel-nav-planner-button';
  private readonly inboxHeaderText = 'Inbox';
  private readonly plannerHeadingName = 'Planner';

  private readonly cardNameSelector = 'card-name';
  private readonly cardBackNameSelector = 'card-back-name';
  private readonly cardBackTitleInputSelector = 'card-back-title-input';
  private readonly cardBackAddToCardButtonSelector = 'card-back-add-to-card-button';
  private readonly cardBackLabelsButtonSelector = 'card-back-labels-button';
  private readonly moveCardPopoverSelectSelector = 'move-card-popover-select-list-destination-select--input-container';
  private readonly moveCardPopoverMoveButtonSelector = 'move-card-popover-move-button';
  private readonly cardBackActionsButtonSelector = 'card-back-actions-button';
  private readonly cardBackArchiveButtonSelector = 'card-back-archive-button';
  private readonly cardBackDeleteButtonSelector = 'card-back-delete-card-button';
  private readonly popoverConfirmButtonSelector = 'popover-confirm-button';
  private readonly closeDialogButtonName = 'Close dialog';
  
  // Selectores para movimiento de tarjetas
  private readonly toDoListButtonName = 'To Do';
  private readonly inProgressListButtonName = 'In Progress';
  private readonly doneListButtonName = 'Done';

  constructor(page: Page) {
    this.page = page;
  }
  
  private getAddCardInListButtonName(listName: string): string {
    return `Add a card in ${listName}`;
  }
  
  private getMoveCardDestinationOptionSelector(optionNumber: number): string {
    return `move-card-popover-select-list-destination-select--option-${optionNumber}`;
  }
  
  private getListButtonSelector(listName: string): { name: string } {
    return { name: listName };
  }

  async createList(cardName: string) {

    const listNameTextarea = this.page.getByTestId(this.listNameTextareaSelector);
    await listNameTextarea.waitFor({ state: 'visible', timeout: 15000 });
    await expect(listNameTextarea).toBeVisible();
    await listNameTextarea.click();
    await listNameTextarea.fill('To Do');
    await this.page.waitForTimeout(500);

    const addListButton = this.page.getByTestId(this.listComposerAddButtonSelector);
    await addListButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(addListButton).toBeVisible();
    await addListButton.click();
    await this.page.waitForTimeout(1000);
    

    const enterListNameTextbox = this.page.getByRole('textbox', { name: this.enterListNameTextboxName });
    await enterListNameTextbox.waitFor({ state: 'visible', timeout: 10000 });
    await expect(enterListNameTextbox).toBeVisible();
    await enterListNameTextbox.fill('In Progress');
    await this.page.waitForTimeout(500);
    
    await expect(addListButton).toBeVisible();
    await addListButton.click();
    await this.page.waitForTimeout(1000);
    

    await expect(enterListNameTextbox).toBeVisible();
    await enterListNameTextbox.fill('Done');
    await this.page.waitForTimeout(500);
    
    await expect(addListButton).toBeVisible();
    await addListButton.click();
    await this.page.waitForTimeout(1000);
    

    const cancelButton = this.page.getByTestId(this.listComposerCancelButtonSelector);
    await cancelButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await this.page.waitForTimeout(1000);
  }


  async editBoardName(newBoardName: string) {
    const boardNameDisplay = this.page.getByTestId(this.boardNameDisplaySelector);
    await boardNameDisplay.waitFor({ state: 'visible', timeout: 10000 });
    await expect(boardNameDisplay).toBeVisible();
    await boardNameDisplay.click();
    
    const boardNameInput = this.page.getByTestId(this.boardNameInputSelector);
    await boardNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await expect(boardNameInput).toBeVisible();
    await boardNameInput.fill(newBoardName);
    await boardNameInput.press('Enter');
  }


  async validateBoardName(newBoardName: string) {
    const boardNameLocator = this.page.getByTestId(this.boardNameDisplaySelector);
    await boardNameLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(boardNameLocator).toHaveText(newBoardName);
  }


  async openInboxMenu() {
    const inboxButton = this.page.getByTestId(this.panelNavInboxButtonSelector);
    await inboxButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(inboxButton).toBeVisible();
    await inboxButton.click();
  }


  async validateOpenInboxMenu() {
    const inboxHeader = this.page.getByTestId('inbox-header').getByText(this.inboxHeaderText);
    await inboxHeader.waitFor({ state: 'visible', timeout: 15000 });
    await expect(inboxHeader).toBeVisible();
  }


  async openPlannerMenu() {
    const plannerButton = this.page.getByTestId(this.panelNavPlannerButtonSelector);
    await plannerButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(plannerButton).toBeVisible();
    await plannerButton.click();
  }


  async validateOpenPlannerMenu() {
    const plannerHeading = this.page.getByRole('heading', { name: this.plannerHeadingName });
    await plannerHeading.waitFor({ state: 'visible', timeout: 15000 });
    await expect(plannerHeading).toBeVisible();
  }
 

  async createCard(cardName: string) {
    const addCardButton = this.page.getByRole('button', { name: this.getAddCardInListButtonName('To Do') });
    await addCardButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addCardButton).toBeVisible();
    await addCardButton.click();
    await this.page.waitForTimeout(1000);
    
    const cardTextarea = this.page.getByTestId(this.listCardComposerTextareaSelector);
    await cardTextarea.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardTextarea).toBeVisible();
    await cardTextarea.fill(cardName);
    await this.page.waitForTimeout(500);
    
    const addCardSubmitButton = this.page.getByTestId(this.listCardComposerAddButtonSelector);
    await addCardSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(addCardSubmitButton).toBeVisible();
    await addCardSubmitButton.click();
    await this.page.waitForTimeout(2000);
  }


  async createCardInList(cardName: string, listName: string) {
    const addCardInListButton = this.page.getByRole('button', { name: this.getAddCardInListButtonName(listName) });
    await addCardInListButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addCardInListButton).toBeVisible();
    await addCardInListButton.click();
    await this.page.waitForTimeout(1000);
    
    const cardTextarea = this.page.getByTestId(this.listCardComposerTextareaSelector);
    await cardTextarea.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardTextarea).toBeVisible();
    await cardTextarea.fill(cardName);
    await this.page.waitForTimeout(500);
    
    const addCardSubmitButton = this.page.getByTestId(this.listCardComposerAddButtonSelector);
    await addCardSubmitButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(addCardSubmitButton).toBeVisible();
    await addCardSubmitButton.click();
    await this.page.waitForTimeout(2000);
  }


  async editCard(cardName: string) {
    const cardNameElement = this.page.getByTestId(this.cardNameSelector);
    await cardNameElement.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardNameElement).toBeVisible();
    await cardNameElement.click();
    
    const cardTitleInput = this.page.getByTestId(this.cardBackTitleInputSelector);
    await cardTitleInput.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardTitleInput).toBeVisible();
    await cardTitleInput.click();
    await cardTitleInput.fill(cardName);
  }


  async addCardLabels(cardName: string) {
    const cardNameElement = this.page.getByTestId(this.cardNameSelector);
    await cardNameElement.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardNameElement).toBeVisible();
    await cardNameElement.click();
    
    const addToCardButton = this.page.getByTestId(this.cardBackAddToCardButtonSelector);
    await addToCardButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(addToCardButton).toBeVisible();
    await addToCardButton.click();
    
    const labelsButton = this.page.getByTestId(this.cardBackLabelsButtonSelector);
    await labelsButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(labelsButton).toBeVisible();
    await labelsButton.click();
    
    const firstLabel = this.page.locator('.ZAcH7Pr9TT7uUR > svg').first();
    await firstLabel.waitFor({ state: 'visible', timeout: 10000 });
    await expect(firstLabel).toBeVisible();
    await firstLabel.click();
  }


  async moveCardToDoing(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    
    await this.page.waitForSelector('[data-testid="card-back-name"]', { 
      state: 'visible', 
      timeout: 10000 
    });
    
    const listButton = this.page.getByTestId(this.cardBackNameSelector).getByRole('button', this.getListButtonSelector(this.toDoListButtonName));
    await listButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(listButton).toBeVisible();
    await listButton.click();
    
    const destinationSelect = this.page.getByTestId(this.moveCardPopoverSelectSelector);
    await destinationSelect.waitFor({ state: 'visible', timeout: 10000 });
    await expect(destinationSelect).toBeVisible();
    await destinationSelect.click();
    
    const inProgressOption = this.page.getByTestId(this.getMoveCardDestinationOptionSelector(1)).getByText(this.inProgressListButtonName);
    await inProgressOption.waitFor({ state: 'visible', timeout: 10000 });
    await expect(inProgressOption).toBeVisible();
    await inProgressOption.click();
    
    const moveButton = this.page.getByTestId(this.moveCardPopoverMoveButtonSelector);
    await moveButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(moveButton).toBeVisible();
    await moveButton.click();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    await this.waitForCardMoveComplete(cardName, 'In Progress');
  }


  async waitForCardMoveComplete(cardName: string, targetListName: string) {
    const targetListLocator = this.page.locator('[data-testid="list-wrapper"]')
      .filter({ hasText: targetListName })
      .getByRole('link', { name: cardName });
    
    await targetListLocator.waitFor({ state: 'visible', timeout: 10000 });
  }

 
  async moveCardToDone(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    
    await this.page.waitForSelector('[data-testid="card-back-name"]', { 
      state: 'visible', 
      timeout: 10000 
    });
    
    const listButton = this.page.getByTestId(this.cardBackNameSelector).getByRole('button', this.getListButtonSelector(this.inProgressListButtonName));
    await listButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(listButton).toBeVisible();
    await listButton.click();
    
    const destinationSelect = this.page.getByTestId(this.moveCardPopoverSelectSelector);
    await destinationSelect.waitFor({ state: 'visible', timeout: 10000 });
    await expect(destinationSelect).toBeVisible();
    await destinationSelect.click();
    
    const doneOption = this.page.getByTestId(this.getMoveCardDestinationOptionSelector(2)).getByText(this.doneListButtonName);
    await doneOption.waitFor({ state: 'visible', timeout: 10000 });
    await expect(doneOption).toBeVisible();
    await doneOption.click();
    
    const moveButton = this.page.getByTestId(this.moveCardPopoverMoveButtonSelector);
    await moveButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(moveButton).toBeVisible();
    await moveButton.click();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    await this.waitForCardMoveComplete(cardName, 'Done');
  }


  async archiveCard(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    
    const actionsButton = this.page.getByTestId(this.cardBackActionsButtonSelector);
    await actionsButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(actionsButton).toBeVisible();
    await actionsButton.click();
    
    const archiveButton = this.page.getByTestId(this.cardBackArchiveButtonSelector);
    await archiveButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(archiveButton).toBeVisible();
    await archiveButton.click();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    await this.waitForCardArchiveComplete(cardName);
  }

 
  async waitForCardArchiveComplete(cardName: string) {
    const cardLocator = this.page.getByRole('link', { name: cardName });
    await cardLocator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      return this.page.waitForLoadState('networkidle', { timeout: 5000 });
    });
  }


  async deleteCard(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    
    const actionsButton = this.page.getByTestId(this.cardBackActionsButtonSelector);
    await actionsButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(actionsButton).toBeVisible();
    await actionsButton.click();
    
    const archiveButton = this.page.getByTestId(this.cardBackArchiveButtonSelector);
    await archiveButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(archiveButton).toBeVisible();
    await archiveButton.click();
    
    const deleteCardButton = this.page.getByTestId(this.cardBackDeleteButtonSelector);
    await deleteCardButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(deleteCardButton).toBeVisible();
    await deleteCardButton.click();
    
    const confirmButton = this.page.getByTestId(this.popoverConfirmButtonSelector);
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }


  async validateCardIsVisible(cardName: string) {
    const cardLocator = this.page.getByRole('link', { name: cardName });
    await expect(cardLocator).toBeVisible();
  }


  async validateCardsAreVisible(cardNames: string[]) {
    for (const cardName of cardNames) {
      await this.validateCardIsVisible(cardName);
    }
  }


  async validateMultipleCards(...cardNames: string[]) {
    for (const cardName of cardNames) {
      await this.validateCardIsVisible(cardName);
    }
  }

  async validateCardInNotVisible(cardName: string) {
    await this.page.waitForTimeout(2000);
    
    const cardLocator = this.page.getByRole('link', { name: cardName });
    await expect(cardLocator).not.toBeVisible();
  }
}