const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User' },
    order_date: { type: Date, default: Date.now },
  });
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;