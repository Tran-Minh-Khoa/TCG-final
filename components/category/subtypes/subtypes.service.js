const Subtypes = require("../../../models/Subtypes");

exports.GetAllSubtypes = async () => {
  try {
    const subTypes = await Subtypes.find();
    return subTypes;
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};
