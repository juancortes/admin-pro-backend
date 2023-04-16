const { response } = require("express");
const bcrypt  = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const login = async(req, resp= response) => {
    const { email, password } = req.body;
    try {

        //Verifica email
        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return resp.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            })
        }

        //Verificar contraseña
        const validPassord = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassord) {
            return resp.status(404).json({
                ok:false,
                msg: 'Contraseña no valida'
            })
        }

        //Generar el Token - JWT
        const token = await generarJWT(usuarioDB.id);

        resp.json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    login
}