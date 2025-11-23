import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { InputField, TextareaField } from './index';
import { CreateStoreInput } from '@/src/schemas/store.schema';

export type StoreFormData = CreateStoreInput;

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
        {...register('name')}
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
        {...register('address')}
      />

      <InputField
        type="tel"
        label="Teléfono"
        placeholder="Ingresa el número de teléfono"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <InputField
        type="email"
        label="Correo Electrónico"
        placeholder="Ingresa el correo electrónico"
        error={errors.email?.message}
        {...register('email')}
      />
    </>
  );
}

