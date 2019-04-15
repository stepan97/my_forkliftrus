const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  title: { type: String, required: false },
  image: { type: String, required: true },
});

module.exports.Partner = mongoose.model('Partner', partnerSchema);
