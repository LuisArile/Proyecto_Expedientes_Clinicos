const RolService = require('../src/services/rolService');

describe('RolService', () => {
    let rolRepositoryMock;
    let service;

    beforeEach(() => {
        rolRepositoryMock = {
            obtenerPorNombre: jest.fn(),
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            asignarPermisos: jest.fn(),
            obtenerPermisosPorRol: jest.fn()
        };

        service = new RolService(rolRepositoryMock);
    });

    /* =========================
       CREAR
    ========================= */

    test('debe crear un rol correctamente', async () => {
        rolRepositoryMock.obtenerPorNombre.mockResolvedValue(null);
        rolRepositoryMock.crear.mockResolvedValue({ idRol: 1, nombre: 'ADMIN' });

        const result = await service.crear({ nombre: 'admin' });

        expect(rolRepositoryMock.obtenerPorNombre).toHaveBeenCalledWith('ADMIN');
        expect(rolRepositoryMock.crear).toHaveBeenCalledWith({ nombre: 'ADMIN' });
        expect(result).toEqual({ idRol: 1, nombre: 'ADMIN' });
    });

    test('debe lanzar error si el nombre está vacío', async () => {
        await expect(service.crear({ nombre: '   ' }))
            .rejects
            .toThrow('El nombre del rol es requerido');
    });

    test('debe lanzar error si el rol ya existe', async () => {
        rolRepositoryMock.obtenerPorNombre.mockResolvedValue({ idRol: 1 });

        await expect(service.crear({ nombre: 'admin' }))
            .rejects
            .toThrow('Ya existe un rol con ese nombre');
    });

    /* =========================
       OBTENER TODOS
    ========================= */

    test('debe obtener todos los roles', async () => {
        const roles = [{ idRol: 1 }, { idRol: 2 }];
        rolRepositoryMock.obtenerTodos.mockResolvedValue(roles);

        const result = await service.obtenerTodos();

        expect(result).toEqual(roles);
    });

    /* =========================
       OBTENER POR ID
    ========================= */

    test('debe obtener un rol por ID', async () => {
        const rol = { idRol: 1, nombre: 'ADMIN' };
        rolRepositoryMock.obtenerPorId.mockResolvedValue(rol);

        const result = await service.obtenerPorId(1);

        expect(result).toEqual(rol);
    });

    test('debe lanzar error si el rol no existe', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.obtenerPorId(1))
            .rejects
            .toThrow('Rol no encontrado');
    });

    /* =========================
       ACTUALIZAR
    ========================= */

    test('debe actualizar un rol correctamente', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue({ idRol: 1 });
        rolRepositoryMock.obtenerPorNombre.mockResolvedValue(null);
        rolRepositoryMock.actualizar.mockResolvedValue({ idRol: 1, nombre: 'USER' });

        const result = await service.actualizar(1, { nombre: 'user' });

        expect(rolRepositoryMock.actualizar)
            .toHaveBeenCalledWith(1, { nombre: 'USER' });

        expect(result).toEqual({ idRol: 1, nombre: 'USER' });
    });

    test('debe lanzar error si el rol no existe al actualizar', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.actualizar(1, { nombre: 'user' }))
            .rejects
            .toThrow('Rol no encontrado');
    });

    test('debe lanzar error si el nombre ya existe en otro rol', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue({ idRol: 1 });
        rolRepositoryMock.obtenerPorNombre.mockResolvedValue({ idRol: 2 });

        await expect(service.actualizar(1, { nombre: 'admin' }))
            .rejects
            .toThrow('Ya existe un rol con ese nombre');
    });

    /* =========================
       ELIMINAR
    ========================= */

    test('debe eliminar un rol correctamente', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue({ idRol: 1 });
        rolRepositoryMock.eliminar.mockResolvedValue(true);

        const result = await service.eliminar(1);

        expect(rolRepositoryMock.eliminar).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    test('debe lanzar error si el rol no existe al eliminar', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.eliminar(1))
            .rejects
            .toThrow('Rol no encontrado');
    });

    /* =========================
       ASIGNAR PERMISOS
    ========================= */

    test('debe asignar permisos correctamente', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue({ idRol: 1 });
        rolRepositoryMock.asignarPermisos.mockResolvedValue(true);

        const permisos = [1, 2, 3];
        const result = await service.asignarPermisos(1, permisos);

        expect(rolRepositoryMock.asignarPermisos)
            .toHaveBeenCalledWith(1, permisos);

        expect(result).toBe(true);
    });

    test('debe lanzar error si el rol no existe al asignar permisos', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.asignarPermisos(1, [1, 2]))
            .rejects
            .toThrow('Rol no encontrado');
    });

    test('debe lanzar error si permisos no es un array', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue({ idRol: 1 });

        await expect(service.asignarPermisos(1, 'no-array'))
            .rejects
            .toThrow('Se requiere un array de IDs de permisos');
    });

    /* =========================
       OBTENER PERMISOS POR ROL
    ========================= */

    test('debe obtener permisos por rol correctamente', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue({ idRol: 1 });
        rolRepositoryMock.obtenerPermisosPorRol.mockResolvedValue([1, 2]);

        const result = await service.obtenerPermisosPorRol(1);

        expect(result).toEqual([1, 2]);
    });

    test('debe lanzar error si el rol no existe al obtener permisos', async () => {
        rolRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.obtenerPermisosPorRol(1))
            .rejects
            .toThrow('Rol no encontrado');
    });
});