const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/userModel');
const nodemailer = require('nodemailer');
const generator = require('generate-password');




router.post('/', async (req, res) => {

    var { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("same name user exists");



    var genpassword = generator.generate({
        length: 10,
        numbers: true
    })
    var salt = await bcrypt.genSalt(10);
    user = new User(_.pick(req.body, ['name', 'email', 'userType']));
    user.password = await bcrypt.hash(genpassword, salt);


    console.log(genpassword);
    console.log("C", req.body)

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
                return res.status(500).send("Internal server error");
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });





    var result = await user.save();

    const token = user.generateAuthToken();

    var obj = new Object();
    obj.name = user.name;
    obj.email = user.email;
    obj.userType = user.userType;
    obj.token = token;
    return res.status(200).send(obj);








})

module.exports = router;



