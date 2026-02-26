import { useRecepcionistaDashboard } from "../hooks/useRecepcionistaDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, FileText } from "lucide-react";

import { useAuth } from "@/features/auth/AuthContext";

import { FormularioExpediente } from "@/features/expedientes/components/FormularioExpediente";

export function DashboardRecepcionista(/*{ currentView }*/) {
  const { user } = useAuth();
  
  const { estadisticas, registro, loading } = useRecepcionistaDashboard();

  if (loading) return <p className="p-6">Cargando datos maestros...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido/a, {user?.nombre} {user.apellido}
        </h1>
        <p className="text-gray-600">Panel Recepcionista- Registro y Citas</p>
      </div>

      {/* Banner de Turno (Azul) */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Turno actual</p>
              <h2 className="text-2xl font-bold">Lunes, 23 de Febrero 2026</h2>
              <p className="text-blue-100 mt-1">
                Inicio: {estadisticas.horaInicio} • Duración: 8 horas  
              </p>
            </div>
            <Clock className="h-12 w-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del día*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          titulo="Pacientes atendidos" 
          valor={estadisticas.pacientesAtendidos} 
          icon={<Users className="h-5 w-5 text-blue-600"  />} 
          border="border-blue-100" 
          textColor="text-blue-900"
          pieDeFoto={"Hoy"}
        />
        <StatsCard 
          titulo="Citas Agendadas" 
          valor={estadisticas.citasAgendadas} 
          icon={<Calendar className="h-5 w-5 text-green-600" />} 
          border="border-green-100" 
          textColor="text-green-900"
          pieDeFoto={"Pendientes"}
        />
        <StatsCard 
          titulo="Expedientes Creados" 
          valor={estadisticas.expedientesCreados} 
          icon={<FileText className="h-5 w-5 text-purple-600" />} 
          border="border-purple-100" 
          textColor="text-purple-900"
          pieDeFoto={"Hoy"}
        />
      </div>

      {/* Información adicional - Pacientes Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Recientes</CardTitle>
          <CardDescription>Últimos expedientes creados hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {registro.map((paciente, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{paciente.nombre}</p>
                    <p className="text-xs text-gray-500">{paciente.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{paciente.hora}</p>
                  <p className="text-xs text-gray-400">Creado</p>
                </div>
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
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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