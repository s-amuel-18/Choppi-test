import { InputField, FormButton, FormCard } from '@/src/components/forms';

export default function LoginPage() {
  return (
    <FormCard title="Iniciar Sesión">
      <form>
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
          containerClassName="mb-6"
          required
        />

        <FormButton>Ingresar</FormButton>
      </form>
    </FormCard>
  );
}
