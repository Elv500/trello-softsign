import { BaseAssertion } from './assertions-base';

export class AssertionLabel extends BaseAssertion {
  private static MODULE = 'label';

  static assert_post_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_post_input_schema.json', data, 'Schema POST input');
  }

  static assert_post_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_post_output_schema.json', data, 'Schema POST output');
  }

  static assert_get_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_get_output_schema.json', data, 'Schema GET output');
  }

  static assert_get_list_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_get_list_schema.json', data, 'Schema GET list output');
  }

  static assert_put_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_put_input_schema.json', data, 'Schema PUT input');
  }
  static assert_put_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_put_output_schema.json', data, 'Schema PUT output');
  }
}