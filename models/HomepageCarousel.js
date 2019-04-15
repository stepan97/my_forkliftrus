const mongoose = require('mongoose');
const Joi = require('joi');

const homepageCarouselSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  buttonText: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

function validateHompageCarousel(values) {
  const schema = {
    title: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string(),
    buttonText: Joi.string().required(),
    url: Joi.string().required(),
  };

  return Joi.validate(values, schema);
}

module.exports.HomepageCarousel = mongoose.model('HomepageCarousel', homepageCarouselSchema);
module.exports.validateHompageCarousel = validateHompageCarousel;
