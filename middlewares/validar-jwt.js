const jwt = require('jsonwebtoken');

const validarJWT =(req, resp, next) => {
    ///leer el token
    const token = req.header('x-token');
    if(!token) {
        return resp.status(401).json({
            ok: false,
            msg: 'No hay toekn en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token,process.env.JWT_SECRET);
        req.uid = uid;
        next();
    } catch (error) {
        return resp.status(401).json({
            ok:false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}