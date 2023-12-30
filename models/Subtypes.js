const mongoose = require("mongoose");
const subtypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Subtypes = mongoose.model("Subtypes", subtypeSchema);
module.exports = Subtypes;
