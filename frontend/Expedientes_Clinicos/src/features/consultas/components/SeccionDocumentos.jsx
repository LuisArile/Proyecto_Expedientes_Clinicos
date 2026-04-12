import { useState } from "react";
import { FileUp, Trash2, Eye, Download, AlertCircle, Loader2, CheckCircle2, Trash } from "lucide-react";

import { Button } from "@components/ui/button";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ConfirmModal } from "@components/common/ConfirmModal";
import { toast } from "sonner";
import { documentoAPI } from "@/shared/services/api";
import { formatearFechaHora } from "@/utils/dateFormatter";

export function SeccionDocumentos({
  documentosPendientes = [],
  documentos = [],
  subiendo = false,
  subiendoCount = 0,
  cargando = false,
  error = null,
  onAgregarDocumento,
  onRemoverDocumentoPendiente,
  onEliminarDocumento,
  disabled = false,
}) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

  const handleArchivoSeleccionado = (e) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      // Validar tamaño (máximo 50MB)
      if (archivo.size > 50 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 50MB.");
        setArchivoSeleccionado(null);
        return;
      }
      setArchivoSeleccionado(archivo);
    }
  };

  const handleAgregarArchivo = () => {
    if (!archivoSeleccionado) {
      toast.error("Selecciona un archivo");
      return;
    }

    try {
      onAgregarDocumento(archivoSeleccionado);
      setArchivoSeleccionado(null);
      // Reset input
      const fileInput = document.getElementById("file-input-documentos");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error agregando archivo:", err);
    }
  };

  const handleRemover = (tempId) => {
    onRemoverDocumentoPendiente(tempId);
  };

  const handleEliminar = (documentoId, nombreDocumento) => {
    setDocumentoAEliminar({ id: documentoId, nombre: nombreDocumento });
    setMostrarModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    if (!documentoAEliminar) return;

    setEliminando(documentoAEliminar.id);
    try {
      await onEliminarDocumento(documentoAEliminar.id);
      toast.success("Documento eliminado exitosamente");
      setMostrarModalEliminar(false);
      setDocumentoAEliminar(null);
    } catch (err) {
      console.error("Error eliminando documento:", err);
      toast.error("Error al eliminar el documento");
    } finally {
      setEliminando(null);
    }
  };

  const formatearTamano = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const tamaños = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + tamaños[i];
  };

  const descargarDocumento = async (documentoId, nombre) => {
    try {
      // Usar el endpoint backend que actúa como proxy
      const response = await documentoAPI.descargarDocumento(documentoId);
      const blob = await response.blob();
      
      // Crear URL temporal
      const urlBlob = window.URL.createObjectURL(blob);
      
      // Crear elemento <a> temporal
      const enlace = document.createElement("a");
      enlace.href = urlBlob;
      enlace.download = nombre || "documento";
      
      // Disparar descarga
      document.body.appendChild(enlace);
      enlace.click();
      
      // Limpiar
      document.body.removeChild(enlace);
      window.URL.revokeObjectURL(urlBlob);
      
      toast.success("Descarga iniciada");
    } catch (err) {
      console.error("Error descargando:", err);
      toast.error("Error al descargar el documento");
    }
  };

  const totalParaSubir = documentosPendientes.length;

  return (
    <>
    <FormSection title="Documentos Adjuntos">
      <div className="md:col-span-2 w-full space-y-4">
        {/* Error si existe */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Sección de selección - solo en modo edición */}
        {!disabled && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
          <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-3">
            <FileUp className="size-4" /> Adjuntar examenes atenriores u otros estudios relevantes
          </h3>

          <p className="text-xs text-gray-600 mb-3">
            Selecciona los documentos que deseas adjuntar. Se subirán cuando finalices la consulta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="file-input-documentos"
              type="file"
              onChange={handleArchivoSeleccionado}
              disabled={subiendo}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-3 file:px-3 file:py-1 file:border-0 file:rounded file:bg-purple-600 file:text-white file:cursor-pointer"
            />
            <Button
              type="button"
              onClick={handleAgregarArchivo}
              disabled={!archivoSeleccionado || subiendo}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {archivoSeleccionado && (
            <p className="text-xs text-gray-600 mt-2">
              Archivo seleccionado: {archivoSeleccionado.name} (
              {formatearTamano(archivoSeleccionado.size)})
            </p>
          )}
        </div>
        )}

        {/* Lista de documentos PENDIENTES */}
        {totalParaSubir > 0 && !disabled && (
          <div>
            <div className="flex justify-between items-center border-b border-amber-200 pb-2 mb-3 bg-amber-50/50 p-3 rounded-lg">
              <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                <AlertCircle className="size-4" /> Documentos Pendientes de Subir
              </h3>
              <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full font-semibold">
                {totalParaSubir}
              </span>
            </div>

            <div className="space-y-2">
              {documentosPendientes.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.nombre}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatearTamano(doc.tamaño)} • Pendiente
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemover(doc.id)}
                    disabled={subiendo}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ml-2"
                    title="Remover de la lista"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {subiendo && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Subiendo documentos ({subiendoCount}/{totalParaSubir})
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lista de documentos SUBIDOS */}
        {documentos.length > 0 && (
          <div>
            <div className="flex justify-between items-center border-b border-green-100 pb-2 mb-3">
              <h3 className="text-sm font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle2 className="size-4" /> Documentos Guardados
              </h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {documentos.length}
              </span>
            </div>

            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.nombre || doc.originalName || "Documento sin nombre"}
                    </p>
                    {doc.fechaCreacion && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatearFechaHora(doc.fechaCreacion)}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Visualizar documento"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}

                    {(doc.url || doc.id) && (
                      <button
                        type="button"
                        onClick={() =>
                          descargarDocumento(doc.id, doc.originalName || doc.nombre)
                        }
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Descargar documento"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleEliminar(doc.id, doc.nombre || doc.originalName)
                      }
                      disabled={eliminando === doc.id}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title="Eliminar documento"
                    >
                      {eliminando === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {documentosPendientes.length === 0 && documentos.length === 0 && !cargando && (
          <p className="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl">
            No hay documentos adjuntos
          </p>
        )}
      </div>
    </FormSection>
 
    {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
    <ConfirmModal
      isOpen={mostrarModalEliminar}
      onClose={() => {
        setMostrarModalEliminar(false);
        setDocumentoAEliminar(null);
      }}
      onConfirm={confirmarEliminar}
      icon={Trash}
      title="Eliminar documento"
      description={
        documentoAEliminar
          ? `¿Estás seguro de que deseas eliminar "${documentoAEliminar.nombre}"? Esta acción no se puede deshacer.`
          : "¿Deseas eliminar este documento? Esta acción no se puede deshacer."
      }
      confirmText="Sí, eliminar"
      cancelText="Cancelar"
      confirmColor="bg-red-600 hover:bg-red-700"
      loading={eliminando === documentoAEliminar?.id}
    />
    </>
  );
}
