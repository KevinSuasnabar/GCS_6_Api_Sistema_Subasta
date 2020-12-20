const { response, request } = require('express');
const Category = require('../models/category.model');

const getCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            ok: true,
            categories
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Please review the logs."
        })
    }
}

module.exports = { getCategories };