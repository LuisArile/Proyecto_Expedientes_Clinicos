import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Users } from "lucide-react";

import { Card } from "@components/ui/card";
import { PageHeader } from "@components/layout/PageHeader";
import { DataTable } from "@components/common/DataTable";
import { obtenerTodosRegistros } from "../services/registroPreclinicoService";

export function ListaRegistrosPreclinicos({ onVolver }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerTodosRegistros();
        setRegistros(data);
      } catch (error) {
        console.error("Error al cargar registros:", error);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  const columns = useMemo(() => [
    {
      header: "Expediente",
      render: (r) => (
        <span className="font-mono text-sm text-blue-600">
          {r.expediente?.numeroExpediente || "N/A"}
        </span>
      ),
    },
    {
      header: "Paciente",
      render: (r) => (
        <span className="font-medium text-gray-900">
          {r.expediente?.paciente
            ? `${r.expediente.paciente.nombre} ${r.expediente.paciente.apellido}`
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Presión",
      render: (r) => <span>{r.presionArterial || "—"}</span>,
    },
    {
      header: "Temp. (°C)",
      render: (r) => <span>{r.temperatura ?? "—"}</span>,
    },
    {
      header: "Peso (kg)",
      render: (r) => <span>{r.peso ?? "—"}</span>,
    },
    {
      header: "Talla (cm)",
      render: (r) => <span>{r.talla ?? "—"}</span>,
    },
    {
      header: "FC (lpm)",
      render: (r) => <span>{r.frecuenciaCardiaca ?? "—"}</span>,
    },
    {
      header: "Enfermero/a",
      render: (r) => (
        <span className="text-gray-600">
          {r.enfermero ? `${r.enfermero.nombre} ${r.enfermero.apellido}` : "N/A"}
        </span>
      ),
    },
    {
      header: "Fecha",
      render: (r) => (
        <span className="text-sm text-gray-500">
          {r.fechaRegistro
            ? new Date(r.fechaRegistro).toLocaleString("es-HN", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })
            : "—"}
        </span>
      ),
    },
  ], []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <PageHeader title="Pacientes Evaluados" subtitle="Registros preclínicos" Icon={Users} onVolver={onVolver} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader
        title="Pacientes Evaluados"
        subtitle={`Total de registros preclínicos: ${registros.length}`}
        Icon={Users}
        onVolver={onVolver}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={registros}
            emptyMessage="No hay registros preclínicos aún."
          />
        </Card>
      </main>
    </div>
  );
}
