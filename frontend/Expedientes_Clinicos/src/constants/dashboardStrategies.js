import { Shield, Stethoscope, Activity, Users, Clock, BarChart3, Pill, TestTube, Calendar, Kanban, ListChecks, User, UserPlus, ArrowRightCircle } from "lucide-react";

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
      { id: 'usuarios', title: "Usuarios", sub: "Gestionar usuarios", icon: Shield, color: "text-red-600", path: "gestion-usuarios" },
      { id: 'auditoria', title: "Auditoría", sub: "Eventos del sistema", icon: BarChart3, color: "text-purple-600", path: "auditoria" },
      { id: 'medicamentos', title: "Medicamentos", sub: "Catálogo", icon: Pill, color: "text-green-600", path: "catalogo-medicamentos" },
      { id: 'examenes', title: "Exámenes", sub: "Tipos de examen", icon: TestTube, color: "text-teal-600", path: "catalogo-examenes" },
    ],
    
    trazabilidad: {
      title: "Sistema de Trazabilidad",
      subtitle: "Supervisión del flujo asistencial",
      items: [
        {
          id: "tablero", title: "Tablero", sub: "Vista Kanban", icon: Kanban,
          color: "bg-orange-600", border: "border-orange-200", hoverBorder: "hover:border-orange-400",
          bg: "from-white to-orange-50", navigateTo: "tablero-trazabilidad"
        },
        {
          id: "agenda", title: "Agenda", sub: "Programar citas", icon: Calendar,
          color: "bg-blue-600", border: "border-blue-200", hoverBorder: "hover:border-blue-400",
          bg: "from-white to-blue-50", navigateTo: "agenda-citas"
        },
        {
          id: "enviar-preclinica", title: "Enviar a Preclínica", sub: "Triaje de hoy", icon: ListChecks,
          color: "bg-indigo-600", border: "border-indigo-200", hoverBorder: "hover:border-indigo-400",
          bg: "from-white to-indigo-50", navigateTo: "enviar-preclinica"
        },
        {
          id: "preclinica", title: "Preclínica", sub: "Cola de espera", icon: ListChecks, 
          color: "bg-green-600", border: "border-green-200", hoverBorder: "hover:border-green-400",
          bg: "from-white to-green-50", navigateTo: "cola-preclinica"
        },
        {
          id: "consulta", title: "Consulta", sub: "Cola de espera", icon: ListChecks, 
          color: "bg-purple-600", border: "border-purple-200", hoverBorder: "hover:border-purple-400",
          bg: "from-white to-purple-50", navigateTo: "cola-consulta"
        },
      ]
    }
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
      // { id: 'pacientes', title: "Pacientes", sub: "Mis pacientes", icon: Users, color: "text-blue-600", navigationTo: "error" },
      { id: 'citas', title: "Citas", sub: "Agenda del día", icon: Calendar, color: "text-orange-600", path: "cola-consulta" },
      // { id: 'expedientes', title: "Expedientes", sub: "Historial clínico", icon: Shield, color: "text-indigo-600", path: "gestion-pacientes" },
    ],
    trazabilidad: {
      title: "Trazabilidad de las Consultas",
      subtitle: "Supervisión del flujo asistencial",
      items: [
        { id: "tablero", title: "Tablero", sub: "Vista Kanban", icon: Kanban, 
          color: "bg-orange-600", border: "border-orange-200", hoverBorder: "hover:border-orange-400",
          bg: "from-white to-orange-50", navigateTo: "tablero-trazabilidad"
        },
        {
          id: "consulta", title: "Consulta", sub: "Cola de espera", icon: ListChecks,
          color: "bg-purple-600", border: "border-purple-200", hoverBorder: "hover:border-purple-400", 
          bg: "from-white to-purple-50", navigateTo: "cola-consulta"
        }
      ]
    }
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
      { id: 'triaje', title: "Triaje", sub: "Evaluar signos vitales", icon: Activity, color: "text-green-600", path: "cola-preclinica" },
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
      { id: 'expediente', title: "Crear Expediente", sub: "Nuevo expediente", icon: UserPlus, color: "text-blue-600", path: "crear-expediente" },
      { id: 'enviar-preclinica', title: "Enviar a Preclínica", sub: "Pacientes de hoy", icon: ArrowRightCircle, color: "text-indigo-600", path: "enviar-preclinica" },
    ],
    trazabilidad: {
      title: "Trazabilidad de la Preclinica",
      subtitle: "Supervisión del flujo asistencial",
      items: [
        {
          id: "tablero", title: "Tablero", sub: "Vista Kanban", icon: Kanban,
          color: "bg-orange-600", border: "border-orange-200", hoverBorder: "hover:border-orange-400",
          bg: "from-white to-orange-50", navigateTo: "tablero-trazabilidad"
        },
        {
          id: "agenda", title: "Agenda", sub: "Programar citas", icon: Calendar,
          color: "bg-blue-600", border: "border-blue-200", hoverBorder: "hover:border-blue-400",
          bg: "from-white to-blue-50", navigateTo: "agenda-citas"
        },
        {
          id: "enviar-preclinica", title: "Enviar a Preclínica", sub: "Triaje de hoy", icon: ListChecks,
          color: "bg-indigo-600", border: "border-indigo-200", hoverBorder: "hover:border-indigo-400",
          bg: "from-white to-indigo-50", navigateTo: "enviar-preclinica"
        }
      ]
    }
  }
};