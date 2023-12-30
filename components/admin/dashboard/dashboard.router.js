const express = require('express');
const router = express.Router();
const controller = require('./dashboard.controller')

/* GET home page. */
router.get("/", controller.DashboardPage);

module.exports = router;
