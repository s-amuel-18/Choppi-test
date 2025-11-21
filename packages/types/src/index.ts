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

// Exportar todos los tipos desde este archivo central
// Agrega aquí tus tipos compartidos que necesiten usar tanto backend como frontend
