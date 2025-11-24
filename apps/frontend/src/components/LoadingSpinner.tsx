interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  size = 'lg',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}

