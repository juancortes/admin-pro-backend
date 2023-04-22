const { Schema, model} = require('mongoose'); 

const HolpitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
},{ collection: 'hospitales'});

HolpitalSchema.method('toJSON',function() {
   const { __v, ...object } = this.toObject();
   return object;
})

module.exports = model('Hospital',HolpitalSchema);