const BusquedaService = require("../src/services/busquedaService");

describe("BusquedaService", () => {
    let service;
    let busquedaRepo;
    let auditoriaService;

    beforeEach(() => {
        busquedaRepo = {
            buscarPacientesYExpedientes: jest.fn(),
            contarResultados: jest.fn()
        };

        auditoriaService = {
            registrarBusqueda: jest.fn().mockResolvedValue(true)
        };

        service = new BusquedaService(busquedaRepo, auditoriaService);
    });

    describe("buscarPacientes", () => {
        test("debe retornar resultados paginados y registrar auditoría", async () => {
            const filtroDto = {
                termino: "Juan",
                criterio: "nombre",
                pagina: 1,
                limite: 10
            };
            const usuarioId = 1;

            const mockResultados = [{ id: 1, nombre: "Juan", expedientes: [] }];
            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue(mockResultados);
            busquedaRepo.contarResultados.mockResolvedValue(1);

            const resultado = await service.buscarPacientes(filtroDto, usuarioId);

            expect(busquedaRepo.buscarPacientesYExpedientes).toHaveBeenCalledWith("Juan", "nombre", 10, 0);
            expect(auditoriaService.registrarBusqueda).toHaveBeenCalledWith(usuarioId, "Juan");
            expect(resultado.resultados).toHaveLength(1);
            expect(resultado.paginacion.totalPaginas).toBe(1);
        });

        test("debe funcionar correctamente sin usuarioId (sin auditoría)", async () => {
            const filtroDto = { termino: "123", criterio: "identidad", pagina: 1, limite: 10 };
            
            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue([]);
            busquedaRepo.contarResultados.mockResolvedValue(0);

            await service.buscarPacientes(filtroDto, null);

            expect(auditoriaService.registrarBusqueda).not.toHaveBeenCalled();
        });
    });
});