const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: "CLIENT_ROLE"
    },
    card: {
        type: String,
        required: false
    },
    bornDate: {
        type: Date,
        required: false
    },
    state: {
        type: Boolean,
        required: false,
        default: true
    },
    firstEntry: {
        type: Boolean,
        required: false,
        default: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    ubigeo: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'Ubigeo'
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }

});

module.exports = model('User', UserSchema);