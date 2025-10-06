import { faker } from '@faker-js/faker';
import { LabelHelper } from '../../utils/api/label-helper';

export interface LabelPayload {
  name: string;
  color: string | null;
  idBoard: string;
}

export function buildLabelPayload(
  overrides: Partial<LabelPayload> = {}
): LabelPayload {
  const defaultPayload: LabelPayload = {
    name: faker.word.sample().concat(' Label'),
    color: LabelHelper.getValidColor(),
    idBoard: 'default-board-id',
  };
  return { ...defaultPayload, ...overrides };
}