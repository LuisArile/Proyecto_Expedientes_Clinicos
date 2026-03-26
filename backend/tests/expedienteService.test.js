// MOCK DE PRISMA (evita conexión real)
jest.mock("../src/config/prisma", () => ({
    $transaction: jest.fn(),
}));

const prisma = require("../src/config/prisma");
const ExpedienteService = require("../src/services/expedienteService");

describe("ExpedienteService", () => {

    let service;
    let expedienteRepo;
    let pacienteRepo;
    let auditoriaService;

    beforeEach(() => {

        expedienteRepo = {
            obtenerPorNumero: jest.fn(),
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerPorPaciente: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        pacienteRepo = {
            obtenerPorDni: jest.fn(),
            obtenerPorId: jest.fn(),
            crear: jest.fn(),
            actualizar: jest.fn(),
        };

        auditoriaService = {
            registrarExpediente: jest.fn()
        };

        service = new ExpedienteService(
            expedienteRepo,
            pacienteRepo,
            auditoriaService
        );
    });

    describe("crearConPaciente", () => {

        test("debe crear paciente y expediente correctamente", async () => {

            const pacienteData = { dni: "123", nombre: "Juan" };
            const expedienteData = {};

            pacienteRepo.obtenerPorDni.mockResolvedValue(null);

            prisma.$transaction.mockImplementation(async (callback) => {

                const tx = {
                    expediente: {
                        count: jest.fn().mockResolvedValue(5)
                    }
                };

                pacienteRepo.crear.mockResolvedValue({
                    idPaciente: 1,
                    dni: "0801-1984-00248"
                });

                expedienteRepo.crear.mockResolvedValue({
                    idExpediente: 10,
                    numeroExpediente: "EXP-2026-00006"
                });

                return callback(tx);
            });

            const resultado = await service.crearConPaciente(
                pacienteData,
                expedienteData,
                1
            );

            expect(pacienteRepo.crear).toHaveBeenCalled();
            expect(expedienteRepo.crear).toHaveBeenCalled();

            expect(resultado.expediente.numeroExpediente).toBe("EXP-2026-00006");

        });

        test("debe lanzar error si el DNI ya existe", async () => {

            pacienteRepo.obtenerPorDni.mockResolvedValue({ idPaciente: 1 });

            await expect(
                service.crearConPaciente({ dni: "0801-1984-00248" }, {}, 1)
            ).rejects.toThrow("El paciente con DNI 0801-1984-00248 ya existe");

        });

    });

    describe("obtenerTodos", () => {

        test("debe retornar expedientes", async () => {

            const expedientes = [{ id: 1 }, { id: 2 }];

            expedienteRepo.obtenerTodos.mockResolvedValue(expedientes);

            const resultado = await service.obtenerTodos();

            expect(resultado).toEqual(expedientes);

        });

    });

    describe("obtenerPorId", () => {

        test("debe lanzar error si el expediente no existe", async () => {

            expedienteRepo.obtenerPorId.mockResolvedValue(null);

            await expect(
                service.obtenerPorId(5)
            ).rejects.toThrow("El expediente con ID 5 no existe");

        });

    });

    describe("obtenerPorPaciente", () => {

        test("debe lanzar error si el paciente no existe", async () => {

            pacienteRepo.obtenerPorId.mockResolvedValue(null);

            await expect(
                service.obtenerPorPaciente(2)
            ).rejects.toThrow("El paciente con ID 2 no existe");

        });

    });

    describe("actualizar", () => {

        test("debe actualizar solo datos del expediente (sin paciente)", async () => {

            expedienteRepo.obtenerPorId.mockResolvedValue({ idExpediente: 1, idPaciente: 5 });

            expedienteRepo.actualizar.mockResolvedValue({
                idExpediente: 1,
                estado: true,
                observaciones: "Actualizado"
            });

            const resultado = await service.actualizar(
                1,
                { estado: true, observaciones: "Actualizado" },
                1  // usuarioId
            );

            expect(expedienteRepo.obtenerPorId).toHaveBeenCalledWith(1);
            expect(expedienteRepo.actualizar)
                .toHaveBeenCalledWith(1, { estado: true, observaciones: "Actualizado" });
            expect(auditoriaService.registrarExpediente).toHaveBeenCalled();
            expect(resultado.estado).toBe(true);

        });

        test("debe actualizar datos de paciente usando transacción", async () => {

            // Mock para el primer obtenerPorId (al inicio del método)
            expedienteRepo.obtenerPorId.mockResolvedValueOnce({
                idExpediente: 1,
                idPaciente: 5,
                paciente: { dni: "0801-1984-00248" }
            });

            pacienteRepo.obtenerPorDni.mockResolvedValue(null);

            pacienteRepo.actualizar.mockResolvedValue({
                idPaciente: 5,
                nombre: "Juan Carlos",
                apellido: "Pérez"
            });

            expedienteRepo.actualizar.mockResolvedValue({
                idExpediente: 1,
                idPaciente: 5
            });

            // Mock para el segundo obtenerPorId (al final, después de la transacción)
            expedienteRepo.obtenerPorId.mockResolvedValueOnce({
                idExpediente: 1,
                idPaciente: 5,
                paciente: {
                    idPaciente: 5,
                    nombre: "Juan Carlos",
                    apellido: "Pérez"
                }
            });

            prisma.$transaction.mockImplementation(async (callback) => {
                const tx = {};
                return callback(tx);
            });

            const resultado = await service.actualizar(
                1,
                {
                    paciente: {
                        nombre: "Juan Carlos",
                        apellido: "Pérez"
                    }
                },
                1  // usuarioId
            );

            expect(prisma.$transaction).toHaveBeenCalled();
            expect(pacienteRepo.actualizar).toHaveBeenCalled();
            expect(auditoriaService.registrarExpediente).toHaveBeenCalled();
            expect(expedienteRepo.obtenerPorId).toHaveBeenCalledTimes(2);
            expect(resultado.paciente.nombre).toBe("Juan Carlos");

        });

        test("debe lanzar error si el DNI ya existe en otro paciente", async () => {

            expedienteRepo.obtenerPorId.mockResolvedValue({
                idExpediente: 1,
                idPaciente: 5
            });

            pacienteRepo.obtenerPorDni.mockResolvedValue({
                idPaciente: 10  // Diferente al paciente actual
            });

            await expect(
                service.actualizar(
                    1,
                    {
                        paciente: {
                            dni: "0801-1984-99999"  // DNI que pertenece a otro paciente
                        }
                    },
                    1
                )
            ).rejects.toThrow("El paciente con DNI 0801-1984-99999 ya existe");

        });

        test("debe permitir actualizar el mismo DNI del paciente", async () => {

            expedienteRepo.obtenerPorId.mockResolvedValue({
                idExpediente: 1,
                idPaciente: 5,
                paciente: { dni: "0801-1984-00248" }
            });

            // El mismo DNI retorna el mismo paciente
            pacienteRepo.obtenerPorDni.mockResolvedValue({
                idPaciente: 5  // Mismo que el expediente
            });

            pacienteRepo.actualizar.mockResolvedValue({
                idPaciente: 5,
                dni: "0801-1984-00248"
            });

            prisma.$transaction.mockImplementation(async (callback) => {
                const tx = {};
                return callback(tx);
            });

            expedienteRepo.obtenerPorId.mockResolvedValueOnce({
                idExpediente: 1,
                idPaciente: 5,
                paciente: { dni: "0801-1984-00248" }
            });

            const resultado = await service.actualizar(
                1,
                {
                    paciente: {
                        dni: "0801-1984-00248"
                    }
                },
                1
            );

            expect(prisma.$transaction).toHaveBeenCalled();
            expect(resultado).toBeDefined();

        });

    });

    describe("eliminar", () => {

        test("debe eliminar expediente", async () => {

            expedienteRepo.obtenerPorId.mockResolvedValue({ idExpediente: 1 });

            expedienteRepo.eliminar.mockResolvedValue(true);

            const resultado = await service.eliminar(1);

            expect(expedienteRepo.eliminar).toHaveBeenCalledWith(1);
            expect(resultado).toBe(true);

        });

    });
});