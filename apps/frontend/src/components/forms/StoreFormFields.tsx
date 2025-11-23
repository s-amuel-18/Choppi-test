import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { InputField, TextareaField } from './index';

export interface StoreFormData {
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
}

interface StoreFormFieldsProps {
  register: UseFormRegister<StoreFormData>;
  errors: FieldErrors<StoreFormData>;
}

export default function StoreFormFields({ register, errors }: StoreFormFieldsProps) {
  return (
    <>
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

      <TextareaField
        label="Descripción"
        placeholder="Ingresa la descripción de la tienda (opcional)"
        error={errors.description?.message}
        {...register('description')}
      />

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
    </>
  );
}

