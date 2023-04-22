const path = require('path');
const fs   = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, resp = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];
    if (!tiposValidos.includes(tipo))
    {
        return resp.status(400).json({
            ok: false,
            msg:'No es un médico, usuairo u hospital (tipo)'
        })
    }

    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok:false,
            msg: 'No se envio ningún archivo'
        });
    }

    //procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extenxionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extenxionArchivo))
    {
        return resp.status(400).json({
            ok:false,
            msg: 'No se una extensión permitida'
        });
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extenxionArchivo }`;

    //Path del archivo a guardar
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;
    // Mover la imagen
    file.mv(path, (err) =>  {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg: 'Error al mover la image'
            });
        }

        //Actualizar BD
        actualizarImagen(tipo, id, nombreArchivo);

        resp.json({
            ok:true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

   
}

const retornaImagen = (req, resp = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    //Imagen por defecto
    if( fs.existsSync(pathImg)){
        resp.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
        resp.sendFile(pathImg);

    }

}

module.exports = {
    fileUpload,
    retornaImagen
};