import { TrelloRequest } from './trello-request';

export async function attachUrlToCard(cardId: string, url: string, name: string, opts?: { throwOnError?: boolean }) {
  const formData = { url, name };
  const response = await TrelloRequest.postFormData(`cards/${cardId}/attachments`, formData);
  const status = response.status();
  let body: any;
  try {
    body = await response.json();
  } catch (e) {
    // Some error responses might not be JSON (HTML or plain text). Fall back to text.
    try {
      body = await response.text();
    } catch (_) {
      body = null;
    }
  }
  if (opts?.throwOnError && status !== 200) throw new Error(`No se pudo adjuntar la imagen (status ${status})`);
  return { status, body };
}
