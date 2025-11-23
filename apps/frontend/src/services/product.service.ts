import { apiClient } from '@/src/lib/axios';
import { AxiosError } from 'axios';
import {
  Product,
  CreateProductRequest,
  ApiError,
  ApiResponse,
} from '@/src/types/product';

class ProductService {
  /**
   * Crea un nuevo producto
   */
  async create(data: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        '/products',
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
   * Obtiene todos los productos con paginación
   */
  async findAll(params?: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          data: Product[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>
      >('/products', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene un producto por su ID
   */
  async findOne(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/${id}`
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
   * Actualiza un producto existente
   */
  async update(
    id: string,
    data: Partial<CreateProductRequest>
  ): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(
        `/products/${id}`,
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

export const productService = new ProductService();
