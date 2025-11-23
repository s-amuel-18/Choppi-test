import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, id, name, error, helperText, className = '', containerClassName = '', ...props }, ref) => {
    const textareaId = id || name;
    const hasError = !!error;
    const containerClasses = `form-control mb-4 ${containerClassName}`.trim();

    return (
      <div className={containerClasses}>
        <label className="label mb-2" htmlFor={textareaId}>
          <span className="label-text">{label}</span>
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          className={`textarea textarea-bordered w-full min-h-24 ${hasError ? 'textarea-error' : ''} ${className}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <label className="label" htmlFor={textareaId}>
            <span className="label-text-alt text-error" id={`${textareaId}-error`}>
              {error}
            </span>
          </label>
        )}
        {helperText && !error && (
          <label className="label" htmlFor={textareaId}>
            <span className="label-text-alt" id={`${textareaId}-helper`}>
              {helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';

export default TextareaField;

