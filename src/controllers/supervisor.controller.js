const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const actualizar = async(req = request, res = response) => {
    const id = req.body.id;
    const nombres = req.body.name;
    const apellidos = req.body.lastname;
    const dni = req.body.dni;
    const password = req.body.password;
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
            console.log(password);
            console.log(password_enc);
            await User.findByIdAndUpdate(id, {name : nombres, lastname : apellidos, dni : dni, password :
               password_enc}, { new: true }, function(err, supervisor_actualizado){
            if(!err) {
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

module.exports = { actualizar, obtener, listar, eliminar };