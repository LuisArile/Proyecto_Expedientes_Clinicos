import React, { useState, useMemo } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { cn } from "@components/ui/utils";

export function DataTable({ columns = [], data = [], rowKey = "id", emptyMessage = "No se encontraron resultados.", sortable = false }) {

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;

    return [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

  }, [data, sortConfig]);

  const handleSort = (column) => {
    if (!sortable || !column.sortable || !column.accessorKey) return;

    setSortConfig(prev => {
      if (prev?.key === column.accessorKey) {
        return {
          key: column.accessorKey,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return { key: column.accessorKey, direction: "asc" };
    });
  };

  return (
    <div className="relative w-full">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-sm">
          <TableRow className="hover:bg-slate-50 border-b">
            {columns.map((column, index) => (
              <TableHead 
                key={column.id ?? `column-${index}`}
                onClick={() => handleSort(column)} 
                className={cn(
                  "h-12 px-4 text-left align-middle font-bold text-slate-600 uppercase text-[11px] tracking-wider",
                  column.sortable && "cursor-pointer hover:text-blue-600",
                  column.className
                )}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {(() => {
                    const isSorted = sortConfig?.key === column.accessorKey;
                    return isSorted && (
                      <span className="text-blue-600">
                        {sortConfig?.direction === "asc" ? "↑" : "↓"}
                      </span>
                    );
                  })()}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => {
              const key = row[rowKey] ?? `row-${rowIndex}`;
              return (
                <TableRow 
                  key={key}
                  className={"hover:bg-blue-50/50 transition-colors border-b border-slate-100"}
                >
                  {columns.map((column, index) => (
                    <TableCell key={column.id ?? `cell-${index}`} className={cn("p-4", column.cellClassName)}>
                      {column.render ? column.render(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
            );
          })
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-32 text-center py-10 text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}