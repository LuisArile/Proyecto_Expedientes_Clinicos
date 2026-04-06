const prisma = require('../config/prisma');

class consultaMedicaService {
    constructor(consultaRepository, recetaRepository, expedienteRepository, auditoriaService) {
        this.consultaRepository = consultaRepository;
        this.recetaRepository = recetaRepository;
        this.expedienteRepository = expedienteRepository;
        this.auditoriaService = auditoriaService;
    }

    // Validaciones 
    validarDiagnostico(diagnostico) {
        const errores = [];
        if (!diagnostico) {
            errores.push('El diagnóstico es obligatorio');
            return errores;
        }
        
        if (!diagnostico.id) errores.push('El ID del diagnóstico es requerido');
        
        if (!diagnostico.descripcion) errores.push('La descripción es requerida');

        if (!diagnostico.tipo) errores.push('El tipo (PRESUNTIVO/DEFINITIVO) es requerido');
        
        return errores;
    }

    // Validación  de recetas
    validarRecetas(recetas) {
        const errores = [];
        if (!recetas || recetas.length === 0) {
            errores.push('Debe incluir al menos una receta');
            return errores;
        }

        recetas.forEach((r, i) => {
            if (!r.medicamento) errores.push(`Receta ${i+1}: medicamento requerido`);
            if (!r.dosis) errores.push(`Receta ${i+1}: dosis requerida`);
        });
        return errores;
    }

    async registrar(expedienteId, medicoId, datos) {
        try {
            // Verificar si existe expediente
            const expediente = await this.expedienteRepository.obtenerPorId(expedienteId);
            if (!expediente) throw new Error('Expediente no encontrado');

            // Validar diagnóstico presuntivo
            const errDiag = this.validarDiagnostico(datos.diagnostico);
            if (errDiag.length > 0) throw new Error(errDiag.join(', '));

            // FILTRAR RECETAS VÁLIDAS (para evitar guardar recetas vacías o incompletas)
            const recetasValidas = (datos.recetas || []).filter(r => 
                r.medicamento?.trim() && r.dosis?.trim()
            );

            // Si es definitivo se requiere recetas
            if (datos.diagnostico.tipo === 'DEFINITIVO') {
                const errRec = this.validarRecetas(recetasValidas);
                if (errRec.length > 0) throw new Error(errRec.join(', '));
            }

            // Guardar todo 
            return await prisma.$transaction(async (tx) => {
                // Crear consulta
                const consulta = await this.consultaRepository.crear({
                    expedienteId,
                    medicoId,
                    motivo: datos.motivo,
                    diagnostico: datos.diagnostico,
                    observaciones: datos.observaciones,
                    tipoConsulta: datos.diagnostico.tipo
                }, tx);

                // Crear recetas si hay (usando filtradas)
                if (recetasValidas.length > 0) {
                    await this.recetaRepository.crearMultiples(consulta.id, recetasValidas, tx);
                }

                // EXÁMENES 
                if (datos.examenes?.length > 0) {

                    const examenesData = datos.examenes
                        .filter(e => e.examenId)
                        .map(e => ({
                            consultaId: consulta.id,
                            examenId: e.examenId,
                            prioridad: (e.prioridad || "MEDIA").toUpperCase()
                        }));

                    await tx.consultaExamen.createMany({
                        data: examenesData
                    });
                }

                // Registrar en Auditoría 
                await this.auditoriaService.registrarAccionMedica(medicoId, "CONSULTA_MEDICA", {
                    idExpediente: expedienteId,
                    idConsulta: consulta.id,
                    examenes: Array.isArray(datos.examenes) ? datos.examenes.length > 0 : false,
                    medicamentos: recetasValidas.length > 0
                }, tx);

                return consulta;
            });

        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    // Obtener consultas de un expediente
    async obtenerPorExpediente(expedienteId) {
        try {
            return await this.consultaRepository.obtenerPorExpediente(expedienteId);
        } catch (error) {
            throw new Error(`Error al obtener consultas: ${error.message}`);
        }
    }

    // Obtener una consulta por ID
    async obtenerPorId(id) {
        try {
            const consulta = await this.consultaRepository.obtenerPorId(id);
            if (!consulta) throw new Error('Consulta no encontrada');
            return consulta;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = consultaMedicaService;