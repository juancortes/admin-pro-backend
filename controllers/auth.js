const { response } = require("express");
const bcrypt  = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");


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

const googleSignIn = async(req, resp= response) => {
    try {
    const {email, name, picture}  = await googleVerify(req.body.token);
    const usuarioDB = await Usuario.findOne({email});
    let usuario;

    if(!usuario) {
        usuario = new Usuario({
            nombre: name,
            email,
            password:'@@@',
            img: picture,
            google: true
        });
    } else {
        usuario = usuarioDB;
        usuario.google = true;
    }

    await usuario.save();

    //Generar el Token - JWT
    const token = await generarJWT(usuario.id);

    resp.json({
            ok:true,
            email, name, picture
        })
    } catch (error) {
        console.log(error);
        resp.status(400).json({
            ok:false,
            msg: 'Token de google no es correcto'
        })
    }
    
}

module.exports = {
    login,
    googleSignIn
}