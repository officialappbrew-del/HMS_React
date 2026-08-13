import React from 'react';

const AdminPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#E8E3DC] sm:px-6">
      <div className="hidden sm:block">
        <p className="text-sm text-[#5A5A5A]">
          Showing <span className="font-medium text-[#1A1A1A]">{startIndex}</span> to{' '}
          <span className="font-medium text-[#1A1A1A]">{endIndex}</span> of{' '}
          <span className="font-medium text-[#1A1A1A]">{totalItems}</span> results
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium text-[#5A5A5A] bg-white border border-[#D8D4CD] rounded hover:bg-[#F7F5F2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 text-sm font-medium border rounded transition-colors ${
              page === currentPage
                ? 'bg-[#008751] text-white border-[#008751]'
                : 'bg-white text-[#5A5A5A] border-[#D8D4CD] hover:bg-[#F7F5F2]'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-medium text-[#5A5A5A] bg-white border border-[#D8D4CD] rounded hover:bg-[#F7F5F2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
