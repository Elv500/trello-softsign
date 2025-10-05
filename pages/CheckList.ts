import { Page, expect } from '@playwright/test';

export class ChecklistPage {
  private page: Page;

  private openChecklistButton = 'span[data-testid="ChecklistIcon"] >> xpath=ancestor::button';
  private checklistTitleInput = 'input#id-checklist';
  private confirmAddChecklistButton = 'button[data-testid="checklist-add-button"]';
  private checklistCreatedTitle = 'h3[data-testid="checklist-title"]';
  private addItemButton = 'button:has-text("Add an item")';
  private itemInput = 'textarea[data-testid="check-item-name-input"]';
  private confirmAddItemButton = 'button[data-testid="check-item-add-button"]';
  private deleteChecklistButton = 'button[data-testid="checklist-delete-button"]';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoCard(cardUrl: string) {
    console.log('📦 Navigating to card...');
    await this.page.goto(cardUrl, { waitUntil: 'domcontentloaded' });
    await this.page.locator(this.openChecklistButton).waitFor({ state: 'visible' });
    console.log('✅ Card loaded and checklist button visible');
  }

  async createChecklist(title: string) {
    console.log(`📝 Creating checklist: "${title}"`);

    const openBtn = this.page.locator(this.openChecklistButton);
    await openBtn.waitFor({ state: 'attached' });
    await openBtn.click();
    const modalForm = this.page.locator(`form:has(${this.checklistTitleInput})`);
    await modalForm.waitFor({ state: 'visible' });
    const titleInput = modalForm.locator(this.checklistTitleInput);
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.fill(title);

    const addBtn = modalForm.locator(this.confirmAddChecklistButton);
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();

    const checklistTitle = this.page.locator(this.checklistCreatedTitle, { hasText: title });
    await checklistTitle.waitFor({ state: 'attached' });
    await checklistTitle.waitFor({ state: 'visible' });

    console.log(`✅ Checklist "${title}" created successfully`);
    }

  async addChecklistItem(itemText: string) {
    console.log(`➕ Adding checklist item: "${itemText}"`);
    await this.page.waitForSelector(`form:has(${this.itemInput})`, { state: 'attached', timeout: 20000 });

    const addItemBtn = this.page.locator(this.addItemButton);
    await addItemBtn.waitFor({ state: 'visible'});
    await addItemBtn.click();

    const itemInput = this.page.locator(this.itemInput);
    await itemInput.waitFor({ state: 'visible'});
    await itemInput.fill(itemText);

    const confirmBtn = this.page.locator(this.confirmAddItemButton);
    await confirmBtn.waitFor({ state: 'visible' });
    await confirmBtn.click();

    const checkbox = this.page.locator(`input[type="checkbox"][aria-label="${itemText}"]`);
    await checkbox.waitFor({ state: 'attached' });

    console.log(`✅ Item "${itemText}" added successfully`);
  }

  async toggleChecklistItem(itemText: string) {
  console.log(`☑️ Toggling checklist item: "${itemText}"`);

  const checkboxLabel = this.page.locator(
  `label[data-testid="clickable-checkbox"]:has(input[aria-label="${itemText}"])`
);
await checkboxLabel.waitFor({ state: 'visible', timeout: 8000 });
await checkboxLabel.click();

  console.log(`✅ Item "${itemText}" toggled successfully`);
}

  async validateChecklistExists(title: string) {
    console.log(`🔍 Validating checklist "${title}" exists...`);
    const checklist = this.page.locator(this.checklistCreatedTitle, { hasText: title }).first();
const visible = await checklist.isVisible();
    console.log(visible ? '✅ Checklist visible' : '❌ Checklist not found');
    expect(visible).toBeTruthy();
  }

  async validateItemCompleted(itemText: string) {
    console.log(`🔎 Validating item "${itemText}" is marked complete...`);

    const checkbox = this.page.locator(`input[type="checkbox"][aria-label="${itemText}"]`);
    await checkbox.waitFor({ state: 'visible', timeout: 8000 });

    const checked = await checkbox.getAttribute('aria-checked');
    const isChecked = checked === 'true';

    console.log(isChecked ? '✅ Item is completed' : '❌ Item not completed');
    expect(isChecked).toBeTruthy();
  }

  async deleteChecklist(title: string) {
    console.log(`🗑️ Deleting checklist: "${title}"`);

    const checklistHeader = this.page.locator(this.checklistCreatedTitle, { hasText: title });
    await checklistHeader.waitFor({ state: 'visible', timeout: 8000 });

    const deleteBtn = checklistHeader.locator('xpath=ancestor::div').locator(this.deleteChecklistButton);
    await deleteBtn.click();

    await this.page.waitForTimeout(1000);
    const stillVisible = await checklistHeader.isVisible();
    expect(stillVisible).toBeFalsy();

    console.log(`✅ Checklist "${title}" deleted successfully`);
  }
}
