const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    // required: true,
    minlength: 5,
    maxlength: 1024
  },
  userType:{
    type:Number,
    required:true,
    min: 1,
    max: 4
  }
})

schema.methods.generateAuthToken = function () {
  const token = jwt.sign({id:this._id,email: this.email ,userType:this.userType,name:this.name}, config.get('jwtPrivateKey'));
  // console.log(token)
  return token;
}

const UserData = mongoose.model('User',schema);


function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255),
    userType:Joi.number().required().min(1).max(4)
  }
  return Joi.validate(user, schema);
}
module.exports.User=UserData;
module.exports.validateUser=validateUser;
