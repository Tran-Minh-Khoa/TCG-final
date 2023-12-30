const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    items: [
        {
            product_id: { type: String, required: true },
            quantity: { type: Number, default: 1 }
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
