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