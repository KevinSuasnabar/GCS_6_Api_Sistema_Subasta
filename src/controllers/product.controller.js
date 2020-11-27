const { response, request } = require('express');
const Product = require('../models/product.model');

const addProduct = async(req = request, res) => {
    const user = req._id;
    const data = req.body;
    try {
        const product = new Product({...data, user });
        await product.save()
        return res.status(200).json({
            ok: true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getProductsByUser = async(req = request, res) => {
    try {
        const products = await Product.find({ user: req._id }) || [];
        return res.status(200).json({
            ok: true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const listarProductoPorCategoria = async(req = request, res = response) => {
    const category = req.params.category;
    console.log(category);
    try {
        await Product.find({ category: category }, function(err, categoria) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    categoria
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

const cantidadProductos = async(req = request, res = response) => {
    try {
        var query = Product.find();
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

const obtener = async(req = request, res = response) => {
    const id = req.params.id;
    try{
      await Product.findById(id, function(err, producto) {
        if(!err) {
          return res.status(200).json({
            ok: true,
            product: producto
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



module.exports = { addProduct, getProductsByUser, listarProductoPorCategoria, cantidadProductos, obtener };