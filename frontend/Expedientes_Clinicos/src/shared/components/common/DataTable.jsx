import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { cn } from "@components/ui/utils";

export function DataTable({ columns, data, emptyMessage = "No se encontraron resultados." }) {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">

      <Table className="min-w-[700px]">
        
        {/* HEADER */}
        <TableHeader className="sticky top-0 z-10 bg-slate-50">
          <TableRow className="border-b border-slate-200">

            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  "h-12 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider",
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}

          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(
                      "p-4",
                      column.cellClassName
                    )}
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
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