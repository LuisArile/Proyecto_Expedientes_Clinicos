const ConsultaMedicaService = require("../src/services/consultaMedicaService");

// Mock de prisma
jest.mock("../src/config/prisma", () => ({
  $transaction: jest.fn((callback) => callback(mockTx)),
}));

const mockTx = {
  consultaExamen: {
    createMany: jest.fn(),
  },
};

describe("consultaMedicaService", () => {
  let consultaRepository;
  let recetaRepository;
  let expedienteRepository;
  let auditoriaService;
  let service;

  beforeEach(() => {
    consultaRepository = {
      crear: jest.fn(),
      obtenerPorExpediente: jest.fn(),
      obtenerPorId: jest.fn(),
    };

    recetaRepository = {
      crearMultiples: jest.fn(),
    };

    expedienteRepository = {
      obtenerPorId: jest.fn(),
    };

    auditoriaService = {
      registrarAccionMedica: jest.fn(),
    };

    service = new ConsultaMedicaService(
      consultaRepository,
      recetaRepository,
      expedienteRepository,
      auditoriaService
    );
  });

  // VALIDACIONES

  test("validarDiagnostico debe retornar errores si está vacío", () => {
    const errores = service.validarDiagnostico(null);
    expect(errores).toContain("El diagnóstico es obligatorio");
  });

  test("validarDiagnostico debe validar campos", () => {
    const errores = service.validarDiagnostico({});
    expect(errores).toContain("El ID del diagnóstico es requerido");
    expect(errores).toContain("La descripción es requerida");
    expect(errores).toContain("El tipo (PRESUNTIVO/DEFINITIVO) es requerido");
  });

  test("validarRecetas debe retornar error si está vacío", () => {
    const errores = service.validarRecetas([]);
    expect(errores).toContain("Debe incluir al menos una receta");
  });

  test("validarRecetas debe validar cada receta", () => {
    const recetas = [{}];
    const errores = service.validarRecetas(recetas);

    expect(errores).toContain("Receta 1: medicamento requerido");
    expect(errores).toContain("Receta 1: dosis requerida");
  });

  // REGISTRAR

  test("debe fallar si expediente no existe", async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue(null);

    await expect(
      service.registrar(1, 1, { diagnostico: {} })
    ).rejects.toThrow("Expediente no encontrado");
  });

  test("debe fallar si diagnóstico inválido", async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    await expect(
      service.registrar(1, 1, { diagnostico: {} })
    ).rejects.toThrow();
  });

  test("debe registrar consulta correctamente (flujo feliz)", async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    const consultaMock = { id: 10 };

    consultaRepository.crear.mockResolvedValue(consultaMock);

    const datos = {
      motivo: "Dolor",
      diagnostico: {
        id: 1,
        descripcion: "Gripe",
        tipo: "PRESUNTIVO",
      },
      recetas: [
        { medicamentoId: 1, dosis: "1 diaria" },
      ],
      examenes: [{ examenId: 5, prioridad: "alta" }],
    };

    const res = await service.registrar(1, 2, datos);

    expect(res).toEqual(consultaMock);

    expect(consultaRepository.crear).toHaveBeenCalled();

    expect(recetaRepository.crearMultiples).toHaveBeenCalledWith(
      consultaMock.id,
      expect.any(Array),
      expect.any(Object)
    );

    expect(mockTx.consultaExamen.createMany).toHaveBeenCalled();

    expect(auditoriaService.registrarAccionMedica).toHaveBeenCalled();
  });

  test("debe exigir recetas si diagnóstico es DEFINITIVO", async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue({ id: 1 });

    const datos = {
      diagnostico: {
        id: 1,
        descripcion: "Algo",
        tipo: "DEFINITIVO",
      },
      recetas: [],
    };

    await expect(
      service.registrar(1, 1, datos)
    ).rejects.toThrow("Debe incluir al menos una receta");
  });

  // OBTENER

  test("obtenerPorExpediente debe retornar datos", async () => {
    const data = [{ id: 1 }];
    consultaRepository.obtenerPorExpediente.mockResolvedValue(data);

    const res = await service.obtenerPorExpediente(1);

    expect(res).toEqual(data);
  });

  test("obtenerPorId debe lanzar error si no existe", async () => {
    consultaRepository.obtenerPorId.mockResolvedValue(null);

    await expect(service.obtenerPorId(1)).rejects.toThrow(
      "Consulta no encontrada"
    );
  });

  test("obtenerPorId debe retornar consulta", async () => {
    const consulta = { id: 1 };
    consultaRepository.obtenerPorId.mockResolvedValue(consulta);

    const res = await service.obtenerPorId(1);

    expect(res).toEqual(consulta);
  });
});