const { response, request } = require('express');
const User = require('../models/user.model');

const obtener = async(req = request, res = response) => {
    const id = req.params.id;
    try {
        await User.findById(id, function(err, supervisor) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    user: supervisor
                })
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener datos.'
        })
    }
}

module.exports = { obtener };