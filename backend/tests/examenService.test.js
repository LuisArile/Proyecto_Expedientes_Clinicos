const ExamenService = require('../src/services/examenService');

describe('ExamenService', () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      buscar: jest.fn(),
      obtenerActivos: jest.fn(),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      alternarEstado: jest.fn(),
    };

    service = new ExamenService(mockRepository);
  });

  // ---------------- buscar ----------------
  test('buscar debe retornar resultados del repositorio', async () => {
    const filtros = { nombre: 'test' };
    const resultados = [{ id: 1 }];

    mockRepository.buscar.mockResolvedValue(resultados);

    const res = await service.buscar(filtros);

    expect(res).toEqual(resultados);
    expect(mockRepository.buscar).toHaveBeenCalledWith(filtros);
  });

  // ---------------- obtenerActivos ----------------
  test('obtenerActivos debe retornar exámenes activos', async () => {
    const activos = [{ id: 1, activo: true }];

    mockRepository.obtenerActivos.mockResolvedValue(activos);

    const res = await service.obtenerActivos();

    expect(res).toEqual(activos);
    expect(mockRepository.obtenerActivos).toHaveBeenCalled();
  });

  // ---------------- obtenerPorId ----------------
  test('obtenerPorId debe lanzar error si no se envía id', async () => {
    await expect(service.obtenerPorId(null))
      .rejects
      .toThrow("ID requerido");
  });

  test('obtenerPorId debe lanzar error si no encuentra examen', async () => {
    mockRepository.obtenerPorId.mockResolvedValue(null);

    await expect(service.obtenerPorId(1))
      .rejects
      .toThrow("Examen no encontrado");
  });

  test('obtenerPorId debe retornar examen si existe', async () => {
    const examen = { id: 1 };

    mockRepository.obtenerPorId.mockResolvedValue(examen);

    const res = await service.obtenerPorId(1);

    expect(res).toEqual(examen);
    expect(mockRepository.obtenerPorId).toHaveBeenCalledWith(1);
  });

  // ---------------- crear ----------------
  test('crear debe lanzar error si falta nombre', async () => {
    await expect(service.crear({ especialidad: 'medicina' }))
      .rejects
      .toThrow("Nombre requerido");
  });

  test('crear debe lanzar error si falta especialidad', async () => {
    await expect(service.crear({ nombre: 'Examen 1' }))
      .rejects
      .toThrow("Especialidad requerida");
  });

  test('crear debe llamar al repositorio con datos válidos', async () => {
    const data = { nombre: 'Examen 1', especialidad: 'medicina' };

    mockRepository.crear.mockResolvedValue(data);

    const res = await service.crear(data);

    expect(res).toEqual(data);
    expect(mockRepository.crear).toHaveBeenCalledWith(data);
  });

  // ---------------- actualizar ----------------
  test('actualizar debe llamar al repositorio', async () => {
    const id = 1;
    const data = { nombre: 'Nuevo' };

    mockRepository.actualizar.mockResolvedValue({ id, ...data });

    const res = await service.actualizar(id, data);

    expect(res).toEqual({ id, ...data });
    expect(mockRepository.actualizar).toHaveBeenCalledWith(id, data);
  });

  // ---------------- alternarEstado ----------------
  test('alternarEstado debe llamar al repositorio', async () => {
    const id = 1;

    mockRepository.alternarEstado.mockResolvedValue({ id, activo: false });

    const res = await service.alternarEstado(id);

    expect(res).toEqual({ id, activo: false });
    expect(mockRepository.alternarEstado).toHaveBeenCalledWith(id);
  });
});