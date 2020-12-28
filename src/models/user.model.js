const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    dni: {
        type: String,
        required: false
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
        required: false,
        default: "http://res.cloudinary.com/deaehe41t/image/upload/v1603771241/kbxska3uzy8bkcll8es2.jpg"
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
    },
    address: {
        type: String,
        required: false,
    },
    college: {
        type: String,
        required: false,
    },
    studies: {
        type: String,
        required: false
    }

});

module.exports = model('User', UserSchema);