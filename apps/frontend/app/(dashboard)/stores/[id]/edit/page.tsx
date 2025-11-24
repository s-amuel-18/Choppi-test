'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormButton,
  ErrorAlert,
  StoreFormFields,
  ToggleField,
} from '@/src/components/forms';
import {
  updateStoreSchema,
  UpdateStoreInput,
} from '@/src/schemas/store.schema';
import { useUpdateStore } from '@/src/hooks/useUpdateStore';

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = (params.id as string) || null;

  const { store, loadingStore, updating, error, notFound, updateStore } =
    useUpdateStore(storeId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStoreInput>({
    resolver: zodResolver(updateStoreSchema),
    mode: 'onBlur',
  });

  
  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        description: store.description || '',
        address: store.address,
        phone: store.phone,
        email: store.email,
        isActive: store.isActive,
      });
    }
  }, [store, reset]);

  const onSubmit = async (data: UpdateStoreInput) => {
    await updateStore(data);
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

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <StoreFormFields register={register} errors={errors} />

            <ToggleField
              label="Estado de la Tienda"
              description="Activa o desactiva la tienda. Las tiendas inactivas no estarán disponibles para los clientes."
              error={errors.isActive?.message}
              {...register('isActive')}
            />

            <div className="flex gap-4 mt-6">
              <FormButton
                loading={updating}
                disabled={updating}
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
