import { useState } from "react";
import { buscarPacientes } from "../services/expedienteService";
import { toast } from "sonner";

export function useBuscarPacientes() {
    const [termino, setTermino] = useState("");
    const [pagina, setPagina] = useState(1);
    const [paginacion, setPaginacion] = useState({ totalPaginas: 1, total: 0 });
    const [buscando, setBuscando] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const ejecutarBusqueda = async ( numPagina = 1 ) => {
        
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
        try {

            const response = await buscarPacientes(terminoLimpio, numPagina);

            setResultados(response.resultados);
            setPaginacion(response.paginacion);
            setPagina(numPagina);
            setBusquedaRealizada(true);            
            
            if (response.resultados.length === 0) {
                toast.info("No se encontraron coincidencias");
            }
        } catch (error) {
            toast.error(error.message || "Error al conectar con el servidor");
            setResultados([]);
        } finally {
            setBuscando(false);
        }
    };

    return {
        termino,
        setTermino,
        pagina,
        setPagina,
        paginacion,
        setPaginacion,
        buscando,
        setBuscando,
        resultados,
        setResultados,
        busquedaRealizada,
        ejecutarBusqueda
    };
}