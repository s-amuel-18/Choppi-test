interface FormCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormCard({
  title,
  children,
  className = '',
}: FormCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-base-200">
      <div
        className={`card w-full max-w-md shadow-2xl bg-base-100 ${className}`}
      >
        <div className="card-body">
          <h2 className="text-center text-3xl font-bold mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
