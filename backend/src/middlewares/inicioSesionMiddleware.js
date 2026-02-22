const jwt = require("jsonwebtoken");


const validarToken =(req,res,siguiente)=>{
    const token = req.headers.authorization?.split("") [1];

    if (!token){
        res.status(401).json({error: "Token requerido"});
    }

    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.usuario=jwt.decoded;
        siguiente();
    } catch (error) {
        return res.status(401).json({error: "token invalido"});
    }
};

module.exports=validarToken;

