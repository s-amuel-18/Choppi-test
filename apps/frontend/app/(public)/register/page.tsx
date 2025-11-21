import { InputField, FormButton, FormCard } from '@/src/components/forms';

export default function RegisterPage() {
  return (
    <FormCard title="Crear Cuenta">
      <form>
        <InputField
          type="text"
          name="name"
          label="Nombre"
          placeholder="Tu nombre completo"
          required
        />

        <InputField
          type="email"
          name="email"
          label="Correo Electrónico"
          placeholder="correo@ejemplo.com"
          required
        />

        <InputField
          type="password"
          name="password"
          label="Contraseña"
          placeholder="********"
          required
        />

        <InputField
          type="password"
          name="confirmPassword"
          label="Confirmar Contraseña"
          placeholder="********"
          containerClassName="mb-6"
          required
        />

        <FormButton>Registrarse</FormButton>
      </form>
    </FormCard>
  );
}
