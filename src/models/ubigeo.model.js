const { Schema, model } = require('mongoose');

const UserSchema = Schema({
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

module.exports = model('Ubigeo', UserSchema);