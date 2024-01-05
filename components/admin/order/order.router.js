const express = require("express");
const router = express.Router();
const controller = require("./order.controller");

router.get("/edit/:id", controller.OrderEditPage);
router.put("/update/:id", controller.UpdateOrderStatus);
router.get("/", controller.OrderPage);
router.delete("/delete/:id", controller.DeleteOrder);
module.exports = router;
