const { response } = require("express");
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getMedicos = async(req, resp=response) => {

    const medicos = await Medico.find()
                            .populate('usuario','nombre img')
                            .populate('hospital','nombre img');
    resp.json({
        ok:true,
        medicos
    })
}

const crearMedico = async(req, resp=response) => {
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    console.log(uid)
    try {        
        const medicoDB = await medico.save();

        resp.json({
            ok:true,
            medicoDB
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Hable con el admin'
        })
    }
}

const actualizarMedico = async(req, resp=response) => {
    const id = req.params.id
    const uid = req.uid;
    const idHospital = req.body.hospital;

    try {
        const medico = await Medico.findById(id);
        if(!medico) {
            return resp.status(404).json({
                ok:false,
                msg:'Medico no encontrado por id'
            });
        }

        const hospital = await Hospital.findById(idHospital);
        if(!hospital) {
            return resp.status(404).json({
                ok:false,
                msg:'Hospital no encontrado por id'
            });
        }

        const cambioMedico = {
            ...req.body,
            usuario: uid
        };
        
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambioMedico, {new: true});
        
        resp.json({
            ok:true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })    
    }
    
}

const borrarMedico = async(req, resp=response) => {
    const id = req.params.id

    try {
        const medico = await Medico.findById(id);
        if(!medico) {
            return resp.status(404).json({
                ok:false,
                msg:'Medico no encontrado por id'
            });
        }

        await Medico.findByIdAndDelete(id);
        
        resp.json({
            ok:true,
            msg: "Medico borrado "
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })    
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}