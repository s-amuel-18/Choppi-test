import { apiClient } from '@/src/lib/axios';
import { AxiosError } from 'axios';
import {
  Product,
  CreateProductRequest,
  ApiError,
  ApiResponse,
} from '@/src/types/product';

class ProductService {
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

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findStoreProducts(
    storeId: string,
    params?: {
      page?: number;
      limit?: number;
      q?: string;
      inStock?: boolean;
    }
  ): Promise<{
    data: Array<{
      id: string;
      storeId: string;
      productId: string;
      stock: number;
      storePrice: number | null;
      createdAt: string;
      updatedAt: string;
      product: Product;
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          data: Array<{
            id: string;
            storeId: string;
            productId: string;
            stock: number;
            storePrice: number | null;
            createdAt: string;
            updatedAt: string;
            product: Product;
          }>;
          meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        }>
      >(`/stores/${storeId}/products`, { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addProductToStore(
    storeId: string,
    data: {
      productId: string;
      stock: number;
      storePrice?: number | null;
    }
  ): Promise<{
    id: string;
    storeId: string;
    productId: string;
    stock: number;
    storePrice: number | null;
    createdAt: string;
    updatedAt: string;
    product: Product;
  }> {
    try {
      const response = await apiClient.post<
        ApiResponse<{
          id: string;
          storeId: string;
          productId: string;
          stock: number;
          storePrice: number | null;
          createdAt: string;
          updatedAt: string;
          product: Product;
        }>
      >(`/stores/${storeId}/products`, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStoreProduct(
    storeId: string,
    storeProductId: string,
    data: {
      stock?: number;
      storePrice?: number | null;
    }
  ): Promise<{
    id: string;
    storeId: string;
    productId: string;
    stock: number;
    storePrice: number | null;
    createdAt: string;
    updatedAt: string;
    product: Product;
  }> {
    try {
      const response = await apiClient.put<
        ApiResponse<{
          id: string;
          storeId: string;
          productId: string;
          stock: number;
          storePrice: number | null;
          createdAt: string;
          updatedAt: string;
          product: Product;
        }>
      >(`/stores/${storeId}/products/${storeProductId}`, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductStores(productId: string): Promise<
    Array<{
      id: string;
      storeId: string;
      storeName: string;
      storeAddress: string;
      storeEmail: string;
      stock: number;
      storePrice: number | null;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    try {
      const response = await apiClient.get<
        ApiResponse<
          Array<{
            id: string;
            storeId: string;
            storeName: string;
            storeAddress: string;
            storeEmail: string;
            stock: number;
            storePrice: number | null;
            createdAt: string;
            updatedAt: string;
          }>
        >
      >(`/products/${productId}/stores`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw this.handleError(error);
    }
  }

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
