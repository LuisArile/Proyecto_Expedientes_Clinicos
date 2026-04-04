class ExamenController {
  constructor(service) {
    this.service = service;
  }

  buscar = async (req, res, next) => {
    try {
      const data = await this.service.buscar(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  obtenerActivos = async (req, res, next) => {
    try {
      const data = await this.service.obtenerActivos();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  obtenerPorId = async (req, res, next) => {
    try {
      const data = await this.service.obtenerPorId(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  crear = async (req, res, next) => {
    try {
      const data = await this.service.crear(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  actualizar = async (req, res, next) => {
    try {
      const data = await this.service.actualizar(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  alternarEstado = async (req, res, next) => {
    try {
      const data = await this.service.alternarEstado(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = ExamenController;