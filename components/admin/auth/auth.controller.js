exports.LoginPage = (req, res, next) => {
  res.render("admin/login", {
    layout: "admin/layouts/simple-layout",
    title: "Login",
  });
};


exports.RegisterPage = (req, res, next) => {
  res.render('admin/register', { layout: 'admin/layouts/simple-layout', title: 'Register'}
)};


exports.Logout = (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/admin");
  });
};