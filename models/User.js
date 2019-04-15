const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roles: {
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
  },
  isActive: { type: Boolean, default: false }
});

userSchema.generateAuthToken = function genAuthToken() {
  const token = jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
  }, config.get('jwtPrivateKey'));

  return token;
};

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };

  return Joi.validate(user, schema);
}

module.exports.User = mongoose.model('User', userSchema);
module.exports.validateUser = validateUser;
