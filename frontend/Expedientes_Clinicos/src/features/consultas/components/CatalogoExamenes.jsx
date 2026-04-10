import React, { useMemo, useState } from "react";
import { useExamenes } from "../hooks/useExamenes";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { useTableFactory } from "../../../shared/hooks/useTableFactory";

import { PageHeader } from "@components/layout/PageHeader";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { StatCard } from "@components/common/StatCard"
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTable } from "@components/common/DataTable";

import { getExamenesColumns } from "../config/columns/examenBaseColumns";
import { examenesActions } from "../config/actions/examenesActions";

import { TestTube, CheckCircle2, Power, ListPlus } from "lucide-react";

export function CatalogoExamenes() {

  const { go } = useSafeNavigation();

  const {
    examenes,
    loading,
    busqueda,
    setBusqueda,
    handleToggleEstado
  } = useExamenes();

  const [accionando, setAccionando] = useState(null);

  const actions = examenesActions({
    onEdit: (row) => {
      sessionStorage.setItem("edit_examen", JSON.stringify(row));
      go("formulario-examen");
    },
    onToggleEstado: async (row) => {
      setAccionando(row.id);
      await handleToggleEstado(row.id);
      setAccionando(null);
    },
    accionandoId: accionando
  });

  const columns = useTableFactory({
    columns: getExamenesColumns(),
    actions
  });

  // Estadísticas optimizadas
  const stats = useMemo(() => {
    const total = examenes.length;
    const activos = examenes.filter(e => e.estado).length;
    const inactivos = total - activos;
    const especialidades = new Set(examenes.map(e => e.especialidad)).size;

    return { total, activos, inactivos, especialidades };
  }, [examenes]);

  return (
    <div>
      <PageHeader
        title="Catálogo de Exámenes"
        subtitle="Gestión del catálogo de exámenes médicos del sistema"
        Icon={TestTube}
        onVolver={() => go("inicio")}
      />

      <main className="p-6 space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Exámenes"
            value={stats.total}
            icon={TestTube} iconColor="text-purple-600"
          />
          <StatCard
            title="Activos"
            value={stats.activos}
            icon={CheckCircle2} iconColor = "text-green-600"
          />
          <StatCard
            title="Inactivos"
            value={stats.inactivos}
            icon={Power} iconColor="text-red-600"
          />
          <StatCard
            title="Especialidades"
            value={stats.especialidades}
            icon={ListPlus} iconColor="text-blue-600"
          />
        </div>

        {/* TABLA */}
        <Card className="bg-white shadow-md rounded-xl border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">

              <Input
                placeholder="Buscar por nombre o especialidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.trimStart())}
                className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all shadow-sm"
              />

              <Button
                onClick={() => {
                  sessionStorage.removeItem("edit_examen");
                  go("formulario-examen");
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                + Nuevo Examen
              </Button>

            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-6">Cargando...</p>
            ) : examenes.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                No se encontraron resultados
              </p>
            ) : (
              <DataTable columns={columns} data={examenes} />
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}