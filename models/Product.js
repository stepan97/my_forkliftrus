const mongoose = require('mongoose');
const Joi = require('joi');
const { DEFAULT_PRODUCT_IMAGE } = require('../constants');

const productSchema = new mongoose.Schema({
  title: String,
  images: [{
    type: String,
    required: true,
    default: [DEFAULT_PRODUCT_IMAGE],
  }],
  mainImage: {
    type: String,
    required: true,
    default: DEFAULT_PRODUCT_IMAGE,
  },
  articul: Number,
  price: Number,
  numberInStock: Number,
  description: String,
  discount: { type: Number, default: false },
  characteristics: [{
    key: String,
    value: String,
  }],
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
});

function validateProductBody(product) {
  const characteristicSchema = {
    key: Joi.string(),
    value: Joi.string(),
  };

  const schema = {
    title: Joi.string().required(),
    images: Joi.array().items(Joi.string()).default([DEFAULT_PRODUCT_IMAGE]),
    articul: Joi.number().required(),
    price: Joi.number().required(),
    numberInStock: Joi.number().required(),
    description: Joi.string(),
    discount: Joi.number().default(0).required(),
    characteristics: Joi.array().items(characteristicSchema),
    category: Joi.objectId().required(),
  };

  return Joi.validate(product, schema);
}

module.exports.Product = mongoose.model('Product', productSchema);
module.exports.validateProduct = validateProductBody;
