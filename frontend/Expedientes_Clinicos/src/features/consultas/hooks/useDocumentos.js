import { useState, useEffect } from "react";
import { 
    subirDocumento, 
    obtenerDocumentosPorConsulta,
    eliminarDocumento 
} from "../services/documentoService";
import { toast } from "sonner";

export const useDocumentos = (consultaId) => {
    const [documentos, setDocumentos] = useState([]);
    const [documentosPendientes, setDocumentosPendientes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [subiendo, setSubiendo] = useState(false);
    const [subiendoCount, setSubiendoCount] = useState(0);
    const [error, setError] = useState(null);

    // Cargar documentos de la consulta
    useEffect(() => {
        if (!consultaId) {
            setDocumentos([]);
            return;
        }

        const cargarDocumentos = async () => {
            setCargando(true);
            setError(null);
            try {
                const docs = await obtenerDocumentosPorConsulta(consultaId);
                setDocumentos(docs || []);
            } catch (err) {
                console.error("Error cargando documentos:", err);
                setError(err.message);
                toast.error("No se pudieron cargar los documentos");
            } finally {
                setCargando(false);
            }
        };

        cargarDocumentos();
    }, [consultaId]);

    // Agregar documento a la lista de pendientes (sin subir)
    const agregarDocumento = (archivo) => {
        if (!archivo) {
            throw new Error("Se debe seleccionar un archivo");
        }

        // Validar tamaño (máximo 50MB)
        if (archivo.size > 50 * 1024 * 1024) {
            const msg = "El archivo es demasiado grande. Máximo 50MB.";
            setError(msg);
            throw new Error(msg);
        }

        // Agregar con ID temporal
        const docPendiente = {
            id: `temp_${Date.now()}`,
            archivo,
            nombre: archivo.name,
            tamaño: archivo.size,
            estado: "pendiente"
        };

        setDocumentosPendientes(prev => [...prev, docPendiente]);
        setError(null);
    };

    // Remover documento pendiente
    const removerDocumentoPendiente = (tempId) => {
        setDocumentosPendientes(prev => prev.filter(doc => doc.id !== tempId));
    };

    // Subir un documento
    const subirDoc = async (archivo) => {
        if (!consultaId) {
            const msg = "No se puede subir documentos sin una consulta";
            setError(msg);
            throw new Error(msg);
        }

        setSubiendo(true);
        setError(null);
        try {
            const resultado = await subirDocumento(consultaId, archivo);
            
            // Agregar el nuevo documento a la lista
            if (resultado.success && resultado.documento) {
                setDocumentos(prev => [...prev, resultado.documento]);
                toast.success("Documento subido exitosamente");
                return resultado.documento;
            }
        } catch (err) {
            console.error("Error subiendo documento:", err);
            const errorMsg = err.message || "Error al subir el documento";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setSubiendo(false);
        }
    };

    // Subir todos los documentos pendientes (después de guardar consulta)
    const subirDocumentosPendientes = async (newConsultaId) => {
        if (!newConsultaId) {
            const msg = "No hay ID de consulta para subir documentos";
            setError(msg);
            toast.error(msg);
            return [];
        }

        if (documentosPendientes.length === 0) {
            return [];
        }
        
        setSubiendo(true);
        setSubiendoCount(0);
        setError(null);
        const documentosSubidos = [];

        try {
            for (const docPendiente of documentosPendientes) {
                try {
                    const resultado = await subirDocumento(newConsultaId, docPendiente.archivo);
                    
                    if (resultado.success && resultado.documento) {
                        documentosSubidos.push(resultado.documento);
                        setDocumentos(prev => [...prev, resultado.documento]);
                        toast.success(`✓ ${docPendiente.nombre} subido`);
                    } else {
                        toast.error(`No se subió correctamente: ${docPendiente.nombre}`);
                    }
                } catch (err) {
                    console.error(`Error subiendo ${docPendiente.nombre}:`, err);
                    toast.error(`Error: ${docPendiente.nombre}`);
                }
                
                setSubiendoCount(prev => prev + 1);
            }

            if (documentosSubidos.length > 0) {
                toast.success(`${documentosSubidos.length} documento(s) subido(s)`);
                // Limpiar pendientes solo si se subieron exitosamente
                setDocumentosPendientes([]);
            } else if (documentosPendientes.length > 0) {
                // Hubo error en todos
                const errorMsg = "No se pudieron subir los documentos. Intenta nuevamente.";
                setError(errorMsg);
                toast.error(errorMsg);
            }

            return documentosSubidos;

        } catch (err) {
            console.error("Error en proceso de carga:", err);
            const errorMsg = err.message || "Error al subir los documentos";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setSubiendo(false);
            setSubiendoCount(0);
        }
    };

    // Eliminar un documento
    const eliminarDoc = async (documentoId) => {
        setError(null);
        try {
            await eliminarDocumento(documentoId);
            
            // Remover el documento de la lista
            setDocumentos(prev => prev.filter(doc => doc.id !== documentoId));
            toast.success("Documento eliminado exitosamente");
        } catch (err) {
            console.error("Error eliminando documento:", err);
            const errorMsg = err.message || "Error al eliminar el documento";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        }
    };

    return {
        documentos,
        documentosPendientes,
        cargando,
        subiendo,
        subiendoCount,
        error,
        agregarDocumento,
        removerDocumentoPendiente,
        subirDoc,
        subirDocumentosPendientes,
        eliminarDoc,
        setDocumentos
    };
};
