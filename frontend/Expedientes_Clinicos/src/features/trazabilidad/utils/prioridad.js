export const PRIORIDAD_CONFIG = {
    normal: { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" },
    media: { label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    alta: { label: "Alta", color: "bg-orange-100 text-orange-800 border-orange-300" },
    urgente: { label: "Urgente", color: "bg-red-100 text-red-800 border-red-300" },
};

export const getPrioridadConfig = (prioridad) => PRIORIDAD_CONFIG[prioridad] || PRIORIDAD_CONFIG.normal;