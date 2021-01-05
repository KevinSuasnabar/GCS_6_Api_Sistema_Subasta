const { response, request } = require('express');
const Subasta = require('../models/subasta.model');
const Product = require('../models/product.model');

const createSubasta = async(req = request, res) => {
    try {
        const tipos = ['INGLESA', 'HOLANDESA'];
        const modos = ['ASYNC', 'SINC'];
        const id_producto = req.params.idProducto;
        const data_subasta = req.body;
        const prod = await Product.findById(id_producto);
        if (prod.state !== 'APROBADO') {
            if (prod.state === 'EN SUBASTA') {
                return res.status(400).json({
                    ok: false,
                    message: 'Producto ya está en subasta.'
                })
            }
            return res.status(400).json({
                ok: false,
                message: 'Producto aún en revisión.'
            })
        }
        if (!tipos.includes(data_subasta.tipo)) {
            return res.status(400).json({
                ok: false,
                message: 'Tipo de subasta inexistente.'
            })
        }
        if (!modos.includes(data_subasta.modo)) {
            return res.status(400).json({
                ok: false,
                message: 'Modo de subasta inexistente.'
            })
        }
        const subasta_aux = new Subasta({
            ...data_subasta,
            producto: id_producto
        });
        prod.state = 'EN SUBASTA';
        await prod.save();
        const subasta = await subasta_aux.save();
        if (subasta) {
            return res.status(200).json({
                ok: true,
                message: 'Subasta creada'
            })
        } else {
            return res.status(200).json({
                ok: false,
                message: 'Error en salvar subasta.'
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getSubastas = async(req = request, res = response) => {
    try {
        const subastas = await Subasta.find().populate('producto');
        return res.status(200).json({
            ok: true,
            data: subastas
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getSubastaById = async(req = request, res = response) => {
    try {
        const id = req.params.id;
        const subasta = await Subasta.findById(id).populate('producto');
        if (!subasta) {
            return res.status(404).json({
                ok: false,
                message: 'Subasta no encontrada'
            })
        }
        return res.status(200).json({
            ok: true,
            data: subasta
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}
module.exports = { createSubasta, getSubastas, getSubastaById };