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
    estado: {
        type: String,
        default: 'A',
        required: true
    },
    rol: {
        type: String,
        required: true,
        default: "ADMIN_ROLE"
    },

});

module.exports = model('administrador', administradorSchema);