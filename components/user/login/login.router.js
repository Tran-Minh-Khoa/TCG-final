const express = require('express');
const passport = require('passport');
const router = express.Router();
const controller = require('./login.controller')
/* GET home page. */
router.get('/', controller.LoginPage);

/* GET forget password page */
router.get('/forget-password', controller.ForgetPasswordPage);
router.get('/reset-password/:token', controller.ResetPasswordPage);
// router.post('/', passport.authenticate('local-login'), function (req, res, next) {
//   console.log(req.user);
//   res.redirect('/');
// });
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
      return res.redirect('/account');
    });
  })(req, res, next);
}
);
router.get('/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/account',
  failureRedirect: '/login'
}));
router.post('/forget-password', controller.ForgetPassword);
router.post('/reset-password', controller.ResetPassword);
module.exports = router;
