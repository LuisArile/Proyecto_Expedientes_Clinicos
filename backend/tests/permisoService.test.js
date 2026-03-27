const PermisoService = require("../src/services/permisoService");

describe("PermisoService", () => {

    let service;
    let permisoRepository;
    let auditoriaService;

    beforeEach(() => {

        permisoRepository = {
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerPorNombre: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        auditoriaService = {
            registrar: jest.fn()
        };

        service = new PermisoService(permisoRepository, auditoriaService);
    });

    describe("crear", () => {

        test("debe crear permiso", async () => {

            permisoRepository.obtenerPorNombre.mockResolvedValue(null);
            permisoRepository.crear.mockResolvedValue({ id: 1 });

            const res = await service.crear({ nombre: "READ" });

            expect(res.id).toBe(1);
        });

        test("debe fallar si nombre vacío", async () => {

            await expect(
                service.crear({ nombre: "" })
            ).rejects.toThrow("El nombre del permiso es requerido");
        });

        test("debe fallar si existe duplicado", async () => {

            permisoRepository.obtenerPorNombre.mockResolvedValue({ id: 1 });

            await expect(
                service.crear({ nombre: "READ" })
            ).rejects.toThrow("Ya existe un permiso con ese nombre");
        });
    });

    describe("obtener", () => {

        test("obtenerTodos", async () => {

            permisoRepository.obtenerTodos.mockResolvedValue([1]);

            const res = await service.obtenerTodos();

            expect(res).toHaveLength(1);
        });

        test("obtenerPorId existe", async () => {

            permisoRepository.obtenerPorId.mockResolvedValue({ id: 1 });

            const res = await service.obtenerPorId(1);

            expect(res.id).toBe(1);
        });

        test("obtenerPorId no existe", async () => {

            permisoRepository.obtenerPorId.mockResolvedValue(null);

            await expect(service.obtenerPorId(1))
                .rejects.toThrow("Permiso no encontrado");
        });
    });

    describe("actualizar", () => {

        test("debe actualizar permiso", async () => {

            permisoRepository.obtenerPorId.mockResolvedValue({ idPermiso: 1 });
            permisoRepository.obtenerPorNombre.mockResolvedValue(null);
            permisoRepository.actualizar.mockResolvedValue({ id: 1 });

            const res = await service.actualizar(1, { nombre: "UPDATE" }, 10);

            expect(res.id).toBe(1);
            expect(auditoriaService.registrar).toHaveBeenCalled();
        });

        test("debe fallar si no existe", async () => {

            permisoRepository.obtenerPorId.mockResolvedValue(null);

            await expect(
                service.actualizar(1, { nombre: "X" }, 10)
            ).rejects.toThrow("Permiso no encontrado");
        });
    });

    describe("eliminar", () => {

        test("debe eliminar permiso", async () => {

            permisoRepository.obtenerPorId.mockResolvedValue({ idPermiso: 1 });
            permisoRepository.eliminar.mockResolvedValue(true);

            const res = await service.eliminar(1, 10);

            expect(res).toBe(true);
            expect(auditoriaService.registrar).toHaveBeenCalled();
        });

        test("debe fallar si no existe", async () => {

            permisoRepository.obtenerPorId.mockResolvedValue(null);

            await expect(service.eliminar(1, 10))
                .rejects.toThrow("Permiso no encontrado");
        });
    });
});