const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = {
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
};

const productOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orders: {
    type: [orderSchema],
    required: true,
  },
});

function validateOrder(values) {
  const orderSchemaJoi = {
    product: Joi.objectId().required(),
    count: Joi.number().min(1).required(),
  };

  const schema = {
    user: Joi.objectId().required(),
    orders: Joi.array().items(orderSchemaJoi).min(1).required(),
  };

  return Joi.validate(values, schema);
}

module.exports.ProductOrder = mongoose.model('ProductOrder', productOrderSchema);
module.exports.validateOrder = validateOrder;
