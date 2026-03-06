const InicioSesionService = require("../src/services/inicioSesionService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("InicioSesionService", () => {

    let service;
    let mockUsuarioRepository;
    let mockAuditoriaService;

    beforeEach(() => {

        mockUsuarioRepository = {
            filtrarNombreUsuario: jest.fn(),
            registrarAccionUsuario: jest.fn()
        };

        mockAuditoriaService = {
            registrar: jest.fn()
        };

        service = new InicioSesionService(
            mockUsuarioRepository,
            mockAuditoriaService
        );

    });

    test("debe lanzar error si faltan credenciales", async () => {

        await expect(
            service.inicioSesion(null, null)
        ).rejects.toThrow("Credenciales incorrectas");

    });

    test("debe lanzar error si el usuario no existe", async () => {

        mockUsuarioRepository.filtrarNombreUsuario.mockResolvedValue(null);

        await expect(
            service.inicioSesion("admin", "123")
        ).rejects.toThrow("Credenciales incorrectas");

    });

    test("debe lanzar error si la contraseña es incorrecta", async () => {

        const usuarioMock = { id: 1, clave: "hash" };

        mockUsuarioRepository.filtrarNombreUsuario.mockResolvedValue(usuarioMock);
        bcrypt.compare.mockResolvedValue(false);

        await expect(
            service.inicioSesion("admin", "123")
        ).rejects.toThrow("Credenciales incorrectas");

    });

    test("debe iniciar sesión correctamente", async () => {

        const usuarioMock = {
            id: 1,
            nombre: "Admin",
            nombreUsuario: "admin",
            apellido: "Perez",
            correo: "admin@test.com",
            rol: "ADMIN",
            clave: "hash"
        };

        mockUsuarioRepository.filtrarNombreUsuario.mockResolvedValue(usuarioMock);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("fake-token");

        const resultado = await service.inicioSesion("admin", "123");

        expect(jwt.sign).toHaveBeenCalled();

        expect(resultado).toEqual({
            id: 1,
            nombre: "Admin",
            nombreUsuario: "admin",
            apellido: "Perez",
            correo: "admin@test.com",
            rol: "ADMIN",
            token: "fake-token"
        });

    });

    test("cierreSesion debe registrar logout", async () => {

        mockUsuarioRepository.registrarAccionUsuario.mockResolvedValue(true);

        const resultado = await service.cierreSesion(1);

        expect(mockUsuarioRepository.registrarAccionUsuario).toHaveBeenCalled();

        expect(resultado).toEqual({
            message: "Sesión cerrada exitosamente"
        });

    });

    test("cierreSesion debe lanzar error si no hay usuarioId", async () => {

        await expect(
            service.cierreSesion(null)
        ).rejects.toThrow("Usuario no autenticado");

    });

    test("registrarAuditoria debe llamar al auditoriaService", async () => {

        mockAuditoriaService.registrar.mockResolvedValue(true);

        const resultado = await service.registrarAuditoria(
            1,
            "INICIO_SESION",
            "login correcto"
        );

        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            1,
            "INICIO_SESION",
            "login correcto"
        );

        expect(resultado).toBe(true);

    });

});