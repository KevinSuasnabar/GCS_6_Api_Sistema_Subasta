const { response, request } = require('express');
const Subasta = require('../models/subasta.model');
const Product = require('../models/product.model');

const createSubasta = async(req = request, res) => {
    try {
        const tipos = ['INGLESA', 'HOLANDESA'];
        const id_producto = req.params.idProducto;;
        const data_subasta = req.body;
        const prod = await Product.findById(id_producto);
        if (prod.state !== 'APROBADO') {
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
        const subasta_aux = new Subasta({
            ...data_subasta,
            producto: id_producto
        });
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


module.exports = { createSubasta };