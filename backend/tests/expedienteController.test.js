const expedienteController = require("../src/controllers/expedienteController");

describe("expedienteController", () => {

    let controller;
    let mockService;
    let req;
    let res;

    beforeEach(() => {

        mockService = {
            crearConPaciente: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerPorId: jest.fn(),
            obtenerPorPaciente: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn()
        };

        controller = new expedienteController(mockService);

        req = {
            body: {},
            params: {},
            usuario: { id: 1 }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

    });

    test("debe retornar 400 si el body está vacío", async () => {

        req.body = null;

        await controller.crearConPaciente(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false
            })
        );

    });

    test("debe retornar 400 si falta paciente", async () => {

        req.body = { expediente: {} };

        await controller.crearConPaciente(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

    });

    test("debe retornar 400 si falta expediente", async () => {

        req.body = { paciente: {} };

        await controller.crearConPaciente(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

    });

    test("debe crear expediente correctamente", async () => {

        const resultadoMock = { id: 10 };

        mockService.crearConPaciente.mockResolvedValue(resultadoMock);

        req.body = {
            paciente: { nombre: "Juan" },
            expediente: { estado: "activo" }
        };

        await controller.crearConPaciente(req, res);

        expect(mockService.crearConPaciente).toHaveBeenCalledWith(
            req.body.paciente,
            req.body.expediente,
            1
        );

        expect(res.status).toHaveBeenCalledWith(201);

    });

    test("debe obtener todos los expedientes", async () => {

        const expedientesMock = [{ id: 1 }, { id: 2 }];

        mockService.obtenerTodos.mockResolvedValue(expedientesMock);

        await controller.obtenerTodos(req, res);

        expect(mockService.obtenerTodos).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expedientesMock
        });

    });

    test("debe obtener expediente por id", async () => {

        req.params.idExpediente = 5;

        const expedienteMock = { id: 5 };

        mockService.obtenerPorId.mockResolvedValue(expedienteMock);

        await controller.obtenerPorId(req, res);

        expect(mockService.obtenerPorId).toHaveBeenCalledWith(5);

    });

    test("debe eliminar expediente", async () => {

        req.params.idExpediente = 5;

        mockService.eliminar.mockResolvedValue(true);

        await controller.eliminar(req, res);

        expect(mockService.eliminar).toHaveBeenCalledWith(5);

    });

});