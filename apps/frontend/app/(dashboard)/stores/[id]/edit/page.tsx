'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  FormButton,
  ErrorAlert,
  StoreFormFields,
  StoreFormData,
} from '@/src/components/forms';

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingStore, setLoadingStore] = useState(true);
  const [generalError, setGeneralError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreFormData>({
    mode: 'onBlur',
  });

  // Load store data
  useEffect(() => {
    const loadStore = async () => {
      try {
        // TODO: Implement API call to get store by id
        // const store = await storeService.getById(storeId);

        // Simulate API call with sample data
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Sample store data - replace with actual API call
        const store = {
          id: storeId,
          name: 'Tienda Centro',
          description: 'Tienda principal ubicada en el centro',
          address: 'Av. Principal 123',
          phone: '555-0101',
          email: 'centro@tienda.com',
        };

        reset({
          name: store.name,
          description: store.description || '',
          address: store.address,
          phone: store.phone,
          email: store.email,
        });
      } catch (error) {
        setGeneralError('Error al cargar los datos de la tienda');
      } finally {
        setLoadingStore(false);
      }
    };

    if (storeId) {
      loadStore();
    }
  }, [storeId, reset]);

  const onSubmit = async (data: StoreFormData) => {
    setLoading(true);
    setGeneralError('');

    try {
      // TODO: Implement API call to update store
      console.log('Updating store:', storeId, data);
      // await storeService.update(storeId, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/stores');
    } catch (error) {
      const apiError = error as { message?: string; errors?: string[] };
      if (apiError.errors && Array.isArray(apiError.errors)) {
        setGeneralError(apiError.errors.join(', '));
      } else {
        setGeneralError(apiError.message || 'Error al actualizar la tienda');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingStore) {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Actualizar Tienda</h1>
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
                Actualizar Tienda
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
