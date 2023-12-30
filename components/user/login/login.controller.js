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