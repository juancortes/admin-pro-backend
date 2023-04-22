const { response } = require("express");

const Hospital = require('../models/hospital');

const getHospitales = async(req, resp=response) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre img')
    resp.json({
        ok:true,
        hospitales
    })
}

const crearHospital = async(req, resp=response) => {

    const hospital = new Hospital({
        usuario: req.uid,
        ...req.body
    });
    try {        
        const hospitalDB = await hospital.save();

        resp.json({
            ok:true,
            hospitalDB
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Hable con el admin'
        })
    }
    
}

const actualizarHospital = (req, resp=response) => {
    resp.json({
        ok:true,
        msg: ' actualizarHospitales'
    })
}

const borrarHospital = (req, resp=response) => {
    resp.json({
        ok:true,
        msg: ' borrarHospitales'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}