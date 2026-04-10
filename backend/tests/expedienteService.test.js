const expedienteService = require('../src/services/expedienteService');

// Mock correcto de prisma
jest.mock('../src/config/prisma', () => ({
  $transaction: jest.fn()
}));

const prisma = require('../src/config/prisma');

describe('expedienteService', () => {
  let service;
  let expedienteRepository;
  let pacienteRepository;
  let auditoriaService;

  beforeEach(() => {
    expedienteRepository = {
      obtenerPorNumero: jest.fn(),
      crear: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerPorPaciente: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn()
    };

    pacienteRepository = {
      obtenerPorDni: jest.fn(),
      crear: jest.fn(),
      obtenerPorId: jest.fn(),
      actualizar: jest.fn()
    };

    auditoriaService = {
      registrarExpediente: jest.fn()
    };

    service = new expedienteService(
      expedienteRepository,
      pacienteRepository,
      auditoriaService
    );

    // Asegurar que siempre sea mock
    prisma.$transaction = jest.fn();

    jest.clearAllMocks();
  });

  // ---------------- crearConPaciente ----------------
  test('debe lanzar error si el DNI ya existe', async () => {
    pacienteRepository.obtenerPorDni.mockResolvedValue({ id: 1 });

    await expect(
      service.crearConPaciente({ dni: '123' }, {}, 1)
    ).rejects.toThrow('ya existe');
  });

  test('debe crear paciente y expediente correctamente', async () => {
    pacienteRepository.obtenerPorDni.mockResolvedValue(null);
    expedienteRepository.obtenerPorNumero.mockResolvedValue(null);

    prisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        expediente: {
          count: jest.fn().mockResolvedValue(0)
        }
      };

      pacienteRepository.crear.mockResolvedValue({
        idPaciente: 1,
        dni: '123'
      });

      expedienteRepository.crear.mockResolvedValue({
        idExpediente: 10
      });

      return callback(tx);
    });

    const result = await service.crearConPaciente(
      { dni: '123' },
      {},
      1
    );

    expect(result.paciente).toBeDefined();
    expect(result.expediente).toBeDefined();
    expect(auditoriaService.registrarExpediente).toHaveBeenCalled();
  });

  // ---------------- obtenerTodos ----------------
  test('debe retornar todos los expedientes', async () => {
    expedienteRepository.obtenerTodos.mockResolvedValue([{ id: 1 }]);

    const res = await service.obtenerTodos();

    expect(res).toHaveLength(1);
  });

  // ---------------- obtenerPorId ----------------
  test('debe lanzar error si no existe expediente', async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue(null);

    await expect(service.obtenerPorId(1))
      .rejects
      .toThrow('no existe');
  });

  test('debe retornar expediente si existe', async () => {
    const expediente = { idExpediente: 1 };

    expedienteRepository.obtenerPorId.mockResolvedValue(expediente);

    const res = await service.obtenerPorId(1);

    expect(res).toEqual(expediente);
  });

  // ---------------- obtenerPorPaciente ----------------
  test('debe lanzar error si paciente no existe', async () => {
    pacienteRepository.obtenerPorId.mockResolvedValue(null);

    await expect(service.obtenerPorPaciente(1))
      .rejects
      .toThrow('no existe');
  });

  test('debe retornar expedientes del paciente', async () => {
    pacienteRepository.obtenerPorId.mockResolvedValue({ idPaciente: 1 });
    expedienteRepository.obtenerPorPaciente.mockResolvedValue([{ id: 1 }]);

    const res = await service.obtenerPorPaciente(1);

    expect(res).toHaveLength(1);
  });

  // ---------------- actualizarConPaciente ----------------
  test('debe lanzar error si expediente no existe', async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue(null);

    await expect(
      service.actualizarConPaciente(1, {}, {}, 1)
    ).rejects.toThrow('no existe');
  });

  test('debe actualizar paciente y expediente', async () => {
    const expediente = {
      idExpediente: 1,
      idPaciente: 1,
      numeroExpediente: 'EXP-2025-00001',
      paciente: { dni: '123' }
    };

    expedienteRepository.obtenerPorId.mockResolvedValue(expediente);

    prisma.$transaction.mockImplementation(async (callback) => {
      const tx = {};

      pacienteRepository.actualizar.mockResolvedValue({ actualizado: true });
      expedienteRepository.actualizar.mockResolvedValue({ actualizado: true });

      return callback(tx);
    });

    const res = await service.actualizarConPaciente(
      1,
      { nombre: 'Nuevo' },
      { estado: true },
      1
    );

    expect(res.paciente).toBeDefined();
    expect(res.expediente).toBeDefined();
    expect(auditoriaService.registrarExpediente).toHaveBeenCalled();
  });

  // ---------------- eliminar ----------------
  test('debe lanzar error si expediente no existe', async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue(null);

    await expect(service.eliminar(1))
      .rejects
      .toThrow('no existe');
  });

  test('debe eliminar expediente correctamente', async () => {
    expedienteRepository.obtenerPorId.mockResolvedValue({ idExpediente: 1 });
    expedienteRepository.eliminar.mockResolvedValue(true);

    const res = await service.eliminar(1);

    expect(res).toBe(true);
    expect(expedienteRepository.eliminar).toHaveBeenCalledWith(1);
  });
});