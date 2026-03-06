const AuditoriaService = require("../src/services/auditoriaService");

describe("AuditoriaService", () => {

    let service;
    let mockRepository;

    beforeEach(() => {

        mockRepository = {
            crear: jest.fn()
        };

        service = new AuditoriaService(mockRepository);

    });

    test("registrar debe crear registro de auditoría", async () => {

        const registroMock = { id: 1 };

        mockRepository.crear.mockResolvedValue(registroMock);

        const resultado = await service.registrar(1, "INICIO_SESION", "detalle prueba");

        expect(mockRepository.crear).toHaveBeenCalledWith({
            usuarioId: 1,
            accion: "INICIO_SESION",
            detalles: "detalle prueba"
        });

        expect(resultado).toEqual(registroMock);

    });

    test("registrar debe retornar null si no hay usuarioId", async () => {

        const resultado = await service.registrar(null, "ACCION");

        expect(resultado).toBeNull();
        expect(mockRepository.crear).not.toHaveBeenCalled();

    });

    test("registrar debe manejar errores del repository", async () => {

        mockRepository.crear.mockRejectedValue(new Error("DB error"));

        const resultado = await service.registrar(1, "ACCION");

        expect(resultado).toBeNull();

    });

    test("registrarSesion debe construir mensaje correcto", async () => {

        mockRepository.crear.mockResolvedValue({});

        await service.registrarSesion(1, "INICIO_SESION", "admin");

        expect(mockRepository.crear).toHaveBeenCalledWith({
            usuarioId: 1,
            accion: "INICIO_SESION",
            detalles: "Usuario admin inició sesión"
        });

    });

    test("registrarExpediente debe registrar acción de expediente", async () => {

        mockRepository.crear.mockResolvedValue({});

        await service.registrarExpediente(1, "Creacion", 10);

        expect(mockRepository.crear).toHaveBeenCalledWith({
            usuarioId: 1,
            accion: "Creacion de expediente",
            detalles: "creacion de expediente 10"
        });

    });

    test("registrarUsuario debe registrar acción de usuario", async () => {

        mockRepository.crear.mockResolvedValue({});

        await service.registrarUsuario(1, "Actualizacion", 5);

        expect(mockRepository.crear).toHaveBeenCalledWith({
            usuarioId: 1,
            accion: "Actualizacion de usuario",
            detalles: "actualizacion de usuario 5"
        });

    });

    test("registrarEntidad debe registrar acción genérica", async () => {

        mockRepository.crear.mockResolvedValue({});

        await service.registrarEntidad(1, "Paciente", "Eliminacion", 20);

        expect(mockRepository.crear).toHaveBeenCalledWith({
            usuarioId: 1,
            accion: "Eliminacion de Paciente",
            detalles: "eliminacion de paciente 20"
        });

    });

});