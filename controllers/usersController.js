const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {


    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        //  myUser es el usuario que retorna la consulta sql
        User.findByEmail(email, async (err, myUser) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registo del usuario',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ // El cliente no tiene autorizacion para realizar esta peticion
                    success: false,
                    message: 'El email no fue encontrado'
                });

            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`
                }

                return res.status(201).json({
                    success:true,
                    mesagge: 'El usuario fue autenticado',
                    data: data // Le enviamos toda la data del usuario incluyendo el token
                });

            }
            else {
                return res.status(401).json({ // El cliente no tiene autorizacion para realizar esta peticion
                    success: false,
                    message: 'El password es incorrecto'
                });

            }

            

        });


    },



    register(req, res) {

        const user = req.body; // Capturo los datos que me envie el cliente
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registo del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success:true,
                mesagge: 'El registro se realizo correctamente',
                data: data // El ID del nuevo usuario que se registro
            });

        });
    },

    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user); // Capturo los datos que me envie el cliente

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registo del usuario',
                    error: err
                });
            }

            user.id = data;

            return res.status(201).json({
                success:true,
                mesagge: 'El registro se realizo correctamente',
                data: user 
            });

        });
    },



}