const User = require("../../../models/User");

exports.GetAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

exports.GetUser = async (userId) => {
  const user = await User.findOne({ id: userId });
  return user;
};

exports.UpdateUser = async (id, userInfo, imageUrl) => {
  try {
    // Kiểm tra xem imageUrl có được cung cấp không
    if (imageUrl) {
      userInfo.avatar = imageUrl;
    }
    const updatedProfile = await User.findOneAndUpdate(
      { id: id }, // Điều kiện tìm thẻ cần cập nhật (thay id bằng trường khóa chính của thẻ)
      { $set: userInfo }, // Dữ liệu cần cập nhật
      { new: true } // Trả về thẻ đã cập nhật (nếu không có sẽ trả về thẻ trước khi cập nhật)
    );

    return updatedProfile;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating profile:", error);
    throw new Error("Error updating profile.");
  }
};

exports.BanUser = async (userId) => {
  try {
    const updatedSet = {
      isBaned: true,
    };

    const result = await User.findOneAndUpdate(
      { id: userId },
      { $set: updatedSet },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error disabling User:", error);
    throw error;
  }
};

exports.UnbanUser = async (userId) => {
  try {
    const updatedSet = {
      isBaned: false,
    };

    const result = await User.findOneAndUpdate(
      { id: userId },
      { $set: updatedSet },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error enabling user:", error);
    throw error;
  }
};

exports.DeleteUser = async (userId) => {
  try {
    const result = await User.findOneAndDelete({ id: userId });

    if (!result) {
      throw new Error("User not found");
    }

    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
