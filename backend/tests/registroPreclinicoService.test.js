const RegistroPreclinicoService = require("../src/services/registroPreclinicoService");

describe("RegistroPreclinicoService", () => {

    let service;
    let repository;
    let expedienteRepository;
    let auditoriaService;

    beforeEach(() => {

        repository = {
            crear: jest.fn(),
            obtenerPorExpediente: jest.fn(),
            obtenerUltimoPorExpediente: jest.fn(),
            obtenerTodos: jest.fn(),
            contarTodos: jest.fn()
        };

        expedienteRepository = {
            obtenerPorId: jest.fn()
        };

        auditoriaService = {
            registrarAccionMedica: jest.fn().mockResolvedValue(true)
        };

        service = new RegistroPreclinicoService(
            repository,
            expedienteRepository,
            auditoriaService
        );
    });

    describe("registrar", () => {

        test("debe registrar correctamente", async () => {

            expedienteRepository.obtenerPorId.mockResolvedValue({ id: 1 });
            repository.crear.mockResolvedValue({ id: 10 });

            const datos = { temperatura: 36.5 };

            const resultado = await service.registrar(1, 2, datos);

            expect(repository.crear).toHaveBeenCalled();
            expect(auditoriaService.registrarAccionMedica).toHaveBeenCalled();
            expect(resultado).toEqual({ id: 10 });
        });

        test("debe lanzar error si expediente no existe", async () => {

            expedienteRepository.obtenerPorId.mockResolvedValue(null);

            await expect(
                service.registrar(1, 2, {})
            ).rejects.toThrow("Expediente no encontrado");
        });

        test("debe capturar error interno", async () => {

            expedienteRepository.obtenerPorId.mockResolvedValue({ id: 1 });
            repository.crear.mockRejectedValue(new Error("DB error"));

            await expect(
                service.registrar(1, 2, {})
            ).rejects.toThrow("Error al registrar: DB error");
        });
    });

    describe("consultas", () => {

        test("obtenerPorExpediente", async () => {

            repository.obtenerPorExpediente.mockResolvedValue([1]);

            const res = await service.obtenerPorExpediente(1);

            expect(res).toEqual([1]);
        });

        test("obtenerUltimoPorExpediente", async () => {

            repository.obtenerUltimoPorExpediente.mockResolvedValue({ id: 1 });

            const res = await service.obtenerUltimoPorExpediente(1);

            expect(res.id).toBe(1);
        });

        test("obtenerTodos", async () => {

            repository.obtenerTodos.mockResolvedValue([1, 2]);

            const res = await service.obtenerTodos();

            expect(res).toHaveLength(2);
        });

        test("contarTodos", async () => {

            repository.contarTodos.mockResolvedValue(5);

            const res = await service.contarTodos();

            expect(res).toBe(5);
        });
    });
});