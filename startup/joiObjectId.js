const Joi = require('joi');

module.exports = function joiObjectId() {
  Joi.objectId = require('joi-objectid')(Joi);
};
