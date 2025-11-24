import { getApiUrl } from '@/src/lib/api';
import {
  DashboardSummary,
  DashboardTopStore,
  DashboardOutOfStockProduct,
  ApiError,
  ApiResponse,
} from '@/src/types/dashboard';

class DashboardService {
  /**
   * Realiza una petición fetch a la API
   */
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al cargar datos del dashboard: ${response.status} ${response.statusText}`
      );
    }

    const payload = (await response.json()) as ApiResponse<T>;

    if (!payload.success || payload.data === undefined) {
      throw new Error('Respuesta inválida del servidor');
    }

    return payload.data;
  }

  /**
   * Obtiene el resumen general del dashboard
   */
  async getSummary(): Promise<DashboardSummary> {
    try {
      return await this.fetchApi<DashboardSummary>('/stores/summary');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene las últimas tiendas con métricas
   */
  async getTopStores(limit: number = 4): Promise<DashboardTopStore[]> {
    try {
      const endpoint = `/stores/top?limit=${limit}`;
      return await this.fetchApi<DashboardTopStore[]>(endpoint);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene los productos sin inventario
   */
  async getOutOfStockProducts(
    limit: number = 5
  ): Promise<DashboardOutOfStockProduct[]> {
    try {
      const endpoint = `/products/out-of-stock?limit=${limit}`;
      return await this.fetchApi<DashboardOutOfStockProduct[]>(endpoint);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene todos los datos del dashboard en paralelo
   */
  async getAllDashboardData(): Promise<{
    summary: DashboardSummary;
    topStores: DashboardTopStore[];
    outOfStockProducts: DashboardOutOfStockProduct[];
  }> {
    try {
      const [summary, topStores, outOfStockProducts] = await Promise.all([
        this.getSummary(),
        this.getTopStores(4),
        this.getOutOfStockProducts(5),
      ]);

      return {
        summary,
        topStores,
        outOfStockProducts,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Maneja errores de la API
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    return {
      message: 'Error desconocido',
    };
  }
}

export const dashboardService = new DashboardService();
