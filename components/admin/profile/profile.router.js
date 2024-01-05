const express = require("express");
const router = express.Router();
const controller = require("./profile.controller");
const multer = require("multer");

router.get("/", controller.ProfileEditPage);
module.exports = router;
