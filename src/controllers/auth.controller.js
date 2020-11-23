const {
    response,
    request
} = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const {
    generateJWT
} = require('../helpers/jwt.helper');
const {
    verify
} = require('../helpers/verify-google.helper');
const {
    getMenu
} = require('../helpers/menu-frontend.helper');

const login = async (req = request, res = response) => {
    const {
        email,
        password
    } = req.body;
    try {
        const data = await User.findOne({
            email
        });
        if (!data) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales incorrectas.'
            })
        }
        const validPassword = bcrypt.compareSync(password, data.password);
        if (!validPassword) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales incorrectas.'
            });
        }
        if (!data.state) {
            return res.status(400).json({
                ok: false,
                message: 'User disabled'
            });
        }
        const token = await generateJWT(data)
        return res.status(200).json({
            ok: true,
            message: 'Welcome',
            user: data,
            token,
            role: data.role
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, please check logs.'
        })
    }
}

const loginGoogle = async (req, res) => {
    try {
        if (!req.body.token) {
            return res.status(401).json({
                ok: false,
                message: "No token"
            })
        }
        const {
            name,
            lastname,
            email,
            picture
        } = await verify(req.body.token);
        const user = await User.findOne({
            email
        });
        let new_user;
        if (!user) {
            new_user = new User({
                name,
                lastname,
                email,
                password: '@@@@@@@@@@@@@@@@@@@@@@',
                img: picture,
                google: true
            });

        } else {
            if (!user.state) {
                return res.status(400).json({
                    ok: false,
                    message: `Tu usuario ha sido deshabilitado, por infringir las normas.
                     Los detalles de la suspension de tu cuenta estan en el correo enviado a ${user.email}.`
                });
            }
            new_user = user;
            new_user.google = true;
        }
        const data = await new_user.save();
        const token = await generateJWT(data)
        return res.status(200).json({
            ok: true,
            token,
            user: new_user,
            role: data.role
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            message: "Token invalid."
        })
    }

}

// const refreshToken = async(req, res) => {
//     const id = req._id;

//     const token = await generateJWT(id)

//     const userFinded = await User.findById(id);

//     let user = {...userFinded._doc };
//     delete user.password;

//     return res.status(200).json({
//         ok: true,
//         token,
//         user,
//         menu: getMenu(user.role)
//     })

// }

module.exports = {
    login,
    loginGoogle
}