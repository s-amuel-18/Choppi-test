import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { InputField, TextareaField } from './index';
import { CreateProductInput, UpdateProductInput } from '@/src/schemas/product.schema';

export type ProductFormData = CreateProductInput;

// Tipo flexible que acepta tanto CreateProductInput como UpdateProductInput
type FlexibleProductFormData = CreateProductInput | UpdateProductInput;

interface ProductFormFieldsProps {
  register: UseFormRegister<CreateProductInput> | UseFormRegister<UpdateProductInput>;
  errors: FieldErrors<CreateProductInput> | FieldErrors<UpdateProductInput>;
}

export default function ProductFormFields({
  register,
  errors,
}: ProductFormFieldsProps) {
  return (
    <>
      <InputField
        type="text"
        label="Nombre del Producto"
        placeholder="Ingresa el nombre del producto"
        error={errors.name?.message}
        {...register('name')}
      />

      <TextareaField
        label="Descripción"
        placeholder="Ingresa la descripción del producto (opcional)"
        error={errors.description?.message}
        {...register('description')}
      />

      <InputField
        type="number"
        label="Precio Original"
        placeholder="0.00"
        step="0.01"
        min="0"
        error={errors.originalPrice?.message}
        helperText="Ingresa el precio en euros (ej: 99.99)"
        {...register('originalPrice', {
          valueAsNumber: true,
          setValueAs: (value) => {
            if (value === '' || value === null || value === undefined) {
              return undefined;
            }
            return Number(value);
          },
        })}
      />

      <InputField
        type="text"
        label="Categoría"
        placeholder="Ingresa la categoría del producto (opcional)"
        error={errors.category?.message}
        helperText="Ej: Electrónica, Ropa, Hogar, etc."
        {...register('category')}
      />
    </>
  );
}

