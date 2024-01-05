const Order = require("../../../models/Order");
const OrderDetail = require("../../../models/OrderDetail");

exports.GetAllOrder = async () => {
  try {
    const order = await Order.find();
    return order;
  } catch (error) {
    throw new Error(
      "Error fetching filtered orders from database: " + error.message
    );
  }
};

exports.UpdateOrderStatusById = async (orderId, newStatus) => {
  try {
    // Find the order by ID
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      throw new Error("Order not found");
    }

    // Update the order status
    order.status = newStatus;

    // Save the updated order
    await order.save();

    return order;
  } catch (error) {
    throw new Error("Error updating order status: " + error.message);
  }
};

//Chưa dám test
exports.DeleteOrderAndDetails = async (orderId) => {
  try {
    // Find the order by ID
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      throw new Error("Order not found");
    }

    // Find and delete all related order details
    await OrderDetail.deleteMany({ orderId: orderId });

    // Delete the order
    await order.deleteOne();

    return "Order and related details deleted successfully";
  } catch (error) {
    throw new Error("Error deleting order and details: " + error.message);
  }
};

exports.GetOrder = async (id) => {
  const order = await Order.findOne({ id: id });
  return order;
};

exports.GetOrderDetails = async (id) => {
  try {
    const orderDetails = await OrderDetail.find({ orderId: id });
    return orderDetails;
  } catch (error) {
    throw new Error(
      "Error fetching filtered orderDetails from database: " + error.message
    );
  }
};
