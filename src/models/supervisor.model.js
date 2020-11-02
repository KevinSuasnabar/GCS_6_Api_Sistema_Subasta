const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: false
    },
    especialidad: {
        type: String,
        required: false
    },
    categoria: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['A', 'I'],
        required: true
    },
    password: {
        type: String,
        required: true
    }

});

module.exports = model('supervisor', supervisorSchema);