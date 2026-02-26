import { useEnfermeroDashboard } from "../hooks/useEnfermeroDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/AuthContext";


export function DashboardEnfermero() {
  const { user } = useAuth();
  
  const { estadisticasHoy, consulta, loading } = useEnfermeroDashboard();

  if (loading) return <p className="p-6">Cargando datos maestros...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido/a, {user?.nombre} {user.apellido}
        </h1>
        <p className="text-gray-600">Panel de Enfermería - Registro Preclínico</p>
      </div>

      {/* Banner de Turno (Verde) */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Jornada actual</p>
              <h2 className="text-2xl font-bold">Martes, 24 de Febrero 2026</h2>
              <p className="text-green-100 mt-1">
                Inicio: {estadisticasHoy.horaInicio} • Duración: 8 horas  
              </p>
            </div>
            <Clock className="h-12 w-12 text-green-200" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          titulo="Pacientes Evaluados" 
          valor={estadisticasHoy.pacientesEvaluados} 
          icon={<Users className="h-5 w-5 text-green-600" />} 
          border="border-green-100" 
          textColor="text-green-900"
          pieDeFoto={"Hoy"}
        />
        <StatsCard 
          titulo="Evaluaciones Pendientes" 
          valor={estadisticasHoy.evaluacionesPendientes} 
          icon={<Activity className="h-5 w-5 text-orange-600" />} 
          border="border-orange-100" 
          textColor="text-orange-900"
          pieDeFoto={"En espera"}
        />
      </div>

      {/* Próximas  */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes en Espera</CardTitle>
          <CardDescription>Pendientes de toma de signos vitales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consulta.map((evento, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{evento.nombre}</p>
                    {/* <p className="text-xs text-gray-500">{evento.tipo}</p> */}
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                        {evento.tipo}
                    </Badge>
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