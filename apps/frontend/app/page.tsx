import Navbar from '@/src/components/Navbar';
import Link from 'next/link';

export default function Home() {
  const navLinks = [
    { label: 'Login', href: '/login' },
    { label: 'Registro', href: '/register' },
  ];

  return (
    <>
      <Navbar brandName="Choppi App" links={navLinks} />

      <div className="hero min-h-[calc(100vh-4rem)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">¡Bienvenido a Choppi!</h1>
            <p className="mb-5 text-lg">
              Tu plataforma de confianza para gestionar tus servicios de manera
              eficiente y sencilla. Únete a nuestra comunidad y comienza a
              disfrutar de todas las ventajas.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/login" className="btn btn-primary btn-lg">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
