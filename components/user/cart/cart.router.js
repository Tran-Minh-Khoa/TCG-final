const express = require('express');
const router = express.Router();
const controller = require('./card.controller')
const Cart = require('../../../models/Cart');
/* GET home page. */
router.get('/', controller.CartPage);
router.post('/add-to-cart', async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body; // Nhận thông tin về user ID, product ID và số lượng sản phẩm từ request body

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng hay chưa
        let cart = await Cart.findOne({ user_id });

        // Nếu giỏ hàng không tồn tại, tạo giỏ hàng mới
        if (!cart) {
            cart = new Cart({
                user_id,
                items: []
            });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProductIndex = cart.items.findIndex(item => item.product_id === product_id);

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng sản phẩm
            cart.items[existingProductIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
            cart.items.push({ product_id, quantity });
        }

        // Lưu giỏ hàng đã cập nhật vào cơ sở dữ liệu
        const updatedCart = await cart.save();

        res.status(200).json({ message: 'Product added to cart successfully', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/update-cart-item', async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body; // Nhận thông tin về user ID, product ID và số lượng sản phẩm từ request body

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.items.find(item => item.product_id === product_id);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Cập nhật số lượng sản phẩm
        existingProduct.quantity = quantity;

        // Lưu giỏ hàng đã cập nhật vào cơ sở dữ liệu
        const updatedCart = await cart.save();

        res.status(200).json({ message: 'Cart item quantity updated successfully', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
