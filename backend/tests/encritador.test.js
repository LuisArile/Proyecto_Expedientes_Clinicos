const Encriptador = require("../src/utils/encritador");

describe("Encriptador", () => {

    test("debe encriptar una contraseña correctamente", async () => {

        const clave = "123456";

        const hash = await Encriptador.encriptar(clave);

        expect(hash).toBeDefined();
        expect(hash).not.toBe(clave);

    });

    test("debe comparar correctamente una contraseña válida", async () => {

        const clave = "123456";

        const hash = await Encriptador.encriptar(clave);

        const resultado = await Encriptador.comparar(clave, hash);

        expect(resultado).toBe(true);

    });

    test("debe retornar false si la contraseña es incorrecta", async () => {

        const hash = await Encriptador.encriptar("123456");

        const resultado = await Encriptador.comparar("654321", hash);

        expect(resultado).toBe(false);

    });

});