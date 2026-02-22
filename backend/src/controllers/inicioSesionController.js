
class inicioSesionController {

    constructor(inicioSesionService){
        this.inicioSesionService=inicioSesionService;
    }

async  inicioSesion(req,res) {
        
        try {
            const {nombreUsuario, clave }=req.body;
    
           const respuestaLogin= await this.inicioSesionService.autenticacion(nombreUsuario,clave);
           res.json(respuestaLogin);
            
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }
}

module.exports =inicioSesionController;