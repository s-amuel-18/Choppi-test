export interface Product {
  id: string;
  name: string;
  description: string | null;
  originalPrice: number;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string | null;
  originalPrice: number;
  category?: string | null;
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
