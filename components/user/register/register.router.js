const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const router = express.Router();
const User = require('../../../models/User');
function generateUniqueId(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
  }
router.post('/', function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const id= generateUniqueId(email);
    // Kiểm tra xem email đã được sử dụng chưa
    User.findOne({ 'id': id }).then((user) => {
      if (user) {
        return res.status(400).send('This email has already been registered');
      } else {
        
        // Tạo người dùng mới và lưu vào cơ sở dữ liệu
        const newUser = new User();
        newUser.id = id;
        newUser.email = email;
        newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        newUser.save().then((user) => {
          console.log(user);
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/account');
            ;
          })
          
        }).catch((err) => {
            return res.status(500).send(err);
        })
        }
      }).catch((err) => {
          return res.status(500).send(err);
        });;
      }
)

  
module.exports = router;
