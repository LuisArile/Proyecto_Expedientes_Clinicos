const MedicamentoService = require("../src/services/medicamentoService");

const ENTIDADES = { MEDICAMENTO: "MEDICAMENTO" };
const ACCIONES = {
  CREAR: "CREAR",
  ACTUALIZAR: "ACTUALIZAR",
  CAMBIAR_ESTADO: "CAMBIAR_ESTADO",
};

// Mock de constantes
jest.mock("../src/utils/auditoriaConstante", () => ({
  ENTIDADES,
  ACCIONES,
}));

describe("MedicamentoService", () => {
  let repositoryMock;
  let auditoriaMock;
  let service;

  beforeEach(() => {
    repositoryMock = {
      buscar: jest.fn(),
      obtenerActivos: jest.fn(),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      alternarEstado: jest.fn(),
    };

    auditoriaMock = {
      registrarEntidad: jest.fn(),
    };

    service = new MedicamentoService(repositoryMock, auditoriaMock);
  });

  //  buscar
  test("debe retornar resultados de búsqueda", async () => {
    const filtros = { nombre: "Paracetamol" };
    const resultado = [{ id: 1 }];

    repositoryMock.buscar.mockResolvedValue(resultado);

    const res = await service.buscar(filtros);

    expect(res).toEqual(resultado);
    expect(repositoryMock.buscar).toHaveBeenCalledWith(filtros);
  });

  // obtenerActivos
  test("debe retornar medicamentos activos", async () => {
    const activos = [{ id: 1 }];
    repositoryMock.obtenerActivos.mockResolvedValue(activos);

    const res = await service.obtenerActivos();

    expect(res).toEqual(activos);
  });

  // obtenerPorId
  test("debe lanzar error si no se envía ID", async () => {
    await expect(service.obtenerPorId()).rejects.toThrow("ID requerido");
  });

  test("debe lanzar error si no encuentra medicamento", async () => {
    repositoryMock.obtenerPorId.mockResolvedValue(null);

    await expect(service.obtenerPorId(1)).rejects.toThrow(
      "Medicamento no encontrado"
    );
  });

  test("debe retornar medicamento si existe", async () => {
    const medicamento = { id: 1 };
    repositoryMock.obtenerPorId.mockResolvedValue(medicamento);

    const res = await service.obtenerPorId(1);

    expect(res).toEqual(medicamento);
  });

  // crear
  test("debe lanzar error si falta nombre", async () => {
    await expect(service.crear({}, 1)).rejects.toThrow("Nombre requerido");
  });

  test("debe lanzar error si falta categoría", async () => {
    await expect(
      service.crear({ nombre: "Paracetamol" }, 1)
    ).rejects.toThrow("Categoría requerida");
  });

  test("debe crear medicamento y registrar auditoría", async () => {
    const data = { nombre: "Paracetamol", categoria: "Analgésico" };
    const medicamento = { id: 1, ...data };

    repositoryMock.crear.mockResolvedValue(medicamento);

    const res = await service.crear(data, 99);

    expect(res).toEqual(medicamento);
    expect(auditoriaMock.registrarEntidad).toHaveBeenCalledWith(
      99,
      ENTIDADES.MEDICAMENTO,
      ACCIONES.CREAR,
      medicamento.id
    );
  });

  //  actualizar
  test("debe actualizar medicamento y registrar auditoría", async () => {
    const updated = { id: 1 };
    repositoryMock.actualizar.mockResolvedValue(updated);

    const res = await service.actualizar(1, { nombre: "Nuevo" }, 99);

    expect(res).toEqual(updated);
    expect(auditoriaMock.registrarEntidad).toHaveBeenCalledWith(
      99,
      ENTIDADES.MEDICAMENTO,
      ACCIONES.ACTUALIZAR,
      1
    );
  });

  // alternarEstado
  test("debe alternar estado y registrar auditoría", async () => {
    const result = { id: 1, activo: false };
    repositoryMock.alternarEstado.mockResolvedValue(result);

    const res = await service.alternarEstado(1, 99);

    expect(res).toEqual(result);
    expect(auditoriaMock.registrarEntidad).toHaveBeenCalledWith(
      99,
      ENTIDADES.MEDICAMENTO,
      ACCIONES.CAMBIAR_ESTADO,
      1
    );
  });

  // auditoría 
  test("no debe llamar auditoría si no existe", async () => {
    service = new MedicamentoService(repositoryMock, null);

    repositoryMock.crear.mockResolvedValue({ id: 1 });

    await service.crear(
      { nombre: "Test", categoria: "Test" },
      99
    );

    // No falla y no intenta usar auditoría
    expect(true).toBe(true);
  });
});