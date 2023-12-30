const express = require('express');
const router = express.Router();
const controller = require('./home.controller')

/* GET home page. */
router.get('/', controller.HomePage);

module.exports = router;
