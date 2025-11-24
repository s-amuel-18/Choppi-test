'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputField, FormButton, ErrorAlert } from '@/src/components/forms';
import { StoreProduct } from '@/src/types/store-product';

const updateStoreProductSchema = z.object({
  stock: z
    .number({
      required_error: 'El stock es requerido',
      invalid_type_error: 'El stock debe ser un número',
    })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock debe ser mayor o igual a 0'),
  storePrice: z
    .number({
      invalid_type_error: 'El precio debe ser un número',
    })
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(999999.99, 'El precio no puede exceder 999,999.99')
    .optional()
    .nullable(),
});

type UpdateStoreProductInput = z.infer<typeof updateStoreProductSchema>;

interface UpdateStoreProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stock: number, storePrice?: number | null) => Promise<void>;
  loading?: boolean;
  storeProduct: StoreProduct | null;
}

export default function UpdateStoreProductModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  storeProduct,
}: UpdateStoreProductModalProps) {
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStoreProductInput>({
    resolver: zodResolver(updateStoreProductSchema),
    mode: 'onBlur',
  });

  // Cargar datos del producto cuando se abre el modal o cambia el storeProduct
  useEffect(() => {
    if (isOpen && storeProduct) {
      reset({
        stock: storeProduct.stock,
        storePrice: storeProduct.storePrice ?? undefined,
      });
    }
  }, [isOpen, storeProduct, reset]);

  const handleFormSubmit = async (data: UpdateStoreProductInput) => {
    setError('');
    try {
      await onSubmit(data.stock, data.storePrice);
      reset();
    } catch (err) {
      // Error ya manejado en el componente padre
      setError('Error al actualizar el producto de la tienda');
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  if (!isOpen || !storeProduct) return null;

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Actualizar Producto en Tienda
        </h3>

        <div className="mb-4 p-3 bg-base-200 rounded-lg">
          <p className="text-sm text-base-content/70 mb-1">Producto:</p>
          <p className="font-semibold">{storeProduct.product.name}</p>
        </div>

        <ErrorAlert message={error} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <InputField
            type="number"
            label="Stock"
            placeholder="0"
            min="0"
            step="1"
            error={errors.stock?.message}
            helperText="Cantidad de unidades disponibles"
            {...register('stock', {
              valueAsNumber: true,
            })}
          />

          <InputField
            type="number"
            label="Precio de Tienda (Opcional)"
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.storePrice?.message}
            helperText="Precio específico para esta tienda."
            {...register('storePrice', {
              valueAsNumber: true,
              setValueAs: (value) => {
                if (value === '' || value === null || value === undefined) {
                  return undefined;
                }
                return Number(value);
              },
            })}
          />

          <div className="modal-action">
            <FormButton loading={loading} disabled={loading} fullWidth={false}>
              Actualizar Producto
            </FormButton>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} disabled={loading}>
          cerrar
        </button>
      </form>
    </dialog>
  );
}
