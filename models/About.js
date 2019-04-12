const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  title: String,
  image: String,
});

const aboutSchema = new mongoose.Schema({
  phones: [String],
  address: String,
  carousel: carouselSchema,
  socialNetwork: [String],
});

module.exports = mongoose.model('About', aboutSchema);