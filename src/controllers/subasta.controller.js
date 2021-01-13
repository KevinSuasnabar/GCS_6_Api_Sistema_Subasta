const {
    response,
    request
} = require('express');
const Subasta = require('../models/subasta.model');
const User = require('../models/user.model');
const Puja = require('../models/puja.model');
const Product = require('../models/product.model');
const estadosSubasta = require('../constantes/estadosSubasta');
const estadosProducto = require('../constantes/estadosProducto');
const socket = require('../app');
const { sendEmail } = require('../helpers/email.helper');


const createSubasta = async(req = request, res) => {
    try {
        const tipos = ['INGLESA', 'HOLANDESA'];
        const modos = ['ASYNC', 'SINC'];
        const id_producto = req.params.idProducto;
        const id_vendedor = req.params.idVendedor;
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
            producto: id_producto,
            vendedor: id_vendedor
        });
        prod.state = 'EN SUBASTA';
        await prod.save();
        const subasta = await subasta_aux.save();

        if (subasta) {
            return res.status(200).json({
                ok: true,
                message: 'Subasta creada y en proceso',
                subasta
            })
        } else {
            return res.status(400).json({
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
        const subasta = await Subasta.findById(id).populate('producto').populate('vendedor');
        if (!subasta) {
            return res.status(404).json({
                ok: false,
                message: 'Subasta no encontrada'
            })
        }
        return res.status(200).json({
            ok: true,
            subasta
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const pujarSubasta = async(req = request, res = response) => {
    try {
        const user = req._id;
        const idSubasta = req.params.id;
        const { monto, hora, dia } = req.body;
        const puja = {
                monto,
                hora,
                dia,
                comprador: user
            } //Captura data
        const puja_aux = new Puja(puja);
        const pujaSaved = await puja_aux.save(); //Guarda la puja
        const subasta = await Subasta.findById(idSubasta); //Busca si existe una subasta
        if (pujaSaved && subasta) {
            let pujas = subasta.pujas || []; //Captura las pujas
            pujas.push(pujaSaved); //Redimencionamos
            const subastaNew = await Subasta.findByIdAndUpdate(idSubasta, { pujas }, { new: true }); //Actualizamos las pujas
            if (!(subastaNew)) {
                return res.status(404).json({
                    ok: false,
                    message: 'Error al actualizar pujas.'
                })
            }
            let participantes = subasta.participantes || []; //Capturamos a los participantes
            if (!participantes.includes(user)) { //Verificamos si ya participa
                participantes.push(user); //Redimencionamos
                const participantesNew = await Subasta.findByIdAndUpdate(idSubasta, { participantes }, { new: true }); //Actualizamos a los participantes
                if (!(participantesNew)) {
                    return res.status(404).json({
                        ok: false,
                        message: 'Error al actualizar participante'
                    })
                }
            }
            const subastaFinal = await Subasta.findById(idSubasta);
            const userWin = await User.findById(user);

            var precioBase = subastaFinal.precio_base;
            const tipoSubasta = subastaFinal.tipo;
            var precioTemporal = 0;
            var pujasArray = [];

            for (const puj of subasta.pujas){
                const pujas = await Puja.findById(puj).populate('comprador', 'name');
                pujasArray.push(pujas)
            }

            if(tipoSubasta == 'INGLESA'){
                for (const p of pujasArray){
                    precioTemporal = p.monto + precioBase;
                    precioBase =  precioTemporal;
                }
            }

            socket.io.emit(subastaFinal._id, { puja: puja, user: userWin, pujas: pujasArray, mensaje: 'proceso', tipo: subastaFinal.tipo, precioTemp: precioTemporal })
            return res.status(200).json({
                ok: true,
                data: subastaFinal
            })
        } else {
            return res.status(404).json({
                ok: false,
                message: 'Error en proceso.'
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })

    }
}

const getHistorialPujasBySubasta = async(req = request, res = response) => {
    try {
        const idSubasta = req.params.id;
        const subasta = await Subasta.findById(idSubasta);
        if (!subasta) {
            return res.status(404).json({
                ok: false,
                message: 'Subasta no encontrada'
            })
        }
        return res.status(200).json({
            ok: true,
            data: subasta.pujas
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getSubastasByParticipacion = async(req = request, res = response) => {
    try {
        const user = req._id;
        const subastas = await Subasta.find();
        let subastas_aux = [];
        subastas.forEach(sub => {
            let flag = false;
            sub.participantes.forEach(parti => {
                if (parti === user) {
                    flag = true;
                }
            })
            if (flag && (sub.estado === "EN PROCESO")) {
                subastas_aux.push(sub);
            }
        })
        return res.status(200).json({
            ok: true,
            data: subastas_aux
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getSubastasByIdComprador = async(req = request, res = response) => {
    const idComprador = req.params.idComprador;
    try {
        const subastasHistorialCompra = await Subasta.find({
            $and: [{
                comprador: idComprador
            }, {
                estado: estadosSubasta[3]
            }]
        }).populate('producto').populate('vendedor')
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
    const idSubasta = req.body.idSubasta;
    const calificacion = req.body.calificacion;
    const mensajeCalificacion = req.body.mensajeCalificacion;
    try {
        await Subasta.findByIdAndUpdate(idSubasta, {
            calificacion: calificacion,
            mensaje_calificacion: mensajeCalificacion
        }, {
            new: true
        }, function(err, subasta_actualizada) {
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

const finalizarSubasta = async(req = request, res = response) => {
    try {
        const idSubasta = req.params.idSubasta;
        const precioPagado = req.body.precioPagado
        const idComprador = req.body.idComprador

        await Subasta.findByIdAndUpdate(idSubasta, {
            precio_pagado: precioPagado,
            comprador: idComprador,
            estado: estadosSubasta[3]
        }, {
            new: true
        }, function(err, subasta_actualizada) {
            if (!err) {
                Product.findByIdAndUpdate(subasta_actualizada.producto, {state: estadosProducto[6]}, {new : true}, function(err, producto_actualizado){
                    User.findById(subasta_actualizada.comprador, function(err, usuario_encontrado){

                        sendEmail(usuario_encontrado.email, 'Producto ' + producto_actualizado.name +  ' comprado en subasta ' + subasta_actualizada.titulo, 'Estimado ' + usuario_encontrado.name + ' usted ha comprado el producto ' + producto_actualizado.name +  ' en la subasta ' + subasta_actualizada.titulo + ' pagando ' + subasta_actualizada.precio_pagado + ' por favor, proceda a calificar al vendedor una vez tenga su producto.');
                        socket.io.emit(subasta_actualizada._id, {name: usuario_encontrado.name, precio: subasta_actualizada.precio_pagado, mensaje: 'final'})
                    });   
                });
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

const subastaPorCategoria = async(req = request, res) => {
    try {
        const category = req.params.categoryName;
        const subastas = await Subasta.find({estado: estadosSubasta[1]}).populate('producto');

        var listSubasta = [];
        subastas.map(sub => {
            if (sub.producto.category == category) {
                listSubasta.push(sub);
            }
        });
        // await Promise.all(subastas.map(async (sub) => {
        //     const idProducto = sub.producto;
        //     const subastasFiltradas = await Product.findById({
        //         _id: idProducto
        //     });
        //     subastasList.push(subastasFiltradas);
        // }));
        return res.status(200).json({
            ok: true,
            results: listSubasta
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const filtrarSubastasByProductoAndVendedor = async (req = request, res) => {
    const id = req._id;
    const filter = req.params.filter;
    var subastas_prod_ven;
    var subastasFiltradas = [];
    try {
        if (filter == 'all') {
            subastas_prod_ven = await Subasta.find({$and: [{ comprador: id }, {estado: estadosSubasta[3]}]}).populate('producto').populate('vendedor')
            subastasFiltradas = subastas_prod_ven;
        } else {
            subastas_prod_ven =  await Subasta.find().populate('producto').populate('vendedor')
            subastas_prod_ven.forEach(sub => {
                if ((sub.comprador == id && sub.estado == estadosSubasta[3]) && ((sub['producto'].name == filter) || (sub['vendedor'].name == filter) || (sub['vendedor'].lastname == filter) || (sub['vendedor'].dni == filter) || (sub['vendedor'].email == filter))){
                    subastasFiltradas.push(sub);
                }
            })
        }
        return res.status(200).json({
            ok: true,
            subastas: subastasFiltradas
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getPujasBySubasta = async(req = request, res = response) => {
    try {
        const idSubasta = req.params.idSubasta;
        const subasta = await Subasta.findById(idSubasta);
        var precioBase = subasta.precio_base;
        const tipoSubasta = subasta.tipo;
        var precioTemporal = 0;
        var pujasArray = [];

        for (const puj of subasta.pujas){
            const pujas = await Puja.findById(puj).populate('comprador', 'name');
            pujasArray.push(pujas)
        }
        if(tipoSubasta == 'INGLESA'){
            for (const p of pujasArray){
                precioTemporal = p.monto + precioBase;
                precioBase =  precioTemporal;
            }
        }
        if (!subasta) { 
            return res.status(404).json({
                ok: false,
                message: 'Subasta no encontrada'
            })
        }
        return res.status(200).json({
            ok: true,
            pujas: pujasArray,
            precioTemp : precioTemporal
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

module.exports = {
    createSubasta,
    getSubastas,
    getSubastaById,
    getSubastasByIdComprador,
    calificarSubasta,
    getHistorialPujasBySubasta,
    pujarSubasta,
    getSubastasByParticipacion,
    finalizarSubasta,
    subastaPorCategoria,
    filtrarSubastasByProductoAndVendedor,
    getPujasBySubasta
};