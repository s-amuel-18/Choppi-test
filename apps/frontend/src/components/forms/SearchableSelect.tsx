'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  maxResults?: number;
  label?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Buscar y seleccionar...',
  disabled = false,
  error,
  maxResults = 20,
  label,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options.slice(0, maxResults);
    }

    const term = searchTerm.toLowerCase();
    return options
      .filter((option) => option.label.toLowerCase().includes(term))
      .slice(0, maxResults);
  }, [options, searchTerm, maxResults]);

  // Obtener la etiqueta del valor seleccionado
  const selectedLabel = useMemo(() => {
    if (!value) return '';
    return options.find((opt) => opt.value === value)?.label || '';
  }, [value, options]);

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className="form-control w-full" ref={selectRef}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="relative">
        <div
          className={`select select-bordered w-full cursor-pointer ${
            error ? 'select-error' : ''
          } ${disabled ? 'select-disabled' : ''}`}
          onClick={handleToggle}
        >
          <div className="flex items-center justify-between">
            <span className={value ? '' : 'text-base-content/50'}>
              {selectedLabel || placeholder}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-4 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {}
            <div className="p-2 border-b border-base-300">
              <input
                ref={inputRef}
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                    setSearchTerm('');
                  }
                }}
              />
            </div>

            {/* Lista de opciones */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                <ul className="menu menu-compact p-2">
                  {filteredOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`w-full text-left ${
                          value === option.value ? 'active' : ''
                        }`}
                        onClick={() => handleSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-base-content/60">
                  No se encontraron resultados
                </div>
              )}
            </div>

            {}
            {filteredOptions.length === maxResults && (
              <div className="p-2 text-xs text-base-content/60 border-t border-base-300 text-center">
                Mostrando {maxResults} resultados. Refina tu búsqueda para más
                opciones.
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

