import { z } from 'zod';

/**
 * Esquema de validación para el registro de usuarios
 * Basado en las validaciones del backend (CreateUserDto)
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .trim(),

    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('El email debe tener un formato válido')
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(50, 'La contraseña no puede exceder 50 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
      ),

    confirmPassword: z
      .string()
      .min(1, 'La confirmación de contraseña es requerida'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Tipo inferido del esquema de registro
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Tipo para enviar al backend (sin confirmPassword)
 */
export type RegisterRequest = Omit<RegisterFormData, 'confirmPassword'>;

/**
 * Esquema de validación para el login de usuarios
 * Basado en las validaciones del backend (LoginDto)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El email debe tener un formato válido')
    .toLowerCase()
    .trim(),

  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Tipo inferido del esquema de login
 */
export type LoginFormData = z.infer<typeof loginSchema>;
