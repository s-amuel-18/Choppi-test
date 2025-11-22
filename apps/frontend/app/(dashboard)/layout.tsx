import { redirect } from 'next/navigation';
import { auth } from '@/src/auth/auth';
import Sidebar from '@/src/components/dashboard/Sidebar';
import DashboardNavbar from '@/src/components/dashboard/DashboardNavbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-6 bg-base-300">{children}</main>
      </div>
    </div>
  );
}

