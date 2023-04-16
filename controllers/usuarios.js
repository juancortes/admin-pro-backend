const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, resp)=>{
    const usuarios = await Usuario.find({},'nombre email role google');
    resp.json({
        ok:true,
        usuarios
    })
};

const crearUsuarios = async(req, resp=response)=>{
    const {email, password, nombre} = req.body;
    
    try {
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return resp.status(400).json({
                ok:false,
                msg: 'El Correo ya esta registrado'
            });
        }
        const usuario = new Usuario(req.body);
        
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();
        
        //Generar el Token - JWT
        const token = await generarJWT(usuario.id);

        resp.json({
            ok:true,
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
    
};

const actualizarUsuario = async(req, resp = response) => {
    //TODO validar token y comprobar si es el usuario correcto
    
    const uid = req.params.id;
    
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return resp.status(404).json({
                ok:false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;
        if(usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({email: email});
            if( existeEmail){
                return resp.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos, {new: true});

        resp.json({
            ok:true,
            usuario:usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async(req, resp = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return resp.status(404).json({
                ok:false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        resp.json({
            ok:true,
            msg: 'Usuario Borrado'
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}