import { ApiResponse } from '../interfaces/api-response.interface';

export function buildResponse<T>(
  message: string,
  data: T | null,
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}