const RegistroPreclinicoService = require("../src/services/registroPreclinicoService");

describe("RegistroPreclinicoService", () => {

    let service;
    let mockRepository;
    let mockExpedienteRepository;
    let mockAuditoriaService;

    beforeEach(() => {

        mockRepository = {
            crear: jest.fn(),
            obtenerPorExpediente: jest.fn(),
            obtenerUltimoPorExpediente: jest.fn(),
            obtenerTodos: jest.fn(),
            contarTodos: jest.fn()
        };

        mockExpedienteRepository = {
            obtenerPorId: jest.fn()
        };

        mockAuditoriaService = {
            registrar: jest.fn()
        };

        service = new RegistroPreclinicoService(
            mockRepository,
            mockExpedienteRepository,
            mockAuditoriaService
        );

    });

    describe("registrar", () => {

        test("debe registrar signos vitales correctamente", async () => {

            const expedienteMock = { idExpediente: 1, paciente: {} };
            const registroMock = { id: 1, expedienteId: 1, presionArterial: "120/80" };

            mockExpedienteRepository.obtenerPorId.mockResolvedValue(expedienteMock);
            mockRepository.crear.mockResolvedValue(registroMock);

            const resultado = await service.registrar(1, 2, {
                presionArterial: "120/80",
                temperatura: 36.5
            });

            expect(mockExpedienteRepository.obtenerPorId).toHaveBeenCalledWith(1);
            expect(mockRepository.crear).toHaveBeenCalledWith({
                expedienteId: 1,
                enfermeroId: 2,
                presionArterial: "120/80",
                temperatura: 36.5
            });
            expect(resultado).toEqual(registroMock);

        });

        test("debe lanzar error si el expediente no existe", async () => {

            mockExpedienteRepository.obtenerPorId.mockResolvedValue(null);

            await expect(
                service.registrar(999, 2, { presionArterial: "120/80" })
            ).rejects.toThrow("Expediente no encontrado");

            expect(mockRepository.crear).not.toHaveBeenCalled();

        });

        test("debe manejar errores del repository", async () => {

            mockExpedienteRepository.obtenerPorId.mockResolvedValue({ idExpediente: 1 });
            mockRepository.crear.mockRejectedValue(new Error("Error de BD"));

            await expect(
                service.registrar(1, 2, { presionArterial: "120/80" })
            ).rejects.toThrow("Error al registrar: Error de BD");

        });

    });

    describe("obtenerPorExpediente", () => {

        test("debe retornar registros de un expediente", async () => {

            const registrosMock = [
                { id: 1, presionArterial: "120/80" },
                { id: 2, presionArterial: "125/85" }
            ];

            mockRepository.obtenerPorExpediente.mockResolvedValue(registrosMock);

            const resultado = await service.obtenerPorExpediente(1);

            expect(mockRepository.obtenerPorExpediente).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(registrosMock);

        });

        test("debe manejar errores", async () => {

            mockRepository.obtenerPorExpediente.mockRejectedValue(new Error("Error"));

            await expect(
                service.obtenerPorExpediente(1)
            ).rejects.toThrow("Error al obtener registros");

        });

    });

    describe("obtenerUltimoPorExpediente", () => {

        test("debe retornar el último registro", async () => {

            const registroMock = { id: 3, presionArterial: "130/90" };

            mockRepository.obtenerUltimoPorExpediente.mockResolvedValue(registroMock);

            const resultado = await service.obtenerUltimoPorExpediente(1);

            expect(mockRepository.obtenerUltimoPorExpediente).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(registroMock);

        });

        test("debe manejar errores", async () => {

            mockRepository.obtenerUltimoPorExpediente.mockRejectedValue(new Error("Error"));

            await expect(
                service.obtenerUltimoPorExpediente(1)
            ).rejects.toThrow("Error al obtener último registro");

        });

    });

    describe("obtenerTodos", () => {

        test("debe retornar todos los registros", async () => {

            const registrosMock = [
                { id: 1, presionArterial: "120/80" },
                { id: 2, presionArterial: "125/85" }
            ];

            mockRepository.obtenerTodos.mockResolvedValue(registrosMock);

            const resultado = await service.obtenerTodos();

            expect(mockRepository.obtenerTodos).toHaveBeenCalled();
            expect(resultado).toEqual(registrosMock);

        });

        test("debe manejar errores", async () => {

            mockRepository.obtenerTodos.mockRejectedValue(new Error("Error"));

            await expect(
                service.obtenerTodos()
            ).rejects.toThrow("Error al obtener todos los registros");

        });

    });

    describe("contarTodos", () => {

        test("debe retornar el total de registros", async () => {

            mockRepository.contarTodos.mockResolvedValue(42);

            const resultado = await service.contarTodos();

            expect(mockRepository.contarTodos).toHaveBeenCalled();
            expect(resultado).toBe(42);

        });

        test("debe manejar errores", async () => {

            mockRepository.contarTodos.mockRejectedValue(new Error("Error"));

            await expect(
                service.contarTodos()
            ).rejects.toThrow("Error al contar registros");

        });

    });

});