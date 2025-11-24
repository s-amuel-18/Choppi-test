'use client';

import { useRouter } from 'next/navigation';

interface NotFoundMessageProps {
  title: string;
  message: string;
  backUrl: string;
  backLabel: string;
}

export default function NotFoundMessage({
  title,
  message,
  backUrl,
  backLabel,
}: NotFoundMessageProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-base-content/60 mb-6">{message}</p>
            <button
              onClick={() => router.push(backUrl)}
              className="btn btn-primary"
            >
              {backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

