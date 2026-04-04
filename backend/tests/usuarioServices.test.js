const bcrypt = require('bcrypt');
const UsuarioService = require('../src/services/usuarioServices');
const Encriptador = require('../src/utils/encritador');
const {ErrorConflicto, ErrorValidacion, ErrorNoEncontrado} = require('../src/utils/errores');

jest.mock('../src/utils/encritador');
jest.mock('bcrypt');

describe('UsuarioService', () => {
    let usuarioRepositoryMock;
    let auditoriaServiceMock;
    let emailServiceMock;
    let usuarioService;

    beforeEach(() => {
        usuarioRepositoryMock = {
            obtenerPorCorreo: jest.fn(),
            filtrarNombreUsuario: jest.fn(),
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
            actualizarPassword: jest.fn(),
            registrarAccionUsuario: jest.fn()
        };

        auditoriaServiceMock = {
            registrar: jest.fn(),
            registrarUsuario: jest.fn()
        };

        emailServiceMock = {
            enviarCredenciales: jest.fn()
        };

        usuarioService = new UsuarioService(
            usuarioRepositoryMock,
            auditoriaServiceMock,
            emailServiceMock
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('crear', () => {
        const data = {
            nombre: "Juan",
            apellido: "Perez",
            correo: "juan@test.com",
            nombreUsuario: "juan",
            clave: "12345678",
            idRol: 1
        };

        test('debe crear usuario y registrar auditoría', async () => {
            const usuarioMock = { id: 1, ...data };

            usuarioRepositoryMock.obtenerPorCorreo.mockResolvedValue(null);
            usuarioRepositoryMock.filtrarNombreUsuario.mockResolvedValue(false);
            Encriptador.encriptar.mockResolvedValue("hash123");
            usuarioRepositoryMock.crear.mockResolvedValue({ usuario: usuarioMock });
            emailServiceMock.enviarCredenciales.mockResolvedValue(true);

            const result = await usuarioService.crear(data, 99);

            expect(usuarioRepositoryMock.crear).toHaveBeenCalled();
            expect(auditoriaServiceMock.registrarUsuario).toHaveBeenCalledWith(
                99,
                'USUARIO_CREADO',
                usuarioMock.id
            );

            expect(result).toEqual(usuarioMock);
        });

        test('debe lanzar error si correo ya existe', async () => {
            usuarioRepositoryMock.obtenerPorCorreo.mockResolvedValue({ id: 1 });

            await expect(usuarioService.crear(data, 99))
                .rejects.toThrow(ErrorConflicto);
        });

        test('debe validar especialidad para médicos', async () => {
            const medico = { ...data, idRol: 2 };

            await expect(usuarioService.crear(medico, 99))
                .rejects.toThrow('La especialidad es obligatoria para médicos');
        });
    });

    describe('obtenerTodos', () => {
        test('debe retornar lista de usuarios', async () => {
            const usuarios = [
                { id: 1 },
                { id: 2 }
            ];

            usuarioRepositoryMock.obtenerTodos.mockResolvedValue(usuarios);

            const result = await usuarioService.obtenerTodos();

            expect(usuarioRepositoryMock.obtenerTodos).toHaveBeenCalled();
            expect(result).toEqual(usuarios);
        });
    });

    describe('obtenerPorId', () => {
        test('debe retornar usuario', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue({ id: 1 });

            const result = await usuarioService.obtenerPorId(1);

            expect(result).toEqual({ id: 1 });
        });

        test('debe lanzar error si no existe', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(usuarioService.obtenerPorId(99))
                .rejects.toThrow(ErrorValidacion);
        });
    });

    describe('actualizar', () => {
        const usuarioExistente = {
            id: 1,
            nombre: "Ana",
            apellido: "Sosa",
            correo: "ana@test.com",
            nombreUsuario: "ana",
            idRol: 1,
            activo: true,
            especialidad: null
        };

        test('debe actualizar usuario y registrar auditoría', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuarioExistente);
            usuarioRepositoryMock.obtenerPorCorreo.mockResolvedValue(null);
            usuarioRepositoryMock.actualizar.mockResolvedValue({
                ...usuarioExistente,
                nombre: "Ana Maria"
            });

            const data = { nombre: "Ana Maria" };

            await usuarioService.actualizar(1, data, 99);

            expect(auditoriaServiceMock.registrar).toHaveBeenCalled();
        });

        test('no debe permitir auto-inactivación', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuarioExistente);

            await expect(
                usuarioService.actualizar(1, { activo: false }, 1)
            ).rejects.toThrow('No puedes inactivar tu propia cuenta');
        });

        test('debe lanzar ErrorNoEncontrado si no existe usuario', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(
                usuarioService.actualizar(1, {}, 99)
            ).rejects.toThrow(ErrorNoEncontrado);
        });

        test('debe validar especialidad en rol médico', async () => {
            const medico = {
                ...usuarioExistente,
                idRol: 2
            };

            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(medico);

            await expect(
                usuarioService.actualizar(1, { idRol: 2 }, 99)
            ).rejects.toThrow('La especialidad es obligatoria para médicos');
        });
    });

    describe('eliminar', () => {
        test('debe eliminar usuario y auditar', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue({ id: 1 });

            const result = await usuarioService.eliminar(1, 99);

            expect(usuarioRepositoryMock.eliminar).toHaveBeenCalledWith(1);
            expect(auditoriaServiceMock.registrarUsuario).toHaveBeenCalledWith(
                99,
                'ELIMINACION',
                1
            );

            expect(result).toBe(true);
        });

        test('debe lanzar error si no existe usuario', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(usuarioService.eliminar(1, 99))
                .rejects.toThrow(ErrorNoEncontrado);
        });
    });


    describe('cambiarPassword', () => {
        test('debe cambiar contraseña correctamente', async () => {
            const usuario = { id: 1, clave: "hashOld" };

            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuario);
            bcrypt.compare.mockResolvedValue(true);
            Encriptador.encriptar.mockResolvedValue("hashNew");
            usuarioRepositoryMock.actualizarPassword.mockResolvedValue(true);

            const result = await usuarioService.cambiarPassword(
                1,
                "1234",
                "5678"
            );

            expect(usuarioRepositoryMock.actualizar)
                .toHaveBeenCalledWith(1, { clave: "hashNew", debeCambiarPassword: false });

            expect(auditoriaServiceMock.registrar)
                .toHaveBeenCalledWith(1, 'CAMBIO_PASSWORD', 'El usuario actualizó su contraseña');

            expect(result).toEqual({
                mensaje: "Contraseña actualizada correctamente"
            });
        });

        test('debe fallar si usuario no existe', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(
                usuarioService.cambiarPassword(1, "a", "b")
            ).rejects.toThrow("Usuario no encontrado");
        });

        test('debe fallar si contraseña actual es incorrecta', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue({ clave: "hash" });
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                usuarioService.cambiarPassword(1, "a", "b")
            ).rejects.toThrow("La contraseña actual es incorrecta");
        });
    });

    describe('alternarEstado', () => {
        test('debe cambiar estado correctamente', async () => {
            const usuario = { id: 1, activo: true, nombreUsuario: "test" };

            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuario);
            usuarioRepositoryMock.actualizar.mockResolvedValue({
                ...usuario,
                activo: false
            });

            const result = await usuarioService.alternarEstado(1);

            expect(usuarioRepositoryMock.actualizar)
                .toHaveBeenCalledWith(1, { activo: false });

            expect(usuarioRepositoryMock.registrarAccionUsuario)
                .toHaveBeenCalled();

            expect(result.success).toBe(true);
        });

        test('debe fallar si no existe usuario', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(usuarioService.alternarEstado(1))
                .rejects.toThrow(ErrorNoEncontrado);
        });
    });

    describe('enviarCredenciales', () => {
        test('debe generar password y enviar email', async () => {
            const usuario = { id: 1, correo: "test@test.com" };

            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuario);
            bcrypt.hash.mockResolvedValue("hashTemp");

            await usuarioService.enviarCredenciales(1);

            expect(usuarioRepositoryMock.actualizar)
                .toHaveBeenCalledWith(1,
                    expect.objectContaining({
                        clave: "hashTemp",
                        debeCambiarPassword: true
                    })
                );

            expect(emailServiceMock.enviarCredenciales)
                .toHaveBeenCalled();
        });

        test('debe fallar si usuario no existe', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(usuarioService.enviarCredenciales(1))
                .rejects.toThrow("Usuario no encontrado");
        });
    });
});