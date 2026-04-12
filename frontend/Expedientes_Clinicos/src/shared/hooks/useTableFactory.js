import { useMemo } from "react";
import { buildColumns } from "@/shared/components/common/table/TableFactory";

export function useTableFactory({ columns, actions }) {
    return useMemo(() => buildColumns({ columns, actions }), [columns, actions]);
}