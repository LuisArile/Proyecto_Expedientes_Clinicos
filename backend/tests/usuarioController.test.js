const usuarioController = require("../src/controllers/usuarioController");

describe("usuarioController", () => {

    let controller;
    let mockUsuarioService;
    let req;
    let res;

    beforeEach(() => {

        mockUsuarioService = {
            crear: jest.fn(),
            obtenerTodos: jest.fn()
        };

        controller = new usuarioController(mockUsuarioService);

        req = {
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

    });

    test("debe crear un usuario correctamente", async () => {

        const usuarioMock = {
            id: 1,
            nombreUsuario: "admin",
            rol: "ADMIN"
        };

        req.body = usuarioMock;

        mockUsuarioService.crear.mockResolvedValue(usuarioMock);

        await controller.crear(req, res);

        expect(mockUsuarioService.crear)
            .toHaveBeenCalledWith(usuarioMock);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: usuarioMock
        });

    });

    test("debe retornar error si falla la creación", async () => {

        req.body = { nombreUsuario: "admin" };

        mockUsuarioService.crear
            .mockRejectedValue(new Error("Error al crear usuario"));

        await controller.crear(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Error al crear usuario"
        });

    });

    test("debe obtener todos los usuarios", async () => {

        const usuariosMock = [
            { id: 1, nombreUsuario: "admin" },
            { id: 2, nombreUsuario: "doctor" }
        ];

        mockUsuarioService.obtenerTodos
            .mockResolvedValue(usuariosMock);

        await controller.obtenerTodos(req, res);

        expect(mockUsuarioService.obtenerTodos)
            .toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: usuariosMock
        });

    });

    test("debe manejar error al obtener usuarios", async () => {

        mockUsuarioService.obtenerTodos
            .mockRejectedValue(new Error("Error al obtener usuarios"));

        await controller.obtenerTodos(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Error al obtener usuarios"
        });

    });

});