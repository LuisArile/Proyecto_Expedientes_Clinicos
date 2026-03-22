import React, { useState } from "react";
import { Shield, Clock, Search, Filter, FileText, User, Calendar, Activity, CheckCircle2, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { ROLE_STRATEGIES } from "@/constants/roles";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";

import { useAuditoria } from "../hooks/useAuditoria";

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

  const columns = [
    {
      header: "FECHA/HORA",
      render: (log) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{log.fecha}</span>
          <span className="text-xs text-slate-500">{log.hora}</span>
        </div>
      )
    },
    {
      header: "USUARIO",
      render: (log) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium text-slate-700">{log.usuario}</span>
        </div>
      )
    },
    {
      header: "ROL",
      render: (log) => {
        const roleStyle = ROLE_STRATEGIES[log.rol?.toUpperCase()] || { label: log.rol, color: "bg-gray-100" };
        return (
          <Badge variant="outline" className={`${roleStyle.color} font-semibold text-[10px] px-2 py-0`}>
            {roleStyle.label}
          </Badge>
        );
      }
    },
    {
      header: "MÓDULO",
      render: (log) => (
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
          {log.modulo}
        </span>
      )
    },
    {
      header: "ACCIÓN REALIZADA",
      accessorKey: "accion",
      cellClassName: "max-w-xs truncate text-slate-600 italic"
    },
    {
      header: "DETALLES",
      className: "text-center",
      render: (log) => (
        <Button 
          variant="ghost" size="icon" className="rounded-full hover:bg-blue-100 text-blue-600"
          onClick={() => { setEventoSeleccionado(log); setModalDetallesAbierto(true); }}
        >
          <FileText className="h-4 w-4" />
        </Button>
      )
    }
  ];

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
          <StatCard title="Total Eventos" value={totalEventos} Icon={Activity} iconColor="text-blue-600"/>
          <StatCard title="Eventos de Hoy" value={eventosHoy} Icon={Calendar} iconColor="text-green-600"/>
          <StatCard title="Usuarios Activos" value={usuariosUnicos.length} Icon={User} iconColor="text-purple-600"/>
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
        <Dialog open={modalDetallesAbierto} onOpenChange={setModalDetallesAbierto}>
          <DialogContent className="max-w-2xl gap-0 p-0 border-slate-200 shadow-xl overflow-hidden bg-white"> 
            <DialogHeader className="p-6 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <FileText className="h-5 w-5 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                    Detalle del Evento
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Referencia: <span className="font-mono text-slate-600">{eventoSeleccionado?.id}</span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <DetailBox label="Usuario" value={eventoSeleccionado?.usuario} icon={User} />
                <DetailBox label="Módulo" value={eventoSeleccionado?.modulo} icon={Activity}/>
              </div>

              {/* Vista de Datos, en caso de que se necesite más información y sea transferida a través de un JSON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Metadatos del Registro
                  </Label>
                  <span className="text-[10px] text-slate-300 font-mono italic">application/json</span>
                </div>
                
                <div className="relative">
                  <pre className="bg-slate-50 text-slate-700 p-5 rounded-xl text-xs font-mono max-h-[280px] overflow-auto border border-slate-200 shadow-inner custom-scrollbar leading-relaxed">
                    {/* {JSON.stringify(eventoSeleccionado?.detalles, null, 2)} */}
                    {eventoSeleccionado?.detalles}
                  </pre>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between sm:justify-between">
              <div className="text-[10px] text-slate-400 px-2"> Generado automáticamente por el sistema SGEC </div>
              <Button variant="ghost"onClick={() => setModalDetallesAbierto(false)}
                className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-semibold text-sm"
              >
                Cerrar ventana
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// Componentes Auxiliares
function StatCard({ title, value, Icon, iconColor, bgColor= "bg-white" }) {
  return (
    <Card className={`${bgColor} shadow-sm border-slate-200`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-slate-50 ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterInput({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-700">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder={placeholder} className="pl-10 bg-slate-50" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onValueChange, options }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-700">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function DetailBox({ label, value, icon: Icon }) {
  return (
    <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}