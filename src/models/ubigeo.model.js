const { Schema, model } = require('mongoose');

const UbigeoSchema = Schema({
    department: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    direction: {
        type: String,
        required: true
    }
});

module.exports = model('Ubigeo', UbigeoSchema);