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
            actualizarUltimoAcceso: jest.fn()
        };

        auditoriaService = {
            registrarSesion: jest.fn()
        };

        service = new InicioSesionService(usuarioRepository, auditoriaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
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
                activo: true,
                idRol: 1,
                rolNombre: "ADMIN",
                permisos: ["LEER", "ESCRIBIR"]
            };

            usuarioRepository.filtrarNombreUsuario.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake-token");
            usuarioRepository.actualizarUltimoAcceso.mockResolvedValue(true);
            auditoriaService.registrarSesion.mockResolvedValue(true);

            const resultado = await service.inicioSesion("admin", "1234");

            expect(usuarioRepository.filtrarNombreUsuario).toHaveBeenCalledWith("admin");
            expect(bcrypt.compare).toHaveBeenCalledWith("1234", "hash");
            expect(usuarioRepository.actualizarUltimoAcceso).toHaveBeenCalledWith(1);
            expect(auditoriaService.registrarSesion).toHaveBeenCalledWith(1, "INICIO_SESION", "admin");
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, idRol: 1, rol: "ADMIN" },
                expect.any(String),
                { expiresIn: "8h" }
            );

            expect(resultado).toEqual({
                id: 1,
                nombre: "Admin",
                apellido: "Perez",
                correo: "admin@test.com",
                nombreUsuario: "admin",
                idRol: 1,
                rol: "ADMIN",
                permisos: ["LEER", "ESCRIBIR"],
                token: "fake-token"
            });
        });

        test("debe lanzar error si faltan credenciales", async () => {
            await expect(service.inicioSesion("", "")).rejects.toThrow("Credenciales incorrectas");
        });

        test("debe lanzar error si el usuario no existe", async () => {
            usuarioRepository.filtrarNombreUsuario.mockResolvedValue(null);
            await expect(service.inicioSesion("admin", "1234")).rejects.toThrow("Credenciales incorrectas");
        });

        test("debe lanzar error si la contraseña es incorrecta", async () => {
            const usuarioMock = { id: 1, clave: "hash" };
            usuarioRepository.filtrarNombreUsuario.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(false);

            await expect(service.inicioSesion("admin", "1234")).rejects.toThrow("Credenciales incorrectas");
        });

    });

    describe("cierreSesion", () => {

        test("debe registrar el cierre de sesión correctamente", async () => {
            auditoriaService.registrarSesion.mockResolvedValue(true);

            const resultado = await service.cierreSesion(1);

            expect(auditoriaService.registrarSesion).toHaveBeenCalledWith(1, "CIERRE_SESION");
            expect(resultado).toEqual({ message: "Sesión cerrada exitosamente" });
        });

        test("debe lanzar error si el usuario no está autenticado", async () => {
            await expect(service.cierreSesion(null)).rejects.toThrow("Usuario no autenticado");
        });

    });

});