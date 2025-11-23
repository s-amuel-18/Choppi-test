'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormButton,
  ErrorAlert,
  ProductFormFields,
} from '@/src/components/forms';
import {
  updateProductSchema,
  UpdateProductInput,
} from '@/src/schemas/product.schema';
import { useUpdateProduct } from '@/src/hooks/useUpdateProduct';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = (params.id as string) || null;

  const { product, loadingProduct, updating, error, notFound, updateProduct } =
    useUpdateProduct(productId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    mode: 'onBlur',
  });

  // Reset form when product is loaded
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        originalPrice: product.originalPrice,
        category: product.category ?? '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: UpdateProductInput) => {
    await updateProduct(data);
  };

  if (loadingProduct) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">
                Producto no encontrado
              </h2>
              <p className="text-base-content/60 mb-6">
                El producto que estás buscando no existe o ha sido eliminado.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="btn btn-primary"
              >
                Volver a Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Actualizar Producto</h1>
          </div>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <ProductFormFields register={register} errors={errors} />

            <div className="flex gap-4 mt-6">
              <FormButton
                loading={updating}
                disabled={updating}
                fullWidth={false}
                className="flex-1"
              >
                Actualizar Producto
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
