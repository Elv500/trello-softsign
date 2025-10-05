import path from 'path';

export class SchemaLoader {
  /**
   * Construye la ruta del schema JSON de un módulo específico.
   * @param schemaFile Nombre del archivo (ej: "label_post_input_schema.json")
   * @param module Carpeta del módulo (ej: "label")
   * @returns Ruta relativa para el SchemaValidator
   */
  static getSchemaPath(schemaFile: string, module: string): string {
    return path.join(`/${module}/${schemaFile}`);
  }
}