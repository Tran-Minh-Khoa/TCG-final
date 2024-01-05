const express = require("express");
const router = express.Router();
const controller = require("./dashboard.controller");

/* GET home page. */
router.get("/", controller.DashboardPage);
router.get("/earnings/:days?", controller.GetEarning);
router.get("/totalEarning/:days?", controller.GetTotalEarning);
router.get("/todayOrder", controller.GetTodayOrder);
router.get("/topSetRevenue/:days", controller.GetTopSetRevenue);
router.get("/topRevenue/:days", controller.GetTopRevenue);

module.exports = router;
