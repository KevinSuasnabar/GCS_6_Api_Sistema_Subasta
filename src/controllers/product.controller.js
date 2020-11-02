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

module.exports = { addProduct, getProductsByUser };