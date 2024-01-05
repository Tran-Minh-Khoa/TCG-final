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
router.post('/', function (req, res, next) {
  const name=req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const id = generateUniqueId(email);
  // Kiểm tra xem email đã được sử dụng chưa
  User.findOne({ 'id': id }).then((user) => {
    if (user) {
      return res.status(400).send('This email has already been registered');
    } else {

      // Tạo người dùng mới và lưu vào cơ sở dữ liệu
      const newUser = new User();
      newUser.id = id;
      newUser.name = name;
      newUser.email = email;
      console.log('name',name)
      newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const token = crypto.randomBytes(20).toString('hex');
      newUser.emailVerificationToken = token;
      newUser.emailVerificationExpires = Date.now() + 3600000; // 1 hour
      newUser.save().then((user) => {
        console.log(user);
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
        
        // Gửi email xác nhận
        EmailService({ customerMail: email, token: token });
        return res.redirect('/login');

      }).catch((err) => {
        return res.status(500).send(err);
      })
    }
  }).catch((err) => {
    return res.status(500).send(err);
  });;
}
)
router.get('/verify/:token', controller.Verify);

module.exports = router;
