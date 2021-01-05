const {
    response,
    request
} = require('express');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const ProductoHistorial = require('../models/productoHistorial.model');
const estadosProducto = require('../constantes/estadosProducto');
const socket = require('../app');
const { sendEmail } = require('../helpers/email.helper');

const addProduct = async (req = request, res) => {
    const user = req._id;
    const data = req.body;
    try {
        const product = new Product({
            ...data,
            user
        });
        const supervisores = await User.find({category : data.category})
        await product.save(function (err, producto) {
            if (!err) {
                ProductoHistorial.create({
                    user: producto.user,
                    producto: producto._id,
                    state: producto.state,
                    fecha_accion: new Date()
                }, function (err) {
                    if (!err) {
                         supervisores.forEach(sup => {
                            sendEmail(sup.email, 'Producto ' + producto.name +  ' por revisar', 'Estimado ' + sup.name + ' tiene un artículo por revisar')
                        })
                        socket.io.emit('producto_nuevo', {
                            product: producto
                        });
                        return res.status(200).json({
                            ok: true,
                            product: producto
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

const updateProduct = async (req = request, res) => {
    const data = req.body;
    try {
        const producto = await Product.findById(data._id);
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                errors: {
                    message: 'No existe un producto con ese ID'
                }
            });
        }

        producto.name = data.name;
        producto.description = data.description;
        producto.category = data.category;
        producto.state = data.state;
        if(data.imgs && data.imgs.length>=3){
            producto.imgs = data.imgs;
        }

        const supervisores = await User.find({category : data.category})
        await producto.save((err, productoModificado) => {
            if (!err) {
                ProductoHistorial.create({
                    user: productoModificado.user,
                    producto: productoModificado._id,
                    state: productoModificado.state,
                    fecha_accion: new Date()
                }, function (err) {
                    if (!err) {
                        supervisores.forEach(sup => {
                            sendEmail(sup.email, 'Producto ' + producto.name +  ' subsanado', 'Estimado ' + sup.name + ' tiene un artículo por revisar')
                        })
                        socket.io.emit('producto_nuevo', {
                            product: productoModificado
                        });
                        return res.status(200).json({
                            ok: true,
                            product: productoModificado
                        });
                    }
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

const getProductsByUser = async (req = request, res) => {
    try {
        const products = await Product.find({
            user: req._id
        }) || [];
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

const listarProductoPorCategoria = async (req = request, res = response) => {
    const category = req.params.category;
    try {
        await Product.find({
            $and: [{
                category: category
            }, {
                $or: [{
                    state: estadosProducto[0]
                }, {
                    state: estadosProducto[3]
                }, {
                    state: estadosProducto[4]
                }]
            }]
        }, function (err, categoria) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    categoria
                })
            }
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener datos.'
        })
    }
}

const listarProductosYClientes = async (req = request, res = response) => {
    const category = req.params.category;
    const filter = req.params.filter;
    var filtro_producto = [];
    var k = 0;
    try {
        await Product.find({
            category: category
        }).populate('user').exec(function (err, productos) {
            if (filter == 'all') {
                return res.status(200).json({
                    ok: true,
                    products: productos
                })
            } else {
                for (i in productos) {
                    if (productos[i].user.dni == filter) {
                        filtro_producto[k] = productos[i];
                        k++;
                    }
                }
                return res.status(200).json({
                    ok: true,
                    products: filtro_producto
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

const cantidadProductos = async (req = request, res = response) => {
    try {
        var query = Product.find();
        query.count(function (err, count) {
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

const obtener = async (req = request, res = response) => {
    const id = req.params.id;
    try {
        await Product.findById(id, function (err, producto) {
            if (!err) {
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

const actualizarEstado = async (req = request, res = response) => {
    const id = req.body.id;
    const state = req.body.state;
    const name = req.body.name;
    const lastname = req.body.lastname;
    const motivo_rechazo = req.body.motivo_rechazo;
    const motivo_subsanacion = req.body.motivo_subsanacion;
    try {
        const producto = await Product.findById(id);
        console.log(producto)
        const usuario =  await User.findById(producto.user);
        console.log(usuario)
        if (producto)
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    message: 'Producto no existe.'
                })
            } else {
                //para aprobar
                if (state == estadosProducto[1]) { //aca
                    await Product.findByIdAndUpdate(id, {
                        state: state
                    }, {
                        new: true
                    }, function (err, producto_actualizado) {
                        if (!err) {
                            ProductoHistorial.create({
                                user: producto_actualizado.user,
                                producto: producto_actualizado._id,
                                state: producto_actualizado.state,
                                fecha_accion: new Date(),
                                supervisor_name: name,
                                supervisor_lastname: lastname
                            }, function (err) {
                                if (!err) {
                                    sendEmail(usuario.email, 'Producto ' + producto.name +  ' aprobado', 'Estimado ' + usuario.name + ' su artículo ha sido aprobado')
                                    socket.io.emit('estado_actualizado', {
                                        product: producto_actualizado
                                    });
                                    return res.status(200).json({
                                        ok: true,
                                        producto: producto_actualizado
                                    })
                                }
                            })
                        }
                    });
                    //para rechazar
                } else if (state == estadosProducto[2]) {
                    await Product.findByIdAndUpdate(id, {
                        state: state,
                        motivo_rechazo: motivo_rechazo
                    }, {
                        new: true
                    }, function (err, producto_actualizado) {
                        if (!err) {
                            ProductoHistorial.create({
                                user: producto_actualizado.user,
                                producto: producto_actualizado._id,
                                state: producto_actualizado.state,
                                accion: producto_actualizado.motivo_rechazo,
                                fecha_accion: new Date(),
                                supervisor_name: name,
                                supervisor_lastname: lastname
                            }, function (err) {
                                if (!err) {
                                    sendEmail(usuario.email, 'Producto ' + producto.name +  ' rechazado', 'Estimado ' + usuario.name + ' su artículo ha sido rechazado por el siguiente motivo: ' + motivo_rechazo)
                                    socket.io.emit('estado_actualizado', {
                                        product: producto_actualizado
                                    });
                                    return res.status(200).json({
                                        ok: true,
                                        producto: producto_actualizado
                                    })
                                }
                            })
                        }
                    });
                    //para pedir al cliente que subsane
                } else if (state == estadosProducto[3]) {
                    await Product.findByIdAndUpdate(id, {
                        state: state,
                        motivo_subsanacion: motivo_subsanacion
                    }, {
                        new: true
                    }, function (err, producto_actualizado) {
                        if (!err) {
                            ProductoHistorial.create({
                                user: producto_actualizado.user,
                                producto: producto_actualizado._id,
                                state: producto_actualizado.state,
                                accion: producto_actualizado.motivo_subsanacion,
                                fecha_accion: new Date(),
                                supervisor_name: name,
                                supervisor_lastname: lastname
                            }, function (err) {
                                if (!err) {
                                    sendEmail(usuario.email, 'Producto ' + producto.name +  '  en subsanación', 'Estimado ' + usuario.name + ' su artículo debe ser subsanado por la siguiente razón: ' + motivo_subsanacion + '. Por favor, subsane en el más breve plazo')
                                    socket.io.emit('estado_actualizado', {
                                        product: producto_actualizado
                                    });
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

const obtenerHistorial = async (req = request, res) => {
    const id = req.params.id;
    try {
        const historial_producto = await ProductoHistorial.find({
            producto: id
        }).populate('user').populate('producto');
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

const getProductsByState = async (req = request, res) => {
    try {
        const states = ['APROBADO', 'RECHAZADO', 'ENVIADO', 'POR_SUBSANAR'];
        let state = req.params.state;
        const id = req._id;
        const user = await User.findById(id);
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                message: 'No eres administrador.'
            })
        }
        if (!states.includes(state)) {
            return res.status(404).json({
                ok: false,
                message: 'Estado desconocido'
            })
        }
        if (state === 'POR_SUBSANAR') {
            state = 'POR SUBSANAR'
        }
        const products = await Product.find();
        let prod = [];
        products.forEach(pro => {
            if (pro.state === state) {
                prod.push(pro)
            }
        })
        return res.status(200).json({
            ok: true,
            products: prod
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}

const filtrarProductosByUserAndNameOrState = async (req = request, res) => {
    const id = req._id;
    const filter = req.params.filter;
    var products = [];
    try {
        if (filter == 'all') {
            products = await Product.find({
                user: id
            });
        } else {
            products = await Product.find({
                $and: [{
                    user: id
                }, {
                    $or: [{
                        name: {
                            $regex: '.*' + filter + '.*',
                            $options: 'i'
                        }
                    }, {
                        state: {
                            $regex: '.*' + filter + '.*',
                            $options: 'i'
                        }
                    }]
                }]
            });
        }
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

module.exports = {
    addProduct,
    getProductsByUser,
    listarProductoPorCategoria,
    cantidadProductos,
    obtener,
    actualizarEstado,
    listarProductosYClientes,
    obtenerHistorial,
    getProductsByState,
    filtrarProductosByUserAndNameOrState,
    updateProduct
};