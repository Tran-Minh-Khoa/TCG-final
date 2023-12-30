const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./auth.controller')

/* GET home page. */
router.get('/', controller.LoginPage);
router.get("/login", controller.LoginPage);
router.get('/register',controller.RegisterPage);
router.get("/logout", controller.Logout);


router.post('/', function (req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (err) {
      console.log('Error from server:', err); // Log error from server
      return res.status(500).send(err);
    }
    if (!user) {
      console.log('Error from user:', info.message); // Log error from user
      return res.status(400).send(info.message);
    }
    // NEED TO CALL req.login()!!!
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/admin/dashboard');
    });
  })(req, res, next);
}
);


module.exports = router;
