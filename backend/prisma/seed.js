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

  // DEFINICIÓN DE PERMISOS
  const permisosADefinir = [
    'CREAR_EXPEDIENTE',
    'VER_EXPEDIENTE',
    'EDITAR_EXPEDIENTE',
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
    'CITAS',
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
    { rol: 'ADMINISTRADOR', permisos: permisosADefinir },
    {
      rol: 'RECEPCIONISTA',
      permisos: [
        'CREAR_EXPEDIENTE',
        'VER_EXPEDIENTE',
        'EDITAR_EXPEDIENTE',
        'BUSCAR_PACIENTE',
        'GESTION_PACIENTES',
        'VER_DATOS_BASICOS',
        'VER_HISTORIAL_CLINICO',
        'VER_CONSULTAS',
        'VER_PRECLINICAS',
        'CITAS',
      ]
    },
    {
      rol: 'ENFERMERO',
      permisos: [
        'BUSCAR_PACIENTE',
        'VER_EXPEDIENTE',
        'PRECLINICA',
        'VER_PRECLINICAS',
        'VER_DATOS_BASICOS'
      ]
    },
    {
      rol: 'MEDICO',
      permisos: [
        'BUSCAR_PACIENTE',
        'VER_EXPEDIENTE',
        'CONSULTA_MEDICA',
        'SOLICITUD_EXAMEN',
        'ADJUNTAR_DOCUMENTOS',
        'VER_DATOS_BASICOS',
        'VER_HISTORIAL_CLINICO',
        'VER_PRECLINICAS',
        'VER_CONSULTAS',
        'VER_RECETAS',
        'VER_EXAMENES',
        'VER_DOCUMENTOS',
        'VER_DIAGNOSTICOS'
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

  // CREACIÓN DE USUARIO ADMIN
  await prisma.usuario.upsert({
    where: { nombreUsuario: 'admin' },
    update: {},
    create: {
      nombreUsuario: 'admin',
      correo: 'admin@clinica.com',
      clave: '$2b$10$JJnP4/7I3Bv.RZJKhNmn1uS5oRQ2VFAy8p0cZug2DNmfmQdqKHCy6',
      nombre: 'Administrador',
      apellido: 'General',
      idRol: rolesDB['ADMINISTRADOR'].idRol,
      activo: true,
      debeCambiarPassword: false
    }
  });
  console.log('Usuario administrador creado');

  // CREACIÓN DE ESPECIALIDADES
  const especialidadesNombres = [
    'Cardiología',
    'Ginecología',
    'Dermatología',
    'Neumología',
    'Urología'
  ];

  const especialidadesDB = {};

  for (const nombre of especialidadesNombres) {
    const especialidad = await prisma.especialidad.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
    especialidadesDB[nombre] = especialidad;
  }
  console.log('Especialidades creadas');

  // CREACIÓN DE EXÁMENES
  const examenes = [
    { nombre: 'Electrocardiograma', especialidad: 'Cardiología' },
    { nombre: 'Ultrasonido Pélvico', especialidad: 'Ginecología' },
    { nombre: 'Biopsia de Piel', especialidad: 'Dermatología' },
    { nombre: 'Espirometría', especialidad: 'Neumología' },
    { nombre: 'Ultrasonido Renal', especialidad: 'Urología' },
  ];

  for (const examen of examenes) {
    await prisma.examen.upsert({
      where: { nombre: examen.nombre },
      update: {},
      create: {
        nombre: examen.nombre,
        especialidadId: especialidadesDB[examen.especialidad].id,
        estado: true,
      },
    });
  }
  console.log('Exámenes creados');

  // CREACIÓN DE CATEGORÍAS DE MEDICAMENTOS
  const categoriasNombres = [
    'Antibióticos',
    'Analgésicos',
    'Antiinflamatorios',
    'Antihipertensivos',
    'Antialérgicos'
  ];

  const categoriasDB = {};

  for (const nombre of categoriasNombres) {
    const categoria = await prisma.categoriaMedicamento.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
    categoriasDB[nombre] = categoria;
  }
  console.log('Categorías de medicamentos creadas');

  // CREACIÓN DE MEDICAMENTOS
  const medicamentos = [
    { nombre: 'Amoxicilina', categoria: 'Antibióticos' },
    { nombre: 'Paracetamol', categoria: 'Analgésicos' },
    { nombre: 'Ibuprofeno', categoria: 'Antiinflamatorios' },
    { nombre: 'Losartán', categoria: 'Antihipertensivos' },
    { nombre: 'Loratadina', categoria: 'Antialérgicos' },
  ];

  for (const medicamento of medicamentos) {
    await prisma.medicamento.upsert({
      where: { nombre: medicamento.nombre },
      update: {},
      create: {
        nombre: medicamento.nombre,
        categoriaId: categoriasDB[medicamento.categoria].id,
        estado: true,
      },
    });
  }
  console.log('Medicamentos creados');
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });