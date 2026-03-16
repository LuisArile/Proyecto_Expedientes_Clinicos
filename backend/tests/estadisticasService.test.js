const EstadisticasService = require("../src/services/estadisticasService");

describe("EstadisticasService", () => {

    let service;
    let mockPrisma;
    let mockUsuarioRepo;
    let mockAuditoriaRepo;
    let mockPacienteRepo;
    let mockExpedienteRepo;

    const crearServicio = () => new EstadisticasService(
        mockPrisma,
        mockUsuarioRepo,
        mockAuditoriaRepo,
        mockPacienteRepo,
        mockExpedienteRepo
    );

    beforeEach(() => {
        mockPrisma = {
            consultaMedica: {
                count: jest.fn(),
                findMany: jest.fn()
            },
            recetaMedica: {
                count: jest.fn()
            },
            registroPreclinico: {
                count: jest.fn(),
                findMany: jest.fn()
            }
        };

        mockUsuarioRepo = {
            obtenerTodos: jest.fn()
        };

        mockAuditoriaRepo = {
            obtenerRecientes: jest.fn(),
            buscarActividad: jest.fn()
        };

        mockPacienteRepo = {};

        mockExpedienteRepo = {
            contarCreadosHoy: jest.fn()
        };

        service = crearServicio();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("obtenerResumenGeneral", () => {

        test("debe usar estrategia ADMINISTRADOR", async () => {
            const usuario = { id: 1, rol: "ADMINISTRADOR" };
            const mockData = { tarjetas: [], actividad: [] };
            
            const obtenerAdminDataSpy = jest
                .spyOn(EstadisticasService.prototype, "obtenerAdminData")
                .mockResolvedValue(mockData);

            service = crearServicio();
            
            const resultado = await service.obtenerResumenGeneral(usuario);
            
            expect(obtenerAdminDataSpy).toHaveBeenCalledWith(usuario);
            expect(resultado).toEqual(mockData);
        });

        test("debe usar estrategia RECEPCIONISTA", async () => {
            const usuario = { id: 2, rol: "RECEPCIONISTA" };
            const mockData = { tarjetas: [], actividad: [] };
            
            const obtenerRecepcionistaDataSpy = jest
                .spyOn(EstadisticasService.prototype, "obtenerRecepcionistaData")
                .mockResolvedValue(mockData);

            service = crearServicio();
            
            const resultado = await service.obtenerResumenGeneral(usuario);
            
            expect(obtenerRecepcionistaDataSpy).toHaveBeenCalledWith(usuario);
            expect(resultado).toEqual(mockData);
        });

        test("debe usar estrategia MEDICO", async () => {
            const usuario = { id: 3, rol: "MEDICO" };
            const mockData = { tarjetas: [], actividad: [] };
            
            const obtenerMedicoDataSpy = jest
                .spyOn(EstadisticasService.prototype, "obtenerMedicoData")
                .mockResolvedValue(mockData);

            service = crearServicio();
            
            const resultado = await service.obtenerResumenGeneral(usuario);
            
            expect(obtenerMedicoDataSpy).toHaveBeenCalledWith(usuario);
            expect(resultado).toEqual(mockData);
        });

        test("debe usar estrategia ENFERMERO", async () => {
            const usuario = { id: 4, rol: "ENFERMERO" };
            const mockData = { tarjetas: [], actividad: [] };
            
            const obtenerEnfermeroDataSpy = jest
                .spyOn(EstadisticasService.prototype, "obtenerEnfermeroData")
                .mockResolvedValue(mockData);

            service = crearServicio();
            
            const resultado = await service.obtenerResumenGeneral(usuario);
            
            expect(obtenerEnfermeroDataSpy).toHaveBeenCalledWith(usuario);
            expect(resultado).toEqual(mockData);
        });

        test("debe mapear idRol a rol si no hay rol", async () => {
            const usuario = { id: 1, idRol: 1 };
            const mockData = { tarjetas: [], actividad: [] };
            
            const obtenerAdminDataSpy = jest
                .spyOn(EstadisticasService.prototype, "obtenerAdminData")
                .mockResolvedValue(mockData);

            service = crearServicio();
            
            const resultado = await service.obtenerResumenGeneral(usuario);
            
            expect(obtenerAdminDataSpy).toHaveBeenCalledWith(usuario);
            expect(resultado).toEqual(mockData);
        });

        test("debe retornar vacío si el rol no tiene estrategia", async () => {
            const usuario = { id: 5, rol: "ROL_INEXISTENTE" };
            
            const resultado = await service.obtenerResumenGeneral(usuario);
            
            expect(resultado).toEqual({ tarjetas: [], actividad: [] });
        });
    });

    describe("obtenerAdminData", () => {
        test("debe retornar datos de admin correctamente", async () => {
            const usuario = { id: 1 };
            const usuariosMock = [{ id: 1 }, { id: 2 }];
            const auditoriaMock = [
                { id: 1, usuario: { nombre: "Admin", apellido: "Sistema" }, accion: "LOGIN", fecha: new Date(), detalles: "{}" }
            ];

            mockUsuarioRepo.obtenerTodos.mockResolvedValue(usuariosMock);
            mockAuditoriaRepo.obtenerRecientes.mockResolvedValue(auditoriaMock);

            const resultado = await service.obtenerAdminData(usuario);

            expect(resultado.tarjetas[0].valor).toBe(2);
            expect(resultado.tarjetas[1].valor).toBe(1);
            expect(resultado.actividad).toHaveLength(1);
        });
    });

    describe("obtenerRecepcionistaData", () => {
        test("debe retornar datos de recepcionista", async () => {
            const usuario = { id: 2, rol: "RECEPCIONISTA" };
            const expedientesHoy = 5;
            const actividadMock = [
                { id: 1, usuario: { nombre: "Laura", apellido: "Fernández" }, accion: "CREACIÓN DE EXPEDIENTE", fecha: new Date(), detalles: "{}" }
            ];

            mockExpedienteRepo.contarCreadosHoy.mockResolvedValue(expedientesHoy);
            mockAuditoriaRepo.buscarActividad.mockResolvedValue(actividadMock);

            const resultado = await service.obtenerRecepcionistaData(usuario);

            expect(resultado.tarjetas[1].valor).toBe(5);
            expect(resultado.actividad).toHaveLength(1);
        });

        test("admin puede ver datos de recepcionista", async () => {
            const usuario = { id: 1, rol: "ADMINISTRADOR" };
            const expedientesHoy = 10;
            const actividadMock = [];

            mockExpedienteRepo.contarCreadosHoy.mockResolvedValue(expedientesHoy);
            mockAuditoriaRepo.buscarActividad.mockResolvedValue(actividadMock);

            const resultado = await service.obtenerRecepcionistaData(usuario);

            expect(resultado.tarjetas[1].valor).toBe(10);
        });
    });

    describe("obtenerMedicoData", () => {
        test("debe retornar datos de médico", async () => {
            const usuario = { id: 3, rol: "MEDICO" };
            const consultasHoy = 8;
            const recetasHoy = 12;
            const actividadMock = [
                {
                    id: 1,
                    expediente: { paciente: { nombre: "Juan", apellido: "Pérez" } },
                    tipoConsulta: "GENERAL",
                    diagnostico: "Diagnóstico de prueba",
                    fechaConsulta: new Date()
                }
            ];

            mockPrisma.consultaMedica.count.mockResolvedValue(consultasHoy);
            mockPrisma.recetaMedica.count.mockResolvedValue(recetasHoy);
            mockPrisma.consultaMedica.findMany.mockResolvedValue(actividadMock);

            const resultado = await service.obtenerMedicoData(usuario);

            expect(resultado.tarjetas[0].valor).toBe(8);
            expect(resultado.tarjetas[3].valor).toBe(12);
            expect(resultado.actividad).toHaveLength(1);
        });

        test("admin puede ver datos de médico", async () => {
            const usuario = { id: 1, rol: "ADMINISTRADOR" };
            const consultasHoy = 15;

            mockPrisma.consultaMedica.count.mockResolvedValue(consultasHoy);
            mockPrisma.recetaMedica.count.mockResolvedValue(0);
            mockPrisma.consultaMedica.findMany.mockResolvedValue([]);

            const resultado = await service.obtenerMedicoData(usuario);

            expect(resultado.tarjetas[0].valor).toBe(15);
        });
    });

    describe("obtenerEnfermeroData", () => {
        test("debe retornar datos de enfermero", async () => {
            const totalEvaluados = 50;
            const evaluadosHoy = 5;
            const actividadMock = [
                {
                    id: 1,
                    expediente: { paciente: { nombre: "Ana", apellido: "Martínez" } },
                    fechaRegistro: new Date()
                }
            ];

            mockPrisma.registroPreclinico.count
                .mockResolvedValueOnce(totalEvaluados)
                .mockResolvedValueOnce(evaluadosHoy);
            mockPrisma.registroPreclinico.findMany.mockResolvedValue(actividadMock);

            const resultado = await service.obtenerEnfermeroData();

            expect(resultado.tarjetas[0].valor).toBe(50);
            expect(resultado.tarjetas[0].pie).toBe("5 hoy");
            expect(resultado.actividad).toHaveLength(1);
        });
    });

});