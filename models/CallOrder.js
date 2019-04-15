const mongoose = require('mongoose');
const Joi = require('joi');

const callOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

function validateCallOrder(values) {
  const schema = {
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  };

  return Joi.validate(values, schema);
}

module.exports.CallOrder = mongoose.model('CallOrder', callOrderSchema);
module.exports.validateCallOrder = validateCallOrder;
