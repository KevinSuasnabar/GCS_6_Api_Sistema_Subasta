const { response, request } = require('express');
const User = require('../models/user.model');
const fs = require('fs');
const cloudinary = require('../cloudinary/config');

const uploadPhoto = async(req = request, res = response) => {
    const id = req.params.id;
    const user = await User.findById(id);
    console.log(req.files.photo);
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

        const pathName = `./src/upload/${photo.name}`;

        photo.mv(pathName, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        })

        await cloudinary.uploader.upload(pathName, async(error, result) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            url = result.url;
            await User.findByIdAndUpdate(id, { img: result.url })
            if (fs.existsSync(pathName)) {
                fs.unlinkSync(pathName)
            }
        });

        return res.status(200).json({
            ok: true,
            message: 'Archivo subido.',
            data: url
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error, please check logs.'
        })
    }
}

const uploadPhotoProduct = async(req = request, res = response) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No files were uploaded.'
            });
        }
        let photos = [];
        let urls = [];
        photos.push(req.files.img1);
        photos.push(req.files.img2);
        photos.push(req.files.img3);
        photos.forEach(photo => {
            let clean_name = photo.name.split('.');
            let extension = clean_name[clean_name.length - 1];
            let extensions_valids = ['jpg', 'png', 'jpeg', 'gif'];
            if (!extensions_valids.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    message: `Extensión no valido en ${photo.name}`
                })
            }
        })
        photos.forEach(async(photo) => {
            let pathName = `./src/upload/product/${photo.name}`;
            photo.mv(pathName, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
            })
            await cloudinary.uploader.upload(pathName, (error, result) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    })
                }
                urls.push(result.url);
                if (fs.existsSync(pathName)) {
                    fs.unlinkSync(pathName)
                }
            });
        })
        let inter = setInterval(() => {
            if (urls.length === 3) {
                clearInterval(inter)
                return res.status(200).json({
                    ok: true,
                    message: 'Archivos subidos.',
                    urls
                })
            }
        }, 500);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error, por favor revisa los logs.'
        })
    }
}
module.exports = {
    uploadPhoto,
    uploadPhotoProduct
}