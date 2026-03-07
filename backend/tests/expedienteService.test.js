const expedienteService = require("../src/services/expedienteService");

describe("expedienteService", () => {

    let service;
    let mockExpedienteRepo;
    let mockPacienteRepo;
    let mockAuditoriaService;

    beforeEach(() => {

        mockExpedienteRepo = {
            obtenerPorNumero: jest.fn(),
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerPorPaciente: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        mockPacienteRepo = {
            obtenerPorDni: jest.fn(),
            obtenerPorId: jest.fn(),
            crear: jest.fn()
        };

        mockAuditoriaService = {
            registrarExpediente: jest.fn()
        };

        service = new expedienteService(
            mockExpedienteRepo,
            mockPacienteRepo,
            mockAuditoriaService
        );

    });

    test("debe crear paciente y expediente correctamente", async () => {

        const paciente = { dni: "123", nombre: "Juan" };
        const expediente = { numeroExpediente: "EXP001" };

        mockPacienteRepo.obtenerPorDni.mockResolvedValue(null);
        mockExpedienteRepo.obtenerPorNumero.mockResolvedValue(null);

        mockPacienteRepo.crear.mockResolvedValue({ idPaciente: 1, ...paciente });
        mockExpedienteRepo.crear.mockResolvedValue({ idExpediente: 10 });

        const resultado = await service.crearConPaciente(paciente, expediente, 1);

        expect(mockPacienteRepo.crear).toHaveBeenCalled();
        expect(mockExpedienteRepo.crear).toHaveBeenCalled();

        expect(mockAuditoriaService.registrarExpediente)
            .toHaveBeenCalledWith(1, "Creacion", 10);

        expect(resultado).toHaveProperty("paciente");
        expect(resultado).toHaveProperty("expediente");

    });

    test("debe lanzar error si el DNI ya existe", async () => {

        mockPacienteRepo.obtenerPorDni.mockResolvedValue({ idPaciente: 1 });

        await expect(
            service.crearConPaciente({ dni: "123" }, {}, 1)
        ).rejects.toThrow("El paciente con DNI 123 ya existe");

    });

    test("debe lanzar error si el número de expediente existe", async () => {

        mockPacienteRepo.obtenerPorDni.mockResolvedValue(null);
        mockExpedienteRepo.obtenerPorNumero.mockResolvedValue({ idExpediente: 1 });

        await expect(
            service.crearConPaciente({ dni: "123" }, { numeroExpediente: "EXP001" }, 1)
        ).rejects.toThrow("El número de expediente EXP001 ya existe");

    });

    test("obtenerTodos debe retornar expedientes", async () => {

        const expedientes = [{ id: 1 }, { id: 2 }];

        mockExpedienteRepo.obtenerTodos.mockResolvedValue(expedientes);

        const resultado = await service.obtenerTodos();

        expect(resultado).toEqual(expedientes);

    });

    test("obtenerPorId debe lanzar error si no existe", async () => {

        mockExpedienteRepo.obtenerPorId.mockResolvedValue(null);

        await expect(
            service.obtenerPorId(5)
        ).rejects.toThrow("El expediente con ID 5 no existe");

    });

    test("obtenerPorPaciente debe lanzar error si paciente no existe", async () => {

        mockPacienteRepo.obtenerPorId.mockResolvedValue(null);

        await expect(
            service.obtenerPorPaciente(2)
        ).rejects.toThrow("El paciente con ID 2 no existe");

    });

    test("actualizar debe actualizar expediente", async () => {

        mockExpedienteRepo.obtenerPorId.mockResolvedValue({ idExpediente: 1 });

        mockExpedienteRepo.actualizar.mockResolvedValue({ estado: "Activo" });

        const resultado = await service.actualizar(1, { estado: "Activo" });

        expect(mockExpedienteRepo.actualizar)
            .toHaveBeenCalledWith(1, { estado: "Activo" });

        expect(resultado.estado).toBe("Activo");

    });

    test("eliminar debe eliminar expediente", async () => {

        mockExpedienteRepo.obtenerPorId.mockResolvedValue({ idExpediente: 1 });

        mockExpedienteRepo.eliminar.mockResolvedValue(true);

        const resultado = await service.eliminar(1);

        expect(mockExpedienteRepo.eliminar).toHaveBeenCalledWith(1);
        expect(resultado).toBe(true);

    });

});