import { Response } from 'supertest';
import { ApiResponse } from '@choppi/types';

/**
 * Utilidades para tests que trabajan con la estructura ApiResponse
 */

/**
 * Verifica que la respuesta tenga la estructura ApiResponse correcta
 */
export function expectApiResponse<T = unknown>(
  response: Response,
  expectedSuccess: boolean = true,
): ApiResponse<T> {
  expect(response.body).toHaveProperty('success');
  expect(response.body.success).toBe(expectedSuccess);

  if (expectedSuccess) {
    expect(response.body).toHaveProperty('data');
  }

  return response.body as ApiResponse<T>;
}

/**
 * Obtiene los datos de una respuesta exitosa
 */
export function getResponseData<T>(response: Response): T {
  expectApiResponse(response, true);
  return (response.body as ApiResponse<T>).data as T;
}

/**
 * Verifica que una respuesta sea un error
 */
export function expectErrorResponse(
  response: Response,
  expectedStatusCode: number,
): void {
  expect(response.status).toBe(expectedStatusCode);
  expect(response.body).toHaveProperty('message');
  expect(response.body).toHaveProperty('statusCode');
  expect(response.body.statusCode).toBe(expectedStatusCode);
}
