const express = require("express");
const router = express.Router();
const controller = require("./sets.controller");

router.get("/", controller.SetPage);
router.get("/add", controller.SetAddPage);
router.post("/add/upload", controller.CreateSet);
router.get("/edit/:id", controller.SetEditPage);
router.put("/update/:setId", controller.UpdateSet);
router.put("/disable/:setId", controller.DisableSet);
router.put("/enable/:setId", controller.EnableSet);
router.delete("/delete/:setId", controller.DeleteSet);
module.exports = router;
