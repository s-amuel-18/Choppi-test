export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}

