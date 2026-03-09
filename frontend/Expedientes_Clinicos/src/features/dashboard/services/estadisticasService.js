const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const dashboardService = {
    /**
     * Obtiene los datos del resumen ejecutivo (estadísticas y actividad)
     * @returns {Promise<Object>} Datos formateados para el Dashboard
     */
    obtenerResumen: async () => {
        try {
            const token = localStorage.getItem('token');
            
            const respuesta = await fetch(`${API_URL}/estadisticas/resumen`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const resultado = await respuesta.json();

            if (!resultado.success) {
                throw new Error(resultado.error || 'Error al cargar el dashboard');
            }

            return resultado.data;
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