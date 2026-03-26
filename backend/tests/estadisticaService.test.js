const EstadisticaService = require("../src/services/estadisticaService");

describe("EstadisticaService", () => {
    let service;

    let prisma;
    let usuarioRepository;
    let auditoriaRepository;
    let pacienteRepository;
    let expedienteRepository;
    let consultaMedicaRepository;
    let registroPreclinicoRepository;
    let recetaMedicaRepository;

    beforeEach(() => {

        prisma = {};
        usuarioRepository = { obtenerTodos: jest.fn() };
        auditoriaRepository = {
            obtenerLogsDeHoy: jest.fn(),
            obtenerRecientes: jest.fn(),
            buscarActividad: jest.fn()
        };
        pacienteRepository = {};
        expedienteRepository = {
            contarCreadosHoy: jest.fn()
        };
        consultaMedicaRepository = {
            contarConsultasHoy: jest.fn(),
            obtenerRecientesPorMedico: jest.fn()
        };
        registroPreclinicoRepository = {
            contarTodos: jest.fn(),
            contarEvaluadosHoy: jest.fn(),
            obtenerRecientes: jest.fn()
        };
        recetaMedicaRepository = {
            contarRecetasHoy: jest.fn()
        };

        service = new EstadisticaService(
            prisma,
            usuarioRepository,
            auditoriaRepository,
            pacienteRepository,
            expedienteRepository,
            consultaMedicaRepository,
            registroPreclinicoRepository,
            recetaMedicaRepository
        );
    });

    describe("obtenerResumenGeneral", () => {

        test("debe ejecutar estrategia ADMINISTRADOR", async () => {

            usuarioRepository.obtenerTodos.mockResolvedValue([1, 2]);
            auditoriaRepository.obtenerLogsDeHoy.mockResolvedValue([1]);
            auditoriaRepository.obtenerRecientes.mockResolvedValue([]);

            const resultado = await service.obtenerResumenGeneral({
                idRol: 1
            });

            expect(resultado.tarjetas.length).toBeGreaterThan(0);
        });

        test("debe devolver vacío si rol no existe", async () => {

            const resultado = await service.obtenerResumenGeneral({
                idRol: 999
            });

            expect(resultado).toEqual({
                tarjetas: [],
                actividad: []
            });
        });
    });

    describe("RECEPCIONISTA", () => {

        test("debe retornar dashboard recepcionista", async () => {

            expedienteRepository.contarCreadosHoy.mockResolvedValue(5);
            auditoriaRepository.buscarActividad.mockResolvedValue([
                {
                    id: 1,
                    accion: "CREACIÓN DE EXPEDIENTE",
                    fecha: new Date(),
                    usuario: { nombre: "Ana", apellido: "Lopez" }
                }
            ]);

            const resultado = await service.obtenerRecepcionistaData({ id: 1 }, 1);

            expect(resultado.tarjetas).toHaveLength(3);
            expect(resultado.tarjetas[1].valor).toBe(5);
        });
    });

    describe("MEDICO", () => {

        test("debe retornar dashboard médico", async () => {

            consultaMedicaRepository.contarConsultasHoy.mockResolvedValue(10);
            consultaMedicaRepository.obtenerRecientesPorMedico.mockResolvedValue([
                {
                    id: 1,
                    tipoConsulta: "GENERAL",
                    fechaConsulta: new Date(),
                    expediente: {
                        paciente: { nombre: "Juan", apellido: "Perez" }
                    }
                }
            ]);
            recetaMedicaRepository.contarRecetasHoy.mockResolvedValue(3);

            const resultado = await service.obtenerMedicoData({ id: 1 }, 1);

            expect(resultado.tarjetas[0].valor).toBe(10);
            expect(resultado.tarjetas[3].valor).toBe(3);
        });
    });

    describe("ENFERMERO", () => {

        test("debe retornar dashboard enfermero", async () => {

            registroPreclinicoRepository.contarTodos.mockResolvedValue(20);
            registroPreclinicoRepository.contarEvaluadosHoy.mockResolvedValue(5);
            registroPreclinicoRepository.obtenerRecientes.mockResolvedValue([
                {
                    id: 1,
                    fechaRegistro: new Date(),
                    expediente: {
                        paciente: { nombre: "Luis", apellido: "Ramirez" }
                    }
                }
            ]);

            const resultado = await service.obtenerEnfermeroData({ id: 1 }, 1);

            expect(resultado.tarjetas[0].valor).toBe(20);
            expect(resultado.actividad.length).toBe(1);
        });
    });
});