const { Schema, model } = require('mongoose');

const ProductoHistorialSchema = Schema({
    producto: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    state: {
        required: true,
        type: String
    },
    accion: {
        type: String,
        required: false
    }, 
    fecha_accion: {
        type: Date,
        require: true
    },
    supervisor_name:{
        type: String,
        required: false
    },
    supervisor_lastname:{
        type: String,
        required: false
    }
});

module.exports = model('ProductoHistorial', ProductoHistorialSchema, 'productoHistorial');