'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormButton,
  ErrorAlert,
  StoreFormFields,
} from '@/src/components/forms';
import {
  updateStoreSchema,
  UpdateStoreInput,
} from '@/src/schemas/store.schema';
import { storeService } from '@/src/services/store.service';
import { ApiError } from '@/src/types/store';

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingStore, setLoadingStore] = useState(true);
  const [generalError, setGeneralError] = useState<string>('');
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStoreInput>({
    resolver: zodResolver(updateStoreSchema),
    mode: 'onBlur',
  });

  // Load store data
  useEffect(() => {
    const loadStore = async () => {
      if (!storeId) {
        setNotFound(true);
        setLoadingStore(false);
        return;
      }

      try {
        const store = await storeService.findOne(storeId);

        reset({
          name: store.name,
          description: store.description || '',
          address: store.address,
          phone: store.phone,
          email: store.email,
        });
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.statusCode === 404) {
          setNotFound(true);
          setGeneralError('Tienda no encontrada');
        } else {
          setGeneralError(
            apiError.message || 'Error al cargar los datos de la tienda'
          );
        }
      } finally {
        setLoadingStore(false);
      }
    };

    loadStore();
  }, [storeId, reset]);

  const onSubmit = async (data: UpdateStoreInput) => {
    if (!storeId) return;

    setLoading(true);
    setGeneralError('');

    try {
      await storeService.update(storeId, data);
      router.push('/stores');
    } catch (error) {
      const apiError = error as ApiError;
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

  if (notFound) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Tienda no encontrada</h2>
              <p className="text-base-content/60 mb-6">
                La tienda que estás buscando no existe o ha sido eliminada.
              </p>
              <button
                onClick={() => router.push('/stores')}
                className="btn btn-primary"
              >
                Volver a Tiendas
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
