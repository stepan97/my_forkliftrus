const mongoose = require('mongoose');
const Joi = require('joi');

const catalogueSchema = new mongoose.Schema({
  title: String,
  image: String,
  categories: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  }],
});

function validateCatalogue(catalogue) {
  const schema = {
    title: Joi.string().required(),
    image: Joi.string().required(),
    categories: Joi.array().items(Joi.objectId()),
  };

  return Joi.validate(catalogue, schema);
}

module.exports.Catalogue = mongoose.model('Catalogue', catalogueSchema);
module.exports.validateCatalogue = validateCatalogue;
