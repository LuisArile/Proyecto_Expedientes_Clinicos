
/*
class usuarioController{
    constructor(usuarioService){
        this.usuarioService=usuarioService;
    }


    async  crear(req,res) {
        
        try {
            const usuario=await this.usuarioService.crearUsuario(req.body);
            res.status(201).json(usuario);
            
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }

    async  obtenerTodos(req,res) {
        
        try {
            const usuarios=await this.usuarioService.obtenerTodos();
            res.status(201).json(usuarios);
            
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }



}
*/
