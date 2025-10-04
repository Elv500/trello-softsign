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

  static async put(endpoint: string, data?: any) {
    const api = await TrelloRequest.getApi();
    return api.put(endpoint, { params: authParams(), data });
  }

  static async delete(endpoint: string) {
    const api = await TrelloRequest.getApi();
    return api.delete(endpoint, { params: authParams() });
  }

  static async postFormData(endpoint: string, formData: Record<string, any>) {
    const api = await TrelloRequest.getApi();
    return api.post(endpoint, {
      params: authParams(),
      headers: {
        'Accept': 'application/json',
      },
      form: formData,
    });
  }
}