const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
  title: String,
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
});

function validateProductBody(product) {
  const schema = {
    title: Joi.string().required(),
    category: Joi.objectId().required(),
  };

  return Joi.validate(product, schema);
}

module.exports.Product = mongoose.model('Product', productSchema);
module.exports.validateProduct = validateProductBody;
