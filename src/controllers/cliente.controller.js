const { response, request } = require('express');
const User = require('../models/user.model');

const listar = async(req = request, res = response) => {
    try {
        await User.find({ role: "CLIENT_ROLE" }, function(err, cliente) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    user: cliente
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

const eliminar = async(req = request, res = response) => {
    const id = req.body.id;
    const state = req.body.state;
    try {
        const cliente = await User.findById(id);
        if (cliente)
            if (!cliente) {
                return res.status(404).json({
                    ok: false,
                    message: 'Cliente no existe.'
                })
            } else {
                await User.findByIdAndUpdate(id, { state: state }, { new: true }, function(err, cliente_actualizado) {
                    if (!err) {
                        return res.status(200).json({
                            ok: true,
                            user: cliente_actualizado
                        })
                    }
                });
            }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener datos.'
        })
    }
}

module.exports = { listar, eliminar };