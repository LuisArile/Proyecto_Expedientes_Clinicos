const jwt = require("jsonwebtoken");


const validarToken =(req,res,next)=>{
    console.log("Header Authorization:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // DEBUG: Para ver si la clave está cargada
    console.log("JWT_SECRET cargado:", process.env.JWT_SECRET ? "SÍ" : "NO");

    if (!token) return res.status(401).json({error: "Token requerido"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Error validando token:", err.message);
            return res.status(401).json({ error: "token invalido" });
        }
        req.usuario = user;
        next();
    });
};

module.exports=validarToken;
