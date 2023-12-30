const express = require('express');
const router = express.Router();
const ProductController = require('./product.controler');
/* GET home page. */
// router.get('/', ProductController.getProducts);
router.get('/', ProductController.productsPage);
router.get('/filter', ProductController.getProductsByFilter);
router.get('/filterBar/:except', ProductController.filtersBar);
router.get('/search', ProductController.getProductsBySearch);
router.get('/detail/:id', ProductController.getProductDetail);
router.get('/detail/reviews/:id', ProductController.ListReviews);
router.get('/detail',ProductController.productExample)
router.post('/detail/:id', ProductController.postReview);
module.exports = router;
