import React, { useMemo, useState } from "react";
import { useMedicamentos } from "../hooks/useMedicamentos";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { useTableFactory } from "@/shared/hooks/useTableFactory";

import { PageHeader } from "@components/layout/PageHeader";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { StatCard } from "@components/common/StatCard"
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { DataTable } from "@components/common/DataTable";

import { getMedicamentosColumns } from "../config/columns/medicamentosBaseColumns";
import { medicamentosActions } from "../config/actions/medicamentosActions";

import { Pill, CheckCircle2, Power, ListPlus, Edit } from "lucide-react";

export function CatalogoMedicamentos() {

  const { go } = useSafeNavigation();

  const {
    medicamentos,
    loading,
    busqueda,
    setBusqueda,
    handleToggleEstado
  } = useMedicamentos();

  const [accionando, setAccionando] = useState(null);

  const actions = medicamentosActions({
    onEdit: (row) => {
      sessionStorage.setItem("edit_medicamento", JSON.stringify(row));
      go("formulario-medicamento");
    },
    onToggleEstado: async (row) => {
      setAccionando(row.id);
      await handleToggleEstado(row.id);
      setAccionando(null);
    },
    accionandoId: accionando
  });

  const columns = useTableFactory({
    columns: getMedicamentosColumns(),
    actions
  });

  const stats = useMemo(() => {
    const total = medicamentos.length;
    const activos = medicamentos.filter(m => m.estado).length;
    const inactivos = total - activos;
    const categorias = new Set(medicamentos.map(m => m.categoria)).size;

    return { total, activos, inactivos, categorias };
  }, [medicamentos]);

  return (
    <div>
      <PageHeader
        title="Catálogo de Medicamentos"
        subtitle="Gestión del catálogo de medicamentos del sistema"
        Icon={Pill}
        onVolver={() => go("inicio")}
      />

      <main className="p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Medicamentos"
            value={stats.total}
            icon={Pill} iconColor="text-purple-600"
          />
          <StatCard
            title="Activos"
            value={stats.activos}
            icon={CheckCircle2} iconColor="text-green-600"
            color="text-green-600"
          />
          <StatCard
            title="Inactivos"
            value={stats.inactivos}
            icon={Power} iconColor="text-red-600"
            color="text-red-600"
          />
          <StatCard
            title="Categorías"
            value={stats.categorias}
            icon={ListPlus} iconColor="text-blue-600"
          />
        </div>

        <Card className="bg-white shadow-md rounded-xl border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">

              <Input
                placeholder="Buscar por nombre o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.trimStart())}
                className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all shadow-sm"
              />

              <Button
                onClick={() => {
                  sessionStorage.removeItem("edit_medicamento");
                  go("formulario-medicamento");
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                + Nuevo Medicamento
              </Button>

            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-6">Cargando...</p>
            ) : medicamentos.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                No se encontraron resultados
              </p>
            ) : (
              <DataTable columns={columns} data={medicamentos} />
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
