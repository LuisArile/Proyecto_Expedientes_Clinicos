/**
 * Decorador Base
 */
class DecoradorBase {
    constructor(service) {
        this.service = service;
    }

    // Métodos ha  decorar
    async crear(data, usuarioId) {
        return this.service.crear(data, usuarioId);
    }

    async actualizar(id, data, usuarioId) {
        return this.service.actualizar(id, data, usuarioId);
    }

    async eliminar(id, usuarioId) {
        return this.service.eliminar(id, usuarioId);
    }

    async obtenerTodos() {
        return this.service.obtenerTodos();
    }

    async obtenerPorId(id) {
        return this.service.obtenerPorId(id);
    }

    async cambiarPassword(userId, currentPassword, newPassword) {
        return this.service.cambiarPassword(userId, currentPassword, newPassword);
    }

    async alternarEstado(id, usuarioActualId) {
        return this.service.alternarEstado(id, usuarioActualId);
    }

    async enviarCredenciales(usuarioId, administradorId) {
        return this.service.enviarCredenciales(usuarioId, administradorId);
    }
}

module.exports = DecoradorBase;
