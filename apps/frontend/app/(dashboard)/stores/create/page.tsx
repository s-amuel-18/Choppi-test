'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormButton, ErrorAlert, StoreFormFields, StoreFormData } from '@/src/components/forms';
import { createStoreSchema } from '@/src/schemas/store.schema';
import { storeService } from '@/src/services/store.service';
import { ApiError } from '@/src/types/store';

export default function CreateStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(createStoreSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: StoreFormData) => {
    setLoading(true);
    setGeneralError('');

    try {
      await storeService.create(data);
      router.push('/stores');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors && Array.isArray(apiError.errors)) {
        setGeneralError(apiError.errors.join(', '));
      } else {
        setGeneralError(apiError.message || 'Error al crear la tienda');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Crear Tienda</h1>
          </div>

          <ErrorAlert message={generalError} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <StoreFormFields register={register} errors={errors} />

            <div className="flex gap-4 mt-6">
              <FormButton
                loading={loading}
                disabled={loading}
                fullWidth={false}
                className="flex-1"
              >
                Crear Tienda
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
