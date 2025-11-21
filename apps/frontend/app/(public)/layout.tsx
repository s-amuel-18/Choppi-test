import Navbar from '@/src/components/Navbar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { label: 'Login', href: '/login' },
    { label: 'Registro', href: '/register' },
  ];

  return (
    <>
      <Navbar brandName="Choppi App" links={navLinks} />
      {children}
    </>
  );
}
