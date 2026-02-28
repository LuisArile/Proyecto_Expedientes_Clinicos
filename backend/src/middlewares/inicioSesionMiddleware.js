const jwt = require("jsonwebtoken");


const validarToken =(req,res,siguiente)=>{
    console.log("Header Authorization:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        res.status(401).json({error: "Token requerido"});
    }

    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.usuario= decoded;
        siguiente();
    } catch (error) {
        console.error("Error validando token:", error.message);
        return res.status(401).json({error: "token invalido"});
    }
};

module.exports=validarToken;
