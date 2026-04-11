import React, { useMemo } from "react";
import { Search, FileText, Loader2 } from "lucide-react";

import { Card, CardContent } from "@components/ui/card";

import { DataTable } from "@components/common/DataTable";
import { PageHeader } from "@components/layout/PageHeader";
import { PaginationControls } from "@components/common/PaginationControls";

import { SearchFilterCard } from "./SearchFilterCard";
import { useBuscarPacientes } from "../../hooks/useBuscarPaciente";

import { useTableFactory } from "../../../../shared/hooks/useTableFactory";
import { pacienteActions } from "@/features/expedientes/config/actions/pacienteActions";
import { getPacienteBaseColumns } from "@/features/expedientes/config/columns/pacienteBaseColumns";

export function BuscarPaciente({ onVolver, controller = {} }) {
    
    const {
        termino, setTermino,
        criterio, setCriterio,
        pagina, paginacion,
        buscando, resultados,
        busquedaRealizada, ejecutarBusqueda
    } = useBuscarPacientes();

    const actions = useMemo(() => pacienteActions({
        ... controller,
        modo: controller.modo
    }), [ controller ]);

    const columns = useTableFactory({
        columns: getPacienteBaseColumns(),
        actions
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
            <PageHeader
                title="Buscar Paciente"
                subtitle="Consultar expedientes clínicos"
                Icon={Search}
                onVolver={onVolver}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SearchFilterCard
                    criterio={criterio}
                    setCriterio={setCriterio}
                    termino={termino}
                    setTermino={setTermino}
                    onSearch={() => ejecutarBusqueda(1)}
                    isLoading={buscando}
                />

                {/* Loader durante búsqueda */}
                {buscando && (
                    <div className="mt-8">
                        <Card className="border-blue-200 shadow-lg">
                            <CardContent className="py-16">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-gray-900">Procesando consulta</p>
                                        <p className="text-sm text-gray-600">Buscando en la base de datos de expedientes...</p>
                                    </div>
                                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Resultados */}
                {!buscando && busquedaRealizada && (
                    <div className="mt-8 space-y-4 animate-in fade-in duration-500">
                        {/* Contador y Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <p className="text-gray-700">
                                    Se encontraron <span className="font-semibold text-blue-900">{paginacion.total}</span> {paginacion.total === 1 ? 'paciente' : 'pacientes'}
                                </p>
                            </div>
                            
                            {paginacion.total > 0 && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Página <span className="font-medium text-gray-900">{pagina}</span> de <span className="font-medium text-gray-900">{paginacion.totalPaginas}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tabla */}
                        <Card className="shadow-lg border-gray-200 overflow-hidden">
                            <DataTable 
                                columns={columns}
                                data={resultados}
                                emptyMessage="No se encontraron pacientes con estos criterios."
                                rowKey="dni"
                                sortable
                            />
                        </Card>

                        {/* Paginación */}
                        {paginacion.totalPaginas > 1 && (
                            <div className="mt-6 flex justify-end">
                                <PaginationControls
                                    currentPage={pagina}
                                    totalPages={paginacion.totalPaginas}
                                    onPageChange={(nuevaPagina) => ejecutarBusqueda(nuevaPagina, criterio)}
                                    isLoading={buscando}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}