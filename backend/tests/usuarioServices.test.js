const usuarioService = require("../src/services/usuarioServices");
const Encriptador = require("../src/utils/encritador");

jest.mock("../src/utils/encritador");

describe("usuarioService", () => {

    let service;
    let mockUsuarioRepository;

    beforeEach(() => {

        mockUsuarioRepository = {
            filtrarNombreUsuario: jest.fn(),
            crear: jest.fn(),
            registrarAccionUsuario: jest.fn(),
            obtenerTodos: jest.fn()
        };

        service = new usuarioService(mockUsuarioRepository);

    });

    test("debe crear usuario correctamente", async () => {

        const data = {
            nombreUsuario: "admin",
            clave: "123",
            rol: "ADMIN"
        };

        const usuarioMock = {
            Id: 1,
            toJSON: () => ({ id: 1, nombreUsuario: "admin" })
        };

        mockUsuarioRepository.filtrarNombreUsuario.mockResolvedValue(null);
        Encriptador.encriptar.mockResolvedValue("clave_encriptada");

        mockUsuarioRepository.crear.mockResolvedValue(usuarioMock);

        const resultado = await service.crear(data);

        expect(Encriptador.encriptar).toHaveBeenCalledWith("123");

        expect(mockUsuarioRepository.crear).toHaveBeenCalled();

        expect(mockUsuarioRepository.registrarAccionUsuario)
            .toHaveBeenCalledWith(1, "USUARIO_CREADO", { rol: "ADMIN" });

        expect(resultado).toEqual({ id: 1, nombreUsuario: "admin" });

    });

    test("debe lanzar error si el nombre de usuario ya existe", async () => {

        mockUsuarioRepository.filtrarNombreUsuario.mockResolvedValue({ id: 1 });

        await expect(
            service.crear({ nombreUsuario: "admin", clave: "123" })
        ).rejects.toThrow();

    });

    test("obtenerTodos debe retornar lista de usuarios", async () => {

        const usuariosMock = [
            { toJSON: () => ({ id: 1 }) },
            { toJSON: () => ({ id: 2 }) }
        ];

        mockUsuarioRepository.obtenerTodos.mockResolvedValue(usuariosMock);

        const resultado = await service.obtenerTodos();

        expect(resultado).toEqual([
            { id: 1 },
            { id: 2 }
        ]);

    });

    test("obtenerTodos debe manejar errores", async () => {

        mockUsuarioRepository.obtenerTodos
            .mockRejectedValue(new Error("DB error"));

        await expect(
            service.obtenerTodos()
        ).rejects.toThrow("Error al obtener usuarios");

    });

});