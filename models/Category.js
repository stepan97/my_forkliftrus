const mongoose = require('mongoose');
const Joi = require('joi');

const subcategorySchema = new mongoose.Schema({
  title: String,
});

const categorySchema = new mongoose.Schema({
  title: String,
  image: String,
  subcategories: {
    type: [subcategorySchema],
  },
});

function validateCategory(category) {
  const subSchema = {
    title: Joi.string(),
  };
  const schema = {
    title: Joi.string().required(),
    image: Joi.string().required(),
    subcategories: Joi.array().items(subSchema),
  };

  return Joi.validate(category, schema);
}

module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.validateCategory = validateCategory;
