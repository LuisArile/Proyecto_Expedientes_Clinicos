import { estadisticasAPI } from "@/services/api";

const dashboardService = {
    /**
     * Obtiene los datos del resumen ejecutivo (estadísticas y actividad)
     * @returns {Promise<Object>} Datos formateados para el Dashboard
     */
    obtenerResumen: async () => {
        try {
            const resultado = await estadisticasAPI.obtenerResumen();
            return resultado.success ? resultado.data : resultado;
        } catch (error) {
            console.error("Error en dashboardService:", error);
            throw error;
        }
    },

    formatearFecha: (fechaISO) => {
        const opciones = { hour: '2-digit', minute: '2-digit' };
        return new Date(fechaISO).toLocaleTimeString(undefined, opciones);
    }
};

export default dashboardService;