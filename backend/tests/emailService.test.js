const emailService = require("../src/services/emailService");
const transporter = require("../src/config/mailer");

jest.mock("../src/config/mailer", () => ({
    sendMail: jest.fn().mockResolvedValue(true)
}));

describe("emailService", () => {
    it("debe enviar correo con credenciales", async () => {
        const usuario = {
            correo: "test@test.com",
            nombre: "Juan",
            nombreUsuario: "Juan123"
        };

        const passwordTemporal = "123456";

        await emailService.enviarCredenciales(usuario, passwordTemporal);

        expect(transporter.sendMail).toHaveBeenCalled();

        const mailArgs = transporter.sendMail.mock.calls[0][0];

        expect(mailArgs.to).toBe("test@test.com");
        expect(mailArgs.subject).toContain("credenciales");
        expect(mailArgs.html).toContain("Juan123");
        expect(mailArgs.html).toContain("123456");
    });
});