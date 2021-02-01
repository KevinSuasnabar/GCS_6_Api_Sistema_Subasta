const {
    response,
    request
} = require('express');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Subasta = require('../models/subasta.model');
const User = require('../models/user.model');



const getProductsSubastadosByCategory = async(req = request, res) => {
    try {
        if (!req.params.dateA || !req.params.dateB) {
            return res.status(400).json({
                ok: false,
                error: 'Ingrese los parámetros en formate fecha'
            })
        }
        const dateA = new Date(req.params.dateA);
        const dateB = new Date(req.params.dateB);
        const id = req._id;
        const supervisor = await User.findById(id);
        const subastas = await Subasta.find({ estado: 'FINALIZADO' }).populate('producto');
        const productsReady = [];
        subastas.forEach(pro => {
            if (dateA < pro.fecha_fin && dateB > pro.fecha_fin && pro.producto.category === supervisor.category) {
                productsReady.push(pro)
            }
        })
        return res.status(200).json({
            ok: true,
            data: productsReady
        })


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getTotalProductsByCategory = async(req = request, res) => {
    try {
        const categoriesModel = await Category.find();
        const categories = [];
        const subastas = await Subasta.find({ estado: 'FINALIZADO' }).populate('producto') || [];
        for (const cat of categoriesModel) {
            let c = 0;
            subastas.forEach(pro => {
                if (pro.producto.category === cat.name) {
                    c++;
                }
            })
            categories.push({
                nombre: cat.name,
                total: c
            });
        }

        return res.status(200).json({
            ok: true,
            data: categories
        })


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const getCompradores = async(req = request, res) => {
    try {
        const id = req._id;
        const subastas = await Subasta.find({ vendedor: id, estado: 'FINALIZADO' }).populate('producto').populate('comprador');
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

const getProductosSubastados = async(req = request, res) => {
    try {
        const id = req._id;
        const subastas = await Subasta.find({ vendedor: id}).populate('producto');
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

const getMontoTotal = async(req = request, res) => {
    try {
        const subastas = await Subasta.find({ estado: 'FINALIZADO' });
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

const getSubastasByParticipacion = async(req = request, res) => {
    try {
        const id = req._id;
        const subastas = await Subasta.find().populate('comprador').populate('vendedor').populate('producto');
        let participacion = [];
        subastas.forEach(sub => {
            if (sub.participantes.includes(id)) {
                participacion.push(sub)
            }
        })
        return res.status(200).json({
            ok: true,
            data: participacion
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error
        })
    }
}

module.exports = {
    getProductsSubastadosByCategory,
    getTotalProductsByCategory,
    getCompradores,
    getProductosSubastados,
    getMontoTotal,
    getSubastasByParticipacion
};