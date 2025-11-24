'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DetailPageHeaderProps {
  title: string;
  editUrl: string;
  editLabel: string;
}

export default function DetailPageHeader({
  title,
  editUrl,
  editLabel,
}: DetailPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-sm"
            title="Volver"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="size-4"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={editUrl} className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="size-5"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          {editLabel}
        </Link>
      </div>
    </div>
  );
}

