const express = require("express");
const router = express.Router();
const controller = require("./user-management.controller");
const multer = require("multer");
const multerStorage = multer.memoryStorage();

const multerUpload = multer({ storage: multerStorage });

/* GET home page. */
router.get("/", controller.UserManagementPage);
router.get("/edit/:id", controller.UserManagementEditPage);
router.put("/update/:id", multerUpload.single("avatar"), controller.UpdateUser);

router.put("/ban/:id", controller.BanUser);
router.put("/unban/:id", controller.UnbanUser);
router.delete("/delete/:id", controller.DeleteUser);

module.exports = router;
