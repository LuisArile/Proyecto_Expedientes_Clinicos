import { lazy } from "react";
import { Changepassword } from "../components/Changepassword";
import { DashboardFeature } from "../components/DashboardFeature";
import { ModuloEnConstruccion } from "../../../components/ui/statusStates";
import { FormularioExpediente } from "../../expedientes/components/FormularioExpediente";
import { BuscarPaciente } from "../../expedientes/components/BuscarPaciente";
import { ConsultaMedica } from "../../consultas/components/ConsultaMedica";
import { FormularioRegistroPreclinico } from "../../preclinica/components/FormularioRegistroPreclinico";
import { GestionUsuarios } from "../../../pages/GestionUsuarios";
import { FormularioCreacionUsuario } from "../../admin/components/FormularioCreacionUsuario";
const Auditoria = lazy(() => import("../../admin/components/Auditoria").then(module => ({ default: module.Auditoria })));
const GestionRoles = lazy(() => import("../../admin/components/GestionRoles").then(module => ({ default: module.GestionRoles })));
const ListaRegistrosPreclinicos = lazy(() => import("../../preclinica/components/ListaRegistrosPreclinicos").then(module => ({ default: module.ListaRegistrosPreclinicos })));

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
    "error": { component: ModuloEnConstruccion }
};

export const getView = (viewId) => VIEW_COMPONENTS[viewId] || VIEW_COMPONENTS["error"];