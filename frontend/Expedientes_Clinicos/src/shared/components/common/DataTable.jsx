import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { cn } from "@components/ui/utils";

export function DataTable({ columns, data, emptyMessage = "No se encontraron resultados." }) {
  return (
    <div className="relative w-full">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-sm">
          <TableRow className="hover:bg-slate-50 border-b">
            {columns.map((column, index) => (
              <TableHead 
                key={index} 
                className={cn(
                  "h-12 px-4 text-left align-middle font-bold text-slate-600 uppercase text-[11px] tracking-wider",
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                className={"hover:bg-blue-50/50 transition-colors border-b border-slate-100"}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={cn("p-4", column.cellClassName)}>
                    {column.render ? column.render(row) : row[column.accessorKey]}
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