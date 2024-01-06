const Card = require("../../../models/Card");
//connect firebase
const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
exports.uploadCard = (file, id) => {
  return new Promise((resolve, reject) => {
    try {
      const filepath = file.fieldname + `/${id}` + "/" + file.originalname;
      const blob = bucket.file(filepath);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error(err);
        reject("Error uploading file.");
      });

      blobStream.on("finish", () => {
        blob.getSignedUrl(
          {
            action: "read",
            expires: "03-09-2024",
          },
          (err, signedUrl) => {
            if (err) {
              console.error("Error getting signed URL:", err);
              reject("Error getting file URL.");
            }
            console.log("File uploaded successfully.");
            resolve(signedUrl);
          }
        );
      });

      blobStream.end(file.buffer);
    } catch (error) {
      console.error(error);
      reject("Error during file upload.");
    }
  });
};

exports.updateCard = async (cardInfo, imageUrl) => {
  try {
    const typesArray = cardInfo.types ? cardInfo.types.split(",") : [""];
    const subtypesArray = cardInfo.subtypes
      ? cardInfo.subtypes.split(",")
      : [""];
    const updateData = {
      name: cardInfo.name,
      rarity: cardInfo.rarity,
      setId: cardInfo.setId,
      isActive: cardInfo.isActive,
      updatedAt: new Date(),
      types: typesArray,
      marketPrices: cardInfo.marketPrices,
      timestamp: new Date().getTime(),
      amount: cardInfo.amount,
      subtypes: subtypesArray,
      supertype: cardInfo.supertype,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    let updatedCard;

    // Find the card by ID
    const existingCard = await Card.findOne({ id: cardInfo.id });

    if (existingCard) {
      // Update the existing card
      updatedCard = await Card.findOneAndUpdate(
        { id: cardInfo.id },
        { $set: updateData },
        { new: true }
      );
    } else {
      // Create a new card if ID doesn't exist
      const newCardData = {
        id: cardInfo.id,
        image:
          "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
        ...updateData,
        listImages: [
          "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
          "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
          "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
        ],
      };
      updatedCard = await Card.create(newCardData);
    }

    return updatedCard;
  } catch (error) {
    console.error("Error updating/creating card:", error);
    throw new Error("Error updating/creating card.");
  }
};
exports.updateListCard = async (id, listImageCardUrl) => {
  try {
    const updatedCard = await Card.findOne({ id: id });

    listImageCardUrl.forEach((imageUrl, index) => {
      if (
        listImageCardUrl[index] != null &&
        updatedCard.listImages[index] != imageUrl
      ) {
        updatedCard.listImages[index] = imageUrl;
      }
    });

    await updatedCard.save();
    // Trả về thông tin thẻ đã cập nhật
    return updatedCard;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating card:", error);
    throw new Error("Error updating card.");
  }
};

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
  if (card) return card;
  return "\0";
};

exports.DisableCard = async (cardId) => {
  try {
    const updatedCard = {
      isActive: false,
    };

    const result = await Card.findOneAndUpdate(
      { id: cardId },
      { $set: updatedCard },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error disabling card:", error);
    throw error;
  }
};

exports.EnableCard = async (cardId) => {
  try {
    const updatedCard = {
      isActive: true,
    };

    const result = await Card.findOneAndUpdate(
      { id: cardId },
      { $set: updatedCard },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error enabling card:", error);
    throw error;
  }
};

exports.DeleteCard = async (cardId) => {
  try {
    const result = await Card.findOneAndDelete({ id: cardId });

    if (!result) {
      throw new Error("Card not found");
    }

    return result;
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};
