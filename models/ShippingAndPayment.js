const mongoose = require('mongoose');
const Joi = require('joi');

const shippingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
});

const paymentSchema = new mongoose.Schema({
  shippingMethods: [shippingSchema],
  delivery: [String],
  conclusion: String,
});

function validateDelivery(values) {
  const schema = {
    delivery: Joi.array().items(Joi.string()).min(0),
    conclusion: Joi.string(),
  };

  return Joi.validate(values, schema);
}

function validateShipping(values) {
  const schema = {
    title: Joi.string().required(),
    image: Joi.string().required(),
  };

  return Joi.validate(values, schema);
}

module.exports.ShippingAndPayment = mongoose.model('ShippingAndPayment', paymentSchema);
module.exports.validateDelivery = validateDelivery;
module.exports.validateShipping = validateShipping;
