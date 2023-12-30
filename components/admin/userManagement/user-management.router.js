const express = require('express');
const router = express.Router();
const controller = require('./user-management.controller')
/* GET home page. */
router.get("/", controller.UserManagementPage);

module.exports = router;
