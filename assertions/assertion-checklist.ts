import { BaseAssertion } from './assertions-base';

export class AssertionChecklist extends BaseAssertion {
  private static MODULE = 'checklist';

  static assert_post_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'post_input.schema.json', data, 'Schema POST input');
  }

  static assert_post_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'post_output.schema.json', data, 'Schema POST output');
  }

  static assert_put_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'post_input.schema.json', data, 'Schema PUT input');
  }

  static assert_put_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'post_output.schema.json', data, 'Schema PUT output');
  }

  static assert_add_item_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'item_post_input.schema.json', data, 'Schema add item input');
  }

  static assert_add_item_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'item_post_output.schema.json', data, 'Schema add item output');
  }
}