import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { rolAPI } from '@/shared/services/api';

export function useUsuarioForm(id) {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datosIniciales, setDatosIniciales] = useState(null);
    const [modal, setModal] = useState({ 
        open: false, 
        result: { success: false, title: "", message: "" } 
    });

    const isEdit = Boolean(id);

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

    const construirPayload = (data) => {
        if (isEdit) {
            return {
                nombre: data.nombre,
                correo: data.correo,
                idRol: Number(data.idRol),
                activo: String(data.activo) === "true",
                especialidad: data.especialidad
            };
        }
        return data;
    };

    const enviarFormulario = async (data) => {
        setLoading(true);
        try {
            let payload = construirPayload(data);

            if (!id) payload.clave = "temp12345"

           if (isEdit) {
                await usuarioService.update(id, payload);
            } else {
                await usuarioService.create(payload);
            }

            setModal({
                open: true,
                result: {
                    success: true,
                    title: isEdit ? "Actualización Exitosa" : "Registro Exitoso",
                    message: isEdit 
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