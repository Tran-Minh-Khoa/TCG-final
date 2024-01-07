const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var GoogleStrategy = require('passport-google-oidc');
const User = require('../models/User');
// Kích hoạt và sử dụng Passport trong ứng dụng
const EmailService = require('../config/mailService');
function generateUniqueId(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}
/// Cấu hình Passport Local Strategy cho đăng ký
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (email, password, done) => {
    console.log(email);
    console.log(password);
    const id = generateUniqueId(email);
    // Kiểm tra xem email đã được sử dụng chưa
    User.findOne({ 'id': id }).then((user) => {
      if (user) {
        return done(null, false, { message: 'This email has already been registered' });
      } else {

        // Tạo người dùng mới và lưu vào cơ sở dữ liệu
        const newUser = new User();
        newUser.id = id;
        newUser.email = email;
        newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        newUser.save().then(() => {
          console.log({ 'id': id, 'email': email });
        }).catch((err) => {
          console.log(err);
        })
        const token = crypto.randomBytes(20).toString('hex');
        user.emailVerificationToken = token;
        user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
        // Gửi email xác nhận
        EmailService({ customerMail: email, token: token });
        return done(null, newUser);
      }
    }).catch((err) => {
      return done(err);
    });;
  }
));

// Cấu hình Passport Local Strategy cho đăng nhập
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (email, password, done) => {
    console.log(email);
    console.log(password);
    const id = generateUniqueId(email);
    // Kiểm tra xem người dùng có tồn tại không
    User.findOne({ 'id': id }).then((user) => {
      if (!user) {
        console.log('Tài Khoảng không tồn tại.');
        return done(null, false, { message: 'This account doen\'t exist' });
      }
      if (user?.password) {
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Wrong password' });
        }
      }
      else {
        return done(null, false, { message: 'This account\'s password hasn\'t been set. Please use quick sign in instead' });
      }
      if(user.isBaned){
        return done(null, false, { message: 'Your account has been banned' });
      }
      if (!user.emailVerified ) {
        return done(null, false, { message: 'Please verify your email' });
      }
      console.log(user);
      return done(null, user);
    }).catch((err) => {
      return done(err);
    });
  }));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/login/oauth2/redirect/google',
  scope: ['profile', 'email'],
  prompt: 'select_account'
}, function verify(issuer, profile, done) {
  console.log(profile);
  const id = generateUniqueId(profile.emails[0].value);
  // Kiểm tra xem email đã được sử dụng chưa
  User.findOne({ 'id': id }).then((user) => {
    if (user) {
      if(user.isBaned){
        return done(null, false, { message: 'Your account has been banned' });
      }
      return done(null, user);
    } else {

      // Tạo người dùng mới và lưu vào cơ sở dữ liệu
      const newUser = new User();
      newUser.id = id;
      newUser.email = profile.emails[0].value;
      newUser.googleId = profile.id;
      newUser.save().then(() => {
        console.log({ 'id': id, 'email': email });
      }).catch((err) => {
        console.log(err);
      })
      return done(null, newUser);
    }
  }).catch((err) => {
    return done(err);
  });;
  // return cb(null, profile);

}));
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log('serializeUser');
    console.log(user);
    return cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    // console.log('deserializeUser');
    // console.log(user);
    return cb(null, user);
  });
});