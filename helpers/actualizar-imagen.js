const fs = require('fs');
const Usuario  = require('../models/usuario');
const Medico   = require('../models/medico');
const Hospital = require('../models/hospital');
const borrarImage = (path) => {    

    if(fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
    }
}
let pathViejo = "";

const actualizarImagen = async(tipo, id,  nombreArchivo) => {
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if( !medico) {
                console.log("no se encontro medico");
                return false;
            }
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImage(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if( !hospital) {
                console.log("no se encontro el hospital");
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImage(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if( !usuario) {
                console.log("no se encontro el usuario");
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImage(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;
    }
}

module.exports = {
    actualizarImagen
}