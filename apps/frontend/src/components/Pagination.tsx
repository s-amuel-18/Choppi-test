interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showItemsPerPage?: boolean;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false,
  showItemsPerPage = false,
  onItemsPerPageChange,
}: PaginationProps) {
  if (totalPages <= 1 && !showItemsPerPage) return null;

  
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; 

    if (totalPages <= maxVisible) {
      
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      pages.push(1);

      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      
      if (start > 2) {
        pages.push('...');
      }

      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      
      if (end < totalPages - 1) {
        pages.push('...');
      }

      
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      {}
      <div className="text-sm text-base-content/60">
        {totalItems > 0 ? (
          <>
            Mostrando <span className="font-semibold">{startItem}</span> a{' '}
            <span className="font-semibold">{endItem}</span> de{' '}
            <span className="font-semibold">{totalItems}</span> resultados
          </>
        ) : (
          'No hay resultados'
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-base-content/60">Mostrar:</label>
            <select
              className="select select-bordered select-sm"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}

        {}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              title="Primera página"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M18 6L12 12l6 6M6 6l6 6-6 6" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 -ml-2"
              >
                <path d="M18 6L12 12l6 6M6 6l6 6-6 6" />
              </svg>
            </button>

            {}
            <button
              className="btn btn-sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Anterior
            </button>

            {}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2">
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm min-w-10 ${
                      currentPage === pageNum
                        ? 'btn-active btn-primary'
                        : 'btn-ghost'
                    }`}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {}
            <button
              className="btn btn-sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Siguiente
            </button>

            {}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
              title="Última página"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M6 18L12 12l-6-6M18 18l-6-6 6-6" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 -ml-2"
              >
                <path d="M6 18L12 12l-6-6M18 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
