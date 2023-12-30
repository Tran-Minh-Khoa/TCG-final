const mongoose = require("mongoose");
const raritySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
});
const Rarity = mongoose.model("Rarity", raritySchema);
module.exports = Rarity;
