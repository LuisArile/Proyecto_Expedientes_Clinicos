import { useState, useEffect, useCallback } from "react";
import { rolesService } from "../services/roleServices";
import { toast } from "sonner";

export function useGestionRoles() {
  const [data, setData] = useState({ roles: [], permisos: [] });
  const [loading, setLoading] = useState(true);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [editandoPermiso, setEditandoPermiso] = useState(null);
  const [nombreEditPermiso, setNombreEditPermiso] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
        setLoading(true);
        const res = await rolesService.fetchAllData();
        setData(res);
    } catch (error) {
        toast.error("Error de conexión: " + error.message);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const handleCrearRol = async (nombre) => {
    try {
      await rolesService.saveRol(nombre);
      toast.success("Rol creado");
      await cargarDatos();
    } catch (e) { toast.error(e.message); }
  };

  const handleSeleccionarRol = async (rol) => {
    setRolSeleccionado(rol);
    try {
      const permisos = await rolesService.getPermisosByRol(rol.idRol);
      setPermisosSeleccionados(permisos.map(p => p.idPermiso));
    } catch { toast.error("Error al cargar permisos"); }
  };

  const handleEliminarRol = async (idRol) => {
    if (!window.confirm("¿Confirma que desea eliminar este rol?")) return;
    try {
      await rolesService.deleteRol(idRol);
      toast.success("Rol eliminado");
      if (rolSeleccionado?.idRol === idRol) setRolSeleccionado(null);
      await cargarDatos();
    } catch (e) { toast.error(e.message); }
  }

  const handleActualizarRol = async (idRol, nombre) => {
    try {
      await rolesService.updateRol(idRol, nombre);
        toast.success("Rol actualizado");
        await cargarDatos();
    } catch (e) { toast.error(e.message); }
  };

  const togglePermiso = (id) => {
    setPermisosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const guardarCambiosPermisos = async () => {
    if (!rolSeleccionado) return;
    try {
      await rolesService.assignPermisos(rolSeleccionado.idRol, permisosSeleccionados);
      toast.success(`Permisos de ${rolSeleccionado.nombre} actualizados`);
      await cargarDatos();
    } catch (e) { toast.error(e.message); }
  };

  const handleCrearPermiso = async (nombre) => {
    if (!nombre.trim()) return toast.error("El nombre del permiso no puede estar vacío");
    try {
      await rolesService.savePermiso(nombre.trim());
      toast.success("Permiso creado");
      await cargarDatos();
    } catch (e) { toast.error(e.message); }
  };

  const handleEliminarPermiso = async (idPermiso) => {
    if (!window.confirm("¿Confirma que desea eliminar este permiso?")) return;
    try {
      await rolesService.deletePermiso(idPermiso);
      toast.success("Permiso eliminado");
      await cargarDatos();
    } catch (e) { toast.error(e.message); }
  };

  const handleActualizarPermiso = async (idPermiso, nuevoNombre) => {
    if (!nuevoNombre.trim()) return toast.error("El nombre no puede estar vacío");
    try {
      await rolesService.updatePermiso(idPermiso, nuevoNombre.trim());
      toast.success("Permiso actualizado");
      setEditandoPermiso(null);
      await cargarDatos();
    } catch (e) { toast.error(e.message); }
  };  

  return {
    ...data,
    loading,
    rolSeleccionado,
    permisosSeleccionados,
    editandoPermiso,
    nombreEditPermiso,
    handleCrearRol,
    handleSeleccionarRol,
    togglePermiso,
    guardarCambiosPermisos,
    refrescar: cargarDatos,
    handleEliminarRol,
    handleActualizarRol,
    handleCrearPermiso,
    handleEliminarPermiso,
    setEditandoPermiso,
    setNombreEditPermiso,
    handleActualizarPermiso
  };
}