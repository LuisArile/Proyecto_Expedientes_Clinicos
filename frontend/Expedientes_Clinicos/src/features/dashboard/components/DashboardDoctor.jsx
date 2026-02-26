import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Calendar, TestTube, Clock } from "lucide-react";

import { useAuth } from "@/features/auth/AuthContext";


export function DashboardDoctor() {
  const { user } = useAuth();
  
  const { estadisticas, consulta, loading } = useDoctorDashboard();

  if (loading) return <p className="p-6">Cargando datos maestros...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenida, {user?.name}
        </h1>
        <p className="text-gray-600">Panel Médico - Consultas y Diagnóstico</p>
      </div>

      {/* Banner de Turno (Morado) */}
      <Card className="bg-gradient-to-r from-puple-600 to-purple-700 text-white border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Turno actual</p>
              <h2 className="text-2xl font-bold">Sábado, 21 de Febrero 2026</h2>
              <p className="text-purple-100 mt-1">
                Inicio: {estadisticas.horaInicio} • Duración: 8 horas  
              </p>
            </div>
            <Clock className="h-12 w-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          titulo="Consultas Realizadas" 
          valor={estadisticas.consultasRealizadas} 
          icon={<Stethoscope className="h-5 w-5 text-purple-600" />} 
          border="border-purple-100" 
          textColor="text-purple-900"
          pieDeFoto={"Hoy"}
        />
        <StatsCard 
          titulo="Consultas Pendientes" 
          valor={estadisticas.consultasPendientes} 
          icon={<Calendar className="h-5 w-5 text-blue-600" />} 
          border="border-blue-100" 
          textColor="text-blue-900"
          pieDeFoto={"Programadas"}
        />
        <StatsCard 
          titulo="Exámenes Ordenados" 
          valor={estadisticas.examenesOrdenados} 
          icon={<TestTube className="h-5 w-5 text-teal-600" />} 
          border="border-teal-100" 
          textColor="text-teal-900"
          pieDeFoto={"Hoy"}
        />
      </div>

      {/* Próximas consultas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Consultas</CardTitle>
          <CardDescription>Pacientes programados para hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consulta.map((evento, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{evento.nombre}</p>
                    <p className="text-xs text-gray-500">{evento.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{evento.hora}</p>
                  <p className="text-xs text-gray-500">Programada</p>
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