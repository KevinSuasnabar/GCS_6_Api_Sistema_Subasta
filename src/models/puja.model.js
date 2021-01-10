const { Schema, model } = require('mongoose');

const PujaSchema = Schema({
    monto: {
        required: true,
        type: Number
    },
    hora: {
        required: true,
        type: String
    },
    dia: {
        required: true,
        type: Date
    },
    comprador: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
module.exports = model('Puja', PujaSchema);