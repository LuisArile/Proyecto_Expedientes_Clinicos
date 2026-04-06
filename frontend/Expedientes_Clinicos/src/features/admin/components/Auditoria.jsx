import React, { useMemo, useState } from "react";
import { Shield, Clock, Search, Filter, User, Calendar, Activity, AlertCircle } from "lucide-react";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { StatCard } from "@components/common/StatCard"
import { ScrollArea } from "@components/ui/scroll-area";
import { FilterInput, FilterSelect } from "@components/common/FilterSearch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

import { useAuditoria } from "../hooks/useAuditoria";
import { DataTable } from "@components/common/DataTable";
import { PageHeader } from "@components/layout/PageHeader";
import { DialogoDetalleAuditoria } from "./DialogoDetalleAuditoria";

import { useTableFactory } from "@/shared/hooks/useTableFactory";
import { auditoriaActions } from "@/features/admin/components/actions/auditoriaActions";
import { getAuditoriaBaseColumns } from "@/features/admin/components/columns/auditoriaBaseColumns";

export function Auditoria({ onVolver }) {
  const {
    eventos, loading, busqueda, setBusqueda,
    filtroUsuario, setFiltroUsuario, 
    filtroModulo, setFiltroModulo,
    filtroFecha, setFiltroFecha,
    totalEventos, eventosHoy, 
    usuariosUnicos, modulosUnicos,
  } = useAuditoria();

  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);

  const actions = useMemo(() => auditoriaActions({
      onVerDetalles: (evento) => {
        setEventoSeleccionado(evento);
        setModalDetallesAbierto(true);
      }
    })
  , []);

  const columns = useTableFactory({
    columns: getAuditoriaBaseColumns(),
    actions
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-slate-500 font-medium animate-pulse">
      Cargando bitácora de auditoría...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader title="Auditoría del Sistema" subtitle="Historial completo de acciones realizadas en el sistema SGEC" Icon={Shield} onVolver={onVolver}/>
      
      <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
        {/* Grid de Estadísticas*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Eventos" value={totalEventos} icon={Activity} iconColor="text-blue-600"/>
          <StatCard title="Eventos de Hoy" value={eventosHoy} icon={Calendar} iconColor="text-green-600"/>
          <StatCard title="Usuarios Activos" value={usuariosUnicos.length} icon={User} iconColor="text-purple-600"/>
          <StatCard title="Filtrados" value={eventos.length} Icon={Filter} iconColor="text-orange-600"/>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600"/>
              </div>
              <div>
                <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                <CardDescription>Refine los resultados por texto, fecha o responsabilidad</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FilterInput label="Búsqueda General" icon={Search} value={busqueda} onChange={setBusqueda} placeholder="Buscar acción..." />
              
              <div className="space-y-2">
                <Label className="text-sm text-gray-700">Fecha</Label>
                <Input type="date" className="bg-slate-50" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
              </div>

              <FilterSelect label="Usuario" value={filtroUsuario} onValueChange={setFiltroUsuario} options={usuariosUnicos} />
              <FilterSelect label="Módulo" value={filtroModulo} onValueChange={setFiltroModulo} options={modulosUnicos} />

              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => { setBusqueda(""); setFiltroUsuario("todos"); setFiltroModulo("todos"); setFiltroFecha(""); }}>
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de eventos */}
        <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Clock className="h-5 w-5 text-blue-600" /> Historial de Eventos
            </CardTitle>
            <CardDescription>
              {busqueda || filtroUsuario !== "todos" || filtroModulo !== "todos" || filtroFecha 
                ? `Mostrando: ${eventos.length} de ${totalEventos}`
                : `Mostrando registros totales (${totalEventos})`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full px-6 pb-6">
              <DataTable 
                columns={columns} 
                data={eventos} 
                emptyMessage={
                  <div className="text-center py-20">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No se encontraron registros.</p>
                  </div>
                }
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Modal de Detalles */}
        <DialogoDetalleAuditoria 
            isOpen={modalDetallesAbierto}
            onClose={() => setModalDetallesAbierto(false)}
            evento={eventoSeleccionado}
        />
      </main>
    </div>
  );
}