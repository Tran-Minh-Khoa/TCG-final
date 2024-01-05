const mongoose = require('mongoose')

const orderDetailSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    orderId: { type: String },
    cardId: { type: String},
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  });

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
module.exports = OrderDetail