const InicioSesionService = require("../src/services/inicioSesionService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("InicioSesionService", () => {

    let service;
    let usuarioRepository;
    let auditoriaService;

    beforeEach(() => {

        usuarioRepository = {
            filtrarNombreUsuario: jest.fn(),
            registrarAccionUsuario: jest.fn()
        };

        auditoriaService = {
            registrar: jest.fn()
        };

        service = new InicioSesionService(
            usuarioRepository,
            auditoriaService
        );
    });

    describe("inicioSesion", () => {

        test("debe iniciar sesión correctamente", async () => {

            const usuarioMock = {
                id: 1,
                nombre: "Admin",
                apellido: "Perez",
                correo: "admin@test.com",
                nombreUsuario: "admin",
                clave: "hash",
                idRol: 1,
                rolNombre: "ADMIN"
            };

            usuarioRepository.filtrarNombreUsuario
                .mockResolvedValue(usuarioMock);

            bcrypt.compare.mockResolvedValue(true);

            jwt.sign.mockReturnValue("fake-token");

            const resultado = await service.inicioSesion("admin", "1234");

            expect(usuarioRepository.filtrarNombreUsuario)
                .toHaveBeenCalledWith("admin");

            expect(bcrypt.compare)
                .toHaveBeenCalledWith("1234", "hash");

            expect(jwt.sign).toHaveBeenCalled();

            expect(resultado).toEqual({
                id: 1,
                nombre: "Admin",
                nombreUsuario: "admin",
                apellido: "Perez",
                correo: "admin@test.com",
                idRol: 1,
                rol: "ADMIN",
                token: "fake-token"
            });

        });

        test("debe lanzar error si faltan credenciales", async () => {

            await expect(
                service.inicioSesion("", "")
            ).rejects.toThrow("Credenciales incorrectas");

        });

        test("debe lanzar error si el usuario no existe", async () => {

            usuarioRepository.filtrarNombreUsuario.mockResolvedValue(null);

            await expect(
                service.inicioSesion("admin", "1234")
            ).rejects.toThrow("Credenciales incorrectas");

        });

        test("debe lanzar error si la contraseña es incorrecta", async () => {

            const usuarioMock = {
                id: 1,
                clave: "hash"
            };

            usuarioRepository.filtrarNombreUsuario
                .mockResolvedValue(usuarioMock);

            bcrypt.compare.mockResolvedValue(false);

            await expect(
                service.inicioSesion("admin", "1234")
            ).rejects.toThrow("Credenciales incorrectas");

        });

    });

    describe("cierreSesion", () => {

        test("debe registrar el cierre de sesión correctamente", async () => {

            usuarioRepository.registrarAccionUsuario
                .mockResolvedValue(true);

            const resultado = await service.cierreSesion(1);

            expect(usuarioRepository.registrarAccionUsuario)
                .toHaveBeenCalledWith(1, "CIERRE_SESION");

            expect(resultado).toEqual({
                message: "Sesión cerrada exitosamente"
            });

        });

        test("debe lanzar error si el usuario no está autenticado", async () => {

            await expect(
                service.cierreSesion(null)
            ).rejects.toThrow("Usuario no autenticado");

        });

    });

    describe("registrarAuditoria", () => {

        test("debe registrar auditoría correctamente", async () => {

            auditoriaService.registrar.mockResolvedValue(true);

            const resultado = await service.registrarAuditoria(
                1,
                "LOGIN",
                { ip: "127.0.0.1" }
            );

            expect(auditoriaService.registrar)
                .toHaveBeenCalledWith(1, "LOGIN", { ip: "127.0.0.1" });

            expect(resultado).toBe(true);

        });

    });

});