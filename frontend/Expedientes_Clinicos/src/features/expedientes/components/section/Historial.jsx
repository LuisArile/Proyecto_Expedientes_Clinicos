import { AlertTriangle, Activity, Stethoscope, User, TestTube } from "lucide-react";
import { CardContent } from "@components/ui/card";
import { TabsContent } from "@components/ui/tabs";

export function Historial({ data }) {
  const eventos = [
    ...(data?.consultasMedicas || []), 
    ...(data?.registrosPreclinicos || [])
  ];

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "N/A";
    const date = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date).replace(',', '');
  };

  return (
    <CardContent className="pt-6">
      <TabsContent value="historial" className="mt-0 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Historial Clínico Completo
          </h3>
        </div>

        <div className="space-y-3">
          {eventos.length > 0 ? (
            eventos
              .sort((a,b) => {
                const dateA = new Date(a.fechaConsulta || a.fechaRegistro).getTime();
                const dateB = new Date(b.fechaConsulta || b.fechaRegistro).getTime();
                return dateB - dateA;
              })
              .map((evento, index) => {
                const esConsulta = "medicoId" in evento;

                const tipo = esConsulta ? "consulta" : "preclinica";
                const uniqueKey = `${tipo}-${evento.id}`;
                
                const personalNombre = esConsulta 
                  ? `${evento.medico?.nombre} ${evento.medico?.apellido}`
                  : `${evento.enfermero?.nombre} ${evento.enfermero?.apellido}`;
                
                const fechaFormateada = formatFecha(evento.fechaConsulta || evento.fechaRegistro);

                let diagnosticoTexto = "";
                if (esConsulta && evento.diagnostico) {
                  try {
                    const diagObj = typeof evento.diagnostico === 'string' 
                      ? JSON.parse(evento.diagnostico) 
                      : evento.diagnostico;
                    diagnosticoTexto = diagObj.descripcion || "Sin descripción";
                  } catch {
                    diagnosticoTexto = String(evento.diagnostico);
                  }
                }

                return (
                  <div key={uniqueKey} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        esConsulta ? "bg-purple-100" : "bg-green-100"
                      }`}>
                        {esConsulta ? (
                          <Stethoscope className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Activity className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      {index < eventos.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900">
                            {esConsulta ? "Consulta Médica" : "Registro Preclínico"}
                          </p>
                          <p className="text-sm text-gray-600">{fechaFormateada}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User className="h-3 w-3" />
                          <span>
                            {esConsulta ? `Dr. ${personalNombre}` : `Enf. ${personalNombre}`}
                          </span>
                        </div>

                        {/* Diagnóstico */}
                        {esConsulta && diagnosticoTexto && (
                          <div className="mt-2">
                            <p className="text-xs font-bold text-gray-500">
                              Diagnóstico: {diagnosticoTexto}
                            </p>
                          </div>
                        )}

                        {/* EXÁMENES */}
                        {esConsulta && evento.examenes?.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <TestTube className="h-4 w-4 text-green-600" />
                              <p className="text-xs font-bold text-gray-500">
                                Exámenes solicitados
                              </p>
                            </div>

                            <ul className="space-y-1">
                              {evento.examenes.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex justify-between">
                                  <span className="pl-6">• {item.examen?.nombre}</span>
                                  <div className="flex items-center gap-2 justify-end">
                                    {item.prioridad === "URGENTE" && (
                                      <AlertTriangle className="h-4 w-4 text-red-700" />
                                    )}

                                    <span
                                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        item.prioridad === "URGENTE"
                                          ? "bg-red-200 text-red-800"
                                          : item.prioridad === "ALTA"
                                          ? "bg-red-100 text-red-700"
                                          : item.prioridad === "MEDIA"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {item.prioridad}
                                    </span>

                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-center text-gray-500 py-10">
              No hay actividad registrada en el historial.
            </p>
          )}
        </div>
      </TabsContent>
    </CardContent>
  );
}