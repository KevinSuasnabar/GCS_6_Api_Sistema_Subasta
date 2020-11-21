const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const validationJWT = (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'No token'
        })
    }

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET).data;
        req._id = _id;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Invalid token'
        })
    }
}

const validationAdminRole = async(req, res, next) => {
    const id = req._id;
    try {
        const user = await User.findById(id)
        if (user.role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.status(401).json({
                ok: false,
                message: 'You are not admin.'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Call to admin.'
        })
    }
}

const validationAdminRoleSameId = async(req, res, next) => {
    const id = req._id;
    const idUser = req.params.id;
    try {
        const user = await User.findById(id)
        if (user.role === 'ADMIN_ROLE' || id === idUser) {
            next();
        } else {
            return res.status(401).json({
                ok: false,
                message: 'You are not admin.'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Call to admin.'
        })
    }
}
module.exports = {
    validationJWT
}