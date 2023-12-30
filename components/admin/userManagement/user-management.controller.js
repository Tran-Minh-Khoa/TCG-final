exports.UserManagementPage = function (req, res, next) {
  const styles = [
    "/admin/vendor/datatables/dataTables.bootstrap4.min.css",
    "/styles/table.css",
  ];
  const scripts = [
    "/admin/js/table.js",
    "/admin/js/datatables/table-card.js",
    "/admin/vendor/datatables/jquery.dataTables.min.js",
    "/admin/vendor/datatables/dataTables.bootstrap4.min.js",
  ];
  res.render("admin/user", {
    layout: "admin/layouts/layout",
    title: "User Management",
    scripts: scripts,
    styles: styles,
  });
};