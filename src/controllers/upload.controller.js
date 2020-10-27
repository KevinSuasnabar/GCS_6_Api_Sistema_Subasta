const { response, request } = require('express');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const cloudinary = require('cloudinary').v2;

const uploadPhoto = async(req = request, res = response) => {
    const id = req.params.id;
    const user = await User.findById(id);
    let url = "";
    try {
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'User does not exist.'
            });
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No files were uploaded.'
            });
        }
        const photo = req.files.photo;
        const clean_name = photo.name.split('.');
        const extension = clean_name[clean_name.length - 1];
        const extensions_valids = ['jpg', 'png', 'jpeg', 'gif'];
        if (!extensions_valids.includes(extension)) {
            return res.status(400).json({
                ok: false,
                message: 'Extension no valid.'
            })
        }

        const unique_name = `${uuidv4()}.${extension}`;
        const pathName = `./src/upload/${unique_name}`;
        console.log(pathName);

        photo.mv(pathName, (err) => {
            if (err) {
                return res.status(500).json({
                    meesage: "use mv",
                    ok: false,
                    err
                })
            }
        })

        await cloudinary.uploader.upload(pathName, async(error, result) => {
            if (error) {
                return res.status(500).json({
                    message: "cloud",
                    ok: false,
                    error
                })
            }
            url = result.url;
            await User.findByIdAndUpdate(id, { img: result.url })
        });

        // if (fs.existsSync(pathName)) {
        //     fs.unlinkSync(pathName)
        // }

        return res.status(200).json({
            ok: true,
            message: 'File updated.',
            data: url
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, please check logs.'
        })
    }
}

module.exports = {
    uploadPhoto
}