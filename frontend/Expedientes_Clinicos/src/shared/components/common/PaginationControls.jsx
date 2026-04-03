import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationControls({ currentPage, totalPages, onPageChange, isLoading
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
      <p className="text-sm text-gray-500">
        Página <span className="font-medium text-blue-600">{currentPage}</span> de{" "}
        <span className="font-medium">{totalPages || 1}</span>
      </p>
      <div className="flex gap-2">
        <button
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          disabled={currentPage === 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4 mr-1" /> Anterior
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          disabled={currentPage === totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente <ChevronRight className="size-4 ml-1" />
        </button>
      </div>
    </div>
  );
}