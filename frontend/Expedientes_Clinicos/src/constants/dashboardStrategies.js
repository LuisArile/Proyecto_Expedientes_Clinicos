import { Shield, Stethoscope, Activity, Users, Clock, BarChart3, Pill, TestTube, Calendar } from "lucide-react";

export const DASHBOARD_CONFIG = {
  ADMINISTRADOR: {
    title: "Panel de Administración",
    subtitle: "Control Total del Sistema",
    sessionType: "Sesión administrativa",
    bannerTitle: "Panel de Control Total",
    bannerSub: "Sistema funcionando correctamente • Todos los servicios activos",
    gradient: "from-red-600 to-red-700",
    icon: Shield,
    accentColor: "text-red-600",
    bgAccent: "bg-red-100",
    listTitle: "Auditoría del Sistema",
    listDescription: "Últimos eventos registrados en el log",
    statusLabel: "Evento",

    cards: {
      usuarios:     { titulo: "Usuarios Activos",     icon: "Users",      border: "border-blue-100",    textColor: "text-blue-900" },
      auditoria:    { titulo: "Eventos de Auditoría", icon: "BarChart3",  border: "border-purple-100",  textColor: "text-purple-600" },
      medicamentos: { titulo: "Medicamentos",         icon: "Pill",       border: "border-green-100",   textColor: "text-green-600" },
      examenes:     { titulo: "Exámenes",             icon: "TestTube",   border: "border-teal-100",    textColor: "text-teal-600" },
    },    

    modulesTitle: "Gestión de Infraestructura",
    modulesSubtitle: "Herramientas de control total",
    modules: [
      { id: 'usuarios', title: "Usuarios", sub: "Gestionar usuarios", icon: Shield, color: "text-red-600", path: "/usuarios" },
      { id: 'auditoria', title: "Auditoría", sub: "Eventos del sistema", icon: BarChart3, color: "text-purple-600", path: "/auditoria" },
      { id: 'medicamentos', title: "Medicamentos", sub: "Catálogo", icon: Pill, color: "text-green-600", path: "/medicamentos" },
      { id: 'examenes', title: "Exámenes", sub: "Tipos de examen", icon: TestTube, color: "text-teal-600", path: "/examenes" },
    ]
  },

  MEDICO: {
    title: "Panel Médico",
    subtitle: "Consultas y Diagnóstico",
    bannerTitle: "Turno Médico Activo",
    bannerSub: "Atención de pacientes",
    gradient: "from-purple-600 to-purple-700",
    icon: Stethoscope,
    accentColor: "text-purple-600",
    bgAccent: "bg-purple-100",
    listDescription: "Pacientes programados para hoy",
    statusLabel: "Programada",

    cards: {
      consultasRealizadas:  { titulo: "Consultas Realizadas", icon: "Stethoscope",  border: "border-purple-100",  textColor: "text-purple-600"  },
      consultasPendientes: { titulo: "Consultas Pendientes", icon: "Calendar",     border: "border-blue-100",    textColor: "text-blue-600"    },
      examenesOrdenados:   { titulo: "Exámenes Ordenados",   icon: "TestTube",     border: "border-teal-100",    textColor: "text-teal-600"    },
      recetasCreadas:    { titulo: "Recetas Creadas",      icon: "NotebookText", border: "border-purple-100",  textColor: "text-purple-600"  },
    },   

    modulesTitle: "Consulta Médica",
    modulesSubtitle: "Gestión de atención al paciente",
    modules: [
      { id: 'pacientes', title: "Pacientes", sub: "Mis pacientes", icon: Users, color: "text-blue-600", path: "/pacientes" },
      { id: 'citas', title: "Citas", sub: "Agenda del día", icon: Calendar, color: "text-orange-600", path: "/citas" },
      { id: 'expedientes', title: "Expedientes", sub: "Historial clínico", icon: Shield, color: "text-indigo-600", path: "/expedientes" },
    ]
  },

  ENFERMERO: {
    title: "Panel de Enfermería",
    subtitle: "Registro Preclínico",
    bannerTitle: "Jornada de Triaje",
    bannerSub: "Signos vitales y evaluación",
    gradient: "from-green-600 to-green-700",
    icon: Activity,
    accentColor: "text-green-600",
    bgAccent: "bg-green-100",
    listTitle: "Pacientes en Espera",
    listDescription: "Pendientes de toma de signos vitales (Triaje)",
    statusLabel: "En espera",

    cards: {
      pacientesEvaluados:  { titulo: "Pacientes Evaluados",      icon: "Users",    border: "border-green-100",   textColor: "text-green-600", navigateTo: "pacientes-evaluados" },
      evaluacionesPendientes: { titulo: "Evaluaciones Pendientes",  icon: "Activity", border: "border-orange-100",  textColor: "text-orange-600"  },
    },  

    modulesTitle: "Atención de Enfermería",
    modulesSubtitle: "Gestión de pacientes en triaje",
    modules: [ 
      { id: 'triaje', title: "Triaje", sub: "Evaluar signos vitales", icon: Activity, color: "text-green-600", path: "/triaje" },
    ]
  },

  RECEPCIONISTA: {
    title: "Panel Recepcionista",
    subtitle: "Registro y Citas",
    bannerTitle: "Atención al Cliente",
    bannerSub: "Gestión de ingresos",
    gradient: "from-blue-600 to-blue-700",
    icon: Clock,
    accentColor: "text-blue-600",
    bgAccent: "bg-blue-100",
    listTitle: "Pacientes Recientes",
    listDescription: "Últimos expedientes creados hoy",
    statusLabel: "Creado",

    cards: {
      pacientes:  { titulo: "Pacientes Registrados",  icon: "Users",    border: "border-blue-100",    textColor: "text-blue-600"    },
      expedientes: { titulo: "Expedientes Creados",   icon: "Calendar", border: "border-green-100",   textColor: "text-green-600"   },
      citas:   { titulo: "Citas Agendadas",           icon: "FileText", border: "border-purple-100",  textColor: "text-purple-600"  },
    },  

    modulesTitle: "Atención al Público",
    modulesSubtitle: "Ingresos y agendamiento",
    modules: [
       { id: 'citas', title: "Agendar Cita", sub: "Nueva cita médica", icon: Calendar, color: "text-blue-600", path: "/citas" },
    ]
  }
};