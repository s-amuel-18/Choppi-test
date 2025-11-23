export interface Store {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  name: string;
  description?: string | null;
  address: string;
  phone: string;
  email: string;
}

export interface CreateStoreResponse {
  success: boolean;
  data: Store;
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

