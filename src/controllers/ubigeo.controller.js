const { response, request } = require('express');
const Ubigeo2 = require('../models/ubigeo2.model');

const listarDepartamentos = async(req = request, res = response) => {
    try {
        await Ubigeo2.find({ $and: [{provincia: "00"}, {distrito: "00"}] }, function(err, departamento) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    departaments: departamento
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

const listarProvincias = async(req = request, res = response) => {
    const idDepartamento = req.params.idDepartamento;
    try {
        await Ubigeo2.find({ $and: [{departamento: idDepartamento}, {distrito: "00"}, {provincia: {$ne: "00"}}] }, function(err, provincias) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    province: provincias
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

const listarDistritos = async(req = request, res = response) => {
    const idDepartamento = req.params.idDepartamento;
    const idProvincia = req.params.idProvincia;
    try {
        await Ubigeo2.find({ $and: [{departamento: idDepartamento}, {provincia: idProvincia}, {distrito: {$ne: "00"}}] }, function(err, distritos) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    disctrit: distritos
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


module.exports = { listarDepartamentos, listarProvincias, listarDistritos};