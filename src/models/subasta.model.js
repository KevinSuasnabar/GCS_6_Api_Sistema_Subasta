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
    vendedor: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comprador: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    hora_inicio: {
        type: Date,
        required: false
    },
    hora_fin: {
        type: Date,
        required: false
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
    },
    precio_minimo: {
        type: Number,
        required: false
    },
    precio_pagado: {
        type: Number,
        required: false
    },
    calificacion: {
        type: Number,
        required: false
    },
    mensaje_calificacion: {
        type: String,
        required: false
    }

});
module.exports = model('Subasta', SubastaSchema);