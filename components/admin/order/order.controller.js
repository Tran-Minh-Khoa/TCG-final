const service = require("./order.service");
const userService = require("../userManagement/user-management.service");

exports.OrderPage = async function (req, res, next) {
  const styles = [
    "/admin/vendor/datatables/dataTables.bootstrap4.min.css",
    "/adminExtra/styles/card-list.css",
  ];
  const scripts = [
    "/admin/js/datatables/table-card.js",
    "/admin/vendor/datatables/jquery.dataTables.min.js",
    "/admin/vendor/datatables/dataTables.bootstrap4.min.js",
    "/adminExtra/scripts/order-list.js",
  ];
  var orders = await service.GetAllOrder();
  await Promise.all(orders.map(formatAndReplaceOrderDate));
  await Promise.all(orders.map(roundTotalPrice));
  await Promise.all(orders.map(addUserMail));
  res.render("admin/orders", {
    layout: "admin/layouts/layout",
    title: "Orders",
    scripts: scripts,
    styles: styles,
    orders: orders,
    currentUser: req.user,
  });
};

exports.OrderEditPage = async function (req, res, next) {
  const id = req.params.id;

  const styles = [
    "/admin/vendor/datatables/dataTables.bootstrap4.min.css",
    "/adminExtra/styles/card-list.css",
  ];
  const scripts = [
    "/admin/js/datatables/table-card.js",
    "/admin/vendor/datatables/jquery.dataTables.min.js",
    "/admin/vendor/datatables/dataTables.bootstrap4.min.js",
    "/adminExtra/scripts/order-edit.js",
  ];
  const order = await service.GetOrder(id);
  const orderDetails = await service.GetOrderDetails(id);
  res.render("admin/order-edit", {
    layout: "admin/layouts/layout",
    title: "Order Edit",
    scripts: scripts,
    styles: styles,
    order: order,
    orderDetails: orderDetails,
    currentUser: req.user,
  });
};

exports.UpdateOrderStatus = async (req, res, next) => {
  const orderId = req.params.id; // Assuming the order ID is in the route parameters
  const newStatus = req.body.newStatus; // Assuming the new status is sent in the request body
  try {
    // Call the service function to update the order status
    const updatedOrder = await service.UpdateOrderStatusById(
      orderId,
      newStatus
    );

    // Send a success response with the updated order
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

exports.DeleteOrder = async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const result = await service.DeleteOrderAndDetails(orderId);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function formatAndReplaceOrderDate(order) {
  const date = new Date(order.orderDate);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Replace the orderDate property with the formatted date
  order.formatedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
}
async function roundTotalPrice(order) {
  order.totalPrice = parseFloat(order.totalPrice.toFixed(2));
}

async function addUserMail(order) {
  try {
    const user = await userService.GetUser(order.userId);
    order.userMail = user.email;
  } catch (error) {
    // Handle errors if needed
    console.error(error);
  }
}
