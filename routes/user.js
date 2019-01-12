const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/userModel');
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const fawn = require('fawn');




router.post('/', async (req, res) => {

    var { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var userData = await User.findOne({ email: req.body.email });
    if (userData) return res.status(400).send("same name user exists");



    var genpassword = generator.generate({
        length: 10,
        numbers: true
    })
    var salt = await bcrypt.genSalt(10);
    userData = new User(_.pick(req.body, ['name', 'email']));
    userData.password = await bcrypt.hash(genpassword, salt);


    return new Promise(function (resolve, reject) {
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.get('adminMailId'), // generated ethereal user
                    pass: config.get('adminpassword') // generated ethereal password
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'ypanchal10@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Hello ' + req.body.name, // Subject line
                text: '', // plain text body
                html: '<p>Your current password is<b>' + genpassword + '</b></p>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("ERRR0",error);
                    reject();
                    
                }
                else {
                    resolve(true);
                }
                console.log('Message sent: %s', info);
            });
        });
    }).then(async function(){
        const token = userData.generateAuthToken();
        var result = await userData.save();
        
        var obj = new Object();
        obj.name = userData.name;
        obj.email = userData.email;
        obj.token = token;
        return res.status(200).send(obj);
    })
    .catch((err)=>{
        console.log("ERR",err);
        return res.status(500).send("Internal Server Problem")
    })



})

module.exports = router;



