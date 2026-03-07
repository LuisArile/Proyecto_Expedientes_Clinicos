const expedienteService = require("../src/services/expedienteService");

describe("expedienteService", () => {

    let service;
    let mockExpedienteRepository;
    let mockPacienteRepository;
    let mockAuditoriaService;
    let mockPrisma;

    beforeEach(() => {

        mockExpedienteRepository = {
            obtenerPorNumero: jest.fn(),
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerPorPaciente: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        mockPacienteRepository = {
            obtenerPorDni: jest.fn(),
            crear: jest.fn(),
            obtenerPorId: jest.fn(),
            buscarPaciente: jest.fn(),
            contarBusqueda: jest.fn()
        };

        mockAuditoriaService = {
            registrarExpediente: jest.fn()
        };

        mockPrisma = {
            $transaction: jest.fn((callback) =>
                callback({
                    expediente: {
                        count: jest.fn().mockResolvedValue(1)
                    }
                })
            )
        };

        service = new expedienteService(
            mockExpedienteRepository,
            mockPacienteRepository,
            mockAuditoriaService,
            mockPrisma
        );
    });

    test("debe crear paciente y expediente correctamente", async () => {

        mockPacienteRepository.obtenerPorDni.mockResolvedValue(null);

        mockPacienteRepository.crear.mockResolvedValue({
            idPaciente: 1,
            dni: "0801"
        });

        mockExpedienteRepository.crear.mockResolvedValue({
            idExpediente: 10
        });

        const resultado = await service.crearConPaciente(
            { dni: "0801" },
            {},
            5
        );

        expect(resultado.paciente.idPaciente).toBe(1);
        expect(resultado.expediente.idExpediente).toBe(10);
    });

});