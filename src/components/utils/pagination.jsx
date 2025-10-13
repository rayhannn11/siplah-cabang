// components/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    return Array.from({ length: totalPages }).map((_, i) => {
      const page = i + 1;
      const isActive = page === currentPage;

      const isFirst = page <= 3;
      const isNear = page >= currentPage - 1 && page <= currentPage + 1;
      const isLast = page >= totalPages - 2;

      if (isFirst || isNear || isLast) {
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`join-item btn btn-sm ${isActive ? "btn-primary" : ""}`}
          >
            {page}
          </button>
        );
      }

      if (
        (page === 4 && currentPage > 5) ||
        (page === totalPages - 3 && currentPage < totalPages - 4)
      ) {
        return (
          <button
            key={`dots-${page}`}
            className="join-item btn btn-sm btn-disabled"
          >
            ...
          </button>
        );
      }

      return null;
    });
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {renderPageButtons()}

        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
