import React, { useMemo, useState } from "react";
import { useMedicamentos } from "../hooks/useMedicamentos";

import { PageHeader } from "@components/layout/PageHeader";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { DataTable } from "@components/common/DataTable";

import { Pill, CheckCircle2, Power, ListPlus, Edit } from "lucide-react";

export function CatalogoMedicamentos({ onNavigate, onVolver }) {

  const {
    medicamentos,
    loading,
    busqueda,
    setBusqueda,
    handleToggleEstado
  } = useMedicamentos();

  const [accionando, setAccionando] = useState(null);

  const stats = useMemo(() => {
    const total = medicamentos.length;
    const activos = medicamentos.filter(m => m.estado).length;
    const inactivos = total - activos;
    const categorias = new Set(medicamentos.map(m => m.categoria)).size;

    return { total, activos, inactivos, categorias };
  }, [medicamentos]);

  const columns = [
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Categoría", accessorKey: "categoria" },
    {
      header: "Estado",
      render: (row) => (
        <Badge
          className={
            row.estado
              ? "bg-green-100 text-green-700 border-none"
              : "bg-red-100 text-red-700 border-none"
          }
        >
          {row.estado ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      header: "Fecha Creación",
      render: (row) =>
        new Date(row.fechaCreacion).toLocaleDateString(),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              sessionStorage.setItem("edit_medicamento", JSON.stringify(row));
              onNavigate("formulario-medicamento");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 
             hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 
             transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Edit className="h-4 w-4 mr-1" />
              Editar
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              setAccionando(row.id);
              await handleToggleEstado(row.id);
              setAccionando(null);
            }}
            disabled={accionando === row.id}
            className={
              row.estado
                ? "flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                : "flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            }
          >
            <Power className="h-4 w-4 mr-1" />
            {accionando === row.id
              ? "Procesando..."
              : row.estado
                ? "Desactivar"
                : "Activar"}
          </Button>

        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Catálogo de Medicamentos"
        subtitle="Gestión del catálogo de medicamentos del sistema"
        Icon={Pill}
        onVolver={onVolver}
      />

      <main className="p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Medicamentos"
            value={stats.total}
            icon={<Pill className="text-purple-600" />}
          />
          <StatCard
            title="Activos"
            value={stats.activos}
            icon={<CheckCircle2 className="text-green-600" />}
            color="text-green-600"
          />
          <StatCard
            title="Inactivos"
            value={stats.inactivos}
            icon={<Power className="text-red-600" />}
            color="text-red-600"
          />
          <StatCard
            title="Categorías"
            value={stats.categorias}
            icon={<ListPlus className="text-blue-600" />}
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
                  onNavigate("formulario-medicamento");
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

function StatCard({ title, value, icon, color = "text-gray-900" }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="pt-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
