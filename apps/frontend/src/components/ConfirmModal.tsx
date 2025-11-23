interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'error' | 'warning';
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantClasses = {
    primary: 'btn-primary',
    error: 'btn-error',
    warning: 'btn-warning',
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          {cancelText && (
            <button
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </button>
          )}
          <button
            className={`btn ${variantClasses[confirmVariant]}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={loading}>
          cerrar
        </button>
      </form>
    </dialog>
  );
}
