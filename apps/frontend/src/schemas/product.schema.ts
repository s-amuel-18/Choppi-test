import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre del producto es requerido',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .nullable(),
  originalPrice: z
    .number({
      required_error: 'El precio original es requerido',
      invalid_type_error: 'El precio debe ser un número',
    })
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(999999.99, 'El precio no puede exceder 999,999.99'),
  category: z
    .string()
    .max(100, 'La categoría no puede exceder 100 caracteres')
    .optional()
    .nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .optional(),
  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .nullable(),
  originalPrice: z
    .number({
      invalid_type_error: 'El precio debe ser un número',
    })
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(999999.99, 'El precio no puede exceder 999,999.99')
    .optional(),
  category: z
    .string()
    .max(100, 'La categoría no puede exceder 100 caracteres')
    .optional()
    .nullable(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

