const Cart = require('../../../models/Cart');
const Card = require('../../../models/Card');
exports.CartPage = async (req, res, next) => {
  const scripts = [
    '/scripts/cart.js',
  ];
  const styles = [
    "/styles/cart.css"
  ];

  var cart = await Cart.findOne({userId: req.user.id})
  if(!cart){
    cart = new Cart({
      userId: req.user.id
    })
  }
  const cart_items = {
    total_price : cart.totalPrice,
    items:[]
  }

  for (const item of cart.items) {
    const card = await Card.findOne({id:item.productId})
    console.log(card)
    const product = {
      card : card,
      quantity: item.quantity,
      price: item.price
    }
    cart_items.items.push(product)
  }

  console.log(cart_items)

  res.render('user/cart-page', 
  {
    layout: 'user/layouts/layout', 
    title: "Your Shopping Cart",
    scripts: scripts,
    styles: styles,
    cart_items: cart_items
  });
}