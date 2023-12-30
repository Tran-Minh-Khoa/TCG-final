const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    order_id: { type: String, ref: 'Order' },
    card_id: { type: String, ref: 'Card' },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
  });

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
module.exports = OrderDetail