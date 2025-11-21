/**
 * Paquete de tipos compartidos entre backend y frontend
 * @package @choppi/types
 */

// Ejemplo: Tipos de usuario
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Ejemplo: Tipos de API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Ejemplo: Tipos de paginación
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Exportar todos los tipos desde este archivo central
// Agrega aquí tus tipos compartidos que necesiten usar tanto backend como frontend
