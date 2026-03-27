import { useState, useEffect, useMemo } from "react";
import { obtenerLogsAuditoria } from "../services/auditoriaService";

export function useAuditoria() {
    const [data, setData] = useState({ eventos: [], metadatos: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [busqueda, setBusqueda] = useState("");
    const [filtroUsuario, setFiltroUsuario] = useState("todos");
    const [filtroModulo, setFiltroModulo] = useState("todos");
    const [filtroFecha, setFiltroFecha] = useState("");

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const response = await obtenerLogsAuditoria();
            setData(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarDatos() }, []);

    const eventosFiltrados = useMemo(() => {
        return (data.eventos || []).filter((evento) => {
            const matchBusqueda = busqueda === "" || 
                Object.values(evento).some(val => 
                    String(val).toLowerCase().includes(busqueda.toLowerCase())
                );

            const matchUsuario = filtroUsuario === "todos" || evento.usuario === filtroUsuario;
            const matchModulo = filtroModulo === "todos" || evento.modulo === filtroModulo;

            let matchFecha = true;
            if (filtroFecha) {
                const fechaISO = new Date(evento.timestamp).toISOString().split('T')[0];
                matchFecha = fechaISO === filtroFecha;
            }

            return matchBusqueda && matchUsuario && matchModulo && matchFecha;
        });
    }, [data.eventos, busqueda, filtroUsuario, filtroModulo, filtroFecha]);

    return {
        eventos: eventosFiltrados,
        loading, error,
        busqueda, setBusqueda,
        filtroUsuario, setFiltroUsuario,
        filtroModulo, setFiltroModulo,
        filtroFecha, setFiltroFecha,
        totalEventos: data.metadatos?.total || 0,
        eventosHoy: data.metadatos?.hoy || 0,
        usuariosUnicos: data.metadatos?.usuariosUnicos || [],
        modulosUnicos: data.metadatos?.modulosUnicos || [],
        refrescar: cargarDatos
    };
}