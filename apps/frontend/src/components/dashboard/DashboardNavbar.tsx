'use client';

import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardNavbar() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost text-xl">
          Choppi App
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                {session?.user?.name || 'Usuario'}
                <span className="badge">Perfil</span>
              </a>
            </li>
            <li>
              <a>{session?.user?.email}</a>
            </li>
            <li>
              <button onClick={handleSignOut}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

