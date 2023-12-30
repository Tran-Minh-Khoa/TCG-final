const Card = require('../../../models/Card');
//connect firebase
const admin = require('firebase-admin');

const bucket = admin.storage().bucket();
exports.uploadCard = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const filepath = file.fieldname + '/' + file.originalname;
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

  exports.updateCard = async (cardInfo, imageUrl) => {
    try {
      const updateData = {
        name: cardInfo.name,
        rarity: cardInfo.rarity,
        setId: cardInfo.setId,
        updatedAt: new Date(),
        types: cardInfo.types,
        marketPrices: cardInfo.price,
        timestamp: new Date().timestamp,
        amount: cardInfo.amount
      };
  
      // Kiểm tra xem imageUrl có được cung cấp không
      if (imageUrl) {
        updateData.image = imageUrl; // Hoặc sử dụng 'imageUrl' thay cho 'image'
      }
  
      // Tiến hành cập nhật dữ liệu thẻ
      const updatedCard = await Card.findOneAndUpdate(
        { id: cardInfo.id }, // Điều kiện tìm thẻ cần cập nhật (thay id bằng trường khóa chính của thẻ)
        { $set: updateData }, // Dữ liệu cần cập nhật
        { new: true } // Trả về thẻ đã cập nhật (nếu không có sẽ trả về thẻ trước khi cập nhật)
      );
  
      // Trả về thông tin thẻ đã cập nhật
      return updatedCard;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error updating card:', error);
      throw new Error('Error updating card.');
    }
  };
exports.updateListCard = async (cardID,listImageCardUrl) => {
  try{
    const updateData = {
      listImages: []
    }
    listImageCardUrl.forEach((imageUrl, index) => {
      if(imageUrl)
      {
        updateData.listImages[index] = imageUrl
      }
    });
    const updatedCard = await Card.findOneAndUpdate(
      { id: cardInfo.id }, // Điều kiện tìm thẻ cần cập nhật (thay id bằng trường khóa chính của thẻ)
      { $set: updateData }, // Dữ liệu cần cập nhật
      { new: true } // Trả về thẻ đã cập nhật (nếu không có sẽ trả về thẻ trước khi cập nhật)
    );
  
    // Trả về thông tin thẻ đã cập nhật
    return updatedCard;
  }
  catch(error){
    // Xử lý lỗi nếu có
    console.error('Error updating card:', error);
    throw new Error('Error updating card.');
  }
}
exports.GetAllCards = async () => {
  try {
    const card = await Card.find();
    return card;
  } catch (error) {
    throw new Error(
      "Error fetching filtered products from database: " + error.message
    );
  }
};


exports.GetCard = async (id) => {
  const card = await Card.findOne({ id: id });
  return card;
}
