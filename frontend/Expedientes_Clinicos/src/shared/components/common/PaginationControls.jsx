import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export function PaginationControls({ currentPage, totalPages, onPageChange, isLoading }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <div className="flex items-center justify-end gap-6 px-2 py-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-3 animate-spin text-blue-600" />
            <span>Actualizando...</span>
          </div>
        ) : (
          <>
            <span>Página</span>
            <span className="font-semibold text-gray-900">{currentPage}</span>
            <span>de</span>
            <span className="font-semibold text-gray-900">{totalPages || 1}</span>
          </>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
          disabled={isFirstPage || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
          <span>Anterior</span>
        </button>

        <button
          className="flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
          disabled={isLastPage || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Siguiente</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}