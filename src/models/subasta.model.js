const { Schema, model } = require('mongoose');

const SubastaSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
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
            //CREADO - EN PROCESO - FINALIZADO - SUSPENDIDO
    },
    tipo: {
        type: String,
        required: true
            //INGLESA - HOLANDESA
    },
    modo: {
        type: String,
        required: true
            //ASYNC:CON TIEMPO - SINC:AL MOMENTO
    },
    fecha_inicio: {
        type: Date,
        required: false
    },
    fecha_fin: {
        type: Date,
        required: false
    },
    precio_base: {
        type: Number,
        required: true
    }
});
module.exports = model('Subasta', SubastaSchema);