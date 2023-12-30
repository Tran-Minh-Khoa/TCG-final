const mongoose = require("mongoose");
const typeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
});
const Types = mongoose.model("Types", typeSchema);
module.exports = Types;
