const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt.helper');

const registerUser = async(req = request, res = response) => {
    const user = new User(req.body);
    try {
        const current_email = await User.findOne({ email: user.email });
        const current_dni = await User.findOne({ dni: user.dni });
        if (current_email) {
            return res.status(400).json({
                ok: false,
                message: 'This email is already exists. '
            })
        }

        if (current_dni) {
            return res.status(400).json({
                ok: false,
                message: 'This dni is already exists. '
            })
        }
        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);

        await user.save();
        const token = await generateJWT(user._id);
        let user_send = {...user._doc }
        delete user_send.password;
        return res.status(200).json({
            ok: true,
            user: user_send,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, please check logs.'
        })
    }
}

const registerSupervisor = async(req = request, res = response) => {
    const user = new User(req.body);
    try {
        const current_email = await User.findOne({ email: user.email });
        const current_dni = await User.findOne({ dni: user.dni });
        if (current_email) {
            return res.status(400).json({
                ok: false,
                message: 'El correo ya existe. '
            })
        }

        if (current_dni) {
            return res.status(400).json({
                ok: false,
                message: 'Este dni ya existe. '
            })
        }

        user.role = "SUPERVISOR_ROLE";
        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);

        await user.save();
        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error, revisar logs.'
        })
    }
}
module.exports = { registerUser, registerSupervisor };