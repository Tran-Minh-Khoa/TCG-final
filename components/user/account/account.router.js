const express = require('express');
const router = express.Router();
const controller = require('./account.controller')
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

/* GET account (orders) page. */
router.get('/', controller.AccountPage);
/* GET addresses page. */
router.get('/addresses', controller.AddressPage);  
router.post('/address/update', controller.AddressUserUpdate);
router.post('/address/add', controller.AddressUserAdd);
router.get('/get-address-detail/:id', controller.getAddressDetail)
router.get('/get-order-detail/:id', controller.getOrderDetail)
router.post('/password/update', controller.changePassword);
router.post('/profile/update',multerUpload.single("avatar"),controller.updateProfile);
module.exports = router;