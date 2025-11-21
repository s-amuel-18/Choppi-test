import { InputHTMLAttributes, forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, name, error, helperText, className = '', containerClassName = '', ...props }, ref) => {
    const inputId = id || name;
    const hasError = !!error;
    const containerClasses = `form-control mb-4 ${containerClassName}`.trim();

    return (
      <div className={containerClasses}>
        <label className="label mb-2" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`input input-bordered w-full ${hasError ? 'input-error' : ''} ${className}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <label className="label" htmlFor={inputId}>
            <span className="label-text-alt text-error" id={`${inputId}-error`}>
              {error}
            </span>
          </label>
        )}
        {helperText && !error && (
          <label className="label" htmlFor={inputId}>
            <span className="label-text-alt" id={`${inputId}-helper`}>
              {helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;

