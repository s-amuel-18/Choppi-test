import { ReactNode } from 'react';

interface InfoField {
  label: string;
  value: ReactNode;
  span?: 1 | 2;
}

interface InfoCardProps {
  title: string;
  fields: InfoField[];
}

export default function InfoCard({ title, fields }: InfoCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className={field.span === 2 ? 'md:col-span-2' : ''}
            >
              <label className="text-sm font-semibold text-base-content/70">
                {field.label}
              </label>
              <div className="text-base-content">{field.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

