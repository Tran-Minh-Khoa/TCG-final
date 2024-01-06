const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const router = express.Router();
const User = require('../../../models/User');
const EmailService = require('../../../config/mailService');
const controller = require('./register.controler')
function generateUniqueId(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}
router.post('/', async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const id = generateUniqueId(email);

    const user = await User.findOne({ 'id': id });
    if (user) {
      return res.status(400).send('This email has already been registered');
    } else {
      const newUser = new User();
      newUser.id = id;
      newUser.name = name;
      newUser.email = email;
      newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const token = crypto.randomBytes(20).toString('hex');
      newUser.emailVerificationToken = token;
      newUser.emailVerificationExpires = Date.now() + 3600000;
      // req.logIn(user, function (err) {
        //   if (err) { return next(err); }
        //   const token = crypto.randomBytes(20).toString('hex');
        //   user.emailVerificationToken = token;
        //   user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
        //   // Gửi email xác nhận
        //   EmailService({ customerMail: email, token: token });
        //   return res.redirect('/login');
        //   ;
        // })
      const savedUser = await newUser.save();
      await EmailService({ customerMail: email, href: `http://localhost:3000/register/verify/${token}`, subject: "TCG-Trading Card Games - Email Verification" });

      return res.redirect('/login');
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get('/verify/:token', controller.Verify);

module.exports = router;
