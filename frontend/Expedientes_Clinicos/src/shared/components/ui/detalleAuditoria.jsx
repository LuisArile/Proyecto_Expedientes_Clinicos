import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { DetailBox } from "@components/common/DetailBox";

export function DetalleAuditoria({ detallesRaw }) {
  if (!detallesRaw) return null;

  try {
    const detalles = JSON.parse(detallesRaw);

    // Caso: Consulta médica
    if (detalles?.tipo === "CONSULTA_MEDICA") {
      return (
        <div className="space-y-3">
          <DetailBox 
            label="Consulta" 
            value={`ID: ${detalles.idConsulta}`} 
            icon={CheckCircle2}
          />

          <DetailBox 
            label="Exámenes" 
            value={detalles.examenes ? "Agregados" : "No agregados"} 
            icon={detalles.examenes ? CheckCircle2 : AlertCircle}
          />

          <DetailBox 
            label="Medicamentos" 
            value={detalles.medicamentos ? "Agregados" : "No agregados"} 
            icon={detalles.medicamentos ? CheckCircle2 : AlertCircle}
          />
        </div>
      );
    }

    // Otros JSON
    return (
      <pre className="bg-slate-50 text-slate-700 p-5 rounded-xl text-xs font-mono max-h-[280px] overflow-auto border border-slate-200 shadow-inner leading-relaxed">
        {JSON.stringify(detalles, null, 2)}
      </pre>
    );

  } catch {
    // Texto plano
    return (
      <pre className="bg-slate-50 text-slate-700 p-5 rounded-xl text-xs font-mono max-h-[280px] overflow-auto border border-slate-200 shadow-inner leading-relaxed">
        {detallesRaw}
      </pre>
    );
  }
}