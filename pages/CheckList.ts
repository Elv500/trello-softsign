import { Page, expect } from "@playwright/test";

export class ChecklistPage {
  private page: Page;

  private selectors = {
    // Botones y inputs principales
    openChecklistButton: 'span[data-testid="ChecklistIcon"] >> xpath=ancestor::button',
    checklistTitleInput: "input#id-checklist",
    confirmAddChecklistButton: 'button[data-testid="checklist-add-button"]',
    checklistCreatedTitle: 'h3[data-testid="checklist-title"]',
    addItemButton: 'button:has-text("Add an item")',
    itemInput: 'textarea[data-testid="check-item-name-input"]',
    confirmAddItemButton: 'button[data-testid="check-item-add-button"]',
    deleteChecklistButton: 'button[data-testid="checklist-delete-button"]',
    checklistContainer: 'div[data-testid="checklist-container"]',

    // Modales y formularios
    addChecklistModal: 'section[role="dialog"][aria-labelledby="add-checklist-popover"]',
    addChecklistModalTitle: 'h2:has-text("Add checklist")',
    deleteChecklistModal: 'section[role="dialog"]',
    confirmDeleteChecklistButton: 'section[role="dialog"] button:has-text("Delete checklist")',
    
    // Checkbox de items
    itemContainer: 'li[data-testid="check-item-container"]',
    clickableCheckbox: 'label[data-testid="clickable-checkbox"]',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async gotoCard(cardUrl: string) {
    console.log("📦 Redirigiendo a card...");
    await this.page.goto(cardUrl, { waitUntil: "domcontentloaded" });
    await this.page.goto(cardUrl, { waitUntil: "networkidle" });
    await this.page.locator(this.selectors.openChecklistButton).waitFor({ state: "visible" });
    console.log("✅ Tarjeta cargada y botón de checklist visible");
  }

  async createChecklist(title: string) {
    console.log(`📝 Creando checklist: "${title}"`);

    const openBtn = this.page.locator(this.selectors.openChecklistButton);
    await openBtn.waitFor({ state: "attached" });
    await openBtn.click();

    await this.page.locator(this.selectors.addChecklistModal).waitFor({ state: "visible", timeout: 10000 });
    await this.page.locator(this.selectors.addChecklistModalTitle).waitFor({ state: "visible", timeout: 10000 });

    const modalForm = this.page.locator(`form:has(${this.selectors.checklistTitleInput})`);
    await modalForm.waitFor({ state: "visible" });

    await modalForm.locator(this.selectors.checklistTitleInput).fill(title);
    await modalForm.locator(this.selectors.confirmAddChecklistButton).click();

    const checklistTitle = this.page.locator(this.selectors.checklistCreatedTitle, { hasText: title });
    await checklistTitle.waitFor({ state: "visible" });

    console.log(`✅ Checklist "${title}" creado correctamente`);
  }

  async addChecklistItem(itemText: string) {
    console.log(`➕ Añadiendo item: "${itemText}"`);

    const formVisible = await this.page.locator(`form:has(${this.selectors.itemInput})`).isVisible();
    if (!formVisible) {
      await this.page.locator(this.selectors.addItemButton).click();
      await this.page.locator(`form:has(${this.selectors.itemInput})`).waitFor({ state: "attached", timeout: 10000 });
    }

    await this.page.locator(this.selectors.itemInput).fill(itemText);
    await this.page.locator(this.selectors.confirmAddItemButton).click();
    await this.page.locator(`input[type="checkbox"][aria-label="${itemText}"]`).waitFor({ state: "attached" });

    console.log(`✅ Item "${itemText}" añadido correctamente`);
  }

  async toggleChecklistItem(itemText: string) {
    console.log(`☑️ Marcar/desmarcar item: "${itemText}"`);

    const checkboxLabel = this.page
      .locator(this.selectors.itemContainer + `:has(div[aria-label="${itemText}"])`)
      .locator(this.selectors.clickableCheckbox);

    const checkboxInput = checkboxLabel.locator('input[type="checkbox"]');
    await checkboxLabel.waitFor({ state: "visible", timeout: 5000 });

    for (let attempt = 1; attempt <= 3; attempt++) {
      await checkboxLabel.click({ force: true });
      await this.page.waitForTimeout(200);
      if ((await checkboxInput.getAttribute("aria-checked")) === "true") return;
    }

    throw new Error(`❌ No se pudo marcar el item "${itemText}" después de 3 intentos`);
  }

  async validateChecklistExists(title: string) {
    console.log(`🔍 Validando checklist "${title}"...`);
    const checklist = this.page.locator(this.selectors.checklistCreatedTitle, { hasText: title }).first();
    expect(await checklist.isVisible()).toBeTruthy();
    console.log("✅ Checklist visible");
  }

  async validateItemCompleted(itemText: string) {
    console.log(`🔍 Validando item completado: "${itemText}"`);
    const checkbox = this.page.locator(`input[type="checkbox"][aria-label="${itemText}"]`);
    await checkbox.waitFor({ state: "visible", timeout: 8000 });
    expect(await checkbox.getAttribute("aria-checked")).toBe("true");
    console.log("✅ Item completado");
  }

  async deleteChecklist(title: string) {
    console.log(`🗑️ Eliminando checklist: "${title}"`);
    const checklistContainer = this.page.locator(this.selectors.checklistContainer, { hasText: title });
    await checklistContainer.waitFor({ state: "visible", timeout: 8000 });

    await checklistContainer.locator(this.selectors.deleteChecklistButton).click();
    await this.page.locator(this.selectors.confirmDeleteChecklistButton).waitFor({ state: "visible", timeout: 5000 });
    await this.page.locator(this.selectors.confirmDeleteChecklistButton).click();

    await checklistContainer.waitFor({ state: "detached", timeout: 5000 });
    console.log(`✅ Checklist "${title}" eliminado correctamente`);
  }
}
