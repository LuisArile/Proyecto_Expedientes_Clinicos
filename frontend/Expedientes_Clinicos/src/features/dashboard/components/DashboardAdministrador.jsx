import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { useAuth } from "@/features/auth/AuthContext";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BarChart3, Pill, TestTube, Clock } from "lucide-react";

export function DashboardAdministrador() {
  const { user } = useAuth();
  const { estadisticas, actividad, loading } = useAdminDashboard();

  if (loading) return <p className="p-6">Cargando datos maestros...</p>;

  return (
    <div className="p-6 space-y-6 ">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido/a, {user?.nombre} {user.apellido}
        </h1>
        <p className="text-gray-600">Panel de Administración - Control del Sistema Clínico</p>
      </div>

      {/* Banner de Sesión (Rojo) */}
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Sesión administrativa activa</p>
              <h2 className="text-2xl font-bold">Panel de Control Total</h2>
              <p className="text-red-100 mt-1">Servicios funcionando correctamente</p>
            </div>
            <Shield className="h-12 w-12 text-red-200" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas con Colores de Figma */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          titulo="Usuarios Activos" 
          valor={estadisticas.usuariosActivos} 
          icon={<Users className="text-blue-600" />} 
          border="border-blue-100" 
          textColor="text-blue-900"
          pieDeFoto={"Total en sistema"}
        />
        <StatsCard 
          titulo="Eventos Hoy" 
          valor={estadisticas.eventosHoy} 
          icon={<BarChart3 className="text-purple-600" />} 
          border="border-purple-100" 
          textColor="text-purple-900"
          pieDeFoto={"Hoy"}
        />
        <StatsCard 
          titulo="Medicamentos" 
          valor={estadisticas.medicamentos} 
          icon={<Pill className="text-green-600" />} 
          border="border-green-100" 
          textColor="text-green-900"
          pieDeFoto={"En catálogo"}          
        />
        <StatsCard 
          titulo="Tipos de Examen" 
          valor={estadisticas.tiposExamen} 
          icon={<TestTube className="text-teal-600" />} 
          border="border-teal-100" 
          textColor="text-teal-900"
          pieDeFoto={"Disponibles"}
        />
      </div>
{/* Acceso rápido a módulos administrativos */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos Administrativos</CardTitle>
          <CardDescription>Acceso rápido a funciones de administración</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="h-10 w-10 text-red-600" />
                <h3 className="font-semibold text-gray-900">Usuarios</h3>
                <p className="text-xs text-gray-600">Gestionar usuarios</p>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <BarChart3 className="h-10 w-10 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Auditoría</h3>
                <p className="text-xs text-gray-600">Eventos del sistema</p>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <Pill className="h-10 w-10 text-green-600" />
                <h3 className="font-semibold text-gray-900">Medicamentos</h3>
                <p className="text-xs text-gray-600">Catálogo</p>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <TestTube className="h-10 w-10 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Exámenes</h3>
                <p className="text-xs text-gray-600">Tipos de examen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente con Estilo Figma */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente del Sistema</CardTitle>
          <CardDescription>Últimos eventos registrados en auditoría</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actividad.map((evento, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{evento.usuario}</p>
                    <p className="text-xs text-gray-500">{evento.accion}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">{evento.hora}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente auxiliar para las tarjetas de arriba
function StatsCard({ titulo, valor, icon, border, textColor, pieDeFoto }) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${border}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600">{titulo}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColor}`}>{valor}</div>
        <p className="text-xs text-gray-500 mt-1 font-medium">
            {pieDeFoto}
        </p>
      </CardContent>
    </Card>
  );
}