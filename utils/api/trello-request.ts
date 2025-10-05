import { request, APIRequestContext } from '@playwright/test';
import { authParams } from '../../config/auth/api/auth-params';

export class TrelloRequest {
  private static api: APIRequestContext;

  private static async getApi(): Promise<APIRequestContext> {
    if (!TrelloRequest.api) {
      TrelloRequest.api = await request.newContext({
        baseURL: process.env.BASE_URL,
      });
    }
    return TrelloRequest.api;
  }

  static async get(endpoint: string) {
    const api = await TrelloRequest.getApi();
    return api.get(endpoint, { params: authParams() });
  }

  static async post(endpoint: string, data?: any) {
    const api = await TrelloRequest.getApi();
    return api.post(endpoint, { params: authParams(), data });
  }

  /**
   * Post form data as application/x-www-form-urlencoded.
   * Used for endpoints that expect form fields (for example Trello attachments via url).
   */
  static async postFormData(endpoint: string, formData: Record<string, any>) {
    const api = await TrelloRequest.getApi();
    const params = authParams();
    const body = new URLSearchParams();
    for (const key of Object.keys(formData || {})) {
      const value = formData[key];
      // Ensure arrays/objects are stringified in a reasonable way
      body.append(key, value === undefined || value === null ? '' : String(value));
    }
    return api.post(endpoint, {
      params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: body.toString(),
    });
  }

  static async put(endpoint: string, data?: any) {
    const api = await TrelloRequest.getApi();
    return api.put(endpoint, { params: authParams(), data });
  }

  static async delete(endpoint: string) {
    const api = await TrelloRequest.getApi();
    return api.delete(endpoint, { params: authParams() });
  }
}