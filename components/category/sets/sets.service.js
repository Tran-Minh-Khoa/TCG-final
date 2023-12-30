const Set = require("../../../models/Set");

exports.GetAllSets = async () => {
  try {
    const set = await Set.find();
    return set;
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};

exports.GetSet = async (id) => {
  const set = await Set.findOne({ id: id });
  return set;
};

exports.UpdateSet = async (setId, updatedSet) => {
  try {
    const result = await Set.findOneAndUpdate(
      { id: setId },
      { $set: updatedSet },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error editing set:", error);
    throw error;
  }
};

exports.CreateSet = async (newSet) => {
  try {
    // Check if the set with the given ID already exists
    const existingSet = await Set.findOne({ id: newSet.id });
    if (existingSet) {
      throw new Error(`Set with ID ${newSet.id} already exists.`);
    }

    // If the set does not exist, create a new one
    const createdSet = await Set.create(newSet);
    return createdSet;
  } catch (error) {
    console.error("Error creating set:", error);
    throw error;
  }
};

exports.DisableSet = async (setId) => {
  try {
    const updatedSet = {
      isActive: false,
    };

    const result = await Set.findOneAndUpdate(
      { id: setId },
      { $set: updatedSet },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error disabling set:", error);
    throw error;
  }
};

exports.EnableSet = async (setId) => {
  try {
    const updatedSet = {
      isActive: true,
    };

    const result = await Set.findOneAndUpdate(
      { id: setId },
      { $set: updatedSet },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error enabling set:", error);
    throw error;
  }
};

exports.DeleteSet = async (setId) => {
  try {
    const result = await Set.findOneAndDelete({ id: setId });

    if (!result) {
      throw new Error("Set not found");
    }

    return result;
  } catch (error) {
    console.error("Error deleting set:", error);
    throw error;
  }
};
