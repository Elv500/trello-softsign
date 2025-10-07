import { expect } from '@playwright/test';

export class AssertionStatusCode {
  static assert_status_code(responseOrStatus: { status?: () => number } | number, expected: number) {
    const status = typeof responseOrStatus === 'number' ? responseOrStatus : responseOrStatus.status?.();
    expect(status, `Expected status: ${expected} = Obtained: ${status}`).toBe(expected);
  }

  static assert_status_code_200(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 200);
  }

  static assert_status_code_201(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 201);
  }

  static assert_status_code_204(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 204);
  }

  static assert_status_code_400(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 400);
  }

  static assert_status_code_401(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 401);
  }

  static assert_status_code_403(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 403);
  }

  static assert_status_code_404(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 404);
  }

  static assert_status_code_405(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 405);
  }

  static assert_status_code_409(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 409);
  }

  static assert_status_code_415(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 415);
  }

  static assert_status_code_422(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 422);
  }

  static assert_status_code_500(responseOrStatus: { status?: () => number } | number) {
    this.assert_status_code(responseOrStatus, 500);
  }
}
