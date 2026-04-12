class MedicamentoController {
  constructor(service) {
    this.service = service;
  }

  // Buscar medicamentos (por nombre o categoría)
  buscar = async (req, res, next) => {
    try {
      const data = await this.service.buscar(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // Obtener medicamentos activos
  obtenerActivos = async (req, res, next) => {
    try {
      const data = await this.service.obtenerActivos();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // Obtener un medicamento por ID
  obtenerPorId = async (req, res, next) => {
    try {
      const data = await this.service.obtenerPorId(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // Crear un nuevo medicamento
  crear = async (req, res, next) => {
    try {
      const usuarioId = req.usuario?.id;
      const data = await this.service.crear(req.body, usuarioId);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // Actualizar un medicamento existente
  actualizar = async (req, res, next) => {
    try {
      const usuarioId = req.usuario?.id;
      const data = await this.service.actualizar(
        req.params.id,
        req.body,
        usuarioId
      );
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // Alternar el estado (activo/inactivo) del medicamento
  alternarEstado = async (req, res, next) => {
    try {
      const usuarioId = req.usuario?.id;
      const data = await this.service.alternarEstado(
        req.params.id,
        usuarioId
      );
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = MedicamentoController;