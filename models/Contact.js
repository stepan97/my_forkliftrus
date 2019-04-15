const mongoose = require('mongoose');
const Joi = require('joi');

const contactsSchema = new mongoose.Schema({
  email: String,
  phoneNumbers: {
    type: [String],
    default: [],
  },
  partners: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Partner',
    default: [],
  },
  address: String,
  workingHours: String,
  mapCoordinates: {
    latitude: String,
    longitude: String,
  },
});

function validateContacts(values) {
  const coordsSchema = {
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  };

  const schema = {
    email: Joi.string().email().default(''),
    phoneNumbers: Joi.array().items(Joi.string()).default([]),
    // partners: Joi.array().items(Joi.objectId()).default([]),
    address: Joi.string().default(''),
    workingHours: Joi.string().default(''),
    mapCoordinates: Joi.object(coordsSchema).default({ latitude: '0', longitude: '0' }),
  };

  return Joi.validate(values, schema);
}

module.exports.Contact = mongoose.model('Contact', contactsSchema);
module.exports.validateContacts = validateContacts;
