import { BaseAssertion } from '../assertions-base';

export class AssertionAttachment extends BaseAssertion {
  private static MODULE = 'attachment';

  static assert_post_input_schema(data: any): void {
    this.validateSchema(this.MODULE, 'attachment_input_schema.json', data, 'Schema POST input');
  }

  static assert_post_output_schema(data: any): void {
    this.validateSchema(this.MODULE, 'attachment_post_output_schema.json', data, 'Schema POST output');
  }
}
