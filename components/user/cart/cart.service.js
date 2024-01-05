const Order = require('../../../models/Order');
const OrderDetail = require('../../../models/OrderDetail');

exports.RemoveOrder = async (orderId) => {
  try {
    // Xóa Order có orderId
    const deletedOrder = await Order.deleteOne({ id: orderId });
    if (deletedOrder.deletedCount === 0) {
      throw new Error('Order not found');
    }

    // Xóa OrderDetail có orderId
    const deletedOrderDetails = await OrderDetail.deleteMany({ orderId: orderId });
    return { deletedOrder, deletedOrderDetails };
  } catch (error) {
    throw new Error('Error deleting order and order details: ' + error.message);
  }
};
