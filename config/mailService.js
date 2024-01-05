const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tminhkhoa91@gmail.com', // Địa chỉ email của bạn
    pass: 'nnhp clix sqkn dlsd', // Mật khẩu của bạn
  },
});

const EmailService = async ({customerMail, token}) => {
  const mailOptions = {
    from: 'your_email@gmail.com', // Địa chỉ email người gửi
    to:customerMail, // Địa chỉ email người nhận
    subject:'TCG-Trading Card Games - Email Verification', // Chủ đề email
    html : `<h1>please click <a href="http://localhost:3000/register/verify/${token}">here</a> to verify your account</h1>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = EmailService;