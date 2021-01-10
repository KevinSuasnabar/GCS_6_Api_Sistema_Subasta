const { response, request } = require('express');
const Subasta = require('../models/subasta.model');
const Puja = require('../models/puja.model');
const Product = require('../models/product.model');
const estadosSubasta = require('../constantes/estadosSubasta');
const { findByIdAndUpdate, findById } = require('../models/subasta.model');

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
                message: 'Subasta creada'
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

const pujarSubasta = async(req = request, res = response) => {
    try {
        const user = req._id;
        const idSubasta = req.params.subasta;
        const { monto, hora, dia } = req.body;
        const puja = {
                monto,
                hora,
                dia,
                comprador: user
            } //Captura data
        const puja_aux = new Puja(puja);
        const pujaSaved = await puja_aux.save(); //Guarda la puja
        const subasta = Subasta.findById(idSubasta); //Busca si existe una subasta
        if (pujaSaved && subasta) {
            let pujas = subasta.pujas; //Captura las pujas
            pujas.push(pujaSaved); //Redimencionamos
            const subastaNew = await findByIdAndUpdate(idSubasta, { pujas }, { new: true }); //Actualizamos las pujas
            if (!(subastaNew)) {
                return res.status(404).json({
                    ok: false,
                    message: 'Error al actualizar pujas.'
                })
            }
            let participantes = subasta.participantes; //Capturamos a los participantes
            if (!participantes.includes(user)) { //Verificamos si ya participa
                participantes.push(user); //Redimencionamos
                const participantesNew = await findByIdAndUpdate(idSubasta, { participantes }, { new: true }); //Actualizamos a los participantes
                if (!(participantesNew)) {
                    return res.status(404).json({
                        ok: false,
                        message: 'Error al actualizar participante'
                    })
                }
            }
            const subastaFinal = await findById(idSubasta);
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
            if (flag) {
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
        const subastasHistorialCompra = await Subasta.find({ $and: [{ comprador: idComprador }, { estado: estadosSubasta[3] }] }).populate('producto').populate('vendedor')
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
        await Subasta.findByIdAndUpdate(idSubasta, { calificacion: calificacion, mensaje_calificacion: mensajeCalificacion }, { new: true }, function(err, subasta_actualizada) {
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

module.exports = { createSubasta, getSubastas, getSubastaById, getSubastasByIdComprador, calificarSubasta, getHistorialPujasBySubasta, pujarSubasta, getSubastasByParticipacion };