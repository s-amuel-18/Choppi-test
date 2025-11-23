'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormButton,
  ErrorAlert,
  ProductFormFields,
} from '@/src/components/forms';
import {
  createProductSchema,
  CreateProductInput,
} from '@/src/schemas/product.schema';
import { useCreateProduct } from '@/src/hooks/useCreateProduct';

export default function CreateProductPage() {
  const { loading, error, createProduct } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateProductInput) => {
    await createProduct(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Crear Producto</h1>
          </div>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <ProductFormFields register={register} errors={errors} />

            <div className="flex gap-4 mt-6">
              <FormButton
                loading={loading}
                disabled={loading}
                fullWidth={false}
                className="flex-1"
              >
                Crear Producto
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
