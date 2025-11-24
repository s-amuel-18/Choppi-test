'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputField, FormButton, ErrorAlert } from '@/src/components/forms';
import SearchableSelect from '@/src/components/forms/SearchableSelect';
import { Product } from '@/src/types/product';
import { productService } from '@/src/services/product.service';

const addProductToStoreSchema = z.object({
  productId: z.string().uuid('Debe seleccionar un producto'),
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

type AddProductToStoreInput = z.infer<typeof addProductToStoreSchema>;

interface AddProductToStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    productId: string,
    stock: number,
    storePrice?: number | null
  ) => Promise<void>;
  loading?: boolean;
  storeId: string | null;
  existingProductIds?: string[];
}

export default function AddProductToStoreModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  storeId,
  existingProductIds = [],
}: AddProductToStoreModalProps) {
  const [error, setError] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Cargar todos los productos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const loadAllProducts = async () => {
        setLoadingProducts(true);
        try {
          // Cargar todos los productos sin paginación (usando un límite alto)
          const result = await productService.findAll({
            page: 1,
            limit: 1000, // Límite alto para obtener todos
          });
          setAllProducts(result.data);
        } catch (err) {
          setError('Error al cargar los productos');
        } finally {
          setLoadingProducts(false);
        }
      };

      loadAllProducts();
    }
  }, [isOpen]);

  
  const availableProducts = useMemo(() => {
    if (!storeId || existingProductIds.length === 0) {
      return allProducts;
    }
    return allProducts.filter(
      (product) => !existingProductIds.includes(product.id)
    );
  }, [allProducts, storeId, existingProductIds]);

  
  const productOptions = useMemo(() => {
    return availableProducts.map((product) => ({
      value: product.id,
      label: `${product.name} - ${new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(product.originalPrice)}`,
    }));
  }, [availableProducts]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddProductToStoreInput>({
    resolver: zodResolver(addProductToStoreSchema),
    mode: 'onBlur',
  });

  const selectedProductId = watch('productId');

  const handleFormSubmit = async (data: AddProductToStoreInput) => {
    setError('');
    try {
      await onSubmit(data.productId, data.stock, data.storePrice);
      reset();
    } catch (err) {
      // Error ya manejado en el componente padre
      setError('Error al agregar el producto a la tienda');
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Agregar Producto a Tienda</h3>

        <ErrorAlert message={error} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            {loadingProducts ? (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Producto</span>
                </label>
                <div className="select select-bordered w-full">
                  <div className="flex items-center justify-center py-4">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="ml-2">Cargando productos...</span>
                  </div>
                </div>
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Producto</span>
                </label>
                <div className="alert alert-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>
                    Todos los productos ya están vinculados a esta tienda. No
                    hay productos disponibles para agregar.
                  </span>
                </div>
              </div>
            ) : (
              <>
                <SearchableSelect
                  options={productOptions}
                  value={selectedProductId || ''}
                  onChange={(value) => {
                    setValue('productId', value, { shouldValidate: true });
                  }}
                  placeholder="Buscar y seleccionar producto..."
                  disabled={loading || loadingProducts}
                  error={errors.productId?.message}
                  label="Producto"
                  maxResults={20}
                />
                {}
                <input type="hidden" {...register('productId')} />
              </>
            )}
          </div>

          {availableProducts.length > 0 && (
            <>
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
            </>
          )}

          <div className="modal-action">
            {availableProducts.length > 0 && (
              <FormButton
                loading={loading}
                disabled={loading}
                fullWidth={false}
              >
                Agregar Producto
              </FormButton>
            )}
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
