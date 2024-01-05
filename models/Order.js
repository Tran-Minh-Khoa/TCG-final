const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String },
    status: { type: String },
    totalPrice: { type: Number },
    orderDate: { type: Date, default: Date.now },
  });
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;