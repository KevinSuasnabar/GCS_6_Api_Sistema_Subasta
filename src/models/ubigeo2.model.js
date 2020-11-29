const { Schema, model } = require('mongoose');

const Ubigeo2Schema = Schema({
    departmento: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    distrito: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    }
});

module.exports = model('Ubigeo2', Ubigeo2Schema, "ubigeo");