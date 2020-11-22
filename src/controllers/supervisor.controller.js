const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const actualizar = async(req = request, res = response) => {
    const id = req.body.id;
    const nombres = req.body.name;
    const correo = req.body.email;
    const apellidos = req.body.lastname;
    const dni = req.body.dni;
    const categoria = req.body.category;
    const password = req.body.password;
    const direccion = req.body.address;
    const fecNacimiento = req.body.bornDate;
    const numeroTel = req.body.phoneNumber;
    const universidad = req.body.college;
    const estudios = req.body.studies;
    try{
      const supervisor = await User.findById(id);
      if (!supervisor) {
          return res.status(404).json({
                ok: false,
                message: 'Supervisor no existe.'
            })
        } else {
            //Encrypt password
            const salt = bcrypt.genSaltSync();
            const password_enc = bcrypt.hashSync(password, salt);
            if(password == '' && direccion == null && fecNacimiento == null && numeroTel == null && universidad == null && estudios == null){
                await User.findByIdAndUpdate(id, {name : nombres, lastname : apellidos, dni : dni, category : categoria, email : correo }, { new: true }, function(err, supervisor_actualizado){
                 if(!err) {
                   return res.status(200).json({
                     ok: true,
                     user: supervisor_actualizado
                   })
                 }
               });
            } else if((password == '' || password == null) && direccion != null && fecNacimiento != null && numeroTel != null && universidad != null && estudios != null){
                await User.findByIdAndUpdate(id, {name : nombres, lastname : apellidos, dni : dni, email : correo, address : direccion, 
                    bornDate : fecNacimiento, phoneNumber : numeroTel, college : universidad, studies : estudios}, { new: true }, function(err, supervisor_actualizado){
                 if(!err) {
                   return res.status(200).json({
                     ok: true,
                     user: supervisor_actualizado
                   })
                 }
               });
            } else{
                await User.findByIdAndUpdate(id, {name : nombres, lastname : apellidos, dni : dni, password :
                    password_enc, address : direccion, bornDate : fecNacimiento, phoneNumber : numeroTel,
                     college : universidad, studies : estudios}, { new: true }, function(err, supervisor_actualizado){
                 if(!err) {
                   return res.status(200).json({
                     ok: true,
                     user: supervisor_actualizado
                   })
                 }
               });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar.'
        })
    }

}

const obtener = async(req = request, res = response) => {
    const id = req.params.id;
    try{
      await User.findById(id, function(err, supervisor) {
        if(!err) {
          return res.status(200).json({
            ok: true,
            user: supervisor
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

const listar = async(req = request, res = response) => {
    try {
        await User.find({ role: "SUPERVISOR_ROLE" }, function(err, supervisor) {
            if (!err) {
                return res.status(200).json({
                    ok: true,
                    user: supervisor
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

const eliminar = async(req = request, res = response) => {
    const id = req.body.id;
    const state = req.body.state;
    try {
        const supervisor = await User.findById(id);
        if (supervisor)
            if (!supervisor) {
                return res.status(404).json({
                    ok: false,
                    message: 'Supervisor no existe.'
                })
            } else {
                await User.findByIdAndUpdate(id, { state: state }, { new: true }, function(err, supervisor_actualizado) {
                    if (!err) {
                        return res.status(200).json({
                            ok: true,
                            user: supervisor_actualizado
                        })
                    }
                });
            }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener datos.'
        })
    }
}

const cantidadSupervisores = async(req = request, res = response) => {
    try {        
        var query = User.find({ role: "SUPERVISOR_ROLE" });
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

module.exports = { actualizar, obtener, listar, eliminar, cantidadSupervisores };