const transporter = require("../config/mailer");

const emailService = {
    enviarCredenciales: async (usuario, passwordTemporal) => {
        const mailOptions = {
        from: '"Sistema de Expedientes Clínicos" <soporte@clinica.com>',
        to: usuario.correo,
        subject: "Bienvenido - Tus credenciales de acceso",
        html: `
            <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
            <h2>Hola, ${usuario.nombre}</h2>
            <p>Se ha creado tu cuenta en el sistema de expedientes clínicos.</p>
            <p><strong>Usuario:</strong> ${usuario.nombreUsuario}</p>
            <p><strong>Contraseña Temporal:</strong> <span style="color: blue;">${passwordTemporal}</span></p>
            <br>
            <p style="color: red;">* Por seguridad, se te pedirá cambiar esta contraseña al iniciar sesión.</p>
            </div>
        `,
        };
        return await transporter.sendMail(mailOptions);
    }
};

module.exports = emailService;