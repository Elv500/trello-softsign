import Ajv, { DefinedError } from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

export class SchemaValidator {
  private static ajv = new Ajv({ allErrors: true, strict: false });

  static {
    addFormats(this.ajv);
  }

  /**
   * Valida un objeto JSON contra un schema.
   * @param schemaRelativePath Ruta relativa dentro de resources/schemas (ej: "/label/label_post_input_schema.json")
   * @param data Objeto a validar
   * @returns true si es válido, false si falla
   */
  static validate(schemaRelativePath: string, data: any): boolean {
    try {
      const basePath = path.resolve(__dirname, '../../resources/schemas');
      const schemaPath = path.join(basePath, schemaRelativePath);
      
      if (!fs.existsSync(schemaPath)) {
        console.error(`No se encontró el schema: ${schemaPath}`);
        return false;
      }

      const schemaRaw = fs.readFileSync(schemaPath, 'utf-8');
      const schema = JSON.parse(schemaRaw);

      const validate = this.ajv.compile(schema);
      const valid = validate(data);

      if (!valid) {
        console.error(`[Schema inválido] ${schemaRelativePath}`);
        (validate.errors as DefinedError[]).forEach((err) => {
          console.error(`${err.instancePath || '(root)'} => ${err.message}`);
        });
      }

      return !!valid;
    } catch (error) {
      console.error(`Error al validar schema (${schemaRelativePath}):`, error);
      return false;
    }
  }
}