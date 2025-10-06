import { SchemaValidator } from '../utils/api/schema-validator';
import { SchemaLoader } from '../utils/api/schema-loader';
import { expect } from '@playwright/test';

export abstract class BaseAssertion {
  protected static validateSchema(module: string, schemaFile: string, data: any, description: string): void {
    const schemaPath = SchemaLoader.getSchemaPath(schemaFile, module);
    const valid = SchemaValidator.validate(schemaPath, data);
    expect(valid, `[${module}] ${description} inválido`).toBe(true);
  }
}