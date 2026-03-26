/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { usuarioService } from '../services/usuarioService';
import { toast } from 'sonner';

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const cargarUsuarios = async () => {
        try {
        setLoading(true);
        const data = await usuarioService.getAll();
        setUsuarios(data);
        } catch (error) {
        toast.error("No se pudieron cargar los usuarios");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { cargarUsuarios(); }, []);

    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(u => 
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [usuarios, busqueda]);

    const stats = useMemo(() => ({
        total: usuarios.length,
        activos: usuarios.filter(u => u.activo).length,
        inactivos: usuarios.filter(u => !u.activo).length,
    }), [usuarios]);

    const handleToggleStatus = async (id) => {
        try {
        await usuarioService.toggleStatus(id);
        toast.success("Estado actualizado");
        cargarUsuarios();
        } catch (err) {
        toast.error("Error al cambiar estado");
        }
    };

    const handleSendCredentials = async (id) => {
        try {
        await usuarioService.sendCredentials(id);
        toast.success("Correo de credenciales enviado");
        } catch (err) {
        toast.error("Error al enviar correo");
        }
    };

    return { 
        usuarios: usuariosFiltrados, 
        loading,
        busqueda, setBusqueda, 
        handleToggleStatus, 
        handleSendCredentials,
        stats 
    };
};