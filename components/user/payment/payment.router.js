const express = require('express');
const router = express.Router();
const controller = require('./payment.controler')

/* GET home page. */
router.get('/', controller.HomePage);

module.exports = router;
