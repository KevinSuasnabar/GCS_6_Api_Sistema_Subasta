const {
    Schema,
    model
} = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    simple_name: {
        type: String,
        required: false //deberia ser true
    }
});

module.exports = model('Category', CategorySchema);