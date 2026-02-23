import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/authContext";
import { ROLE_STRATEGIES } from "@/constants/roles"


import {
  Hospital,
  UserPlus,
  Search,
  FileText,
  Activity,
  Users,
  Settings,
  BarChart3,
  Pill,
  TestTube,
  ClipboardList,
  Stethoscope,
  LogOut,
  Shield,
} from "lucide-react";

const menuItems = [
  // Recepcionista
  {
    id: "crear-paciente",
    label: "Crear Paciente",
    icon: UserPlus,
    roles: ["recepcionista"],
    description: "Registrar nuevo paciente",
  },
  {
    id: "buscar-paciente",
    label: "Buscar Paciente",
    icon: Search,
    roles: ["recepcionista", "enfermero", "doctor", "administrador"],
    description: "Consultar expedientes",
  },
  {
    id: "gestion-pacientes",
    label: "Gestión de Pacientes",
    icon: Users,
    roles: ["recepcionista"],
    description: "Administrar datos personales",
  },

  // Enfermero
  {
    id: "preclinica",
    label: "Registro Preclínico",
    icon: Activity,
    roles: ["enfermero"],
    description: "Signos vitales y evaluación inicial",
  },

  // Doctor
  {
    id: "consulta-medica",
    label: "Consulta Médica",
    icon: Stethoscope,
    roles: ["doctor"],
    description: "Registro de consulta",
  },
  {
    id: "solicitud-examen",
    label: "Solicitud de Examen",
    icon: TestTube,
    roles: ["doctor"],
    description: "Solicitar estudios médicos",
  },
  {
    id: "adjuntar-documentos",
    label: "Adjuntar Documentos",
    icon: ClipboardList,
    roles: ["doctor"],
    description: "Cargar archivos al expediente",
  },

  // Administrador
  {
    id: "gestion-usuarios",
    label: "Gestión de Usuarios",
    icon: Shield,
    roles: ["administrador"],
    description: "Administrar usuarios del sistema",
  },
  {
    id: "auditoria",
    label: "Auditoría",
    icon: BarChart3,
    roles: ["administrador"],
    description: "Registro de eventos del sistema",
  },
  {
    id: "catalogo-medicamentos",
    label: "Catálogo de Medicamentos",
    icon: Pill,
    roles: ["administrador"],
    description: "Gestionar medicamentos",
  },
  {
    id: "catalogo-examenes",
    label: "Catálogo de Exámenes",
    icon: TestTube,
    roles: ["administrador"],
    description: "Gestionar tipos de examen",
  },
];

export function Sidebar({ currentView, onNavigate  }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const availableMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const roleConfig = ROLE_STRATEGIES[user?.role] || { 
    label: user?.role, 
    color: "bg-gray-100 text-gray-800" 
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-lg">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Hospital className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-white">
            <h2 className="font-bold text-sm">SGEC</h2>
            <p className="text-xs text-blue-100">Sistema de Expedientes</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-semibold text-sm">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs px-2 py-1 ${roleConfig.color}`}
        >
          {roleConfig.label}
        </Badge>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 mb-3 px-3">MENÚ PRINCIPAL</p>
          {availableMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.description && !isActive && (
                    <p className="text-xs text-gray-500">{item.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={logout}
          className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center bg-gray-50 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Sesión activa
          </span>
        </span>
      </div>
    </div>
  );
}
