import { useState, useEffect } from "react";
import { rolAPI, permisoAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Trash2, Edit2, Check, X, Lock, Search } from "lucide-react";
import { toast } from "sonner";

import { PaginationControls } from "@/components/common/PaginationControls";
import { PageHeader } from "@/components/layout/PageHeader";

export function GestionRoles({ onVolver }) {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoRol, setNuevoRol] = useState("");
  const [nuevoPermiso, setNuevoPermiso] = useState("");
  const [editandoRol, setEditandoRol] = useState(null);
  const [editandoPermiso, setEditandoPermiso] = useState(null);
  const [nombreEditRol, setNombreEditRol] = useState("");
  const [nombreEditPermiso, setNombreEditPermiso] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [permisosDelRol, setPermisosDelRol] = useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [rolesRes, permisosRes] = await Promise.all([
        rolAPI.obtenerTodos(),
        permisoAPI.obtenerTodos(),
      ]);
      setRoles(rolesRes.data);
      setPermisos(permisosRes.data);
    } catch (error) {
      toast.error("Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- ROLES ---
  const crearRol = async () => {
    if (!nuevoRol.trim()) return;
    try {
      await rolAPI.crear({ nombre: nuevoRol });
      setNuevoRol("");
      toast.success("Rol creado exitosamente");
      cargarDatos();
    } catch (error) {
      toast.error("Error al crear rol: " + error.message);
    }
  };

  const actualizarRol = async (idRol) => {
    if (!nombreEditRol.trim()) return;
    try {
      await rolAPI.actualizar(idRol, { nombre: nombreEditRol });
      setEditandoRol(null);
      toast.success("Rol actualizado exitosamente");
      cargarDatos();
    } catch (error) {
      toast.error("Error al actualizar rol: " + error.message);
    }
  };

  const eliminarRol = async (idRol) => {
    if (!confirm("¿Estás seguro de eliminar este rol?")) return;
    try {
      await rolAPI.eliminar(idRol);
      toast.success("Rol eliminado exitosamente");
      if (rolSeleccionado?.idRol === idRol) {
        setRolSeleccionado(null);
        setPermisosDelRol([]);
      }
      cargarDatos();
    } catch (error) {
      toast.error("Error al eliminar rol: " + error.message);
    }
  };

  // --- PERMISOS ---
  const crearPermiso = async () => {
    if (!nuevoPermiso.trim()) return;
    try {
      await permisoAPI.crear({ nombre: nuevoPermiso });
      setNuevoPermiso("");
      toast.success("Permiso creado exitosamente");
      cargarDatos();
    } catch (error) {
      toast.error("Error al crear permiso: " + error.message);
    }
  };

  const actualizarPermiso = async (idPermiso) => {
    if (!nombreEditPermiso.trim()) return;
    try {
      await permisoAPI.actualizar(idPermiso, { nombre: nombreEditPermiso });
      setEditandoPermiso(null);
      toast.success("Permiso actualizado exitosamente");
      cargarDatos();
    } catch (error) {
      toast.error("Error al actualizar permiso: " + error.message);
    }
  };

  const eliminarPermiso = async (idPermiso) => {
    if (!confirm("¿Estás seguro de eliminar este permiso?")) return;
    try {
      await permisoAPI.eliminar(idPermiso);
      toast.success("Permiso eliminado exitosamente");
      cargarDatos();
    } catch (error) {
      toast.error("Error al eliminar permiso: " + error.message);
    }
  };

  // --- PERMISOS POR ROL ---
  const seleccionarRol = async (rol) => {
    setRolSeleccionado(rol);
    try {
      const res = await rolAPI.obtenerPermisos(rol.idRol);
      const permisosActuales = res.data;
      setPermisosDelRol(permisosActuales);
      setPermisosSeleccionados(permisosActuales.map((p) => p.idPermiso));
    } catch (error) {
      toast.error("Error al cargar permisos del rol: " + error.message);
    }
  };

  const togglePermiso = (idPermiso) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(idPermiso)
        ? prev.filter((id) => id !== idPermiso)
        : [...prev, idPermiso]
    );
  };

  const guardarPermisosRol = async () => {
    if (!rolSeleccionado) return;
    try {
      await rolAPI.asignarPermisos(rolSeleccionado.idRol, permisosSeleccionados);
      toast.success(`Permisos actualizados para ${rolSeleccionado.nombre}`);
      cargarDatos();
    } catch (error) {
      toast.error("Error al asignar permisos: " + error.message);
    }
  };

  if (loading) return <p className="p-6">Cargando roles y permisos...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">

      <PageHeader
          title="Gestión de Roles y Permisos"
          subtitle="Administra los roles del sistema y sus permisos asociados"
          Icon={Shield}
          onVolver={onVolver}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Crear Rol */}
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevoRol}
                onChange={(e) => setNuevoRol(e.target.value)}
                placeholder="Nombre del nuevo rol"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && crearRol()}
              />
              <Button onClick={crearRol} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista de Roles */}
            <div className="space-y-2">
              {roles.map((rol) => (
                <div
                  key={rol.idRol}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    rolSeleccionado?.idRol === rol.idRol
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => seleccionarRol(rol)}
                >
                  {editandoRol === rol.idRol ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={nombreEditRol}
                        onChange={(e) => setNombreEditRol(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.key === "Enter" && actualizarRol(rol.idRol)}
                      />
                      <button onClick={(e) => { e.stopPropagation(); actualizarRol(rol.idRol); }} className="text-green-600 hover:text-green-800">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setEditandoRol(null); }} className="text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">{rol.nombre}</span>
                        <span className="text-xs text-gray-400">
                          ({rol.permisos?.length || 0} permisos)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditandoRol(rol.idRol);
                            setNombreEditRol(rol.nombre);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); eliminarRol(rol.idRol); }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permisos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-600" />
              Permisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Crear Permiso */}
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevoPermiso}
                onChange={(e) => setNuevoPermiso(e.target.value)}
                placeholder="Nombre del nuevo permiso"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => e.key === "Enter" && crearPermiso()}
              />
              <Button onClick={crearPermiso} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista de Permisos */}
            <div className="space-y-2">
              {permisos.map((permiso) => (
                <div
                  key={permiso.idPermiso}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {editandoPermiso === permiso.idPermiso ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={nombreEditPermiso}
                        onChange={(e) => setNombreEditPermiso(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        onKeyDown={(e) => e.key === "Enter" && actualizarPermiso(permiso.idPermiso)}
                      />
                      <button onClick={() => actualizarPermiso(permiso.idPermiso)} className="text-green-600 hover:text-green-800">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditandoPermiso(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">{permiso.nombre}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditandoPermiso(permiso.idPermiso);
                            setNombreEditPermiso(permiso.nombre);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => eliminarPermiso(permiso.idPermiso)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asignación de Permisos por Rol */}
      {rolSeleccionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Permisos de: {rolSeleccionado.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Selecciona los permisos que deseas asignar a este rol
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {permisos.map((permiso) => {
                const isSelected = permisosSeleccionados.includes(permiso.idPermiso);
                return (
                  <div
                    key={permiso.idPermiso}
                    onClick={() => togglePermiso(permiso.idPermiso)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-800"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium">{permiso.nombre}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={guardarPermisosRol}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Guardar Permisos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}