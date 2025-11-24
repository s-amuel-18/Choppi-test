interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  resultsCount?: number;
  resultsLabel?: string;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar...',
  disabled = false,
  loading = false,
  resultsCount,
  resultsLabel,
}: SearchInputProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="size-4 opacity-70"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              className="grow"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
            {value && (
              <button
                type="button"
                onClick={onClear}
                className="btn btn-ghost btn-sm btn-circle"
                title="Limpiar búsqueda"
                disabled={disabled}
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
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            )}
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
          </label>
        </div>
      </div>
      {value && resultsCount !== undefined && (
        <div className="mt-2 text-sm text-base-content/70">
          {loading ? (
            <span>Buscando...</span>
          ) : (
            <span>
              {resultsCount === 0
                ? 'No se encontraron resultados'
                : resultsLabel ||
                  `Se encontraron ${resultsCount} resultado${
                    resultsCount !== 1 ? 's' : ''
                  }`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

