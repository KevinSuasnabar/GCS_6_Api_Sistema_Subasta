const { response, request } = require('express');
const Subasta = require('../models/subasta.model');
const estadosSubasta = require('../constantes/estadosSubasta');
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

const cantidadClientes = async(req = request, res = response) => {
    try {        
        var query = User.find({ role: "CLIENT_ROLE" });
        query.count(function(err, count) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    cantidad: count
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

const obtenerCalificacionVendedor = async(req = request, res = response) => {
    try {
        const idSubasta = req.params.idSubasta;

        let calificacion = 0;
        let i = 0;
        var promedio;

        const subasta =  await Subasta.findOne({_id : idSubasta})

        if(subasta){
            const idVendedor = subasta.vendedor;
            const subastas = await Subasta.find({ $and: [{ vendedor: idVendedor }, { estado: estadosSubasta[3] }] });
            subastas.forEach(sub => {
                calificacion = sub.calificacion + calificacion;
                i++;
            });
            promedio = Math.round(calificacion/i);
        }else{
            promedio = 0;
        }
        return res.status(200).json({
            ok: true,
            promedio
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}


module.exports = { listar, eliminar, cantidadClientes, obtenerCalificacionVendedor };