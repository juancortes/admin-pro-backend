const { response } = require("express");
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async(req, resp=response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');
    
    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({
            nombre: regex
        }),
        Medico.find({
            nombre: regex
        }),
        Hospital.find({
            nombre: regex
        })
    ]);

    resp.json({
        ok:true,
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async(req, resp=response) => {
    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp(busqueda,'i');
    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({nombre: regex})
                                .populate("usuario","nombre img")
                                .populate("hospital","nombre img")
            break;
        case 'hospitales':
            data = await Hospital.find({nombre: regex})
                                .populate("usuario","nombre img")
            break;
        case 'usuarios':
            data = await Usuario.find({nombre: regex});            
            break;
        default:
            return resp.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            })
    }

    resp.json({
        ok:true,
        resultados: data
    });
    
    
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}