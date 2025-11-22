'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, FormButton, FormCard } from '@/src/components/forms';
import { authService } from '@/src/services/auth.service';
import { ApiError } from '@/src/types/auth';
import { registerSchema, type RegisterFormData } from '@choppi/types';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setGeneralError('');

    try {
      const { confirmPassword, ...signupData } = data;
      await authService.signup(signupData);
      router.push('/login?registered=true');
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.errors && Array.isArray(apiError.errors)) {
        // Errores de validación del backend
        apiError.errors.forEach((errorMsg) => {
          if (errorMsg.toLowerCase().includes('email')) {
            setError('email', { type: 'server', message: errorMsg });
          } else if (errorMsg.toLowerCase().includes('nombre')) {
            setError('name', { type: 'server', message: errorMsg });
          } else if (errorMsg.toLowerCase().includes('contraseña')) {
            setError('password', { type: 'server', message: errorMsg });
          }
        });
      } else {
        setGeneralError(apiError.message || 'Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Crear Cuenta">
      {generalError && (
        <div className="alert alert-error mb-4">
          <span>{generalError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          type="text"
          label="Nombre"
          placeholder="Tu nombre completo"
          error={errors.name?.message}
          {...registerField('name')}
        />

        <InputField
          type="email"
          label="Correo Electrónico"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          {...registerField('email')}
        />

        <InputField
          type="password"
          label="Contraseña"
          placeholder="********"
          error={errors.password?.message}
          helperText="Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número"
          {...registerField('password')}
        />

        <InputField
          type="password"
          label="Confirmar Contraseña"
          placeholder="********"
          error={errors.confirmPassword?.message}
          containerClassName="mb-6"
          {...registerField('confirmPassword')}
        />

        <FormButton loading={loading} disabled={loading}>
          Registrarse
        </FormButton>
      </form>
    </FormCard>
  );
}
