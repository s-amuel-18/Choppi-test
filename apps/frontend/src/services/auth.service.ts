import { apiClient } from '@/src/lib/axios';
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ApiError,
} from '@/src/types/auth';
import { AxiosError } from 'axios';

class AuthService {
  /**
   * Registra un nuevo usuario
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<SignupResponse>(
        '/auth/signup',
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Maneja errores de la API
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data;

      return {
        message: apiError?.message || error.message || 'Error desconocido',
        errors: apiError?.errors,
        statusCode: error.response?.status,
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export const authService = new AuthService();
