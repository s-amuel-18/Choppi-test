'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { InputField, FormButton } from '@/src/components/forms';

interface CreateStoreFormData {
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
}

export default function CreateStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoreFormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateStoreFormData) => {
    setLoading(true);
    setGeneralError('');

    try {
      // TODO: Implement API call to create store
      console.log('Creating store:', data);
      // await storeService.create(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/stores');
    } catch (error) {
      const apiError = error as { message?: string; errors?: string[] };
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
      {/* Form Card */}
      <div className="card bg-base-100 shadow-xl ">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Crear Tienda</h1>
          </div>
          {generalError && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              type="text"
              label="Nombre de la Tienda"
              placeholder="Ingresa el nombre de la tienda"
              error={errors.name?.message}
              {...register('name', {
                required: 'El nombre de la tienda es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
                maxLength: {
                  value: 100,
                  message: 'El nombre no puede exceder 100 caracteres',
                },
              })}
            />

            <div className="form-control mb-4">
              <label className="label mb-2">
                <span className="label-text">Descripción</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full min-h-24"
                placeholder="Ingresa la descripción de la tienda (opcional)"
                {...register('description')}
              />
            </div>

            <InputField
              type="text"
              label="Dirección"
              placeholder="Ingresa la dirección de la tienda"
              error={errors.address?.message}
              {...register('address', {
                required: 'La dirección es requerida',
                minLength: {
                  value: 5,
                  message: 'La dirección debe tener al menos 5 caracteres',
                },
                maxLength: {
                  value: 200,
                  message: 'La dirección no puede exceder 200 caracteres',
                },
              })}
            />

            <InputField
              type="tel"
              label="Teléfono"
              placeholder="Ingresa el número de teléfono"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'El teléfono es requerido',
                minLength: {
                  value: 10,
                  message: 'El teléfono debe tener al menos 10 caracteres',
                },
                maxLength: {
                  value: 20,
                  message: 'El teléfono no puede exceder 20 caracteres',
                },
              })}
            />

            <InputField
              type="email"
              label="Correo Electrónico"
              placeholder="Ingresa el correo electrónico"
              error={errors.email?.message}
              {...register('email', {
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'El correo electrónico no es válido',
                },
              })}
            />

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
