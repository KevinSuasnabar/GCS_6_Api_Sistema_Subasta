const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
});

module.exports = model('Category', CategorySchema);