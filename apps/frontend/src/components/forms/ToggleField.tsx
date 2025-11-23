import { InputHTMLAttributes, forwardRef } from 'react';

interface ToggleFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

const ToggleField = forwardRef<HTMLInputElement, ToggleFieldProps>(
  ({ label, id, name, description, error, className = '', containerClassName = '', ...props }, ref) => {
    const toggleId = id || name;
    const hasError = !!error;
    const containerClasses = `form-control mb-4 ${containerClassName}`.trim();

    return (
      <div className={containerClasses}>
        <label className="label cursor-pointer">
          <div className="label-text">
            <span className="font-medium">{label}</span>
            {description && (
              <span className="text-sm text-base-content/60 block mt-1">
                {description}
              </span>
            )}
          </div>
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            name={name}
            className={`toggle toggle-primary ${hasError ? 'toggle-error' : ''} ${className}`}
            aria-invalid={hasError}
            aria-describedby={error ? `${toggleId}-error` : undefined}
            {...props}
          />
        </label>
        {error && (
          <label className="label" htmlFor={toggleId}>
            <span className="label-text-alt text-error" id={`${toggleId}-error`}>
              {error}
            </span>
          </label>
        )}
      </div>
    );
  }
);

ToggleField.displayName = 'ToggleField';

export default ToggleField;

