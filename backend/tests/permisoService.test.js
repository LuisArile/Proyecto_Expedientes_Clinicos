const PermisoService = require('../src/services/permisoService');

describe('PermisoService', () => {
    let permisoRepositoryMock;
    let service;

    beforeEach(() => {
        permisoRepositoryMock = {
            obtenerPorNombre: jest.fn(),
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        service = new PermisoService(permisoRepositoryMock);
    });

    /* =========================
       CREAR
    ========================= */

    test('debe crear un permiso correctamente', async () => {
        permisoRepositoryMock.obtenerPorNombre.mockResolvedValue(null);
        permisoRepositoryMock.crear.mockResolvedValue({ id: 1, nombre: 'ADMIN' });

        const result = await service.crear({ nombre: 'admin' });

        expect(permisoRepositoryMock.obtenerPorNombre).toHaveBeenCalledWith('ADMIN');
        expect(permisoRepositoryMock.crear).toHaveBeenCalledWith({ nombre: 'ADMIN' });
        expect(result).toEqual({ id: 1, nombre: 'ADMIN' });
    });

    test('debe lanzar error si el nombre está vacío', async () => {
        await expect(service.crear({ nombre: '   ' }))
            .rejects
            .toThrow('El nombre del permiso es requerido');
    });

    test('debe lanzar error si el permiso ya existe', async () => {
        permisoRepositoryMock.obtenerPorNombre.mockResolvedValue({ id: 1 });

        await expect(service.crear({ nombre: 'admin' }))
            .rejects
            .toThrow('Ya existe un permiso con ese nombre');
    });

    /* =========================
       OBTENER TODOS
    ========================= */

    test('debe obtener todos los permisos', async () => {
        const permisos = [{ id: 1 }, { id: 2 }];
        permisoRepositoryMock.obtenerTodos.mockResolvedValue(permisos);

        const result = await service.obtenerTodos();

        expect(result).toEqual(permisos);
    });

    /* =========================
       OBTENER POR ID
    ========================= */

    test('debe obtener un permiso por ID', async () => {
        const permiso = { id: 1, nombre: 'ADMIN' };
        permisoRepositoryMock.obtenerPorId.mockResolvedValue(permiso);

        const result = await service.obtenerPorId(1);

        expect(result).toEqual(permiso);
    });

    test('debe lanzar error si el permiso no existe (obtenerPorId)', async () => {
        permisoRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.obtenerPorId(1))
            .rejects
            .toThrow('Permiso no encontrado');
    });

    /* =========================
       ACTUALIZAR
    ========================= */

    test('debe actualizar un permiso correctamente', async () => {
        permisoRepositoryMock.obtenerPorId.mockResolvedValue({ idPermiso: 1 });
        permisoRepositoryMock.obtenerPorNombre.mockResolvedValue(null);
        permisoRepositoryMock.actualizar.mockResolvedValue({ idPermiso: 1, nombre: 'USER' });

        const result = await service.actualizar(1, { nombre: 'user' });

        expect(permisoRepositoryMock.actualizar)
            .toHaveBeenCalledWith(1, { nombre: 'USER' });

        expect(result).toEqual({ idPermiso: 1, nombre: 'USER' });
    });

    test('debe lanzar error si no existe el permiso al actualizar', async () => {
        permisoRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.actualizar(1, { nombre: 'user' }))
            .rejects
            .toThrow('Permiso no encontrado');
    });

    test('debe lanzar error si el nombre ya existe en otro permiso', async () => {
        permisoRepositoryMock.obtenerPorId.mockResolvedValue({ idPermiso: 1 });
        permisoRepositoryMock.obtenerPorNombre.mockResolvedValue({ idPermiso: 2 });

        await expect(service.actualizar(1, { nombre: 'admin' }))
            .rejects
            .toThrow('Ya existe un permiso con ese nombre');
    });

    /* =========================
       ELIMINAR
    ========================= */

    test('debe eliminar un permiso correctamente', async () => {
        permisoRepositoryMock.obtenerPorId.mockResolvedValue({ idPermiso: 1 });
        permisoRepositoryMock.eliminar.mockResolvedValue(true);

        const result = await service.eliminar(1);

        expect(permisoRepositoryMock.eliminar).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    test('debe lanzar error si el permiso no existe al eliminar', async () => {
        permisoRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.eliminar(1))
            .rejects
            .toThrow('Permiso no encontrado');
    });
});