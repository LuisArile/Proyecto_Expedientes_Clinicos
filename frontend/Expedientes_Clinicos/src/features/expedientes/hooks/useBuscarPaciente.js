import { useState, useCallback } from "react";
import { buscarPacientes } from "../services/expedienteService";
import { toast } from "sonner";

export function useBuscarPacientes() {
    const [termino, setTermino] = useState("");
    const [criterio, setCriterio] = useState("nombre");
    const [pagina, setPagina] = useState(1);
    const [paginacion, setPaginacion] = useState({ totalPaginas: 1, total: 0 });
    const [buscando, setBuscando] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const ejecutarBusqueda = useCallback(async (numPagina = 1, criterioBusqueda = criterio) => {
        
        const terminoLimpio = termino.trim();
        if (!terminoLimpio.trim()) {
            toast.error("Por favor, ingrese un nombre o DNI");
            return;
        }

        if (terminoLimpio.length < 2) {
            toast.error("El término es muy corto (mínimo 2 caracteres)");
            return;
        }

        setBuscando(true);
        // setPagina(numPagina);
        // if (numPagina === 1) {
        //     setPaginacion({ totalPaginas: 1, total: 0 });
        // }

        try {

            const response = await buscarPacientes(terminoLimpio, criterioBusqueda, numPagina);

            setResultados(response.resultados || []);
            setPaginacion(response.paginacion || { totalPaginas: 1, total: 0 });
            // setPagina(response.paginacion?.paginaActual);
            setPagina(numPagina);
            setBusquedaRealizada(true);            
            
            if (!response.resultados || response.resultados.length === 0) {
                toast.info("No se encontraron coincidencias");
            }
        } catch (error) {
            setResultados([]);
            // setPaginacion({ totalPaginas: 1, total: 0 });
            // setPagina(1);
            toast.error(error.message || "Error al conectar con el servidor");
            setResultados([]);
        } finally {
            setBuscando(false);
        }
    }, [termino, criterio]);

    return {
        termino, setTermino,
        criterio, setCriterio,
        pagina,
        paginacion,
        buscando,
        resultados,
        busquedaRealizada,
        ejecutarBusqueda
    };
}