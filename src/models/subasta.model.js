const { Schema, model } = require('mongoose');

const SubastaSchema = Schema({
    codigo: {
        type: String,
        required: true
    },
    // user: {
    //     required: true,
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    producto: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    moneda: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: 'CREADO'
    },
    tipo: {
        type: String,
        required: true
    },
    fecha_inicio: {
        type: Date,
        required: false
    },
    fecha_fin: {
        type: Date,
        required: false
    }
});
module.exports = model('Subasta', SubastaSchema);