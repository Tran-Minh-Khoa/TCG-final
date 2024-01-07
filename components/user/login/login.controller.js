const User = require("../../../models/User");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const EmailService = require('../../../config/mailService');
function generateUniqueId(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}
exports.LoginPage = function (req, res, next) {
    const scripts = ["/scripts/login.js"];
    const styles = ["/styles/login.css"];
  
    res.render("user/login-page", {
      layout: "user/layouts/layout",
      title: "Login",
      scripts: scripts,
      styles: styles,
    });
};

exports.ForgetPasswordPage = function(req, res, next) {
  const scripts = ["/scripts/forget-password.js"];
  const styles = ["/styles/forget-password.css"];
  
  res.render("user/forget-password-page", {
    layout: "user/layouts/layout",
    title: "Forget password",
    scripts: scripts,
    styles: styles,
  });
}
exports.ResetPasswordPage = async(req, res, next) => {
  const token =req.params.token
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).send('Invalid or expired token');
  }
  const scripts = ["/scripts/reset-password.js"];
  const styles = ["/styles/forget-password.css"];
  
  res.render("user/reset-password-page", {
    layout: "user/layouts/layout",
    title: "Reset password",
    scripts: scripts,
    styles: styles,
  });
}
exports.ForgetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const id = generateUniqueId(email);

    // Kiểm tra xem email đã được sử dụng chưa
    const user = await User.findOne({ 'id': id });
    if (!user) {
      return res.status(400).send('This email has not been registered');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 3600000;

    // Lưu thông tin người dùng và gửi email xác nhận
    await user.save();

    // Gửi email xác nhận và đợi cho việc gửi email hoàn thành trước khi trả về status 200
    EmailService({ customerMail: email, href: `http://localhost:3000/login/reset-password/${token}`, subject: "TCG-Trading Card Games - Khôi phục mật khẩu" })
      .then(() => {
        return res.status(200).send('Please check your email to verify your account');
      })
      .catch((error) => {
        return res.status(500).send(error.message);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
exports.ResetPassword = async (req, res, next) => {
  try {
    const password = req.body.newPassword;
    const token = req.body.token;
    const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).send('Invalid or expired token');
    }
    user.emailVerificationExpires=undefined
    user.emailVerificationToken=undefined
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await user.save().then((user) => {
      console.log(user)
      req.logIn(user, function (err) {
          if (err) { return next(err); }
          return res.redirect('/account');
      })
  })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message);
  }
}
