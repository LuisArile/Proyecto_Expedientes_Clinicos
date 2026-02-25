class Usuario {
    constructor(data={}) {
        this.id=data.id;
        this.nombre=data.nombre;
        this.apellido=data.apellido;
        this.nombreUsuario=data.nombreUsuario;
        this.clave=data.clave;
        this.rol=data.rol;
        this.activo=data.activo !==undefined ?data.activo:true;
        this.ultimoAcesso=data.ultimoAcesso;
        this.especialidad=data.especialidad;
    }


    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`.trim();
    }

    getNombre(){
    return this.nombre;
    }

    getMenuUsuario(){
        return [];
    }


    getPermisos(){
        return [];
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
            rol:this.rol,
            activo:this.activo,
            ultimoAcesso:this.ultimoAcesso
        };
    
    }

}

module.exports=Usuario;