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

const actualizarHospital = async(req, resp=response) => {
    const id = req.params.id
    const uid = req.uid;
    try {
        const hospital  = await Hospital.findById(id);
        if(!hospital) {
            return resp.status(404).json({
                ok:false,
                msg:'Hospital no encontrado por id'
            });
        }

        const cambioHospital = {
            ...req.body,
            usuario: uid
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambioHospital, {new: true});

        resp.json({
            ok:true,
            hospital: hospitalActualizado
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:true,
            msg: ' Hable con el admin'
        })
    }
    
}

const borrarHospital = async(req, resp=response) => {
    const id = req.params.id
    try {
        const hospital  = await Hospital.findById(id);
        if(!hospital) {
            return resp.status(404).json({
                ok:true,
                msg:'Hospital no encontrado por id'
            });
        }

        await Hospital.findByIdAndDelete(id);


        resp.json({
            ok:true,
            msg: 'Hospita elminado'
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:true,
            msg: ' Hable con el admin'
        })
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}