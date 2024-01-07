function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Nếu đã đăng nhập, cho phép truy cập vào route tiếp theo
  }
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  res.status(400).redirect("/login");
}

module.exports = ensureAuthenticated;
