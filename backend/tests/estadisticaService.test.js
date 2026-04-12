const EstadisticaService = require("../src/services/estadisticaService");

describe("EstadisticaService", () => {
  let service;
  let mocks;

  beforeEach(() => {
    mocks = {
      prisma: {},
      usuarioRepository: { obtenerTodos: jest.fn() },
      auditoriaRepository: {
        obtenerLogsDeHoy: jest.fn(),
        obtenerRecientes: jest.fn(),
        buscarActividad: jest.fn(),
      },
      pacienteRepository: {},
      expedienteRepository: {
        contarCreadosHoy: jest.fn(),
      },
      consultaMedicaRepository: {
        contarConsultasHoy: jest.fn(),
        obtenerRecientesPorMedico: jest.fn(),
      },
      registroPreclinicoRepository: {
        contarTodos: jest.fn(),
        contarEvaluadosHoy: jest.fn(),
        obtenerRecientes: jest.fn(),
      },
      recetaMedicaRepository: {
        contarRecetasHoy: jest.fn(),
      },
      examenRepository: {
        obtenerActivos: jest.fn(),
      },
      medicamentoRepository: {
        obtenerActivos: jest.fn(),
      },
    };

    service = new EstadisticaService(
      mocks.prisma,
      mocks.usuarioRepository,
      mocks.auditoriaRepository,
      mocks.pacienteRepository,
      mocks.expedienteRepository,
      mocks.consultaMedicaRepository,
      mocks.registroPreclinicoRepository,
      mocks.recetaMedicaRepository,
      mocks.examenRepository,
      mocks.medicamentoRepository
    );
  });

  // ADMINISTRADOR
  test("debe retornar resumen para ADMINISTRADOR", async () => {
    mocks.usuarioRepository.obtenerTodos.mockResolvedValue([{}, {}]);
    mocks.auditoriaRepository.obtenerLogsDeHoy.mockResolvedValue([{}]);
    mocks.auditoriaRepository.obtenerRecientes.mockResolvedValue([
      { id: 1, accion: "TEST", fecha: new Date(), usuario: { nombre: "A", apellido: "B" } },
    ]);
    mocks.examenRepository.obtenerActivos.mockResolvedValue([{}, {}]);
    mocks.medicamentoRepository.obtenerActivos.mockResolvedValue([{}]);

    const res = await service.obtenerResumenGeneral({
      rol: "ADMINISTRADOR",
    });

    expect(res.tarjetas.length).toBe(4);
    expect(res.actividad.length).toBe(1);
  });

  // RECEPCIONISTA
  test("debe retornar resumen para RECEPCIONISTA", async () => {
    mocks.expedienteRepository.contarCreadosHoy.mockResolvedValue(5);
    mocks.auditoriaRepository.buscarActividad.mockResolvedValue([
      { id: 1, accion: "CREACIÓN DE EXPEDIENTE", fecha: new Date() },
    ]);

    const res = await service.obtenerResumenGeneral({
      rol: "RECEPCIONISTA",
      id: 10,
    });

    expect(res.tarjetas[1].valor).toBe(5);
    expect(res.actividad.length).toBe(1);
  });

  // MEDICO
  test("debe retornar resumen para MEDICO", async () => {
    mocks.consultaMedicaRepository.contarConsultasHoy.mockResolvedValue(3);
    mocks.consultaMedicaRepository.obtenerRecientesPorMedico.mockResolvedValue([
      {
        id: 1,
        tipoConsulta: "General",
        fechaConsulta: new Date(),
        expediente: {
          paciente: { nombre: "Juan", apellido: "Perez" },
        },
      },
    ]);
    mocks.recetaMedicaRepository.contarRecetasHoy.mockResolvedValue(2);

    const res = await service.obtenerResumenGeneral({
      rol: "MEDICO",
      id: 5,
    });

    expect(res.tarjetas[0].valor).toBe(3);
    expect(res.tarjetas[3].valor).toBe(2);
    expect(res.actividad.length).toBe(1);
  });

  // ENFERMERO
  test("debe retornar resumen para ENFERMERO", async () => {
    mocks.registroPreclinicoRepository.contarTodos.mockResolvedValue(10);
    mocks.registroPreclinicoRepository.contarEvaluadosHoy.mockResolvedValue(4);
    mocks.registroPreclinicoRepository.obtenerRecientes.mockResolvedValue([
      {
        id: 1,
        fechaRegistro: new Date(),
        expediente: {
          paciente: { nombre: "Ana", apellido: "Lopez" },
        },
      },
    ]);

    const res = await service.obtenerResumenGeneral({
      rol: "ENFERMERO",
      id: 7,
    });

    expect(res.tarjetas[0].valor).toBe(10);
    expect(res.actividad.length).toBe(1);
  });

  // ROL DESCONOCIDO
  test("debe retornar vacío si el rol no existe", async () => {
    const res = await service.obtenerResumenGeneral({
      rol: "OTRO",
      idRol: 99,
    });

    expect(res).toEqual({ tarjetas: [], actividad: [] });
  });

  // MAPEO POR ID DE ROL
  test("debe usar idRol si no viene rol", async () => {
    mocks.usuarioRepository.obtenerTodos.mockResolvedValue([]);
    mocks.auditoriaRepository.obtenerLogsDeHoy.mockResolvedValue([]);
    mocks.auditoriaRepository.obtenerRecientes.mockResolvedValue([]);
    mocks.examenRepository.obtenerActivos.mockResolvedValue([]);
    mocks.medicamentoRepository.obtenerActivos.mockResolvedValue([]);

    const res = await service.obtenerResumenGeneral({
      idRol: 1, // ADMINISTRADOR
    });

    expect(res.tarjetas).toBeDefined();
  });
});