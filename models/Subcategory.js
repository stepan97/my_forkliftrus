const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    name: String,
    catalogue: mongoose.SchemaTypes.ObjectId,
    category: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model("Subcategory", subcategorySchema);