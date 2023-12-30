exports.DashboardPage = function (req, res, next) {
  const styles = ["/vendor/chart.js/Chart.min.js"];
  const scripts = [
    "/admin/vendor/chart.js/Chart.min.js",
    "/admin/js/demo/chart-area-demo.js",
    "/admin/js/demo/chart-pie-demo.js",
  ];
  res.render("admin/dashboard", {
    layout: "admin/layouts/layout",
    title: "Dashboard",
    styles: styles,
    scripts: scripts,
  });
};