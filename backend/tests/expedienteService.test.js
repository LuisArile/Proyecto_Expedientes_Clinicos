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

        test("debe actualizar expediente", async () => {

            expedienteRepo.obtenerPorId.mockResolvedValue({ idExpediente: 1 });

            expedienteRepo.actualizar.mockResolvedValue({
                estado: "Activo"
            });

            const resultado = await service.actualizar(1, { estado: "Activo" });

            expect(expedienteRepo.actualizar)
                .toHaveBeenCalledWith(1, { estado: "Activo" });

            expect(resultado.estado).toBe("Activo");

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