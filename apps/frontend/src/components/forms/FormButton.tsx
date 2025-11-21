import { ButtonHTMLAttributes } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function FormButton({
  children,
  variant = 'primary',
  fullWidth = true,
  loading = false,
  className = '',
  disabled,
  ...props
}: FormButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };

  return (
    <div className="form-control mt-6">
      <button
        type="submit"
        className={`btn ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="loading loading-spinner loading-sm"></span>}
        {children}
      </button>
    </div>
  );
}

