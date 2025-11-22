import { auth } from '@/src/auth/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl mb-4">
          ¡Bienvenido, {session.user?.name}!
        </h2>
        <p className="text-lg">
          Este es tu panel de control. Aquí podrás gestionar todas tus
          actividades y configuraciones.
        </p>
        <div className="stats shadow mt-6">
          <div className="stat">
            <div className="stat-title">Total de Items</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">Ejemplo de estadística</div>
          </div>

          <div className="stat">
            <div className="stat-title">Nuevos</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">Este mes</div>
          </div>

          <div className="stat">
            <div className="stat-title">Activos</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">En total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
