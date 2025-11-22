'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { InputField, FormButton, FormCard } from '@/src/components/forms';
import { loginSchema, type LoginFormData } from '@choppi/types';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },

    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const registered = searchParams.get('registered');

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          'Credenciales inválidas. Por favor, verifica tu email y contraseña.'
        );
      } else if (result?.ok) {
        router.push('/dashboard');
        // router.refresh();
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Iniciar Sesión">
      {registered && (
        <div className="alert alert-success mb-4">
          <span>¡Registro exitoso! Ahora puedes iniciar sesión.</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          type="email"
          label="Correo Electrónico"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          value={'test@test.com'}
          {...registerField('email')}
        />

        <InputField
          type="password"
          label="Contraseña"
          placeholder="********"
          error={errors.password?.message}
          value={'0424Sam??'}
          containerClassName="mb-6"
          {...registerField('password')}
        />

        <FormButton loading={loading} disabled={loading}>
          Ingresar
        </FormButton>
      </form>
    </FormCard>
  );
}
