const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  title: String,
  image: String,
});

const contactsSchema = new mongoose.Schema({
  email: String,
  phoneNumbers: {
    type: [String],
    default: [],
  },
  partners: {
    type: [carouselSchema],
    required: false,
  },
  address: String,
  workingHours: String,
});

module.exports = mongoose.model('Contact', contactsSchema);
