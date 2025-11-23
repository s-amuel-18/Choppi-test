import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre de la tienda es requerido',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .nullable(),
  address: z
    .string({
      required_error: 'La dirección es requerida',
    })
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  phone: z
    .string({
      required_error: 'El teléfono es requerido',
    })
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  email: z
    .string({
      required_error: 'El correo electrónico es requerido',
    })
    .email('El correo electrónico no es válido'),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;

export const updateStoreSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .nullable(),
  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),
  email: z.string().email('El correo electrónico no es válido').optional(),
  isActive: z.boolean().optional(),
});

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
