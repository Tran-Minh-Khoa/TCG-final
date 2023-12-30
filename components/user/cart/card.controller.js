exports.CartPage = function(req, res, next) {
  const scripts = [
    '/scripts/cart.js"',
  ];
  const styles = [
    "/styles/cart.css"
  ];
  res.render('user/cart-page', 
  {
    layout: 'user/layouts/layout', 
    title: "Your Shopping Cart",
    scripts: scripts,
    styles: styles,
  });
}