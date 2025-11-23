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

  const drawerId = 'my-drawer-4';

  return (
    <div className="drawer lg:drawer-open">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <DashboardNavbar drawerId={drawerId} title="Choppi App" />
        <div className="p-4">{children}</div>
      </div>
      <Sidebar drawerId={drawerId} />
    </div>
  );
}
