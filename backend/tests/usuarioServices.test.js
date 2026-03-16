const bcrypt = require('bcrypt');
const UsuarioService = require('../src/services/usuarioServices');
const Encriptador = require('../src/utils/encritador');

jest.mock('../src/utils/encritador');
jest.mock('bcrypt');

describe('Pruebas unitarias usuarioService', () => {

    let usuarioRepositoryMock;
    let usuarioService;

    beforeEach(() => {

        usuarioRepositoryMock = {
            filtrarNombreUsuario: jest.fn(),
            crear: jest.fn(),
            registrarAccionUsuario: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            actualizarPassword: jest.fn()
        };

        usuarioService = new UsuarioService(usuarioRepositoryMock);
    });

    test('Debe crear un usuario correctamente', async () => {

        const data = {
            nombreUsuario: "juan",
            clave: "1234",
            idRol: 1
        };

        const usuarioMock = {
            id: 10,
            toJSON: () => ({ id: 10, nombreUsuario: "juan" })
        };

        usuarioRepositoryMock.filtrarNombreUsuario.mockResolvedValue(false);
        Encriptador.encriptar.mockResolvedValue("hash123");
        usuarioRepositoryMock.crear.mockResolvedValue(usuarioMock);

        const resultado = await usuarioService.crear(data);

        expect(usuarioRepositoryMock.filtrarNombreUsuario).toHaveBeenCalledWith("juan");
        expect(Encriptador.encriptar).toHaveBeenCalledWith("1234");
        expect(usuarioRepositoryMock.crear).toHaveBeenCalled();
        expect(usuarioRepositoryMock.registrarAccionUsuario).toHaveBeenCalled();
        expect(resultado).toEqual({ id: 10, nombreUsuario: "juan" });
    });

    test('Debe lanzar error si el nombre de usuario ya existe', async () => {

        usuarioRepositoryMock.filtrarNombreUsuario.mockResolvedValue(true);

        await expect(
            usuarioService.crear({ nombreUsuario: "juan", clave: "1234", idRol: 1 })
        ).rejects.toThrow();
    });

    test('Debe obtener todos los usuarios', async () => {

        const usuariosMock = [
            { toJSON: () => ({ id: 1 }) },
            { toJSON: () => ({ id: 2 }) }
        ];

        usuarioRepositoryMock.obtenerTodos.mockResolvedValue(usuariosMock);

        const resultado = await usuarioService.obtenerTodos();

        expect(usuarioRepositoryMock.obtenerTodos).toHaveBeenCalled();
        expect(resultado.length).toBe(2);
    });

    test('Debe cambiar la contraseña correctamente', async () => {

        const usuarioMock = {
            id: 1,
            clave: "hashActual"
        };

        usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuarioMock);
        bcrypt.compare.mockResolvedValue(true);
        Encriptador.encriptar.mockResolvedValue("nuevoHash");

        const resultado = await usuarioService.cambiarPassword(1, "1234", "5678");

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(Encriptador.encriptar).toHaveBeenCalledWith("5678");
        expect(usuarioRepositoryMock.actualizarPassword).toHaveBeenCalled();
        expect(resultado).toEqual({ mensaje: "Contraseña actualizada correctamente" });
    });

    test('Debe lanzar error si el usuario no existe', async () => {

        usuarioRepositoryMock.obtenerPorId.mockResolvedValue(null);

        await expect(
            usuarioService.cambiarPassword(1, "1234", "5678")
        ).rejects.toThrow("Usuario no encontrado");
    });

    test('Debe lanzar error si la contraseña actual es incorrecta', async () => {

        const usuarioMock = {
            id: 1,
            clave: "hashActual"
        };

        usuarioRepositoryMock.obtenerPorId.mockResolvedValue(usuarioMock);
        bcrypt.compare.mockResolvedValue(false);

        await expect(
            usuarioService.cambiarPassword(1, "1234", "5678")
        ).rejects.toThrow("La contraseña actual es incorrecta");
    });

});