const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // DEFINICIÓN DE ROLES
  const rolesADefinir = ['ADMINISTRADOR', 'MEDICO', 'RECEPCIONISTA', 'ENFERMERO'];
  const rolesDB = {};

  for (const nombreRol of rolesADefinir) {
    const rol = await prisma.rol.upsert({
      where: { nombre: nombreRol },
      update: {},
      create: { nombre: nombreRol },
    });
    rolesDB[nombreRol] = rol;
  }
  console.log('Roles procesados');

  const permisosADefinir = [
    'CREAR_EXPEDIENTE',
    'GESTION_ROLES',
    'BUSCAR_PACIENTE',
    'GESTION_USUARIOS',
    'AUDITORIA',
    'CATALOGO_MEDICAMENTOS',
    'CATALOGO_EXAMENES',
    'GESTION_PACIENTES',
    'PRECLINICA',
    'CONSULTA_MEDICA',
    'SOLICITUD_EXAMEN',
    'ADJUNTAR_DOCUMENTOS',
    // --- PERMISOS DE VISUALIZACIÓN ---
    'VER_DATOS_BASICOS',
    'VER_HISTORIAL_CLINICO',
    'VER_PRECLINICAS',
    'VER_CONSULTAS',
    'VER_RECETAS',
    'VER_EXAMENES',
    'VER_DOCUMENTOS',
    'VER_DIAGNOSTICOS'
  ];

  const permisosDB = {};

  for (const nombrePermiso of permisosADefinir) {
    const permiso = await prisma.permiso.upsert({
      where: { nombre: nombrePermiso },
      update: {},
      create: { nombre: nombrePermiso },
    });
    permisosDB[nombrePermiso] = permiso;
  }
  console.log('Permisos creados');

  // ASIGNACIÓN DE PERMISOS POR ROL
  const matrizAsignacion = [
    { 
      rol: 'ADMINISTRADOR', 
      permisos: permisosADefinir // Acceso completo
    },
    { 
      rol: 'RECEPCIONISTA', 
      permisos: ['CREAR_EXPEDIENTE', 'BUSCAR_PACIENTE', 'GESTION_PACIENTES', 'VER_DATOS_BASICOS', 'VER_HISTORIAL_CLINICO',] 
    },
    { 
      rol: 'ENFERMERO', 
      permisos: ['BUSCAR_PACIENTE', 'PRECLINICA', 'VER_PRECLINICAS', 'VER_DATOS_BASICOS'] 
    },
    { 
      rol: 'MEDICO', 
      permisos: [
        'BUSCAR_PACIENTE', 'CONSULTA_MEDICA', 'SOLICITUD_EXAMEN', 'ADJUNTAR_DOCUMENTOS',
        'VER_DATOS_BASICOS', 'VER_HISTORIAL_CLINICO', 'VER_PRECLINICAS', 'VER_CONSULTAS', 'VER_RECETAS', 'VER_EXAMENES', 'VER_DOCUMENTOS', 'VER_DIAGNOSTICOS'
      ] 
    }
  ];

  for (const asignacion of matrizAsignacion) {
    const rol = rolesDB[asignacion.rol];
    
    for (const nombrePermiso of asignacion.permisos) {
      const permiso = permisosDB[nombrePermiso];
      
      await prisma.permisosPorRol.upsert({
        where: { 
          idRol_idPermiso: { 
            idRol: rol.idRol, 
            idPermiso: permiso.idPermiso 
          } 
        },
        update: {},
        create: { 
          idRol: rol.idRol, 
          idPermiso: permiso.idPermiso 
        },
      });
    }
  }
  console.log('Matriz de permisos asignada correctamente');
  
  const usuariosSinRol = await prisma.usuario.findMany({
    where: { idRol: 0 }
  });

  if (usuariosSinRol.length > 0) {
    await prisma.usuario.updateMany({
      where: { idRol: { equals: null } },
      data: { idRol: rolesDB['ADMINISTRADOR'].idRol },
    });
    console.log(`Se asignó el rol ADMINISTRADOR a ${usuariosSinRol.length} usuarios.`);
  }
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });