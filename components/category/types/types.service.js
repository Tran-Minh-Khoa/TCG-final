const Types = require("../../../models/Types");

exports.GetAllTypes = async () => {
  try {
    const types = await Types.find();
    return types;
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};
