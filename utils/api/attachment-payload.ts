import { AssertionAttachment } from '../../assertions/attachment-assertions/assertion-attachment';
import { authParams } from '../../config/auth/api/auth-params';

export type AttachmentInputBody = {
  url?: string;
  name?: string;
  setCover?: boolean;
  fileBase64?: string;
  mimeType?: string;
};

export function buildAttachmentInput(
  cardId: string,
  body: AttachmentInputBody,
  opts?: { validate?: boolean; headers?: Record<string, string>; extraQuery?: Record<string, string> }
) {
  const query = authParams(opts?.extraQuery);
  const headers = { Accept: 'application/json', ...(opts?.headers ?? {}) };

  const payload = {
    pathParams: { id: cardId },
    query,
    headers,
    body,
  };

  if (opts?.validate) {
    AssertionAttachment.assert_post_input_schema(payload);
  }

  return payload;
}

export default { buildAttachmentInput };
