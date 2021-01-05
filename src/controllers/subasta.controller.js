const { response, request } = require('express');
const Subasta = require('../models/subasta.model');
const Product = require('../models/product.model');
const estadosSubasta = require('../constantes/estadosSubasta');

const createSubasta = async(req = request, res) => {
    try {
        const tipos = ['INGLESA', 'HOLANDESA'];
        const modos = ['ASYNC', 'SINC'];
        const id_producto = req.params.idProducto;;
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
    const subastas = await Subasta.find().populate('producto');
    return res.status(200).json({
        ok: true,
        data: subastas
    })
}

const getSubastaById = async(req = request, res = response) => {
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
}

const getSubastasByIdComprador = async(req = request, res = response) => {
    const idComprador = req.params.idComprador;
    try{
        const subastasHistorialCompra = await Subasta.find({$and : [{comprador : idComprador}, {estado : estadosSubasta[3]}]}).populate('producto').populate('vendedor')
        if (subastasHistorialCompra) {
            return res.status(200).json({
                ok: true,
                subastas: subastasHistorialCompra
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const calificarSubasta = async(req = request, res = response) => {
    const idSubasta =  req.body.idSubasta;
    const calificacion = req.body.calificacion;
    const mensajeCalificacion = req.body.mensajeCalificacion;
    try{
        await Subasta.findByIdAndUpdate(idSubasta, {calificacion : calificacion, mensaje_calificacion : mensajeCalificacion}, {new : true}, function (err, subasta_actualizada) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    subasta: subasta_actualizada
                })
            }
        });   
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

module.exports = { createSubasta, getSubastas, getSubastaById, getSubastasByIdComprador, calificarSubasta };