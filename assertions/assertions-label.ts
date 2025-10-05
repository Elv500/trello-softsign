import { BaseAssertion } from './assertions-base';

export class AssertionLabel extends BaseAssertion {
  private static MODULE = 'label';

  static assert_post_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_post_input_schema.json', data, 'Schema POST input');
  }

  static assert_post_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'label_post_output_schema.json', data, 'Schema POST output');
  }
}