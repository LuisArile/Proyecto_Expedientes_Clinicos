import { Clock, UserCheck, PillBottle, Activity, Users, BarChart3, Pill, TestTube, FileText, Stethoscope, Calendar, NotebookText 
        } from "lucide-react";

import { useAuth } from "@/features/auth/useAuth";
import { useDashboardData } from "../hooks/useDashboardData";
import { DASHBOARD_CONFIG } from "@/constants/dashboardStrategies";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { obtenerFechaActual } from "@/utils/dateFormatter";

const ICON_MAP = {
  Users: Users,
  BarChart3: BarChart3,
  Pill: Pill,
  TestTube: TestTube,
  UserCheck: UserCheck,
  Activity: Activity,
  Calendar: Calendar,
  PillBottle: PillBottle,
  NotebookText: NotebookText,
  Stethoscope: Stethoscope,
  FileText: FileText,

};

export function DashboardFeature({ onNavigate }) {
    const { user } = useAuth();
    const userRole = user?.rol?.toUpperCase().trim();
    const config = DASHBOARD_CONFIG[userRole];
    
    const { tarjetas, actividad, loading } = useDashboardData(userRole);

    if (loading) return <p className="p-6 text-center animate-pulse">Sincronizando datos del sistema...</p>;

    return (
        <div className="p-6 space-y-6">    
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bienvenido/a, {user?.nombre} {user?.apellido}
                </h1>
                <p className="text-gray-600">{config.title} - {config.subtitle}</p>
            </div>

            <Card className={`bg-gradient-to-r ${config.gradient} text-white border-none shadow-lg`}>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="opacity-80 text-sm"> {userRole === 'ADMINISTRADOR' ? config.sessionType : "Turno Actual"} </p>
                            <h2 className="text-2xl font-bold">{obtenerFechaActual()}</h2>
                            <p className="text-red-100 mt-1">
                                {userRole === 'ADMINISTRADOR' ? config.bannerSub : "Inicio: 08:00 AM • Duración: 8 horas"} {/**Más adelante formatearemos el turno desde la base de datos*/}
                            </p>
                        </div>
                        <config.icon className="h-12 w-12 opacity-30" />
                    </div>
                </CardContent>
            </Card>

            {/* Estadisticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tarjetas?.map((stat) => {
                    const configVisual = config.cards?.[stat.id];
                    const navigateTo = configVisual?.navigateTo;

                return (
                    <StatsCard 
                        key={stat.id}
                        titulo={configVisual?.titulo || stat.titulo}
                        valor={stat.valor}
                        icon={configVisual?.icon || "Activity"}
                        border={configVisual?.border || "border-gray-100"}
                        textColor={configVisual?.textColor || "text-gray-600"}
                        pie={stat.pie}
                        onClick={navigateTo && onNavigate ? () => onNavigate(navigateTo) : undefined}
                    />
                );
                })}
            </div>

            {/* Sección de Módulos */}
            <Card className="border-none shadow-sm bg-gray-50/50">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800">
                        {config.modulesTitle}
                    </CardTitle>
                    <CardDescription>
                        {config.modulesSubtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {config.modules?.map((modulo) => (
                            <div 
                                key={modulo.id}
                                onClick={() => onNavigate(modulo.path)}
                                className="p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
                            >
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className={`p-3 rounded-full bg-gray-50 group-hover:bg-white transition-colors`}>
                                        <modulo.icon className={`h-8 w-8 ${modulo.color} group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{modulo.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{modulo.sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Sección de Actividad Reciente */}
            <Card className="shadow-md border-none overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-800">
                                {config.listTitle}
                            </CardTitle>
                            <CardDescription>
                                {config.listDescription}
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className={`${config.bgAccent} ${config.accentColor} border-none`}>
                            Hoy
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                        {actividad && actividad.length > 0 ? (
                            actividad.map((item, index) => (
                                <ListItem 
                                    key={index} 
                                    item={item} 
                                    accent={config.accentColor} 
                                    bg={config.bgAccent}
                                    statusLabel={config.statusLabel}
                                    onClick={() => {
                                        if (item.idExpediente) {
                                            // Construir el objeto del paciente para la navegación
                                            const pacienteData = {
                                                idPaciente: item.idPaciente,
                                                nombre: item.paciente?.nombre || '',
                                                apellido: item.paciente?.apellido || '',
                                                dni: item.paciente?.dni || '',
                                                telefono: item.paciente?.telefono || '',
                                                correo: item.paciente?.correo || '',
                                                sexo: item.paciente?.sexo || '',
                                                fechaNacimiento: item.paciente?.fechaNacimiento || '',
                                                direccion: item.paciente?.direccion || '',
                                                expedientes: item.expedientes || {}
                                            };
                                            onNavigate({
                                                view: 'ver-expediente',
                                                paciente: pacienteData
                                            });
                                        }
                                    }}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-10">No hay actividad registrada para hoy.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
    }

    function StatsCard({ titulo, valor, icon, border, textColor, pie, onClick }) {
        const IconComponent = ICON_MAP[icon] || Activity;
        return (
        <Card 
            className={`hover:shadow-md transition-shadow border-l-4 ${border} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    {titulo}
                </CardTitle>
                <IconComponent className={`h-5 w-5 ${textColor}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${textColor}`}>{valor}</div>
                <p className="text-xs text-gray-500 mt-1 font-medium">{pie}</p>
            </CardContent>
        </Card>
    );
    }

    function ListItem({ item, accent, bg, onClick }) {

        const horaFormateada = item.fecha ? new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";
        
        // Usar icono de documento para expedientes, reloj para auditoría
        const IconComponent = item.idExpediente ? FileText : Clock;

        return (
            <div 
                onClick={onClick}
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all ${onClick ? 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm cursor-pointer' : 'hover:bg-white'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 ${bg} rounded-full flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${accent}`} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{item.primaryText || item.usuario || item.nombre}</p>
                        <p className="text-xs text-gray-500">{item.secondaryText || item.accion || item.tipo}</p>
                    </div>
                </div>
                <div className="text-right text-sm text-gray-600 font-mono">{horaFormateada}</div>
            </div>
        );
    }