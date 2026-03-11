class Usuario {
    constructor(data={}) {
        this.id=data.id;
        this.nombre=data.nombre;
        this.apellido=data.apellido;
        this.correo=data.correo;
        this.nombreUsuario=data.nombreUsuario;
        this.clave=data.clave;
        this.idRol=data.idRol;
        this.rolNombre=data.rolNombre;
        this.activo=data.activo !==undefined ?data.activo:true;
        this.ultimoAcesso=data.ultimoAcesso;
        this.permisos = data.permisos || [];
    }


    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`.trim();
    }

    getNombre(){
    return this.nombre;
    }

    getMenu(){
        return [];
    }

    getPermisos() {
        return this.permisos;
    }

    getBienvenida(){
        return `Bienvenido ${this.nombre}`;
    }

    toJSON(){
        return {
            id:this.id,
            nombre:this.nombre,
            apellido:this.apellido,
            NombreCompleto:this.getNombreCompleto(),
            correo:this.correo,
            nombreUsuario:this.nombreUsuario,
            idRol:this.idRol,
            rol:this.rolNombre,
            activo:this.activo,
            ultimoAccesso:this.ultimoAccesso,
            permisos: this.getPermisos()
        };
    
    }

}

module.exports=Usuario;