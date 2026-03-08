const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Crear roles
  const administrador = await prisma.rol.upsert({
    where: { nombre: 'ADMINISTRADOR' },
    update: {},
    create: { nombre: 'ADMINISTRADOR' },
  });

  const medico = await prisma.rol.upsert({
    where: { nombre: 'MEDICO' },
    update: {},
    create: { nombre: 'MEDICO' },
  });

  const recepcionista = await prisma.rol.upsert({
    where: { nombre: 'RECEPCIONISTA' },
    update: {},
    create: { nombre: 'RECEPCIONISTA' },
  });

  const enfermero = await prisma.rol.upsert({
    where: { nombre: 'ENFERMERO' },
    update: {},
    create: { nombre: 'ENFERMERO' },
  });

  console.log('Roles creados:', { administrador, medico, recepcionista, enfermero });

  // Crear permisos
  const verExpediente = await prisma.permiso.upsert({
    where: { nombre: 'VER_EXPEDIENTE' },
    update: {},
    create: { nombre: 'VER_EXPEDIENTE' },
  });

  const crearExpediente = await prisma.permiso.upsert({
    where: { nombre: 'CREAR_EXPEDIENTE' },
    update: {},
    create: { nombre: 'CREAR_EXPEDIENTE' },
  });

  const editarExpediente = await prisma.permiso.upsert({
    where: { nombre: 'EDITAR_EXPEDIENTE' },
    update: {},
    create: { nombre: 'EDITAR_EXPEDIENTE' },
  });

  console.log('Permisos creados:', { verExpediente, crearExpediente, editarExpediente });

  // Asignar permisos por rol
  const permisosRol = [
    { idRol: enfermero.idRol, idPermiso: verExpediente.idPermiso },

    { idRol: recepcionista.idRol, idPermiso: verExpediente.idPermiso },
    { idRol: recepcionista.idRol, idPermiso: crearExpediente.idPermiso },
    { idRol: recepcionista.idRol, idPermiso: editarExpediente.idPermiso },

    { idRol: medico.idRol, idPermiso: verExpediente.idPermiso },

    { idRol: administrador.idRol, idPermiso: verExpediente.idPermiso },
    { idRol: administrador.idRol, idPermiso: crearExpediente.idPermiso },
    { idRol: administrador.idRol, idPermiso: editarExpediente.idPermiso },
  ];

  for (const pr of permisosRol) {
    await prisma.permisosPorRol.upsert({
      where: { idRol_idPermiso: { idRol: pr.idRol, idPermiso: pr.idPermiso } },
      update: {},
      create: pr,
    });
  }

  console.log('Permisos por rol asignados');

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });