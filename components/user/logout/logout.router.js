const express = require('express');
const passport = require('passport');
const router = express.Router();

;
router.get('/', function (req, res, next) {
 req.logOut(function(err){
   if (err) { return next(err); }
   return res.redirect('/');
 })
  })



module.exports = router;
