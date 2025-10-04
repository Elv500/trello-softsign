import { Page, Locator, expect } from "@playwright/test";
export class CardPage {
  private page: Page;
  
  // ========== SELECTORES DEFINIDOS ==========
  
  // Selectores para configuración inicial
  private readonly listNameTextareaSelector = 'list-name-textarea';
  private readonly listComposerAddButtonSelector = 'list-composer-add-list-button';
  private readonly listComposerCancelButtonSelector = 'list-composer-cancel-button';
  
  // Selectores para creación de tarjetas
  private readonly listCardComposerTextareaSelector = 'list-card-composer-textarea';
  private readonly listCardComposerAddButtonSelector = 'list-card-composer-add-card-button';
  private readonly toDoListName = 'To Do';
  
  // Selectores para operaciones de tarjetas

  private readonly cardBackAttachmentButtonSelector = 'card-back-attachment-button';
  private readonly cardBackLabelsButtonSelector = 'card-back-labels-button';
  
  // Selectores para diálogos y popover
  private readonly attachmentsInputSelector = 'input[type="file"]';
  private readonly closeDialogButtonName = 'Close dialog';
  
  // Selectores adicionales para funcionalidades de tarjetas
  private readonly cardBackAddToCardButtonSelector = 'card-back-add-to-card-button';
  private readonly cardBackDueDateButtonSelector = 'card-back-due-date-button';
  private readonly saveDateButtonSelector2 = 'save-date-button';
  private readonly dueDateReminderSelectSelector = 'due-reminder-select-select--dropdown-indicator';
  private readonly dayBeforeOptionSelector = 'due-reminder-select-select--option-7';
  private readonly cardBackChecklistButtonSelector = 'card-back-checklist-button';
  private readonly checklistAddButtonSelector = 'checklist-add-button';
  private readonly checkItemNameInputSelector = 'check-item-name-input';
  private readonly checkItemAddButtonSelector = 'check-item-add-button';
  private readonly closePopoverButtonName = 'Close popover';
  private readonly filesHeadingName = 'Files';
  private readonly datesHeadingName = 'Dates';
  private readonly labelsHeadingName = 'Labels';
  private readonly checklistTitleSelector = 'checklist-title';

  constructor(page: Page) {
    this.page = page;
  }
  
  // ========== MÉTODOS AUXILIARES PRIVADOS ==========
  
  private getAddCardInListButtonName(listName: string): string {
    return `Add a card in ${listName}`;
  }
  
  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  // ========== SETUP METHODS ==========
  /**
   * Create basic To Do list for testing card functionalities
   */
  async createBasicListsAndCard() {
    const listNameTextarea = this.page.getByTestId(this.listNameTextareaSelector);
    await listNameTextarea.waitFor({ state: 'visible', timeout: 15000 });
    await expect(listNameTextarea).toBeVisible();
    await listNameTextarea.click();
    await listNameTextarea.fill(this.toDoListName);
    await this.page.waitForTimeout(500);
    
    const addListButton = this.page.getByTestId(this.listComposerAddButtonSelector);
    await addListButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(addListButton).toBeVisible();
    await addListButton.click();
    await this.page.waitForTimeout(1000);
    
    const cancelButton = this.page.getByTestId(this.listComposerCancelButtonSelector);
    await cancelButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Create a card in the To Do list with verification
   */
  async createCard(cardName: string) {
    const addCardButton = this.page.getByRole('button', { name: this.getAddCardInListButtonName(this.toDoListName) });
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

  // ========== CARD FUNCTIONALITY METHODS ==========
  /**
   * Add due date to card with verification
   */
  async addCardDate(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    
    const addToCardButton = this.page.getByTestId(this.cardBackAddToCardButtonSelector);
    await addToCardButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addToCardButton).toBeVisible();
    await addToCardButton.click();
    
    const dueDateButton = this.page.getByTestId(this.cardBackDueDateButtonSelector);
    await dueDateButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(dueDateButton).toBeVisible();
    await dueDateButton.click();
    
    // Wait for calendar to load and select any available date in the future
    await this.page.waitForTimeout(2000);
    
    // Try to find any date button that's clickable (future dates)
    const availableDateButtons = this.page.locator('button[data-testid*="date-picker"]').or(
      this.page.locator('div[data-testid="date-picker"] button').filter({ hasNotText: /^(Mo|Tu|We|Th|Fr|Sa|Su)$/ })
    ).or(
      this.page.locator('button').filter({ hasText: /^\d{1,2}$/ })
    );
    
    const firstAvailableDate = availableDateButtons.first();
    await firstAvailableDate.waitFor({ state: 'visible', timeout: 10000 });
    await expect(firstAvailableDate).toBeVisible();
    await firstAvailableDate.click();
    
    // Select a second date for the due date range
    await this.page.waitForTimeout(1000);
    const secondAvailableDate = availableDateButtons.nth(1);
    if (await secondAvailableDate.isVisible()) {
      await secondAvailableDate.click();
    }
    
    const startDateGroup = this.page.getByRole('group', { name: 'Start date' });
    await startDateGroup.waitFor({ state: 'visible', timeout: 10000 });
    await expect(startDateGroup).toBeVisible();
    await startDateGroup.locator('svg').click();
    
    const reminderDropdown = this.page.getByTestId(this.dueDateReminderSelectSelector);
    await reminderDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await expect(reminderDropdown).toBeVisible();
    await reminderDropdown.click();
    
    const dayBeforeOption = this.page.getByTestId(this.dayBeforeOptionSelector).getByText('Day before');
    await dayBeforeOption.waitFor({ state: 'visible', timeout: 10000 });
    await expect(dayBeforeOption).toBeVisible();
    await dayBeforeOption.click();
    
    const saveDateButton = this.page.getByTestId(this.saveDateButtonSelector2);
    await saveDateButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(saveDateButton).toBeVisible();
    await saveDateButton.click();
  }

  /**
   * Add checklist to card with verification
   */
  async addCardChecklist(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    await this.page.waitForTimeout(2000);
    
    const addToCardButton = this.page.getByTestId(this.cardBackAddToCardButtonSelector);
    await addToCardButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addToCardButton).toBeVisible();
    await addToCardButton.click();
    await this.page.waitForTimeout(1000);
    
    const checklistButton = this.page.getByTestId(this.cardBackChecklistButtonSelector);
    await checklistButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(checklistButton).toBeVisible();
    await checklistButton.click();
    await this.page.waitForTimeout(1000);
    
    const checklistAddButton = this.page.getByTestId(this.checklistAddButtonSelector);
    await checklistAddButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(checklistAddButton).toBeVisible();
    await checklistAddButton.click();
    await this.page.waitForTimeout(1000);
    
    const checkItemInput = this.page.getByTestId(this.checkItemNameInputSelector);
    await checkItemInput.waitFor({ state: 'visible', timeout: 15000 });
    await expect(checkItemInput).toBeVisible();
    await checkItemInput.click();
    await checkItemInput.fill('TEST1');
    
    const checkItemAddButton = this.page.getByTestId(this.checkItemAddButtonSelector);
    await checkItemAddButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(checkItemAddButton).toBeVisible();
    await checkItemAddButton.click();
    await this.page.waitForTimeout(500);
    
    await expect(checkItemInput).toBeVisible();
    await checkItemInput.fill('TEST2');
    await expect(checkItemAddButton).toBeVisible();
    await checkItemAddButton.click();
    await this.page.waitForTimeout(1000);
    
    const checkboxItem1 = this.page.getByRole('listitem').filter({ hasText: 'TEST1' }).getByTestId('clickable-checkbox').locator('svg');
    await checkboxItem1.waitFor({ state: 'visible', timeout: 10000 });
    await expect(checkboxItem1).toBeVisible();
    await checkboxItem1.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add image file to card with verification
   */
  async addCardFilesImage(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    await this.page.waitForTimeout(2000);

    const addToCardButton = this.page.getByTestId(this.cardBackAddToCardButtonSelector);
    await addToCardButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addToCardButton).toBeVisible();
    await addToCardButton.click();
    await this.page.waitForTimeout(1000);
    
    const attachmentButton = this.page.getByTestId(this.cardBackAttachmentButtonSelector);
    await attachmentButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(attachmentButton).toBeVisible();
    await attachmentButton.click();
    await this.page.waitForTimeout(1000);
    
    const fileInput = this.page.locator(this.attachmentsInputSelector);
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    await fileInput.setInputFiles('./resources/images/ImageTest.jpeg');
    await this.page.waitForTimeout(2000);
    }

  /**
   * Add JSON file to card with verification
   */
  async addCardFilesJson(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    await this.page.waitForTimeout(2000);
  
    const addToCardButton = this.page.getByTestId(this.cardBackAddToCardButtonSelector);
    await addToCardButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addToCardButton).toBeVisible();
    await addToCardButton.click();
    await this.page.waitForTimeout(1000);
    
    const attachmentButton = this.page.getByTestId(this.cardBackAttachmentButtonSelector);
    await attachmentButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(attachmentButton).toBeVisible();
    await attachmentButton.click();
    await this.page.waitForTimeout(1000);
    
    const fileInput = this.page.locator(this.attachmentsInputSelector);
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    await fileInput.setInputFiles('./data/users.json');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Add labels to card with verification
   */
  async addLabelsToCard(cardName: string) {
    const cardLink = this.page.getByRole('link', { name: cardName });
    await cardLink.waitFor({ state: 'visible', timeout: 10000 });
    await expect(cardLink).toBeVisible();
    await cardLink.click();
    
    const addToCardButton = this.page.getByTestId(this.cardBackAddToCardButtonSelector);
    await addToCardButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(addToCardButton).toBeVisible();
    await addToCardButton.click();
    
    const labelsButton = this.page.getByTestId(this.cardBackLabelsButtonSelector);
    await labelsButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(labelsButton).toBeVisible();
    await labelsButton.click();
    
    const greenLabel = this.page.locator('.QAbIzaY_2ICVlA.llQZ8KQKbYje7j.jbjVH3uLtIZCZ5 > .I1mTB4BD1hFm9_ > .ZAcH7Pr9TT7uUR > svg').first();
    await greenLabel.waitFor({ state: 'visible', timeout: 10000 });
    await expect(greenLabel).toBeVisible();
    await greenLabel.click();
    
    const closePopoverButton = this.page.getByRole('button', { name: this.closePopoverButtonName });
    await closePopoverButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closePopoverButton).toBeVisible();
    await closePopoverButton.click();
  }

  // ========== VALIDATION METHODS ==========
  /**
   * Validate that file was uploaded successfully
   */
  async validateUploadedFile() {
    const filesHeading = this.page.getByRole('heading', { name: this.filesHeadingName });
    await filesHeading.waitFor({ state: 'visible', timeout: 15000 });
    await expect(filesHeading).toBeVisible();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * Validate that card has due date
   */
  async validateCardDate() {
    const datesHeading = this.page.getByRole('heading', { name: this.datesHeadingName });
    await datesHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(datesHeading).toBeVisible();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * Validate that card has checklist
   */
  async validateCardChecklist() {
    const checklistTitle = this.page.getByTestId(this.checklistTitleSelector);
    await checklistTitle.waitFor({ state: 'visible', timeout: 10000 });
    await expect(checklistTitle).toBeVisible();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * Validate that card has labels
   */
  async validateCardLabels() {
    const labelsHeading = this.page.getByRole('heading', { name: this.labelsHeadingName });
    await labelsHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(labelsHeading).toBeVisible();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * Validate that card has all features (complete card)
   */
  async validateCompleteCard() {
    // Validate files
    const filesHeading = this.page.getByRole('heading', { name: this.filesHeadingName });
    await filesHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(filesHeading).toBeVisible();
    
    // Validate dates
    const datesHeading = this.page.getByRole('heading', { name: this.datesHeadingName });
    await datesHeading.waitFor({ state: 'visible', timeout: 10000 });
    await expect(datesHeading).toBeVisible();
    
    // Validate checklist
    const checklistTitle = this.page.getByTestId(this.checklistTitleSelector);
    await checklistTitle.waitFor({ state: 'visible', timeout: 10000 });
    await expect(checklistTitle).toBeVisible();
    
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    console.log(`✅ Complete card validation successful!`);
  }
  
  /**
   * Close card details dialog
   */
  async closeCardDetails() {
    const closeButton = this.page.getByRole('button', { name: this.closeDialogButtonName });
    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }
}