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
            registrarBusqueda: jest.fn()
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

            const mockResultados = [{ id: 1, nombre: "Juan" }];

            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue(mockResultados);
            busquedaRepo.contarResultados.mockResolvedValue(1);

            auditoriaService.registrarBusqueda.mockResolvedValue(true);

            const resultado = await service.buscarPacientes(filtroDto, usuarioId);

            expect(busquedaRepo.buscarPacientesYExpedientes)
                .toHaveBeenCalledWith("Juan", "nombre", 10, 0);

            expect(busquedaRepo.contarResultados)
                .toHaveBeenCalledWith("Juan", "nombre");

            expect(auditoriaService.registrarBusqueda)
                .toHaveBeenCalledWith(1, "Juan");

            expect(resultado).toEqual({
                resultados: mockResultados,
                paginacion: {
                    total: 1,
                    paginaActual: 1,
                    totalPaginas: 1
                }
            });
        });

        test("debe calcular correctamente el skip en paginación", async () => {

            const filtroDto = {
                termino: "Maria",
                criterio: "nombre",
                pagina: 3,
                limite: 5
            };

            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue([]);
            busquedaRepo.contarResultados.mockResolvedValue(0);

            await service.buscarPacientes(filtroDto, 1);

            expect(busquedaRepo.buscarPacientesYExpedientes)
                .toHaveBeenCalledWith("Maria", "nombre", 5, 10);
        });

        test("debe calcular correctamente totalPaginas", async () => {

            const filtroDto = {
                termino: "test",
                criterio: "nombre",
                pagina: 1,
                limite: 10
            };

            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue([]);
            busquedaRepo.contarResultados.mockResolvedValue(25);

            const resultado = await service.buscarPacientes(filtroDto, 1);

            expect(resultado.paginacion.totalPaginas).toBe(3);
        });

        test("debe funcionar sin usuarioId (sin auditoría)", async () => {

            const filtroDto = {
                termino: "123",
                criterio: "identidad",
                pagina: 1,
                limite: 10
            };

            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue([]);
            busquedaRepo.contarResultados.mockResolvedValue(0);

            await service.buscarPacientes(filtroDto, null);

            expect(auditoriaService.registrarBusqueda).not.toHaveBeenCalled();
        });

        test("no debe fallar si auditoría lanza error", async () => {

            const filtroDto = {
                termino: "error",
                criterio: "nombre",
                pagina: 1,
                limite: 10
            };

            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue([]);
            busquedaRepo.contarResultados.mockResolvedValue(0);

            auditoriaService.registrarBusqueda.mockRejectedValue(
                new Error("fallo auditoria")
            );

            const resultado = await service.buscarPacientes(filtroDto, 1);

            expect(resultado).toHaveProperty("resultados");
            expect(resultado).toHaveProperty("paginacion");
        });

        test("debe manejar múltiples resultados correctamente", async () => {

            const filtroDto = {
                termino: "multi",
                criterio: "nombre",
                pagina: 2,
                limite: 2
            };

            const mockResultados = [{ id: 1 }, { id: 2 }];

            busquedaRepo.buscarPacientesYExpedientes.mockResolvedValue(mockResultados);
            busquedaRepo.contarResultados.mockResolvedValue(5);

            const resultado = await service.buscarPacientes(filtroDto, 1);

            expect(resultado.resultados).toHaveLength(2);
            expect(resultado.paginacion.total).toBe(5);
            expect(resultado.paginacion.paginaActual).toBe(2);
            expect(resultado.paginacion.totalPaginas).toBe(3);
        });

    });
});