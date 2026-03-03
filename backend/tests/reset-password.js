// reset-password.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function resetPassword() {
    console.log('=== CAMBIAR CONTRASEÑA ===');
    
    rl.question('Nombre de usuario: ', async (username) => {
        const user = await prisma.usuario.findUnique({
            where: { nombreUsuario: username }
        });
        
        if (!user) {
            console.log('Usuario no encontrado');
            rl.close();
            return;
        }
        
        console.log(`Usuario encontrado: ${user.nombre} (${user.rol})`);
        console.log(`Hash actual: ${user.clave}`);
        
        rl.question('Nueva contraseña: ', async (newPassword) => {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            await prisma.usuario.update({
                where: { id: user.id },
                data: { clave: hashedPassword }
            });
            
            console.log('Contraseña actualizada exitosamente');
            console.log(`Nuevo hash: ${hashedPassword}`);
            
            // Verificar que funciona
            const verify = await bcrypt.compare(newPassword, hashedPassword);
            console.log(`Verificación: ${verify ? ' Correcta' : ' Error'}`);
            
            rl.close();
        });
    });
}

resetPassword();