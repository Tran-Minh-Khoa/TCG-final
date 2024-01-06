const Cart = require('../../../models/Cart');
const Card = require('../../../models/Card');
exports.RemoveCart = async (userId) => {
    try {
      const deletedCart = await Cart.deleteOne({ userId: userId });
      if (deletedCart.deletedCount === 0) {
        throw new Error('Cart not found');
      }
      return deletedCart;
    } catch (error) {
      throw new Error('Error deleting cart: ' + error.message);
    }
  }
  exports.UpdateCardAmount = async (cardId, quantity) => {
    try {
        const card = await Card.findOne({ id: cardId });
        if (!card) {
            throw new Error('Card not found');
        }
        card.amount -= quantity;
        await card.save();
        return card;
    } catch (error) {
        throw new Error('Error updating card amount: ' + error.message);
    }
};
