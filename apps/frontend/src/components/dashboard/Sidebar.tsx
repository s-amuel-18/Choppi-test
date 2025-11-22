'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Perfil', href: '/dashboard/profile' },
  { label: 'Configuración', href: '/dashboard/settings' },
];

export default function Sidebar({ items = defaultItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-base-200">
      <ul className="menu p-4 w-full">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive ? 'active' : ''}
              >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

