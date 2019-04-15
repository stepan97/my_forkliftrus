const mongoose = require('mongoose');
const Joi = require('joi');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  feedbackMessage: { type: String, required: true },
});

function validateFeedback(values) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email().allow(''),
    phone: Joi.string().required(),
    feedbackMessage: Joi.string().required(),
  };

  return Joi.validate(values, schema);
}

module.exports.Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports.validateFeedback = validateFeedback;