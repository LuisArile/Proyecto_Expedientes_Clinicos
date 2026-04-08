import { useContext } from "react";
import { ConsultaContext } from "../context/ConsultaContext"

export function useConsultaContext() {
    const context = useContext(ConsultaContext);
    if (!context) {
        throw new Error(
            "useConsulta debe usarse dentro de ConsultaProvider"
        );
    }
    return context;
}