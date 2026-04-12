import { useState, useCallback, useRef } from "react";
import { buscarPacientes } from "../services/buscarPacienteService";
import { toast } from "sonner";

export function useBuscarPacientes() {
    const [termino, setTermino] = useState("");
    const [criterio, setCriterio] = useState("nombre");
    const [pagina, setPagina] = useState(1);
    const [paginacion, setPaginacion] = useState({ totalPaginas: 1, total: 0 });
    const [buscando, setBuscando] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const abortControllerRef = useRef(null);

    const ejecutarBusqueda = useCallback(async (numPagina = 1) => {
        const terminoLimpio = termino.trim();
        if (!terminoLimpio.trim()) {
            toast.error("Por favor, ingrese un nombre o DNI");
            return;
        }

        if (terminoLimpio.length < 2) {
            toast.error("El término es muy corto (mínimo 2 caracteres)");
            return;
        }

        // Cancelar búsqueda anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController();

        setBuscando(true);

        try {
            const response = await buscarPacientes(terminoLimpio, criterio, numPagina, abortControllerRef.current.signal);

            setResultados(response.resultados);
            setPaginacion(response.paginacion);
            setPagina(numPagina);
            setBusquedaRealizada(true);            
            
            if (response.resultados.length === 0) {
                toast.info("No se encontraron coincidencias");
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }
            setResultados([]);
            toast.error(error.message || "Error al conectar con el servidor");
        } finally {
            setBuscando(false);
        }
    }, [termino, criterio]);

    return {
        termino, setTermino,
        criterio, setCriterio,
        pagina, paginacion,
        buscando, resultados,
        busquedaRealizada, ejecutarBusqueda
    };
}