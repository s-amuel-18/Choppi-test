/**
 * Paquete de tipos compartidos entre backend y frontend
 * @package @choppi/types
 */

// Tipos de usuario
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Esquemas de validación
export * from './schemas';
export * from './api';
