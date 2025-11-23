import { apiClient } from '@/src/lib/axios';
import { AxiosError } from 'axios';
import {
  Store,
  CreateStoreRequest,
  CreateStoreResponse,
  ApiError,
  ApiResponse,
} from '@/src/types/store';

class StoreService {
  /**
   * Crea una nueva tienda
   */
  async create(data: CreateStoreRequest): Promise<Store> {
    try {
      const response = await apiClient.post<ApiResponse<Store>>('/stores', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene todas las tiendas con paginación
   */
  async findAll(params?: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<{
    data: Store[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        data: Store[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>('/stores', { params });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene una tienda por su ID
   */
  async findOne(id: string): Promise<Store> {
    try {
      const response = await apiClient.get<ApiResponse<Store>>(`/stores/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Actualiza una tienda existente
   */
  async update(
    id: string,
    data: Partial<CreateStoreRequest>
  ): Promise<Store> {
    try {
      const response = await apiClient.put<ApiResponse<Store>>(
        `/stores/${id}`,
        data
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Elimina una tienda
   */
  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/stores/${id}`);
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

export const storeService = new StoreService();

