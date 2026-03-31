import { lazy } from "react";
import { Changepassword } from "../components/Changepassword";
import { DashboardFeature } from "../components/DashboardFeature";
import { ModuloEnConstruccion } from "@components/ui/statusStates";
import { FormularioExpediente } from "@/features/expedientes/components/FormularioExpediente";
import { BuscarPaciente } from "@/features/expedientes/components/BuscarPaciente";
import { ConsultaMedica } from "@/features/consultas/components/ConsultaMedica";
import { FormularioRegistroPreclinico } from "@/features/preclinica/components/FormularioRegistroPreclinico";
import { GestionUsuarios } from "@/features/pages/GestionUsuarios";
import { FormularioCreacionUsuario } from "@/features/admin/components/FormularioCreacionUsuario";
import { VerExpediente } from "@/features/pages/GestionPacientes";
const Auditoria = lazy(() => import("@/features/admin/components/Auditoria").then(module => ({ default: module.Auditoria })));
const GestionRoles = lazy(() => import("@/features/admin/components/GestionRoles").then(module => ({ default: module.GestionRoles })));
const ListaRegistrosPreclinicos = lazy(() => import("@/features/preclinica/components/ListaRegistrosPreclinicos").then(module => ({ default: module.ListaRegistrosPreclinicos })));

export const VIEW_COMPONENTS = {
    "inicio": { component: DashboardFeature },
    "crear-expediente": { component: FormularioExpediente },
    "buscar-paciente": { component: BuscarPaciente },
    "gestion-roles": { component: GestionRoles },
    "changepassword": { component: Changepassword },
    "auditoria": { component: Auditoria },
    "preclinica": { component: FormularioRegistroPreclinico },
    "pacientes-evaluados": { component: ListaRegistrosPreclinicos },
    "consulta-medica": { component: ConsultaMedica },
    "gestion-usuarios": { component: GestionUsuarios},
    "formulario-usuario": { component: FormularioCreacionUsuario },
    // "ver-expediente": { component: VerExpediente },
    "gestion-pacientes": { component: VerExpediente },
    "error": { component: ModuloEnConstruccion }
};

export const getView = (viewId) => VIEW_COMPONENTS[viewId] || VIEW_COMPONENTS["error"];