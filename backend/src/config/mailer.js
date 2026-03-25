const nodemailer = require("nodemailer");

const mailConfig = process.env.EMAIL_SERVICE === 'gmail'
    ? {
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        }
    : {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // True si es 465 (Gmail)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    };

const transporter = nodemailer.createTransport(mailConfig);

transporter.verify().then(() => {
    console.log(`Servidor de correos (${process.env.EMAIL_SERVICE}) listo`);
}).catch((err) => {
    console.error("Error en la configuración de correo:", err);
});

module.exports = transporter;