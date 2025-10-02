import { faker } from '@faker-js/faker';

/**
 * Helper class para generar datos aleatorios específicos para Trello
 */
export class TrelloDataGenerator {
  
  /**
   * Genera nombres de cartas aleatorios con contexto apropiado
   */
  static generateCardName(): string {
    const templates = [
      () => faker.word.noun(),
      () => faker.company.buzzNoun(),
      () => faker.hacker.noun(),
      () => faker.word.adjective(),
      () => faker.color.human()
    ];
    
    const randomTemplate = faker.helpers.arrayElement(templates);
    return randomTemplate();
  }

  /**
   * Genera nombres de tareas de checklist
   */
  static generateChecklistItem(): string {
    const templates = [
      () => faker.word.noun(),
      () => faker.company.buzzNoun(),
      () => faker.hacker.noun(),
      () => faker.word.adjective(),
      () => faker.color.human()
    ];
    
    const randomTemplate = faker.helpers.arrayElement(templates);
    return randomTemplate();
  }

  /**
   * Genera nombres de tableros de una sola palabra
   */
  static generateBoardName(): string {
    const templates = [
      () => faker.word.noun(),
      () => faker.company.buzzNoun(),
      () => faker.hacker.noun(),
      () => faker.word.adjective(),
      () => faker.color.human()
    ];
    
    const randomTemplate = faker.helpers.arrayElement(templates);
    return randomTemplate();
  }

  /**
   * Genera descripciones de cartas
   */
  static generateCardDescription(): string {
    return faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }));
  }

  /**
   * Genera comentarios para cartas
   */
  static generateComment(): string {
    const templates = [
      () => faker.lorem.sentence(),
      () => `${faker.hacker.phrase()}!`,
      () => `@${faker.internet.username()} ${faker.lorem.sentence()}`,
      () => `✅ ${faker.company.buzzPhrase()}`
    ];
    
    const randomTemplate = faker.helpers.arrayElement(templates);
    return randomTemplate();
  }

  /**
   * Genera etiquetas de colores aleatorios
   */
  static generateLabelName(): string {
    const priorities = ['High Priority', 'Medium Priority', 'Low Priority'];
    const categories = ['Bug', 'Feature', 'Enhancement', 'Documentation'];
    const statuses = ['In Progress', 'Review', 'Testing', 'Done'];
    
    const allLabels = [...priorities, ...categories, ...statuses];
    return faker.helpers.arrayElement(allLabels);
  }

  /**
   * Genera datos completos para una carta
   */
  static generateCompleteCardData() {
    return {
      name: this.generateCardName(),
      description: this.generateCardDescription(),
      checklistItems: [
        this.generateChecklistItem(),
        this.generateChecklistItem(),
        this.generateChecklistItem()
      ],
      comments: [
        this.generateComment(),
        this.generateComment()
      ],
      label: this.generateLabelName()
    };
  }

  /**
   * Genera fechas futuras aleatorias para due dates
   */
  static generateDueDate(): Date {
    return faker.date.future();
  }

  /**
   * Genera nombres de usuarios aleatorios
   */
  static generateUsername(): string {
    return faker.internet.username();
  }
}

// Export individual functions for easier use
export const {
  generateCardName,
  generateChecklistItem,
  generateBoardName,
  generateCardDescription,
  generateComment,
  generateLabelName,
  generateCompleteCardData,
  generateDueDate,
  generateUsername
} = TrelloDataGenerator;