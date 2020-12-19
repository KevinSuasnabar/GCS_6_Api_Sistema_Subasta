const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    state: {
        required: false,
        type: String,
        default: "ENVIADO"
    },
    imgs: {
        type: [String],
        required: false
    },
    fecha_registro: {
        type: Date,
        default: Date.now,
        require: true
    },
    fecha_actualizacion: {
        type: Date,
        require: false
    },
    motivo_rechazo: {
        type: String,
        required: false
    },
    motivo_subsanacion: {
        type: String,
        required: false
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Product', ProductSchema);