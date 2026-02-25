
class inicioSesionController {

    constructor(inicioSesionService){
        this.inicioSesionService=inicioSesionService;
    }

async  inicioSesion(req,res) {
        
        try {
        const {nombreUsuario, clave }=req.body;
    
        const respuestaLogin= await this.inicioSesionService.inicioSesion(nombreUsuario,clave);
        res.json({data: respuestaLogin});
            
        } catch (error) {
            res.status(401).json({error: error.message});
        }
    }

    
        async  cierreSesion(req,res) {
                
                try {
                //asumiendo que viene de milddleware de autenticacion
                const respuestaLogin= await this.inicioSesionService.cierreSesion(
                    req.usuario.id); res.json({data:respuestaLogin})

            } catch (error){
                res.status(400).json({
                    error:error.message
                });
            }
    }
}


module.exports =inicioSesionController;