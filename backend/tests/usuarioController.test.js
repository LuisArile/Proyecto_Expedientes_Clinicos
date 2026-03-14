const UsuarioController = require('../src/controllers/usuarioController');

describe('Pruebas unitarias usuarioController', () => {

    let usuarioServiceMock;
    let usuarioController;
    let req;
    let res;

    beforeEach(() => {

        usuarioServiceMock = {
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            cambiarPassword: jest.fn()
        };

        usuarioController = new UsuarioController(usuarioServiceMock);

        req = {
            body: {},
            user: { id: 1 }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('Debe crear un usuario correctamente', async () => {

        const usuarioMock = { id: 1, nombre: "Juan" };

        req.body = { nombreUsuario: "juan", clave: "1234" };

        usuarioServiceMock.crear.mockResolvedValue(usuarioMock);

        await usuarioController.crear(req, res);

        expect(usuarioServiceMock.crear).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: usuarioMock
        });
    });

    test('Debe retornar error si falla la creación', async () => {

        req.body = { nombreUsuario: "juan" };

        usuarioServiceMock.crear.mockRejectedValue(new Error("Error al crear"));

        await usuarioController.crear(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Error al crear"
        });
    });

    test('Debe obtener todos los usuarios', async () => {

        const usuariosMock = [{ id: 1 }, { id: 2 }];

        usuarioServiceMock.obtenerTodos.mockResolvedValue(usuariosMock);

        await usuarioController.obtenerTodos(req, res);

        expect(usuarioServiceMock.obtenerTodos).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: usuariosMock
        });
    });

    test('Debe retornar error si falla obtener usuarios', async () => {

        usuarioServiceMock.obtenerTodos.mockRejectedValue(new Error("Error BD"));

        await usuarioController.obtenerTodos(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Error BD"
        });
    });

    test('Debe cambiar la contraseña correctamente', async () => {

        req.body = {
            currentPassword: "1234",
            newPassword: "5678"
        };

        const resultadoMock = { mensaje: "Contraseña actualizada correctamente" };

        usuarioServiceMock.cambiarPassword.mockResolvedValue(resultadoMock);

        await usuarioController.cambiarPassword(req, res);

        expect(usuarioServiceMock.cambiarPassword).toHaveBeenCalledWith(
            1,
            "1234",
            "5678"
        );

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: resultadoMock
        });
    });

    test('Debe validar campos obligatorios al cambiar contraseña', async () => {

        req.body = {
            currentPassword: "",
            newPassword: ""
        };

        await usuarioController.cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Todos los campos son obligatorios"
        });
    });

    test('Debe manejar errores al cambiar contraseña', async () => {

        req.body = {
            currentPassword: "1234",
            newPassword: "5678"
        };

        usuarioServiceMock.cambiarPassword.mockRejectedValue(new Error("Error contraseña"));

        await usuarioController.cambiarPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Error contraseña"
        });
    });

});