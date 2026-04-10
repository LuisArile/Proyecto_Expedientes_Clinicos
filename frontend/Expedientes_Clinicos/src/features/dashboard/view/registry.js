import { viewRegistry } from "@/shared/services/ViewRegistry";
import { lazy } from "react";

import { ModuloEnConstruccion } from "@components/ui/statusStates";
import { Changepassword } from "../components/Changepassword";
import { DashboardFeature } from "../components/DashboardFeature";
import { FormularioExpediente } from "@/features/expedientes/components/formulario/FormularioExpediente";
import { ConsultaMedica } from "@/features/consultas/components/ConsultaMedica";
import { FormularioRegistroPreclinico } from "../../preclinica/components/FormularioRegistroPreclinico";
const ListaRegistrosPreclinicos = lazy(() => import("@/features/preclinica/components/ListaRegistrosPreclinicos").then(module => ({ default: module.ListaRegistrosPreclinicos })));
import { GestionUsuarios } from "@/pages/GestionUsuarios";
import { FormularioCreacionUsuario } from "@/features/admin/components/FormularioCreacionUsuario";
import { VerExpediente } from "@/pages/GestionPacientes";
import { BuscarPacienteAgendar } from "@/features/expedientes/components/busqueda/BuscarPacienteAgendar";
import { BuscarPacienteHoy } from "@/features/expedientes/components/busqueda/BuscarPacienteHoy";
import { AgendaCitas } from "../../trazabilidad/components/AgendaCitas";
import { FormularioCita } from "../../trazabilidad/components/FormularioCita";
import { ColaConsulta } from "../../trazabilidad/components/ColaConsultaMedica";
import { BuscarPacienteConsulta } from "@/features/expedientes/components/busqueda/BuscarPacienteConsulta";
import { BuscarPacienteGestion } from "@/features/expedientes/components/busqueda/BuscarPacienteGestion";
import { BuscarPacientePreclinica } from "@/features/expedientes/components/busqueda/BuscarPacientePreclinica";
import { ColaPreclinica } from "../../trazabilidad/components/ColaPreclinica";
import { TableroTrazabilidad } from "../../trazabilidad/components/TableroTrazabilidad";
const Auditoria = lazy(() => import("@/pages/Auditoria").then(m => ({ default: m.Auditoria })));
const GestionRoles = lazy(() => import("@/pages/GestionRoles").then(m => ({ default: m.GestionRoles })));
import { CatalogoExamenes } from "@/features/consultas/components/CatalogoExamenes";
import { CatalogoMedicamentos } from "@/features/consultas/components/CatalogoMedicamentos";
import { FormularioCrearExamen } from "@/features/consultas/components/FormulacioCrearExamen";
import { FormularioCrearMedicamento } from "@/features/consultas/components/FormularioCrearMedicamento";

export function registerDashboardViews() {
    viewRegistry.register("inicio", {
        path: "/",
        component: DashboardFeature,
        permissions: [],
        requiresPaciente: false,
        metadata: { title: "Inicio", icon: "home" }
    });

    viewRegistry.register("crear-expediente", {
        path: "/expediente/crear",
        component: FormularioExpediente,
        permissions: ["CREAR_EXPEDIENTE"],
        requiresPaciente: false,
        metadata: { title: "Crear Expediente" }
    });

    viewRegistry.register("editar-expediente", {
        path: "/expediente/editar",
        component: FormularioExpediente,
        parent: "gestion-pacientes",
        permissions: ["EDITAR_EXPEDIENTE"],
        requiresPaciente: true,
        metadata: { title: "Editar Expediente" }
    });

    viewRegistry.register("buscar-paciente", {
        path: "/buscar-paciente",
        component: BuscarPacienteGestion,
        permissions: ["BUSCAR_PACIENTE"],
        requiresPaciente: false,
        metadata: { title: "Buscar Paciente", modo: "gestion" }
    });

    viewRegistry.register("buscar-paciente-agendar", {
        path: "/buscar-paciente/agendar",
        component: BuscarPacienteAgendar,
        permissions: ["BUSCAR_PACIENTE"],
        requiresPaciente: false,
        metadata: { title: "Buscar Paciente (Agendar)", modo: "agendar" }
    });

    viewRegistry.register("buscar-paciente-hoy", {
        path: "/buscar-paciente/hoy",
        component: BuscarPacienteHoy,
        permissions: ["BUSCAR_PACIENTE"],
        requiresPaciente: false,
        metadata: { title: "Buscar Paciente (Hoy)", modo: "hoy" }
    });

    viewRegistry.register("buscar-paciente-consulta", {
        path: "/buscar-paciente/consulta",
        component: BuscarPacienteConsulta,
        permissions: ["CONSULTA_MEDICA"],
        requiresPaciente: false,
        metadata: { title: "Buscar Paciente para Consulta", modo: "consulta-medica" }
    });

    viewRegistry.register("buscar-paciente-preclinica", {
        path: "/buscar-paciente/preclinica",
        component: BuscarPacientePreclinica,
        permissions: ["PRECLINICA"],
        requiresPaciente: false,
        metadata: { title: "Buscar Paciente para Preclinica", modo: "preclinica" }
    });

    viewRegistry.register("gestion-roles", {
        path: "/gestion/roles",
        component: GestionRoles,
        permissions: ["GESTION_ROLES"],
        requiresPaciente: false,
        metadata: { title: "Gestión de Roles" }
    });

    viewRegistry.register("changepassword", {
        path: "/cambiar-contrasena",
        component: Changepassword,
        requiresPaciente: false,
        metadata: { title: "Cambiar Contraseña" }
    });

    viewRegistry.register("auditoria", {
        path: "/auditoria",
        component: Auditoria,
        permissions: ["AUDITORIA"],
        requiresPaciente: false,
        metadata: { title: "Auditoría" }
    });

    viewRegistry.register("cola-consulta", {
        path: "/consulta/cola",
        component: ColaConsulta,
        permissions: ["CONSULTA_MEDICA"],
        requiresPaciente: false,
        metadata: { title: "Cola de Espera de Consulta Médica" }
    });

    viewRegistry.register("consulta-medica", {
        path: "/consulta-medica",
        component: ConsultaMedica,
        parent: "cola-consulta",
        permissions: ["CONSULTA_MEDICA"],
        requiresPaciente: true,
        metadata: { title: "Consulta Médica" }
    });

    viewRegistry.register("cola-preclinica", {
        path: "/preclinica/cola",
        component: ColaPreclinica,
        permissions: ["PRECLINICA"],
        requiresPaciente: false,
        metadata: { title: "Cola de Espera de Preclinica" }
    });

    viewRegistry.register("preclinica", {
        path: "/registro/preclinica",
        component: FormularioRegistroPreclinico,
        parent: "preclinica",
        permissions: ["PRECLINICA"],
        requiresPaciente: true,
        metadata: { title: "Preclinica" }
    });

    viewRegistry.register("pacientes-evaluados", {
        path: "/pacientes/evaluados",
        component: ListaRegistrosPreclinicos,
        permissions: ["PRECLINICA"],
        requiresPaciente: true,
        metadata: { title: "Pacientes Evaluados" }
    });

    viewRegistry.register("gestion-usuarios", {
        path: "/gestion/usuarios",
        component: GestionUsuarios,
        permissions: ["GESTION_USUARIOS"],
        requiresPaciente: false,
        metadata: { title: "Gestion Usuarios" }
    });

    viewRegistry.register("crear-usuario", {
        path: "/crear/usuario",
        component: FormularioCreacionUsuario,
        parent: "gestion-usuarios",
        permissions: ["GESTION_USUARIOS"],
        requiresPaciente: false,
        metadata: { title: "Creación de Usuario" }
    });

    viewRegistry.register("editar-usuario", {
        path: "/editar/usuario",
        component: FormularioCreacionUsuario,
        parent: "gestion-usuarios",        
        permissions: ["GESTION_USUARIOS"],
        requiresPaciente: false,
        metadata: { title: "Creación de Usuario" }
    });

    viewRegistry.register("gestion-pacientes", {
        path: "/gestion/paciente",
        component: VerExpediente,
        permissions: ["GESTION_PACIENTES"],
        requiresPaciente: true,
        metadata: { title: "Ver Expediente" }
    });

    viewRegistry.register("agenda-citas", {
        path: "/agenda",
        component: AgendaCitas,
        permissions: ["CITAS"],
        requiresPaciente: false,
        metadata: { title: "Agenda de Citas" }
    });

    viewRegistry.register("formulario-agendar-cita", {
        path: "/cita/agendar",
        component: FormularioCita,
        parent: "agenda-citas",
        permissions: ["CITAS"],
        requiresPaciente: true,
        metadata: { title: "Programar Una Cita", modo: "agendar" }
    });

    viewRegistry.register("formulario-registro-hoy", {
        path: "/cita/hoy",
        component: FormularioCita,
        parent: "agenda-citas",
        permissions: ["CITAS"],
        requiresPaciente: true,
        metadata: { title: "Registro del Día", modo: "hoy" }
    });
    
    viewRegistry.register("tablero-trazabilidad", {
        path: "/trazabilidad/tablero",
        component: TableroTrazabilidad,
        permissions: [],
        requiresPaciente: false,
        metadata: { title: "Tablero de Control" }
    });

    viewRegistry.register("error", {
        component: ModuloEnConstruccion,
        permissions: [],
        requiresPaciente: false,
        metadata: { title: "Error" }
    });

    // --- RUTAS DE CATÁLOGOS Y GESTIÓN ---

    viewRegistry.register("catalogo-medicamentos", {
        path: "/gestion/medicamentos",
        component: CatalogoMedicamentos,
        permissions: ["CATALOGO_MEDICAMENTOS"],
        requiresPaciente: false,
        metadata: { title: "Catálogo de Medicamentos" }
    });

    viewRegistry.register("catalogo-examenes", {
        path: "/gestion/examenes",
        component: CatalogoExamenes,
        permissions: ["CATALOGO_EXAMENES"],
        requiresPaciente: false,
        metadata: { title: "Catálogo de Exámenes" }
    });

    viewRegistry.register("adjuntar-documentos", {
        path: "/paciente/adjuntos",
        component: ModuloEnConstruccion,
        parent: "gestion-pacientes",
        permissions: ["ADJUNTAR_DOCUMENTOS"],
        requiresPaciente: true,
        metadata: { title: "Adjuntar Documentación" }
    });

    viewRegistry.register("formulario-examen", {
        path: "/formulario/Examen",
        component: FormularioCrearExamen,
        permissions: ["CATALOGO_EXAMENES"],
        requiresPaciente: false,
        metadata: { title: "Gestión de Examen Clínico" }
    });

    viewRegistry.register("formulario-medicamento", {
        path: "/formulario/medicamento",
        component: FormularioCrearMedicamento,
        permissions: ["CATALOGO_MEDICAMENTOS"],
        requiresPaciente: false,
        metadata: { title: "Gestión de Medicamento" }
    });
}

export const getView = (viewId) => viewRegistry.getView(viewId);