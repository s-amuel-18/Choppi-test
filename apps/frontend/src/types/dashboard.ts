export interface DashboardSummary {
  totalProducts: number;
  totalStores: number;
  inactiveStores: number;
  outOfStockProducts: number;
}

export interface DashboardTopStore {
  id: string;
  name: string;
  isActive: boolean;
  totalProducts: number;
  totalInventory: number;
  createdAt: string;
}

export interface DashboardOutOfStockProduct {
  id: string;
  stock: number;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    category: string | null;
  };
  store: {
    id: string;
    name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}
