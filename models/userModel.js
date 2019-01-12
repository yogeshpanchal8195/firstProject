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
  }
})

schema.methods.generateAuthToken = function () {
  const token = jwt.sign({id:this._id,email: this.email ,name:this.name}, config.get('jwtPrivateKey'));
  // console.log(token)
  return token;
}

const UserData = mongoose.model('User',schema);


function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255),
  }
  return Joi.validate(user, schema);
}
module.exports.User=UserData;
module.exports.validateUser=validateUser;
