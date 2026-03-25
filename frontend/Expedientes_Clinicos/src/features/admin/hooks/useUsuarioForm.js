import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { rolAPI } from '@/services/api';

export function useUsuarioForm(id) {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datosIniciales, setDatosIniciales] = useState(null);
    const [modal, setModal] = useState({ 
        open: false, 
        result: { success: false, title: "", message: "" } 
    });

    useEffect(() => {
        const cargarDataNecesaria = async () => {
            setLoading(true);
            try {
                const [resRoles, resUsuario] = await Promise.all([
                    rolAPI.obtenerTodos(),
                    id ? usuarioService.getById(id) : Promise.resolve(null)
                ]);

                setRoles(resRoles.data);
                if (resUsuario) setDatosIniciales(resUsuario);
                
            } catch {
                console.error("Error cargando dependencias del formulario");
            } finally {
                setLoading(false);
            }
        };
        cargarDataNecesaria();
    }, [id]);

    const enviarFormulario = async (data) => {
        setLoading(true);
        try {
            if (!id) data.clave = "temp12345"; 

            if (id) {
                await usuarioService.update(id, data);
            } else {
                await usuarioService.create(data);
            }

            setModal({
                open: true,
                result: {
                    success: true,
                    title: id ? "¡Actualización Exitosa!" : "¡Registro Exitoso!",
                    message: id 
                        ? "Los datos han sido actualizados."
                        : "Usuario creado. Se enviaron credenciales al correo."
                }
            });
        } catch (error) {
            setModal({
                open: true,
                result: {
                    success: false,
                    title: "Error",
                    message: error.message || "Error al procesar solicitud"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return { 
        roles, 
        loading, 
        modal, 
        setModal, 
        enviarFormulario,
        datosIniciales
    };
}