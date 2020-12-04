const { response, request } = require('express');
const Product = require('../models/product.model');
const ProductoHistorial = require('../models/productoHistorial.model');
const estados = require('../constantes/estados');
const socket = require('../app');

const addProduct = async(req = request, res) => {
    const user = req._id;
    const data = req.body;
    try {
        const product = new Product({...data, user });
        await product.save(function(err, producto){
            if(!err){
                ProductoHistorial.create({user: producto.user, producto: producto._id, state : producto.state}, function(err){
                    if(!err){
                        return res.status(200).json({
                            ok: true,
                            product : producto
                        })
                    }
                })
            }
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
    try {
        await Product.find({$and: [{category: category}, {$or: [{state: estados[0]}, {state: estados[3]}, {state: estados[4]}]}]}, function(err, categoria) {
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

const listarProductosYClientes = async(req = request, res = response) => {
    const category = req.params.category;
    try {
        const products = await Product.find({category: category}).populate('user');
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

const actualizarEstado = async(req = request, res = response) => {
    const id = req.body.id;
    const state = req.body.state;
    const motivo_rechazo = req.body.motivo_rechazo;
    const motivo_subsanacion = req.body.motivo_subsanacion;
    try {
        const producto = await Product.findById(id);
        console.log(producto.user);
        if (producto)
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    message: 'Producto no existe.'
                })
            } else {
                //para aprobar
                if(state == estados[1]){
                    await Product.findByIdAndUpdate(id, { state: state }, { new: true }, function(err, producto_actualizado) {
                        if (!err) {
                            ProductoHistorial.create({user: producto_actualizado.user, producto: producto_actualizado._id, state : producto_actualizado.state}, function(err){
                                if(!err){
                                    return res.status(200).json({
                                        ok: true,
                                        producto: producto_actualizado
                                    })
                                }
                            })
                        }
                    });
                //para rechazar
                }else if(state == estados[2]){
                    await Product.findByIdAndUpdate(id, { state: state, motivo_rechazo: motivo_rechazo }, { new: true }, function(err, producto_actualizado) {
                        if (!err) {
                            ProductoHistorial.create({user: producto_actualizado.user, producto: producto_actualizado._id, state : producto_actualizado.state, accion: producto_actualizado.motivo_rechazo}, function(err){
                                if(!err){
                                    return res.status(200).json({
                                        ok: true,
                                        producto: producto_actualizado
                                    })
                                }
                            })
                        }
                    });
                //para pedir al cliente que subsane
                }else if(state == estados[3]){
                   // socket.io.emit('actualiza', 'me actualizaron');
                    await Product.findByIdAndUpdate(id, { state: state, motivo_subsanacion: motivo_subsanacion }, { new: true }, function(err, producto_actualizado) {
                        if (!err) {
                            ProductoHistorial.create({user: producto_actualizado.user, producto: producto_actualizado._id, state : producto_actualizado.state, accion: producto_actualizado.motivo_subsanacion}, function(err){
                                if(!err){
                                    return res.status(200).json({
                                        ok: true,
                                        producto: producto_actualizado
                                    })
                                }
                            })
                        }
                    });
                }

            }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener datos.'
        })
    }
}

const obtenerHistorial = async(req = request, res) => {
    const id = req.params.id;
    try {
        const historial_producto = await ProductoHistorial.find({producto: id}).populate('user').populate('producto');
        return res.status(200).json({
            ok: true,
            historial_producto
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

module.exports = { addProduct, getProductsByUser, listarProductoPorCategoria, cantidadProductos, obtener, actualizarEstado, listarProductosYClientes, obtenerHistorial };