import { UserPlus, Search, Activity, Stethoscope, Shield, Users, TestTube, ClipboardList, BarChart3, Pill, Lock } from "lucide-react";

export const ALL_MENU_ITEMS = [
    { 
        id: "crear-expediente", 
        label: "Crear Expediente", 
        icon: UserPlus, 
        permission: "CREAR_EXPEDIENTE"
    },
    { 
        id: "gestion-roles", 
        label: "Gestión de Roles", 
        icon: Lock, 
        permission: "GESTION_ROLES" 
    },
    { 
        id: "buscar-paciente", 
        label: "Buscar Paciente", 
        icon: Search, 
        permission: "BUSCAR_PACIENTE" 
    },
    { 
        id: "gestion-usuarios", 
        label: "Gestión de Usuarios", 
        icon: Shield, 
        permission: "GESTION_USUARIOS"    
    },
    { 
        id: "auditoria", 
        label: "Auditoría", 
        icon: BarChart3, 
        permission: "AUDITORIA"
    },
    { 
        id: "catalogo-medicamentos", 
        label: "Catálogo de Medicamentos", 
        icon: Pill, 
        permission: "CATALOGO_MEDICAMENTOS"
    },
    { 
        id: "catalogo-examenes", 
        label: "Catálogo de Exámenes", 
        icon: TestTube, 
        permission: "CATALOGO_EXAMENES"
    },  
    { 
        id: "gestion-pacientes", 
        label: "Gestión de Pacientes", 
        icon: Users, 
        permission: "GESTION_PACIENTES" 
    },
    { 
        id: "preclinica", 
        label: "Registro Preclínico", 
        icon: Activity, 
        permission: "PRECLINICA"
    },
    { 
        id: "consulta-medica", 
        label: "Consulta Médica", 
        icon: Stethoscope, 
        permission: "CONSULTA_MEDICA" 
    },
    { 
        id: "adjuntar-documentos", 
        label: "Adjuntar Documentos", 
        icon: ClipboardList, 
        permission: "ADJUNTAR_DOCUMENTOS",
    }
];