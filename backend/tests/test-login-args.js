// test-login-args.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function diagnosticarLogin(username, password) {
    console.log('\n========== DIAGNÓSTICO DE LOGIN ==========');
    console.log(' Información de la prueba:');
    console.log(`   Usuario: ${username}`);
    console.log(`   Contraseña: ${password ? '******' : 'No proporcionada'}`);
    console.log(`   Directorio actual: ${__dirname}`);
    
    try {
        // Verificar conexión a la base de datos
        console.log('\n📡 Verificando conexión a BD...');
        await prisma.$connect();
        console.log(' Conexión exitosa');
        
        // Buscar usuario
        console.log(`\n🔍 Buscando usuario: ${username}`);
        const usuarioDB = await prisma.usuario.findUnique({
            where: { nombreUsuario: username }
        });
        
        if (!usuarioDB) {
            console.log(' Usuario NO encontrado');
            console.log('\n Usuarios disponibles:');
            const todos = await prisma.usuario.findMany({
                select: { nombreUsuario: true, rol: true }
            });
            todos.forEach(u => console.log(`   - ${u.nombreUsuario} (${u.rol})`));
            return false;
        }
        
        console.log(' Usuario encontrado:');
        console.log(`   ID: ${usuarioDB.id}`);
        console.log(`   Nombre: ${usuarioDB.nombre} ${usuarioDB.apellido || ''}`);
        console.log(`   Rol: ${usuarioDB.rol}`);
        console.log(`   Correo: ${usuarioDB.correo || 'No especificado'}`);
        
        // Verificar contraseña
        console.log('\n Verificando contraseña...');
        console.log(`   Hash en BD: ${usuarioDB.clave ? '✅ Presente' : '❌ Ausente'}`);
        
        if (!usuarioDB.clave) {
            console.log(' ERROR: El usuario no tiene contraseña almacenada');
            return false;
        }
        
        if (!password) {
            console.log(' No se proporcionó contraseña para probar');
            return false;
        }
        
        // Comparar contraseñas
        console.log('   Comparando...');
        const valida = await bcrypt.compare(password, usuarioDB.clave);
        
        if (valida) {
            console.log(' ¡CONTRASEÑA CORRECTA!');
        } else {
            console.log('CONTRASEÑA INCORRECTA');
            console.log('\n Información adicional:');
            console.log(`   Longitud hash BD: ${usuarioDB.clave.length} caracteres`);
            console.log(`   Hash BD (primeros 20 chars): ${usuarioDB.clave.substring(0, 20)}...`);
            console.log(`   Longitud contraseña probada: ${password.length} caracteres`);
        }
        
        return valida;
        
    } catch (error) {
        console.error('\nERROR DURANTE LA PRUEBA:');
        console.error('   Mensaje:', error.message);
        console.error('   Stack:', error.stack);
        return false;
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Conexión cerrada');
    }
}

// Tomar argumentos de la línea de comandos
const args = process.argv.slice(2);
let username = args[0];
let password = args[1];

// Si no hay argumentos, preguntar interactivamente
if (!username || !password) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('No se proporcionaron argumentos. Modo interactivo:');
    rl.question('Nombre de usuario: ', (user) => {
        rl.question('Contraseña: ', async (pass) => {
            await diagnosticarLogin(user, pass);
            rl.close();
        });
    });
} else {
    diagnosticarLogin(username, password).then(() => process.exit());
}