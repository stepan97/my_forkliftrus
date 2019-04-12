/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

adminSchema.generateAuthToken = function genAuthToken() {
  const token = jwt.sign({ _id: this._id, name: this.name }, config.get('jwtPrivateKey'));
  return token;
};

function validateAdmin(admin) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email(),
    password: Joi.string().required(),
  };

  return Joi.validate(admin, schema);
}

module.exports.Admin = mongoose.model('Admin', adminSchema);
module.exports.validateAdmin = validateAdmin;
