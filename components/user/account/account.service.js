const User = require('../../../models/User');
const Order = require('../../../models/Order');
const OrderDetail = require('../../../models/OrderDetail');
const Card = require('../../../models/Card');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');

const bucket = admin.storage().bucket();
exports.changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      console.log('User not found');
      throw new Error('User not found');
    }
    if (user?.password) {
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        console.log('Old password is incorrect');
        throw new Error('Old password is incorrect');
      }
    }
    user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    await user.save();

    return { message: 'Password changed successfully' }; // Trả về thông báo khi thay đổi mật khẩu thành công
  } catch (error) {
    //   console.error('Error changing password:', error);
    throw new Error('Error changing password: ' + error.message);
  }
};
exports.uploadAvatar = (file,id) => {
  return new Promise((resolve, reject) => {
    try {
      const filepath = file.fieldname +`/${id}`+ '/' + file.originalname;
      const blob = bucket.file(filepath);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', err => {
        console.error(err);
        reject('Error uploading file.');
      });

      blobStream.on('finish', () => {
        blob.getSignedUrl({
          action: 'read',
          expires: '03-09-2024'
        }, (err, signedUrl) => {
          if (err) {
            console.error('Error getting signed URL:', err);
            reject('Error getting file URL.');
          }
          console.log('File uploaded successfully.');
          resolve(signedUrl);
        });
      });

      blobStream.end(file.buffer);
    } catch (error) {
      console.error(error);
      reject('Error during file upload.');
    }
  });
};

exports.updateProfile = async (userInfo, imageUrl) => {
  try {
    const updateData = {
      name: userInfo.name,
      phone: userInfo.phone,
      dob: userInfo.dob,
      gender: userInfo.gender,
    };

    // Kiểm tra xem imageUrl có được cung cấp không
    if (imageUrl) {
      updateData.avatar = imageUrl;
    }

    // Tiến hành cập nhật dữ liệu
    const updatedProfile = await User.findOneAndUpdate(
      { id: userInfo.id }, // Điều kiện tìm thẻ cần cập nhật (thay id bằng trường khóa chính của thẻ)
      { $set: updateData }, // Dữ liệu cần cập nhật
      { new: true } // Trả về thẻ đã cập nhật (nếu không có sẽ trả về thẻ trước khi cập nhật)
    );

    // Trả về thông tin thẻ đã cập nhật
    return updatedProfile;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error updating profile:', error);
    throw new Error('Error updating profile.');
  }
};
exports.getUserProfile= async (userId) => {
  const user = await User.findOne({ id: userId })
  return user
}
exports.getUserOrders = async (userId) => {
  const orders = await Order.find({
    $and: [
      {userId: userId},
      {status: {
        $ne: "unpaid"
      }}
    ]
  })
  return orders
}
exports.getUserOrderDetail = async (orderId) => {
  const order = await Order.findOne({id: orderId})
  const orderDetails = await OrderDetail.find({orderId: orderId})

  const order_detail = {
    order_id: order.id,
    order_status: order.status,
    order_date: order.orderDate,
    total_price: order.totalPrice,
    items: []
  }

  for (const item of orderDetails) {
    const card = await Card.findOne({id: item.cardId})
    const product = {
      card : card,
      quantity: item.quantity,
      price: item.totalPrice
    }
    order_detail.items.push(product)
  }

  return order_detail
}