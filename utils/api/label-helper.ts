import colors from '../../data/colors-label.json';
import { faker } from '@faker-js/faker';

export class LabelHelper {

  static getValidColor(): string {
    const { validColors } = colors;
    const randomIndex = Math.floor(Math.random() * validColors.length);
    return validColors[randomIndex];
  }

  static getRandomInvalidColor(): string {
    const { validColors } = colors;

    let generatedColor: string;

    do {
      generatedColor = faker.color.human().toLowerCase();
    } while (validColors.includes(generatedColor));

    return generatedColor;
  }
}