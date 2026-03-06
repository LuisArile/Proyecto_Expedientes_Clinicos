class BusquedaPacienteDTO {
    constructor(query) {
        
        this.termino = (query.q || query.termino) ? String(query.q || query.termino).trim() : null;
        
        this.pagina = parseInt(query.page) || 1;
        this.limite = parseInt(query.limit) || 10;
        
        this.validar();
    }

    validar() {
        if (!this.termino || this.termino.length < 2) {
            throw new Error("El término de búsqueda debe tener al menos 2 caracteres.");
        }
        
        const regexSeguro = /^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ-]+$/;
        if (!regexSeguro.test(this.termino)) {
            throw new Error("El término de búsqueda contiene caracteres no permitidos.");
        }
    }
}

module.exports = BusquedaPacienteDTO;