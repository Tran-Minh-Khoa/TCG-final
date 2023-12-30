function checkAdminAuth(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
            // User has admin role, proceed to the next middleware or route
            return next();
        } else {
            // User doesn't have admin role, redirect to the login page
            return res.redirect('/admin/login');
        };
    }

    res.status(400).redirect('/admin/login');
  }

module.exports = checkAdminAuth