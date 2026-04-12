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
        const payload = {
            nombre: data.nombre?.trim(),
            apellido: data.apellido?.trim(),
            correo: data.correo?.trim(),
            nombreUsuario: data.nombreUsuario?.trim(),
            idRol: Number(data.idRol),
            especialidad: Number(data.idRol) === 2 ? data.especialidad : null
        };

        if (isEdit) {
            payload.activo = String(data.activo) === "true";
        }

        return payload;
    };

    const enviarFormulario = async (data) => {
        setLoading(true);
        try {
            let payload = construirPayload(data);

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
        datosIniciales,
        setLoading
    };
}