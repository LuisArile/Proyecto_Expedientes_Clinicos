const prisma = require('../config/prisma');

class pacienteRepository {
    
    async crear(data) {
        try {
            const resultado = await prisma.paciente.create({
                data: {
                    dni: data.dni,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo || null,
                    telefono: data.telefono || null,
                    fechaNacimiento: new Date(data.fechaNacimiento),
                    genero: data.genero,
                    idResidencia: data.idResidencia
                }
            });
            return resultado;
        } catch (error) {
            throw new Error(`Error al crear paciente: ${error.message}`);
        }
    }

    async obtenerTodos() {
        try {
            const resultados = await prisma.paciente.findMany({
                include: { expedientes: true }
            });
            return resultados;
        } catch (error) {
            throw new Error(`Error al obtener pacientes: ${error.message}`);
        }
    }

    async obtenerPorId(idPaciente) {
        try {
            const data = await prisma.paciente.findUnique({
                where: { idPaciente: Number(idPaciente) },
                include: { expedientes: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar paciente: ${error.message}`);
        }
    }

    async obtenerPorDni(dni) {
        try {
            const data = await prisma.paciente.findFirst({
                where: { dni: dni },
                include: { expedientes: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar paciente por DNI: ${error.message}`);
        }
    }

    async actualizar(idPaciente, data) {
        try {
            return await prisma.paciente.update({
                where: { idPaciente: Number(idPaciente) },
                data: {
                    dni: data.dni || undefined,
                    nombre: data.nombre || undefined,
                    apellido: data.apellido || undefined,
                    correo: data.correo || undefined,
                    telefono: data.telefono || undefined,
                    fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
                    genero: data.genero || undefined,
                    idResidencia: data.idResidencia || undefined
                }
            });
        } catch (error) {
            throw new Error(`Error al actualizar paciente: ${error.message}`);
        }
    }
}

module.exports = pacienteRepository;
