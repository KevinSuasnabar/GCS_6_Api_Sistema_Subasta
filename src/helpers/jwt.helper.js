const jwt = require('jsonwebtoken');

const generateJWT = (data) => {
    return new Promise((resolve, reject) => {
        const payload = {
            data
        }
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '6h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error to create JWT.')
            } else {
                resolve(token)
            }
        })
    })
}

module.exports = {
    generateJWT
}