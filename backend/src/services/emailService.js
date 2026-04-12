const transporter = require("../config/mailer");

class EmailService {
    async enviarCredenciales(usuario, passwordTemporal) {
        const fecha = new Date().toLocaleString('es-ES', { 
            dateStyle: 'long', 
            timeStyle: 'short' 
        });
        
        const systemURL = 'http://localhost:5173' || process.env.LOGIN_URL;

        const mailOptions = {
            from: '"Sistema de Expedientes Clínicos" <soporte@clinica.com>',
            to: usuario.correo,
            subject: "Credenciales de Acceso - Sistema de Gestión de Expedientes Clínicos",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #0c5460 0%, #17a2b8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">¡Bienvenido a la Institución!</h1>
                            <p style="margin: 8px 0 0 0; opacity: 0.9;">Tu cuenta ha sido creada exitosamente</p>
                        </div>

                        <!-- Body -->
                        <div style="padding: 30px; color: #333;">
                            <p style="margin: 0 0 20px 0; font-size: 16px;">
                                Estimado/a <strong>${usuario.nombre}</strong>,
                            </p>

                            <p style="margin: 0 0 25px 0; color: #555; line-height: 1.6;">
                                Se ha creado tu cuenta en el <strong>Sistema de Gestión de Expedientes Clínicos</strong>. 
                                A continuación encontrarás tus credenciales de acceso.
                            </p>

                            <!-- Credenciales Box -->
                            <div style="background: #f8f9fa; border-left: 4px solid #0c5460; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0 0 12px 0; font-size: 12px; color: #999; text-transform: uppercase; font-weight: bold;">
                                    Datos de Acceso
                                </p>
                                
                                <div style="margin: 12px 0;">
                                    <p style="margin: 0; font-size: 12px; color: #666;">USUARIO ASIGNADO:</p>
                                    <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #0c5460; font-family: 'Courier New', monospace;">
                                        ${usuario.nombreUsuario}
                                    </p>
                                </div>

                                <div style="margin: 16px 0;">
                                    <p style="margin: 0; font-size: 12px; color: #666;">CONTRASEÑA TEMPORAL:</p>
                                    <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #e74c3c; font-family: 'Courier New', monospace; background: #fff; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                                        ${passwordTemporal}
                                    </p>
                                </div>
                            </div>

                            <!-- Alert to change password -->
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 14px; color: #856404; font-weight: bold;">
                                    ⚠️  IMPORTANTE - Cambio Obligatorio de Contraseña
                                </p>
                                <p style="margin: 8px 0 0 0; font-size: 14px; color: #856404; line-height: 1.5;">
                                    Por razones de seguridad, <strong>DEBES cambiar la contraseña temporal en tu primer acceso</strong> 
                                    al sistema.
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${systemURL}/login" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #0c5460; color: white; text-decoration: none; padding: 12px 40px; border-radius: 4px; font-weight: bold; font-size: 16px;">
                                    Acceder al Sistema
                                </a>
                            </div>

                            <!-- Instructions -->
                            <div style="background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 16px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 12px; color: #0c5460; font-weight: bold;">
                                    📋 PASOS A SEGUIR:
                                </p>
                                <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #0c5460; font-size: 14px; line-height: 1.8;">
                                    <li>Accede con tu usuario y contraseña temporal</li>
                                    <li>Se abrirá un formulario para cambiar tu contraseña</li>
                                    <li>Crea una contraseña segura (se recomienda usar mayúsculas, minúsculas, números y caracteres especiales)</li>
                                    <li>Confirma tu nueva contraseña</li>
                                    <li>¡Listo! Podrás acceder a la página de inicio del sistema</li>
                                </ol>
                            </div>

                            <p style="margin: 25px 0 0 0; font-size: 14px; color: #555; line-height: 1.6;">
                                Si tienes problemas para acceder o cambiar tu contraseña, 
                                contacta al <strong>administrador del sistema</strong>.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #ddd;">
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                Fecha y Hora: <strong>${fecha}</strong>
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 11px; color: #bbb;">
                                © Sistema de Gestión de Expedientes Clínicos - Todos los derechos reservados
                            </p>
                        </div>
                    </div>
                </div>
            `,
        };
        return await transporter.sendMail(mailOptions);
    }
};

module.exports = EmailService;