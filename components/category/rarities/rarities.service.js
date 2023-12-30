const Rarity = require("../../../models/Rarity");

exports.GetAllRarities = async () => {
  try {
    const rarities = await Rarity.find();
    return rarities;
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};
