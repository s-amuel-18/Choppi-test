import Navbar from '@/src/components/Navbar';

export default function LoginPage() {
  const navLinks = [
    { label: 'Login', href: '/login' },
    { label: 'Registro', href: '/register' },
  ];

  return (
    <>
      <Navbar brandName="Choppi App" links={navLinks} />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-base-200">
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="text-center text-3xl font-bold mb-6">
              Iniciar Sesión
            </h2>
            <form>
              <div className="form-control mb-4">
                <label className="label mb-2" htmlFor="email">
                  <span className="label-text">Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control mb-6">
                <label className="label mb-2" htmlFor="password">
                  <span className="label-text">Contraseña</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
