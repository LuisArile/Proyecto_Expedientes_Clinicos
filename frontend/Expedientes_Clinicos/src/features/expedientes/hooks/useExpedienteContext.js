import { useContext } from "react";
import { ExpedienteContext } from "../context/ExpedienteContext";

export function useExpedienteContext() {
    const context = useContext(ExpedienteContext);
    if (!context) {
        throw new Error("useExpediente debe usarse dentro de ExpedienteProvider");
    }
    return context;
}