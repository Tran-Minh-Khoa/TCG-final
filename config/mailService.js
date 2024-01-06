const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tminhkhoa91@gmail.com', // Địa chỉ email của bạn
    pass: 'nnhp clix sqkn dlsd', // Mật khẩu của bạn
  },
});

const EmailService = ({ customerMail, href, subject }) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'your_email@gmail.com', // Địa chỉ email người gửi
      to: customerMail, // Địa chỉ email người nhận
      subject: subject, // Chủ đề email
      html: `<h1>please click <a href="${href}">here</a> to verify your account</h1>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error); // Trả về lỗi nếu có lỗi xảy ra
      } else {
        console.log('Email sent:', info.response);
        resolve(info); // Trả về thông tin gửi email thành công
      }
    });
  });
};

module.exports = EmailService;