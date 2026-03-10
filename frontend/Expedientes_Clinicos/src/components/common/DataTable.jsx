import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({ columns, data, emptyMessage = "No se encontraron resultados." }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {columns.map((column, index) => (
              <TableHead 
                key={index} 
                className={column.className}
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
                className={"hover:bg-blue-50 transition-colors"}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.cellClassName}>
                    
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