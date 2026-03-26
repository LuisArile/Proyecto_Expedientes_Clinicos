class BusquedaService {
    constructor(busquedaRepository, auditoriaService) {
        if (!busquedaRepository || typeof busquedaRepository.buscarPacientesYExpedientes !== 'function') {
            console.error("Error: busquedaRepository no tiene los métodos necesarios");
        }

        this.busquedaRepository = busquedaRepository;
        this.auditoriaService = auditoriaService;
    }

    async buscarPacientes(filtroDto, usuarioId = null) {
        const { termino, criterio, pagina, limite } = filtroDto;

        const skip = (pagina - 1) * limite;

        if (usuarioId) {
            try {
                await this.auditoriaService.registrarBusqueda(usuarioId, termino);
            } catch (err) {
                console.error("Error auditoría:", err);
            }
        }

        const [resultados, total] = await Promise.all([
            this.busquedaRepository.buscarPacientesYExpedientes(termino, criterio, limite, skip),
            this.busquedaRepository.contarResultados(termino, criterio)
        ]);

        return {
            resultados,
            paginacion: {
                total,
                paginaActual: pagina,
                totalPaginas: Math.ceil(total / limite)
            }
        };
    }
}

module.exports = BusquedaService;