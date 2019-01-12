const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User } = require('../models/userModel');
const auth = require ('../middleware/auth')


router.post('/',auth, async (req, res) => {
  
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Invalid UserName or Password");

    const isValid= await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(400).send("Invalid UserName or Password");
    
    const token = user.generateAuthToken();

    var obj=new Object();
    obj.name=user.name;
    obj.email=user.email;
    obj.token=token;

    return res.send(obj);
})

function validateUser(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
  }

module.exports = router; 
