const jwt = require("jsonwebtoken");
const inicioSesionController = require("../src/controllers/inicioSesionController");

jest.mock("jsonwebtoken");

describe("inicioSesionController", () => {

    let controller;
    let mockInicioSesionService;
    let mockAuditoriaService;
    let req;
    let res;

    beforeEach(() => {

        mockInicioSesionService = {
            inicioSesion: jest.fn(),
            cierreSesion: jest.fn()
        };

        mockAuditoriaService = {
            registrarSesion: jest.fn()
        };

        controller = new inicioSesionController(
            mockInicioSesionService,
            mockAuditoriaService
        );

        req = {
            body: {},
            usuario: { id: 1 }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jwt.sign.mockReturnValue("fake-token");

    });

    test("debe iniciar sesión correctamente", async () => {

        const usuarioMock = {
            id: 1,
            nombreUsuario: "admin",
            rol: "ADMIN"
        };

        req.body = {
            nombreUsuario: "admin",
            clave: "123456"
        };

        mockInicioSesionService.inicioSesion.mockResolvedValue(usuarioMock);

        await controller.inicioSesion(req, res);

        expect(mockInicioSesionService.inicioSesion)
            .toHaveBeenCalledWith("admin", "123456");

        expect(mockAuditoriaService.registrarSesion)
            .toHaveBeenCalledWith(1, "INICIO_SESION", "admin");

        expect(jwt.sign).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            token: "fake-token",
            data: usuarioMock
        });

    });

    test("debe retornar 401 si falla el login", async () => {

        req.body = {
            nombreUsuario: "admin",
            clave: "incorrecta"
        };

        mockInicioSesionService.inicioSesion
            .mockRejectedValue(new Error("Credenciales inválidas"));

        await controller.inicioSesion(req, res);

        expect(res.status).toHaveBeenCalledWith(401);

    });

    test("debe cerrar sesión correctamente", async () => {

        const resultadoMock = { mensaje: "sesión cerrada" };

        mockInicioSesionService.cierreSesion
            .mockResolvedValue(resultadoMock);

        await controller.cierreSesion(req, res);

        expect(mockInicioSesionService.cierreSesion)
            .toHaveBeenCalledWith(1);

        expect(mockAuditoriaService.registrarSesion)
            .toHaveBeenCalledWith(1, "CIERRE_SESION");

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: resultadoMock
        });

    });

    test("debe retornar 401 si no hay usuario para cerrar sesión", async () => {

        req.usuario = null;

        await controller.cierreSesion(req, res);

        expect(res.status).toHaveBeenCalledWith(401);

    });

});