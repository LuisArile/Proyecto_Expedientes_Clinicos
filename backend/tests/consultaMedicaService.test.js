const ConsultaMedicaService = require("../src/services/consultaMedicaService");

jest.mock("../src/config/prisma", () => ({
    $transaction: jest.fn((callback) => callback({}))
}));

describe("ConsultaMedicaService", () => {

    let service;
    let mockConsultaRepository;
    let mockRecetaRepository;
    let mockExpedienteRepository;
    let mockAuditoriaService;

    beforeEach(() => {

        mockConsultaRepository = {
            crear: jest.fn(),
            obtenerPorExpediente: jest.fn(),
            obtenerPorId: jest.fn()
        };

        mockRecetaRepository = {
            crearMultiples: jest.fn()
        };

        mockExpedienteRepository = {
            obtenerPorId: jest.fn()
        };

        mockAuditoriaService = {
            registrarAccionMedica: jest.fn()
        };

        service = new ConsultaMedicaService(
            mockConsultaRepository,
            mockRecetaRepository,
            mockExpedienteRepository,
            mockAuditoriaService
        );

    });

    describe("validarDiagnostico", () => {

        test("debe retornar error si el diagnóstico es null", () => {
            const errores = service.validarDiagnostico(null);
            expect(errores).toContain('El diagnóstico es obligatorio');
        });

        test("debe retornar errores si faltan campos requeridos", () => {
            const diagnostico = {};
            const errores = service.validarDiagnostico(diagnostico);

            expect(errores).toContain('El ID del diagnóstico es requerido');
            expect(errores).toContain('La descripción es requerida');
            expect(errores).toContain('El tipo (PRESUNTIVO/DEFINITIVO) es requerido');
        });

        test("debe retornar array vacío si el diagnóstico es válido", () => {
            const diagnostico = {
                id: "G43.9",
                descripcion: "Migraña",
                tipo: "PRESUNTIVO"
            };

            const errores = service.validarDiagnostico(diagnostico);
            expect(errores).toHaveLength(0);
        });

    });

    describe("validarRecetas", () => {

        test("debe retornar error si no hay recetas", () => {
            const errores = service.validarRecetas([]);
            expect(errores).toContain('Debe incluir al menos una receta');
        });

        test("debe retornar errores si faltan campos en recetas", () => {
            const recetas = [{ medicamento: "Amoxicilina" }];
            const errores = service.validarRecetas(recetas);

            expect(errores).toContain('Receta 1: dosis requerida');
        });

        test("debe retornar array vacío si las recetas son válidas", () => {
            const recetas = [{
                medicamento: "Amoxicilina",
                dosis: "500mg"
            }];

            const errores = service.validarRecetas(recetas);
            expect(errores).toHaveLength(0);
        });

    });

    describe("registrar", () => {

        const expedienteMock = { idExpediente: 1 };
        const consultaMock = { id: 1, expedienteId: 1 };

        beforeEach(() => {
            mockExpedienteRepository.obtenerPorId.mockResolvedValue(expedienteMock);
            mockConsultaRepository.crear.mockResolvedValue(consultaMock);
        });

        test("debe registrar consulta presuntiva correctamente", async () => {

            const datos = {
                motivo: "Dolor de cabeza",
                diagnostico: {
                    id: "G43.9",
                    descripcion: "Migraña",
                    tipo: "PRESUNTIVO"
                }
            };

            const resultado = await service.registrar(1, 2, datos);

            expect(mockExpedienteRepository.obtenerPorId).toHaveBeenCalledWith(1);

            expect(mockConsultaRepository.crear).toHaveBeenCalledWith(
                expect.objectContaining({
                    expedienteId: 1,
                    medicoId: 2,
                    tipoConsulta: "PRESUNTIVO"
                }),
                expect.any(Object)
            );

            expect(mockRecetaRepository.crearMultiples).not.toHaveBeenCalled();

            expect(mockAuditoriaService.registrarAccionMedica).toHaveBeenCalledWith(
                2,
                'CONSULTA_MEDICA',
                'Consulta para expediente 1',
                expect.any(Object)
            );

            expect(resultado).toEqual(consultaMock);
        });

        test("debe registrar consulta definitiva con recetas", async () => {

            const datos = {
                motivo: "Infección",
                diagnostico: {
                    id: "J06.9",
                    descripcion: "Infección respiratoria",
                    tipo: "DEFINITIVO"
                },
                recetas: [{
                    medicamento: "Amoxicilina",
                    dosis: "500mg"
                }]
            };

            const resultado = await service.registrar(1, 2, datos);

            expect(mockRecetaRepository.crearMultiples).toHaveBeenCalled();
            expect(resultado).toEqual(consultaMock);
        });

        test("debe lanzar error si el expediente no existe", async () => {

            mockExpedienteRepository.obtenerPorId.mockResolvedValue(null);

            const datos = {
                motivo: "Dolor",
                diagnostico: {
                    id: "R10",
                    descripcion: "Dolor abdominal",
                    tipo: "PRESUNTIVO"
                }
            };

            await expect(
                service.registrar(999, 2, datos)
            ).rejects.toThrow("Expediente no encontrado");
        });

        test("debe lanzar error si el diagnóstico es inválido", async () => {

            const datos = {
                motivo: "Dolor",
                diagnostico: {}
            };

            await expect(
                service.registrar(1, 2, datos)
            ).rejects.toThrow();
        });

        test("debe lanzar error si es definitivo sin recetas", async () => {

            const datos = {
                motivo: "Infección",
                diagnostico: {
                    id: "J06.9",
                    descripcion: "Infección",
                    tipo: "DEFINITIVO"
                }
            };

            await expect(
                service.registrar(1, 2, datos)
            ).rejects.toThrow("Debe incluir al menos una receta");
        });

        test("debe manejar errores del repository", async () => {

            mockConsultaRepository.crear.mockRejectedValue(new Error("Error de BD"));

            const datos = {
                motivo: "Dolor",
                diagnostico: {
                    id: "G43.9",
                    descripcion: "Migraña",
                    tipo: "PRESUNTIVO"
                }
            };

            await expect(
                service.registrar(1, 2, datos)
            ).rejects.toThrow("Error: Error de BD");
        });

    });

    describe("obtenerPorExpediente", () => {

        test("debe retornar consultas de un expediente", async () => {

            const consultasMock = [
                { id: 1, motivo: "Dolor" },
                { id: 2, motivo: "Fiebre" }
            ];

            mockConsultaRepository.obtenerPorExpediente.mockResolvedValue(consultasMock);

            const resultado = await service.obtenerPorExpediente(1);

            expect(mockConsultaRepository.obtenerPorExpediente).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(consultasMock);
        });

        test("debe manejar errores", async () => {

            mockConsultaRepository.obtenerPorExpediente.mockRejectedValue(new Error("Error"));

            await expect(
                service.obtenerPorExpediente(1)
            ).rejects.toThrow("Error al obtener consultas");
        });

    });

    describe("obtenerPorId", () => {

        test("debe retornar una consulta por ID", async () => {

            const consultaMock = { id: 1, motivo: "Dolor" };

            mockConsultaRepository.obtenerPorId.mockResolvedValue(consultaMock);

            const resultado = await service.obtenerPorId(1);

            expect(mockConsultaRepository.obtenerPorId).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(consultaMock);
        });

        test("debe lanzar error si la consulta no existe", async () => {

            mockConsultaRepository.obtenerPorId.mockResolvedValue(null);

            await expect(
                service.obtenerPorId(999)
            ).rejects.toThrow("Consulta no encontrada");
        });

        test("debe manejar errores", async () => {

            mockConsultaRepository.obtenerPorId.mockRejectedValue(new Error("Error"));

            await expect(
                service.obtenerPorId(1)
            ).rejects.toThrow("Error: Error");
        });

    });

});