const bcrypt = require('bcrypt');
const UsuarioService = require('../src/services/usuarioServices');
const Encriptador = require('../src/utils/encritador');

jest.mock('../src/utils/encritador');
jest.mock('bcrypt');

describe('UsuarioService', () => {
    let usuarioRepositoryMock;
    let auditoriaServiceMock;
    let emailServiceMock;
    let usuarioService;

    beforeEach(() => {
        usuarioRepositoryMock = {
            filtrarNombreUsuario: jest.fn(),
            obtenerPorCorreo: jest.fn(),
            crear: jest.fn(),
            registrarAccionUsuario: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizarPassword: jest.fn()
        };

        auditoriaServiceMock = {
            registrar: jest.fn()
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
        test('debe crear un usuario correctamente', async () => {
            const data = {
                nombre: "Juan",
                apellido: "Perez",
                correo: "juan@test.com",
                nombreUsuario: "juan",
                clave: "12345678",
                idRol: 1
            };

            const usuarioMock = {
                id: 10,
                nombreUsuario: "juan",
                idRol: 1
            };

            usuarioRepositoryMock.obtenerPorCorreo.mockResolvedValue(null);
            usuarioRepositoryMock.filtrarNombreUsuario.mockResolvedValue(false);
            Encriptador.encriptar.mockResolvedValue("hash123");
            usuarioRepositoryMock.crear.mockResolvedValue(usuarioMock);

            const resultado = await usuarioService.crear(data, 99);

            expect(usuarioRepositoryMock.obtenerPorCorreo).toHaveBeenCalledWith("juan@test.com");
            expect(usuarioRepositoryMock.filtrarNombreUsuario).toHaveBeenCalledWith("juan");
            expect(Encriptador.encriptar).toHaveBeenCalledWith("12345678");

            expect(usuarioRepositoryMock.crear).toHaveBeenCalledWith(
                expect.objectContaining({ clave: "hash123" })
            );

            expect(usuarioRepositoryMock.registrarAccionUsuario).toHaveBeenCalledWith(
                99,
                'USUARIO_CREADO',
                `Se creó el usuario ${usuarioMock.nombreUsuario} con rol ID ${usuarioMock.idRol}`
            );

            expect(resultado).toEqual(usuarioMock);
        });

        test('debe lanzar error si el nombre de usuario ya existe', async () => {
            usuarioRepositoryMock.obtenerPorCorreo.mockResolvedValue(null);
            usuarioRepositoryMock.filtrarNombreUsuario.mockResolvedValue(true);

            await expect(
                usuarioService.crear({
                    nombre: "Juan",
                    apellido: "Perez",
                    correo: "juan@test.com",
                    nombreUsuario: "juan",
                    clave: "12345678",
                    idRol: 1
                })
            ).rejects.toThrow();
        });
    });

    describe('obtenerTodos', () => {
        test('debe obtener todos los usuarios correctamente', async () => {
            const usuariosMock = [
                { toJSON: () => ({ id: 1, nombreUsuario: 'a' }) },
                { toJSON: () => ({ id: 2, nombreUsuario: 'b' }) }
            ];

            usuarioRepositoryMock.obtenerTodos.mockResolvedValue(usuariosMock);

            const resultado = await usuarioService.obtenerTodos();

            expect(usuarioRepositoryMock.obtenerTodos).toHaveBeenCalled();

            const limpio = resultado.map(u => u.toJSON());

            expect(limpio).toEqual([
                { id: 1, nombreUsuario: 'a' },
                { id: 2, nombreUsuario: 'b' }
            ]);
        });
    });

    describe('cambiarPassword', () => {
        const userId = 1;
        const currentPassword = '1234';
        const newPassword = '5678';

        test('debe cambiar la contraseña correctamente', async () => {
            const usuarioMock = { id: userId, clave: "hashActual" };

            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(true);
            Encriptador.encriptar.mockResolvedValue("nuevoHash");
            usuarioRepositoryMock.actualizarPassword.mockResolvedValue(true);

            const resultado = await usuarioService.cambiarPassword(
                userId,
                currentPassword,
                newPassword
            );

            expect(usuarioRepositoryMock.obtenerPorId).toHaveBeenCalledWith(userId);
            expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, usuarioMock.clave);
            expect(Encriptador.encriptar).toHaveBeenCalledWith(newPassword);

            expect(usuarioRepositoryMock.actualizarPassword).toHaveBeenCalledWith(
                userId,
                "nuevoHash"
            );

            expect(auditoriaServiceMock.registrar).toHaveBeenCalledWith(
                userId,
                'CAMBIO_PASSWORD',
                'El usuario actualizó su contraseña'
            );

            expect(resultado).toEqual({
                mensaje: "Contraseña actualizada correctamente"
            });
        });

        test('debe lanzar error si el usuario no existe', async () => {
            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

            await expect(
                usuarioService.cambiarPassword(userId, currentPassword, newPassword)
            ).rejects.toThrow("Usuario no encontrado");
        });

        test('debe lanzar error si la contraseña actual es incorrecta', async () => {
            const usuarioMock = { id: userId, clave: "hashActual" };

            usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                usuarioService.cambiarPassword(userId, currentPassword, newPassword)
            ).rejects.toThrow("La contraseña actual es incorrecta");
        });
    });
});