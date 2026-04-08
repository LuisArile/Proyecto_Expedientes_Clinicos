import { Shield, Save, Plus, Check, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { PageHeader } from "@components/layout/PageHeader";

import React, { useState } from "react"; 
import { useGestionRoles } from "../features/admin/hooks/useGestionRoles";
import { EditableItem } from "../features/admin/components/EditableItem";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

export function GestionRoles() {
  
  const { go } = useSafeNavigation();
  
  const onVolver = () => go("inicio");

  const {
    roles, permisos, loading, rolSeleccionado, permisosSeleccionados, 
    handleCrearRol, handleSeleccionarRol, handleActualizarRol, handleEliminarRol, 
    togglePermiso, guardarCambiosPermisos, handleCrearPermiso, handleEliminarPermiso, handleActualizarPermiso,
  } = useGestionRoles();

  const [nuevoRol, setNuevoRol] = useState("");
  const [nuevoPermiso, setNuevoPermiso] = useState("");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <p className="text-blue-600 font-bold animate-pulse text-lg">Cargando módulos de seguridad...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader title="Gestión de Roles y Permisos" subtitle="Administra los roles del sistema y sus permisos asociados" Icon={Shield} onVolver={onVolver}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ROLES Y CATÁLOGO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SECCIÓN DE ROLES */}
          <Card className="shadow-sm border-none bg-white/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Shield className="size-5 text-red-600" /> Roles del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={nuevoRol} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  onChange={(e) => setNuevoRol(e.target.value)}
                  placeholder="Ej: FARMACÉUTICO" onKeyDown={(e) => e.key === "Enter" && (handleCrearRol(nuevoRol), setNuevoRol(""))}
                />
                <Button onClick={() => { handleCrearRol(nuevoRol); setNuevoRol(""); }} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 w-full sm:w-auto">
                  <Plus className="size-4 mr-1" /> Crear
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {roles.map(rol => (
                  <EditableItem key={rol.idRol} id={rol.idRol} nombre={rol.nombre} isSelected={rolSeleccionado?.idRol === rol.idRol}
                    onUpdate={handleActualizarRol} onDelete={handleEliminarRol} onSelect={() => handleSeleccionarRol(rol)} icon={Lock} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CATÁLOGO DE PERMISOS */}
          <Card className="shadow-sm border-none bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-purple-50/50 border-b border-purple-100">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-lg">
                <Lock className="h-5 w-5 text-purple-600" />
                Catálogo Global de Permisos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 flex-1">
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Añadir Nuevo Permiso</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={nuevoPermiso}
                    onChange={(e) => setNuevoPermiso(e.target.value)}
                    placeholder="Ej: EDITAR_PACIENTES"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                    onKeyDown={(e) => e.key === "Enter" && (handleCrearPermiso(nuevoPermiso), setNuevoPermiso(""))}
                  />
                  <Button onClick={() => { handleCrearPermiso(nuevoPermiso); setNuevoPermiso(""); }} className="bg-purple-600 hover:bg-purple-700 rounded-xl w-full sm:w-auto">
                    <Plus className="size-4 mr-1" /> Agregar
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Permisos Definidos</p>
                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {permisos.map(p => (
                    <EditableItem key={p.idPermiso} id={p.idPermiso} nombre={p.nombre} isTag={true}
                      onUpdate={handleActualizarPermiso} onDelete={handleEliminarPermiso} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asignación de Permisos por Rol */}
        <Card className="shadow-sm border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Check className="h-5 w-5 text-green-600" /> Permisos
            </CardTitle>
            {rolSeleccionado && (
              <Button onClick={guardarCambiosPermisos} className="bg-green-600 hover:bg-green-700 gap-2 rounded-xl px-6 w-full sm:w-auto">
                <Save className="size-4" /> Guardar Cambios en {rolSeleccionado.nombre}
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {!rolSeleccionado ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                <Shield className="h-10 w-10 mb-2 opacity-10" />
                <p className="text-sm italic">Selecciona un rol de la lista superior para configurar sus accesos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {permisos.map((p) => {
                  const isSelected = permisosSeleccionados.includes(p.idPermiso);
                  return (
                    <div key={p.idPermiso} onClick={() => togglePermiso(p.idPermiso)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" : "border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200"
                      }`}>
                      <span className="text-[11px] font-bold uppercase truncate mr-2">{p.nombre}</span>
                      <div className={`h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-200"}`}>
                        {isSelected && <Check className="h-3 w-3 text-white stroke-[3px]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}